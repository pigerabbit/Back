//! 삭제할 것
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

import mongoose from "mongoose";
import { User } from "./mongodb/models/User";
import { Group } from "./mongodb/models/Group";
import { Product } from "./mongodb/models/Product";
import { Toggle } from "./mongodb/models/Toggle";
import { Topic } from "./mongodb/models/Topic";
import { Payment } from "./mongodb/models/Payment";
// import { Post } from "./mongodb/models/Post";
import { Post } from "./mysql/models/Post";

export { User, Group, Product, Toggle, Topic, Payment, Post };

/**
 * DB 스키마 정의, model export 하는 파일
 * DB 연결하는 파일 따로
 *
 * 파일 4개로 분리
 * 1. mongodb 접속하는 모듈
 * 2. mysql 접속하는 ㅁ도류
 * 3. mongodb model export 하는 모듈
 * 4. mysql model export 모듈
 */

//! 필요없는 index.js임! (삭제 예정)
