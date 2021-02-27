import { PhraseRepository } from 'modules/phrase/phrase.repository'
import { Phrase } from 'modules/phrase/phrase.schema'
import PhraseService from 'modules/phrase/phrase.service'

class PhraseModule {
  phraseService: PhraseService
  phraseRepository: PhraseRepository

  constructor() {
    this.init()
  }

  init() {
    this.phraseRepository = new PhraseRepository(Phrase)
    this.phraseService = new PhraseService(this.phraseRepository)
  }
}
export default PhraseModule
