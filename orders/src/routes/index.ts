import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/api/orders', async (
  request: Request, response: Response
) => {
  response.send({});
});

export { router as indexOrderRouter };