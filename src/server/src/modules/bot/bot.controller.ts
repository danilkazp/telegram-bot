import { botHandlers, commands, titles } from 'modules/bot/bot.constants'
import { IBotMsg, IBotQuery } from 'modules/bot/bot.interface'
import BotModule from 'modules/bot/bot.module'
import {
  getCallbackQueryHandler,
  getPaginationByPage,
  getReplayMockup,
  getStartMarkup,
} from 'modules/bot/utils/bot.utils'
import { matchTextBetweenSquareBrackets } from 'modules/phrase/phrase.constants'
import { formatPhraseForSend } from 'modules/phrase/utils/phrase.utils'
import { IUser, IUserContext } from 'modules/user/user.inteface'

import Message from 'src/decorators/message.decorator'
import OnAction from 'src/decorators/on-action.decorator'
import OnText from 'src/decorators/on-text.decorator'

class BotController {
  constructor(private readonly bot: BotModule) {
    this.bot = bot
  }

  @OnText(/\/start/)
  async handleStartMessage(msg: IBotMsg): Promise<void> {
    const { id, last_name, first_name, username } = msg.chat
    const userDto = {
      id,
      firstName: first_name,
      lastName: last_name,
      userName: username,
    }
    await this.bot.userModule.userService.saveUser(userDto)
    this.bot.services.botApiService.sendMessage(msg.chat.id, 'Welcome', {
      reply_markup: getStartMarkup(),
    })
  }

  @OnAction('callback_query')
  handleCallbackQuery(query: IBotQuery): void {
    const callbackQueryHandler = getCallbackQueryHandler(query)

    this[callbackQueryHandler](query)
  }

  @Message('Hello')
  handleHelloMessage(msg: IBotMsg): void {
    this.bot.services.botApiService.sendMessage(
      msg.chat.id,
      `Hello ${msg.chat.username}`,
    )
  }

  @Message(commands.settings)
  handleSettingsMessage(msg: IBotMsg): void {
    this.bot.services.botApiService.sendMessage(msg.chat.id, 'Your settings', {
      reply_markup: {
        keyboard: getReplayMockup(
          [commands.editPhrase, commands.backToHome],
          1,
        ),
      },
    })
  }

  @Message(commands.backToHome)
  handleBackToHomeMessage(msg: IBotMsg): void {
    this.bot.services.botApiService.sendMessage(msg.chat.id, titles.home, {
      reply_markup: getStartMarkup(),
    })
  }

  @Message(commands.editPhrase)
  async handleEditPhraseMessage(msg: IBotMsg): Promise<void> {
    await this.bot.userModule.userService.updateOne({
      id: msg.chat.id,
      context: {
        handlerForNextMessage: botHandlers.handleEnterPhraseToEdit,
      },
    })
    this.bot.services.botApiService.sendMessage(
      msg.chat.id,
      titles.enterPhraseToEdit,
    )
  }

  @Message(commands.getPhrasesList)
  async handleGetListMessage(msg: IBotMsg): Promise<void> {
    const { id: userId } = msg.from
    const { phraseModule } = this.bot
    const { phraseService } = phraseModule
    const phrasesInlineKeywords = await phraseService.getPhrasesInlineKeywords({
      userId,
    })

    this.bot.services.botApiService.sendMessage(
      msg.chat.id,
      titles.phrasesList,
      {
        reply_markup: {
          inline_keyboard: phrasesInlineKeywords,
        },
      },
    )
  }

