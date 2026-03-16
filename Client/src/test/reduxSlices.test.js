import test from "node:test";
import assert from "node:assert/strict";

import loaderReducer, {
  showLoading,
  hideLoading,
} from "../redux/loaderSlice.js";
import userReducer, { setUser } from "../redux/userSlice.js";

test("loaderSlice toggles loading state", () => {
  const initialState = loaderReducer(undefined, { type: "@@INIT" });
  assert.equal(initialState.loading, false);

  const loadingState = loaderReducer(initialState, showLoading());
  assert.equal(loadingState.loading, true);

  const idleState = loaderReducer(loadingState, hideLoading());
  assert.equal(idleState.loading, false);
});

test("userSlice stores user payload", () => {
  const initialState = userReducer(undefined, { type: "@@INIT" });
  assert.equal(initialState.user, null);

  const nextState = userReducer(
    initialState,
    setUser({ id: "u1", name: "Jane", role: "partner" })
  );

  assert.deepEqual(nextState.user, {
    id: "u1",
    name: "Jane",
    role: "partner",
  });
});