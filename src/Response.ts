import type { ServerResponse } from 'node:http';

export class Response {
  constructor(
    public code: number,
    public body?: string,
    public headers: Record<string, string> = {},
  ) {}

  static success() {
    return new Response(200);
  }

  withJSON(data: unknown) {
    this.body = JSON.stringify(data);
    this.headers['Content-Type'] = 'application/json';
    return this;
  }

  withHeaders(headers: Record<string, string>) {
    this.headers = { ...this.headers, ...headers };
    return this;
  }

  writeToResponse(res: ServerResponse) {
    res.writeHead(this.code, this.headers).write(this.body);
  }
}
