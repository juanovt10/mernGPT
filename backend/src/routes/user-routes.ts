import { Router } from 'express'
import { getAllUsers, userSignup, userLogin } from '../controllers/user.controllers.js';
import { validate, signupValidator, loginValidator } from "../utils/validators.js";

const userRoutes = Router();

userRoutes.get('/', getAllUsers)

// here the validator is applied between the endpoint and the controller
userRoutes.post('/signup', validate(signupValidator) , userSignup)
userRoutes.post('/login', validate(loginValidator) , userLogin)

export default userRoutes;



