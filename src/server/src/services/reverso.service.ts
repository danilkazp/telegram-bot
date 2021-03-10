import Reverso from 'reverso-api'

class ReversoService {
  api: any

  constructor() {
    this.api = new Reverso()
  }

  getTranslation = async (textToTranslate: string): Promise<any> => {
    return await this.api.getTranslation(textToTranslate, 'English', 'Russian')
  }
}
export default ReversoService
