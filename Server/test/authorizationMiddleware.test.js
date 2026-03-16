const test = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");

const { validateJWTToken } = require("../middlewares/authorizationMiddleware");
const { createMockRes, createNextSpy } = require("./helpers");

test("validateJWTToken should return 401 when cookie token is missing", () => {
  const req = { cookies: {} };
  const res = createMockRes();
  const next = createNextSpy();

  validateJWTToken(req, res, next);

  assert.equal(res.statusCode, 401);
  assert.deepEqual(res.body, {
    success: false,
    message: "Authentication required",
  });
  assert.equal(next.calls.length, 0);
});

test("validateJWTToken should call next with AppError on invalid token", () => {
  const originalVerify = jwt.verify;

  try {
    jwt.verify = () => {
      throw new Error("jwt malformed");
    };

    const req = { cookies: { bms_token: "invalid" } };
    const res = createMockRes();
    const next = createNextSpy();

    validateJWTToken(req, res, next);

    assert.equal(next.calls.length, 1);
    assert.equal(next.calls[0].statusCode, 401);
    assert.equal(next.calls[0].code, "TOKEN_INVALID");
  } finally {
    jwt.verify = originalVerify;
  }
});

test("validateJWTToken should attach user info and call next for valid token", () => {
  const originalVerify = jwt.verify;

  try {
    jwt.verify = () => ({
      userId: "u1",
      email: "partner@example.com",
      role: "partner",
    });

    const req = { cookies: { bms_token: "valid" } };
    const res = createMockRes();
    const next = createNextSpy();

    validateJWTToken(req, res, next);

    assert.deepEqual(req.user, {
      userId: "u1",
      email: "partner@example.com",
      role: "partner",
    });
    assert.equal(next.calls.length, 1);
    assert.equal(next.calls[0], undefined);
  } finally {
    jwt.verify = originalVerify;
  }
});