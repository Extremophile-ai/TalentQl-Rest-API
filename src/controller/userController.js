import argon2 from 'argon2';
import UserService from '../services/userServices';
import JWTHelper from '../utility/jwt';
import {
//   emailValidation,
  signupValidation,
  loginValidation,
//   passwordValidation,
} from '../validation/userValidation';

const {
//   getUsers,
  createUser,
  findUser,
//   findById,
//   updateUser,
//   deleteUser,
} = UserService;

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
      }
    } catch (error) {
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
}
