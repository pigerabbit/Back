import cors from "cors";
import express from "express";
const bodyParser = require("body-parser");
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { userRouter } from "./routers/userRouter";
import { alertRouter } from "./routers/alertRouter";
import { groupRouter } from "./routers/groupRouter";
import { productRouter } from "./routers/productRouter";
import { postRouter } from "./routers/postRouter";
import { businessAuthRouter } from "./routers/businessAuthRouter";
import { toggleRouter } from "./routers/toggleRouter";
import { locationRouter } from "./routers/locationRouter";

const app = express();

// CORS 에러 방지
app.use(cors());

// express 기본 제공 middleware
// express.json(): POST 등의 요청과 함께 오는 json형태의 데이터를 인식하고 핸들링할 수 있게 함.
// express.urlencoded: 주로 Form submit 에 의해 만들어지는 URL-Encoded 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));

// 기본 페이지
app.get("/", (req, res) => {
  res.send("안녕하세요, 픽어래빗-꿀호깡 입니다.");
});

// router, service 구현 (userAuthRouter는 맨 위에 있어야 함.)
app.use(userRouter);
app.use(alertRouter);
app.use(groupRouter);
app.use(productRouter);
app.use(postRouter);
app.use(businessAuthRouter);
app.use(toggleRouter);
app.use(locationRouter);

// 순서 중요 (router 에서 next() 시 아래의 에러 핸들링  middleware로 전달됨)
app.use(errorMiddleware);

// .env가 있는지 확인
["SERVER_PORT", "MONGODB_URL", "JWT_SECRET_KEY"].forEach((k) => {
  if (!(k in process.env)) {
    throw new Error(`.env 파일이 빠진 것 같아요! 체크체크!`);
  }
});

export { app };
