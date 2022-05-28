import { Post } from "../db/index.js";
import crypto from "crypto";

class PostService {
  /** 글 저장 함수
   *
   * @param {String} type - review / inquiry / groupChat
   * @param {String} sender - 글을 쓰는 사람
   * @param {String} receiver - 글이 남겨지는 곳
   * @param {String} title - 글 제목
   * @param {String} content - 글 내용
   * @param {String} postImg - 업로드한 사진
   * @returns {Object}
   */
  static async addPost({
    type,
    sender,
    receiver,
    title,
    content,
    postImg,
  }) {
    const id = crypto.randomUUID();
    const newPost = {
      id,
      type,
      sender,
      receiver,
      title,
      content,
      postImg,
    };
    const createdPost = await Post.create({ newPost });
    return createdPost;
  }

  /** 글 검색 함수
   *
   * @param {String} receiver - 글이 남겨지는 곳
   * @returns {Object}
   */
  static async listPost({ receiver }) {
    const postList = await Post.postList({
      receiver
    });

    if (postList.length === 0) {
      const errorMessage = "잘못된 receiver 입니다.";
      return { errorMessage };
    }

    return postList;
  }
}

export { PostService };
