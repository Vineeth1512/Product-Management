import { validationResult } from "express-validator";
import ApiError from "../utils/apiError.js";

/**
 * Middleware factory that executes express-validator rules and forwards errors cleanly
 * @param {Array} validations - Array of express-validator validation chains
 */
export const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations in parallel
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg
    }));

    const formattedMessage = extractedErrors.map((e) => e.message).join(", ");

    return next(new ApiError(400, formattedMessage, extractedErrors));
  };
};

