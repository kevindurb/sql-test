import { Router } from 'express';
import { TodoModel } from './TodoModel.js';
import { z } from 'zod';

const createTodoBodySchema = z
  .object({
    description: z.string(),
  })
  .strict();

export const todosController = Router();

todosController.get('/todos', async (req, res) => {
  const todos = req.ctx.todosRepository.findAll();

  res.send(todos.map((todo) => todo.toJSON()));
});

todosController.post('/todos', async (req, res) => {
  const body = createTodoBodySchema.parse(req.body);
  const todo = new TodoModel({ description: body.description });
  req.ctx.todosRepository.save(todo);
  res.send(todo.toJSON());
});
