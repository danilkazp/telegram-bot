import { UserDto } from 'modules/user/dto/user.dto'
import { IUser } from 'modules/user/user.inteface'

export class UserRepository {
  constructor(private readonly userModel) {
    this.userModel = userModel
  }

  private notFound(): string {
    return 'User not found'
  }

  async create(userDto: UserDto): Promise<IUser> {
    return await this.userModel.create(userDto)
  }

  async update(userDto: UserDto): Promise<IUser> {
    return await this.userModel.updateOne(userDto)
  }

  async item(userDto?: UserDto): Promise<IUser> {
    return await this.userModel.findOne(userDto)
  }

  async getCount(userDto?: UserDto): Promise<number> {
    return await this.userModel.count(userDto)
  }

  // async list(userDto?, pagination?: IPagination): Promise<IUser[]> {
  //   if (pagination) {
  //     return await this.userModel
  //       .find(userDto)
  //       .skip(pagination.offset)
  //       .limit(pagination.limit)
  //   }
  //
  //   return await this.userModel.find(userDto)
  // }
}
