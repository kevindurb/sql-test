import { Handler } from 'express';
import { TodosRepository } from './TodosRepository.js';
import sqlite from 'better-sqlite3';
import type { Database } from 'better-sqlite3';

interface RequestContext {
  db: Database;
  todosRepository: TodosRepository;
}

declare global {
  namespace Express {
    interface Request {
      ctx: RequestContext;
    }
  }
}

const db = sqlite('./database.sqlite');

export const withContext: Handler = async (req, _, next) => {
  req.ctx = {
    db,
    todosRepository: new TodosRepository(db),
  };

  next();
};
