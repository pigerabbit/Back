import { AuthEmailModel } from "../schemas/authEmail";

export class AuthEmail {
  static async create(newAuthEmail) {
    const createdNewAuthEmail = await AuthEmailModel.create(newAuthEmail);
    return createdNewAuthEmail;
  }

  static async updateAll({ email, setter }) {
    const updatedUser = await AuthEmailModel.findOneAndUpdate(
      { email },
      { $set: setter },
      { returnOriginal: false }
    );
    return updatedUser;
  }
  static async findByEmail({ email }) {
    const AuthEmail = await AuthEmailModel.findOne({ email });
    return AuthEmail;
  }
  static async isAuthenticated({ email }) {
    return await AuthEmailModel.exists({ email, status: 1 });
  }
}
