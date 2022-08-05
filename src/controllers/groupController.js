import { groupService } from "../services/groupService";
import { addressToXY } from "../utils/addressToXY.js";

const groupController = {
  // 공구를 생성하는 함수
  createGroup: async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const {
        groupType,
        groupName,
        location,
        productId,
        deadline,
        quantity,
        paymentMethod,
      } = req.body;

      const newGroup = await groupService.addGroup({
        userId,
        groupType,
        groupName,
        location,
        productId,
        deadline,
        quantity,
        paymentMethod,
      });

      if (newGroup.errorMessage) {
        throw new Error(newGroup.errorMessage);
      }

      const body = {
        success: true,
        payload: newGroup,
      };

      return res.status(201).json(body);
    } catch (error) {
      next(error);
    }
  },

  // 공구의 수량 값을 변경하는 함수
  updateQuantity: async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const groupId = req.params.groupId;
      const quantity = req.body.quantity;

      const checkState = await groupService.checkState({ groupId });
      
      if (checkState === -1) {
        const errorMessage = "모집 실패 (State: -1)";
        throw new Error(errorMessage);
      }

      const updatedGroupInfo = await groupService.setQuantity({
        userId,
        groupId,
        quantity,
      });

      if (updatedGroupInfo.errorMessage) {
        throw new Error(updatedGroupInfo.errorMessage);
      }

      const body = {
        success: true,
        payload: updatedGroupInfo,
      };

      return res.status(201).json(body);
    } catch (error) {
      next(error);
    }
  },

  // 특정 아이디의 지불 여부를 변경하는 함수
  updatePayment: async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const groupId = req.params.groupId;
      const payment = req.body.payment;
      const paymentMethod = req.body.paymentMethod;

      const checkState = await groupService.checkState({ groupId });

      if (checkState === -1) {
        const errorMessage = "모집 실패 (State: -1)";
        throw new Error(errorMessage);
      }

      const updatedGroupInfo = await groupService.setPayment({
        userId,
        groupId,
        payment,
        paymentMethod,
      });

      if (updatedGroupInfo.errorMessage) {
        throw new Error(updatedGroupInfo.errorMessage);
      }

      const body = {
        success: true,
        payload: updatedGroupInfo,
      };

      return res.status(201).json(body);
    } catch (error) {
      next(error);
    }
  },

  // 특정 아이디의 리뷰 여부를 변경하는 함수
  updateReview: async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const groupId = req.params.groupId;
      const review = req.body.review;

      if (!review) {
        const errorMessage = "review 작성 여부(true/false)를 입력해주세요.";
        throw new Error(errorMessage);
      }

      const checkState = await groupService.checkState({ groupId });

      if (checkState === -1) {
        const errorMessage = "모집 실패 (State: -1)";
        throw new Error(errorMessage);
      }

      const updatedGroupInfo = await groupService.setReview({
        userId,
        groupId,
        review,
      });

      if (updatedGroupInfo.errorMessage) {
        throw new Error(updatedGroupInfo.errorMessage);
      }

      const body = {
        success: true,
        payload: updatedGroupInfo,
      };

      res.status(201).json(body);
    } catch (error) {
      next(error);
    }
  },

  // (공구 수량 값, 지불 여부, 리뷰 여부) 이외의 공동구매 정보 변경
  updateGroup: async (req, res, next) => {
    try {
      const groupId = req.params.groupId;
      const groupType = req.body.groupType ?? null;
      const groupName = req.body.groupName ?? null;
      const location = req.body.location ?? null;
      const deadline = req.body.deadline ?? null;
      const productId = req.body.productId ?? null;
      const state = req.body.state ?? null;

     const checkState = await groupService.checkState({ groupId });

      if (checkState === -1) {
        const errorMessage = "모집 실패 (State: -1)";
        throw new Error(errorMessage);
      }
      
      const coordinates = await addressToXY(location);
      const toUpdate = {
        groupType,
        groupName,
        location,
        locationXY: {
          type: "Point",
          coordinates,
        },
        deadline,
        productId,
        state,
      };

      const updatedGroup = await groupService.setGroup({ groupId, toUpdate });

      if (updatedGroup.errorMessage) {
        throw new Error(updatedGroup.errorMessage);
      }

      const body = {
        success: true,
        payload: updatedGroup,
      };

      return res.status(201).json(body);
    } catch (error) {
      next(error);
    }
  },

  // (공동구매 아이디를 통해) 공동구매를 검색하는 함수
  getGroup: async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const groupId = req.params.groupId;
      const groupInfo = await groupService.getGroupInfo({ userId, groupId });

      if (groupInfo.errorMessage) {
        throw new Error(groupInfo.errorMessage);
      }

      const body = {
        success: true,
        payload: groupInfo,
      };

      return res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  },

  // 상품에 대한 모든 공동구매들을 반환하는 함수
  getGroupsByProductId: async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const productId = req.params.productId;
      const state = req.query.state ?? null;

      const groupList = await groupService.getGroupByProductId({
        userId,
        productId,
        state,
      });

      const body = {
        success: true,
        payload: groupList,
      };

      return res.status(200).send(body);
    } catch (error) {
      next(error);
    }
  },

  // 공동구매의 숫자 정보들을 반환하는 함수
  getGroupsByNumberInfo: async (req, res, next) => {
    try {
      const groupId = req.params.groupId;
      const numberInfo = await groupService.getNumberInfoByGroupId({ groupId });

      const body = {
        success: true,
        payload: numberInfo,
      };

      return res.status(200).send(body);
    } catch (error) {
      next(error);
    }
  },

  // 특정 조건(router 주석 참조)을 만족하는 공동구매를 반환하는 함수
  getGroupsByIsManager: async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const boolean = req.params.boolean;
      const grouplist = await groupService.getListbyBoolean({
        userId,
        boolean,
      });

      const body = {
        success: true,
        payload: grouplist,
      };

      return res.status(200).send(body);
    } catch (error) {
      next(error);
    }
  },

  // 공동구매에 참가자를 추가하는 함수
  updateParticipateIn: async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const groupId = req.params.groupId;
      const { quantity, paymentMethod } = req.body;

      const checkState = await groupService.checkState({ groupId });
      if (checkState === -1) {
        const errorMessage = "모집 실패 (State: -1)";
        throw new Error(errorMessage);
      }

      const UpdatedGroup = await groupService.addParticipants({
        userId,
        groupId,
        quantity,
        paymentMethod,
      });

      if (UpdatedGroup.errorMessage) {
        throw new Error(UpdatedGroup.errorMessage);
      }

      const body = {
        success: true,
        payload: UpdatedGroup,
      };

      return res.status(201).json(body);
    } catch (error) {
      next(error);
    }
  },

  // 공동구매에서 참가자를 내보내는 함수
  updateParticipateOut: async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const groupId = req.params.groupId;

      const checkState = await groupService.checkState({ groupId });
      if (checkState === -1) {
        const errorMessage = "모집 실패 (State: -1)";
        throw new Error(errorMessage);
      }

      const UpdatedGroup = await groupService.deleteParticipant({
        userId,
        groupId,
      });

      if (UpdatedGroup.errorMessage) {
        throw new Error(UpdatedGroup.errorMessage);
      }

      const body = {
        success: true,
        payload: UpdatedGroup,
      };

      return res.status(204).json(body);
    } catch (error) {
      next(error);
    }
  },

  // 공동구매 상태값을 확인하는 함수
  getGroupStateInfo: async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const groupId = req.params.groupId;
      const stateInfo = await groupService.getStateInfo({ groupId, userId });

      if (stateInfo.errorMessage) {
        throw new Error(stateInfo.errorMessage);
      }

      const body = {
        success: true,
        payload: stateInfo,
      };

      return res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  },

  // 마감 기한이 24시간 이내인 공동구매를 오름차순으로 정렬하는 함수
  getGroupsByRemainedTime: async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const groupList = await groupService.getSortedGroupsByRemainedTimeInfo(
        userId
      );

      const body = {
        success: true,
        payload: groupList,
      };

      return res.status(200).send(body);
    } catch (error) {
      next(error);
    }
  },

  // 모집 인원이 3명 이하인 공동구매를 오름차순 정렬하는 함수
  getGroupsByRemainedPersonnel: async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const groupList = await groupService.getSortedGroupsByRemainedPersonnelInfo(userId);

      const body = {
        success: true,
        payload: groupList,
      };

      return res.status(200).send(body);
    } catch (error) {
      next(error);
    }
  },

  // 반경 5km 이내 공동구매 오름차순 정렬
  getGroupsByLocations: async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const distanceOption = req.query.option ?? "5000";
      const groupList = await groupService.findNearGroupList({ userId, distanceOption });

      if (!groupList.data) {
        const body = {
          success: true,
          data: groupList.data,
          payload: groupList.groupList,
        };

        return res.status(200).send(body);
      }

      const body = {
        success: true,
        data: true,
        payload: groupList,
      };

      res.status(200).send(body);
    } catch (error) {
      next(error);
    }
  },

  // 공동구매를 논리 삭제하는 함수
  deleteGroup: async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const groupId = req.params.groupId;

      const checkState = await groupService.checkState({ groupId });
      if (checkState === -1) {
        const errorMessage = "모집 실패 (State: -1)";
        throw new Error(errorMessage);
      }

      const UpdatedGroup = await groupService.deleteGroup({
        userId,
        groupId,
      });

      if (UpdatedGroup.errorMessage) {
        throw new Error(UpdatedGroup.errorMessage);
      }

      const body = {
        success: true,
        payload: UpdatedGroup,
      };

      return res.status(204).json(body);
    } catch (error) {
      next(error);
    }
  },
};

export { groupController };
