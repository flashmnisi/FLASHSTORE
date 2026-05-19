export const requestTimeMiddleware = (
  req: any,
  res: any,
  next: any
) => {
  req.startTime = Date.now();
  next();
};