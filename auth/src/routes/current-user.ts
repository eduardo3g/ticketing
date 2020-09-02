import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/api/users/currentuser',
  (request: Request,response: Response) => {
    if (!request.session?.jwt) {
      return response.send({ currentUser: null })
    }

    try {
      const payload = jwt.verify(
        request.session.jwt,
        process.env.JWT_KEY!,
      );

      response.send({ currentUser: payload });
    } catch (error) {
      response.send({ currentUser: null });
    }
});

export { router as currentUserRouter };