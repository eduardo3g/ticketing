import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus
} from '@e3gtickets/common';
import { stripe } from '../stripe';
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
  validateRequest,
  async (request: Request, response: Response) => {
    const { token, orderId } = request.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== request.currentUser!.id) {
      throw new NotAuthorizedError(); 
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for an cancelled order');
    }

    await stripe.charges.create({
      currency: 'BRL',
      amount: order.price * 100, // multiply by 100 because stripe works with cents
      source: token,
    });

    response.send({ success: true });
});

export { router as createChargeRouter };