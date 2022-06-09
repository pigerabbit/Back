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
            { $gte: new Date(new Date().setDate(new Date().getDate() - 1)) }
        }
      },
      // { $match: { word: { $regex: "양" } }},
      {
        $group: {
          _id: "$word",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 }},
    ])
    
    console.log(topicList);
    
    return topicList;
  }
}


export { Topic };