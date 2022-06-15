import { TopicService } from "../services/topicService";

const topicController = {
  getTopicList: async (req, res, next) => { 
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
  },
};

export { topicController };