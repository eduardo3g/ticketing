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
import { Payment } from '../models/Payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper'; 

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

    const charge = await stripe.charges.create({
      currency: 'brl',
      amount: order.price * 100, // multiply by 100 because stripe works smallest currency unit (e.g: cents, centavos)
      source: token,
      description: `Charge created by the order ${orderId} at ${new Date().toISOString()}`
    });

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });

    await payment.save();

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    response.status(201).send({ id: payment.id });
});

export { router as createChargeRouter };