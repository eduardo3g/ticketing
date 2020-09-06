import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@e3gtickets/common';
import { Ticket } from '../models/Ticket';

const router = express.Router();

router.post('/api/tickets', requireAuth, [
  body('title')
    .not()
    .isEmpty()
    .withMessage('Title is required'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be greater than 0'), 
], validateRequest, async (request: Request, response: Response) => {
  const { title, price } = request.body;

  const ticket = Ticket.build({
    title,
    price,
    userId: request.currentUser!.id,
  });

  await ticket.save();

  response.status(201).send(ticket);
});

export { router as createTicketRouter };