const assert = require("assert"),
  runner = require("./helpers").runner;

describe("runner function", function () {
  it("should not throw any error", function () {
    assert.equal(runner("", new Date, 0, 0),0);
  });
});
