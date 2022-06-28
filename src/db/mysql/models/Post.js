import { posts } from "../schemas/post.js";
import { db, sequelize } from "../../connectDBs";
import { Sequelize } from 'sequelize';

// // db.Posts = require("../schemas/post.js")(sequelize, Sequelize);

const Posts = require('../schemas/post.js')(sequelize, Sequelize.DataTypes);

console.log('*******')
// console.log(Posts instanceof Object)

// for (const [key, value] of Object.entries(Posts)){
//   console.log(key,value)
// }


class Post {
  /** 1. 글 생성 함수
   *
   * @param {Object} newPost - 생성할 글 데이터가 담긴 오브젝트
   * @returns {Object} createNewPost
   */
  static async create({ newPost }) {
    console.log("여기!");
    // const createNewPost = await sequelize.query(`
    //   INSERT INTO posts (postId) VALUES ('test2');
    // `,  {
    //   type: Sequelize.QueryTypes.INSERT,
    //   raw: true,
    // });
    const createNewPost = await Posts.create(newPost);
    return createNewPost;
  }

  /** 2. 글 남겨진 곳 검색 함수
   *
   * @param {String} receiver - 글이 남겨지는 곳
   * @param {String} type - review / cs
   * @returns {Object} postList
   */
  static async findPostList({ receiver, type }) {
  //   const postList = await PostModel.find(
  //     { receiver, type, removed: false }, //* where 
  //     { _id: 0, __v: 0, updatedAt: 0 }, //* select but, 0을 주었으므로 얘네들만 빼고 select
  //   )
  //     .sort({ createdAt: -1 })
  //     .lean();
    
  //!  처음부터 SELECT로 원하는 컬럼을 고르느냐, EXCEPT를 사용해서 빼느냐 어느 것이 성능 면에서 좋을지 궁금합니다! => 완전 다른 부분

    // 방법1.1
    // WHERE 절의 receiver = receiver와 같은 코드가 맞는걸까요..?
    // 앞의 receiver는 컬럼명, 뒤의 receiver는 받아온 변수명

    const postList11 = await sequelize.query(`
      SELECT * EXCEPT SELECT _id, __v, updatedAt
      FROM posts
      WHERE "receiver" = ${receiver}, type = type, removed = false
    `
      , {
          type: Sequelize.QueryTypes.INSERT,
          raw: true,
      }
    )
    return postList11;

    
    // 방법1.2
    // ${receiver}, removed = 0
    const postList12 = await sequelize(`
      SELECT postId, type, writer, receiver, title, content, postImg, commentCount, reply, removed
      FROM posts
      WHERE receiver = receiver, type = type, removed = false
    `)
    return postList12;

    // 방법2
    const postList2 = await PostModel.findAll({
      attributes: [
        'postId',
        'type',
        'writer',
        'receiver',
        'title',
        'content',
        'postImg',
        'commentCount',
        'reply',
      ], 
      where: {
        receiver,
        type,
        removed: 0,
      },
    });

    return postList2
  }

  /** 3. 글 남겨진 곳 검색 함수
   *
   * @param {String} receiver - 글이 남겨지는 곳
   * @param {String} type - review / cs
   * @returns {Object} postList
   */
  static async findCommentList({ receiver }) {
    // const postList = await PostModel.find(
    //   { receiver, removed: false },
    //   { _id: 0, __v: 0, updatedAt: 0 },
    // )
    //   .sort({ createdAt: -1 })
    //   .lean();

    const postList = await PostModel.findAll({
      attributes: [
        'postId',
        'type',
        'writer',
        'receiver',
        'title',
        'content',
        'postImg',
        'commentCount',
        'reply',
      ], 
      where: {
        receiver,
        removed: 0,
      },
    });
    
    return postList;
  } 
  
  /** 4. 글이 존재하는지 확인하는 함수
   * 
   * @param {String} postId - 글 id  
   * @returns {Object} post
   */
  static async findPostContent({ postId }) { 
    // const post = await PostModel.findOne(
    //   { postId },
    //   { _id: 0, __v: 0, updatedAt: 0 },
    // )
    //   .lean();

    const post = await PostModel.findOne({
      attributes: [
        'postId',
        'type',
        'writer',
        'receiver',
        'title',
        'content',
        'postImg',
        'commentCount',
        'reply',
      ],
      where: {
        postId,
      },
    });
    
    return post;
  }
  
