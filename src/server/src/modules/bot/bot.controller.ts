import {
  callbackQueryHandlers,
  commands,
  titles,
} from 'modules/bot/bot.constants'
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

import Message from 'src/decorators/message.decorator'
import OnAction from 'src/decorators/on-action.decorator'
import OnText from 'src/decorators/on-text.decorator'

class BotController {
  constructor(private readonly bot: BotModule) {
    this.bot = bot
  }

  @OnText(/\/start/)
  handleStartMessage(msg: IBotMsg): void {
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
        keyboard: getReplayMockup([commands.editPhrase, commands.backToHome], 1),
      },
    })
  }

  @Message(commands.backToHome)
  handleBackToHomeMessage(msg: IBotMsg): void {
    this.bot.services.botApiService.sendMessage(msg.chat.id, titles.home, {
      reply_markup: getStartMarkup(),
    })
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

  async [callbackQueryHandlers.handleGetPhrase](
    query: IBotQuery,
  ): Promise<void> {
    const { phraseService } = this.bot.phraseModule
    const { data, message } = query
    const callbackQueryText = data.replace(matchTextBetweenSquareBrackets, '')
    const foundPhrase = await phraseService.findItem({
      text: callbackQueryText,
    })

    this.bot.services.botApiService.sendMessage(
      message.chat.id,
      formatPhraseForSend(foundPhrase),
      {
        parse_mode: 'HTML',
      },
    )
  }

  async [callbackQueryHandlers.handlePhrasesPagination](
    query: IBotQuery,
  ): Promise<void> {
    const { chat, message_id } = query.message
    const { phraseService } = this.bot.phraseModule
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

  handleNotMatchedMessages = async (msg: IBotMsg): Promise<void> => {
    if (msg.text.startsWith('/')) return

    const { phraseModule } = this.bot
    const { phraseService } = phraseModule

    await phraseService.createOne(msg.text, msg.from.id)
    this.bot.services.botApiService.sendMessage(msg.chat.id, 'Saved')
  }
}

export default BotController
