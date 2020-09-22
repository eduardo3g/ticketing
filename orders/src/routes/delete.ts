import express, { Request, Response } from 'express';
import { requireAuth, NotFoundError, NotAuthorizedError } from '@e3gtickets/common';
import { Order, OrderStatus } from '../models/Order';

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async (
  request: Request, response: Response
) => {
  const { orderId } = request.params;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== request.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  order.status = OrderStatus.Cancelled;

  await order.save();

  response.status(204).send({});
});

export { router as deleteOrderRouter };