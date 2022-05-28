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
   * @param {String} receiver - 글이 남겨지는 곳
   * @returns {Object}
   */
  static async postList({ receiver }) {
    console.log(receiver);
    const postList = await PostModel.find(
      { removed: false },
      { receiver },
      { _id: 0, __v: 0, updatedAt: 0 }
    )
      .sort({ createdAt: -1 })
      .lean();
    
    return postList;
  }

  static async findPost({ postId }) { 
    const post = await PostModel.findOne({ postId });
    return post;
  }

  static async update({ sender, toUpdate }) { 
    const updatedPost = await PostModel.findOneAndUpdate(
      { sender: sender },
      { $set: toUpdate },
      { returnOriginal: false },
      { _id: 0, __v: 0, updatedAt: 0 }
    );
    
    return updatedPost;
  }
}

export { Post };
