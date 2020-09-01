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
    return response.status(error.statusCode).send({ errors: error.serializeErrors() });
  }

  if (error instanceof DatabaseConnectionError) {
    return response.status(error.statusCode).send({ errors: error.serializeErrors() });
  }

  response.status(400).send({
    errors: [{ message: 'Something went wrong' }]
  });
};