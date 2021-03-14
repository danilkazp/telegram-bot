import { UserContextDto, UserDto } from 'modules/user/dto/user.dto'
import { IUser, IUserContext } from 'modules/user/user.inteface'
import { UserRepository } from 'modules/user/user.repository'

class UserService {
  constructor(private readonly userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  saveUser = async (userDto: UserDto): Promise<void> => {
    const isUserExist = await this.findItem(userDto)

    if (!isUserExist) {
      await this.createOne(userDto)
    }
  }

  createOne = async (userDto: UserDto): Promise<IUser> => {
    return await this.userRepository.create(userDto)
  }

  clearContext = async (userId: number): Promise<IUser> => {
    return await this.updateOne({
      id: userId,
      context: new UserContextDto(),
    })
  }

  getContext = async (userId: number): Promise<IUserContext> => {
    const foundUser = await this.userRepository.item({ id: userId })
    return foundUser.context
  }

  updateOne = async (userDto: UserDto): Promise<IUser> => {
    return await this.userRepository.update(userDto)
  }

  findItem = async (userDto?: UserDto): Promise<IUser> => {
    return await this.userRepository.item(userDto)
  }

  // findList = async (userDto?, pagination?: IPagination) => {
  //   return await this.userRepository.list(userDto, pagination)
  // }

  getCount = async (userDto?: UserDto): Promise<number> => {
    return await this.userRepository.getCount(userDto)
  }
}

export default UserService
