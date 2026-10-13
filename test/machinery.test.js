import assert from 'node:assert/strict';
import { test } from 'node:test';

import * as GFX from '../src/vendor/gfx/index.js';
import { createBumperMesh, createDropMesh, createLiftMesh, createPyroMesh } from '../src/machinery.js';
import { BUMPERS, BURSTS, DROPS, RIDES } from '../src/travel/index.js';

const SIZE = (obj) => {
  obj.updateMatrixWorld(true);
  return new GFX.Box3().setFromObject(obj);
};

test('every drop is built, sways, and stays about the size of the tiles it hangs over', () => {
  for (const style of Object.keys(DROPS)) {
    for (const spec of [{ w: 3, d: 1, height: 1.2 }, { w: 1, d: 4, height: 1.0 }, { w: 2, d: 2, height: 0.9 }]) {
      const venue = { look: { crusher: style } };
      const made = createDropMesh(GFX, { ...spec, venue });
      assert.ok(made.group, `${style}: a group`);
      for (const up of [1, 0.5, 0]) assert.doesNotThrow(() => made.update(up, 1.3), `${style} updates at ${up}`);
      const box = SIZE(made.group);
      // Its footprint, give or take the chains above it (they are tall and thin).
      assert.ok(box.max.x - box.min.x <= spec.w + 1.2, `${style} ${spec.w}x${spec.d}: ${(box.max.x - box.min.x).toFixed(2)} across`);
      assert.ok(box.max.z - box.min.z <= spec.d + 1.2, `${style} ${spec.w}x${spec.d}: ${(box.max.z - box.min.z).toFixed(2)} deep`);
      assert.ok(box.min.y >= -spec.height / 2 - 0.35, `${style}: its bottom (${box.min.y.toFixed(2)}) is where the drop lands`);
    }
  }
});

test('every ride is built, rocks gently, and has a deck to roll on that fills its footprint', () => {
  for (const style of Object.keys(RIDES)) {
    for (const [w, d, to] of [[3, 3, [8, 0, 0]], [4, 3, [0, 0, -7]], [3, 5, [-6, 0, 0]]]) {
      const lift = { x: 0, z: 0, w, d, h: 2, to, period: 6 };
      const made = createLiftMesh(GFX, { w, d, thickness: 0.28, style, lift });
      assert.ok(made.group, `${style}: a group`);
      assert.doesNotThrow(() => made.update(3.7), `${style} moves`);
      const box = SIZE(made.group);
      assert.ok(box.max.y >= 0.1, `${style}: a top at ${box.max.y.toFixed(2)}`);
    }
  }
});

test('every bumper is built, and flashes when it throws Metroll', () => {
  for (const look of Object.keys(BUMPERS)) {
    const made = createBumperMesh(GFX, { radius: 0.5, look });
    assert.ok(made.group.children.length > 0, `${look} has parts`);
    for (const since of [-1, 0, 0.1, 1]) assert.doesNotThrow(() => made.update(since), `${look} flashes`);
    const box = SIZE(made.group);
    assert.ok(box.max.y > 0.3 && box.max.y < 1.6, `${look} stands ${box.max.y.toFixed(2)} tall`);
    assert.ok(box.max.x - box.min.x < 1.6, `${look} is ${(box.max.x - box.min.x).toFixed(2)} wide`);
  }
});

test('every burst is drawn', () => {
  for (const pyro of [undefined, 'steam', ...Object.keys(BURSTS)]) {
    const made = createPyroMesh(GFX, { x: 3, z: 3, w: 2, d: 1, venue: { look: { pyro } } });
    assert.ok(made.group, `${pyro}: a group`);
  }
});
