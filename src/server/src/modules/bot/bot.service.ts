class BotService {
  constructor(private readonly bot) {
    this.bot = bot;
  }

  saveNewPhrase = (msg) => {
    console.log('###-save new phrase', msg)
  }
}

export default BotService
