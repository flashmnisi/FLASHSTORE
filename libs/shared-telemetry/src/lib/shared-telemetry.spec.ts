import { sharedTelemetry } from './shared-telemetry';

describe('sharedTelemetry', () => {
  it('should work', () => {
    expect(sharedTelemetry()).toEqual('shared-telemetry');
  });
});
