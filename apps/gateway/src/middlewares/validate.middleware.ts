// apps/gateway/src/presentation/middlewares/validate.middleware.ts

// import { Request, Response, NextFunction } from 'express';
// import { ZodError, ZodTypeAny } from 'zod';

// type ValidationSchemas = {
//   body?: ZodTypeAny;
//   query?: ZodTypeAny;
//   params?: ZodTypeAny;
// };

// export const validate = (schemas: ValidationSchemas) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     try {
//       // ================= BODY VALIDATION =================
//       if (schemas.body) {
//         const result = schemas.body.safeParse(req.body);
//         if (!result.success) {
//           res.status(400).json(formatValidationError(result.error, 'body'));
//           return;
//         }
//         req.body = result.data;
//       }

//       // ================= QUERY VALIDATION =================
//       if (schemas.query) {
//         const result = schemas.query.safeParse(req.query);
//         if (!result.success) {
//           return res.status(400).json(formatValidationError(result.error, 'query'));
//         }
//         // Fix: Type assertion needed because Express expects ParsedQs
//         req.query = result.data as any;
//       }

//       // ================= PARAMS VALIDATION =================
//       if (schemas.params) {
//         const result = schemas.params.safeParse(req.params);
//         if (!result.success) {
//           return res.status(400).json(formatValidationError(result.error, 'params'));
//         }
//         req.params = result.data as any;
//       }

//       next();
//     } catch (error: any) {
//       next(error);
//     }
//   };
// };

// /**
//  * Format Zod validation errors nicely
//  */
// const formatValidationError = (error: ZodError, field: 'body' | 'query' | 'params') => ({
//   success: false,
//   message: `Invalid ${field} data`,
//   field,
//   errors: error.flatten().fieldErrors,
//   ...(process.env.NODE_ENV === 'development' && {
//     issues: error.issues,
//   }),
// });

// // ================= CONVENIENCE WRAPPERS =================

// export const validateBody = (schema: ZodTypeAny) => validate({ body: schema });
// export const validateQuery = (schema: ZodTypeAny) => validate({ query: schema });
// export const validateParams = (schema: ZodTypeAny) => validate({ params: schema });