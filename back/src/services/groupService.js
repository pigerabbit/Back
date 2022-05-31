import { Group, Product } from "../db";
import crypto from "crypto";
import { GroupModel } from "../db/schemas/group";
import { nextThreeDay, nowDay } from "../utils/date-calculator.js";

export class groupService {
  static async addGroup({
    userId,
    groupType,
    groupName,
    location,
    productId,
    state,
    deadline,
    quantity,
  }) {
    const groupId = crypto.randomUUID();
    const participantId = crypto.randomUUID();
    const participants = {
      participantId: participantId,
      userId: userId,
      participantDate: nowDay(),
      quantity: quantity,
      payment: false,
      complete: false,
    };

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

  static async setQuantity({ groupId, userId, quantity }) {
    let groupInfo = await Group.findByGroupId({ groupId });

    if (!groupInfo) {
      const errorMessage =
        "정보가 없습니다. groupId 값을 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    let participantsInfo = groupInfo.participants;
    let newValue = {};

    const index = participantsInfo.findIndex((f) => f.userId === userId);

    if (index > -1) {
      participantsInfo[index]["quantity"] = quantity;
    } else {
      const participant = {
        userId: userId,
        participantDate: nowDay(),
        quantity: quantity,
        payment: false,
        complete: false,
      };
      participantsInfo.push(participant);
    }
    newValue = participantsInfo;
    const updatedParticipants = await GroupModel.findOneAndUpdate(
      { groupId },
      { $set: { participants: newValue } },
      { returnOriginal: false }
    );

    return updatedParticipants;
  }

  static async setPayment({ groupId, userId, payment }) {
    let groupInfo = await Group.findByGroupId({ groupId });

    if (!groupInfo) {
      const errorMessage =
        "정보가 없습니다. groupId 값을 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    let participantsInfo = groupInfo.participants;
    let newValue = {};

    const index = participantsInfo.findIndex((f) => f.userId === userId);

    if (index > -1) {
      participantsInfo[index]["payment"] = payment;
    } else {
      const participantInfo = {
        ...participantInfo,
        payment: true,
      };
      participantsInfo.push(participant);
    }
    newValue = participantsInfo;
    const updatedParticipants = await GroupModel.findOneAndUpdate(
      { groupId },
      { $set: { participants: newValue } },
      { returnOriginal: false }
    );

    return updatedParticipants;
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
        "해당 그룹은 생성 내역이 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }
    return group;
  }

  static async getGroupByProductId({ productId }) {
    const groups = await Group.findAll({ productId });
    return groups;
  }

  static async getNumberInfoByGroupId({ groupId }) {
    const group = await Group.findByGroupId({ groupId });

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!group) {
      const errorMessage =
        "해당 그룹은 생성 내역이 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    const productId = group.productId;
    console.log("productId:", productId);
    const product = await Product.findProduct({ id: productId });
    console.log("product:", product);

    const participants = group.participants;
    const numberOfParticipants = participants.length;
    const minPurchaseQty = product.minPurchaseQty;
    const maxPurchaseQty = product.maxPurchaseQty;

    console.log("numberOfParticipants:", numberOfParticipants);
    console.log("minPurchaseQty:", minPurchaseQty);

    const info = {
      numberOfParticipants,
      minPurchaseQty,
      maxPurchaseQty,
    };

    return info;
  }
}
