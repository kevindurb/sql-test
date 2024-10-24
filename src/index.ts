import express from 'express';
import { withContext } from './context.js';
import { todosController } from './todosController.js';

const app = express();

app.use(withContext);

app.use(todosController);

app.listen(1337);
