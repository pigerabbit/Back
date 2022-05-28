import { GroupModel } from "../schemas/group";

class Group {
  static async create({ newGroup }) {
    const createdNewGroup = await GroupModel.create(newGroup);
    return createdNewGroup;
  }

  static async findByGroupId({ groupId }) {
    const GroupInfo = await GroupModel.findOne({ groupId });
    return GroupInfo;
  }

  static async updateAll({ groupId, setter }) {
    const updatedGroup = await GroupModel.findOneAndUpdate(
      { groupId },
      { $set: setter },
      { returnOriginal: false }
    );
    return updatedGroup;
  }

  static async findAll({ productId }) {
    const groups = await GroupModel.find({ productId });
    return groups;
  }
}

export { Group };
