import { PostService } from "../services/postService";

const postController = {
  createPost: async (req, res, next) => {
    try {
      const writer = req.currentUserId;
      const {
        type,
        receiver,
        title,
        content,
      } = req.body;

      const createdPost = await PostService.addPost({
        type,
        writer,
        receiver,
        title,
        content,
      });
      
      // 서비스에서 throw error instanceof를 사용해서 에러가 맞다면 return res.status(status_code);
      if (createdPost.errorMessage) {
        const body = {
          success: false,
          error: createdPost.errorMessage,
        }

        return res.status(400).send(body);
      }

      const body = {
        success: true,
        payload: createdPost,
      };

      return res.status(201).json(body);
    } catch (err) {
      next(err);
    }
  },

  createPostImg: async (req, res, next) => {
    try {
      const writer = req.currentUserId;
      const postId = req.params.postId;
      const title = null;
      const content = null;
      const postImg = req.file?.location ?? null;

      const toUpdate = {
        title,
        content,
        postImg,
      };
      console.log(toUpdate);
      const updatedPost = await PostService.setPost({
        writer,
        postId,
        toUpdate,
      });

      if (updatedPost.errorMessage) {
        const body = {
          success: false,
          error: updatedPost.errorMessage,
        };

        return res.status(updatedPost.status).send(body);
      }

      const body = {
        success: true,
        payload: updatedPost,
      };

      return res.status(200).send(body);
    } catch (err) {
      next(err);
    }
  },

  getPostList: async (req, res, next) => {
    try {
      const { receiver, type } = req.query;
      const postList = await PostService.getPostList({ receiver, type });

      if (postList.errorMessage) {
        const body = {
          success: false,
          error: postList.errorMessage,
        }

        return res.status(400).send(body);
      }

      const body = {
        success: true,
        payload: postList,
      };
      ``
      return res.status(200).json(body);
    } catch (err) {
      next(err);
    }
  },

  getPost: async (req, res, next) => {
    try {
      const postId = req.params.postId;
      const userId = req.currentUserId;

      const post = await PostService.getPost({ postId, userId });

      if (post.errorMessage) {
        const body = {
          success: false,
          payload: post.errorMessage,
        }

        return res.status(post.status).send(body);
      }

      const body = {
        success: true,
        payload: post,
      }

      return res.status(200).send(body);
    } catch (err) {
      next(err);
    }
  },

  editPost: async (req, res, next) => {
    try {
      const writer = req.currentUserId;
      const postId = req.params.postId;
      const title = req.body.title ?? null;
      const content = req.body.content ?? null;
      const postImg = req.file?.location ?? null;

      const toUpdate = {
        title,
        content,
        postImg,
      }

      const updatedPost = await PostService.setPost({ writer, postId, toUpdate });

      if (updatedPost.errorMessage) {
        const body = {
          success: false,
          error: updatedPost.errorMessage,
        }
        
        return res.status(updatedPost.status).send(body);
      }

      const body = {
        success: true,
        payload: updatedPost,
      }

      return res.status(200).send(body);
    } catch (err) {
      next(err);
    }
  },

  deletePost: async (req, res, next) => {
    try {
      const writer = req.currentUserId;
      const postId = req.params.postId;

      const deletedPost = await PostService.deletePost({ writer, postId });

      if (deletedPost.errorMessage) {
        const body = {
          success: false,
          error: deletedPost.errorMessage,
        }
        
        return res.status(deletedPost.status).send(body);
      }

      const body = {
        success: true,
        payload: "성공적으로 삭제되었습니다.",
      }

      return res.status(200).send(body);
    } catch (err) {
      next(err);
    }
  },

  getMyPosts: async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const writer = req.params.writer;
      const option = req.params.option;
      const reply = req.query.reply ?? null;

      const postList = await PostService.getPostListByWriter({ userId, writer, option, reply });

      if (postList.errorMessage) {
        const body = {
          success: false,
          error: postList.errorMessage,
        }

        return res.status(403).send(body);
      }

      const body = {
        success: true,
        payload: postList,
      }

      return res.status(200).send(body);
    } catch (err) {
      next(err);
    }
  },

  getReviewList: async (req, res, next) => {
    const reviewList = await PostService.getReviewList();
    return res.status(200).send(reviewList);
  },
};


export { postController };