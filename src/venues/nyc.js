import { digger } from '../dig.js';
import { Venue } from '../venue.js';
import { across, backTile, barred, branch, flat, loop, wallTile, wash } from './helpers.js';

/**
 * Track 5: New York, 1989. Hardcore: a Sunday matinee in a basement, the
 * whole show over in half an hour. Off the stoop on the Lower East Side,
 * along an avenue with the steam coming up out of the road on the beat and
 * dumpsters hanging off the fire escapes (and coming down), into the
 * subway, across the tracks on the roof of a car that goes back and forth,
 * and down the stairs into the basement, where the boiler is, and the couch,
 * and the kids who have been waiting since noon. The pass is in the loft
 * over the zine shop. Fast, short, and no encores.
 */

export const NYC = {
  tiles: ['#3a3a40', '#2c2c32', '#c8a020', '#4a4a52'],
  walls: ['#6a3a2a', '#4a2a22', '#3a4a5a', '#7a4a3a'],
  ambient: [0.85, 0.8, 0.78], lamp: '#ffb060', trap: '#1c1c20', lift: '#c8c8d0', exit: '#ff3a2a', sticky: '#3a3030', vary: 0.1,
};

/** The Lower East Side after dark: sodium, a taxi's yellow, the red of an EXIT sign, the cold of the platform. */
const CITY = ['#ffa050', '#ffd23a', '#ff3a2a', '#4a8ae8'];

