import { translate as googleTranslate } from 'google-translate-api-browser'

class GoogleTranslateService {
  getTranslation = async (textToTranslate: string): Promise<any> => {
    const googleResult = await googleTranslate(textToTranslate, { to: 'ru' })

    return googleResult
  }
}

export default GoogleTranslateService
