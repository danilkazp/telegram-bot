import BotModule from 'modules/bot/bot.module'
import { getPaginationByPage } from 'modules/bot/utils/bot.utils'
import { formatPhraseForSend } from 'modules/phrase/utils/phrase.utils'

import Message from 'src/decorators/message.decorator'
import OnAction from 'src/decorators/on-action.decorator'
import OnText from 'src/decorators/on-text.decorator'

const messages = {
  getPhrasesList: 'Get phrases list',
  getPhrase: 'Get phrase',
}

const titles = {
  phrasesList: 'Your phrases:',
}

export const callbackQueryHandlers = {
  handleGetPhrase: 'handleGetPhrase',
  handlePhrasesPagination: 'handlePhrasesPagination',
}

const matchTextBetweenSquareBrackets = /\[(.*)\]/

class BotController {
  constructor(private readonly bot: BotModule) {
    this.bot = bot
  }

  @OnText(/\/start/)
  handleStartMessage(msg) {
    this.bot.services.botApiService.sendMessage(msg.chat.id, 'Welcome', {
      reply_markup: {
        keyboard: [[messages.getPhrasesList, messages.getPhrase]],
      },
    })
  }

  @OnAction('callback_query')
  handleCallbackQuery(query) {
    const callbackQueryHandler = query.data.match(
      matchTextBetweenSquareBrackets,
    )[1]

    this[callbackQueryHandler](query)
  }

  async [callbackQueryHandlers.handleGetPhrase](query) {
    const { data, message } = query
    const callbackQueryText = data.replace(matchTextBetweenSquareBrackets, '')
    const { phraseService } = this.bot.phraseModule
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

  async [callbackQueryHandlers.handlePhrasesPagination](query): Promise<any> {
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

  @Message('Hello')
  handleHelloMessage(msg) {
    this.bot.services.botApiService.sendMessage(
      msg.chat.id,
      `Hello ${msg.chat.username}`,
    )
  }

  @Message(messages.getPhrasesList)
  async handleGetListMessage(msg) {
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

  @Message(messages.getPhrase)
  async handleGetPhraseMessage(msg) {
    const { id: userId } = msg.from
    const { phraseModule } = this.bot
    const { phraseService } = phraseModule
    const foundPhrase = await phraseService.findItem({ userId })

    const phraseMsg = `**${foundPhrase.text}**`
    let translatingMsg = `Translation:`

    foundPhrase.translation.forEach((translatedText) => {
      translatingMsg += '\n - ' + translatedText
    })

    const messagesToSent = [phraseMsg, translatingMsg]
    messagesToSent.forEach((messageToSent) => {
      this.bot.services.botApiService.sendMessage(msg.chat.id, messageToSent)
    })
  }

  handleNotMatchedMessages = async (msg) => {
    if (msg.text.startsWith('/')) return

    const { phraseModule } = this.bot
    const { phraseService } = phraseModule

    await phraseService.createOne(msg.text, msg.from.id)
    this.bot.services.botApiService.sendMessage(msg.chat.id, 'Saved')
  }
}

export default BotController
