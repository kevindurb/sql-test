import { createServer } from 'node:http';
import type { Server, IncomingMessage, ServerResponse } from 'node:http';
import { Path } from 'path-parser';
import { BadRequest, HttpError, NotFound, ServerError } from './HttpError.js';
import { Response } from './Response.js';

interface Context<ParamsType extends unknown> {
  params: ParamsType;
}

type AsyncRequestHandler<ParamsType> = (
  req: IncomingMessage,
  context: Context<ParamsType>,
) => Promise<Response> | Response;

export class Api {
  private server: Server;
  private routes: Array<{
    method: string;
    path: Path;
    cb: AsyncRequestHandler<unknown>;
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

      const params = route.path.test(req.url) ?? {};

      const response = await route.cb(req, { params });
      console.log(response);
      response.writeToResponse(res);
    } catch (err) {
      console.error(err);
      if (!(err instanceof HttpError)) {
        new ServerError().toResponse().writeToResponse(res);
      } else {
        err.toResponse().writeToResponse(res);
      }
    } finally {
      if (!res.writableFinished) res.end();
    }
  }

  public async listen(port?: number, host?: string) {
    this.server.listen(port, host, () => {
      console.log('Listening...');
    });
  }

  public pushRoute(
    method: string,
    path: Path,
    cb: AsyncRequestHandler<unknown>,
  ) {
    this.routes.push({ method, path, cb });
  }

  public get<ParamsType>(path: string, cb: AsyncRequestHandler<ParamsType>) {
    this.pushRoute('GET', new Path(path), cb as AsyncRequestHandler<unknown>);
  }

  public post<ParamsType>(path: string, cb: AsyncRequestHandler<ParamsType>) {
    this.pushRoute('POST', new Path(path), cb as AsyncRequestHandler<unknown>);
  }
}
