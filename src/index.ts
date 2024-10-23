import { Api } from './Api.js';
import { Response } from './Response.js';

const api = new Api();

api.get<{ hello: string }>('/:hello', async (_, { params }) => {
  return Response.success().withJSON(params.hello);
});

api.listen(1337);
