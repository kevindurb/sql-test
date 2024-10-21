import test from 'node:test';
import { StackHandler } from './StackHandler.js';

test('StackHandler', async (t) => {
  await t.test(
    'it should call all handlers in stack if they all continue',
    async () => {
      const a = t.mock.fn((_, cb) => cb());
      const b = t.mock.fn((_, cb) => cb());
      const c = t.mock.fn(() => 'world');
      const stackHandler = new StackHandler();
      stackHandler.push(a);
      stackHandler.push(b);
      stackHandler.push(c);
      const result = await stackHandler.handle('hello');

      t.assert.equal(a.mock.callCount(), 1);
      t.assert.equal(b.mock.callCount(), 1);
      t.assert.equal(c.mock.callCount(), 1);
      t.assert.equal(result, 'world');
    },
  );

  await t.test(
    'it should exit early when a callback is not called',
    async () => {
      const a = t.mock.fn((_, cb) => cb());
      const b = t.mock.fn(() => 'foo');
      const c = t.mock.fn(() => 'world');
      const stackHandler = new StackHandler();
      stackHandler.push(a);
      stackHandler.push(b);
      stackHandler.push(c);
      const result = await stackHandler.handle('hello');

      t.assert.equal(a.mock.callCount(), 1);
      t.assert.equal(b.mock.callCount(), 1);
      t.assert.equal(c.mock.callCount(), 0);
      t.assert.equal(result, 'foo');
    },
  );
});
