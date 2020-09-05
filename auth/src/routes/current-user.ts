import express, { Request, Response } from 'express';
import { currentUser } from '@e3gtickets/common';

const router = express.Router();

router.get('/api/users/currentuser',
  currentUser,
  (request: Request,response: Response) => {
    return response.send({
      currentUser: request.currentUser || null,
    });
});

export { router as currentUserRouter };