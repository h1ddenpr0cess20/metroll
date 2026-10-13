import assert from 'node:assert/strict';
import { test } from 'node:test';

import * as GFX from '../src/vendor/gfx/index.js';
import { FACING, openSide, PROPS } from '../src/decor.js';
import { createGig, STEP, stepGig } from '../src/gig.js';
import { VENUES, loadVenue } from '../src/venues/index.js';

/** Rock rolled at the middle of `prop`'s near side from `back` tiles off, going `speed`. */
function charge(gig, prop, speed, back = 0.9) {
  const b = gig.ball;
  const [cx, , cz] = prop.centre;
  b.x = prop.box.min[0] - back; b.z = cz; b.y = prop.spec.base + b.r + 0.01;
  b.vx = speed; b.vy = 0; b.vz = 0;
  void cx;
  for (let t = 0; t < 0.5; t += STEP) stepGig(gig, [1, 0], STEP);
}

/** A prop with a clear tile or two of floor to the -x side of it to come at it from. */
function propWithRoom(gig) {
  const v = gig.venue;
  return gig.actors.props.find((p) => {
    const z = Math.floor(p.centre[2]);
    return [1, 2].every((k) => {
      const c = v.cell(p.spec.x - k, z);
      return c && c.kind === 'floor' && !c.prop && Math.abs(Math.max(...c.h) - p.spec.base) < 0.01;
    });
  });
}

test('props are smashed by a run at them, and stand up to a nudge', () => {
  const slow = createGig(GFX, 0);
  const p1 = propWithRoom(slow);
  assert.ok(p1, 'the Casting Call has a prop to try');
  charge(slow, p1, 1.5);
  assert.equal(p1.broken, -1, 'a nudge leaves it standing');
  assert.ok(slow.ball.x < p1.box.min[0] + 0.05, 'and Rock does not go through it');

  const fast = createGig(GFX, 0);
  const p2 = fast.actors.props.find((p) => p.spec.x === p1.spec.x && p.spec.z === p1.spec.z);
  const before = fast.hype.score;
  charge(fast, p2, p2.breakAt + 1.5);
  assert.ok(p2.broken >= 0, 'a run at it smashes it');
  assert.equal(p2.box.solid, false);
  assert.ok(fast.hype.score > before, 'and that is worth some hype');
});

test('everything a set is dressed with is built, and stays inside its footprint', () => {
  const box = new GFX.Box3();
  for (let i = 0; i < VENUES.length; i++) {
    const v = loadVenue(i);
    for (const p of v.props.filter((q) => !q.free)) {
      assert.ok(PROPS[p.kind], `${v.name}: there is a ${p.kind} to build`);
      // Built facing +z: a prop with a front turned to face along x has its footprint the other way round.
      const [dx] = FACING.has(p.kind) ? (p.face ?? openSide(v, p)) : [0];
      const shape = dx ? { ...p, w: p.d, d: p.w } : p;
      const made = PROPS[p.kind](GFX, { ...shape, rot: 0, venue: v });
      made.group.updateMatrixWorld(true);
      box.setFromObject(made.group);
      const slack = 0.12;
      assert.ok(box.min.x >= -shape.w / 2 - slack && box.max.x <= shape.w / 2 + slack, `${v.name}: the ${p.kind} at ${p.x},${p.z} fits across (${box.min.x.toFixed(2)}..${box.max.x.toFixed(2)} in ${shape.w})`);
      assert.ok(box.min.z >= -shape.d / 2 - slack && box.max.z <= shape.d / 2 + slack, `${v.name}: the ${p.kind} at ${p.x},${p.z} fits deep (${box.min.z.toFixed(2)}..${box.max.z.toFixed(2)} in ${shape.d})`);
      assert.ok(box.min.y >= -0.05, `${v.name}: the ${p.kind} stands on the floor`);
    }
  }
});

