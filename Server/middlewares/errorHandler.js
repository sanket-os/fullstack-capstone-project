// const errorHandler = (err, req, res, next) => {
//     console.error(err); // optional
//     res.status(res.statusCode || 500).json({  
//         success: false,
//         message: err.message,
//     });
// };

// module.exports = errorHandler;


const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // Optional: log only unexpected errors
  if (statusCode === 500) {
    console.error("UNEXPECTED ERROR:", err);
  }
  
  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || "INTERNAL_SERVER_ERROR",
      message: err.message || "Something went wrong",
      details: err.details || null,
    },
  });
};

module.exports = errorHandler;