import { Post } from "../db/index.js";
import crypto from "crypto";
import { getRequiredInfoFromPostData } from "../utils/post";
import e from "express";

class PostService {
  /** 글 저장 함수
   *
   * @param {String} type - review / cs / groupChat
   * @param {String} writer - 글쓴이
   * @param {String} receiver - 글이 남겨지는 곳
   * @param {String} title - 글 제목
   * @param {String} content - 글 내용
   * @param {String} postImg - 업로드한 사진
   * @returns {Object} createdPost
   */
  static async addPost({
    type,
    writer,
    receiver,
    title,
    content,
    postImg,
  }) {
    const postId = crypto.randomUUID();
    let authorizedUsers = [];
    let post;

    // type마다 볼 수 있는 권한이 다름
    // cs : 글쓴이, 상품 판매자
    // groupChat : 그룹 공구에 참여하는 사람
    // review : 모두
    if (type === "cs") {
      authorizedUsers = [writer, receiver];
    } else if (type === "groupChat") { // 나중에 group API랑 연동 필요
      authorizedUsers = [writer]
    } else if (type === "review") {
      authorizedUsers = [];
    } else if (type === "comment") { // 댓글일 때 postId가 있는지 확인 => 없다면 에러
      authorizedUsers = [];
      post = await Post.findPostContent({ postId: receiver });
      if (!post) {
        const errorMessage = "존재하지 않는 글입니다.";
        return { errorMessage };
      }
    } else { 
      const errorMessage = "존재하지 않는 type 입니다.";
      return { errorMessage };
    }

    const newPost = {
      postId,
      type,
      authorizedUsers,
      writer,
      receiver,
      title,
      content,
      postImg,
    };
    const createdPost = await Post.create({ newPost });
    const resultPost = getRequiredInfoFromPostData(createdPost);
    return resultPost;
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
  static async getPost({ postId, userId }) {
    const post = await Post.findPostContent({ postId });

    if (!post) {
      const errorMessage = "존재하지 않는 글입니다.";
      return { errorMessage };
    }
     
    if (post.removed === true) { 
      const errorMessage = "삭제된 글입니다.";
      return { errorMessage };
    }

    if (post.type !== "review" && post.type !== "comment" && post.authorizedUsers.indexOf(userId) === -1) { 
      const errorMessage = "글을 볼 수 있는 권한이 없습니다";
      return { errorMessage };
    }

    // 댓글이 있는지 확인하는 함수 => 수정!!
    if (post.type === "cs") {
      const reply = await Post.findPostContent({ postId });
      console.log("postId", postId);
      console.log("reply", reply);
      if (reply.length !== 0) {
        post['reply'] = true; // Object 추가가 되지 않음
      } else { 
        post['reply'] = false;
      }
    }

    return post;
  }

  /** 글 수정 함수
   * 
   * @param {String} writer - 글쓴이
   * @param {String} postId - 글 id
   * @param {Object} toUpdate - 글 업데이트 내용이 담긴 오브젝트
   * @returns {Object} updatedPost
   */
  static async setPost({ writer, postId, toUpdate }) {
    const post = await Post.findPostContent({ postId });

    if (!post) {
      const errorMessage = "게시글이 존재하지 않습니다.";
      return { errorMessage };
    }

    if (post.writer !== writer) {
      const errorMessage = "글을 쓴 유저만 수정이 가능합니다.";
      return { errorMessage };
    }

    if (post.removed === true) { 
      const errorMessage = "이미 삭제된 글입니다.";
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

    if (post.removed === true) { 
      const errorMessage = "이미 삭제된 글입니다.";
      return { errorMessage };
    }

    const toUpdate = { removed: true };
    const deletedPost = await Post.update({ postId, toUpdate });
    console.log(deletedPost);
    return deletedPost;
  }

  /** 내가 쓴 후기 모아보는 함수
   * 
   * @param {String} userId - 로그인한 유저 id
   * @param {String} writer - 글쓴이
   */
  static async getPostListByWriter({ userId, writer, option }) { 
    if (userId !== writer) { 
      const errorMessage = "글쓴이만 볼 수 있습니다.";
      return { errorMessage };
    }

    const reviewList = await Post.findPostListByWriter({ writer, option });

    if (reviewList.length === 0) { 
      const errorMessage = "작성한 후기 / 문의가 없습니다.";
      return { errorMessage };
    }

    return reviewList;
  }
}

export { PostService };
