import { Router } from "express";
import { PostService } from "../services/postService";
import { validate } from "../middlewares/validator.js";
import { check, param, body, query } from "express-validator";
import { login_required } from "../middlewares/login_required";

const { postImageUpload } = require("../utils/s3");

const postRouter = Router();

postRouter.post(
  "/posts",
  login_required,
  postImageUpload.single("postImg"),
  [
    body("type")
      .exists()
      .withMessage("댓글 내용을 입력해주세요.")
      .bail(),
    body("sender")
      .exists()
      .withMessage("닉네임을 입력해주세요.")
      .bail(),
    body("receiver")
      .exists()
      .withMessage("위치를 입력해주세요")
      .bail(),
    body("content")
      .exists()
      .withMessage("위치를 입력해주세요")
      .bail(),
    validate,
  ],
  async (req, res, next) => {
    try {
      const { 
        type,
        sender,
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

postRouter.get(
  "/posts",
  [
    query("receiver")
      .exists()
      .withMessage("query에 receiver 값을 입력해주세요.")
      .bail(),
    validate,
  ],
  async (req, res, next) => {
    try {
      const { receiver } = req.query;
      const postList = await PostService.listPost({ receiver });

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

export { postRouter };

