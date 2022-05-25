import { UserModel } from "../schemas/user";

export class User {
  static async create({ newUser }) {
    const createdNewUser = await UserModel.create(newUser);
    return createdNewUser;
  }

  static async isEmailExists({ email, type }) {
    return await UserModel.exists({ email, type });
  }

  static async findByEmail({ email, type }) {
    const user = await UserModel.findOne({ email, type });
    return user;
  }

  static async findAll() {
    //회원탈퇴한 유저는 제외
    const users = await UserModel.find(
      { deleted: false },
      {
        _id: false,
        id: true,
        name: true,
        email: true,
        address: true,
        business: true,
        type: true,
      }
    );
    return users;
  }

  static async findById({ user_id }) {
    const user = await UserModel.findOne({ id: user_id }).lean();

    return user;
  }

  static async updateAll({ user_id, setter }) {
    const updatedUser = await UserModel.findOneAndUpdate(
      { id: user_id },
      { $set: setter },
      { returnOriginal: false }
    );
    return updatedUser;
  }

  static async findByName({ name }) {
    const user = await UserModel.findOne({ name });
    return user;
  }
}
