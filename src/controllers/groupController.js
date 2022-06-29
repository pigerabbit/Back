import { groupService } from "../services/groupService";
import { addressToXY } from "../utils/addressToXY.js";

const groupController = {
  createGroup: async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const { groupType, groupName, location, productId, deadline, quantity, paymentMethod } =
        req.body;

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
      res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  },

  updateQuantity: async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const groupId = req.params.groupId;
      const quantity = req.body.quantity;

      const checkState = await groupService.checkState({ groupId });
      if (checkState === -1) {
        const errorMessage = "가뭄이 들은 당근밭입니다.";
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

      res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  },

  updatePayment: async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const groupId = req.params.groupId;
      const payment = req.body.payment;
      const paymentMethod = req.body.paymentMethod;

      const checkState = await groupService.checkState({ groupId });
      if (checkState === -1) {
        const errorMessage = "가뭄이 들은 당근밭입니다.";
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

      res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  },

  updateGroup: async (req, res, next) => {
    try {
      const groupId = req.params.groupId;

      const groupType = req.body.groupType ?? null;
      const groupName = req.body.groupName ?? null;
      const location = req.body.location ?? null;
      const deadline = req.body.deadline ?? null;
      const productId = req.body.productId ?? null;
      const state = req.body.state ?? null;

      await groupService.checkState({ groupId });

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

      res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  },

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

      res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  },

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

      res.status(200).send(body);
    } catch (error) {
      next(error);
    }
  },

  getGroupsByNumberInfo: async (req, res, next) => {
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
  },

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

      res.status(200).send(body);
    } catch (error) {
      next(error);
    }
  },

  updateParticipateIn: async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const groupId = req.params.groupId;
      const { quantity, paymentMethod } = req.body;

      // const checkState = await groupService.checkState({ groupId });
      // if (checkState === -1) {
      //   const errorMessage = "가뭄이 들은 당근밭입니다.";
      //   throw new Error(errorMessage);
      // }

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
      res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  },

  updateParticipateOut: async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const groupId = req.params.groupId;

      // const checkState = await groupService.checkState({ groupId });
      // if (checkState === -1) {
      //   const errorMessage = "가뭄이 들은 당근밭입니다.";
      //   throw new Error(errorMessage);
      // }

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
  },

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

      res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  },

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

      res.status(200).send(body);
    } catch (error) {
      next(error);
    }
  },

  getGroupsByRemainedPersonnel: async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const groupList =
        await groupService.getSortedGroupsByRemainedPersonnelInfo(userId);

      const body = {
        success: true,
        payload: groupList,
      };

      res.status(200).send(body);
    } catch (error) {
      next(error);
    }
  },

  getGroupsByLocations: async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const groupList = await groupService.findNearGroupList({ userId });
      if (groupList.data === false) { 
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

  deleteGroup: async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const groupId = req.params.groupId;

      // const checkState = await groupService.checkState({ groupId });
      // if (checkState === -1) {
      //   const errorMessage = "가뭄이 들은 당근밭입니다.";
      //   throw new Error(errorMessage);
      // }

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
      res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  },
};

export { groupController };
