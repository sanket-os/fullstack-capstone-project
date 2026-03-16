const test = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");

// bookingController initializes Stripe at import time
process.env.STRIPE_KEY = process.env.STRIPE_KEY || "sk_test_dummy";

const userRoute = require("../routes/userRoute");
const bookingRoute = require("../routes/bookingRoute");
const { validateJWTToken } = require("../middlewares/authorizationMiddleware");
const errorHandler = require("../middlewares/errorHandler");

function createTestApp() {
  const app = express();
  app.use(express.json());

  // mirror production route mounting relevant to these tests
  app.use("/bms/v1/users", userRoute);
  app.use("/bms/v1/bookings", validateJWTToken, bookingRoute);

  app.use(errorHandler);
  return app;
}

async function startServer(app) {
  const server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });

  const address = server.address();
  return {
    baseUrl: `http://127.0.0.1:${address.port}`,
    close: () =>
      new Promise((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      }),
  };
}

test("POST /bms/v1/users/login returns 400 with VALIDATION_ERROR for invalid payload", async () => {
  const app = createTestApp();
  const { baseUrl, close } = await startServer(app);

  try {
    const response = await fetch(`${baseUrl}/bms/v1/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "not-an-email", password: "123" }),
    });

    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.success, false);
    assert.equal(body.error.code, "VALIDATION_ERROR");
    assert.ok(Array.isArray(body.error.details));
    assert.ok(body.error.details.length > 0);
  } finally {
    await close();
  }
});

test("POST /bms/v1/bookings/createPaymentIntent returns 401 when auth cookie is missing", async () => {
  const app = createTestApp();
  const { baseUrl, close } = await startServer(app);

  try {
    const response = await fetch(`${baseUrl}/bms/v1/bookings/createPaymentIntent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        showId: "507f1f77bcf86cd799439011",
        seats: [1, 2],
      }),
    });

    const body = await response.json();

    assert.equal(response.status, 401);
    assert.deepEqual(body, {
      success: false,
      message: "Authentication required",
    });
  } finally {
    await close();
  }
});