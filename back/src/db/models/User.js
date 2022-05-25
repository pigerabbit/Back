import { UserModel } from "../schemas/user";

export class User {
  static async create({ newUser }) {
    const createdNewUser = await UserModel.create(newUser);
    return createdNewUser;
  }

  static async findById({ user_id }) {
    const user = await UserModel.findOne({ id: user_id }).lean();

    return user;
  }

  static async findAll() {
    //회원탈퇴한 유저는 제외
    const users = await UserModel.find(
      { deleted: false },
      {
        _id: false,
        id: true,
        email: true,
        name: true,
        location: true,
        distance: true,
        business: true,
        address: true,
        imageLink: true,
      }
    );
    return users;
  }

  static async updateAll({ user_id, setter }) {
    const updatedUser = await UserModel.findOneAndUpdate(
      { id: user_id },
      { $set: setter },
      { returnOriginal: false }
    );
    return updatedUser;
  }

  static async findByEmail({ email, type }) {
    const user = await UserModel.findOne({ email, type });
    return user;
  }

  static async deleteById({ user_id }) {
    const user = await UserModel.deleteOne({ id: user_id });
    return user;
  }

  static async isEmailExists({ email, type }) {
    return await UserModel.exists({ email, type });
  }
}
