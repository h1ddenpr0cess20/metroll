import { digger } from '../dig.js';
import { Venue } from '../venue.js';
import { across, backTile, barred, branch, flat, loop, toBack, wallTile, wash } from './helpers.js';

/**
 * Stop 4: The Alps. The show tonight is at the bottom of a mountain, and
 * Rock has been dropped off at the top of it. A boulder, on a mountain:
 * there is only one way to go. Off the summit cross, along the knife-edge
 * ridge with the ibex; down the long piste, the skiers and the
 * snowboarders all over it and the snow cannons going on the beat; along
 * the gully where the avalanche comes down, a snowball at a time; into the
 * mountain hut for a warm (the St Bernard, the yodeler, the ski pass on a
 * hook); across the gorge in the cable car; through the ice cave, where
 * the floor is glass and Rock slides; out over the glacier, its crevasses
 * bridged with ladders; down the bobsleigh run; and through the ski-lift
 * gate into the village square, where the Yeti, here on a ski holiday,
 * lunges for whatever comes down the mountain. Snow falling the whole way,
 * the sun on it, a polka, an alphorn.
 */

export const ALPS = {
  tiles: ['#d8e2ee', '#c4d2e2', '#8a6a4a', '#b4c6da'],
  walls: ['#6a707c', '#5c626e', '#5a4a3a', '#7a828e'],
  ambient: [0.92, 0.95, 1.02], lamp: '#fff4e0', trap: '#2a3a50', lift: '#c8102e', exit: '#ff3a4a', ice: '#cfe8f8', zapHue: 0.55, vary: 0.05,
};

/** The mountain by day: the sun on the snow, a sky-blue, a hut's red shutters, a lamp's warm gold. */
const PEAK = ['#ffffff', '#7ab8f0', '#d82a3a', '#ffd890'];

