import { posts } from "../schemas/post.js";
import { db, sequelize } from "../../connectDBs";
import { Sequelize } from 'sequelize';

// // db.Posts = require("../schemas/post.js")(sequelize, Sequelize);

const Posts = require('../schemas/post.js')(sequelize, Sequelize.DataTypes);

class Post {
  /** 1. 글 생성 함수
   *
   * @param {Object} newPost - 생성할 글 데이터가 담긴 오브젝트
   * @returns {Object} createNewPost
   */
  static async create({ newPost }) {
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
    const postList = await PostModel.findAll({
      where: {
        receiver,
        type,
        removed: 0,
      },
    });

    return postList
  }

  /** 3. 글 남겨진 곳 검색 함수
   *
   * @param {String} receiver - 글이 남겨지는 곳
   * @param {String} type - review / cs
   * @returns {Object} postList
   */
  static async findCommentList({ receiver }) {
    const postList = await Posts.findAll({
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
    const post = await Posts.findOne({
      where: {
        postId,
      },
    });

    //! 왜 안 돼! 위의 쿼리 사용,,,
    // let sql = 'SELECT * FROM posts WHERE postId = ?';
    // const post = await sequelize.query(sql, 
    //   [ postId ],
    // );

    // const post = await sequelize.query(`
    //   SELECT * 
    // FROM posts 
    // WHERE postId = ${postId}
    // `);
    
    return post;
  }
  
  /** 5. 글 수정 함수
   * 
   * @param {String} postId - 글 id 
   * @param {Object} toUpdate - 글 업데이트 내용이 담긴 오브젝트
   * @returns {Object} updatedPost
   */
  static async update({ postId, toUpdate }) { 
    let updatedPost = await Posts.update(
      toUpdate,
    {
      where: {
        postId,
      }
      }); 
    
    updatedPost = await Posts.findOne(
      {
        where: {
          postId,
        },
      }
    );
    
   //! 수정 필요 다른 쿼리로 날림,,,
    // updatedPost = await sequelize.query(`
    //   SELECT *
    //   FROM posts
    //   WHERE postId = ${postId}
    // `);

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
        postList = await Posts.findAll({
          where: {
            type: option,
            writer,
            removed: 0,
          },
        });
        return postList;
      case "cs":
        if (reply === null) {
          postList = await Posts.findAll({
            where: {
              type: option,
              writer,
              removed: 0,
            },
          });

          return postList;
        } else { 
          postList = await Posts.findAll({
            where: {
              type: option,
              writer,
              removed: 0,
            },
          });
          return postList;
        }
      case "comment":
        postList = await Posts.findAll({
          where: {
            type: option,
            writer,
            removed: 0,
          },
        });
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
