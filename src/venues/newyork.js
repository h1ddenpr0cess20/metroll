import { digger } from '../dig.js';
import { Venue } from '../venue.js';
import { barred, branch, facingRot, flat, toBack, wallTile, wash } from './helpers.js';

/**
 * Stop 10: New York. The last night of the tour, the big one: out of a
 * yellow cab into Times Square, the billboards stacked up into the sky and
 * the searchlights going; down Broadway between the velvet ropes, the
 * theatres lit, the paparazzi who have followed him round the world and
 * the hoofers between shows; into the arena's concourse, the hot dogs, the
 * security, the passport left at the box office, a globe in the coat check;
 * through the doors and down the stands, the speaker stacks of the first
 * tour coming down over the aisles; across the pit on the crowd's hands;
 * and onto the stage, where the Superfan, who has been to every show of
 * the tour and has Rock's face on his arm (it is not Rock's face), moves on
 * the beat, like Rock taught him. The anthem again, with the brass out.
 */

export const NEWYORK = {
  tiles: ['#5a5e66', '#4a4e56', '#ffd23a', '#3a3e46'],
  walls: ['#7a6a5a', '#6a5a4a', '#ffd23a', '#5a4a3a'],
  ambient: [1.0, 0.98, 1.0], lamp: '#ffe0a0', trap: '#2a1a1e', lift: '#3a2a2e', exit: '#ffd23a', zapHue: 1.2, vary: 0.05,
};

/** New York at night: a cab's yellow, a searchlight's white, Broadway's red, a billboard's electric blue. */
const BROADWAY = ['#ffd23a', '#f4f0ff', '#ff3a4a', '#3ab0ff'];

