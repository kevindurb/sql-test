export type UnknownFunc = () => unknown | Promise<unknown>;

export type Handler<ValueType, ResultType> = (
  value: ValueType,
  cb: UnknownFunc | undefined,
) => ResultType | Promise<ResultType>;

export class StackHandler<ValueType, ResultType> {
  private handlers: Handler<ValueType, ResultType>[] = [];

  push(handler: Handler<ValueType, ResultType>) {
    this.handlers.push(handler);
  }

  private enqueueNext(value: ValueType, idx: number): UnknownFunc | undefined {
    const next = this.handlers[idx];
    if (!next) return;

    return async () => {
      return await next(value, this.enqueueNext(value, idx + 1));
    };
  }

  async handle(value: ValueType) {
    const next = this.enqueueNext(value, 0);
    if (next) return await next();
    return undefined;
  }
}
