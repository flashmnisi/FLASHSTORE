import { sharedLogger } from './shared-logger.js';

describe('sharedLogger', () => {
  it('should work', () => {
    expect(sharedLogger()).toEqual('shared-logger');
  });
});
