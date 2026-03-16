const test = require("node:test");
const assert = require("node:assert/strict");

const { registerSchema, loginSchema } = require("../validators/user.schema");
const {
  createPaymentIntentSchema,
  bookingSchema,
} = require("../validators/booking.schema");

test("registerSchema should parse valid registration data", () => {
  const input = {
    body: {
      name: "Jane Doe",
      email: "jane@example.com",
      password: "secure123",
      role: "partner",
    },
  };

  const parsed = registerSchema.parse(input);
  assert.equal(parsed.body.email, "jane@example.com");
});

test("registerSchema should reject invalid email", () => {
  assert.throws(() => {
    registerSchema.parse({
      body: {
        name: "Jane Doe",
        email: "not-an-email",
        password: "secure123",
      },
    });
  });
});

test("loginSchema should reject password shorter than 6 chars", () => {
  assert.throws(() => {
    loginSchema.parse({
      body: {
        email: "user@example.com",
        password: "123",
      },
    });
  });
});

test("createPaymentIntentSchema should reject empty seat selection", () => {
  assert.throws(() => {
    createPaymentIntentSchema.parse({
      body: {
        showId: "507f1f77bcf86cd799439011",
        seats: [],
      },
    });
  });
});

test("bookingSchema should parse valid booking payload", () => {
  const parsed = bookingSchema.parse({
    body: {
      show: "507f1f77bcf86cd799439011",
      seats: [1, 2, 3],
      paymentIntentId: "pi_test_123",
    },
  });

  assert.equal(parsed.body.seats.length, 3);
});