import { Group } from "../db";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { nextTick } from "process";
import { GroupModel } from "../db/schemas/group";

export class groupService {
  static async addGroup({ groupType, groupName, location, deadline, productId, state }) {
    const groupId = crypto.randomUUID();

    const newGroup = {
      groupId,
      groupName,
      groupType,
      location,
      deadline,
      productId,
      state,
    };

    const createdNewGroup = await Group.create({ newGroup });

    return createdNewGroup;
  }

  static async setParticipants({ groupId, toUpdate }) {
    let groupInfo = await Group.findByGroupId({ groupId });
    console.log("groupInfo:", groupInfo);
    if (!groupInfo) {
      const errorMessage =
        "정보가 없습니다. groupId 값을 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    let participantsInfo = groupInfo.participants;
    let newValue = {};

    const index = participantsInfo.findIndex((f) => f === toUpdate.userId);
    console.log("index:", index);
    if (index > -1) {
      participantsInfo.splice(index, 1);
    } else {
      participantsInfo.push(toUpdate.userId);
    }
    newValue = participantsInfo;
    const updatedParticipants = await GroupModel.findOneAndUpdate(
      { groupId },
      { $set: { participants: newValue } },
      { returnOriginal: false }
    );

    return updatedParticipants;
  }

  static async setNotPaid({ groupId, toUpdate }) {
    let groupInfo = await Group.findByGroupId({ groupId });

    if (!groupInfo) {
      const errorMessage =
        "정보가 없습니다. groupId 값을 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    let notPaidInfo = groupInfo.notPaid;
    let newValue = {};

    const index = notPaidInfo.findIndex((f) => f === toUpdate.userId);

    if (index > -1) {
      notPaidInfo.splice(index, 1);
    } else {
      notPaidInfo.push(toUpdate.userId);
    }
    newValue = notPaidInfo;
    const updatedNotPaid = await GroupModel.findOneAndUpdate(
      { groupId },
      { $set: { notPaid: newValue } },
      { returnOriginal: false }
    );

    return updatedNotPaid;
  }

  static async getParticipants({ groupId }) {
    const groupInfo = await Group.findByGroupId({ groupId });
    if (!groupInfo) {
      const errorMessage = "groupId에 대한 groupInfo가 존재하지 않습니다.";
      return { errorMessage };
    }

    const participants = groupInfo.participants;

    return participants;
  }

  static async getNotPaid({ groupId }) {
    const groupInfo = await Group.findByGroupId({ groupId });
    if (!groupInfo) {
      const errorMessage = "groupId에 대한 groupInfo가 존재하지 않습니다.";
      return { errorMessage };
    }

    const notPaid = groupInfo.notPaid;

    return notPaid;
  }

  static async setGroup({ groupId, toUpdate }) {
    let group = await Group.findByGroupId({ groupId });

    if (!group) {
      const errorMessage = "그룹 아이디를 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    const updatedGroup = await Group.updateAll({ groupId, setter: toUpdate });
    return updatedGroup;
  }

  static async getGroupInfo({ groupId }) {
    const group = await Group.findByGroupId({ groupId });

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!group) {
      const errorMessage =
        "해당 유저는 가입 내역이 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }
    return group;
  }

  /** 공동구매 개수를 기준으로 내림차순 정렬한 상품들 리스트
   *
   * @returns productList
   */
  static async findProductList() {
    let productList = await GroupModel.aggregate([
      {
        $group: {
          _id: "$productId",
          total_pop: { $sum: 1 },
        },
      },
    ]);

    productList = productList.sort((a, b) => {
      return b.total_pop - a.total_pop;
    });

    return productList.slice(0, 10);
  }

  static async getGroups() {
    const groups = await Group.findAll();
    return groups;
  }
}
