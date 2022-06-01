import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { groupService } from "../services/groupService";

const groupRouter = Router();
// 공동구매 생성
groupRouter.post("/groups", login_required, async function (req, res, next) {
  try {
    const userId = req.currentUserId;
    const {
      groupType,
      groupName,
      location,
      productId,
      state,
      deadline,
      quantity,
    } = req.body;

    const newGroup = await groupService.addGroup({
      userId,
      groupType,
      groupName,
      location,
      productId,
      state,
      deadline,
      quantity,
    });

    if (newGroup.errorMessage) {
      throw new Error(newGroup.errorMessage);
    }

    const body = {
      success: true,
      payload: newGroup,
    };
    res.status(200).json(body);
  } catch (error) {
    next(error);
  }
});

// 특정 아이디의 구매 수량 변경
groupRouter.put(
  "/groups/:groupId/quantity",
  login_required,
  async function (req, res, next) {
    try {
      const userId = req.currentUserId;
      const groupId = req.params.groupId;
      const quantity = req.body.quantity;

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

      res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  }
);

// 특정 아이디의 지불 여부 변경
groupRouter.put(
  "/groups/:groupId/payment",
  login_required,
  async function (req, res, next) {
    try {
      const userId = req.currentUserId;
      const groupId = req.params.groupId;
      const payment = req.body.payment;

      const updatedGroupInfo = await groupService.setPayment({
        userId,
        groupId,
        payment,
      });

      if (updatedGroupInfo.errorMessage) {
        throw new Error(updatedGroupInfo.errorMessage);
      }

      const body = {
        success: true,
        payload: updatedGroupInfo,
      };

      res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  }
);

// 공동구매 정보 변경
groupRouter.put(
  "/groups/groupId/:groupId",
  login_required,
  async function (req, res, next) {
    try {
      const groupId = req.params.groupId;

      const groupType = req.body.groupType ?? null;
      const groupName = req.body.groupName ?? null;
      const location = req.body.location ?? null;
      const deadline = req.body.deadline ?? null;
      const productId = req.body.productId ?? null;
      const state = req.body.state ?? null;

      const toUpdate = {
        groupType,
        groupName,
        location,
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

      res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  }
);

// 공동구매 아이디를 통해 공동구매 검색
groupRouter.get(
  "/groups/groupId/:groupId",
  login_required,
  async function (req, res, next) {
    try {
      const groupId = req.params.groupId;
      const groupInfo = await groupService.getGroupInfo({ groupId });

      if (groupInfo.errorMessage) {
        throw new Error(groupInfo.errorMessage);
      }

      const body = {
        success: true,
        payload: groupInfo,
      };

      res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  }
);

// 상품 아이디에 대한 모든 공동구매들을 반환하는 함수
groupRouter.get(
  "/grouplist/:productId",
  login_required,
  async function (req, res, next) {
    try {
      const productId = req.params.productId;
      const groupList = await groupService.getGroupByProductId({ productId });

      const body = {
        success: true,
        payload: groupList,
      };

      res.status(200).send(body);
    } catch (error) {
      next(error);
    }
  }
);

// 공동구매의 숫자 정보들 반환
groupRouter.get(
  "/groups/:groupId/numberInfo",
  login_required,
  async function (req, res, next) {
    try {
      const groupId = req.params.groupId;

      const numberInfo = await groupService.getNumberInfoByGroupId({ groupId });

      const body = {
        success: true,
        payload: numberInfo,
      };

      res.status(200).send(body);
    } catch (error) {
      next(error);
    }
  }
);

// 내가 owner인 공동구매들 반환
groupRouter.get(
  "/groups/manager/:boolean",
  login_required,
  async function (req, res, next) {
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

      res.status(200).send(body);
    } catch (error) {
      next(error);
    }
  }
);

// 공동구매에 참가자 추가
groupRouter.put(
  "/groups/:groupId/participate/in",
  login_required,
  async function (req, res, next) {
    try {
      const userId = req.currentUserId;
      const groupId = req.params.groupId;
      const { quantity, payment } = req.body;

      const UpdatedGroup = await groupService.addParticipants({
        userId,
        groupId,
        quantity,
        payment,
      });

      if (UpdatedGroup.errorMessage) {
        throw new Error(UpdatedGroup.errorMessage);
      }

      const body = {
        success: true,
        payload: UpdatedGroup,
      };
      res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  }
);

// 공동구매 나가기
groupRouter.put(
  "/groups/:groupId/participate/out",
  login_required,
  async function (req, res, next) {
    try {
      const userId = req.currentUserId;
      const groupId = req.params.groupId;

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
      res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  }
);

// 공동구매 아이디를 통해 공동구매 검색
groupRouter.get(
  "/groups/:groupId/stateInfo",
  login_required,
  async function (req, res, next) {
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

      res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  }
);

export { groupRouter };
