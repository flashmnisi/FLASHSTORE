import { sharedConfig } from './shared-config.js';

describe('sharedConfig', () => {
  it('should work', () => {
    expect(sharedConfig()).toEqual('shared-config');
  });
});
