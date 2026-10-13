import { digger } from '../dig.js';
import { Venue } from '../venue.js';
import { across, backTile, barred, branch, flat, loop, wallTile, wash } from './helpers.js';

/**
 * Track 10: Woodstock '99, Rome, New York. Nu metal: a decommissioned air
 * force base in a heat wave, on the one weekend the whole of it was going
 * to be about peace and love. Water is four dollars. The tarmac is a hundred
 * and one. The tent village, the midway down the runway with the lighting
 * trusses coming down on the beat, the mud, the hay wagon across the trench,
 * the main stage field with the candles at the back and the bonfires in the
 * middle, the fence round the backstage. The kids are going to break stuff.
 * It is, they will explain, because of how they feel. It is not going to go
 * well, and the flames are the least of it.
 */

export const WOODSTOCK = {
  tiles: ['#9a8a6a', '#7a6a50', '#c8b080', '#8a7a5a'],
  walls: ['#8a7a5a', '#6a5a40', '#7a6a5a', '#5a4a3a'],
  ambient: [1.0, 0.92, 0.78], lamp: '#ffd080', trap: '#1a140c', lift: '#6a5a3a', exit: '#ff6a1a', sticky: '#4a3a1a', vary: 0.1,
};

/** An air base on fire at sunset: flame orange, a hot yellow, a warning red, the blue of a porta-loo. */
const HEAT = ['#ff7a1a', '#ffd23a', '#ff3a3a', '#3ad8ff'];

