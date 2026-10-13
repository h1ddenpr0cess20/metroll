import { digger } from '../dig.js';
import { Venue } from '../venue.js';
import { across, backTile, barred, branch, flat, frontHeading, loop, wallTile, wash } from './helpers.js';

/**
 * Track 11: Warped Tour, 2005. Screamo: a car park in July, as full of vans
 * as it is of people, and a bit of everything in it. The tour buses at the
 * back. The midway of vendor tents, where every other person is giving
 * away a sticker and the energy drinks come down on the beat. A skate park
 * the size of a driveway. A van ferry across the storm drain, a field with
 * the main stage at the far end of it, and at the stage: a lot of people in
 * black who have been hurt, and one in particular, who would like to
 * tell you about it. Everybody has a phone out, at the MySpace angle.
 * Everybody is crying. Everybody is having the best day of their life.
 */

export const WARPED = {
  tiles: ['#6a6a72', '#585860', '#8a8a92', '#7a7a82'],
  walls: ['#c8c8d0', '#b0b0b8', '#d0a8c0', '#a8c8d0'],
  ambient: [1.0, 1.0, 1.0], lamp: '#fff0c0', trap: '#101018', lift: '#3a3a46', exit: '#ff3a9a', sticky: '#4a4a5a', vary: 0.08,
};

/** A car park at sunset in July: hot pink, acid green, a safety yellow, the cyan of a sticker. */
const PUNK = ['#ff3a9a', '#3aff9a', '#ffe83a', '#3ad8ff'];

