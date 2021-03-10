import BotModule from 'modules/bot/bot.module'
import { PhraseRepository } from 'modules/phrase/phrase.repository'
import { Phrase } from 'modules/phrase/phrase.schema'
import PhraseService from 'modules/phrase/phrase.service'

class PhraseModule {
  phraseService: PhraseService
  phraseRepository: PhraseRepository

  constructor(private readonly bot: BotModule) {
    this.bot = bot
    this.init()
  }

  init(): void {
    this.phraseRepository = new PhraseRepository(Phrase)
    this.phraseService = new PhraseService(
      this.phraseRepository,
      this.bot.translatorModule,
    )
  }
}
export default PhraseModule
