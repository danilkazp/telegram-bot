import { uniq as _uniq } from 'lodash'

import {
  getGoogleCorrectedText,
  getReversoExamples,
  getUniqTranslation,
} from 'modules/translator/translator.utils'

import GoogleTranslateService from 'src/services/google-translate.service'
import ReversoService from 'src/services/reverso.service'

class TranslatorModule {
  reversoTranslator: any
  googleTranslator: any

  constructor() {
    this.reversoTranslator = new ReversoService()
    this.googleTranslator = new GoogleTranslateService()
  }

  translate = async (textToTranslate: string) => {
    const googleTranslatorResult = await this.googleTranslator.getTranslation(
      textToTranslate,
    )
    const correctedText = getGoogleCorrectedText(googleTranslatorResult)
    // TODO: handle not found with incorrect text
    const reversoResult = await this.reversoTranslator.getTranslation(
      correctedText || textToTranslate,
    )
    const examples = getReversoExamples(reversoResult)
    const uniqReversoTranslation = getUniqTranslation(reversoResult.translation)

    return {
      translation: getUniqTranslation([
        ...uniqReversoTranslation,
        googleTranslatorResult.text,
      ]),
      examples,
    }
  }
}

export default TranslatorModule
