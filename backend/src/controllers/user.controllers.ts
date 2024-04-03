import { NextFunction, Request, Response } from "express-serve-static-core";
import User from "../models/User.js";
import { hash } from 'bcrypt';

export const getAllUsers = async (
  req:Request,
  res:Response,
  next: NextFunction,
  ) => {
    try {
      // get all users
      const users = await User.find();

      return res.status(200).json({ message: "OK", users })

    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: "ERROR", cause: error.message })
    }
};

export const userSignup = async (
  req:Request,
  res:Response,
  next: NextFunction,
  ) => {
    try {
      // user signup

      // destructrue the request body
      const { name, email, password } = req.body;

      // encrypt the password recieved from the client 
      // the 10 is the amount of rounds -> the more the harder (the longer it takes too)
      const hashedPassword = await hash(password, 10)

      // create a new instance with the info from the request
      // give the hashedPassword value to the password to save the 
      // encrypted one in the database 
      const user = new User({ name, email, password: hashedPassword })
      
      // save the new instance
      await user.save();
      
      return res.status(200).json({ message: "OK", id: user._id.toString() })

    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: "ERROR", cause: error.message })
    }
};

