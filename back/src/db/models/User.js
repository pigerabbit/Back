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
        businessName: true,
        type: true,
      }
    );
    return users;
  }

  static async findById({ userId }) {
    const user = await UserModel.findOne({ id: userId }).lean();

    return user;
  }

  static async updateAll({ userId, setter }) {
    const updatedUser = await UserModel.findOneAndUpdate(
      { id: userId },
      { $set: setter },
      { returnOriginal: false }
    );
    return updatedUser;
  }

  static async findByName({ name }) {
    const user = await UserModel.findOne({ name });
    return user;
  }

  static async getAlertList({ userId }) {
    const alertList = await UserModel.find({ userId })
      .select('alert');
    
    return alertList;
  }
}
