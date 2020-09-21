import express, { Request, Response } from 'express';
import { requireAuth, NotFoundError, NotAuthorizedError } from '@e3gtickets/common';
import { Order } from '../models/Order';

const router = express.Router();

router.get('/api/orders/:orderId', requireAuth, async (
  request: Request, response: Response
) => {
  const order = await Order.findById(request.params.orderId).populate('ticket');

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== request.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  response.send(order);
});

export { router as showOrderRouter };