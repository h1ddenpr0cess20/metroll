import { digger } from '../dig.js';
import { Venue } from '../venue.js';
import { across, backTile, barred, branch, flat, loop, toBack, wallTile, wash } from './helpers.js';

/**
 * Track 4: Whitby, 1988. Goth: a clifftop abbey in ruins, a churchyard full
 * of the dead and of people dressed for it, a hundred and ninety-nine steps
 * down, a harbour, and a pavilion at the bottom with a band in it. It is
 * foggy. It is always foggy. Bats go over; a black cat goes across; the
 * coffins in the crypt stairs are hung on chains and come down on the beat,
 * to a clean guitar and a theremin. The way into the pavilion is a gate that
 * wants a pass. And the Count is in, and he has been waiting a long time for
 * somebody to come down the stairs.
 */

export const WHITBY = {
  tiles: ['#4a4a58', '#3a3a48', '#6a2a4a', '#5a5a6a'],
  walls: ['#4a4458', '#3a3448', '#2a3a3a', '#5a5468'],
  ambient: [0.78, 0.78, 0.96], lamp: '#ffb870', trap: '#16121e', lift: '#1a1420', exit: '#c8102e', sticky: '#2a3a2a', vary: 0.07,
};

/** Whitby by night: candle gold, the violet of the sky, a blood red, the moon's blue. */
const MIST = ['#a06aff', '#ff4a6a', '#ffd890', '#4ac8e8'];

