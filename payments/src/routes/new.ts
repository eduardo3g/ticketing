import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError
} from '@e3gtickets/common';
import { Order } from '../models/Order';

const router = express.Router();

router.post('/api/payments',
  requireAuth,
  [
    body('token')
      .not()
      .isEmpty()
      .withMessage('You must supply an token'),
    body('orderId')
      .not()
      .isEmpty()
      .withMessage('You must supply an order ID')
  ],
  async (request: Request, response: Response) => {
    response.send({ success: true });
});

export { router as createChargeRouter };