const { run } = require('../src/run.js');

// Mock the action's entrypoint
jest.mock('../src/run.js', () => ({
  run: jest.fn()
}));

describe('test index', () => {
  it('verifies index calls run', async () => {
    require('../src/index.js');

    expect(run).toHaveBeenCalled();
  })
});