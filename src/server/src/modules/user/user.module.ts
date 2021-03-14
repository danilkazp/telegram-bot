import BotModule from 'modules/bot/bot.module'
import { UserRepository } from 'modules/user/user.repository'
import { User } from 'modules/user/user.schema'
import UserService from 'modules/user/user.service'

class UserModule {
  userService: UserService
  userRepository: UserRepository

  constructor(private readonly bot: BotModule) {
    this.bot = bot
    this.init()
  }

  init(): void {
    this.userRepository = new UserRepository(User)
    this.userService = new UserService(this.userRepository)
  }
}
export default UserModule
