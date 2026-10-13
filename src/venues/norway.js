import { digger } from '../dig.js';
import { Venue } from '../venue.js';
import { across, backTile, barred, branch, flat, loop, wallTile, wash } from './helpers.js';

/**
 * Track 7: Norway, 1993. Black metal: a car park outside a very old wooden
 * church (the church is fine; do not ask), a forest road in the snow, a
 * mountain pass where the snowballs come down on the beat and the frost
 * comes up out of the ground, a fjord, a longship across it, and a toll
 * booth on the far shore with a troll in it who does not take cards. At the
 * end is a hall, where there is a show, and where nobody is smiling. The
 * recording quality is, by design, terrible. Everybody is in make-up. It is
 * eleven below.
 */

export const NORWAY = {
  tiles: ['#c8d8e4', '#a8bccc', '#8a9aaa', '#dce8f0'],
  walls: ['#8a9aaa', '#7a8a9a', '#9aaabb', '#6a7a8a'],
  ambient: [0.85, 0.92, 1.0], lamp: '#ffd8a0', trap: '#06101c', lift: '#8a5a2a', exit: '#ff3a2a', sticky: '#8a9aaa', ice: '#cfe6f4', vary: 0.06,
};

/** Norway after dark: ice blue, a sheet of white, a blood red, the gold of a window a long way off. */
const FROST = ['#8ad8ff', '#e8f4ff', '#ff3a3a', '#ffd890'];

