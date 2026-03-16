function createMockRes() {
  const res = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };

  return res;
}

function createNextSpy() {
  const calls = [];
  const next = (arg) => {
    calls.push(arg);
  };

  next.calls = calls;
  return next;
}

module.exports = {
  createMockRes,
  createNextSpy,
};