export function nyc() {
  const g = new Venue({
    name: 'New York', act: 5, cols: 130, rows: 130, palette: NYC, tempo: 190,
    intro: 'The matinee starts at noon. It is over by half past. You have thirty minutes and a lot of stairs.',
    look: {
      place: 'New York', year: 1989, genre: 'Hardcore', poster: '#c8a020', grade: 'basement', voice: 'hardcore', theme: 'nyc',
      floor: 'asphalt', wall: 'brick', lamp: 'bulb', crusher: 'dumpster', lift: 'subway', pyro: 'steam', gate: 'bars',
      hemi: ['#a0a8c0', '#201a18', 0.9], key: '#dcd8e8', keyK: 0.85, lantern: '#ffd8a0',
      skyColors: ['#060608', '#101018', '#1c1c2c', '#2c2830', '#443828'], stars: false, skyline: '#06060a', horizon: 'nyc', glow: '#ffa050',
      reflect: CITY, ceiling: '#1a1618',
      rig: { colors: CITY.slice(0, 2), program: 'static', every: 4 },
    },
  });
  const sign = (p, along, text, color = CITY[0], size = 0.5, height = 1.6) => g.light('neon', ...wallTile(p, along), { text, color, height, size });
  const lamppost = (p, along) => g.light('streetlamp', ...wallTile(p, along), { height: 2.4 });
  const TILE = { floor: 'checker', wall: 'block' };

  // The stoop, and the corner it is on.
  g.room(2, 12, 7, 7, 40, { lamps: 3, floor: 'asphalt', wall: 'brick' });
  g.bumper(3, 13, { radius: 0.4, look: 'hydrant' });
  g.start = { x: 5, z: 17 };
  const d = digger(g, { x: 9, z: 15, h: 40, heading: '+x' });

  // The avenue: kids on the corner with their X's, a zine kid, a cop on his beat, a rat on a slice; a steam grate going off, and the dumpsters hung off the fire escapes.
  const avenue = d.hall(17, { width: 5, wall: 'brick', floor: 'asphalt' });
  for (const a of [1, 2, 3]) g.pick(...avenue.tile(a, 0), 5);
  g.foe('hxckid', ...avenue.tile(5, 1), { range: 4 }).foe('zinekid', ...avenue.tile(8, -1), { range: 4 });
  g.drop(...across(avenue, 6, { beats: 8 }));
  g.pick(...avenue.tile(7, 0), 5).pick(...avenue.tile(7, 1), 5);
  g.foe('cop', ...avenue.tile(11, 1), { range: 5 });
  g.foe('rat', ...avenue.tile(9, 0), { path: loop(avenue, 1, 8, 14) });
  g.pyro(...across(avenue, 13, { beats: 4 }));
  g.pick(...avenue.tile(14, 0), 10);
  // Past the dumpsters and the steam, the first whetstone.
  g.whetstone(...avenue.tile(15, 1));
  g.bumper(...avenue.tile(10, -2), { radius: 0.4, look: 'hydrant' });
  lamppost(avenue, 3);
  sign(avenue, 8, 'SUNDAY', CITY[1], 0.5, 1.7);
  // The bodega, off the front of the avenue, its back room behind plywood: the first demo tape. Run at it.
  const shop = branch(d, avenue, 4, 'front', 3);
  const shopHall = shop.hall(7, { width: 3, wall: 'brick' });
  flat(g, shopHall, 6, { look: 'wood', breakAt: 6.5 });
  const back = shop.room(5, 5, { wall: 'brick', floor: 'concrete' });
  g.demo(...back.tile(3, 0));
  g.vinyl(...back.tile(1, -1), 50).pick(...back.tile(1, 1), 10);
  // The loft over the zine shop, up a fire escape off the back of the avenue: the pass, and whoever is guarding it.
  const loft = branch(d, avenue, 11, 'back', 3);
  loft.hall(3, { wall: 'brick' });
  const office = loft.room(6, 7, { wall: 'posters', floor: 'planks' });
  g.pass(...office.tile(3, 0));
  g.pillar(...office.tile(5, 3), 0.7, { prop: 'couch' });
  g.foe('zinekid', ...office.tile(2, 2), { range: 4 });
  g.pick(...office.tile(4, -2), 10);
  d.turn('+z', { wall: 'brick', floor: 'asphalt' });
  d.hall(3, { wall: 'brick', floor: 'asphalt' });

  // Down into the subway: a flight of tiled stairs, the platform, the tracks.
  d.stairs(8, 4, { width: 5, floor: 'checker', wall: 'block' });
  const platform = d.hall(9, { width: 7, ...TILE });
  g.foe('punk', ...platform.tile(4, 1), { range: 5 }).foe('hxckid', ...platform.tile(7, -2), { range: 4 });
  g.foe('rat', ...platform.tile(6, 0), { path: loop(platform, 1) });
  g.pick(...platform.tile(2, 0), 10).pick(...platform.tile(5, 2), 5).pick(...platform.tile(8, -2), 5);
  g.light('par', ...wallTile(platform, 4), { colors: ['#e8f4ff', '#cfe8ff'], program: 'static', glow: 0.8, reach: 8, aim: [2, 2], height: 1.8 });
  sign(platform, 5, 'DOWNTOWN', CITY[3], 0.5, 1.7);
  d.ferry(15, { size: 3, period: 9 });
  const far = d.hall(9, { width: 5, ...TILE });
  g.pick(...far.tile(2, 0), 5).pick(...far.tile(6, 1), 10);
  g.foe('hxckid', ...far.tile(5, 1), { range: 3 });
  g.lighter(...far.tile(7, -1));
  // A plank out across the tunnel to the signal box: the second demo tape.
  const cab = branch(d, far, 4, 'front', 3);
  cab.hall(2, { wall: 'block' });
  const plank = cab.bridge(7, { floor: 'planks' });
  g.foe('rat', ...plank.tile(3, 0), { path: [plank.tile(1, 0), plank.tile(5, 0)] });
  const signal = cab.room(5, 5, { wall: 'block', floor: 'concrete' });
  g.demo(...signal.tile(2, 0));
  d.turn('+x', { wall: 'brick', floor: 'asphalt' });
  d.stairs(6, 3, { width: 3, floor: 'asphalt', wall: 'brick' });

  // The street door of the basement: the gate, shut until somebody has a pass; the doorman.
  const door = d.hall(8, { width: 3, wall: 'brick', floor: 'concrete' });
  barred(g, door, 3, 'bars');
  g.foe('bouncer', ...door.tile(1, 1), { range: 3 });
  g.pick(...door.tile(5, 0), 5);
  sign(door, 6, '$5 AT THE DOOR', CITY[1], 0.4, 1.6);
  d.stairs(6, 3, { width: 3, wall: 'brick', floor: 'concrete' });

  // The basement: low, loud, a boiler in the corner and a couch against the wall, the posters on every inch of it, and a floor with nowhere to go but the middle.
  const cellar = d.room(17, 13, { wall: 'posters', floor: 'concrete' });
  g.block(...cellar.rect(3, 2, cellar.back * 5, 2), 1.3, { prop: 'boiler' });
  g.block(...cellar.rect(9, 3, cellar.back * 5, 1), 0.7, { prop: 'couch' });
  g.foe('toughguy', ...cellar.tile(6, -1), { range: 5 }).foe('toughguy', ...cellar.tile(10, 2), { range: 5 });
  g.foe('hxckid', ...cellar.tile(8, 0), { range: 5 }).foe('hxckid', ...cellar.tile(12, -2), { range: 4 });
  g.foe('diver', ...cellar.tile(9, 0), { path: loop(cellar, 2) });
  g.pick(...cellar.tile(2, 0), 10).pick(...cellar.tile(5, 3), 5).pick(...cellar.tile(9, -3), 10).pick(...cellar.tile(13, 3), 10);
  g.whetstone(...cellar.tile(3, -3));
  wash(g, cellar, [CITY[0], CITY[2]], { cans: 2, program: 'pulse', every: 1 });
  sign(cellar, 8, 'NO DRINKING NO SMOKING NO GIVING UP', CITY[2], 0.38, 1.7);
  // The boiler room, behind plasterboard: the last demo tape.
  const room2 = branch(d, cellar, 12, 'front', 7);
  const stock = room2.hall(7, { width: 3, wall: 'block' });
  flat(g, stock, 6, { look: 'drywall', breakAt: 6.5 });
  const furnace = room2.room(5, 5, { wall: 'block', floor: 'concrete' });
  g.demo(...furnace.tile(3, 0));
  g.vinyl(...furnace.tile(1, 1), 70);
  d.hall(2, { wall: 'posters' });
  const stage = d.room(8, 9, { wall: 'posters', floor: 'planks' });
  g.block(...stage.rect(2, 2, stage.back * 3, 2), 1.3, { prop: 'amp' });
  g.block(...stage.rect(5, 2, stage.back * 3, 2), 1.3, { prop: 'speaker' });
  g.foe('soundguy', ...stage.tile(3, 0), { range: 3 });
  g.pick(...stage.tile(1, 0), 10);
  d.hall(3, { wall: 'posters' });
  d.exit(3);
  void backTile;
  return g;
}
