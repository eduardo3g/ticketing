import { Request, Response, NextFunction } from 'express';
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

export const errorHandler = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (error instanceof RequestValidationError) {
    console.log('Handling this error as a request validation error');
  }

  if (error instanceof DatabaseConnectionError) {
    console.log('Handling this error as a request db connection error');
  }

  response.status(400).send({
    message: error.message,
  });
};