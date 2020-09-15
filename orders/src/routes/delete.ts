import express, { Request, Response } from 'express';

const router = express.Router();

router.delete('/api/orders/:orderId', async (
  request: Request, response: Response
) => {
  response.send({});
});

export { router as deleteOrderRouter };