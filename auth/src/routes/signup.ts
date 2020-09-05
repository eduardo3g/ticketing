import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest, BadRequestError } from '@e3gtickets/common';

import { User } from '../models/User';

const router = express.Router();

router.post('/api/users/signup', [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters')
  ],
  validateRequest,
  async (request: Request, response: Response) => {
  const { email, password } = request.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError('Email in use');
  }

  const user = User.build({ email, password });
  await user.save();

  const userJwt = jwt.sign(
    {
    id: user.id,
    email: user.email,
    },
    process.env.JWT_KEY!,
  );

  // Store JWT on session object
  request.session = {
    jwt: userJwt,
  };

  return response.status(201).send(user);
});

export { router as signupRouter };