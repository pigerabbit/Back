import { Group, Product, User } from "../db";
import crypto from "crypto";
import { GroupModel } from "../db/schemas/group";
import { nowDate } from "../utils/date-calculator.js";
import { ToggleModel } from "../db/schemas/toggle.js";
import { withToggleInfo } from "../utils/withToggleInfo";

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
    const { minPurchaseQty } = await Product.findProduct({ id: productId });
    const remainedPersonnel = minPurchaseQty - quantity;
    const product = await Product.findProduct({ id: productId });
    const productInfo = product._id;

    if (remainedPersonnel < 0) {
      const errorMessage = "구매할 수 있는 양을 초과하였습니다.";
      return { errorMessage };
    }

    const participants = {
      participantId: participantId,
      userId: userId,
      participantDate: nowDate(),
      quantity: quantity,
      payment: false,
      complete: false,
      manager: true,
      review: false,
    };

    const newGroup = {
      productInfo,
      groupId,
      groupName,
      groupType,
      location,
      deadline,
      participants,
      productId,
      state,
      remainedPersonnel,
    };

    const createdNewGroup = await Group.create({ newGroup });

    return createdNewGroup;
  }
  /// 여기서부터
  static async setQuantity({ groupId, userId, quantity }) {
    let groupInfo = await Group.findByGroupId({ groupId });

    if (!groupInfo) {
      const errorMessage =
        "정보가 없습니다. groupId 값을 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    let participantsInfo = groupInfo.participants;
    let newValue = {};
    let priorQuantity = 0;

    const index = participantsInfo.findIndex((f) => f.userId === userId);

    if (index > -1) {
      priorQuantity = participantsInfo[index].quantity;
      participantsInfo[index]["quantity"] = quantity;
    } else {
      const errorMessage =
        "참여중인 공동구매가 아닙니다. groupId 값을 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    const updatedRemainedPersonnel =
      groupInfo.remainedPersonnel + priorQuantity - quantity;

    if (updatedRemainedPersonnel < 0) {
      const errorMessage = "구매할 수 있는 양을 초과하였습니다.";
      return { errorMessage };
    }

    newValue = participantsInfo;

    const updatedParticipants = await GroupModel.findOneAndUpdate(
      { groupId },
      {
        $set: {
          participants: newValue,
          remainedPersonnel: updatedRemainedPersonnel,
        },
      },
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
      const errorMessage =
        "참여중인 공동구매가 아닙니다. groupId 값을 다시 한 번 확인해 주세요.";
      return { errorMessage };
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

  static async getGroupInfo({ userId, groupId }) {
    const group = await Group.findByGroupId({ groupId });

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!group) {
      const errorMessage =
        "해당 그룹은 생성 내역이 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    const toggleInfo = await ToggleModel.findOne({ userId });

    if (!toggleInfo) {
      const errorMessage =
        "userId에 대한 토글 데이터가 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    return withToggleInfo(toggleInfo.groups, [group]);
  }

  static async getGroupByProductId({ userId, productId }) {
    const groups = await Group.findAllByProductId({ productId });

    const toggleInfo = await ToggleModel.findOne({ userId });

    if (!toggleInfo) {
      const errorMessage =
        "userId에 대한 토글 데이터가 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    return withToggleInfo(toggleInfo.groups, groups);
  }

  static async getNumberInfoByGroupId({ groupId }) {
    const group = await Group.findByGroupId({ groupId });

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!group) {
      const errorMessage =
        "해당 그룹은 생성 내역이 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }
    console.log("group:", group);
    const productId = group.productId;

    const product = await Product.findProduct({ id: productId });
    console.log("product:", product);

    const participants = group.participants;
    const numberOfParticipants = participants.length;
    const minPurchaseQty = product.minPurchaseQty;
    const maxPurchaseQty = product.maxPurchaseQty;

    const info = {
      numberOfParticipants,
      minPurchaseQty,
      maxPurchaseQty,
    };

    return info;
  }

  static async getListbyBoolean({ userId, boolean }) {
    const groups = await Group.findAllbyBoolean({ userId, boolean });

    if (!groups) {
      const errorMessage = "아이디를 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    const toggleInfo = await ToggleModel.findOne({ userId });

    if (!toggleInfo) {
      const errorMessage =
        "userId에 대한 토글 데이터가 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    return withToggleInfo(toggleInfo.groups, groups);
  }

  static async addParticipants({ userId, groupId, quantity }) {
    const groupInfo = await Group.findByGroupId({ groupId });

    if (!groupInfo) {
      const errorMessage = "groupId에 대한 groupInfo가 존재하지 않습니다.";
      return { errorMessage };
    }

    let participantsInfo = groupInfo.participants;
    let newValue = {};

    const index = participantsInfo.findIndex((f) => f.userId === userId);

    if (index > -1) {
      const errorMessage = "이미 공동구매에 참여하고 있는 상태입니다.";
      return { errorMessage };
    } else {
      const participantId = crypto.randomUUID();
      const participant = {
        participantId: participantId,
        userId: userId,
        participantDate: nowDate(),
        quantity: quantity,
        payment: false,
        complete: false,
        manager: false,
        review: false,
      };

      participantsInfo.push(participant);
    }

    const updatedRemainedPersonnel = groupInfo.remainedPersonnel - quantity;

    if (updatedRemainedPersonnel < 0) {
      const errorMessage = "구매할 수 있는 양을 초과하였습니다.";
      return { errorMessage };
    }

    newValue = participantsInfo;
    const updatedParticipants = await GroupModel.findOneAndUpdate(
      { groupId },
      {
        $set: {
          participants: newValue,
          remainedPersonnel: updatedRemainedPersonnel,
        },
      },
      { returnOriginal: false }
    );

    return updatedParticipants;
  }

  static async deleteParticipant({ userId, groupId }) {
    const groupInfo = await Group.findByGroupId({ groupId });

    if (!groupInfo) {
      const errorMessage = "groupId에 대한 groupInfo가 존재하지 않습니다.";
      return { errorMessage };
    }

    let participantsInfo = groupInfo.participants;
    let newValue = {};
    let updatedRemainedPersonnel;
    const index = participantsInfo.findIndex((f) => f.userId === userId);

    if (index > -1) {
      // 배열에서 index의 원소를 제거
      if (participantsInfo[index].manager === true) {
        await GroupModel.findOneAndUpdate(
          { groupId },
          { $set: { state: "-1" } },
          { returnOriginal: false }
        );
      }
      updatedRemainedPersonnel =
        groupInfo.remainedPersonnel + participantsInfo[index].quantity;

      participantsInfo.splice(index, 1);
    } else {
      const errorMessage = "이미 공동구매 참여자가 아닙니다.";
      return { errorMessage };
    }

    if (updatedRemainedPersonnel < 0) {
      const errorMessage = "구매할 수 있는 양을 초과하였습니다.";
      return { errorMessage };
    }

    newValue = participantsInfo;
    const updatedParticipants = await GroupModel.findOneAndUpdate(
      { groupId },
      {
        $set: {
          participants: newValue,
          remainedPersonnel: updatedRemainedPersonnel,
        },
      },
      { returnOriginal: false }
    );

    return updatedParticipants;
  }

  static async getStateInfo({ groupId, userId }) {
    const groupInfo = await Group.findByGroupId({ groupId });

    if (!groupInfo) {
      const errorMessage = "groupId에 대한 groupInfo가 존재하지 않습니다.";
      return { errorMessage };
    }

    let participantsInfo = groupInfo.participants;
    const index = participantsInfo.findIndex((f) => f.userId === userId);

    let stateInfo = {};
    if (index > -1) {
      stateInfo = {
        state: groupInfo.state,
        payment: participantsInfo[index].payment,
      };
    } else {
      stateInfo = { state: -1 };
    }

    return stateInfo;
  }

  static async checkState({ groupId }) {
    const groupInfo = await Group.findByGroupId({ groupId });

    if (!groupInfo) {
      const errorMessage = "groupId에 대한 groupInfo가 존재하지 않습니다.";
      return { errorMessage };
    }

    const checkState = groupInfo.state;

    return checkState;
  }

  static async getSortedGroupsByRemainedTimeInfo(userId) {
    const groups = await Group.findSortedGroupsByRemainedTimeInfo();

    const toggleInfo = await ToggleModel.findOne({ userId });

    if (!toggleInfo) {
      const errorMessage =
        "userId에 대한 토글 데이터가 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    return withToggleInfo(toggleInfo.groups, groups);
  }

  static async getSortedGroupsByRemainedPersonnelInfo(userId) {
    const groups = await Group.findSortedGroupsByRemainedPersonnelInfo();

    const toggleInfo = await ToggleModel.findOne({ userId });

    if (!toggleInfo) {
      const errorMessage =
        "userId에 대한 토글 데이터가 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    return withToggleInfo(toggleInfo.groups, groups);

    return groups;
  }

  static async deleteProduct({ id, product }) { 
    const participants = await Group.findParticipantsByProductId({ productId: id });

    participants.map((v) => {
      const firstList = v;
      firstList.map(async (v) => {
        await User.updateAlert({
          userId: v.userId,
          from: "group",
          sendId: product.id,
          image: product.images,
          type: v.groupType,
          groupName: v.groupName,
          content: `판매자의 판매 중단으로 공동구매가 취소되었습니다.`,
        });
      })
    });
  }
}
