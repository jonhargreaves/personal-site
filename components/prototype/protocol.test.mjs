import assert from "node:assert/strict";
import test from "node:test";
import { isPrototypeProgress } from "./protocol.ts";

test("progress supports different prototypes and section counts", () => {
  const message = { type: "prototype:progress", prototypeId: "fathom-ios-onboarding", completed: 2, total: 5 };
  assert.equal(isPrototypeProgress(message, "fathom-ios-onboarding", 5), true);
  assert.equal(isPrototypeProgress({ ...message, completed: 5 }, "fathom-ios-onboarding", 5), true);
  assert.equal(isPrototypeProgress(message, "hyper-meeting", 5), false);
  assert.equal(isPrototypeProgress(message, "fathom-ios-onboarding", 3), false);
});

test("malformed progress cannot dismiss the loading state", () => {
  const message = { type: "prototype:progress", prototypeId: "hyper-meeting", completed: 3, total: 3 };
  for (const value of [null, undefined, {}, { ...message, type: "other" }, ...[-1, 4, 1.5, NaN, Infinity, "3"].map((completed) => ({ ...message, completed }))]) {
    assert.equal(isPrototypeProgress(value, "hyper-meeting", 3), false);
  }
});
