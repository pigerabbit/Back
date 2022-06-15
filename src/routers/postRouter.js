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
  async (req, res, next) => {
    try {
      const writer = req.currentUserId;
      const { 
        type,
        receiver,
        title,
        content,
      } = req.body;

      const createdPost = await PostService.addPost({
        type,
        writer,
        receiver,
        title,
        content,
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

/** POST /posts/:postId/img - 사진 넣는 API 
 * body : type,
 *        receiver,
 *        title,
 *        content,
 * file : postImg
 */
postRouter.post(
  "/posts/:postId/img",
  login_required,
  postImageUpload.single("postImg"),
  async (req, res, next) => {
    try {
      const writer = req.currentUserId;
      const postId = req.params.postId;
      const title = null;
      const content = null;
      const postImg = req.file?.location ?? null;

      const toUpdate = {
        title,
        content,
        postImg,
      };
      console.log(toUpdate);
      const updatedPost = await PostService.setPost({
        writer,
        postId,
        toUpdate,
      });

      if (updatedPost.errorMessage) {
        const body = {
          success: false,
          error: updatedPost.errorMessage,
        };

        return res.status(updatedPost.status).send(body);
      }

      const body = {
        success: true,
        payload: updatedPost,
      };

      return res.status(200).send(body);
    } catch (err) {
      next(err);
    }
  }
);

/** GET /posts - 전체 글 읽기 API (후기, 문의, 공구에서 활용)
 * query : 
 *      receiver
 *      type : review / cs / groupChat
 */
postRouter.get(
  "/posts",
  [
    query("receiver")
      .exists()
      .withMessage("query에 receiver를 입력해주세요.")
      .bail(),
    query("type")
      .exists()
      .withMessage("query에 type을 입력해주세요.")
      .bail(),
    validate,
  ],
  async (req, res, next) => {
    try {
      const { receiver, type } = req.query;
      const postList = await PostService.getPostList({ receiver, type });

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
``
      return res.status(200).json(body);
    } catch (err) {
      next(err);
    }
  }
);

/** GET /posts/:postId - 글 하나 읽기 API (후기, 문의에서 활용 / 공구는 전체 글 읽기로 가능)
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

        return res.status(post.status).send(body);
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

/** PUT /posts/:postId - 글 수정 API 
 * params: postId
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
        
        return res.status(updatedPost.status).send(body);
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

/** DELETE /posts/:postId - 글 삭제 API 
 * params: postId
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

      const deletedPost = await PostService.deletePost({ writer, postId });

      if (deletedPost.errorMessage) {
        const body = {
          success: false,
          error: deletedPost.errorMessage,
        }
        
        return res.status(deletedPost.status).send(body);
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

/** 내가 쓴 글 모아보기 함수
 * param: writer, 
 *        option : review / cs / groupChat / comment
 *
 */
postRouter.get(
  "/posts/:writer/:option",
  login_required,
  [
    check("writer")
      .trim()
      .isLength()
      .exists()
      .withMessage("parameter 값으로 writer를 입력해주세요.")
      .bail(),
    check("option")
      .trim()
      .isLength()
      .exists()
      .withMessage("parameter 값으로 option를 입력해주세요.")
      .bail(),
    validate,
  ],
  async (req, res, next) => {
    try { 
      const userId = req.currentUserId;
      const writer = req.params.writer;
      const option = req.params.option;
      const reply  = req.query.reply ?? null;

      const postList = await PostService.getPostListByWriter({ userId, writer, option, reply });

      if (postList.errorMessage) { 
        const body = {
          success: false,
          error: postList.errorMessage,
        }

        return res.status(403).send(body);
      }

      const body = {
        success: true,
        payload: postList,
      }

      return res.status(200).send(body);
    } catch (err) {
      next(err);
    }
  }
);

postRouter.get(
  "/review",
  async (req, res, next) => { 
    const reviewList = await PostService.getReviewList();
    return res.status(200).send(reviewList);
  }
)


export { postRouter };

