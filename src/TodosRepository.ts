import type { Database } from 'better-sqlite3';
import { SQL } from './SQL.js';
import { TodoModel } from './TodoModel.js';

interface TodoRow {
  id: number;
  description: string;
  completed_on: number | null;
}

export class TodosRepository {
  constructor(private readonly db: Database) {}

  find(id: number) {
    const stmt = SQL`SELECT id, description, completed_on FROM todos WHERE id=${id}`;
    const data = stmt.get<TodoRow | undefined>(this.db);
    if (!data) return undefined;

    return new TodoModel({
      id: data.id,
      description: data.description,
      completedOn: data.completed_on ?? undefined,
    });
  }

  findAll() {
    return SQL`SELECT id, description, completed_on FROM todos`
      .all<TodoRow>(this.db)
      .map(
        ({ id, description, completed_on }) =>
          new TodoModel({
            id: id,
            description: description,
            completedOn: completed_on ?? undefined,
          }),
      );
  }

  save(model: TodoModel) {
    const result = SQL`
      INSERT INTO todos (id, description, completed_on)
      VALUES (${model.id}, ${model.description}, ${model.completedOn})

      ON CONFLICT (id) DO UPDATE SET
      description = ${model.description},
      completed_on = ${model.completedOn}
    `.run(this.db);

    model.id = Number(result.lastInsertRowid);
  }
}
