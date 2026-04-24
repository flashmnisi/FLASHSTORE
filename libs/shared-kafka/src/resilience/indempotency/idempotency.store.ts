export interface IdempotencyStore {
  has(key: string): Promise<boolean>;
  set(key: string): Promise<void>;
}