// import { Request, Response, NextFunction } from 'express';
// import crypto from 'crypto';
// import logger from '@org/shared-logger';
// import env from '../config/env';

// // 🔐 Store hashed keys (better)
// const VALID_API_KEYS = new Set<string>(
//   (env.INTERNAL_API_KEYS || '')
//     .split(',')
//     .map((key) => key.trim())
//     .filter(Boolean)
//     .map((key) => hashKey(key))
// );

// // 🔐 Hash function
// function hashKey(key: string) {
//   return crypto.createHash('sha256').update(key).digest('hex');
// }

// export const apiKeyMiddleware = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): void => {
//   const apiKey = req.headers['x-api-key'] as string;

//   if (!apiKey) {
//     logger.warn({
//       message: 'API key missing',
//       path: req.originalUrl,
//       ip: req.ip,
//       requestId: req.id,
//     });

//     res.status(401).json({
//       success: false,
//       message: 'API key is required',
//       requestId: req.id,
//     });
//     return;
//   }

//   const hashed = hashKey(apiKey);

//   if (!VALID_API_KEYS.has(hashed)) {
//     logger.warn({
//       message: 'Invalid API key',
//       path: req.originalUrl,
//       ip: req.ip,
//       requestId: req.id,
//     });

//     res.status(403).json({
//       success: false,
//       message: 'Invalid API key',
//       requestId: req.id,
//     });
//     return;
//   }

//   (req as any).apiKey = true; // you don’t need to store actual key
//   next();
// };