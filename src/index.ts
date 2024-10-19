import { Path } from 'path-parser';
import { Api } from './Api.js';

const api = new Api();

api.pushRoute('GET', new Path('/'), (_, res) => {
  res.end('Hello World');
});

api.listen();
