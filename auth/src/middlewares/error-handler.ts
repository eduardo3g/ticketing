import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log('Something went wrong.', error);

  response.status(400).send({
    message: error.message,
  });
};