export function norway() {
  const g = new Venue({
    name: 'Norway', act: 7, cols: 150, rows: 130, palette: NORWAY, tempo: 198,
    intro: 'It is eleven below. Everybody is in make-up. Nobody is smiling. This is the nicest it gets.',
    look: {
      place: 'Norway', year: 1993, genre: 'Black Metal', poster: '#4a6a8a', grade: 'frost', weather: 'snow', voice: 'black', theme: 'fjord',
      floor: 'snow', wall: 'cliff', lamp: 'bulb', crusher: 'snowball', lift: 'longship', pyro: 'frost', gate: 'border',
      hemi: ['#a0c0e8', '#0a1018', 0.95], key: '#c8d8ff', keyK: 0.85, lantern: '#ffe0b0',
      skyColors: ['#02040c', '#061020', '#0c1c3a', '#1a3058', '#3a5a88'], stars: true, skyline: '#04080e', horizon: 'fjord', glow: '#bfe8ff',
      reflect: FROST, ceiling: '#101820',
      rig: { colors: FROST.slice(0, 2), program: 'static', every: 4 },
    },
  });
  const sign = (p, along, text, color = FROST[1], size = 0.5, height = 1.6) => g.light('neon', ...wallTile(p, along), { text, color, height, size });
  const lamppost = (p, along) => g.light('streetlamp', ...wallTile(p, along), { height: 2.4 });
  const SNOW = { floor: 'snow', wall: 'cliff' };

  // The car park: a van with its engine off and its doors open, a rune stone, the sound of nothing at all.
  g.room(2, 14, 9, 9, 60, { lamps: 2, floor: 'snow', wall: 'cliff' });
  g.block(3, 15, 3, 2, 0.9, { prop: 'van' });
  g.bumper(8, 16, { radius: 0.4, look: 'runestone' });
  g.start = { x: 6, z: 19 };
  const d = digger(g, { x: 11, z: 18, h: 60, heading: '+x' });

  // The forest road: spruce on both sides, the make-up out for a walk, a wolf on the verge, the crows on the wires; a patch of black ice.
  const road = d.hall(16, { width: 5, ...SNOW });
  for (const a of [1, 2, 3]) g.pick(...road.tile(a, 0), 5);
  g.foe('corpsepaint', ...road.tile(5, 1), { range: 5 }).foe('corpsepaint', ...road.tile(10, -1), { range: 5 });
  g.foe('wolf', ...road.tile(8, 0), { path: loop(road, 1, 6, 15) });
  g.foe('crow', ...road.tile(13, 0), { path: loop(road, 1, 10, 16) });
  g.ice(...road.rect(6, 3, road.lo, 5));
  g.pick(...road.tile(7, 0), 5).pick(...road.tile(7, 1), 5).pick(...road.tile(12, 1), 10);
  g.bumper(...road.tile(11, 2), { radius: 0.4, look: 'runestone' });
  lamppost(road, 3);
  sign(road, 8, 'GRIM · FROSTBITTEN', FROST[0], 0.5, 1.7);
  // A hunter's cabin, off the front of the road, its door drifted shut: the first demo tape. Run at it.
  const cabin = branch(d, road, 4, 'front', 3);
  const porch = cabin.hall(7, { width: 3, wall: 'timber' });
  flat(g, porch, 6, { look: 'snow', breakAt: 6.5 });
  const den = cabin.room(5, 5, { wall: 'timber', floor: 'planks' });
  g.demo(...den.tile(3, 0));
  g.vinyl(...den.tile(1, -1), 50).pick(...den.tile(1, 1), 10);
  // The church, off the back of the road: very old, very cold, entirely intact. The pass is on the altar, and so is whoever is guarding it.
  const church = branch(d, road, 12, 'back', 3);
  church.hall(3, { wall: 'timber' });
  const nave = church.room(6, 7, { wall: 'timber', floor: 'planks' });
  g.pass(...nave.tile(3, 0));
  g.pillar(...nave.tile(5, 3), 0.8, { prop: 'tomb' });
  g.foe('corpsepaint', ...nave.tile(2, 2), { range: 4 });
  g.pick(...nave.tile(4, -2), 10);
  d.turn('+z', SNOW);
  d.hall(3, SNOW);

  // Down the mountain: a long flight of frozen stairs, snowballs the size of a bus let go off the slope on the beat, the frost coming up out of the rock between them.
  d.stairs(8, 4, { ...SNOW, width: 5 });
  const pass = d.hall(16, { width: 5, floor: 'scree', wall: 'cliff' });
  g.drop(...across(pass, 3, { beats: 4 }));
  g.drop(...across(pass, 8, { beats: 4, offset: 0.5 }));
  g.pyro(...across(pass, 13, { beats: 4 }));
  g.pick(...pass.tile(1, 0), 5).pick(...pass.tile(5, 0), 5).pick(...pass.tile(5, 1), 5).pick(...pass.tile(10, 0), 10).pick(...pass.tile(14, 0), 10);
  g.foe('skier', ...pass.tile(6, 1), { range: 5 }).foe('wolf', ...pass.tile(11, 0), { path: loop(pass, 1, 9, 16) });
  g.foe('crow', ...pass.tile(7, 0), { path: loop(pass, 1) });
  g.whetstone(...pass.tile(15, 1));
  lamppost(pass, 2);
  // A sauna hut, drifted in, off the back of the pass: the second demo tape.
  const sauna = branch(d, pass, 11, 'back', 3);
  const lee = sauna.hall(7, { width: 3, wall: 'timber' });
  flat(g, lee, 6, { look: 'snow', breakAt: 6.5 });
  const hut = sauna.room(5, 5, { wall: 'timber', floor: 'planks' });
  g.demo(...hut.tile(3, 0));
  g.vinyl(...hut.tile(1, 1), 60).whetstone(...hut.tile(1, -1));
  d.hall(3, { floor: 'scree', wall: 'cliff' });
  d.stairs(6, 3, { ...SNOW, width: 3 });

  // The fjord: black water, ice at the edge of it, a longship that goes across at the pace of one, the crows over it.
  const quay = d.hall(8, { width: 3, floor: 'planks', wall: 'timber' });
  g.foe('corpsepaint', ...quay.tile(4, 0), { range: 3 });
  g.pick(...quay.tile(1, 0), 5).pick(...quay.tile(6, 1), 5);
  g.foe('crow', ...quay.tile(5, 0), { path: loop(quay, 1) });
  lamppost(quay, 2);
  d.ferry(15, { size: 3, period: 9 });
  const shore = d.hall(9, { width: 5, floor: 'planks', wall: 'timber' });
  g.pick(...shore.tile(2, 0), 5).pick(...shore.tile(6, 1), 10);
  g.foe('wolf', ...shore.tile(5, -1), { path: loop(shore, 1, 1, 8) });
  g.lighter(...shore.tile(7, -1));
  g.whetstone(...shore.tile(8, 1));
  // Out along a jetty to the boathouse: the third demo tape.
  const jetty = branch(d, shore, 4, 'front', 3);
  jetty.hall(2, { wall: 'timber' });
  const board = jetty.bridge(7, { floor: 'planks' });
  g.foe('crow', ...board.tile(3, 0), { path: [board.tile(1, 0), board.tile(5, 0)] });
  const shed = jetty.room(5, 5, { wall: 'timber', floor: 'planks' });
  g.demo(...shed.tile(2, 0));
  d.turn('+x', { floor: 'snow', wall: 'cliff' });
  d.hall(3, { floor: 'snow', wall: 'cliff' });

  // The toll booth on the shore road: a barrier arm, and a troll in it with a club and no card reader; the barrier does not lift without a pass.
  const toll = d.hall(10, { width: 3, ...SNOW });
  g.foe('troll', ...toll.tile(3, 0), { range: 3 });
  g.pick(...toll.tile(1, 0), 5).pick(...toll.tile(5, 1), 5).pick(...toll.tile(6, -1), 5);
  barred(g, toll, 8, 'border');
  sign(toll, 5, 'TOLL · CASH ONLY', FROST[2], 0.42, 1.7);
  d.hall(2, { floor: 'planks', wall: 'timber' });

  // The hall: log walls, a stage of boards with a dragon prow on it, candles in the rafters and the make-up in rows; nobody is smiling, which is the point.
  const hall = d.room(20, 15, { floor: 'planks', wall: 'timber' });
  g.pillar(...backTile(hall, 4), 1.2, { prop: 'amp' });
  g.pillar(...backTile(hall, 16), 1.2, { prop: 'speaker' });
  for (const [a, b] of [[6, -6], [6, 6], [13, -6], [13, 6]]) g.pillar(...hall.tile(a, b), 0.8, { prop: 'tomb' });
  g.foe('corpsepaint', ...hall.tile(6, -2), { range: 5 }).foe('corpsepaint', ...hall.tile(9, 3), { range: 5 });
  g.foe('troll', ...hall.tile(13, 0), { range: 5 });
  g.foe('wolf', ...hall.tile(10, 0), { path: loop(hall, 2, 7, 17) });
  g.foe('soundguy', ...hall.tile(17, -3), { range: 4 });
  g.pick(...hall.tile(2, 0), 10).pick(...hall.tile(8, -5), 10).pick(...hall.tile(8, 5), 10).pick(...hall.tile(15, -5), 10).pick(...hall.tile(15, 5), 10);
  g.whetstone(...hall.tile(2, -6)).whetstone(...hall.tile(2, 6));
  g.light('chandelier', ...wallTile(hall, 6), { colors: ['#ffd890'], height: 2.4, glow: 0.9 });
  g.light('chandelier', ...wallTile(hall, 14), { colors: ['#ffd890'], height: 2.4, glow: 0.9 });
  wash(g, hall, [FROST[0], FROST[2]], { cans: 3, program: 'chase', every: 4 });
  sign(hall, 10, 'TONIGHT: NOBODY SMILES', FROST[2], 0.45, 1.9);
  d.hall(3, { floor: 'planks', wall: 'timber' });
  d.exit(3);
  return g;
}