  /** 5. 글 수정 함수
   * 
   * @param {String} postId - 글 id 
   * @param {Object} toUpdate - 글 업데이트 내용이 담긴 오브젝트
   * @returns {Object} updatedPost
   */
  static async update({ postId, toUpdate }) { 
    // const updatedPost = await PostModel.findOneAndUpdate(
    //   { postId: postId, removed: false, },
    //   { $set: toUpdate },
    //   { returnOriginal: false },
    // )
    //   .select('-__v')
    //   .select('-_id')
    //   .select('-updatedAt')
    //   .lean();

    const updatedPost = await Post.update(
      {
        toUpdate,
      },
      {
        where: {
          postId,
        }
      },
    ); 

    return updatedPost;
  }
  
  /** 6-9. 내가 쓴 글 모아보기 함수
   *
   * @param {String} writer - 글쓴이 
   * @returns {Object} postList
   */
  static async findPostListByWriter({ writer, option, reply }) {
    let postList = [];
    switch (option) { 
      case "review":
        // postList = await PostModel.find(
        //   { "type": option, writer, removed: false },
        //   { _id: 0, __v: 0, updatedAt: 0 },
        // )
        //   .sort({ createdAt: -1 })
        //   .lean();
        postList = await PostModel.findAll({
          attributes: [
            'postId',
            'type',
            'writer',
            'receiver',
            'title',
            'content',
            'postImg',
            'commentCount',
            'reply',
            'removed'
          ],
          where: {
            type: option,
            writer,
            removed: 0,
          },
        });
        return postList;
      case "cs":
        if (reply === null) {
          // postList = await PostModel.find(
          //   { "type": option, writer, removed: false },
          //   { _id: 0, __v: 0, updatedAt: 0 },
          // )
          //   .sort({ createdAt: -1 })
          //   .lean();
          postList = await PostModel.findAll({
            attributes: [
              'postId',
              'type',
              'writer',
              'receiver',
              'title',
              'content',
              'postImg',
              'commentCount',
              'reply',
              'removed'
            ],
            where: {
              type: option,
              writer,
              removed: 0,
            },
          });

          return postList;
        } else { 
          postList = await PostModel.find(
            { "type": option, writer, reply, removed: false },
            { _id: 0, __v: 0, updatedAt: 0 },
          )
            .sort({ createdAt: -1 })
            .lean();
          return postList;
        }
      case "comment":
        postList = await PostModel.find(
          { "type": option, writer, removed: false },
          { _id: 0, __v: 0, updatedAt: 0 },
        )
          .sort({ createdAt: -1 })
          .lean();
        return postList;
    }
    return postList;
  }

  /** 10. 리뷰 많은 순 정렬 함수
   * 
   */
  static async findProductSortByReviews() { 
    // let reviewList = await PostModel.aggregate([
    //   {
    //     $match:
    //       { type: 'review' },
    //   },
    //   {
    //     $group: {
    //       _id: "$receiver",
    //       total_pop: { $sum: 1 },
    //     },
    //   },
    // ]);

    // reviewList = reviewList.sort((a, b) => {
    //   return b.total_pop - a.total_pop;
    // });

    // console.log("reviewList", reviewList);

    const reviewList = await Posts.findAll({
      attributes: [
        'postId',
        [sequelize.fn("COUNT", sequelize.col("postId")), "reviewCount"],
      ],
      group: "receiver",
    });

    // const reviewList = await sequelize.query(`
    //   SELECT *, COUNT('receiver') AS "reviewCount"
    //   FROM posts
    //   WHERE type = "review"
    //   GROUP BY receiver
    //   ORDER BY reviewCount desc
    // `
    //   , {
    //     type: Sequelize.QueryTypes.SELECT,
    //     raw: true,
    //   });
    
    return reviewList;
  }
}

export { Post };
