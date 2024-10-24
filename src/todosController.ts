import { Router } from 'express';

export const todosController = Router();

todosController.get('/todos', async (req, res) => {
  const todos = req.ctx.todosRepository.findAll();

  res.send(todos.map((todo) => todo.toJSON()));
});
