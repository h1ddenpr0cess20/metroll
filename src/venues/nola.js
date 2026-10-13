import { digger } from '../dig.js';
import { Venue } from '../venue.js';
import { across, backTile, barred, branch, flat, loop, wallTile, wash } from './helpers.js';

/**
 * Track 8: New Orleans, 1991. Doom: a courtyard off Bourbon Street, a
 * second line coming down it with the brass out, a cemetery where everybody
 * is buried above the ground because of the water, a skiff across the
 * bayou, a plantation gate that wants a pass, and a house at the end of
 * it with a church in the back where somebody has been playing the same
 * chord since Tuesday. The bell over the cemetery path comes down on the
 * beat. The beat is very slow. It has a lot of time to think about it. So
 * do you.
 */

export const NOLA = {
  tiles: ['#8a7a5a', '#6a5a40', '#7a6a4a', '#5a4a38'],
  walls: ['#9a7a5a', '#7a5a4a', '#8a6a6a', '#6a4a4a'],
  ambient: [0.95, 0.85, 0.72], lamp: '#ffb040', trap: '#100a08', lift: '#4a3a2a', exit: '#a02aff', sticky: '#3a3a1a', vary: 0.1,
};

/** Mardi Gras after dark: purple, gold, green, and the red of a bar's neon. */
const GRAS = ['#c88aff', '#ffb040', '#6aff9a', '#ff4a7a'];

