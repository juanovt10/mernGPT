import { Router } from 'express'
import { getAllUsers, userSignup } from '../controllers/user.controllers.js';
import { validate, signupValidator } from "../utils/validators.js";

const userRoutes = Router();

userRoutes.get('/', getAllUsers)

// here the validator is applied between the endpoint and the controller
userRoutes.post('/signup', validate(signupValidator) , userSignup)

export default userRoutes;



