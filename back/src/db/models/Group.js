import { GroupModel } from "../schemas/group";
import { nextOneDay, nowDate } from "../../utils/date-calculator.js";

class Group {
  static async create({ newGroup }) {
    const createdNewGroup = await GroupModel.create(newGroup);
    return createdNewGroup;
  }

  static async findByGroupId({ groupId }) {
    const groupInfo = await GroupModel.findOne({ groupId })
      .populate("productInfo")
      .lean();
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

  static async findAllByProductId({ productId }) {
    const groups = await GroupModel.find({ productId })
      .populate("productInfo")
      .lean();
    return groups;
  }

  static async findSortedGroupsByRemainedTimeInfo() {
    const groups = await GroupModel.find({
      $and: [
        {},
        {
          deadline: {
            $gte: nowDate(),
            $lte: nextOneDay(),
          },
        },
      ],
    })
      .populate("productInfo")
      .sort({ deadline: 1 })
      .lean();

    return groups;
  }

  static async findSortedGroupsByRemainedPersonnelInfo() {
    const groups = await GroupModel.find({
      $and: [
        {},
        {
          state: 0,
        },
      ],
    })
      .populate("productInfo")
      .sort({ remainedPersonnel: 1 })
      .lean();

    return groups;
  }

  /** 공동구매 개수를 기준으로 내림차순 정렬한 상품들 리스트
   *
   * @returns productList
   */
  static async findProductSortByGroups() {
    let productList = await GroupModel.aggregate([
      {
        $match: { state: 0 },
      },
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
    })
      .populate("productInfo")
      .lean();
    return listWhenOwner;
  }

  static async findParticipantsByGroupId({ groupId }) {
    const groupInfo = await GroupModel.find(
      { groupId: groupId },
      "participants"
    ).lean();

    const participantsList = groupInfo.map((v) => {
      const firstList = v.participants;
      const secondList = firstList.map((v) => {
        const userId = v.userId;
        return userId;
      });
      return secondList;
    });

    return participantsList[0];
  }

  static async findParticipantsByProductId({ productId }) {
    const groupInfo = await GroupModel.find(
      { productId: productId },
    )
      .lean();
    
    let participantsList = [];
    participantsList.push(
      groupInfo.map((v) => {
        const groupType = v.groupType;
        const groupName = v.groupName;
        const firstList = v.participants;
        const secondList = firstList.map((v) => {
          const userId = v.userId;
          return { groupType, groupName, userId };
        });
        return secondList;
      })
    );

    return participantsList[0];
  }
}

export { Group };