test('the building is not furniture: crowd barriers and the stands do not break', () => {
  const sets = VENUES.map((_, i) => createGig(GFX, i)).filter((gig) => gig.venue.props.some((p) => p.kind === 'barrier' || p.kind === 'stands'));
  assert.ok(sets.length > 0, 'some set has barriers');
  for (const gig of sets) {
    const sturdy = gig.venue.props.filter((p) => p.kind === 'barrier' || p.kind === 'stands');
    assert.ok(sturdy.every((p) => !p.breakAt), `${gig.venue.name}: no breakable barriers or stands`);
  }
});

const tilesOf = (p) => Array.from({ length: p.w * p.d }, (_, k) => [p.x + (k % p.w), p.z + Math.floor(k / p.w)]);

test('a prop with a front faces open floor, and one against a wall turns its back to it', () => {
  const london = loadVenue(0);
  const wall = (x, z) => london.cell(x, z)?.kind === 'wall' && !london.cell(x, z).prop;
  const benches = london.props.filter((p) => p.kind === 'bench' && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dz]) => wall(p.x + dx, p.z + dz)));
  assert.ok(benches.length > 1, 'London has benches against a wall');
  for (const b of benches) {
    const [dx, dz] = openSide(london, b);
    assert.ok(wall(b.x - dx, b.z - dz), `the bench at ${b.x},${b.z} sits with its back to the wall`);
  }
  for (let i = 0; i < VENUES.length; i++) {
    const v = loadVenue(i);
    for (const p of v.props.filter((q) => FACING.has(q.kind))) {
      const [dx, dz] = p.face ?? openSide(v, p);
      const ahead = dx ? Array.from({ length: p.d }, (_, j) => [dx > 0 ? p.x + p.w : p.x - 1, p.z + j]) : Array.from({ length: p.w }, (_, k) => [p.x + k, dz > 0 ? p.z + p.d : p.z - 1]);
      assert.ok(ahead.some(([x, z]) => v.cell(x, z) && v.cell(x, z).kind !== 'wall'), `${v.name}: the ${p.kind} at ${p.x},${p.z} faces a wall`);
    }
  }
});

test('nothing is stood or left lying where something drops, an effect goes off or a closed set shuts', () => {
  for (let i = 0; i < VENUES.length; i++) {
    const v = loadVenue(i);
    for (const p of v.props.filter((q) => !q.free)) {
      for (const [x, z] of tilesOf(p)) {
        const c = v.cell(x, z);
        assert.ok(!c?.crush && !c?.trap && !c?.door, `${v.name}: the ${p.kind} at ${p.x},${p.z} is in the way of a hazard at ${x},${z}`);
      }
    }
    for (const p of v.pickups) {
      const c = v.cell(Math.floor(p.x), Math.floor(p.z));
      assert.ok(!c?.crush && !c?.trap && !c?.door, `${v.name}: the ${p.kind} at ${p.x},${p.z} lies in a hazard`);
    }
  }
});

test('nothing is laid over a prop once it is put down: no live cable, no floor, under any of it', () => {
  for (let i = 0; i < VENUES.length; i++) {
    const v = loadVenue(i);
    for (const p of v.props.filter((q) => !q.free)) {
      for (const [x, z] of tilesOf(p)) {
        const c = v.cell(x, z);
        assert.equal(c?.prop, p.kind, `${v.name}: the ${p.kind} at ${p.x},${p.z} has ${c ? c.kind : 'nothing'} laid over it at ${x},${z}`);
      }
    }
  }
});

test('closed sets and breakaways close off the whole way: no getting round the ends', () => {
  for (let i = 0; i < VENUES.length; i++) {
    const v = loadVenue(i);
    for (const g of v.doors) {
      const ends = g.axis === 'x' ? [[g.x, g.z - 1], [g.x, g.z + g.d]] : [[g.x - 1, g.z], [g.x + g.w, g.z]];
      for (const [x, z] of ends) {
        const c = v.cell(x, z);
        assert.ok(!c || c.kind === 'wall' || (c.prop && !c.breakable), `${v.name}: the ${g.kind} at ${g.x},${g.z} can be got round at ${x},${z}`);
      }
    }
  }
});
