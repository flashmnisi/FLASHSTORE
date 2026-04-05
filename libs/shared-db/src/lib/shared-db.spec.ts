import { sharedDb } from './shared-db.js';

describe('sharedDb', () => {
  it('should work', () => {
    expect(sharedDb()).toEqual('shared-db');
  });
});
