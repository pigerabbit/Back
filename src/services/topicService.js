import { Topic } from "../db/mongodb/index.js";

class TopicService {
  /** 검색어 추가
   *
   * @param {String} search - 검색어
   * @returns createdTopic
   */
  static async addTopic({ word }) {
    const newTopic = {
      word: word,
    };

    const createdTopic = await Topic.create({ newTopic });
    return createdTopic;
  }

  /** 실시간 인기 검색어 조회
   *
   * @returns 상품 이름 list
   */
  static async getTopicList() {
    const top = 10;
    let topicList = await Topic.findTopicList();

    topicList = topicList.map((v) => v._id);
    topicList = topicList.slice(0, top);

    return topicList;
  }
}

export { TopicService };
