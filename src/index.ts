import { Api } from './Api.js';

const api = new Api();

api.get('/', (_, res) => {
  res.end('Hello World');
});

api.listen();
