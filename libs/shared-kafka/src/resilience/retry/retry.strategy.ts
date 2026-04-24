export const getBackoffDelay = (attempt: number) => {
  const base = 300;

  const delay = base * Math.pow(2, attempt);

  return Math.min(delay, 30_000); // cap at 30s
};