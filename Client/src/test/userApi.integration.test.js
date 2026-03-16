import test from "node:test";
import assert from "node:assert/strict";

import { axiosInstance } from "../api/index.js";

test("client API layer sends login request to correct endpoint and returns response payload", async () => {
  const originalAdapter = axiosInstance.defaults.adapter;

  try {
    axiosInstance.defaults.adapter = async (config) => {
      assert.equal(config.baseURL, "/bms/v1");
      assert.equal(config.url, "/users/login");
      assert.equal(config.method, "post");
      assert.equal(config.withCredentials, true);
      assert.equal(config.headers["Content-Type"], "application/json");
      assert.equal(
        config.data,
        JSON.stringify({ email: "user@example.com", password: "secret123" })
      );

      return {
        data: {
          success: true,
          message: "Login successful",
          data: { userId: "u1", role: "user" },
        },
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      };
    };

    const response = await axiosInstance.post("/users/login", {
      email: "user@example.com",
      password: "secret123",
    });

    assert.deepEqual(response.data, {
      success: true,
      message: "Login successful",
      data: { userId: "u1", role: "user" },
    });
  } finally {
    axiosInstance.defaults.adapter = originalAdapter;
  }
});

test("client API layer maps backend errors into normalized error object", async () => {
  const originalAdapter = axiosInstance.defaults.adapter;

  try {
    axiosInstance.defaults.adapter = async (config) => {
      return Promise.reject({
        config,
        response: {
          status: 401,
          data: {
            success: false,
            error: {
              code: "INVALID_CREDENTIALS",
              message: "Invalid email or password",
            },
          },
        },
      });
    };

    await assert.rejects(
      () =>
        axiosInstance.post("/users/login", {
          email: "user@example.com",
          password: "wrongpass",
        }),
      (error) => {
        assert.equal(error.code, "INVALID_CREDENTIALS");
        assert.equal(error.message, "Invalid email or password");
        return true;
      }
    );
  } finally {
    axiosInstance.defaults.adapter = originalAdapter;
  }
});