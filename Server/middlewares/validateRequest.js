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
      const issues = error.issues || error.errors || [];

      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: issues[0]?.message || "Validation failed", // show exact failure
          details: issues, // optional but useful
        },
      });
    }

    // 👇 Any other unexpected error
    next(error);
  }
};

module.exports = validateRequest;