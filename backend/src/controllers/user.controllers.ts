import { NextFunction, Request, Response } from "express-serve-static-core";
import User from "../models/User.js";
import { hash, compare } from 'bcrypt';
import { createToken } from '../utils/token-manager.js'
import { COOKIE_NAME } from "../utils/constants.js";

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

      // Check if the email is already in the database
      const exisitingUser = await User.findOne({ email })
      if (exisitingUser) return res.status(401).send("User already registered")
      
      // encrypt the password recieved from the client 
      // the 10 is the amount of rounds -> the more the harder (the longer it takes too)
      const hashedPassword = await hash(password, 10)
      
      // create a new instance with the info from the request
      // give the hashedPassword value to the password to save the 
      // encrypted one in the database 
      const user = new User({ name, email, password: hashedPassword })
      
      // save the new instance
      await user.save();

      // clears and assign tokens to users -> see login method for more detail
      res.clearCookie(COOKIE_NAME, {
        path: '/',
        domain: "localhost",
        httpOnly: true,
        signed: true,
      });

      const token = createToken(user._id.toString(), user.email, '7d');
      const expires = new Date();
      expires.setDate(expires.getDate() + 7)
      res.cookie(COOKIE_NAME, token, {
        path: '/',
        domain: "localhost",
        expires,
        httpOnly: true,
        signed: true,
      });
      
      return res.status(201).json({ message: "OK", id: user._id.toString() })
      
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: "ERROR", cause: error.message })
    }
  };
  
  export const userLogin = async (
    req:Request,
    res:Response,
    next: NextFunction,
    ) => {
      try {
        // user login
        
        // destructrue the request body
        const { email, password } = req.body;

        // check if the user exists
        const user = await User.findOne({ email })
        if (!user) {
          return res.status(401).send("User not registered")
        }
        
        // check if the password is correct with the compare method of bcrypt
        // the first argument is the destructure data of the client (actual password)
        // the second argument will check it with the one of the database without decryption
        const isPaswordCorrect = await compare(password, user.password)
        if (!isPaswordCorrect) {
          return res.status(403).send("Incorrect password")
        }


        // this removes the exisiting user cookies and proceed to add the new ones
        res.clearCookie(COOKIE_NAME, {
          path: '/',
          domain: "localhost",
          httpOnly: true,
          signed: true,
        });

        // get the create token method and assing
        // the values of the validated request
        const token = createToken(user._id.toString(), user.email, '7d');

        // create the expiry date by adding 7 days
        const expires = new Date();
        expires.setDate(expires.getDate() + 7)

        // give the cookie back to the front end
        res.cookie(COOKIE_NAME, token, {
          path: '/',
          domain: "localhost",
          expires,
          httpOnly: true,
          signed: true,
        });


        return res.status(200).json({ message: "OK", id:user._id.toString() })
      } catch (error) {
      console.log(error)
      return res.status(500).json({ message: "ERROR", cause: error.message })
    }
};



