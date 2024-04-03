import { NextFunction, Request, Response } from 'express';
import { body, ValidationChain, validationResult } from 'express-validator';

// the params are the validator chain from express validator
export const validate = (validations: ValidationChain[]) => {
  return async (req:Request, res:Response, next: NextFunction) => {

    // iterate in the chain to process the request 
    for (let validation of validations) {
      const result = await validation.run(req);

      // if the results are not empty, break the loop
      if (!result.isEmpty()) {
        break;
      }
    }

    // then define the errors of the request
    const errors = validationResult(req);

    // if there are no errors, jump to the next validation
    if (errors.isEmpty()) {
      return next();
    } 

    // Return the errors if any
    return res.status(422).json({ errors: errors.array() })
}}

// then this is the validator of the user
// name cannot be empty 
// email is trimmed and must be an email
// password is trimmed and needs to be min 6 characters
export const loginValidator = [
  body("email").trim().isEmail().withMessage("Email is required"),
  body("password")
    .trim()
    .isLength({ min:6 })
    .withMessage("Password should contain a t least 6 characters"),
]

// basically just use the the ... notation to place the stuff
// of the login validation in this one to not DRY
export const signupValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  ...loginValidator,
]

