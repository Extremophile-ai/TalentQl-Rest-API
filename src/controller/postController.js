import { PostsService } from '../services/index';

const {
  publishNewPost,
  editPost,
  findPostById,
  deletePost,
  checkPost
} = PostsService;

export default class PostController {
  static async createNewPost(req, res) {
    try {
      const { _id } = req.decoded.user;
      const { post } = req.body;
      if (!post) {
        return res.status(400).json({
          error: true,
          message: 'Please include your text in the text field to continue.'
        });
      }
      const postDetails = { post };
      await publishNewPost(_id, postDetails);
      return res.status(200).json({
        success: true,
        message: 'post published.'
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: 'server error.',
      });
    }
  }

  static async getPost(req, res) {
    const { postId } = req.params;
    const { _id } = req.decoded.user;
    try {
      const getPost = await findPostById(_id, postId);
      if (getPost.posts.length <= 0) {
        return res.status(404).json({
          error: true,
          message: 'post not found.'
        });
      }
      if (getPost.posts[0]._id == postId) {
        return res.status(200).json({
          success: true,
          message: 'post retrieved.',
          data: getPost
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: 'server error.',
      });
    }
  }

  static async updatePost(req, res) {
    const { postId } = req.params;
    const { _id } = req.decoded.user;
    const { post } = req.body;
    try {
      if (!post) {
        return res.status(400).json({
          error: true,
          message: 'Please include your edit text in the text field to continue.'
        });
      } else {
        // confirm user owns a post he wants to edit
        const ownPost = await findPostById(_id, postId);
        if (ownPost.posts.length <= 0) {
          return res.status(401).json({
            error: true,
            message: "you're not allowed to edit this post."
          });
        } else {
          const editDetails = {
            post
          };
          await editPost(_id, postId, editDetails);
          return res.status(200).json({
            success: true,
            message: 'post editted successfully.',
            post: editDetails.post
          });
        }
      }
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: 'server error.',
      });
    }
  }

  static async removePost(req, res) {
    const { postId } = req.params;
    const { _id } = req.decoded.user;
    try {
      // check if post exist
      const findPost = await checkPost(postId);
      if (findPost.length === 0) {
        return res.status(404).json({
          error: true,
          message: 'post not found.'
        });
      } else {
        // check ownership of post to be deleted
        const ownPost = await findPostById(_id, postId);
        if (ownPost.posts.length <= 0) {
          return res.status(401).json({
            error: true,
            message: "you're not allowed to delete this post."
          });
        }
        const destroyPost = await deletePost(_id, postId);
        if (destroyPost.nModified === 1) {
          return res.status(200).json({
            success: true,
            message: 'post deleted successfully.'
          });
        }
      }
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: 'server error.',
      });
    }
  }
}
