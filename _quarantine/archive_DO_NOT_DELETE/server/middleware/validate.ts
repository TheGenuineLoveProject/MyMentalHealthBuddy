// /server/middleware/validate.ts

import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
	(schema: ZodSchema) =>
	(req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.body);

		if (!result.success) {
			return res.status(400).json({
				error: "VALIDATION_ERROR",
				details: result.error.flatten(),
			});
		}

		req.body = result.data;
		next();
	};