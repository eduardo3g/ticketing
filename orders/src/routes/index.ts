import express, { Request, Response } from 'express';
import { requireAuth } from '@e3gtickets/common';
import { Order } from '../models/Order';

const router = express.Router();

router.get('/api/orders', requireAuth, async (
  request: Request, response: Response
) => {
  const orders = await Order.find({
    userId: request.currentUser!.id,
  }).populate('ticket');

  response.send(orders);
});

export { router as indexOrderRouter };