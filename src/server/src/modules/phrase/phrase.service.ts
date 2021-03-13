import { callbackQueryHandlers } from 'modules/bot/bot.constants'
import {
  getReplayMockup,
  getInlineKeyboardsPagination,
  getPageByPagination,
} from 'modules/bot/utils/bot.utils'
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

  findItem = async (phraseDto?) => {
    return await this.phraseRepository.item(phraseDto)
  }

  findList = async (phraseDto?, pagination?: IPagination) => {
    return await this.phraseRepository.list(phraseDto, pagination)
  }

  getCount = async (phraseDto?) => {
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
        callback_data:
          `[${callbackQueryHandlers.handleGetPhrase}]` + phrase.text,
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