  async [botHandlers.handleGetPhrase](query: IBotQuery): Promise<void> {
    const { phraseService } = this.bot.phraseModule
    const { data, message } = query
    const callbackQueryText = data.replace(matchTextBetweenSquareBrackets, '')
    const foundPhrase = await phraseService.findItem({
      text: callbackQueryText,
    })
    console.log('###-foundPhrase', foundPhrase)
    console.log('###-callbackQueryText', callbackQueryText)

    const editPhraseActions = [
      {
        text: 'Edit',
        callback_data: `[${botHandlers.handleSelectedPhraseEdit}]${foundPhrase.text}`,
      },
      {
        text: 'Remove',
        callback_data: `[${botHandlers.handlePhraseRemove}]${foundPhrase.text}`,
      },
    ]
    this.bot.services.botApiService.sendMessage(
      message.chat.id,
      formatPhraseForSend(foundPhrase),
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: getReplayMockup(editPhraseActions, 2),
        },
      },
    )
  }

  async [botHandlers.handleSelectedPhraseEdit](
    query: IBotQuery,
  ): Promise<void> {
    // TODO: create method getQueryData or getQueryValue / getQueryHandler
    const phraseToEdit = query.data.replace(matchTextBetweenSquareBrackets, '')

    await this.sendPhraseEditActions(phraseToEdit, query.message)
  }

  async [botHandlers.handlePhrasesPagination](query: IBotQuery): Promise<void> {
    const { chat, message_id } = query.message
    const { phraseService } = this.bot.phraseModule
    // TODO: create method getQueryData or getQueryValue / getQueryHandler
    const nextPage = +query.data.replace(matchTextBetweenSquareBrackets, '')
    const nextPagePagination = getPaginationByPage(nextPage)
    const phrasesInlineKeywords = await phraseService.getPhrasesInlineKeywords(
      {
        userId: chat.id,
      },
      nextPagePagination,
    )

    this.bot.services.botApiService.editMessageText(titles.phrasesList, {
      chat_id: chat.id,
      message_id: message_id,
      reply_markup: {
        inline_keyboard: phrasesInlineKeywords,
      },
    })
  }

  sendPhraseEditActions = async (
    phraseToEdit: string,
    msg: IBotMsg,
  ): Promise<void> => {
    const phraseEditActions = [
      {
        text: 'Translation',
        callback_data: `[${botHandlers.handlePhraseTranslationEdit}]${phraseToEdit}`,
      },
      {
        text: 'Examples',
        callback_data: `[${botHandlers.handlePhraseExamplesEdit}]${phraseToEdit}`,
      },
    ]
    await this.bot.userModule.userService.clearContext(msg.chat.id)
    this.bot.services.botApiService.sendMessage(
      msg.chat.id,
      titles.selectPhrasePartToEdit,
      {
        reply_markup: {
          inline_keyboard: getReplayMockup(phraseEditActions, 2),
        },
      },
    )
  }

  async [botHandlers.handleEnterPhraseToEdit](msg: IBotMsg): Promise<void> {
    const phraseToEdit = msg.text
    const foundPhrase = await this.bot.phraseModule.phraseService.findItem({
      text: phraseToEdit,
    })
    if (!foundPhrase) {
      this.bot.services.botApiService.sendMessage(
        msg.chat.id,
        titles.phaseNotFound,
      )
    } else {
      await this.sendPhraseEditActions(phraseToEdit, msg)
    }
  }

  async [botHandlers.handlePhraseTranslationEdit](
    query: IBotQuery,
  ): Promise<void> {
    console.log('###-', query)
    const { message } = query
    // TODO: create method getQueryData or getQueryValue / getQueryHandler
    const phraseToEditTranslation = query.data.replace(
      matchTextBetweenSquareBrackets,
      '',
    )
    const foundPhrase = await this.bot.phraseModule.phraseService.findItem({
      text: phraseToEditTranslation,
    })

    const helperText = 'Send your new translation. Current translation: \n'

    this.bot.services.botApiService.sendMessage(
      message.chat.id,
      helperText + foundPhrase.translation,
    )
    await this.bot.userModule.userService.updateOne({
      id: message.chat.id,
      context: {
        handlerForNextMessage: botHandlers.handleNewPhraseTranslationEntered,
        phraseId: foundPhrase._id,
      },
    })
  }

  async [botHandlers.handleNewPhraseTranslationEntered](
    msg: IBotMsg,
    contextParams: IUserContext,
  ): Promise<void> {
    const userId = msg.chat.id

    await this.bot.phraseModule.phraseService.updateOne({
      id: contextParams.phraseId,
      translation: [msg.text],
    })
    await this.bot.userModule.userService.clearContext(userId)
    this.bot.services.botApiService.sendMessage(
      msg.chat.id,
      'Phrase translation successfully updated!',
    )
  }

  [botHandlers.handlePhraseExamplesEdit](query: IBotQuery) {}

  handleNotMatchedMessages = async (msg: IBotMsg): Promise<void> => {
    if (msg.text.startsWith('/')) return

    const { phraseModule } = this.bot
    const { phraseService } = phraseModule
    const userId = msg.from.id
    const userContext = await this.bot.userModule.userService.getContext(userId)
    if (userContext) {
      const { handlerForNextMessage, ...contextParams } = userContext

      this[handlerForNextMessage](msg, contextParams)
    } else {
      // TODO: name this method
      await phraseService.createOne(msg.text, msg.from.id)
      this.bot.services.botApiService.sendMessage(msg.chat.id, 'Saved')
    }
  }
}

export default BotController
