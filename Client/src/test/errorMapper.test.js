import test from "node:test";
import assert from "node:assert/strict";

import { mapErrorToMessage } from "../utils/errorMapper.js";

test("mapErrorToMessage returns mapped message for known backend error code", () => {
  const result = mapErrorToMessage({ code: "INVALID_CREDENTIALS" });
  assert.equal(result, "Invalid email or password");
});

test("mapErrorToMessage falls back to raw error message for unknown code", () => {
  const result = mapErrorToMessage({
    code: "SOME_UNKNOWN_CODE",
    message: "Something specific failed",
  });

  assert.equal(result, "Something specific failed");
});

test("mapErrorToMessage returns generic fallback when no error object exists", () => {
  const result = mapErrorToMessage(undefined);
  assert.equal(result, "Something went wrong");
});