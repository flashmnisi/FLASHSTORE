import { sharedKafka } from './shared-kafka.js';

describe('sharedKafka', () => {
  it('should work', () => {
    expect(sharedKafka()).toEqual('shared-kafka');
  });
});
