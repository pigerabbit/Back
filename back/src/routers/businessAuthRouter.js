import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { userService } from "../services/userService";
import { validate, notFoundValidate } from "../middlewares/validator";
import { check, body, query } from "express-validator";
const request = require('request');

require("dotenv").config();

const businessAuthRouter = Router();


/** 사업자 인증 API
 * 
 * body
 *    businessName : 상점 이름
 *    b_no : 사업자 등록 번호
 *    p_no : 대표자 성명
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
      .withMessage("businessName을 입력해주세요.")
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
  async (req, res, next) => {
    const myaddr = `http://api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey=${process.env.OPEN_API_SERVICE_KEY}`;
    const userId = req.currentUserId;
    const id = req.params.id;

    if (userId !== id) {
      const body = {
        success: false,
        error: "사업자 인증은 로그인한 유저, 본인만 가능합니다.",
      }

      return res.status(403).send(body);
    }

    const businessName = req.body.businessName;
    const b_no = req.body.b_no;
    const p_nm = req.body.p_nm;
    const start_dt = req.body.start_dt;
    const businesses = [{
      "b_no": b_no,
      "p_nm": p_nm,
      "start_dt": start_dt,
    }];

    const options = {
      uri: myaddr,
      method: 'POST',
      body: {
        businesses: businesses,
      },
      json: true
    }

    request.post(options, async function (err, httpResponse, body) {
      if (body.data[0].valid === "01") {
        const toUpdate = {
          businessName,
          seller: true,
        };
        const newUser = await userService.setUser({ userId, toUpdate });

        const body = {
          success: true,
          message: "사업자 인증에 성공했습니다.",
          payload: newUser,
        }

        return res.status(200).send(body);
      } else {
        const body = {
          success: false,
          error: "사업자 인증에 실패했습니다.",
        }

        return res.status(400).send(body);
      }
    })
  }
);

export { businessAuthRouter };
