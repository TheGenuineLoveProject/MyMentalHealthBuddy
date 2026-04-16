import {
  validateContentModel,
  validateContentPatch,
} from "../contracts/content-model.schema.mjs";

function formatZodError(error) {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
    code: issue.code,
  }));
}

export function requireValidContentModel(req, res, next) {
  const result = validateContentModel(req.body);

  if (!result.success) {
    return res.status(400).json({
      ok: false,
      message: "CONTENT_MODEL_CONTRACT validation failed",
      contract: "CONTENT_MODEL_CONTRACT",
      errors: formatZodError(result.error),
    });
  }

  req.validatedContent = result.data;
  next();
}

export function requireValidContentPatch(req, res, next) {
  const result = validateContentPatch(req.body);

  if (!result.success) {
    return res.status(400).json({
      ok: false,
      message: "CONTENT_MODEL_CONTRACT patch validation failed",
      contract: "CONTENT_MODEL_CONTRACT",
      errors: formatZodError(result.error),
    });
  }

  req.validatedContentPatch = result.data;
  next();
}
