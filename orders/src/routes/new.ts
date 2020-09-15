import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/api/orders', async (
  request: Request, response: Response
) => {
  response.send({});
});

export { router as newOrderRouter };