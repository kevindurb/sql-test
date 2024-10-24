export class TodoModel {
  constructor(
    public id: number,
    public description: string,
    public completedOn: number,
  ) {}

  toJSON() {
    return {
      id: this.id,
      description: this.description,
      completedOn: this.completedOn,
    };
  }
}
