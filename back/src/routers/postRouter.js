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
  // [
  //   body("type")
  //   .exists()
  //   .withMessage("글 타입을 입력해주세요.")
  //     .bail(),
  //   body("receiver")
  //   .exists()
  //   .withMessage("receiver를 입력해주세요")
  //   .bail(),
  //   body("content")
  //   .exists()
  //   .withMessage("content를 입력해주세요")
  //   .bail(),
  //   validate,
  // ],
  postImageUpload.single("postImg"),
  async (req, res, next) => {
    try {
      const sender = req.currentUserId;
      const { 
        type,
        receiver,
        title,
        content,
      } = req.body;

      const postImg = req.file?.location ?? null;

      const createdPost = await PostService.addPost({
        type,
        sender,
        receiver,
        title,
        content,
        postImg,
      });

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


/** GET /posts - 글 읽기 API 
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
      const postList = await PostService.listPost({ receiver });

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

/** PUT /posts/:id - 글 수정 API 
 * params: id
 * body : title,
 *        content,
 * file : postImg
*/
postRouter.put(
  "/posts/:postId",
  login_required,
  // [
  //   check("postId")
  //     .trim()
  //     .isLength()
  //     .exists()
  //     .withMessage("parameter 값으로 postId를 입력해주세요.")
  //     .bail(),
  //   body("content")
  //     .exists()
  //     .withMessage("content를 입력해주세요.")
  //     .bail(),
  //   validate,
  // ],
  postImageUpload.single("postImg"),
  async (req, res, next) => {
    try {
      const sender = req.currentUserId;
      const postId = req.params.postId;
      const title = req.body.title ?? null;
      const content = req.body.content ?? null;
      const postImg = req.file?.location ?? null;

      const toUpdate = {
        title,
        content,
        postImg,
      }

      const updatedPost = await PostService.setPost({ sender, postId, toUpdate });

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

export { postRouter };

