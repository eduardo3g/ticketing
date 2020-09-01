import { CustomError } from './custom-error';

export class BadRequesError extends CustomError {
  statusCode = 400;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequesError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
};