import { digger } from '../dig.js';
import { Venue } from '../venue.js';
import { across, backTile, barred, branch, flat, toBack, wallTile, wash } from './helpers.js';

/**
 * Stop 7: Tokyo. Neon, and the cherry blossom coming down through it. Out
 * of the station exit onto the great crossing, the signs stacked up the
 * buildings, the ramen stalls steaming on the beat, the salarymen and the
 * cosplayers all crossing at once; up a flight to the karaoke box, a snow
 * globe in the private room behind the frosted glass; down a yokocho, an
 * alley of tiny bars, where the vending machines keep coming down off the
 * delivery truck; into the robot restaurant, all lights and lasers, the
 * passport left on its floor and a globe in the kitchen behind the bamboo;
 * out to the bullet train's platform, the train
 * out to the viewing deck where Fuji is and the last globe; and into the
 * sumo stable, the ring of rice bales, where the Yokozuna stamps and the
 * ring throws Rock out of it. City pop over taiko, a koto on top.
 */

export const TOKYO = {
  tiles: ['#5a5e6a', '#4a4e5a', '#e8306a', '#3a3e4a'],
  walls: ['#6a6e7a', '#5a5e6a', '#e8306a', '#4a4e5a'],
  ambient: [0.95, 0.92, 1.05], lamp: '#fff0d8', trap: '#202028', lift: '#f4f6f8', exit: '#ff3a8a', zap: '#ffe8f8', zapHue: 0.9, vary: 0.07,
};

/** Tokyo at night: neon pink, electric blue, a lantern's red, signs in every other colour. */
const NEON = ['#ff3a8a', '#3ad8ff', '#ff3a3a', '#ffd23a', '#9a5aff'];

