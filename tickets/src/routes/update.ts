import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError
} from '@e3gtickets/common';
import { Ticket } from '../models/Ticket';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  async (request: Request, response: Response) => {
  const ticket = await Ticket.findById(request.params.id);

  if (!ticket) {
    throw new NotFoundError();
  }

  if (ticket.userId !== request.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  response.send(ticket);
});

export { router as updateTicketRouter };