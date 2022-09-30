import {StatusCodes} from 'http-status-codes';

class GeneralError extends Error {
  message: string;

  constructor(message: string) {
    super();
    this.message = message;
  }

  getErrorCode() {
    if (this instanceof BadRequest) {
      return StatusCodes.BAD_REQUEST;
    } if (this instanceof NotFound) {
      return StatusCodes.NOT_FOUND;
    } if (this instanceof UnAuthorized) {
      return StatusCodes.UNAUTHORIZED;
    } if (this instanceof Forbidden) {
      return StatusCodes.FORBIDDEN;
    } if (this instanceof Gone) {
      return StatusCodes.GONE;
    }

    return 500;
  }
}

class BadRequest extends GeneralError {}
class NotFound extends GeneralError {}
class UnAuthorized extends GeneralError {}
class Forbidden extends GeneralError {}
class Gone extends GeneralError {}

export {
  GeneralError as default, BadRequest, NotFound, UnAuthorized, Forbidden, Gone,
};
