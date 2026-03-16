const test = require("node:test");
const assert = require("node:assert/strict");
const { z } = require("zod");

const validateRequest = require("../middlewares/validateRequest");
const { createMockRes, createNextSpy } = require("./helpers");

test("validateRequest should call next for valid payload", () => {
  const schema = z.object({
    body: z.object({
      email: z.string().email(),
    }),
  });

  const middleware = validateRequest(schema);
  const req = { body: { email: "user@example.com" }, params: {}, query: {} };
  const res = createMockRes();
  const next = createNextSpy();

  middleware(req, res, next);

  assert.equal(next.calls.length, 1);
  assert.equal(next.calls[0], undefined);
  assert.equal(res.statusCode, null);
});

test("validateRequest should return 400 with validation details for invalid payload", () => {
  const schema = z.object({
    body: z.object({
      email: z.string().email(),
    }),
  });

  const middleware = validateRequest(schema);
  const req = { body: { email: "invalid" }, params: {}, query: {} };
  const res = createMockRes();
  const next = createNextSpy();

  middleware(req, res, next);

  assert.equal(next.calls.length, 0);
  assert.equal(res.statusCode, 400);
  assert.equal(res.body.success, false);
  assert.equal(res.body.error.code, "VALIDATION_ERROR");
  assert.match(res.body.error.message, /email/i);
  assert.ok(Array.isArray(res.body.error.details));
  assert.ok(res.body.error.details.length > 0);
});