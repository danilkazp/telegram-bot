import { Model, MongooseFilterQuery, QueryUpdateOptions } from 'mongoose'

export class PhraseRepository {

  constructor(
    private readonly phraseModel
  ) {
    this.phraseModel = phraseModel
  }
  //
  // private notFound(): void {
  //   notFoundResponse('User not found');
  // }
  //
  async create(phraseDto): Promise<any> {
    return await this.phraseModel.create(phraseDto);
  }

  async list(phraseDto?): Promise<any> {
    return await this.phraseModel.find(phraseDto);
  }
  //
  // async getList(
  //   userFilterQuery?: UserDto | MongooseFilterQuery<any>,
  // ): Promise<IUser[]> {
  //   const users = await this.userModel.find(userFilterQuery);
  //   return users;
  // }
  //
  // async findOne(
  //   userFilterQuery: IUser | MongooseFilterQuery<any>,
  //   throwNotFound = true,
  // ): Promise<IUser> {
  //   const foundUser = await this.userModel.findOne(userFilterQuery);
  //   if (throwNotFound && !foundUser) this.notFound();
  //
  //   return foundUser;
  // }
  //
  // async findById(id: string): Promise<IUser | void> {
  //   const medicalCategory = await this.userModel.findById(id);
  //   if (!medicalCategory) this.notFound();
  //
  //   return medicalCategory;
  // }
  //
  // async findByEmail(email: string, throwNotFound = true): Promise<IUser> {
  //   const user = await this.userModel.findOne({ email });
  //   if (throwNotFound && !user) this.notFound();
  //
  //   return user;
  // }
  //
  // async getCountDocuments<T>(criterias: T): Promise<number> {
  //   const count = await this.userModel.countDocuments(criterias);
  //   return count;
  // }
  //
  // async update(
  //   userFilterQueryDto: UserDto | MongooseFilterQuery<any>,
  //   updateUserDto: UserDto | MongooseFilterQuery<any>,
  //   options?: QueryUpdateOptions,
  // ): Promise<IUser | void> {
  //   const updatedUser = await this.userModel.findOneAndUpdate(
  //     userFilterQueryDto,
  //     updateUserDto,
  //     { new: true, ...options },
  //   );
  //   if (!updatedUser) this.notFound();
  //
  //   return updatedUser;
  // }
  //
  // async updateById(
  //   id: string,
  //   updateUserDto: UserDto | MongooseFilterQuery<any>,
  // ): Promise<IUser | void> {
  //   const updatedUser = await this.update(
  //     {
  //       _id: id,
  //     },
  //     updateUserDto,
  //   );
  //
  //   return updatedUser;
  // }
}
