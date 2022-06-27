const cors = require("cors");
const express = require("express");
const db = require("./models/index.js");
const { QueryTypes } = db.Sequelize;
const app = express();

/**
 * sync() : 지금 연결되어 있는 데이터베이스를 코드에 정의되어 있는 모델로 동기화를 할 것이냐?
 * alter() :
 * force() : 기존 데이터 삭제
 */
db.sequelize
  .sync({ force: true })
  .then(() => {
    console.log("데이터베이스가 성공적으로 연결되었습니다.");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello, world!!!");
});

app.get("/posts", async (req, res) => {
  //   await db.Posts.update(
  //     { title: "미국" },
  //     {
  //       where: { postId: "1q2w3e4r" },
  //     }
  //   );
  //   console.log("***************");
  //   await db.Posts.update(
  //     { writer: "0000-0000-0000" },
  //     {
  //       where: { type: "comment" },
  //     }
  //   );
  //   await db.Posts.create({
  //     postId: "1234",
  //     type: "review",
  //     writer: "0000",
  //     receiver: "1111",
  //     title: "한국",
  //     content: "내용",
  //     postImg: "www.naver.com",
  //     reply: 1,
  //   });

  console.log("***************");

  // 하나를 읽는데 타입만 읽어오기
  const type = await db.Posts.findAll({
    attributes: ["type"],
    where: { postId: "1234" },
  });

  console.log("type ===>", type);
  await db.Posts.destroy({
    where: {
      postId: "1q2w3e4r",
    },
  });

  const posts = await db.sequelize.query(
    `
        SELECT postImg, postId FROM posts
    `,
    {
      type: QueryTypes.SELECT,
      raw: true,
    }
  );

  //   const posts = await db.Posts.findAll();
  //   console.log("이전", posts);

  return res.status(200).send(posts);
});

module.exports = app;
