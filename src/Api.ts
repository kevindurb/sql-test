import { createServer } from 'node:http';
import type { Server, IncomingMessage, ServerResponse } from 'node:http';
import type { Path } from 'path-parser';
import { HttpError, NotFound } from './HttpError.js';

type AsyncRequestHandler = (
  req: IncomingMessage,
  res: ServerResponse,
) => Promise<void> | void;

type HttpMethod = 'GET';

export class Api {
  private server: Server;
  private routes: Array<{
    method: HttpMethod;
    path: Path;
    cb: AsyncRequestHandler;
  }> = [];

  constructor() {
    this.server = createServer(this.handleRequest.bind(this));
  }

  private async handleRequest(req: IncomingMessage, res: ServerResponse) {
    try {
      const route = this.routes.find(
        ({ path, method }) =>
          req.url && method === req.method && path.test(req.url),
      );

      if (!route) throw new NotFound();

      route.cb(req, res);
    } catch (err) {
      console.error(err);
      if (!(err instanceof HttpError)) {
        res
          .writeHead(500, { 'content-type': 'application/json' })
          .end({ error: 'Server Error' });
      } else {
        res
          .writeHead(err.code, { 'content-type': 'application/json' })
          .end({ error: err.message });
      }
    }
  }

  public async listen() {
    this.server.listen(1337);
  }

  public async pushRoute(
    method: HttpMethod,
    path: Path,
    cb: AsyncRequestHandler,
  ) {
    this.routes.push({ method, path, cb });
  }
}
