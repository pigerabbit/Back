import mongoose from "mongoose";
import { User } from "./models/User";
import { Group } from "./models/Group";
import { Product } from "./models/Product";
import { Post } from "./models/Post";
import { Toggle } from "./models/Toggle";
import { Topic } from "./models/Topic";
import { Payment } from "./models/Payment";
import * as Redis from "redis";

const DB_URL =
  process.env.MONGO_DB_URL ||
  "MongoDB 서버 주소가 설정되지 않았습니다.\n./db/index.ts 파일을 확인해 주세요.";

mongoose.connect(DB_URL);
const db = mongoose.connection;

db.on("connected", () =>
  console.log("정상적으로 MongoDB 서버에 연결되었습니다.  " + DB_URL)
);
db.on("error", (error) =>
  console.error("MongoDB 연결에 실패하였습니다...\n" + DB_URL + "\n" + error)
);

const redisClient = new Redis.createClient({
  host: process.env.REDIS_DB_HOST,
  port: process.env.REDIS_DB_PORT,
  // db: process.env.REDIS_DB,
  // password: process.env.REDIS_PW,
});

redisClient.connect();
redisClient.on("error", (err) => {
  console.error(err);
});

redisClient.on("ready", () => {
  console.log("redis is ready");
});

export { User, Group, Product, Post, Toggle, Topic, Payment };
