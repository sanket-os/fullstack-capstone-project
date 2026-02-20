const validateRequest = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    next();
  } catch (error) {
    // 👇 Handle Zod validation errors properly
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: error.errors[0].message, // show exact failure
          details: error.errors,            // optional but useful
        },
      });
    }

    // 👇 Any other unexpected error
    next(error);
  }
};

module.exports = validateRequest;