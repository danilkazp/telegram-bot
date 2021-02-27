import { PhraseRepository } from 'modules/phrase/phrase.repository'

class PhraseService {
  constructor(private readonly phraseRepository: PhraseRepository) {
    this.phraseRepository = phraseRepository
  }

  create = async (text: string) => {
    const phraseDto = { text }

    return await this.phraseRepository.create(phraseDto)
  }

  list = async (phraseDto?) => {
    return await this.phraseRepository.list(phraseDto)
  }
}

export default PhraseService
