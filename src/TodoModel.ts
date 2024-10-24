export interface Todo {
  id?: number | undefined;
  description: string;
  completedOn?: number | undefined;
}

export class TodoModel {
  public id?: number | undefined;
  public description: string;
  public completedOn?: number | undefined;

  constructor({ id, description, completedOn }: Todo) {
    this.id = id;
    this.description = description;
    this.completedOn = completedOn;
  }

  toJSON() {
    return {
      id: this.id,
      description: this.description,
      completedOn: this.completedOn,
    };
  }
}
