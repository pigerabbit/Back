import { Router } from "express";
import { validate } from "../middlewares/validator.js";
import { check, param, body, query } from "express-validator";
import { login_required } from "../middlewares/login_required";

import { postController } from "../controllers/postController"; 

const { postImageUpload } = require("../utils/s3");

const postRouter = Router();

/** POST /posts - 글 생성 API 
 * 
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
  postController.createPost
);

/** POST /posts/:postId/img - 사진 넣는 API 
 * 
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
  postController.createPostImg
);

/** GET /posts - 전체 글 읽기 API (후기, 문의, 공구에서 활용)
 * 
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
  postController.getPostList
);

/** GET /posts/:postId - 글 하나 읽기 API (후기, 문의에서 활용 / 공구는 전체 글 읽기로 가능)
 * 
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
  postController.getPost
);

/** PUT /posts/:postId - 글 수정 API 
 * 
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
  postController.editPost
);

/** DELETE /posts/:postId - 글 삭제 API 
 * 
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
  postController.deletePost
);

/** 내가 쓴 글 모아보기 함수
 * 
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
  postController.getMyPosts
);

postRouter.get(
  "/review",
  postController.getReviewList
)


export { postRouter };