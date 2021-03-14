export interface IUserContext {
  handlerForNextMessage?: string
  phraseId?: number
}

export interface IUser {
  id: number
  firstName: string
  lastName: string
  userName: string
  context: IUserContext
}
