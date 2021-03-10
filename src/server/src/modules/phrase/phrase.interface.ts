export interface IPhrase {
  userId: number
  text: string
  translation: string[]
  examples: []
}

export interface IPagination {
  offset: number
  limit: number
}
