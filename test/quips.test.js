import assert from 'node:assert/strict';
import { test } from 'node:test';

import { FOES } from '../src/foes.js';
import { QUIPS, VOICES, say, sayRock } from '../src/quips.js';
import { VENUES, loadVenue } from '../src/venues/index.js';

test('every kind of thing that can happen has something to say, and every voice a track uses exists', () => {
  for (const kind of ['smash', 'crit', 'bonk', 'tap', 'fell', 'whetstone', 'lighter', 'pass', 'locked', 'demo', 'ready', 'clear', 'tour']) {
    assert.ok(QUIPS[kind]?.length, `Metroll has a line for ${kind}`);
    assert.ok(say(kind).length > 0, `${kind} says something`);
  }
  for (let i = 0; i < VENUES.length; i++) {
    const v = loadVenue(i);
    assert.ok(VOICES[v.look.voice], `${v.name} talks in a voice that exists (${v.look.voice})`);
  }
});

test('a voice sometimes speaks for itself and sometimes leaves Metroll to its own lines', () => {
  const own = VOICES.doom.smash, plain = QUIPS.smash;
  assert.ok(own.includes(say('smash', 'doom', () => 0.1)), 'low roll: the voice');
  assert.ok(plain.includes(say('smash', 'doom', () => 0.9)), 'high roll: Metroll');
});

test('Rock, the final boss, is a boss and has his own lines for every blow', () => {
  assert.ok(FOES.rock.boss && FOES.rock.hp > 0, 'Rock is a boss');
  const last = loadVenue(VENUES.length - 1);
  assert.ok(last.foes.some((f) => f.kind === 'rock'), `${last.name} has Rock in it`);
  for (const kind of ['tap', 'bonk', 'smash', 'crit']) assert.ok(sayRock(kind).length > 0, `Rock has a line for ${kind}`);
});
