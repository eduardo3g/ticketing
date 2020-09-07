import express, { Request, Response } from 'express';
import { Ticket } from '../models/Ticket';

const router = express.Router();

router.get('/api/tickets', async (request: Request, response: Response) => {
  const tickets = await Ticket.find({});

  response.send(tickets);
});

export { router as indexTicketRouter };