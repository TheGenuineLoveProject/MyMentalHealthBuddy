import { ZodError } from "zod";

export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.flatten();
      return res.status(400).json({
        ok: false,
        message: "Validation failed",
        errors: errors.fieldErrors,
      });
    }
    req.validatedBody = result.data;
    next();
  };
}
