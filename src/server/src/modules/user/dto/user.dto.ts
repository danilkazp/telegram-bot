export class UserContextDto {
  handlerForNextMessage?: string
  phraseId?: number
}

export class UserDto {
  id?: number
  firstName?: string
  lastName?: string
  userName?: string
  context?: UserContextDto
}
