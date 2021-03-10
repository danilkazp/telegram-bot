import BotModule from 'modules/bot/bot.module'
import {
  getInlineKeyboards,
  getInlineKeyboardsPagination,
} from 'modules/bot/utils/bot.utils'

import Message from 'src/decorators/message.decorator'
import OnAction from 'src/decorators/on-action.decorator'
import OnText from 'src/decorators/on-text.decorator'

const messages = {
  getPhrasesList: 'Get phrases list',
  getPhrase: 'Get phrase',
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

  [callbackQueryHandlers.handleGetPhrase](query) {
    console.log('###-query', query)
    const callbackQueryText = query.data.replace(
      matchTextBetweenSquareBrackets,
      '',
    )

    console.log('###-callbackQueryText', callbackQueryText)
  }

  [callbackQueryHandlers.handlePhrasesPagination](query) {
    console.log('###-query', query)
    const { chat, message_id } = query.message
    const callbackQueryText = query.data.replace(
      matchTextBetweenSquareBrackets,
      '',
    )
    this.bot.services.botApiService.editMessageText('Выберете шаблон', {
      chat_id: chat.id,
      message_id: message_id,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Пустой шаблон №1',
              callback_data: COMMAND_TEMPLATE1,
            },
            {
              text: 'Пустой шаблон №2',
              callback_data: COMMAND_TEMPLATE2,
            },
          ],
        ],
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

    this.bot.services.botApiService.sendMessage(msg.chat.id, 'Your phrases:', {
      reply_markup: {
        inline_keyboard: phrasesInlineKeywords,
      },
    })
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
