import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/api/tickets', (request: Request, response: Response) => {
  response.sendStatus(200);
});

export { router as createTicketRouter };