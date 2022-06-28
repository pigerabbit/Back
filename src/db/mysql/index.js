// "use strict";

// import Sequelize from "sequelize";
// import postsShema from "./schemas/posts.js";
// import dotenv from "dotenv";
import sequelize from 'sequelize';
import postsShema from "./schemas/posts.js";


// dotenv.config();
// const db = {};

// let sequelize = new Sequelize({
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWD,
//   database: process.env.DB_DB_NAME,
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   dialect: "mysql",
// });

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Posts = postsShema(sequelize, Sequelize);
console.log("db", db);

module.exports = db;

