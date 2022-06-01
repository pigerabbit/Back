import { GroupModel } from "../schemas/group";

class Group {
  static async create({ newGroup }) {
    const createdNewGroup = await GroupModel.create(newGroup);
    return createdNewGroup;
  }

  static async findByGroupId({ groupId }) {
    const groupInfo = await GroupModel.findOne({ groupId });
    return groupInfo;
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

  /** 공동구매 개수를 기준으로 내림차순 정렬한 상품들 리스트
   *
   * @returns productList
   */
  static async findProductSearchSortByGroups({ search, page, perPage }) {
    const productList = await ProductModel.find({ name: { $regex: search } })
      .sort({ groups: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean();

    productList = await GroupModel.aggregate([
      {
        $group: {
          _id: "$productId",
          total_pop: { $sum: 1 },
        },
      },
    ]);

    // 내림차순 정렬 함수
    productList = productList.sort((a, b) => {
      return b.total_pop - a.total_pop;
    });

    return productList;
  }

  static async findAllbyBoolean({ userId, boolean }) {
    const listWhenOwner = await GroupModel.find({
      participants: {
        $elemMatch: { userId: userId, manager: boolean },
      },
    });
    return listWhenOwner;
  }
}

export { Group };
