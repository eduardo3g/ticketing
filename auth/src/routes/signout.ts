import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/api/users/signout',
  (request: Request, response: Response) => {
    request.session = null;

    response.send({});
});

export { router as signoutRouter };