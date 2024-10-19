export class HttpError extends Error {
  constructor(
    public code: number,
    message: string,
  ) {
    super(message);
  }
}

export class BadRequest extends HttpError {
  constructor(message = 'Bad Request') {
    super(400, message);
  }
}

export class NotFound extends HttpError {
  constructor(message = 'Not Found') {
    super(404, message);
  }
}

export class ServerError extends HttpError {
  constructor(message = 'Server Error') {
    super(500, message);
  }
}
