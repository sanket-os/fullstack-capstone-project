const test = require("node:test");
const assert = require("node:assert/strict");

const AppError = require("../utils/AppError");
const errorHandler = require("../middlewares/errorHandler");
const { createMockRes } = require("./helpers");

test("AppError should keep structured error metadata", () => {
  const err = new AppError(404, "MOVIE_NOT_FOUND", "Movie not found");

  assert.equal(err.statusCode, 404);
  assert.equal(err.code, "MOVIE_NOT_FOUND");
  assert.equal(err.message, "Movie not found");
  assert.equal(err.isOperational, true);
});

test("errorHandler should return custom structured error response", () => {
  const err = new AppError(401, "TOKEN_INVALID", "Invalid or expired token");
  err.details = { token: "expired" };

  const res = createMockRes();
  errorHandler(err, {}, res, () => {});

  assert.equal(res.statusCode, 401);
  assert.deepEqual(res.body, {
    success: false,
    error: {
      code: "TOKEN_INVALID",
      message: "Invalid or expired token",
      details: { token: "expired" },
    },
  });
});

test("errorHandler should default to 500 with INTERNAL_SERVER_ERROR and log unexpected errors", () => {
  const err = new Error("Unexpected failure");
  const originalConsoleError = console.error;
  const calls = [];

  try {
    console.error = (...args) => {
      calls.push(args);
    };

    const res = createMockRes();
    errorHandler(err, {}, res, () => {});

    assert.equal(res.statusCode, 500);
    assert.equal(res.body.error.code, "INTERNAL_SERVER_ERROR");
    assert.equal(res.body.error.message, "Unexpected failure");
    assert.equal(res.body.error.details, null);
    assert.equal(calls.length, 1);
    assert.equal(calls[0][0], "UNEXPECTED ERROR:");
    assert.equal(calls[0][1], err);
  } finally {
    console.error = originalConsoleError;
  }
});