import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  logger.error(err.message);

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    stack: err.stack,
    
  });
};

export default errorHandler;
