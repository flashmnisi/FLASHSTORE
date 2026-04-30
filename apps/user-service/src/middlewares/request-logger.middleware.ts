// import { Response, NextFunction } from 'express';
// import logger from '@org/shared-logger';
// //import { AuthRequest } from './auth.middleware';

// export const requestLogger = (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   const start = Date.now();

//   res.on('finish', () => {
//     const duration = Date.now() - start;

//     logger.info('HTTP Request',
//       {
//         method: req.method,
//         url: req.originalUrl,
//         statusCode: res.statusCode,
//         duration: `${duration}ms`,
//         ip: req.ip,
//         userId: req.user?.userId,
//         correlationId: req.correlationId,
//       }
//     );
//   });

//   next();
// };