import { Router } from "express";
import { TopicService } from "../services/topicService";

const topicRouter = Router();

topicRouter.get(
  "/topics",
  async (req, res, next) => {
  try {
    const topicList = await TopicService.getTopicList();

    const body = {
      success: true,
      payload: topicList,
    }

    res.status(200).json(body);
  } catch (error) {
    next(error);
  }
});


export { topicRouter };