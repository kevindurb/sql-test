import type { Database } from 'better-sqlite3';

class SQLStatement<BindParameters extends unknown[]> {
  constructor(
    private readonly template: TemplateStringsArray,
    private readonly substitutions: BindParameters,
  ) {}

  private getSQL() {
    return this.template.join('?');
  }

  run<Result = unknown>(db: Database) {
    const stmt = db.prepare<BindParameters, Result>(this.getSQL());
    return stmt.run(this.substitutions);
  }

  get<Result = unknown>(db: Database) {
    const stmt = db.prepare<BindParameters, Result>(this.getSQL());
    return stmt.get(this.substitutions);
  }

  all<Result = unknown>(db: Database) {
    const stmt = db.prepare<BindParameters, Result>(this.getSQL());
    return stmt.all(this.substitutions);
  }
}

export function SQL(
  template: TemplateStringsArray,
  ...substitutions: unknown[]
) {
  return new SQLStatement(template, substitutions);
}
