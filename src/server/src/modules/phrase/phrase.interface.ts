export interface IPhrase {
  _id?: number
  userId: number
  text: string
  translation: string[]
  examples: []
}

export interface IPagination {
  offset: number
  limit: number
}


export interface IPhraseExample {
  from: string
  to: string
}