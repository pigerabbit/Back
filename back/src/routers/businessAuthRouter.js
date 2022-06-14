import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { validate, notFoundValidate } from "../middlewares/validator";
import { check, body, query } from "express-validator";

import { businessAuthController } from "../controllers/businessAuthController"

const businessAuthRouter = Router();


/** 사업자 인증 API
 * 
 * param
 *    userId : 유저 id
 * 
 * body
 *    businessName : 상점 이름
 *    businessLocation : 상점 주소
 *    b_no : 사업자 등록 번호
 *    p_nm : 대표자 성명
 *    start_dt : 개업 일자
 *    
*/
businessAuthRouter.post(
  "/users/:id/seller",
  login_required,
  [
    check("userId")
      .trim()
      .isLength()
      .exists()
      .withMessage("parameter 값으로 유저의 아이디를 입력해주세요.")
      .bail(),
    body("businessName")
      .exists()
      .isLength()
      .withMessage("판매 상점 이름을 입력해주세요.")
      .bail(),
    body("businessLocation")
      .exists()
      .isLength()
      .withMessage("사업장 주소를 입력해주세요.")
      .bail(),
    body("b_no")
      .exists()
      .isLength(10)
      .withMessage("b_no(사업자 등록 번호)를 입력해주세요.")
      .bail(),
    body("p_nm")
      .exists()
      .withMessage("p_nm(대표자 성명)를 입력해주세요")
      .bail(),
    body("start_dt")
      .exists()
      .withMessage("start_dt(개업 일자)를 입력해주세요")
      .bail(),
    validate,
  ],
  businessAuthController.isSeller
);

export { businessAuthRouter };
