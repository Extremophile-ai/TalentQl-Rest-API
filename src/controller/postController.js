import { PostsService, UserService } from '../services/index';

const { findById } = UserService;
const {
  publishNewPost,
  editPost,
  findPostById,
  deletePost
} = PostsService;

export default class PostController {
  static async createNewPost(req, res) {
    try {
      const { _id } = req.decoded.user;
      const { post } = req.body;
      const getUser = await findById(_id);
      if (getUser) {
        const postDetails = { post };
        await publishNewPost(_id, postDetails);
        return res.status(200).json({
          success: true,
          message: 'post published.'
        });
      }
      return res.status(400).json({
        success: false,
        error: 'an error occured.'
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
      if (getPost.posts[0]._id == postId) {
        return res.status(200).json({
          success: true,
          message: 'post retrieved.',
          data: getPost
        });
      }
      return res.status(404).json({
        success: false,
        error: 'post not found.'
      });
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
      const findUser = await findById(_id);
      if (findUser) {
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
      return res.status(400).json({
        success: false,
        error: 'sorry, an error occured.'
      });
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
      const destroyPost = await deletePost(_id, postId);
      if (destroyPost.nModified === 1) {
        return res.status(200).json({
          success: true,
          message: 'post deleted successfully.'
        });
      }
      return res.status(404).json({
        success: false,
        error: 'post not found.'
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: 'server error.',
      });
    }
  }
}
