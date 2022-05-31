import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { groupService } from "../services/groupService";

const groupRouter = Router();

groupRouter.post("/groups", login_required, async function (req, res, next) {
  try {
    const userId = req.currentUserId;
    const { groupType, groupName, location, productId, state } = req.body;

    const newGroup = await groupService.addGroup({
      userId,
      groupType,
      groupName,
      location,
      productId,
      state,
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

groupRouter.put(
  "/groups/:groupId/participants",
  login_required,
  async function (req, res, next) {
    try {
      const userId = req.body.userId;
      const groupId = req.params.groupId;

      const toUpdate = { userId };
      const updatedGroupInfo = await groupService.setParticipants({
        groupId,
        toUpdate,
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

groupRouter.put(
  "/groups/:groupId/notPaid",
  login_required,
  async function (req, res, next) {
    try {
      const userId = req.body.userId;
      const groupId = req.params.groupId;

      const toUpdate = { userId };
      const updatedGroupInfo = await groupService.setNotPaid({
        groupId,
        toUpdate,
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

groupRouter.get(
  "/groups/:groupId/participants",
  login_required,
  async function (req, res, next) {
    try {
      const groupId = req.params.groupId;

      const participantsInfo = await groupService.getParticipants({ groupId });

      if (participantsInfo.errorMessage) {
        throw new Error(participantsInfo.errorMessage);
      }

      const body = {
        success: true,
        payload: participantsInfo,
      };

      res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  }
);

groupRouter.get(
  "/groups/:groupId/notPaid",
  login_required,
  async function (req, res, next) {
    try {
      const groupId = req.params.groupId;

      const notPaidInfo = await groupService.getNotPaid({ groupId });

      if (notPaidInfo.errorMessage) {
        throw new Error(notPaidInfo.errorMessage);
      }

      const body = {
        success: true,
        payload: notPaidInfo,
      };

      res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  }
);

groupRouter.put(
  "/groups/:groupId",
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

groupRouter.get(
  "/groups/:groupId",
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

groupRouter.get(
  "/groups/chuchun/descending",
  login_required,
  async function (req, res, next) {
    try {
      const sortedList = await groupService.findProductList();

      const body = {
        success: true,
        payload: sortedList,
      };

      res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  }
);

// 상품별 공동구매 리스트를 반환하는 함수
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

export { groupRouter };
