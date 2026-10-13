import { digger } from '../dig.js';
import { Venue } from '../venue.js';
import { across, backTile, barred, branch, flat, frontHeading, toBack, wallTile, wash } from './helpers.js';

/**
 * Stop 9: Sydney. The far side of the world, and the show is at the Opera
 * House. Off the top of the Harbour Bridge's arch, where the climbers go,
 * down the stairs inside it; across Circular Quay, the wharf crane dropping
 * crates on the beat and the harbour ferries the only way over the water,
 * a snow globe through the glass of the Opera House's foyer; down to the
 * Rocks, the beer garden where the barbecues flare on the beat; along
 * Bondi, the rip pulling everything out toward the edge, the surfers and
 * the lifeguards; and the surf club, the boards racked and the passport in
 * the lockers, a globe behind the club's back wall and another out on the
 * rock pool, a croc on the way. Surf rock at a gallop, and a didgeridoo.
 */

export const SYDNEY = {
  tiles: ['#c8c4b8', '#b4b0a4', '#3a8ad8', '#a8a498'],
  walls: ['#d8d4c8', '#c4c0b4', '#3a8ad8', '#b4b0a4'],
  ambient: [1.0, 1.0, 1.02], lamp: '#ffe0a8', trap: '#1a2a3a', lift: '#2a6a3a', exit: '#ffd23a', zapHue: 0.6, vary: 0.06,
};

/** The harbour at night: the bridge's lamps, the Opera House lit white, the surf's blue, a barbecue's orange. */
const HARBOUR = ['#ffe0a8', '#f4f6ff', '#3ab0ff', '#ff8a3a'];

