import { createServer } from 'node:http';
import type { Server, IncomingMessage, ServerResponse } from 'node:http';
import { Path } from 'path-parser';
import { BadRequest, HttpError, NotFound } from './HttpError.js';

type AsyncRequestHandler = (
  req: IncomingMessage,
  res: ServerResponse,
) => Promise<void> | void;

export class Api {
  private server: Server;
  private routes: Array<{
    method: string;
    path: Path;
    cb: AsyncRequestHandler;
  }> = [];

  constructor() {
    this.server = createServer(this.handleRequest.bind(this));
  }

  private findRoute(method: string, path: string) {
    return this.routes.find(
      (route) =>
        method.toLowerCase() === route.method.toLowerCase() &&
        route.path.test(path),
    );
  }

  private async handleRequest(req: IncomingMessage, res: ServerResponse) {
    try {
      if (!req.method || !req.url) throw new BadRequest();

      const route = this.findRoute(req.method, req.url);

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

  public async listen(port?: number, host?: string) {
    this.server.listen(port, host, () => {
      console.log('Listening...');
    });
  }

  public pushRoute(method: string, path: Path, cb: AsyncRequestHandler) {
    this.routes.push({ method, path, cb });
  }

  public get(path: string, cb: AsyncRequestHandler) {
    this.pushRoute('GET', new Path(path), cb);
  }

  public post(path: string, cb: AsyncRequestHandler) {
    this.pushRoute('POST', new Path(path), cb);
  }
}
