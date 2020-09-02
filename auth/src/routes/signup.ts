import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../models/User';
import { RequestValidationError } from '../errors/request-validation-error';
import { BadRequesError } from '../errors/bad-request-error';

const router = express.Router();

router.post('/api/users/signup', [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters')
  ], async (request: Request, response: Response) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  const { email, password } = request.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequesError('Email in use');
  }

  const user = User.build({ email, password });
  await user.save();

  const userJwt = jwt.sign({
    id: user.id,
    email: user.email,
  }, 'dj13çljesaud9031ewdnsa');

  // Store JWT on session object
  request.session = {
    jwt: userJwt,
  };

  return response.status(201).send(user);
});

export { router as signupRouter };