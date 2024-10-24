import express from 'express';

const app = express();

app.get('/:hello', async (req, res) => {
  res.send({ hello: req.params.hello });
});

app.listen(1337);
