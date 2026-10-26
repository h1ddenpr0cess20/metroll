import assert from 'node:assert/strict';
import { test } from 'node:test';

import { FOES } from '../src/foes.js';
import { THEMES } from 'madness-engine/music/band';
import { loadVenue, VENUES } from '../src/venues/index.js';
import { drive } from './helpers/autopilot.js';

/** How many tracks the compilation has, when it is done. */
const TRACKS = 12;

test('every track has three demo tapes, a place, a year, a genre, a theme the score can play and people who exist', () => {
  assert.equal(VENUES.length, TRACKS, 'twelve tracks on the compilation');
  for (let i = 0; i < VENUES.length; i++) {
    const venue = loadVenue(i);
    assert.equal(venue.act, i + 1, `${venue.name} is act ${i + 1}`);
    assert.equal(venue.pickups.filter((p) => p.kind === 'demo').length, 3, `${venue.name} has three demo tapes`);
    assert.ok(venue.look.place && venue.look.year && venue.look.genre, `${venue.name} says where, when and what it is`);
    assert.ok(THEMES[venue.look.theme], `${venue.name} has a theme the score can play`);
    assert.ok(venue.tempo > 60 && venue.tempo < 200, `${venue.name} has a tempo`);
    for (const f of venue.foes) assert.ok(FOES[f.kind], `${venue.name}: no such person as ${f.kind}`);
  }
});

for (let i = 0; i < VENUES.length; i++) {
  test(`track ${i + 1}, ${loadVenue(i).name}, can be played start to finish with all three demo tapes`, () => {
    const result = drive(i);
    assert.ok(result.finished, `stuck: ${JSON.stringify(result.stuck)}`);
    assert.equal(result.gig.stats.demos, 3);
    assert.ok(result.gig.troll.hp > 0);
  });
}
