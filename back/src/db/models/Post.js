import { PostModel } from "../schemas/post.js";

class Post {
  /** 글 생성 함수
   *
   * @param {Object} newPost - 생성할 글 데이터가 담긴 오브젝트
   * @returns {Object}
   */
  static async create({ newPost }) {
    const createNewPost = await PostModel.create(newPost);
    return createNewPost;
  }

  /** 글 검색 함수
   *
   * @param {String} receiver - 글을 검색할 위치
   * @returns {Object}
   */
  static async postList({ receiver }) {
    const list = await PostModel.find(
      { receiver },
      { _id: 0, __v: 0, receiver: 0, updatedAt: 0 }
    )
      .sort({ createdAt: -1 })
      .lean();
    return list;
  }
}

export { Post };