export function tokyo() {
  const g = new Venue({
    name: 'Tokyo', act: 7, cols: 146, rows: 138, palette: TOKYO, tempo: 124,
    intro: 'Thirty-seven million people. One boulder. Everybody is filming it.',
    look: {
      country: 'Japan', poster: '#d81a5a', grade: 'neon', weather: 'petals', theme: 'tokyo',
      floor: 'asphalt', wall: 'block', lamp: 'bulb', crusher: 'vending', lift: 'bullet', pyro: 'steam', gate: 'border',
      hemi: ['#c8b8f0', '#2a2030', 1.05], key: '#f0e8ff', keyK: 1.1, lantern: '#ffd8e8',
      skyColors: ['#04040e', '#0a0a20', '#1a1438', '#3a2050', '#6a3060'], stars: false, skyline: '#08060e', horizon: 'fuji',
      reflect: NEON, ceiling: '#141022',
      rig: { colors: NEON.slice(0, 2), program: 'chase', every: 2 },
    },
  });
  const sign = (p, along, text, color = NEON[0], size = 0.6, height = 1.7) => g.light('neon', ...wallTile(p, along), { text, color, height, size });
  const STREET = { floor: 'asphalt', wall: 'block' };
  const ROOMS = { floor: 'tatami', wall: 'shoji' };

  // The station exit, a salaryman on his way home (he is not on his way home).
  g.room(16, 4, 5, 5, 82, { lamps: 3, ...STREET });
  g.start = { x: 18, z: 6 };
  const d = digger(g, { x: 21, z: 6, h: 82, heading: '+x' });
  const steps = d.hall(6, STREET);
  g.foe('salaryman', ...steps.tile(4, 0), { range: 4 });
  g.pick(...steps.tile(1, 0), 5).pick(...steps.tile(3, 0), 5).pick(...steps.tile(5, 0), 5);
  sign(steps, 3, 'EXIT 8', NEON[1], 0.6, 1.8);
  d.turn('+z', STREET);
  d.stairs(3, 1.5, { wall: 'block' });

  // The crossing: the signs stacked up the buildings, a taxi at the kerb, the ramen stalls steaming, everybody crossing at once.
  const crossing = d.room(24, 11, STREET);
  for (const k of [3, 11, 23]) g.light('streetlamp', ...crossing.tile(k, -crossing.back * 4), { height: 2.6 });
  g.block(...crossing.rect(18, 3, -crossing.back * 4 - (crossing.back > 0 ? 1 : 0), 2), 0.9, { prop: 'sedan' });
  g.pyro(...across(crossing, 7, { beats: 4 }));
  g.pyro(...across(crossing, 16, { beats: 4, offset: 0.5 }));
  g.bumper(...crossing.tile(4, 3), { radius: 0.4, look: 'lantern' });
  g.bumper(...crossing.tile(21, -3), { radius: 0.4, look: 'lantern' });
  for (const k of [1, 22]) g.pillar(...backTile(crossing, k), 1.4, { prop: 'vending' });
  // A sign's cable down in a puddle by the kerb, fizzing.
  g.zap(...crossing.rect(10, 2, -crossing.back * 5, 1), d.h);
  g.foe('salaryman', ...crossing.tile(4, -2), { range: 3 }).foe('cosplayer', ...crossing.tile(12, 2), { range: 3 });
  g.foe('tourist', ...crossing.tile(20, 0), { range: 5 });
  g.pick(...crossing.tile(2, 0), 10).pick(...crossing.tile(10, -2), 10).pick(...crossing.tile(13, 0), 10).pick(...crossing.tile(22, 2), 10);
  sign(crossing, 5, 'RAMEN', NEON[2], 0.6);
  sign(crossing, 13, 'TOKYO', NEON[0], 0.7);
  sign(crossing, 21, 'ARCADE', NEON[4], 0.55);
  // A giant screen's light sweeping the crossing.
  g.light('spot', ...wallTile(crossing, 17), { colors: [NEON[1], NEON[0]], radius: 3, aim: toBack(crossing).map((v) => -5 * v), height: 1.3, angle: 0.24 });

  // The karaoke box, up a flight off the crossing: the machine, a cosplayer mid-song.
  const up = branch(d, crossing, 9, 'back', 6);
  up.hall(3, { floor: 'planks', wall: 'block' });
  const karaoke = up.room(9, 9, { floor: 'carpet', wall: 'wallpaper' });
  g.block(...karaoke.rect(5, 2, 1, 1), 0.8, { prop: 'karaoke' });
  for (const k of [1, 2]) g.pillar(...backTile(karaoke, k), 1.4, { prop: 'vending' });
  g.foe('cosplayer', ...karaoke.tile(3, 2), { range: 4 });
  g.pick(...karaoke.tile(7, 3), 10);
  g.tape(...karaoke.tile(7, -3));
  g.light('ball', ...karaoke.tile(4, 0), { colors: NEON, height: 2.4 });
  sign(karaoke, 7.5, 'KARAOKE', NEON[3], 0.4, 1.6);
  // The private room, behind its frosted glass: the first snow globe.
  const inner = branch(up, karaoke, 6, 'front', 5);
  const door = inner.hall(5, ROOMS);
  flat(g, door, 3, { look: 'glass', breakAt: 6 });
  const booth = inner.room(5, 5, ROOMS);
  g.globe(...booth.tile(3, 0));
  g.suitcase(...booth.tile(1, 1), 60);
  d.hall(2, STREET);
  d.turn('+x', STREET);

  // The yokocho: an alley of tiny bars, red lanterns, the vending machines coming down off the delivery truck, a sumo apprentice in a doorway.
  const alley = d.hall(16, { width: 5, floor: 'cobble', wall: 'shoji' });
  g.drop(...across(alley, 5, { beats: 4 }));
  g.drop(...across(alley, 11, { beats: 4, offset: 0.5 }));
  for (const k of [2, 8, 14]) g.pillar(...backTile(alley, k), 0.9, { prop: 'stall' });
  g.foe('sumo', ...alley.tile(14, 1), { range: 2 });
  g.pick(...alley.tile(3, 0), 5).pick(...alley.tile(8, 1), 5).pick(...alley.tile(15, 0), 10);
  g.tape(...alley.tile(15, -1));
  g.light('festoon', ...alley.tile(0, -2), { to: [15 * alley.dir[0] + 4 * alley.across[0], 15 * alley.dir[1] + 4 * alley.across[1]], colors: [NEON[2], '#ffb060'], height: 2.3 });
  d.turn('+z', { floor: 'cobble', wall: 'shoji' });
  d.stairs(4, 2, { wall: 'block' });
  d.hall(2, ROOMS);

  // The robot restaurant: all lights and lasers, the robots serving, a mascot dancing, a ninja on the door.
  const robots = d.room(17, 13, { floor: 'checker', wall: 'block' });
  g.block(...robots.rect(3, 9, robots.back * 6, 1), 0.9, { prop: 'bar' });
  g.block(...robots.rect(13, 2, -robots.back * 5, 1), 1.0, { prop: 'taiko' });
  for (const [a, b] of [[4, 2], [8, -2], [8, 3], [12, 0]]) g.pillar(...robots.tile(a, b), 0.62, { prop: 'table' });
  g.foe('robot', ...robots.tile(14, 2), { range: 5 }).foe('mascot', ...robots.tile(6, -2), { range: 5 });
  g.foe('ninja', ...robots.tile(2, 3), { range: 3 });
  g.pick(...robots.tile(2, -2), 10).pick(...robots.tile(10, 5), 10).pick(...robots.tile(15, -3), 10);
  g.lighter(...robots.tile(16, -5));
  // The passport, left on the floor by somebody who came for the robots and is still here.
  g.pass(...robots.tile(11, -3));
  sign(robots, 8, 'ROBOT', NEON[1], 0.6, 1.9);
  g.light('laser', ...wallTile(robots, 4), { colors: [NEON[0], NEON[1]], height: 2.2 });
  wash(g, robots, [NEON[0], NEON[4]], { cans: 2, program: 'chase', every: 2 });
  // Through the bamboo screen at the back of the kitchen: the second snow globe.
  const back = branch(d, robots, 14, 'back', 7);
  const bamboo = back.hall(5, { floor: 'planks', wall: 'shoji' });
  flat(g, bamboo, 3, { look: 'wood' });
  const kitchen = back.room(5, 5, ROOMS);
  g.globe(...kitchen.tile(3, 0));
  g.pillar(...kitchen.tile(3, 2), 0.62, { prop: 'table' });
  const exit = d.hall(4, { floor: 'planks', wall: 'block' });
  barred(g, exit, 2);
  d.turn('+x', { floor: 'plate', wall: 'block' });

  // The bullet train's platform: along the tracks, the yellow line, the trains, and one of them out to the viewing deck.
  const platform = d.ledge(18, { width: 4, floor: 'plate', wallTex: 'block' });
  g.drop(...across(platform, 6, { beats: 4 }));
  g.foe('salaryman', ...platform.tile(10, 0), { range: 3 });
  g.pick(...platform.tile(3, platform.back), 5).pick(...platform.tile(9, platform.back), 10).pick(...platform.tile(16, platform.back), 5);
  g.light('streetlamp', ...platform.tile(12, platform.back), { height: 2.4 });
  sign(platform, 3, 'SHINKANSEN', NEON[1], 0.4);
  // The train out to the deck at the end of the line, where Fuji is, and the last globe.
  const line = branch(d, platform, 13, 'front', 2);
  line.ferry(9, { size: 3, period: 7 });
  const deck = line.room(5, 5, { floor: 'planks', wall: 'fence' });
  g.globe(...deck.tile(2, 0));
  g.pick(...deck.tile(3, -1), 10).pick(...deck.tile(3, 1), 10);
  d.turn('+z', { floor: 'planks', wall: 'shoji' });
  d.hall(3, { floor: 'tatami', wall: 'shoji' });
  d.turn('+x', { floor: 'tatami', wall: 'shoji' });
  d.hall(2, { floor: 'tatami', wall: 'shoji' });

  // The sumo stable: the clay ring ringed with rice bales, banners, one lantern, and the Yokozuna.
  const stable = d.room(21, 15, { floor: 'dirt', wall: 'shoji' });
  for (const [a, b] of [[4, -6], [4, 6], [18, -6], [18, 6]]) g.pillar(...stable.tile(a, b), 0.7, { prop: 'bale' });
  g.block(...stable.rect(9, 3, -7, 1), 1.3, { prop: 'racking' });
  g.foe('yokozuna', ...stable.tile(14, 0), { range: 6 });
  g.pick(...stable.tile(2, 0), 10).pick(...stable.tile(7, -4), 10).pick(...stable.tile(7, 4), 10).pick(...stable.tile(12, -5), 10);
  g.tape(...stable.tile(2, -5)).tape(...stable.tile(2, 5));
  g.light('blinds', ...wallTile(stable, 9), { aim: toBack(stable).map((v) => -4 * v), height: 2.2, width: 3, depth: 3.4, program: 'pulse' });
  sign(stable, 15, 'DOHYŌ', NEON[2], 0.5, 1.8);
  d.hall(3, { floor: 'tatami', wall: 'shoji' });
  d.exit(3);
  return g;
}
