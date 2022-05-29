import { Post } from "../db/index.js";
import crypto from "crypto";

class PostService {
  /** 글 저장 함수
   *
   * @param {String} type - review / inquiry / groupChat
   * @param {String} sender - 글 쓰는 사람
   * @param {String} receiver - 글이 남겨지는 곳
   * @param {String} title - 글 제목
   * @param {String} content - 글 내용
   * @param {String} postImg - 업로드한 사진
   * @returns {Object} createdPost
   */
  static async addPost({
    type,
    sender,
    receiver,
    title,
    content,
    postImg,
  }) {
    const postId = crypto.randomUUID();
    const newPost = {
      postId,
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

  /** 글 남겨진 곳 검색 함수
   *
   * @param {String} receiver - 글이 남겨지는 곳
   * @returns {Object} postList
   */
  static async getPostList({ receiver }) {
    const postList = await Post.findPostList({
      receiver
    });

    if (postList.length === 0) {
      const errorMessage = "잘못된 receiver 입니다.";
      return { errorMessage };
    }

    return postList;
  }

  /** 글 검색 함수
   *
   * @param {String} postId - 글 id
   * @returns {Object} post
  */
  static async getPost({ postId }) {
    const post = await Post.findPostContent({ postId });

    if (!post) {
      const errorMessage = "존재하지 않는 글입니다.";
      return { errorMessage };
    }
     
    if (post.removed === true) { 
      const errorMessage = "삭제된 글입니다.";
      return { errorMessage };
    }

    return post;
  }

  /** 글 수정 함수
   * 
   * @param {String} sender - 글쓴이
   * @param {String} postId - 글이 남겨지는 곳
   * @param {Object} toUpdate - 글 업데이트 내용이 담긴 오브젝트
   * @returns {Object} updatedPost
  */
  static async setPost({ sender, postId, toUpdate }) {
    const post = await Post.findPostContent({ postId });

    if (!post) {
      const errorMessage = "게시글이 존재하지 않습니다.";
      return { errorMessage };
    }

    if (post.sender !== sender) {
      const errorMessage = "글을 쓴 유저만 수정이 가능합니다.";
      return { errorMessage };
    }

    Object.keys(toUpdate).forEach((key) => {
      if (toUpdate[key] === undefined || toUpdate[key] === null) {
        delete toUpdate[key];
      }
    });

    const updatedPost = await Post.update({ postId, toUpdate });
    return updatedPost;
  }

  /** 글 삭제 함수
   *
   * @param {String} postId - 글 id
   * @returns {Object} deletedPost
   */
  static async deletePost({ postId }) {
    const post = await Post.findPostContent({ postId });

    if (!post) {
      const errorMessage = "게시글이 존재하지 않습니다.";
      return { errorMessage };
    }

    if (post.postId !== postId) { 
      const errorMessage = "글을 쓴 유저만 삭제가 가능합니다.";
      return { errorMessage };
    }

    const toUpdate = { removed: true };
    const deletedPost = await Post.update({ postId, toUpdate });
    console.log(deletedPost);
    return deletedPost;
  }
}

export { PostService };
