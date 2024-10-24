import express from 'express';
import { withContext } from './context.js';
import { todosController } from './todosController.js';
import httpErrors from 'http-errors';
import * as zod from 'zod';

const app = express();

app.use(express.json());
app.use(withContext());
app.use(todosController);

app.use(
  (
    err: unknown,
    _: express.Request,
    res: express.Response,
    __: express.NextFunction,
  ) => {
    if (httpErrors.isHttpError(err)) {
      res.status(err.status).send(err.message);
    } else if (err instanceof zod.ZodError) {
      res.status(400).send(err.format());
    } else {
      res.status(500).send('Server Error');
    }
  },
);

app.listen(1337);
