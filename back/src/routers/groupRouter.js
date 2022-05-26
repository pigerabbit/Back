import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { groupService } from "../services/groupService";
import { Group } from "../db";

const groupRouter = Router();

groupRouter.post(
  "/group/create",
  login_required,
  async function (req, res, next) {
    try {
      const { group_type, location, deadline, product_id, state } = req.body;

      const newGroup = await groupService.addGroup({
        group_type,
        location,
        deadline,
        product_id,
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
  }
);

groupRouter.put(
  "/groups/:group_id/participants",
  login_required,
  async function (req, res, next) {
    try {
      const user_id = req.body.user_id;
      const group_id = req.params.group_id;

      const toUpdate = { user_id };
      const updatedGroupInfo = await groupService.setParticipants({
        group_id,
        toUpdate,
      });

      if (updatedGroupInfo.errorMessage) {
        throw new Error(updatedGroupInfo.errorMessage);
      }

      const body = {
        success: true,
        payload: updatedGroupInfo,
      };

      res.status(200).json(updatedGroupInfo);
    } catch (error) {
      next(error);
    }
  }
);

groupRouter.put(
  "/groups/:group_id/not-paid",
  login_required,
  async function (req, res, next) {
    try {
      const user_id = req.body.user_id;
      const group_id = req.params.group_id;

      const toUpdate = { user_id };
      const updatedGroupInfo = await groupService.setNotPaid({
        group_id,
        toUpdate,
      });

      if (updatedGroupInfo.errorMessage) {
        throw new Error(updatedGroupInfo.errorMessage);
      }

      const body = {
        success: true,
        payload: updatedGroupInfo,
      };

      res.status(200).json(updatedGroupInfo);
    } catch (error) {
      next(error);
    }
  }
);

groupRouter.get(
  "/groups/:group_id/participants",
  login_required,
  async function (req, res, next) {
    try {
      const group_id = req.params.group_id;

      const participantsInfo = await groupService.getParticipants({ group_id });

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
  "/groups/:group_id/not-paid",
  login_required,
  async function (req, res, next) {
    try {
      const group_id = req.params.group_id;

      const notPaidInfo = await groupService.getNotPaid({ group_id });

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
  "/groups/:group_id",
  login_required,
  async function (req, res, next) {
    try {
      const group_id = req.params.group_id;

      const group_type = req.body.group_type;
      const location = req.body.location;
      const deadline = req.body.deadline;
      const product_id = req.body.product_id;
      const state = req.body.state;

      const toUpdate = { group_type, location, deadline, product_id, state };

      const updatedGroup = await groupService.setGroup({ group_id, toUpdate });

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
  "/groups/:group_id",
  login_required,
  async function (req, res, next) {
    try {
      const group_id = req.params.group_id;
      const groupInfo = await groupService.getGroupInfo({ group_id });

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

export { groupRouter };
