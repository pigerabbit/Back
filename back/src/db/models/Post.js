import { PostModel } from "../schemas/post.js";

class Post {
  /** 글 생성 함수
   *
   * @param {Object} newPost - 생성할 글 데이터가 담긴 오브젝트
   * @returns {Object} createNewPost
   */
  static async create({ newPost }) {
    const createNewPost = await PostModel.create(newPost);
    return createNewPost;
  }

  /** 글 남겨진 곳 검색 함수
   *
   * @param {String} receiver - 글이 남겨지는 곳
   * @returns {Object} postList
   */
  static async findPostList({ receiver }) {
    const postList = await PostModel.find(
      { receiver, removed: false },
      { _id: 0, __v: 0, updatedAt: 0 },
    )
      .sort({ createdAt: -1 })
      .lean();
    
    return postList;
  }

  /** 글이 존재하는지 확인하는 함수
   * 
   * @param {String} postId - 글 id  
   * @returns {Object} post
   */
  static async findPostContent({ postId }) { 
    const post = await PostModel.findOne(
      { postId },
      { _id: 0, __v: 0, updatedAt: 0 },
    );
    return post;
  }

  /** 문의 답변 완료 함수 
   * 글 id를 receiver로 사용하는 곳이 있다면 문의 답변이 존재
   * 
   * @param {String} postId - 글 id 
   * @returns 
   */
  static async findPostReply({ postId }) { 
    const reply = await PostModel.find({ receiver: postId });
    return reply;
  }

  /** 글 수정 함수
   * 
   * @param {String} postId - 글 id 
   * @param {Object} toUpdate - 글 업데이트 내용이 담긴 오브젝트
   * @returns {Object} updatedPost
   */
  static async update({ postId, toUpdate }) { 
    const updatedPost = await PostModel.findOneAndUpdate(
      { postId: postId },
      { $set: toUpdate },
      { returnOriginal: false },
    )
      .select('-__v')
      .select('-_id')
      .select('-updatedAt');

    return updatedPost;
  }
  
  /** 내가 쓴 후기 모아보기 함수
   *
   * @param {String} writer - 글쓴이 
   * @returns {Object} reviewList
   */
  static async findReviewList({ writer }) { 
    const reviewList = await PostModel.find(
      { writer, removed: false },
      { _id: 0, __v: 0, updatedAt: 0 },
    );
    return reviewList;
  }

}

export { Post };
