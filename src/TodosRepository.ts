import type { Database } from 'better-sqlite3';
import { SQL } from './SQL.js';
import { TodoModel } from './TodoModel.js';

interface Todo {
  id: number;
  description: string;
  completed_on: number;
}

export class TodosRepository {
  constructor(private readonly db: Database) {}

  find(id: number) {
    const stmt = SQL`SELECT id, description, completed_on FROM todos WHERE id=${id}`;
    const data = stmt.get<Todo | undefined>(this.db);
    if (!data) return undefined;

    return new TodoModel(data.id, data.description, data.completed_on);
  }

  findAll() {
    return SQL`SELECT id, description, completed_on FROM todos`
      .all<Todo>(this.db)
      .map(
        ({ id, description, completed_on }) =>
          new TodoModel(id, description, completed_on),
      );
  }
}
