import { TopicModel } from "../schemas/topic.js";

class Topic {
  /** 토픽 생성 함수
   *
   * @param {String} search - 검색어
   * @returns {Object} createNewTopic
   */
  static async create({ newTopic }) {
    const createNewTopic = await TopicModel.create(newTopic);
    return createNewTopic;
  }

  /** 실시간 검색어 top 10 반환 함수
   *
   * @returns {Object} topicList
   */
  static async findTopicList() {
    let topicList = await TopicModel.aggregate([
      {
        $match:
        {
          createdAt:
            { $gte: new Date((new Date()).valueOf() - 1000 * 60 * 60) }
        }
      },
      {
        $group: {
          _id: "$word",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);
    
    return topicList;
  }
}


export { Topic };