export function woodstock() {
  const g = new Venue({
    name: "Woodstock '99", act: 10, cols: 150, rows: 130, palette: WOODSTOCK, tempo: 96,
    intro: 'Peace. Love. A hundred and one degrees. Water is four dollars. The kids have a lot of feelings and a lot of lighters. Keep rollin\', rollin\', rollin\', rollin\'.',
    look: {
      place: "Woodstock '99", year: 1999, genre: 'Nu Metal', poster: '#c8601a', grade: 'dust', weather: 'sand', voice: 'numetal', theme: 'airfield',
      floor: 'asphalt', wall: 'plywood', lamp: 'bulb', crusher: 'rig', lift: 'hay', gate: 'bars',
      hemi: ['#ffd8a0', '#2a1c10', 1.0], key: '#ffe0b0', keyK: 0.95, lantern: '#ffd890',
      skyColors: ['#100808', '#2a1010', '#5a2a18', '#a05028', '#d88a40'], stars: false, skyline: '#0c0806', horizon: 'airfield', glow: '#ff7a1a',
      reflect: HEAT, ceiling: '#2a1c10',
      rig: { colors: HEAT.slice(0, 2), program: 'static', every: 4 },
    },
  });
  const sign = (p, along, text, color = HEAT[1], size = 0.5, height = 1.6) => g.light('neon', ...wallTile(p, along), { text, color, height, size });
  const lamppost = (p, along) => g.light('streetlamp', ...wallTile(p, along), { height: 2.4 });
  const TARMAC = { floor: 'asphalt', wall: 'plywood' };
  const DIRT = { floor: 'dirt', wall: 'plywood' };

  // The gate and the tent village behind it: a maze of tents, a porta-loo with a queue, a bonfire already started by somebody.
  g.room(2, 14, 9, 9, 36, { lamps: 2, floor: 'dirt', wall: 'plywood' });
  g.block(3, 15, 2, 2, 0.9, { prop: 'dome', seed: 3 });
  g.block(6, 16, 2, 2, 0.9, { prop: 'dome', seed: 7 });
  g.pillar(4, 21, 1.3, { prop: 'loo' });
  g.bumper(8, 20, { radius: 0.4, look: 'firebarrel' });
  g.start = { x: 6, z: 20 };
  const d = digger(g, { x: 11, z: 18, h: 36, heading: '+x' });

  // The runway: a mile of tarmac with a band at each end of it, the trusses coming down on the beat, the fire already going in a bin, water at four dollars a bottle, and everybody in it in a state.
  const midway = d.hall(24, { width: 7, ...TARMAC });
  for (const a of [1, 2, 3]) g.pick(...midway.tile(a, 0), 5);
  g.foe('nuguy', ...midway.tile(5, 2), { range: 5 }).foe('hippie', ...midway.tile(9, -2), { range: 4 });
  g.drop(...across(midway, 7, { beats: 4 }));
  g.pick(...midway.tile(8, 0), 5).pick(...midway.tile(8, 2), 5).pick(...midway.tile(8, -2), 5);
  g.drop(...across(midway, 13, { beats: 4, offset: 0.5 }));
  g.foe('security', ...midway.tile(11, 1), { range: 4 });
  g.foe('crowdsurfer', ...midway.tile(10, 0), { path: loop(midway, 1, 8, 20) });
  g.pyro(...across(midway, 19, { beats: 4 }));
  g.foe('nuguy', ...midway.tile(16, -2), { range: 5 });
  g.pick(...midway.tile(14, 0), 10).pick(...midway.tile(17, 1), 5).pick(...midway.tile(21, 0), 10);
  g.bumper(...midway.tile(10, 3), { radius: 0.4, look: 'firebarrel' });
  g.bumper(...midway.tile(15, -3), { radius: 0.4, look: 'tyres' });
  g.whetstone(...midway.tile(23, 2));
  lamppost(midway, 3);
  sign(midway, 16, 'WATER $4', HEAT[0], 0.5, 1.7);
  // A tent off the front of the runway with its flap tied shut: the first demo tape. Run at it.
  const tent = branch(d, midway, 4, 'front', 4);
  const flap = tent.hall(8, { width: 3, wall: 'plywood' });
  flat(g, flap, 7, { look: 'canvas', breakAt: 6.5 });
  const inside = tent.room(5, 5, { wall: 'plywood', floor: 'dirt' });
  g.demo(...inside.tile(3, 0));
  g.vinyl(...inside.tile(1, -1), 50).pick(...inside.tile(1, 1), 10);
  // The medical tent, off the back: the pass is on a clipboard, and so is a medic.
  const clinic = branch(d, midway, 11, 'back', 4);
  clinic.hall(3, { wall: 'plywood' });
  const ward = clinic.room(6, 7, { wall: 'plywood', floor: 'concrete' });
  g.pass(...ward.tile(3, 0));
  g.pillar(...ward.tile(5, 3), 0.8, { prop: 'case' });
  g.foe('medic', ...ward.tile(2, 2), { range: 4 });
  g.pick(...ward.tile(4, -2), 10);
  d.turn('+z', TARMAC);
  d.hall(3, TARMAC);

  // The mud: yesterday's rain in today's heat, a pit with nowhere to go but through it, the moshers in it up to the knee, the divers over them.
  const pit = d.room(20, 15, { floor: 'mud', wall: 'plywood' });
  g.sticky(...pit.rect(4, 4, pit.lo + 2, 3));
  g.sticky(...pit.rect(11, 4, pit.lo + 8, 3));
  g.foe('mosher', ...pit.tile(5, -2), { range: 5 }).foe('mosher', ...pit.tile(10, 3), { range: 5 }).foe('nuguy', ...pit.tile(14, -2), { range: 5 });
  g.foe('diver', ...pit.tile(9, 0), { path: loop(pit, 2, 3, 18) });
  g.pick(...pit.tile(2, 0), 5).pick(...pit.tile(7, 0), 10).pick(...pit.tile(12, 0), 10).pick(...pit.tile(17, 3), 10).pick(...pit.tile(17, -3), 5);
  g.bumper(...pit.tile(8, -4), { radius: 0.4, look: 'tyres' });
  g.bumper(...pit.tile(15, 4), { radius: 0.4, look: 'firebarrel' });
  g.lighter(...pit.tile(2, 5));
  lamppost(pit, 3);
  d.hall(3, DIRT);

  // The trench: a ditch that has become a river, a hay wagon that goes across at the pace of one, and the far bank where the toilets are.
  const bank0 = d.hall(7, { width: 3, ...DIRT });
  g.foe('hippie', ...bank0.tile(3, 0), { range: 3 });
  g.pick(...bank0.tile(1, 0), 5).pick(...bank0.tile(5, 1), 5);
  lamppost(bank0, 2);
  sign(bank0, 4.5, 'KEEP ROLLIN\'', HEAT[0], 0.45, 1.7);
  d.ferry(15, { size: 3, period: 9 });
  const bank = d.hall(10, { width: 5, ...DIRT });
  g.pillar(...backTile(bank, 2), 1.3, { prop: 'loo' });
  g.pillar(...backTile(bank, 4), 1.3, { prop: 'loo' });
  g.pick(...bank.tile(3, 0), 5).pick(...bank.tile(7, 1), 10);
  g.foe('candlekid', ...bank.tile(6, -1), { range: 3 });
  g.whetstone(...bank.tile(9, 1));
  // A plank across the ditch to the VIP loos: the second demo tape, in the only clean one.
  const vip = branch(d, bank, 6, 'back', 3);
  vip.hall(2, { wall: 'plywood' });
  const plank = vip.bridge(7, { floor: 'planks' });
  g.foe('diver', ...plank.tile(3, 0), { path: [plank.tile(1, 0), plank.tile(5, 0)] });
  const block = vip.room(5, 5, { wall: 'plywood', floor: 'concrete' });
  g.demo(...block.tile(2, 0));
  d.turn('+x', TARMAC);
  d.hall(3, TARMAC);

  // The main stage field: ten thousand people in a heat haze, bonfires lit by the front of them, candles at the back; the DJ nobody wanted; the medic running through all of it.
  const field = d.room(22, 17, { floor: 'dirt', wall: 'plywood' });
  for (const [a, b] of [[3, -6], [3, 6], [11, -6], [11, 6]]) g.block(...field.rect(a, 2, b, 2), 0.9, { prop: 'dome', seed: a * 3 + b });
  g.pillar(...backTile(field, 5), 1.3, { prop: 'loo' });
  g.pillar(...backTile(field, 8), 1.3, { prop: 'loo' });
  for (const [a, b] of [[6, -2], [6, 3], [12, 0], [15, -4], [15, 4]]) g.bumper(...field.tile(a, b), { radius: 0.4, look: 'firebarrel' });
  g.foe('nuguy', ...field.tile(7, 1), { range: 5 }).foe('nuguy', ...field.tile(11, -3), { range: 5 }).foe('dj', ...field.tile(14, 2), { range: 4 });
  g.foe('candlekid', ...field.tile(17, -3), { range: 3 }).foe('candlekid', ...field.tile(18, 3), { range: 3 }).foe('medic', ...field.tile(10, 0), { range: 5 });
  g.foe('diver', ...field.tile(12, 0), { path: loop(field, 2, 6, 19) });
  g.pick(...field.tile(2, 0), 10).pick(...field.tile(5, 2), 5).pick(...field.tile(9, 3), 10).pick(...field.tile(13, -2), 10).pick(...field.tile(19, 0), 10).pick(...field.tile(16, 5), 10);
  g.whetstone(...field.tile(2, -5)).whetstone(...field.tile(2, 5));
  wash(g, field, [HEAT[0], HEAT[2]], { cans: 3, program: 'pulse', every: 1 });
  sign(field, 12, 'PEACE · LOVE · $4 WATER', HEAT[1], 0.4, 1.9);
  // The sound desk's scaffold, off the front of the field, behind a plywood skirt: the last demo tape.
  const scaffold = branch(d, field, 12, 'front', 9);
  const skirt = scaffold.hall(7, { width: 3, wall: 'plywood' });
  flat(g, skirt, 6, { look: 'wood', breakAt: 6.5 });
  const loft = scaffold.room(5, 5, { wall: 'plywood', floor: 'planks' });
  g.demo(...loft.tile(3, 0));
  g.vinyl(...loft.tile(1, 1), 70);
  // The fence round the backstage: steel, eight feet, a gate in it that wants a pass, and a security guard who has never seen one.
  const fence = d.hall(8, { width: 3, ...TARMAC });
  barred(g, fence, 4, 'bars');
  g.foe('security', ...fence.tile(2, 0), { range: 3 });
  g.pick(...fence.tile(1, 1), 5).pick(...fence.tile(6, 0), 5);
  sign(fence, 6, 'ALL ACCESS', HEAT[2], 0.4, 1.7);
  d.hall(2, TARMAC);
  const stage = d.room(8, 9, { wall: 'plywood', floor: 'planks' });
  g.block(...stage.rect(2, 2, stage.back * 3, 2), 1.3, { prop: 'amp' });
  g.block(...stage.rect(5, 2, stage.back * 3, 2), 1.3, { prop: 'speaker' });
  g.foe('soundguy', ...stage.tile(3, 0), { range: 3 });
  g.pick(...stage.tile(1, 0), 10);
  d.hall(3, TARMAC);
  d.exit(3);
  return g;
}
