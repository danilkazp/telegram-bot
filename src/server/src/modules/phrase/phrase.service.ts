import { botHandlers } from 'modules/bot/bot.constants'
import {
  getInlineKeyboardsPagination,
  getPageByPagination,
  getReplayMockup,
} from 'modules/bot/utils/bot.utils'
import { PhraseDto } from 'modules/phrase/dto/phrase.dto'
import { defaultPagination } from 'modules/phrase/phrase.constants'
import { IPagination, IPhrase } from 'modules/phrase/phrase.interface'
import { PhraseRepository } from 'modules/phrase/phrase.repository'
import TranslatorModule from 'modules/translator/translator.module'

class PhraseService {
  constructor(
    private readonly phraseRepository: PhraseRepository,
    private readonly translatorModule: TranslatorModule,
  ) {
    this.phraseRepository = phraseRepository
    this.translatorModule = translatorModule
  }

  createOne = async (text: string, userId: number): Promise<IPhrase> => {
    const translateResult = await this.translatorModule.translate(text)
    const { translation, examples } = translateResult
    const phraseDto = {
      text,
      translation,
      examples,
      userId,
    }

    return await this.phraseRepository.create(phraseDto)
  }

  updateOne = async (phraseDto: PhraseDto): Promise<IPhrase> => {
    return await this.phraseRepository.updateOne(phraseDto)
  }

  findItem = async (phraseDto?: PhraseDto): Promise<IPhrase> => {
    // TODO: create notFound fallback
    return await this.phraseRepository.item(phraseDto)
  }

  findList = async (
    phraseDto?: PhraseDto,
    pagination?: IPagination,
  ): Promise<IPhrase[]> => {
    return await this.phraseRepository.list(phraseDto, pagination)
  }

  getCount = async (phraseDto?: PhraseDto): Promise<number> => {
    return await this.phraseRepository.getCount(phraseDto)
  }

  getPhrasesInlineKeywords = async (
    phraseDto,
    phraseListPagination = defaultPagination,
  ) => {
    const { limit } = phraseListPagination
    const phrasesCount = await this.getCount(phraseDto)
    const currentPage = getPageByPagination(phraseListPagination)
    const allPages = +(phrasesCount / limit).toFixed(0)

    const foundPhrases = await this.findList(phraseDto, phraseListPagination)
    const foundPhrasesList = foundPhrases.map((phrase) => {
      return {
        text: phrase.text,
        callback_data: `[${botHandlers.handleGetPhrase}]` + phrase.text,
      }
    })
    const phrasesInlineKeyboards = getReplayMockup(foundPhrasesList, 1)

    return [
      ...phrasesInlineKeyboards,
      getInlineKeyboardsPagination(currentPage, allPages),
    ]
  }
}

export default PhraseService
