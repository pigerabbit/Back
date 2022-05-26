import { GroupModel } from "../schemas/group";

class Group {
  static async create({ newGroup }) {
    const createdNewGroup = await GroupModel.create(newGroup);
    return createdNewGroup;
  }

  static async findByGroupId({ group_id }) {
    const GroupInfo = await GroupModel.findOne({ group_id });
    return GroupInfo;
  }

  static async updateAll({ group_id, setter }) {
    const updatedGroup = await GroupModel.findOneAndUpdate(
      { group_id },
      { $set: setter },
      { returnOriginal: false }
    );
    return updatedGroup;
  }
}

export { Group };
