import { Post } from "../db/index.js";
import { User } from "../db/mongodb/index.js";
import { Product } from "../db/mongodb/index.js";
import { Group } from "../db/mongodb/index.js";
import crypto from "crypto";
import { getRequiredInfoFromPostData } from "../utils/post";
import { PinpointSMSVoiceV2 } from "aws-sdk";

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
  static async addPost({ type, writer, receiver, title, content }) {
    const postId = crypto.randomUUID();
    let authorizedUsers = [];
    let post;

    // type마다 볼 수 있는 권한이 다름
    // cs : 글쓴이, 상품 판매자
    // groupChat : 그룹 공구에 참여하는 사람
    // review : 모두
    if (type === "cs") {
      const { userId, name, images } = await Product.findProduct({
        id: receiver,
      });

      if (!userId) {
        const errorMessage = "존재하지 않는 상품입니다.";
        return { errorMessage };
      }

      authorizedUsers = [writer, userId];

      // 문의글이 생겼다면 상품 판매자에게 알림
      await User.updateAlert({
        userId: userId,
        from: type,
        image: images,
        sendId: receiver, // productId
        content: `'${name}' 상품에 문의가 생성되었습니다.`,
      });
    } else if (type === "groupChat") {
      authorizedUsers = await Group.findParticipantsByGroupId({
        groupId: receiver,
      });
      const group = await Group.findByGroupId({ groupId: receiver });
      const groupName = group.groupName;

      // 공동 구매 댓글이 생겼다면 공동구매 참여자 전원에게 알림
      authorizedUsers.map(
        async (v) =>
          await User.updateAlert({
            userId: v,
            from: type,
            image: group.productInfo.images,
            sendId: receiver, // groupId
            content: `'${groupName}'에 공동 구매 댓글이 생성되었습니다.`,
          })
      );
    } else if (type === "review") {
      authorizedUsers = [];

      // 후기가 생겼다면 상품 판매자에게 알림
      const { userId, name, images } = await Product.findProduct({
        id: receiver,
      });
      await User.updateAlert({
        userId: userId,
        from: type,
        image: images,
        sendId: receiver, // productId
        content: `'${name}' 상품에 후기가 생성되었습니다.`,
      });
    } else if (type === "comment") {
      // 댓글일 때 postId가 있는지 확인 => 없다면 에러
      authorizedUsers = [];
      post = await Post.findPostContent({ postId: receiver });
      if (!post) {
        const errorMessage = "존재하지 않는 글입니다.";
        return { errorMessage };
      }
      const updateId = post.postId;
      const addCommentCount = post.commentCount + 1;
      const toUpdate = { commentCount: addCommentCount, reply: true };
      post = await Post.update({ postId: updateId, toUpdate });
      const { images } = await Product.findProduct({ id: post.receiver });
      // 댓글이 추가되었다면 글 쓴 유저에게 알림
      if (writer !== post.writer) {
        const toUpdate = { reply: true };
        await Post.update({ postId: updateId, toUpdate });
        await User.updateAlert({
          userId: post.writer,
          from: type,
          image: images,
          sendId: post.postId,
          content: `'${post.title}' 글에 댓글이 생성되었습니다.`,
        });
      }
    } else {
      const errorMessage = "존재하지 않는 type 입니다.";
      return { errorMessage };
    }

    const newPost = {
      postId,
      type,
      writer,
      receiver,
      title,
      content,
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
  static async getPostList({ receiver, type }) {
    const postList = await Post.findPostList({
      receiver,
      type,
    });

    return postList;
  }

  /** 글 한 개 검색 함수
   *
   * @param {String} postId - 글 id
   * @returns {Object} post
   */
  static async getPost({ postId, userId }) {
    let post = await Post.findPostContent({ postId });

    if (!post) {
      const errorMessage = "존재하지 않는 글입니다.";
      return {
        status: 400,
        errorMessage,
      };
    }

    if (post.removed === true) {
      const errorMessage = "삭제된 글입니다.";
      return {
        status: 400,
        errorMessage,
      };
    }

    // if (
    //   post.type !== "review" &&
    //   post.type !== "comment" &&
    //   post.authorizedUsers.indexOf(userId) === -1
    // ) {
    //   const errorMessage = "글을 볼 수 있는 권한이 없습니다";
    //   return {
    //     status: 403,
    //     errorMessage,
    //   };
    // }

    if (post.type === "review" || post.type === "cs") {
      const commentList = await Post.findCommentList({ receiver: postId });
      return { post, commentList };
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
      return {
        status: 400,
        errorMessage,
      };
    }
    if (post.writer !== writer) {
      const errorMessage = "글을 쓴 유저만 수정이 가능합니다.";
      return {
        status: 403,
        errorMessage,
      };
    }

    if (post.removed === true) {
      const errorMessage = "이미 삭제된 글입니다.";
      return {
        status: 400,
        errorMessage,
      };
    }

    Object.keys(toUpdate).forEach((key) => {
      if (toUpdate[key] === undefined || toUpdate[key] === null) {
        delete toUpdate[key];
      }
    });

    let updatedPost = await Post.update({ postId, toUpdate });

    if (post.type === "review" || post.type === "cs") {
      const commentList = await Post.findCommentList({ receiver: postId });
      return { post: updatedPost, commentList };
    }

    return updatedPost;
  }

  /** 글 삭제 함수
   *
   * @param {String} writer - 글쓴이
   * @param {String} postId - 글 id
   * @returns {Object} deletedPost
   */
  static async deletePost({ writer, postId }) {
    let post = await Post.findPostContent({ postId });

    if (!post) {
      const errorMessage = "게시글이 존재하지 않습니다.";
      return {
        status: 400,
        errorMessage,
      };
    }

    if (post.writer !== writer) {
      const errorMessage = "글을 쓴 유저만 삭제가 가능합니다.";
      return {
        status: 403,
        errorMessage,
      };
    }

    if (post.removed === true) {
      const errorMessage = "이미 삭제된 글입니다.";
      return {
        status: 400,
        errorMessage,
      };
    }

    let toUpdate = {};

    // 만약 댓글이라면
    // receiver로 가진 post의 commentCount -= 1 해야 함
    if (post.type === "comment") {
      const receiver = post.receiver;
      post = await Post.findPostContent({ postId: receiver });
      if (!post) {
        const errorMessage = "존재하지 않는 글입니다.";
        return { errorMessage };
      }
      const updateId = post.postId;
      const minusCommentCount = post.commentCount - 1;
      toUpdate = {
        commentCount: minusCommentCount,
      };
      post = await Post.update({ postId: updateId, toUpdate });
      toUpdate = { removed: true };
    } else {
      toUpdate = { removed: true };
    }

    const deletedPost = await Post.update({ postId, toUpdate });
    return deletedPost;
  }

  /** 내가 쓴 글 모아보는 함수
   *
   * @param {String} userId - 로그인한 유저 id
   * @param {String} writer - 글쓴이
   * @param {String} option - 옵션 (review / cs / groupChat / comment)
   * @returns {Object} postList
   */
  static async getPostListByWriter({ userId, writer, option, reply }) {
    const optionList = ["review", "cs", "groupChat", "comment"];

    if (optionList.indexOf(option) === -1) {
      const errorMessage = "옵션을 잘못 입력하셨습니다.";
      return {
        status: 400,
        errorMessage,
      };
    }

    if (userId !== writer) {
      const errorMessage = "글쓴이만 볼 수 있습니다.";
      return {
        status: 403,
        errorMessage,
      };
    }

    let postList = await Post.findPostListByWriter({ writer, option, reply });
    console.log("전 :", postList);
    if (option === "cs") {
      let posts = postList;
      postList = [];
      postList = await Promise.all(
        posts.map(async (v) => {
          let comment = await Post.findCommentList({ receiver: v.postId });
          return { post: v, commentList: comment };
        })
      );
      console.log("service: ", postList);
      return { postList };
    }

    return postList;
  }

  /** 리뷰 많은순 정렬 함수
   *
   */
  static async getReviewList() {
    const reviewList = await Post.findProductSortByReviews();
    return reviewList;
  }
}

export { PostService };
