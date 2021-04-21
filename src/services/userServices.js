import User from '../models/index';

export default class UserService {
  static async createUser(userDetails) {
    try {
      return await User.create(userDetails);
    } catch (error) {
      return error;
    }
  }

  static async findUser(email) {
    try {
      return await User.findOne({ email });
    } catch (error) {
      return error;
    }
  }

  static async findById(_id) {
    try {
      return await User.findOne({ _id });
    } catch (error) {
      return error;
    }
  }

  static async updateUserProfile(_id, updateDetails) {
    try {
      return await User.findByIdAndUpdate(_id, updateDetails, { new: true });
    } catch (error) {
      return error;
    }
  }
}