export function alps() {
  const g = new Venue({
    name: 'The Alps', act: 4, cols: 150, rows: 150, palette: ALPS, tempo: 144,
    intro: 'The show is at the bottom of the mountain. Rock is at the top. A boulder, on a mountain.',
    look: {
      country: 'Switzerland', poster: '#2a6ab8', grade: 'alpine', weather: 'snow', voice: 'alpine', theme: 'alps',
      floor: 'snow', wall: 'cliff', lamp: 'bulb', crusher: 'snowball', lift: 'cablecar', pyro: 'snow', gate: 'border',
      hemi: ['#d8e4f8', '#4a5468', 0.9], key: '#fff0dc', keyK: 1.25, lantern: '#fff0d8',
      skyColors: ['#2a62c8', '#4a86e0', '#7aaef0', '#b4d4f6', '#e8f2fc'], stars: false, skyline: '#5a6a8a', horizon: 'peaks',
      reflect: PEAK, ceiling: '#a8c4e8',
      rig: { colors: PEAK.slice(0, 2), program: 'static', every: 4 },
    },
  });
  const sign = (p, along, text, color = PEAK[2], size = 0.5, height = 1.6) => g.light('neon', ...wallTile(p, along), { text, color, height, size });
  const SNOW = { floor: 'snow', wall: 'cliff' };

  // The summit: a cross, a flag, the whole of the Alps round about, and the only way is down.
  g.room(2, 4, 5, 5, 150, { lamps: 0, floor: 'snow', wall: 'cliff' });
  g.start = { x: 4, z: 6 };
  g.pillar(3, 5, 1.6, { prop: 'summit' });
  const d = digger(g, { x: 7, z: 6, h: 150, heading: '+x' });
  // Along the ridge: a knife-edge with nothing either side, an ibex who lives up here and minds.
  const ridge = d.bridge(9, { width: 2, floor: 'snow', color: 0 });
  g.foe('ibex', ...ridge.tile(6, 0), { range: 3 });
  g.pick(...ridge.tile(2, 0), 5).pick(...ridge.tile(4, 0), 5);
  d.hall(3, { ...SNOW, lamps: 0 });
  // Off the shoulder and onto the piste.
  d.ramp(8, 5, { width: 3, ...SNOW });
  d.turn('+z', SNOW);

  // The piste: wide, long and steep, skiers and snowboarders all over it, snowmen to bounce off, the snow cannons going.
  const piste = d.ramp(18, 9, { width: 9, floor: 'snow', wall: 'cliff' });
  g.foe('skier', ...piste.tile(5, -2), { range: 6 }).foe('snowboarder', ...piste.tile(9, 2), { range: 6 }).foe('skier', ...piste.tile(14, -1), { range: 5 });
  for (const [a, b] of [[4, 3], [8, -3], [12, 3], [16, -3]]) g.bumper(...piste.tile(a, b), { radius: 0.45, look: 'snowman' });
  g.pick(...piste.tile(2, 0), 10).pick(...piste.tile(6, 1), 5).pick(...piste.tile(10, -1), 5).pick(...piste.tile(15, 0), 10);
  g.foe('drone', ...piste.tile(9, 0), { path: [piste.tile(3, 0), piste.tile(16, 0)] });
  // A run-out at the foot of it, and the snow cannons across it on the beat.
  const runout = d.hall(10, { width: 7, ...SNOW });
  for (const [along, offset] of [[3, 0], [7, 0.5]]) g.pyro(...across(runout, along, { beats: 8, offset }));
  g.pick(...runout.tile(1, 0), 10).pick(...runout.tile(5, 2), 5).pick(...runout.tile(9, -2), 10);
  g.tape(...runout.tile(9, 2));
  sign(runout, 5, 'PISTE 7', PEAK[2], 0.5);
  d.turn('+x', SNOW);

  // The avalanche gully: snowballs the size of cars coming down off the slope, on the beat.
  const gully = d.hall(16, { width: 5, ...SNOW });
  g.drop(...across(gully, 4, { beats: 8 }));
  g.drop(...across(gully, 10, { beats: 8, offset: 0.5 }));
  g.foe('ibex', ...gully.tile(7, 1), { range: 3 }).foe('snowboarder', ...gully.tile(13, -1), { range: 3 });
  g.pick(...gully.tile(2, 0), 5).pick(...gully.tile(7, -1), 5).pick(...gully.tile(14, 1), 10);
  sign(gully, 7, 'AVALANCHE', '#ff7a1a', 0.45);
  // Off the gully, out along a cornice on a ladder bridge: a snow globe in a climbers' bivouac.
  const corniceRoot = branch(d, gully, 7, 'front', 3);
  const cornice = corniceRoot.bridge(7, { floor: 'planks', color: 2 });
  g.foe('ibex', ...cornice.tile(3, 0), { path: [cornice.tile(1, 0), cornice.tile(5, 0)] });
  const bivouac = corniceRoot.room(5, 5, { floor: 'snow', wall: 'cliff' });
  g.globe(...bivouac.tile(2, 0));
  g.pick(...bivouac.tile(3, -1), 10).pick(...bivouac.tile(3, 1), 10);
  d.hall(3, SNOW);
  d.turn('+z', { floor: 'planks', wall: 'timber' });
  d.hall(2, { floor: 'planks', wall: 'timber' });

  // The mountain hut: log walls, the stove, benches and tables, a St Bernard by the fire, a yodeler who will not stop.
  const hut = d.room(15, 11, { floor: 'planks', wall: 'timber' });
  for (const k of [2, 6, 10]) g.pillar(...backTile(hut, k), 0.8, { prop: 'bench' });
  g.pillar(...hut.tile(12, -3), 1.2, { prop: 'stove' });
  g.foe('stbernard', ...hut.tile(5, 2), { range: 5 }).foe('yodeler', ...hut.tile(10, -2), { range: 5 });
  g.pick(...hut.tile(1, -3), 10).pick(...hut.tile(6, -3), 10).pick(...hut.tile(13, 3), 10);
  g.pass(...hut.tile(8, 3));
  g.suitcase(...hut.tile(3, 3), 50);
  wash(g, hut, [PEAK[3], '#ff9a5a'], { cans: 2, program: 'static' });
  sign(hut, 4, 'HÜTTE', PEAK[3], 0.5);
  d.hall(3, { floor: 'planks', wall: 'timber' });
  d.turn('+x', SNOW);
  d.hall(3, SNOW);

  // The cable car, across the gorge: a long way down, and the cabin the only way over.
  const station = d.hall(4, { floor: 'plate', wall: 'cliff' });
  g.pick(...station.tile(1, 0), 5).pick(...station.tile(2, 0), 5);
  sign(station, 2, 'SEILBAHN', PEAK[2], 0.45);
  d.ferry(16, { size: 3, period: 9 });
  d.hall(3, { floor: 'plate', wall: 'cliff' });
  d.turn('+z', { floor: 'snow', wall: 'cliff' });
  d.hall(3, { floor: 'snow', wall: 'cliff' });

  // The ice cave: blue walls, a floor of glass, and Rock slides. The way to steer is not to.
  const cave = d.hall(14, { width: 5, floor: 'snow', wall: 'cliff' });
  g.ice(...cave.rect(2, 10, cave.lo, cave.width));
  g.foe('skier', ...cave.tile(8, 0), { range: 3 });
  g.pick(...cave.tile(4, 0), 5).pick(...cave.tile(7, 0), 5).pick(...cave.tile(10, 0), 5);
  g.light('par', ...wallTile(cave, 7), { colors: ['#7ad0ff', '#c8f0ff'], program: 'chase', every: 4, glow: 0.8, reach: 8, aim: toBack(cave).map((v) => -3 * v), height: 1.4 });
  // The frozen lake, off the cave: ice all over, and a snow globe out in the middle of it.
  const lakeRoot = branch(d, cave, 7, 'back', 3);
  lakeRoot.hall(3, { floor: 'snow', wall: 'cliff' });
  const lake = lakeRoot.room(9, 9, { floor: 'snow', wall: 'cliff' });
  g.ice(...lake.rect(1, 7, lake.lo + 1, lake.width - 2));
  g.globe(...lake.tile(4, 0));
  g.foe('snowboarder', ...lake.tile(6, 2), { range: 3 });
  d.hall(3, SNOW);
  d.turn('+x', SNOW);

  // The glacier: the crevasses bridged with ladders, St Bernards out looking for somebody, and a hut buried in the debris.
  const glacier = d.hall(4, { width: 7, ...SNOW });
  g.pick(...glacier.tile(1, 0), 10);
  const ladder = d.bridge(6, { width: 3, floor: 'planks', color: 2 });
  g.foe('stbernard', ...ladder.tile(3, 0), { range: 2 });
  const shelf = d.hall(8, { width: 7, ...SNOW });
  g.foe('yodeler', ...shelf.tile(5, 2), { range: 4 });
  g.pick(...shelf.tile(2, -2), 10).pick(...shelf.tile(6, 0), 10);
  g.tape(...shelf.tile(7, -2));
  g.lighter(...shelf.tile(7, 2));
  // Behind the avalanche's debris at the side of the glacier: a hut, and the last snow globe.
  const buried = branch(d, shelf, 4, 'back', 4);
  const debris = buried.hall(6, { floor: 'snow', wall: 'cliff' });
  flat(g, debris, 1, { look: 'stone', breakAt: 6.5 });
  const shed = buried.room(5, 5, { floor: 'planks', wall: 'timber' });
  g.globe(...shed.tile(3, 0));
  g.suitcase(...shed.tile(1, 1), 70);
  const ladder2 = d.bridge(5, { width: 3, floor: 'planks', color: 2 });
  void ladder2;
  d.hall(3, SNOW);
  d.turn('+z', SNOW);

  // The bobsleigh run: down a banked channel of ice, fast, to the village.
  d.hall(2, { floor: 'snow', wall: 'cliff' });
  d.chute(14, 7, { width: 3, floor: 'snow' });
  d.hall(4, { floor: 'snow', wall: 'cliff' });
  const lift = d.hall(4, { floor: 'cobble', wall: 'timber' });
  barred(g, lift, 2);
  sign(lift, 0.5, 'SKI PASS', PEAK[2], 0.4, 1.6);
  d.hall(2, { floor: 'cobble', wall: 'timber' });
  d.turn('+x', { floor: 'cobble', wall: 'timber' });
  d.hall(4, { floor: 'cobble', wall: 'timber' });

  // The village square: chalets round it, the fountain frozen, the stage built for tonight, and the Yeti in the middle of it.
  const village = d.room(19, 15, { floor: 'snow', wall: 'timber' });
  for (const [a, b] of [[4, -5], [4, 5], [14, -5], [14, 5]]) g.pillar(...village.tile(a, b), 1.0, { prop: 'skirack' });
  g.foe('yeti', ...village.tile(11, 0), { range: 6 });
  g.foe('stbernard', ...village.tile(16, 4), { path: loop(village, 2, 14, 19) });
  g.pick(...village.tile(2, 0), 10).pick(...village.tile(7, -4), 10).pick(...village.tile(7, 4), 10).pick(...village.tile(12, -5), 10);
  g.tape(...village.tile(2, -5)).tape(...village.tile(2, 5));
  wash(g, village, [PEAK[3], PEAK[0]], { cans: 3, program: 'static' });
  sign(village, 4, 'DORF', PEAK[3], 0.45, 1.8);
  d.hall(3, { floor: 'snow', wall: 'timber' });
  d.exit(3);
  return g;
}
