import logger from "../utils/logger.js";

import getFileName from "../utils/getFileName.js";

const fileName = getFileName(import.meta.url);

const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    file: fileName,
    url: req.originalUrl,
    method: req.method,
  });

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    stack: err.stack,
    
  });
};

export default errorHandler;
