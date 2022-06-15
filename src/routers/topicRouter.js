import { Router } from "express";

import { topicController } from "../controllers/topicController";

const topicRouter = Router();

topicRouter.get(
  "/topics",
  topicController.getTopicList
);


export { topicRouter };