export function whitby() {
  const g = new Venue({
    name: 'Whitby', act: 4, cols: 150, rows: 150, palette: WHITBY, tempo: 110,
    intro: 'Fog, bats, a lot of eyeliner, and somebody on the stairs who has been waiting since 1897.',
    look: {
      place: 'Whitby', year: 1988, genre: 'Goth', poster: '#5a2a6a', grade: 'mist', voice: 'goth', theme: 'abbey',
      floor: 'cobble', wall: 'stone', lamp: 'bulb', crusher: 'coffin', lift: 'hearse', pyro: 'fog', gate: 'bars', buzz: true,
      hemi: ['#9a8ad0', '#16101e', 0.9], key: '#b8c0ff', keyK: 0.8, lantern: '#ffcf90',
      skyColors: ['#04040c', '#0a0a1c', '#161230', '#2a1a48', '#4a2a5a'], stars: true, skyline: '#06040c', horizon: 'abbey', glow: '#cfd8ff',
      reflect: MIST, ceiling: '#14101e',
      rig: { colors: MIST.slice(0, 2), program: 'static', every: 4 },
    },
  });
  const sign = (p, along, text, color = MIST[2], size = 0.5, height = 1.6) => g.light('neon', ...wallTile(p, along), { text, color, height, size });
  const lamppost = (p, along) => g.light('streetlamp', ...wallTile(p, along), { height: 2.4 });
  const candles = (p, along) => g.light('chandelier', ...wallTile(p, along), { colors: ['#ffd890'], height: 2.2, glow: 0.8 });
  const STONE = { floor: 'cobble', wall: 'stone' };

  // The abbey: a ruin on the cliff, the wind in the arches, the moon in the window. Where the night starts.
  g.room(2, 4, 9, 9, 60, { lamps: 0, floor: 'marble', wall: 'stone' });
  g.start = { x: 6, z: 8 };
  g.block(3, 5, 2, 1, 0.8, { prop: 'tomb' });
  g.bumper(8, 6, { radius: 0.4, look: 'cross' });
  const d = digger(g, { x: 11, z: 8, h: 60, heading: '+x' });
  const nave = d.hall(14, { width: 5, floor: 'marble', wall: 'stone' });
  for (const a of [1, 2, 3]) g.pick(...nave.tile(a, 0), 5);
  g.pick(...nave.tile(7, 1), 5).pick(...nave.tile(11, -1), 10);
  g.foe('goth', ...nave.tile(5, 1), { range: 5 }).foe('poet', ...nave.tile(9, -1), { range: 5 });
  g.foe('bat', ...nave.tile(7, 0), { path: loop(nave, 1) });
  for (const [a, b] of [[4, -2], [10, 2]]) g.bumper(...nave.tile(a, b), { radius: 0.4, look: 'candle' });
  candles(nave, 3);
  candles(nave, 10);
  sign(nave, 7, 'WHITBY ABBEY', MIST[2], 0.5, 1.7);
  // The chapter house, behind a fallen wall: the first demo tape. Run at it.
  const chapter = branch(d, nave, 3, 'front', 3);
  const rubble = chapter.hall(3, { width: 3, wall: 'stone' });
  flat(g, rubble, 1, { look: 'stone', breakAt: 6.5 });
  const crypt0 = chapter.room(5, 5, { wall: 'stone', floor: 'marble' });
  g.demo(...crypt0.tile(3, 0));
  g.pick(...crypt0.tile(1, -1), 10).pick(...crypt0.tile(1, 1), 10);
  d.turn('+z', STONE);
  d.hall(3, STONE);

  // The churchyard: the dead, in rows, under their stones; the fog coming up between them on the beat; mourners; a cat that crosses the path.
  const yard = d.room(18, 15, { floor: 'grass', wall: 'stone' });
  for (const [a, b] of [[3, -5], [6, -5], [9, -5], [12, -5], [15, -5]]) g.pillar(...yard.tile(a, b), 0.8, { prop: 'gravestones' });
  g.block(...yard.rect(4, 2, yard.back * 5, 1), 0.7, { prop: 'tomb' });
  g.block(...yard.rect(11, 2, yard.back * 5, 1), 0.7, { prop: 'tomb' });
  for (const [a, b] of [[6, 2], [10, 3], [14, 1]]) g.bumper(...yard.tile(a, b), { radius: 0.4, look: 'cross' });
  g.bumper(...yard.tile(8, -3), { radius: 0.4, look: 'urn' });
  g.pyro(...yard.tile(5, 0), { beats: 4 });
  g.pyro(...yard.tile(9, 0), { beats: 4, offset: 0.5 });
  g.pyro(...yard.tile(13, 0), { beats: 4 });
  g.foe('mourner', ...yard.tile(6, -2), { range: 5 }).foe('mourner', ...yard.tile(12, 3), { range: 5 });
  g.foe('goth', ...yard.tile(9, 1), { range: 5 }).foe('dracfan', ...yard.tile(15, -2), { range: 5 });
  g.foe('blackcat', ...yard.tile(8, 0), { path: loop(yard, 2, 4, 14) });
  g.foe('bat', ...yard.tile(10, 0), { path: loop(yard, 1) });
  g.pick(...yard.tile(2, 0), 10).pick(...yard.tile(7, 4), 10).pick(...yard.tile(11, -3), 10).pick(...yard.tile(16, 4), 5);
  g.lighter(...yard.tile(2, 5));
  lamppost(yard, 3);
  lamppost(yard, 14);
  sign(yard, 8.5, 'DO NOT FEED THE DEAD', MIST[1], 0.45, 1.8);
  d.hall(3, STONE);
  d.stairs(6, 3, { ...STONE, width: 5 });

  // The crypt stairs: coffins hung on chains and let go on the beat; the pass is in a coffin down a side passage; the first whetstone.
  const stair = d.hall(14, { width: 5, floor: 'marble', wall: 'stone' });
  g.drop(...across(stair, 4, { beats: 4 }));
  g.pick(...stair.tile(5, 0), 5).pick(...stair.tile(5, 1), 5).pick(...stair.tile(5, -1), 5);
  g.drop(...across(stair, 9, { beats: 4, offset: 0.5 }));
  g.pick(...stair.tile(10, 0), 10);
  g.foe('goth', ...stair.tile(7, 1), { range: 3 });
  g.whetstone(...stair.tile(12, 0));
  candles(stair, 2);
  candles(stair, 8);
  const vault = branch(d, stair, 6, 'back', 3);
  vault.hall(3, { wall: 'stone' });
  const chamber = vault.room(6, 7, { wall: 'stone', floor: 'marble' });
  g.pass(...chamber.tile(3, 0));
  g.pillar(...chamber.tile(5, 3), 0.8, { prop: 'tomb' });
  g.foe('poet', ...chamber.tile(2, 2), { range: 4 });
  g.pick(...chamber.tile(4, -2), 10);
  d.turn('+x', STONE);
  d.hall(3, STONE);
  d.stairs(8, 4, { ...STONE, width: 3 });

  // The hundred and ninety-nine steps, down to the town: a long flight, a landing, a poet reciting on it.
  const steps = d.hall(6, { ...STONE, width: 3 });
  g.foe('poet', ...steps.tile(3, 0), { range: 3 });
  g.pick(...steps.tile(1, 0), 5).pick(...steps.tile(4, 1), 5);
  lamppost(steps, 2);
  // A niche in the wall of the stair, sealed with stone: the second demo tape.
  const niche = branch(d, steps, 4, 'front', 2);
  const wall2 = niche.hall(7, { width: 3, wall: 'stone' });
  flat(g, wall2, 6, { look: 'stone', breakAt: 6.5 });
  const alcove = niche.room(5, 5, { wall: 'stone', floor: 'marble' });
  g.demo(...alcove.tile(3, 0));
  g.vinyl(...alcove.tile(1, -1), 60).whetstone(...alcove.tile(1, 1));
  d.stairs(8, 4, { ...STONE, width: 3 });
  d.turn('+z', STONE);

  // The harbour: the water black under the lamps, the hearse that goes across the gap at the pace of one, the bats over it.
  const quay = d.hall(7, { width: 3, floor: 'cobble', wall: 'stone' });
  g.foe('dracfan', ...quay.tile(3, 0), { range: 3 });
  g.pick(...quay.tile(1, 0), 5).pick(...quay.tile(5, 1), 10);
  g.foe('bat', ...quay.tile(4, 0), { path: loop(quay, 1) });
  lamppost(quay, 2);
  d.ferry(15, { size: 3, period: 9 });
  const pier = d.hall(7, { width: 3, floor: 'cobble', wall: 'stone' });
  g.pick(...pier.tile(1, 0), 5).pick(...pier.tile(5, 0), 5);
  g.foe('blackcat', ...pier.tile(4, 0), { path: loop(pier, 1) });
  // Out along a jetty to the lifeboat house: the third demo tape, where the gulls are not.
  const jetty = branch(d, pier, 3, 'front', 2);
  jetty.hall(2, { wall: 'stone' });
  const board = jetty.bridge(7, { floor: 'planks' });
  g.foe('bat', ...board.tile(3, 0), { path: [board.tile(1, 0), board.tile(5, 0)] });
  const boathouse = jetty.room(5, 5, { wall: 'timber', floor: 'planks' });
  g.demo(...boathouse.tile(2, 0));
  d.turn('+x', STONE);
  d.hall(3, STONE);

  // The town: shuttered, the pub lit, the pavilion's gate at the end of the road, shut until somebody has a pass.
  const road = d.hall(8, { width: 3, floor: 'cobble', wall: 'stone' });
  g.foe('goth', ...road.tile(3, 0), { range: 3 }).foe('mourner', ...road.tile(6, 1), { range: 3 });
  g.pick(...road.tile(1, 0), 5).pick(...road.tile(4, 1), 5).pick(...road.tile(7, 0), 5);
  g.bumper(...road.tile(5, -1), { radius: 0.4, look: 'urn' });
  lamppost(road, 4);
  const gate = d.hall(6, { width: 3, floor: 'cobble', wall: 'stone' });
  barred(g, gate, 3, 'bars');
  g.pick(...gate.tile(1, 0), 5);
  sign(gate, 5, 'PAVILION', MIST[1], 0.45, 1.7);
  d.hall(2, { floor: 'marble', wall: 'stone' });

  // The pavilion: the stage at the end of it, the bar, the candles; and the Count, in the middle of the floor.
  const hall = d.room(21, 17, { floor: 'marble', wall: 'damask' });
  g.pillar(...backTile(hall, 4), 1.2, { prop: 'amp' });
  g.pillar(...backTile(hall, 17), 1.2, { prop: 'speaker' });
  for (const [a, b] of [[5, -6], [5, 6], [15, -6], [15, 6]]) g.pillar(...hall.tile(a, b), 0.8, { prop: 'tomb' });
  g.foe('count', ...hall.tile(12, 0), { range: 7 });
  g.foe('goth', ...hall.tile(8, 4), { range: 5 });
  g.foe('soundguy', ...hall.tile(17, -4), { range: 4 });
  g.pick(...hall.tile(2, 0), 10).pick(...hall.tile(7, -5), 10).pick(...hall.tile(7, 5), 10).pick(...hall.tile(13, -5), 10).pick(...hall.tile(13, 5), 10);
  g.whetstone(...hall.tile(2, -6)).whetstone(...hall.tile(2, 6));
  g.light('chandelier', ...wallTile(hall, 6), { colors: ['#ffd890'], height: 2.4, glow: 0.9 });
  g.light('chandelier', ...wallTile(hall, 14), { colors: ['#ffd890'], height: 2.4, glow: 0.9 });
  wash(g, hall, [MIST[0], MIST[1]], { cans: 3, program: 'chase', every: 4 });
  sign(hall, 10, 'TONIGHT: THE LAST NIGHT OF THE LIVING', MIST[1], 0.45, 1.9);
  d.hall(3, { floor: 'marble', wall: 'damask' });
  d.exit(3);
  void toBack;
  return g;
}
