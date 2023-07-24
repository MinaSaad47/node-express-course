module.exports = (fn) => {
  return async (req, res, next) => {
    try {
      console.log("[INFO] asyncWrapper ", req.url, req.method);
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
