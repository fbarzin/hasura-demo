import { plainToClass } from 'class-transformer';

export class UserModel {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;

  static fromJson(json: any): UserModel | PromiseLike<UserModel> {
    return plainToClass(UserModel, json);
  }
}
