import { Group } from "../db";
import crypto from "crypto";
import { GroupModel } from "../db/schemas/group";
import { nextThreeDay } from "../utils/date-calculator.js";

export class groupService {
  static async addGroup({
    userId,
    groupType,
    groupName,
    location,
    productId,
    state,
  }) {
    const groupId = crypto.randomUUID();
    const deadline = nextThreeDay();
    let participants = userId;
    console.log("userId:", userId);
    console.log("participants:", participants);

    const newGroup = {
      groupId,
      groupName,
      groupType,
      location,
      deadline,
      participants,
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

  static async getGroupByProductId({ productId }) {
    const groups = await Group.findAll({ productId });
    return groups;
  }
}