export function newyork() {
  const g = new Venue({
    name: 'New York', act: 10, cols: 140, rows: 146, palette: NEWYORK, tempo: 136,
    intro: 'The last night of the tour. The Garden. Sold out. Rock is not on the list.',
    look: {
      country: 'USA', poster: '#e8b020', theme: 'finale', floor: 'asphalt', wall: 'brick', lamp: 'bulb', crusher: 'speaker', lift: 'crowd', gate: 'border',
      hemi: ['#ffe8d8', '#4a2028', 1.15], key: '#fff0e0', keyK: 1.1, lantern: '#ffe8c8',
      skyColors: ['#020410', '#060a1e', '#0e1430', '#1c1c40', '#302848'], stars: false, skyline: '#05060c', horizon: 'city',
      reflect: BROADWAY, ceiling: '#2a1620',
      rig: { colors: BROADWAY.slice(0, 2), program: 'chase', every: 4 },
    },
  });
  const billboard = (p, along, text, color = BROADWAY[0], size = 0.55, height = 1.6) => g.light('marquee', ...wallTile(p, along), { text, color, height, size });
  const neon = (p, along, text, color = BROADWAY[3], size = 0.5, height = 1.6) => g.light('neon', ...wallTile(p, along), { text, color, height, size });
  const AVENUE = { floor: 'asphalt', wall: 'brick' };
  const rope = (p, along, across = 0) => g.bumper(...p.tile(along, across), { radius: 0.4, look: 'rope' });

  // The cab, at the kerb.
  g.room(2, 4, 5, 5, 84, { lamps: 3, ...AVENUE });
  g.start = { x: 4, z: 6 };
  g.light('klieg', 3, 8, { yaw: 0.5, sweep: 0.9, shift: 0 });
  const d = digger(g, { x: 7, z: 6, h: 84, heading: '+x' });
  // Times Square: the billboards stacked up into the sky, the fans already here, a hot dog cart, the searchlights.
  const times = d.hall(14, { width: 5, ...AVENUE });
  g.foe('fan', ...times.tile(5, 1), { range: 4 }).foe('hotdog', ...times.tile(10, -1), { range: 4 });
  g.pick(...times.tile(1, 0), 5).pick(...times.tile(4, -1), 5).pick(...times.tile(8, 1), 5).pick(...times.tile(12, 0), 10);
  g.light('klieg', ...times.tile(7, -2), { yaw: 1.1, sweep: 0.8, shift: 1.5 });
  for (const k of [3, 11]) g.light('streetlamp', ...times.tile(k, 2), { height: 2.4 });
  neon(times, 6, 'TIMES SQ', BROADWAY[3], 0.55);
  d.turn('+z', AVENUE);
  d.hall(2, { floor: 'carpet', wall: 'brick' });

  // Broadway: the velvet ropes, the paparazzi and the hoofers, a cop on the beat, the theatres' marquees.
  const broadway = d.room(24, 9, { floor: 'carpet', wall: 'damask' });
  for (const a of [3, 7, 11, 15, 19]) { rope(broadway, a, -2); rope(broadway, a, 2); }
  g.foe('paparazzo', ...broadway.tile(5, 3), { range: 4 }).foe('paparazzo', ...broadway.tile(13, -3), { range: 4 });
  g.foe('dancer', ...broadway.tile(9, 0), { range: 5 }).foe('cabbie', ...broadway.tile(17, 3), { range: 4 }).foe('cop', ...broadway.tile(21, -2), { range: 4 });
  g.pick(...broadway.tile(2, 0), 10).pick(...broadway.tile(8, -3), 10).pick(...broadway.tile(14, 3), 10).pick(...broadway.tile(20, 0), 10);
  billboard(broadway, 11.5, 'SOLD OUT', BROADWAY[0], 0.9, 1.6);
  billboard(broadway, 3.5, 'TONIGHT', BROADWAY[1], 0.45);
  billboard(broadway, 20.5, 'BROADWAY', BROADWAY[2], 0.45);
  wash(g, broadway, [BROADWAY[1], BROADWAY[0]], { cans: 3, program: 'static' });
  d.hall(5, { floor: 'checker', wall: 'brick' });
  d.turn('+x', { floor: 'checker', wall: 'block' });
  d.hall(2, { floor: 'checker', wall: 'block' });

  // The arena's concourse: the hot dog stand down the back, security everywhere, the box office with the passport.
  const concourse = d.room(15, 13, { floor: 'checker', wall: 'block' });
  g.block(...concourse.rect(3, 9, concourse.back * 6, 1), 0.9, { prop: 'bar' });
  g.suitcase(...concourse.tile(5, concourse.back * 5), 60).suitcase(...concourse.tile(10, concourse.back * 5), 60);
  g.foe('hotdog', ...concourse.tile(6, 3), { range: 5 }).foe('security', ...concourse.tile(10, -1), { range: 5 }).foe('bouncer', ...concourse.tile(13, 3), { range: 3 });
  g.pass(...concourse.tile(4, 4));
  g.pick(...concourse.tile(2, 0), 10).pick(...concourse.tile(8, 2), 10);
  g.tape(...concourse.tile(14, -3));
  wash(g, concourse, [BROADWAY[0], BROADWAY[1]], { cans: 2, program: 'static' });
  neon(concourse, 7.5, 'HOT DOGS', BROADWAY[2], 0.5, 2.0);
  // The coat check, behind its curtain: the first snow globe, in somebody's coat.
  const coats = branch(d, concourse, 7, 'front', 7);
  const curtain = coats.hall(5, { floor: 'carpet', wall: 'damask' });
  flat(g, curtain, 3, { look: 'curtain', breakAt: 6 });
  const check = coats.room(5, 5, { floor: 'carpet', wall: 'damask' });
  g.globe(...check.tile(3, 0));
  g.pillar(...check.tile(3, 2), 1.1, { prop: 'rail' });
  const doors = d.hall(4, { floor: 'carpet', wall: 'block' });
  barred(g, doors, 2);
  d.turn('+z', { floor: 'carpet', wall: 'block' });
  d.hall(5, { floor: 'carpet', wall: 'block' });

  // The stands: raked down to the floor, rows of seats with an aisle in each, the speaker stacks coming down over the aisles.
  const stands = d.stairs(18, 3, { width: 13, floor: 'carpet', wall: 'block', color: 0 });
  g.enclose(stands.x, stands.z, stands.w, stands.d, { sides: 'z0', wall: 'block' });
  const rows = [[3, -4], [6, 3], [9, -1], [12, 4], [15, -3]];
  for (const [along, aisle] of rows) {
    const lo = stands.lo, hi = lo + stands.width;
    const left = aisle - 1, right = aisle + 2;
    if (left > lo) g.block(...stands.rect(along, 1, lo, left - lo), 0.7, { prop: 'seat', rot: facingRot(stands.dir) });
    if (hi > right) g.block(...stands.rect(along, 1, right, hi - right), 0.7, { prop: 'seat', rot: facingRot(stands.dir) });
  }
  for (const [i, [along, aisle]] of [[0, rows[1]], [1, rows[3]]]) g.drop(...stands.tile(along + 1, aisle), { w: 2, d: 2, beats: 8, offset: i * 0.5 });
  g.foe('cop', ...stands.tile(4, 0), { range: 4 }).foe('fan', ...stands.tile(10, 2), { range: 4 }).foe('cabbie', ...stands.tile(14, -2), { range: 4 });
  for (const [along, aisle] of rows) g.pick(...stands.tile(along - 1, aisle), 10);
  g.lighter(...stands.tile(16, 5));
  wash(g, stands, [BROADWAY[0], BROADWAY[2]], { cans: 3, program: 'chase', every: 4 });

  // The pit: across on the crowd's hands.
  d.hall(1, { width: 13, floor: 'planks', wall: 'block' });
  const pit = d.ferry(11, { size: 3, period: 8 });
  g.zap(...pit.rect(0, 11, pit.lo - 2, 7), d.h - 1.6, { fill: true });
  g.light('strobe', ...pit.tile(5, -3), { colors: ['#ffffff'], reach: 9, height: 2.8 });
  // Into the wings, and round onto the stage.
  d.hall(2, { floor: 'planks', wall: 'curtain' });
  d.turn('+x', { floor: 'planks', wall: 'curtain' });
  d.hall(5, { floor: 'planks', wall: 'curtain' });

  // The stage: the backline, the crowd barrier along the front, the lights, and the Superfan.
  const stage = d.room(19, 15, { floor: 'planks', wall: 'curtain' });
  g.block(...stage.rect(7, 5, stage.back * 6 - (stage.back > 0 ? 1 : 0), 2), 1.6, { prop: 'amp' });
  g.block(...stage.rect(3, 2, stage.back * 5 - (stage.back > 0 ? 1 : 0), 2), 1.0, { prop: 'drums' });
  g.block(...stage.rect(9, 3, -stage.back * 7, 1), 1.0, { prop: 'barrier', sturdy: true });
  for (const [a, b] of [[1, -6], [17, -6]]) g.pillar(...stage.tile(a, b), 1.2, { prop: 'lamp' });
  g.foe('superfan', ...stage.tile(11, 0), { range: 6 });
  g.pick(...stage.tile(2, 0), 10).pick(...stage.tile(6, -3), 10).pick(...stage.tile(7, 5), 10).pick(...stage.tile(12, -5), 10);
  g.tape(...stage.tile(2, -5)).tape(...stage.tile(2, 5));
  g.light('spot', ...wallTile(stage, 5), { colors: ['#fff4e0'], radius: 3, aim: toBack(stage).map((v) => -5 * v), height: 2.6 });
  g.light('spot', ...wallTile(stage, 14), { colors: ['#fff4e0'], radius: 3, aim: toBack(stage).map((v) => -5 * v), height: 2.6, shift: 2 });
  billboard(stage, 9.5, 'WORLD TOUR', BROADWAY[0], 0.6, 2.0);
  // Through the trap under the stage: the second globe.
  const trap = branch(d, stage, 5, 'front', 8);
  const under = trap.hall(5, { floor: 'planks', wall: 'block' });
  flat(g, under, 3, { look: 'wood', breakAt: 6.5 });
  const cellar = trap.room(5, 5, { floor: 'planks', wall: 'block' });
  g.globe(...cellar.tile(3, 0));
  g.suitcase(...cellar.tile(1, 1), 60);
  // Up along the lighting catwalk to the sound desk: the third.
  const desk = branch(d, stage, 15, 'front', 8);
  const walk = desk.bridge(7, { floor: 'plate' });
  g.foe('drone', ...walk.tile(3, 0), { path: [walk.tile(1, 0), walk.tile(5, 0)] });
  const booth = desk.room(5, 5, { floor: 'concrete', wall: 'block' });
  g.globe(...booth.tile(2, 0));
  g.block(...booth.rect(3, 1, -1, 1), 0.85, { prop: 'console' });
  d.hall(3, { floor: 'planks', wall: 'curtain' });
  d.exit(3);
  return g;
}
