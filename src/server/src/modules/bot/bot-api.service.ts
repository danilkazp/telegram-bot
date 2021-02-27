import BotModule from 'modules/bot/bot.module'

class BotApiService {
  constructor(private readonly bot: BotModule) {
    this.bot = bot;
  }

  sendMessage = (...args) => {
    this.bot.telegramBot.sendMessage(...args)
  }
}

export default BotApiService
