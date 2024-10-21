import { Path } from 'path-parser';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Handler, UnknownFunc } from './StackHandler.js';

interface Context {
  req: IncomingMessage;
  res: ServerResponse;
}

interface ContextWithParams extends Context {
  params: Record<string, unknown>;
}

export const get = (route: string, cb: Handler<ContextWithParams, unknown>) => {
  const path = new Path(route);

  return async ({ req, res }: Context, next: UnknownFunc | undefined) => {
    if (!req.url) return next?.();

    const match = path.test(req.url);
    if (!match) return next?.();
    return cb({ req, res, params: match }, next);
  };
};
