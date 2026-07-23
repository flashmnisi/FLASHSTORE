import { sharedMetrics } from './shared-metrics';

describe('sharedMetrics', () => {
  it('should work', () => {
    expect(sharedMetrics()).toEqual('shared-metrics');
  });
});
