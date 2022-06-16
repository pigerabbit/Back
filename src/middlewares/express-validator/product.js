import { check, body, query } from "express-validator";
import { validate, notFoundValidate } from "../validator";

export default {
  checkProductId: [
    check("id")
      .trim()
      .isLength()
      .exists()
      .withMessage("parameter 값으로 상품의 아이디를 입력해주세요.")
      .bail(),
    notFoundValidate,
    validate,
  ],
  checkUserId: [
    check("userId")
      .trim()
      .isLength()
      .exists()
      .withMessage("parameter 값으로 유저의 아이디를 입력해주세요.")
      .bail(),
    notFoundValidate,
    validate,
  ],
  categoryQuery: [
    query("page")
      .exists()
      .withMessage("query에 page 값을 입력해주세요.")
      .bail(),
    query("perPage")
      .exists()
      .withMessage("query에 perPage 값을 입력해주세요.")
      .bail(),
    query("option")
      .exists()
      .withMessage("query에 option 값을 입력해주세요.")
      .bail(),
    validate,
  ],
  searchQuery: [
    query("page")
      .exists()
      .withMessage("query에 page 값을 입력해주세요.")
      .bail(),
    query("perPage")
      .exists()
      .withMessage("query에 perPage 값을 입력해주세요.")
      .bail(),
    query("option")
      .exists()
      .withMessage("query에 option 값을 입력해주세요.")
      .bail(),
    query("search")
      .exists()
      .withMessage("query에 option 값을 입력해주세요.")
      .bail(),
    validate,
  ],
};