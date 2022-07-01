import { app } from "../app.js";
import request from "supertest";

describe("로그인 API POST /users/login", () => {
  describe("Status Code 2XX", () => {
    // 어떤 작동을 기대하는지 test 시작에 서술
    test("발급 요청 성공 시 응답코드 200을 반환해야 한다", async () => {
      const body = {
        email: "test40@test.com",
        password: "1q2w3e4r",
      };
      const response = await request(app).post(`/users/login`).send(body);
      console.log("response.body:", response.body);
      expect(response.statusCode).toBe(200);
    });

    // test("요청 성공시 body에 있는 jwt는 verified가 되야 한다", )

    // 머릿속에서 기대하는 응답을 적는다.
  });

  describe("Status Code 4XX", () => {
    // test case는 최대한 분리해서 작성해야 한다. (ex: body에 email과 password가 없는 경우 ~ (x))
    test("body에 email이 없을 경우 200을 반환해야 한다", async () => {
      const body = {
        password: "1q2w3e4r",
      };
      const response = await request(app).post(`/users/login`).send(body);
      expect(response.statusCode).toBe(200);
    });
  });
});
