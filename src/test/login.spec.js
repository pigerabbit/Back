import { app } from "../app.js";
import request from "supertest";

describe('로그인 API POST /users/login', () => {
  // 테스트 카테고리를 나눈다. 
  // 어떤 API에 대해 200번대와 400번대 분류해서 테스트
  describe('Status Code 2XX', () => {
    test('발급 요청 성공 시 응답코드 200을 반환해야 한다', async () => { // 어떤 기능을 했을 때 이렇게 작동하길 기대하는지 test 안에 작성
      const body = {
        "email": "test30@test.com",
        "password": "1q2w3e4r"
      };
      const res = await request(app)
        .post(`/users/login`)
        .send(body);
      console.log("res.body", res.body);
      expect(res.statusCode).toBe(200);
    });

    // 머릿속에서 기대하는 응답을 적는다.
    // test('요청 성공 시 body에 있는 token은 verify가 되어야 한다', async () => {
    //   const body = {
    //     ""
    //   }
    // });
  });

  describe("Status Code 4XX", () => {
    test('body에 email이 없을 경우 400 에러를 반환해야 한다.', async () => { 
      const body = {
        "password": "1q2w3e4r"
      };
      const res = await request(app)
        .post(`/users/login`)
        .send(body);
      expect(res.statusCode).toBe(400);
    })
  });

  describe("Status Code 4XX", () => {
    test('body에 password가 없을 경우 400 에러를 반환해야 한다.', async () => { 
      const body = {
        "email": "test30@test.com"
      };
      const res = await request(app)
        .post(`/users/login`)
        .send(body);
      expect(res.statusCode).toBe(400);
    })
  });
});