export function nola() {
  const g = new Venue({
    name: 'New Orleans', act: 8, cols: 150, rows: 130, palette: NOLA, tempo: 64,
    intro: 'A funeral and a party at once. Nobody will tell you which. The Doomlord has played the same chord since Tuesday.',
    look: {
      place: 'New Orleans', year: 1991, genre: 'Doom Metal', poster: '#6a2a8a', grade: 'bayou', voice: 'doom', theme: 'bayou',
      floor: 'cobble', wall: 'stucco', lamp: 'bulb', crusher: 'bell', lift: 'skiff', pyro: 'smoke', gate: 'bars',
      hemi: ['#d8b0a0', '#140c10', 0.9], key: '#ffd8b0', keyK: 0.8, lantern: '#ffc080',
      skyColors: ['#080410', '#140824', '#2a1238', '#4a2040', '#6a3040'], stars: false, skyline: '#0a060a', horizon: 'bayou', glow: '#c88aff',
      reflect: GRAS, ceiling: '#1a1218',
      rig: { colors: GRAS.slice(0, 2), program: 'static', every: 4 },
    },
  });
  const sign = (p, along, text, color = GRAS[1], size = 0.5, height = 1.6) => g.light('neon', ...wallTile(p, along), { text, color, height, size });
  const lamppost = (p, along) => g.light('streetlamp', ...wallTile(p, along), { height: 2.4 });
  const candles = (p, along) => g.light('chandelier', ...wallTile(p, along), { colors: ['#ffd890'], height: 2.2, glow: 0.8 });
  const QUARTER = { floor: 'cobble', wall: 'stucco' };
  const BOARDS = { floor: 'planks', wall: 'timber' };

  // The courtyard behind a bar on Bourbon Street: a fountain with no water in it, a palm in a tub, the sound of a trumpet a long way off.
  g.room(2, 14, 9, 9, 40, { lamps: 2, floor: 'cobble', wall: 'stucco' });
  g.bumper(3, 15, { radius: 0.4, look: 'palm' });
  g.bumper(8, 20, { radius: 0.4, look: 'urn' });
  g.start = { x: 6, z: 19 };
  const d = digger(g, { x: 11, z: 18, h: 40, heading: '+x' });

  // Bourbon Street: iron balconies, a second line coming down the middle, the haze off the kitchens, and a lot of people who have been here since Tuesday.
  const street = d.hall(18, { width: 5, ...QUARTER });
  for (const a of [1, 2, 3]) g.pick(...street.tile(a, 0), 5);
  g.foe('brassman', ...street.tile(5, 1), { range: 5 }).foe('stoner', ...street.tile(9, -1), { range: 3 }).foe('brassman', ...street.tile(13, 0), { range: 5 });
  g.drop(...across(street, 7, { beats: 4 }));
  g.pick(...street.tile(8, 0), 5).pick(...street.tile(8, 1), 5);
  g.pyro(...across(street, 15, { beats: 4 }));
  g.pick(...street.tile(11, 1), 10).pick(...street.tile(16, 0), 10);
  g.bumper(...street.tile(10, 2), { radius: 0.4, look: 'urn' });
  g.whetstone(...street.tile(17, 1));
  lamppost(street, 3);
  sign(street, 12, 'GOOD TIMES ROLL', GRAS[3], 0.5, 1.7);
  // The voodoo shop, off the front of the street, its back room behind plywood: the first demo tape. Run at it.
  const shop = branch(d, street, 4, 'front', 3);
  const stock = shop.hall(7, { width: 3, wall: 'stucco' });
  flat(g, stock, 6, { look: 'wood', breakAt: 6.5 });
  const back = shop.room(5, 5, { wall: 'stucco', floor: 'planks' });
  g.demo(...back.tile(3, 0));
  g.vinyl(...back.tile(1, -1), 50).pick(...back.tile(1, 1), 10);
  d.turn('+z', QUARTER);
  d.hall(3, QUARTER);

  // The cemetery: the dead in white tombs above the ground, in rows, because of the water; the funeral going the wrong way down the path; the bell on its beam, tolling for you.
  const yard = d.room(20, 15, { floor: 'cobble', wall: 'stone' });
  for (const a of [3, 9, 15]) g.block(...yard.rect(a, 2, yard.back * 5, 1), 0.8, { prop: 'tomb' });
  for (const [a, b] of [[7, 5], [13, -5], [18, 5]]) g.pillar(...yard.tile(a, b), 0.8, { prop: 'gravestones' });
  g.drop(...across(yard, 6, { beats: 4 }));
  g.drop(...across(yard, 12, { beats: 4, offset: 0.5 }));
  g.pick(...yard.tile(2, 0), 5).pick(...yard.tile(8, 3), 5).pick(...yard.tile(8, -3), 5).pick(...yard.tile(14, 0), 10).pick(...yard.tile(17, 3), 10);
  g.foe('pallbearer', ...yard.tile(4, -2), { range: 5 }).foe('pallbearer', ...yard.tile(10, 2), { range: 5 });
  g.foe('cultist', ...yard.tile(14, -3), { range: 4 }).foe('stoner', ...yard.tile(17, 0), { range: 3 });
  g.bumper(...yard.tile(9, 0), { radius: 0.4, look: 'cross' });
  g.bumper(...yard.tile(15, 3), { radius: 0.4, look: 'candle' });
  g.lighter(...yard.tile(2, 5));
  g.whetstone(...yard.tile(19, 4));
  lamppost(yard, 3);
  // The family tomb, down the back of the cemetery: the pass, and the cultist who has been standing guard over it.
  const crypt = branch(d, yard, 9, 'front', 8);
  crypt.hall(3, { wall: 'stone' });
  const vault = crypt.room(6, 7, { wall: 'stone', floor: 'marble' });
  g.pass(...vault.tile(3, 0));
  g.pillar(...vault.tile(5, 3), 0.8, { prop: 'tomb' });
  g.foe('cultist', ...vault.tile(2, 2), { range: 4 });
  g.pick(...vault.tile(4, -2), 10);
  d.hall(3, { floor: 'cobble', wall: 'stone' });
  d.stairs(6, 3, { width: 3, ...BOARDS });

  // The bayou: black water, a skiff that goes across at the pace of one, the lights of a shack on the far side, and what lives in the water.
  const dock = d.hall(7, { width: 3, ...BOARDS });
  g.foe('brassman', ...dock.tile(3, 0), { range: 3 });
  g.pick(...dock.tile(1, 0), 5).pick(...dock.tile(5, 1), 5);
  lamppost(dock, 2);
  d.ferry(15, { size: 3, period: 12 });
  const bank = d.hall(14, { width: 5, floor: 'mud', wall: 'hedge' });
  g.pick(...bank.tile(2, 0), 5).pick(...bank.tile(6, 1), 10).pick(...bank.tile(11, 0), 5).pick(...bank.tile(12, 1), 5);
  g.foe('gator', ...bank.tile(5, 0), { path: loop(bank, 1, 1, 8) });
  g.foe('zombie', ...bank.tile(7, -1), { range: 3 });
  g.whetstone(...bank.tile(7, 2));
  // Out along a plank to a fishing shack on stilts: the second demo tape, and a very old record somebody left on the porch.
  const shack = branch(d, bank, 4, 'front', 3);
  shack.hall(2, { wall: 'timber' });
  const board = shack.bridge(7, { floor: 'planks' });
  g.foe('gator', ...board.tile(3, 0), { path: [board.tile(1, 0), board.tile(5, 0)] });
  const cabin = shack.room(5, 5, { wall: 'timber', floor: 'planks' });
  g.demo(...cabin.tile(2, 0));
  g.vinyl(...cabin.tile(1, 1), 70);
  d.turn('+x', { floor: 'mud', wall: 'hedge' });
  d.hall(3, { floor: 'mud', wall: 'hedge' });

  // The plantation drive: live oaks hung with moss, a gate of wrought iron that wants a pass, a cultist at the gatehouse.
  const drive = d.hall(12, { width: 5, floor: 'grass', wall: 'hedge' });
  g.pillar(...backTile(drive, 3), 1.1, { prop: 'stump' });
  g.pillar(...backTile(drive, 6), 1.1, { prop: 'stump' });
  g.foe('cultist', ...drive.tile(3, 1), { range: 4 }).foe('pallbearer', ...drive.tile(6, -1), { range: 4 });
  g.pick(...drive.tile(1, 0), 5).pick(...drive.tile(4, 0), 5).pick(...drive.tile(5, 2), 5);
  g.bumper(...drive.tile(5, -2), { radius: 0.4, look: 'candle' });
  g.whetstone(...drive.tile(1, 2));
  barred(g, drive, 7, 'bars');
  sign(drive, 9, 'PRIVATE PROPERTY', GRAS[3], 0.45, 1.7);
  d.hall(3, { floor: 'marble', wall: 'stucco' });

  // The house and its church: a ballroom turned into a nave, a candelabra in every corner, a wall of amps and, in the middle of the floor, the Doomlord.
  const nave = d.room(21, 17, { floor: 'marble', wall: 'damask' });
  g.pillar(...backTile(nave, 4), 1.2, { prop: 'amp' });
  g.pillar(...backTile(nave, 18), 1.2, { prop: 'speaker' });
  for (const [a, b] of [[5, -7], [5, 7], [16, -7], [16, 7]]) g.pillar(...nave.tile(a, b), 0.8, { prop: 'tomb' });
  g.foe('doomlord', ...nave.tile(12, 0), { range: 7 });
  g.foe('cultist', ...nave.tile(8, 4), { range: 5 }).foe('cultist', ...nave.tile(8, -4), { range: 5 });
  g.foe('stoner', ...nave.tile(18, -5), { range: 3 });
  g.pick(...nave.tile(2, 0), 10).pick(...nave.tile(7, -6), 10).pick(...nave.tile(7, 6), 10).pick(...nave.tile(14, -6), 10).pick(...nave.tile(14, 6), 10);
  g.whetstone(...nave.tile(2, -7)).whetstone(...nave.tile(2, 7));
  candles(nave, 6);
  candles(nave, 15);
  wash(g, nave, [GRAS[0], GRAS[1]], { cans: 3, program: 'chase', every: 4 });
  sign(nave, 10, 'THE SAME CHORD SINCE TUESDAY', GRAS[2], 0.4, 1.9);
  // The vestry, behind a panel at the side of the nave: the last demo tape.
  const vestry = branch(d, nave, 12, 'front', 9);
  const press = vestry.hall(7, { width: 3, wall: 'stucco' });
  flat(g, press, 6, { look: 'drywall', breakAt: 6.5 });
  const closet = vestry.room(5, 5, { wall: 'stucco', floor: 'planks' });
  g.demo(...closet.tile(3, 0));
  g.vinyl(...closet.tile(1, 1), 60);
  d.hall(3, { floor: 'marble', wall: 'damask' });
  d.exit(3);
  return g;
}