export function sydney() {
  const g = new Venue({
    name: 'Sydney', act: 9, cols: 142, rows: 140, palette: SYDNEY, tempo: 160,
    intro: 'The other side of the world. Rock is upside down. He cannot tell.',
    look: {
      country: 'Australia', poster: '#1a8ad8', grade: 'tropical', theme: 'sydney', floor: 'concrete', wall: 'stucco', lamp: 'bulb', crusher: 'crate', lift: 'ferry', gate: 'border',
      hemi: ['#c8d8f0', '#3a3430', 1.1], key: '#fff0d8', keyK: 1.1, lantern: '#ffe0a8',
      skyColors: ['#020814', '#061428', '#0e2440', '#1c3050', '#304060'], stars: true, skyline: '#05080e', horizon: 'sea',
      reflect: HARBOUR, ceiling: '#1e2230',
      rig: { colors: HARBOUR.slice(0, 2), program: 'pulse', every: 2 },
    },
  });
  const sign = (p, along, text, color = HARBOUR[0], size = 0.55, height = 1.6) => g.light('neon', ...wallTile(p, along), { text, color, height, size });
  const beacon = (p, along, color = HARBOUR[2], reach = 2) => g.light('spot', ...wallTile(p, along), { colors: [color], radius: reach, aim: toBack(p).map((v) => -(reach + 1) * v), height: 1.3, angle: 0.22 });
  const QUAY = { floor: 'plate', wall: 'stucco' };

  // The top of the arch, where the bridge climbers come up.
  g.room(2, 4, 5, 5, 96, { lamps: 3, floor: 'plate', wall: 'fence' });
  g.start = { x: 4, z: 6 };
  g.light('klieg', 3, 8, { yaw: 0.7, sweep: 0.9 });
  const d = digger(g, { x: 7, z: 6, h: 96, heading: '+x' });
  const arch = d.hall(12, { width: 5, floor: 'plate', wall: 'fence' });
  for (const k of [3, 8]) g.pillar(...backTile(arch, k), 1.0, { prop: 'flagpole' });
  g.foe('surfer', ...arch.tile(6, 1), { range: 3 }).foe('drone', ...arch.tile(9, 0), { path: [arch.tile(3, 0), arch.tile(11, 0)] });
  g.pick(...arch.tile(1, 0), 5).pick(...arch.tile(5, -1), 5).pick(...arch.tile(10, 1), 10);
  sign(arch, 6, 'BRIDGE CLIMB', HARBOUR[1], 0.45);
  d.turn('+z', { floor: 'plate', wall: 'block' });
  // The stairs inside the arch: down and round.
  d.stairs(6, 3, { wall: 'block' });
  d.turn('+x', { floor: 'plate', wall: 'block' });
  d.stairs(5, 2.5, { wall: 'block' });
  d.hall(2, QUAY);

  // Circular Quay: the wharf crane dropping crates, and the harbour ferries over the water.
  const wharf = d.hall(8, { width: 5, ...QUAY });
  g.drop(...across(wharf, 4, { beats: 8 }));
  g.foe('tourist', ...wharf.tile(6, 1), { range: 3 });
  g.pick(...wharf.tile(2, 0), 5).pick(...wharf.tile(7, -1), 10);
  beacon(wharf, 2);
  const water1 = d.ferry(9, { size: 3, period: 6 });
  g.zap(...water1.rect(0, 9, water1.lo - 2, 7), d.h - 1.8, { fill: true });
  d.bridge(6, { width: 1, floor: 'planks' });
  const jetty = d.hall(4, { width: 3, ...QUAY });
  g.tape(...jetty.tile(2, 1));
  const water2 = d.ferry(9, { size: 3, period: 7, phase: 2 });
  g.zap(...water2.rect(0, 9, water2.lo - 2, 7), d.h - 1.8, { fill: true });
  const far = d.hall(4, { width: 5, ...QUAY });
  g.pick(...far.tile(2, 0), 10);
  // Through the glass of the Opera House's foyer: a snow globe on the bar nobody is serving at.
  const foyer = branch(d, far, 2, 'back', 3);
  const glass = foyer.hall(5, { floor: 'marble', wall: 'stucco' });
  flat(g, glass, 3, { look: 'glass', breakAt: 6 });
  const lounge = foyer.room(5, 5, { floor: 'carpet', wall: 'stucco' });
  g.globe(...lounge.tile(3, 0));
  g.block(...lounge.rect(1, 1, 1, 2), 0.8, { prop: 'desk' });
  d.turn('+z', QUAY);
  d.ramp(8, 4, { floor: 'cobble', wall: 'brick' });

  // The Rocks: a beer garden, the barbecues flaring across it on the beat, a kangaroo who has wandered in.
  const garden = d.room(19, 13, { floor: 'grass', wall: 'brick' });
  for (const k of [2, 7, 12]) g.block(...garden.rect(k, 2, garden.back * 6 - (garden.back > 0 ? 1 : 0), 2), 0.9, { prop: 'bbq' });
  g.pyro(...across(garden, 5, { beats: 4 }));
  g.pyro(...across(garden, 10, { beats: 4, offset: 0.5 }));
  g.pyro(...across(garden, 15, { beats: 4 }));
  g.foe('surfer', ...garden.tile(3, 2), { range: 3 }).foe('kangaroo', ...garden.tile(8, -1), { range: 2 }).foe('lifeguard', ...garden.tile(13, 2), { range: 2 });
  g.pick(...garden.tile(1, 0), 10).pick(...garden.tile(7, 3), 10).pick(...garden.tile(12, -2), 10).pick(...garden.tile(18, 0), 10);
  g.tape(...garden.tile(17, 4));
  for (const k of [4, 14]) beacon(garden, k, k === 4 ? HARBOUR[3] : HARBOUR[0]);
  sign(garden, 9.5, 'THE ROCKS', HARBOUR[0], 0.5);
  d.hall(2, { floor: 'cobble', wall: 'brick' });
  d.turn('+x', { floor: 'sand', wall: 'fence' });

  // Bondi: the sand, and the rip pulling everything out toward the edge; surfers, a lifeguard on his tower.
  const bondi = d.ledge(22, { width: 5, floor: 'sand', wallTex: 'fence' });
  const rip = frontHeading(bondi);
  g.belt(...bondi.rect(3, 4, bondi.lo, 5), rip);
  g.belt(...bondi.rect(11, 4, bondi.lo, 5), rip);
  g.block(...bondi.rect(8, 2, bondi.back * 2, 1), 0.9, { prop: 'umbrella' });
  g.block(...bondi.rect(17, 2, bondi.back * 2, 1), 0.9, { prop: 'umbrella' });
  g.foe('surfer', ...bondi.tile(10, 0), { range: 2 });
  g.foe('lifeguard', ...bondi.tile(20, 0), { range: 2 });
  g.pick(...bondi.tile(2, bondi.back), 5).pick(...bondi.tile(9, -bondi.back), 5).pick(...bondi.tile(16, -bondi.back), 10);
  g.lighter(...bondi.tile(21, -bondi.back));
  sign(bondi, 7, 'BONDI', HARBOUR[2], 0.5);
  sign(bondi, 14, 'SWIM BETWEEN THE FLAGS', '#ffd23a', 0.32);
  d.turn('+z', QUAY);
  d.hall(2, QUAY);

  // The surf club: the boards racked up, the lockers, the passport in one of them, the lifeguards on their break.
  const club = d.room(17, 13, { floor: 'planks', wall: 'stucco' });
  for (const [a, b] of [[3, -4], [3, 4], [13, -4], [13, 4]]) g.pillar(...club.tile(a, b), 1.3, { prop: 'surfrack' });
  g.block(...club.rect(7, 3, club.back * 6, 1), 1.3, { prop: 'lockers' });
  g.pass(...club.tile(5, 3));
  g.foe('lifeguard', ...club.tile(12, -2), { range: 3 }).foe('surfer', ...club.tile(14, 2), { range: 4 }).foe('kangaroo', ...club.tile(5, -2), { range: 4 });
  g.pick(...club.tile(1, 0), 10).pick(...club.tile(11, -3), 10).pick(...club.tile(16, 3), 10);
  g.suitcase(...club.tile(16, -5), 70);
  wash(g, club, [HARBOUR[1], HARBOUR[2]], { cans: 3, program: 'static' });
  sign(club, 4, 'SURF CLUB', HARBOUR[3], 0.45);
  const wall = branch(d, club, 11, 'front', 7);
  const back = wall.hall(5, { floor: 'planks', wall: 'stucco' });
  flat(g, back, 3, { look: 'drywall', breakAt: 6.5 });
  const shed = wall.room(5, 5, { floor: 'planks', wall: 'stucco' });
  g.globe(...shed.tile(3, 0));
  // Out of the back of the club, along the rocks to the rock pool, a croc on the way: the last globe.
  const pool = branch(d, club, 3, 'front', 7);
  const rocks = pool.bridge(6, { floor: 'scree' });
  g.zap(...rocks.rect(0, 6, rocks.lo - 2, 5), pool.h - 1.8, { fill: true });
  g.foe('croc', ...rocks.tile(3, 0), { path: [rocks.tile(1, 0), rocks.tile(4, 0)] });
  const rockpool = pool.room(5, 5, { floor: 'scree', wall: 'cliff' });
  g.globe(...rockpool.tile(2, 0));
  const door = d.hall(4, QUAY);
  barred(g, door, 2);
  d.hall(2, QUAY);
  d.exit(3);
  return g;
}
