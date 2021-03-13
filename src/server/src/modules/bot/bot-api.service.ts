import BotModule from 'modules/bot/bot.module'

class BotApiService {
  constructor(private readonly bot: BotModule) {
    this.bot = bot
  }

  sendMessage = (...args) => {
    return this.bot.telegramBot.sendMessage(...args)
  }

  editMessageText = (...args) => {
    return this.bot.telegramBot.editMessageText(...args)
  }
}

export default BotApiService
