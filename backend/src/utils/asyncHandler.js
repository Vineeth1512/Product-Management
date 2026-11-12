/**
 * Higher-order function to catch errors from async route handlers and forward them to Express error middleware
 * @param {Function} requestHandler - The async controller function
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export default asyncHandler;

