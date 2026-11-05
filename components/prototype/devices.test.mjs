import assert from "node:assert/strict";
import test from "node:test";
import {
  availablePrototypeDevices,
  prototypeDevices,
  prototypeViewport,
  resolvePrototypeDevice,
} from "./devices.ts";

test("only layouts that fit the viewer's window are available", () => {
  const ids = (width) => availablePrototypeDevices(width).map((device) => device.id);
  assert.deepEqual(ids(320), ["mobile"]);
  assert.deepEqual(ids(1243), ["mobile"]);
  assert.deepEqual(ids(1244), ["mobile", "tablet"]);
  assert.deepEqual(ids(1503), ["mobile", "tablet"]);
  assert.deepEqual(ids(1504), ["mobile", "tablet", "desktop"]);
});

test("a selected layout falls back to the largest supported view after resizing", () => {
  assert.equal(resolvePrototypeDevice("desktop", 1280).id, "tablet");
  assert.equal(resolvePrototypeDevice("desktop", 1024).id, "mobile");
  assert.equal(resolvePrototypeDevice("desktop", 375).id, "mobile");
  assert.equal(resolvePrototypeDevice("tablet", 375).id, "mobile");
  assert.equal(resolvePrototypeDevice("mobile", 1440).id, "mobile");
  assert.equal(resolvePrototypeDevice("desktop", 1600).id, "desktop");
});

test("preview viewports retain device proportions when the padded window is narrower", () => {
  const [mobile, tablet, desktop] = prototypeDevices;
  assert.deepEqual(prototypeViewport(mobile, 375), { width: 311, height: 674 });
  assert.deepEqual(prototypeViewport(mobile, 457), { width: 393, height: 852 });
  assert.deepEqual(prototypeViewport(tablet, 1244), { width: 1180, height: 820 });
  assert.deepEqual(prototypeViewport(desktop, 1504), { width: 1440, height: 800 });
  assert.deepEqual(prototypeViewport(mobile, 0), { width: 393, height: 852 });
});