export function warped() {
  const g = new Venue({
    name: 'Warped Tour', act: 11, cols: 150, rows: 130, palette: WARPED, tempo: 168,
    intro: 'July. A car park. Everybody is in black, everybody is crying and it is the best day of their lives.',
    look: {
      place: 'Warped Tour', year: 2005, genre: 'Screamo', poster: '#e0308a', grade: 'scene', voice: 'scene', theme: 'fairground',
      floor: 'asphalt', wall: 'flats', lamp: 'bulb', crusher: 'energycan', lift: 'van', gate: 'bars',
      hemi: ['#ffd0e0', '#201828', 1.0], key: '#fff0e0', keyK: 0.95, lantern: '#fff0c0',
      skyColors: ['#101030', '#2a1a50', '#6a2a70', '#d84a8a', '#ffa0a0'], stars: false, skyline: '#14101c', horizon: 'fairground', glow: '#ff3a9a',
      reflect: PUNK, ceiling: '#2a2030',
      rig: { colors: PUNK.slice(0, 2), program: 'static', every: 4 },
    },
  });
  const sign = (p, along, text, color = PUNK[2], size = 0.5, height = 1.6) => g.light('neon', ...wallTile(p, along), { text, color, height, size });
  const lamppost = (p, along) => g.light('streetlamp', ...wallTile(p, along), { height: 2.4 });
  const LOT = { floor: 'asphalt', wall: 'flats' };

  // The back of the car park, where the buses are: a band's van with its doors open, a stack of tyres, a bin on fire for no reason.
  g.room(2, 14, 9, 9, 36, { lamps: 2, floor: 'asphalt', wall: 'corrugated' });
  g.block(3, 15, 3, 2, 0.9, { prop: 'van' });
  g.bumper(8, 16, { radius: 0.4, look: 'tyres' });
  g.bumper(5, 21, { radius: 0.4, look: 'firebarrel' });
  g.start = { x: 6, z: 19 };
  const d = digger(g, { x: 11, z: 18, h: 36, heading: '+x' });

  // The vendor midway: tents in a row down both sides, a sticker in every hand, an energy drink coming down on the beat, the kids in their skinny jeans.
  const midway = d.hall(24, { width: 7, ...LOT });
  for (const a of [1, 2, 3]) g.pick(...midway.tile(a, 0), 5);
  g.foe('streetteam', ...midway.tile(5, 2), { range: 5 }).foe('scenekid', ...midway.tile(9, -2), { range: 5 });
  g.drop(...across(midway, 7, { beats: 4 }));
  g.pick(...midway.tile(8, 0), 5).pick(...midway.tile(8, 2), 5).pick(...midway.tile(8, -2), 5);
  g.foe('emo', ...midway.tile(11, 1), { range: 4 });
  g.drop(...across(midway, 13, { beats: 4, offset: 0.5 }));
  g.foe('scenekid', ...midway.tile(16, -2), { range: 5 }).foe('streetteam', ...midway.tile(18, 2), { range: 5 });
  g.pyro(...across(midway, 20, { beats: 4 }));
  g.pick(...midway.tile(14, 0), 10).pick(...midway.tile(17, 0), 5).pick(...midway.tile(22, 0), 10);
  g.bumper(...midway.tile(10, 3), { radius: 0.4, look: 'beachball' });
  g.bumper(...midway.tile(15, -3), { radius: 0.4, look: 'beachball' });
  g.whetstone(...midway.tile(23, 2));
  lamppost(midway, 3);
  sign(midway, 16, 'FREE STICKERS', PUNK[0], 0.5, 1.7);
  // The merch tent, off the front of the midway, its flap tied shut: the first demo tape. Run at it.
  const merch = branch(d, midway, 4, 'front', 4);
  const flap = merch.hall(8, { width: 3, wall: 'flats' });
  flat(g, flap, 7, { look: 'canvas', breakAt: 6.5 });
  const tent = merch.room(5, 5, { wall: 'flats', floor: 'asphalt' });
  g.demo(...tent.tile(3, 0));
  g.vinyl(...tent.tile(1, -1), 50).pick(...tent.tile(1, 1), 10);
  // The tour bus, off the back: the pass is on the dashboard, and the driver is on the bunk.
  const bus = branch(d, midway, 11, 'back', 4);
  bus.hall(3, { wall: 'corrugated' });
  const lounge = bus.room(6, 7, { wall: 'corrugated', floor: 'carpet' });
  g.pass(...lounge.tile(3, 0));
  g.pillar(...lounge.tile(5, 3), 0.8, { prop: 'case' });
  g.foe('security', ...lounge.tile(2, 2), { range: 4 });
  g.pick(...lounge.tile(4, -2), 10);
  d.turn('+z', LOT);
  d.hall(3, LOT);

  // The skate park: concrete, a rail, the kids in baggy shorts going round it on a board, belts under the lot for the pit that was a ramp.
  const park = d.room(20, 15, { floor: 'concrete', wall: 'block' });
  const toward = frontHeading(park);
  g.belt(...park.rect(5, 3, park.lo, 15), toward);
  g.belt(...park.rect(12, 3, park.lo, 15), toward);
  g.foe('skater', ...park.tile(3, -3), { range: 5 }).foe('skater', ...park.tile(9, 3), { range: 5 }).foe('scenekid', ...park.tile(14, 0), { range: 5 });
  g.foe('skater', ...park.tile(16, -2), { path: loop(park, 2, 4, 18) });
  g.pick(...park.tile(2, 0), 5).pick(...park.tile(9, 0), 10).pick(...park.tile(10, -4), 5).pick(...park.tile(16, 3), 10).pick(...park.tile(18, 0), 10);
  g.bumper(...park.tile(7, 1), { radius: 0.4, look: 'beachball' });
  g.bumper(...park.tile(11, -3), { radius: 0.4, look: 'wedge' });
  g.lighter(...park.tile(2, 5));
  lamppost(park, 3);
  d.hall(3, LOT);

  // The storm drain: a ditch the size of a river, a van to cross it on at the pace of one (everything is in the van), and a bank with the loos on it.
  const kerb = d.hall(7, { width: 3, ...LOT });
  g.foe('screamer', ...kerb.tile(3, 0), { range: 3 });
  g.pick(...kerb.tile(1, 0), 5).pick(...kerb.tile(5, 1), 5);
  lamppost(kerb, 2);
  d.ferry(15, { size: 3, period: 9 });
  const bank = d.hall(10, { width: 5, ...LOT });
  g.pillar(...backTile(bank, 2), 1.3, { prop: 'loo' });
  g.pillar(...backTile(bank, 4), 1.3, { prop: 'loo' });
  g.pick(...bank.tile(3, 0), 5).pick(...bank.tile(7, 1), 10);
  g.foe('emo', ...bank.tile(6, -1), { range: 3 });
  g.whetstone(...bank.tile(9, 1));
  // A plank across the drain to the artists' loos: the second demo tape, in the only clean one.
  const vip = branch(d, bank, 6, 'back', 3);
  vip.hall(2, { wall: 'flats' });
  const plank = vip.bridge(7, { floor: 'planks' });
  g.foe('diver', ...plank.tile(3, 0), { path: [plank.tile(1, 0), plank.tile(5, 0)] });
  const block = vip.room(5, 5, { wall: 'flats', floor: 'concrete' });
  g.demo(...block.tile(2, 0));
  d.turn('+x', LOT);
  d.hall(3, LOT);

  // The main stage field: the crowd as far as the barrier, the barrier as far as the stage, everybody's phone up; the screamer at the front of it with his whole heart in his throat.
  const field = d.room(22, 17, { floor: 'asphalt', wall: 'flats' });
  g.block(...field.rect(15, 1, field.lo, 5), 1.0, { prop: 'barrier' });
  g.block(...field.rect(15, 1, 3, 6), 1.0, { prop: 'barrier' });
  g.foe('scenekid', ...field.tile(5, 1), { range: 5 }).foe('scenekid', ...field.tile(8, -3), { range: 5 }).foe('emo', ...field.tile(10, 3), { range: 5 });
  g.foe('streetteam', ...field.tile(12, -1), { range: 5 }).foe('screamer', ...field.tile(18, 0), { range: 5 });
  g.foe('diver', ...field.tile(12, 0), { path: loop(field, 2, 6, 19) });
  g.pick(...field.tile(2, 0), 10).pick(...field.tile(6, 4), 5).pick(...field.tile(8, 0), 10).pick(...field.tile(13, -4), 10).pick(...field.tile(13, 4), 10).pick(...field.tile(19, 3), 10);
  g.whetstone(...field.tile(2, -5)).whetstone(...field.tile(2, 5));
  wash(g, field, [PUNK[0], PUNK[1]], { cans: 3, program: 'chase', every: 2 });
  sign(field, 10, 'NO REFUNDS ON FEELINGS', PUNK[0], 0.4, 1.9);
  // The merch trailer for the headliner, off the front of the field, behind a panel: the last demo tape.
  const trailer = branch(d, field, 8, 'front', 9);
  const rack = trailer.hall(7, { width: 3, wall: 'flats' });
  flat(g, rack, 6, { look: 'drywall', breakAt: 6.5 });
  const truck = trailer.room(5, 5, { wall: 'flats', floor: 'concrete' });
  g.demo(...truck.tile(3, 0));
  g.vinyl(...truck.tile(1, 1), 70);
  // The artist gate: steel, a wristband and a guy with a clipboard, who wants a pass.
  const gate = d.hall(8, { width: 3, ...LOT });
  barred(g, gate, 4, 'bars');
  g.foe('security', ...gate.tile(2, 0), { range: 3 });
  g.pick(...gate.tile(1, 1), 5).pick(...gate.tile(6, 0), 5);
  sign(gate, 6, 'ARTISTS ONLY', PUNK[3], 0.4, 1.7);
  d.hall(2, LOT);
  const stage = d.room(8, 9, { wall: 'flats', floor: 'planks' });
  g.block(...stage.rect(2, 2, stage.back * 3, 2), 1.3, { prop: 'amp' });
  g.block(...stage.rect(5, 2, stage.back * 3, 2), 1.3, { prop: 'speaker' });
  g.foe('soundguy', ...stage.tile(3, 0), { range: 3 });
  g.pick(...stage.tile(1, 0), 10);
  d.hall(3, LOT);
  d.exit(3);
  return g;
}
