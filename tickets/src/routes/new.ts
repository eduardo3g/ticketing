import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@e3gtickets/common';

const router = express.Router();

router.post('/api/tickets', requireAuth, [
  body('title')
    .not()
    .isEmpty()
    .withMessage('Title is required'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be greater than 0'), 
], validateRequest, (request: Request, response: Response) => {
  response.sendStatus(200);
});

export { router as createTicketRouter };