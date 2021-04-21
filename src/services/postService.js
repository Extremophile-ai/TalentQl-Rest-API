import User from '../models/index';

export default class PostsService {
  static async getAllPosts() {
    try {
      return await User.find({});
    } catch (error) {
      return error;
    }
  }

  static async publishNewPost(_id, postDetails) {
    try {
      return await User.updateOne(
        { _id },
        {
          $addToSet: {
            posts: [
              postDetails
            ]
          }
        },
        {
          new: true
        }
      );
    } catch (error) {
      return error;
    }
  }

  static async editPost(_id, postId, editDetails) {
    try {
      return await User.updateOne(
        {
          _id,
          posts: {
            $elemMatch: {
              _id: postId,
            },
          },
        },
        {
          $set: {
            'posts.$.post': editDetails.post,
          },
        },
        {
          new: true,
        },
      );
    } catch (error) {
      return error;
    }
  }

  static async findPostById(_id, postId) {
    try {
      return await User.findOne({ _id }).select(
        {
          posts: {
            $elemMatch: { _id: postId },
          },
        },
      );
    } catch (error) {
      return error;
    }
  }

  static async viewOtherUsersPost(postId) {
    try {
      return await User.find({
        'posts._id': postId
      });
    } catch (error) {
      return error;
    }
  }

  static async deletePost(_id, postId) {
    try {
      return await User.updateOne({ _id }, {
        $pull: {
          posts: { _id: postId },
        },
      });
    } catch (error) {
      return error;
    }
  }
}
