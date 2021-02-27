import BotModule from 'modules/bot/bot.module'

import Message from 'src/decorators/message.decorator'
import OnText from 'src/decorators/on-text.decorator'

const messages = {
  getPhrasesList: 'Get words list',
}

class BotController {
  constructor(private readonly bot: BotModule) {
    this.bot = bot
  }

  @OnText(/\/start/)
  handleStartMessage(msg) {
    this.bot.services.botApiService.sendMessage(msg.chat.id, 'Welcome', {
      reply_markup: {
        keyboard: [[messages.getPhrasesList]],
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
    const { phraseModule } = this.bot
    const { phraseService } = phraseModule
    const foundPhrases = await phraseService.list()

    foundPhrases.map(({ text }) => {
      this.bot.services.botApiService.sendMessage(msg.chat.id, text)
    })
  }

  handleNotMatchedMessages = async (msg) => {
    if (msg.text.startsWith('/')) return

    const { phraseModule } = this.bot
    const { phraseService } = phraseModule

    await phraseService.create(msg.text)
    this.bot.services.botApiService.sendMessage(msg.chat.id, 'Saved')
  }
}

export default BotController
