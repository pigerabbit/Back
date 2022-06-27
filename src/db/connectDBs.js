/**
 *
 * 이 모듈 이름은 connectDBs.js
 * 이 모듈이 하는 역할은
 * DB접속만 시켜주는 역할
 *
 * 있지 말아야 할 코드 : model import
 *
 * 있어야 할 코드 :
 * mongoose.connect().then(() => console.log('몽고 접속 성공'))
 * new Sequelize(config())
 *  export {mongo, sequelize}
 *
 * // app.js
 * import * as DBs from connectDBs.js
 */

// import { User } from "./mongodb/models/User";
// import { Group } from "./mongodb/models/Group";
// import { Product } from "./mongodb/models/Product";
// import { Toggle } from "./mongodb/models/Toggle";
// import { Topic } from "./mongodb/models/Topic";
// import { Payment } from "./mongodb/models/Payment";

import mongoose from "mongoose";
import Sequelize from "sequelize";
import redis from "redis";

dotenv.config();

console.log("====>", process.env.MONGO_DB_URL); // undefined

const MONGO_DB_URL =
  "mongodb+srv://pigerabbit:forcarrots!@pigerabbit.7lzg5.mongodb.net/?retryWrites=true&w=majority" ||
  "MongoDB 서버 주소가 설정되지 않았습니다.\n./db/index.ts 파일을 확인해 주세요.";

// console.log(MONGO_DB_URL);

mongoose.connect(MONGO_DB_URL);
const MONGODB = mongoose.connection;

MONGODB.on("connected", () =>
  console.log("정상적으로 MongoDB 서버에 연결되었습니다.  " + MONGO_DB_URL)
);
MONGODB.on("error", (error) =>
  console.error(
    "MongoDB 연결에 실패하였습니다...\n" + MONGO_DB_URL + "\n" + error
  )
);

// MYSQL 연결

// const MYSQLDB = {};

const sequelize = new Sequelize({
  username: process.env.MYSQL_DB_USERNAME,
  password: process.env.MYSQL_DB_PASSWD,
  database: process.env.MYSQL_DB_DB_NAME,
  host: process.env.MYSQL_DB_HOST,
  port: process.env.MYSQL_DB_PORT,
  dialect: "mysql",
});

sequelize
  .sync({ force: true })
  .then(() => {
    console.log("🐬 데이터베이스가 성공적으로 연결되었습니다.");
  })
  .catch((err) => {
    console.log(err);
  });

// MYSQLDB.sequelize = sequelize;
// MYSQLDB.Sequelize = Sequelize;
// MYSQLDB.Posts = postsSchema(sequelize, Sequelize);

// redis 연결
const redisClient = redis.createClient({
  host: process.env.REDIS_DB_HOST,
  port: process.env.REDIS_DB_PORT,
  // db: process.env.REDIS_DB,
  password: process.env.REDIS_PW,
});

redisClient.connect();
redisClient.on("error", (err) => {
  console.error(err);
});

redisClient.on("ready", () => {
  console.log("redis is ready");
});
