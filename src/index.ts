import http, { IncomingMessage, ServerResponse } from 'node:http';
import { StackHandler } from './StackHandler.js';
import { get } from './route.js';

interface Context {
  req: IncomingMessage;
  res: ServerResponse;
}

const stackHandler = new StackHandler<Context, unknown>();

const server = http.createServer(async (req, res) => {
  const result = await stackHandler.handle({ req, res });
});

stackHandler.push(get('/', ({ params }) => console.log(params)));

server.listen(1337, () => console.log('Listening...'));
