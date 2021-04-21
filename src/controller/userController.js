import argon2 from 'argon2';
import { PostsService, UserService } from '../services/index';
import JWTHelper from '../utility/jwt';
import {
  signupValidation,
  loginValidation,
} from '../validation/userValidation';

const {
  createUser,
  findUser,
  findById,
  updateUserProfile,
} = UserService;

const { getAllPosts, checkPost } = PostsService;

const { generateToken } = JWTHelper;

export default class UserController {
  static async createUser(req, res) {
    const { email, password } = req.body;
    try {
      const { error } = signupValidation({ email, password });
      if (error) {
        return res.status(400).json({
          error: true,
          message: error.message,
        });
      }
      const emailExist = await findUser(email.toLowerCase());
      if (emailExist) {
        return res.status(409).json({
          error: true,
          message: 'Sorry, an account is already registered with this email.',
        });
      }
      const hash = await argon2.hash(password);
      const userDetails = { email, password: hash };
      const newUser = await createUser(userDetails);
      //   select user data to encode with jwt
      const user = { _id: newUser._id, email: newUser.email };
      const token = await generateToken({ user });
      if (newUser) {
        return res.status(201).json({
          success: true,
          message: 'New user account created successfully.',
          token,
        });
      } else {
        return res.status(400).json({
          error: true,
          message: 'User not created'
        });
      }
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          status: 409,
          error: 'Sorry, data already exist.'
        });
      }
      return res.status(500).json({
        error: true,
        message: 'server error.',
      });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;
    try {
      const { error } = loginValidation({ email, password });
      if (error) {
        return res.status(400).json({
          error: true,
          message: error.message,
        });
      }
      const getUser = await findUser(email.toLowerCase());
      if (!getUser) {
        return res.status(404).json({
          error: true,
          message: 'Sorry, email does not exist.',
        });
      }
      const validatePassword = await argon2.verify(getUser.password, password);
      if (validatePassword === false) {
        return res.status(404).json({
          error: true,
          message: 'Sorry, password supplied is incorrect.',
        });
      }
      //   select user data to encode with jwt
      const user = { _id: getUser._id, email: getUser.email };
      const token = await generateToken({ user });
      return res.status(200).json({
        success: true,
        message: 'logged in successfully.',
        token,
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: 'server error.',
      });
    }
  }

  static async updateProfile(req, res) {
    try {
      const { _id } = req.decoded.user;
      const user = await findById(_id);
      if (!user) {
        return res.status(404).json({
          error: true,
          message: 'Please login to continue.',
        });
      }

      const updateUserDetails = await updateUserProfile(_id, req.body);
      if (updateUserDetails) {
        return res.status(200).json({
          success: true,
          message: 'Profile update was successful.',
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: 'server error.',
      });
    }
  }

  // to look at other people's post
  static async viewPost(req, res) {
    try {
      const { postId } = req.params;
      const posts = await checkPost(postId);
      if (!posts || (posts.length <= 0)) {
        return res.status(404).json({
          error: true,
          message: 'Sorry, this post does not exist or may have been deleted by the author.'
        });
      } else {
        const getPost = posts[0].posts;
        let postDetails = [];
        for (let i = 0; i < getPost.length; i++) {
          if (getPost[i]._id == postId) {
            const post = {
              _id: posts[0]._id,
              email: posts[0].email,
              postId: getPost[i]._id,
              post: getPost[i].post,
              date: getPost[i].createdAt
            };
            postDetails.push(post);
          }
        }
        return res.status(200).json({
          success: true,
          message: 'post retrieved successfully',
          postDetails
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: 'server error.',
      });
    }
  }

  // to get all post by other users
  static async postFeeds(req, res) {
    try {
      const getPosts = await getAllPosts();
      let posts = [];
      // Extract posts and relevant user details from all registered users
      for (let i = 0; i < getPosts.length; i++) {
        const post = {
          _id: getPosts[i]._id,
          email: getPosts[i].email,
          posts: getPosts[i].posts
        };
        posts.push(post);
      }
      let feeds = [];
      for (let j = 0; j < posts.length; j++) {
        for (let k = 0; k < posts[j].posts.length; k++) {
          // extract details of post to display
          const timeLine = {
            _id: posts[j]._id,
            email: posts[j].email,
            post: {
              _id: posts[j].posts[k]._id,
              post: posts[j].posts[k].post
            }
          };
            // create feed with timeline
          feeds.push(timeLine);
        }
      }
      if (feeds.length > 0) {
        return res.status(200).json({
          success: true,
          message: 'Feeds retrieved successfully',
          feeds
        });
      }
      return res.status(204).json({
        success: true,
        message: 'Sorry, you have no feed at this momment.'
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: 'server error.',
      });
    }
  }
}
