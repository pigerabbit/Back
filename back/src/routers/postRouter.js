import { Router } from "express";
import { PostService } from "../services/postService";
import { validate } from "../middlewares/validator.js";
import { check, param, body, query } from "express-validator";
import { login_required } from "../middlewares/login_required";

const { postImageUpload } = require("../utils/s3");

const postRouter = Router();

/** POST /posts - 글 생성 API 
 * body : type,
 *        receiver,
 *        title,
 *        content,
 * file : postImg
 */
postRouter.post(
  "/posts",
  login_required,
  [
    body("type")
      .exists()
      .withMessage("글 타입을 입력해주세요.")
      .bail(),
    body("receiver")
      .exists()
      .withMessage("receiver를 입력해주세요")
      .bail(),
    body("content")
      .exists()
      .withMessage("content를 입력해주세요")
      .bail(),
    validate,
  ],
  postImageUpload.single("postImg"),
  async (req, res, next) => {
    try {
      const writer = req.currentUserId;
      const { 
        type,
        receiver,
        title,
        content,
      } = req.body;

      const postImg = req.file?.location ?? null;

      const createdPost = await PostService.addPost({
        type,
        writer,
        receiver,
        title,
        content,
        postImg,
      });

      if (createdPost.errorMessage) {
        const body = {
          success: false,
          error:  createdPost.errorMessage,
        }

        return res.status(400).send(body);
      }

      const body = {
        success: true,
        payload: createdPost,
      };

      return res.status(201).json(body);
    } catch (err) {
      next(err);
    }
  }
);


/** GET /posts - 전체 글 읽기 API (후기, 문의, 공구에서 활용)
 * query : receiver
 */
postRouter.get(
  "/posts",
  [
    query("receiver")
      .exists()
      .withMessage("query에 receiver를 입력해주세요.")
      .bail(),
    validate,
  ],
  async (req, res, next) => {
    try {
      const { receiver } = req.query;
      const postList = await PostService.getPostList({ receiver });

      if (postList.errorMessage) {
        const body = {
          success: false,
          error: postList.errorMessage,
        }

        return res.status(400).send(body);
      }

      const body = {
        success: true,
        payload: postList,
      };

      return res.status(200).json(body);
    } catch (err) {
      next(err);
    }
  }
);

/** GET /posts/:postId - 글 하나 읽기 API (후기, 문의에서 활용 / 공구는 댓글 전체보기로 가능)
 * params: postId
 */
postRouter.get(
  "/posts/:postId",
  login_required,
  [
    check("postId")
      .trim()
      .isLength()
      .exists()
      .withMessage("parameter 값으로 postId를 입력해주세요.")
      .bail(),
    validate,
  ],
  async (req, res, next) => { 
    try {
      const postId = req.params.postId;
      const userId = req.currentUserId;

      const post = await PostService.getPost({ postId, userId });

      if (post.errorMessage) { 
        const body = {
          success: false,
          payload: post.errorMessage,
        }

        return res.status(400).send(body);
      }

      const body = {
        success: true,
        payload: post,
      }

      return res.status(200).send(body);
    } catch (err) { 
      next(err);
    }
  }
);

/** PUT /posts/:id - 글 수정 API 
 * params: id
 * body : title,
 *        content,
 * file : postImg
 */
postRouter.put(
  "/posts/:postId",
  login_required,
  [
    check("postId")
      .trim()
      .isLength()
      .exists()
      .withMessage("parameter 값으로 postId를 입력해주세요.")
      .bail(),
    body("content")
      .exists()
      .withMessage("content를 입력해주세요.")
      .bail(),
    validate,
  ],
  postImageUpload.single("postImg"),
  async (req, res, next) => {
    try {
      const writer = req.currentUserId;
      const postId = req.params.postId;
      const title = req.body.title ?? null;
      const content = req.body.content ?? null;
      const postImg = req.file?.location ?? null;

      const toUpdate = {
        title,
        content,
        postImg,
      }

      const updatedPost = await PostService.setPost({ writer, postId, toUpdate });

      if (updatedPost.errorMessage) {
        const body = {
          success: false,
          error: updatedPost.errorMessage,
        }
        
        return res.status(400).send(body);
      } 

      const body = {
        success: true,
        payload: updatedPost,
      }

      return res.status(200).send(body);
    } catch (err) { 
      next(err);
    }
  }
);

/** DELETE /posts/:id - 글 삭제 API 
 * params: id
 */
postRouter.delete(
  "/posts/:postId",
  login_required,
  [
    check("postId")
      .trim()
      .isLength()
      .exists()
      .withMessage("parameter 값으로 postId를 입력해주세요.")
      .bail(),
    validate,
  ],
  async (req, res, next) => {
    try {
      const writer = req.currentUserId;
      const postId = req.params.postId;

      const deletedPost = await PostService.deletePost({ postId });

      if (deletedPost.errorMessage) {
        const body = {
          success: false,
          error: deletedPost.errorMessage,
        }
        
        return res.status(400).send(body);
      } 

      const body = {
        success: true,
        payload: "성공적으로 삭제되었습니다.",
      }

      return res.status(200).send(body);
    } catch (err) { 
      next(err);
    }
  }
);

/** 내가 쓴 후기 모아보기 함수
 * param: writer
 */
postRouter.get(
  "/posts/:writer/review",
  login_required,
  [
    check("writer")
      .trim()
      .isLength()
      .exists()
      .withMessage("parameter 값으로 writer를 입력해주세요.")
      .bail(),
    validate,
  ],
  async (req, res, next) => {
    try { 
      const userId = req.currentUserId;
      const writer = req.params.writer;

      const reviewList = await PostService.getReviewList({ userId, writer });

      if (reviewList.errorMessage) { 
        const body = {
          success: false,
          error: reviewList.errorMessage,
        }

        return res.status(403).send(body);
      }

      const body = {
        success: true,
        payload: reviewList,
      }

      return res.status(200).send(body);
    } catch (err) {
      next(err);
    }
  }
);

export { postRouter };

