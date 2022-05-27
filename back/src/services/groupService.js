import { Group } from "../db";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { nextTick } from "process";
import { GroupModel } from "../db/schemas/group";

export class groupService {
  static async addGroup({ group_type, location, deadline, product_id, state }) {
    const group_id = crypto.randomUUID();

    const newGroup = {
      group_id,
      group_type,
      location,
      deadline,
      product_id,
      state,
    };

    const createdNewGroup = await Group.create({ newGroup });

    return createdNewGroup;
  }

  static async setParticipants({ group_id, toUpdate }) {
    let groupInfo = await Group.findByGroupId({ group_id });
    console.log("groupInfo:", groupInfo);
    if (!groupInfo) {
      const errorMessage =
        "정보가 없습니다. group_id 값을 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    let participantsInfo = groupInfo.participants;
    let newValue = {};

    const index = participantsInfo.findIndex((f) => f === toUpdate.user_id);
    console.log("index:", index);
    if (index > -1) {
      participantsInfo.splice(index, 1);
    } else {
      participantsInfo.push(toUpdate.user_id);
    }
    newValue = participantsInfo;
    const updatedParticipants = await GroupModel.findOneAndUpdate(
      { group_id },
      { $set: { participants: newValue } },
      { returnOriginal: false }
    );

    return updatedParticipants;
  }

  static async setNotPaid({ group_id, toUpdate }) {
    let groupInfo = await Group.findByGroupId({ group_id });

    if (!groupInfo) {
      const errorMessage =
        "정보가 없습니다. group_id 값을 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    let notPaidInfo = groupInfo.not_paid;
    let newValue = {};

    const index = notPaidInfo.findIndex((f) => f === toUpdate.user_id);

    if (index > -1) {
      notPaidInfo.splice(index, 1);
    } else {
      notPaidInfo.push(toUpdate.user_id);
    }
    newValue = notPaidInfo;
    const updatedNotPaid = await GroupModel.findOneAndUpdate(
      { group_id },
      { $set: { not_paid: newValue } },
      { returnOriginal: false }
    );

    return updatedNotPaid;
  }

  static async getParticipants({ group_id }) {
    const groupInfo = await Group.findByGroupId({ group_id });
    if (!groupInfo) {
      const errorMessage = "group_id에 대한 groupInfo가 존재하지 않습니다.";
      return { errorMessage };
    }

    const participants = groupInfo.participants;

    return participants;
  }

  static async getNotPaid({ group_id }) {
    const groupInfo = await Group.findByGroupId({ group_id });
    if (!groupInfo) {
      const errorMessage = "group_id에 대한 groupInfo가 존재하지 않습니다.";
      return { errorMessage };
    }

    const notPaid = groupInfo.not_paid;

    return notPaid;
  }

  static async setGroup({ group_id, toUpdate }) {
    let group = await Group.findByGroupId({ group_id });

    if (!group) {
      const errorMessage = "그룹 아이디를 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    const updatedGroup = await Group.updateAll({ group_id, setter: toUpdate });
    return updatedGroup;
  }

  static async getGroupInfo({ group_id }) {
    const group = await Group.findByGroupId({ group_id });

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!group) {
      const errorMessage =
        "해당 유저는 가입 내역이 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }
    return group;
  }

  /** 전체 상품 반환 함수
   *
   * @returns productList
   */
  static async findProductList() {
    let productList = await GroupModel.aggregate([
      {
        $group: {
          _id: "$product_id",
          total_pop: { $sum: 1 },
        },
      },
    ]);

    productList = productList.sort((a, b) => {
      return b.total_pop - a.total_pop;
    });

    return productList;
  }

  static async getGroups() {
    const groups = await Group.findAll();
    return groups;
  }
}
