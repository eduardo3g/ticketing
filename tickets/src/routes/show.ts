import express, { Request, Response } from 'express';
import { NotFoundError } from '@e3gtickets/common';
import { Ticket } from '../models/Ticket';

const router = express.Router();

router.get('/api/tickets/:id', async (request: Request, response: Response) => {
  const ticket = await Ticket.findById(request.params.id);

  if (!ticket) {
    throw new NotFoundError();
  }

  response.send(ticket);
});

export { router as showTicketRouter };