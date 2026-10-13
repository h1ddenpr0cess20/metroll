import { digger } from '../dig.js';
import { Venue } from '../venue.js';
import { across, backTile, barred, branch, flat, wallTile, wash } from './helpers.js';

/**
 * Track 12: Wacken, 2008. Everything, at once, in a field in Schleswig-Holstein
 * with the rain coming sideways: the whole history of the record in a
 * hundred thousand people wearing horned helmets. The campsite and the
 * camp road, with the kegs coming down on the beat and the fire brigade
 * hosing everybody; the mud, which is up to the knee, and the tractors that
 * pull the trucks out of it; the trailer across the flooded trench; the
 * medieval village in the next field, where there are knights, wizards,
 * and a sword-seller; the gate backstage; and the main stage, where
 * somebody who has been waiting for you for a very long time is sitting in
 * the middle of the floor, in sunglasses. He was here first. He has
 * thoughts about the spikes. He is, and this should be noted, a rock.
 */

export const WACKEN = {
  tiles: ['#7a6a4a', '#5a4a32', '#8a7a5a', '#6a5a3e'],
  walls: ['#6a5a3a', '#4a3a28', '#7a6a4a', '#5a4a32'],
  ambient: [0.85, 0.9, 0.95], lamp: '#ffcf80', trap: '#0c0a08', lift: '#5a4a2a', exit: '#e8202a', sticky: '#3a2a14', vary: 0.1,
};

/** A festival field in a storm: red, gold, a deep blue, and the white of a flag. */
const FEST = ['#e8202a', '#f0c840', '#3a8ae8', '#f4f2ee'];

export function wacken() {
  const g = new Venue({
    name: 'Wacken', act: 12, cols: 150, rows: 130, palette: WACKEN, tempo: 132,
    intro: 'The whole history of the record, in a field, in the rain, in horned helmets. And one guy at the end who was here first.',
    look: {
      place: 'Wacken', year: 2008, genre: 'Everything', poster: '#a82028', grade: 'storm', weather: 'rain', voice: 'festival', theme: 'festival',
      floor: 'mud', wall: 'plywood', lamp: 'bulb', crusher: 'keg', lift: 'trailer', pyro: 'steam', gate: 'border',
      hemi: ['#a0b0c8', '#14100c', 0.9], key: '#d8e0f0', keyK: 0.85, lantern: '#ffd890',
      skyColors: ['#0a0e18', '#1a2230', '#2e3a4c', '#4a5a6a', '#7a8a94'], stars: false, skyline: '#0a0c10', horizon: 'festival', glow: '#e8202a',
      reflect: FEST, ceiling: '#1a1810',
      rig: { colors: FEST.slice(0, 2), program: 'static', every: 4 },
    },
  });
  const sign = (p, along, text, color = FEST[1], size = 0.5, height = 1.6) => g.light('neon', ...wallTile(p, along), { text, color, height, size });
  const lamppost = (p, along) => g.light('streetlamp', ...wallTile(p, along), { height: 2.4 });
  const MUD = { floor: 'mud', wall: 'plywood' };

  // The campsite: a field of tents, a stag-night's worth of flags, a bonfire somebody has been feeding since Wednesday.
  g.room(2, 14, 9, 9, 36, { lamps: 2, floor: 'grass', wall: 'hedge' });
  g.block(3, 15, 2, 2, 0.9, { prop: 'dome', seed: 4 });
  g.block(6, 15, 2, 2, 0.9, { prop: 'dome', seed: 9 });
  g.bumper(8, 20, { radius: 0.4, look: 'firebarrel' });
  g.start = { x: 6, z: 19 };
  const d = digger(g, { x: 11, z: 18, h: 36, heading: '+x' });

  // The camp road: mud, with the kegs coming down on the beat, the fire brigade hosing everyone, vikings and a wizard in the queue for a bratwurst.
  const road = d.hall(24, { width: 7, ...MUD });
  for (const a of [1, 2, 3]) g.pick(...road.tile(a, 0), 5);
  g.foe('viking', ...road.tile(5, 2), { range: 5 }).foe('beerguy', ...road.tile(9, -2), { range: 4 });
  g.drop(...across(road, 7, { beats: 4 }));
  g.pick(...road.tile(8, 0), 5).pick(...road.tile(8, 2), 5).pick(...road.tile(8, -2), 5);
  g.foe('wizard', ...road.tile(11, 1), { range: 4 });
  g.drop(...across(road, 13, { beats: 4, offset: 0.5 }));
  g.foe('viking', ...road.tile(16, -2), { range: 5 });
  g.pyro(...across(road, 19, { beats: 4 }));
  g.pick(...road.tile(14, 0), 10).pick(...road.tile(17, 1), 5).pick(...road.tile(22, 0), 10);
  g.bumper(...road.tile(10, 3), { radius: 0.4, look: 'shield' });
  g.bumper(...road.tile(15, -3), { radius: 0.4, look: 'runestone' });
  g.whetstone(...road.tile(23, 2));
  lamppost(road, 3);
  sign(road, 16, 'BEER · BEER · BEER', FEST[1], 0.45, 1.7);
  // The beer tent, off the front, its flap tied shut against the weather: the first demo tape. Run at it.
  const beer = branch(d, road, 4, 'front', 4);
  const flap = beer.hall(8, { width: 3, wall: 'timber' });
  flat(g, flap, 7, { look: 'canvas', breakAt: 6.5 });
  const tent = beer.room(5, 5, { wall: 'timber', floor: 'planks' });
  g.demo(...tent.tile(3, 0));
  g.vinyl(...tent.tile(1, -1), 50).pick(...tent.tile(1, 1), 10);
  // The VIP lounge, off the back: the pass is on a lanyard on a knight.
  const lounge = branch(d, road, 11, 'back', 4);
  lounge.hall(3, { wall: 'timber' });
  const vip = lounge.room(6, 7, { wall: 'timber', floor: 'carpet' });
  g.pass(...vip.tile(3, 0));
  g.pillar(...vip.tile(5, 3), 0.8, { prop: 'case' });
  g.foe('knight', ...vip.tile(2, 2), { range: 4 });
  g.pick(...vip.tile(4, -2), 10);
  d.turn('+z', MUD);
  d.hall(3, MUD);

  // The mud: knee deep, sticky as anything, a lot of knights going down in it in their armour; the purist at the edge, watching, unmoved, and entirely dry.
  const swamp = d.room(20, 15, { floor: 'mud', wall: 'plywood' });
  g.sticky(...swamp.rect(4, 4, swamp.lo + 2, 3));
  g.sticky(...swamp.rect(11, 4, swamp.lo + 8, 3));
  g.foe('knight', ...swamp.tile(5, -2), { range: 5 }).foe('beerguy', ...swamp.tile(9, 3), { range: 5 }).foe('purist', ...swamp.tile(14, -2), { range: 5 });
  g.foe('wizard', ...swamp.tile(17, 3), { range: 4 });
  g.pick(...swamp.tile(2, 0), 5).pick(...swamp.tile(7, 0), 10).pick(...swamp.tile(12, 0), 10).pick(...swamp.tile(17, -3), 5).pick(...swamp.tile(10, -4), 5);
  g.bumper(...swamp.tile(8, -4), { radius: 0.4, look: 'shield' });
  g.bumper(...swamp.tile(15, 4), { radius: 0.4, look: 'firebarrel' });
  g.lighter(...swamp.tile(2, 5));
  lamppost(swamp, 3);
  d.hall(3, MUD);

  // The flooded trench: a ditch the size of a river, a mud trailer that crosses at the pace of one, and the far bank with the fire engine's hose on it.
  const dock = d.hall(7, { width: 3, ...MUD });
  g.foe('beerguy', ...dock.tile(3, 0), { range: 3 });
  g.pick(...dock.tile(1, 0), 5).pick(...dock.tile(5, 1), 5);
  lamppost(dock, 2);
  d.ferry(15, { size: 3, period: 9 });
  const bank = d.hall(10, { width: 5, ...MUD });
  g.pick(...bank.tile(3, 0), 5).pick(...bank.tile(7, 1), 10);
  g.foe('viking', ...bank.tile(6, -1), { range: 3 });
  g.whetstone(...bank.tile(9, 1));
  // A plank across the trench to the sword-seller's stall: the second demo tape, under a sword.
  const stall = branch(d, bank, 6, 'back', 3);
  stall.hall(2, { wall: 'timber' });
  const plank = stall.bridge(7, { floor: 'planks' });
  g.foe('wizard', ...plank.tile(3, 0), { path: [plank.tile(1, 0), plank.tile(5, 0)] });
  const hut = stall.room(5, 5, { wall: 'timber', floor: 'planks' });
  g.demo(...hut.tile(2, 0));
  d.turn('+x', MUD);
  d.hall(3, MUD);

  // The medieval village in the next field: timber, banners, a forge with nobody at it, a knights' tournament that has gone a little off the plan.
  const village = d.room(22, 17, { floor: 'dirt', wall: 'timber' });
  for (const [a, b] of [[3, -6], [3, 6], [11, -6], [11, 6]]) g.block(...village.rect(a, 2, b, 2), 0.9, { prop: 'dome', seed: a * 3 + b });
  g.pillar(...backTile(village, 5), 1.1, { prop: 'oildrums' });
  g.pillar(...backTile(village, 8), 1.2, { prop: 'anvil' });
  for (const [a, b] of [[6, -2], [6, 3], [15, -4], [15, 4]]) g.bumper(...village.tile(a, b), { radius: 0.4, look: 'shield' });
  g.foe('knight', ...village.tile(7, 1), { range: 5 }).foe('knight', ...village.tile(12, -3), { range: 5 }).foe('wizard', ...village.tile(10, 3), { range: 4 });
  g.foe('viking', ...village.tile(14, 2), { range: 5 }).foe('beerguy', ...village.tile(18, -2), { range: 4 }).foe('purist', ...village.tile(19, 3), { range: 4 });
  g.pick(...village.tile(2, 0), 10).pick(...village.tile(5, 2), 5).pick(...village.tile(9, 0), 10).pick(...village.tile(13, -3), 10).pick(...village.tile(17, 0), 10).pick(...village.tile(20, 4), 10);
  g.whetstone(...village.tile(2, -5)).whetstone(...village.tile(2, 5));
  wash(g, village, [FEST[0], FEST[1]], { cans: 3, program: 'pulse', every: 1 });
  sign(village, 12, 'HERE BE METAL', FEST[0], 0.45, 1.9);
  // The armoury, off the front of the village, behind a timber screen: the last demo tape.
  const armoury = branch(d, village, 12, 'front', 9);
  const screen = armoury.hall(7, { width: 3, wall: 'timber' });
  flat(g, screen, 6, { look: 'wood', breakAt: 6.5 });
  const store = armoury.room(5, 5, { wall: 'timber', floor: 'planks' });
  g.demo(...store.tile(3, 0));
  g.vinyl(...store.tile(1, 1), 70);
  // The artist gate: a barrier arm, a guard, and a sign that says what the guard has been saying all day.
  const gate = d.hall(8, { width: 3, ...MUD });
  barred(g, gate, 4, 'border');
  g.foe('knight', ...gate.tile(2, 0), { range: 3 });
  g.pick(...gate.tile(1, 1), 5).pick(...gate.tile(6, 0), 5);
  sign(gate, 6, 'ARTISTS ONLY', FEST[2], 0.4, 1.7);
  d.hall(2, MUD);

  // The main stage: a stage the size of a block of flats, a wall of speakers, a ring of pyro; a floor of mud and of a rock, in the middle of it, in shades.
  const arena = d.room(24, 19, { floor: 'mud', wall: 'plywood' });
  g.pillar(...backTile(arena, 3), 1.3, { prop: 'amp' });
  g.pillar(...backTile(arena, 20), 1.3, { prop: 'speaker' });
  for (const [a, b] of [[6, -8], [6, 8], [17, -8], [17, 8]]) g.pillar(...arena.tile(a, b), 1.0, { prop: 'speaker' });
  g.foe('rock', ...arena.tile(13, 0), { range: 8 });
  g.foe('purist', ...arena.tile(8, 4), { range: 5 }).foe('viking', ...arena.tile(8, -4), { range: 5 });
  g.foe('beerguy', ...arena.tile(19, 5), { range: 3 });
  g.pick(...arena.tile(2, 0), 10).pick(...arena.tile(7, -7), 10).pick(...arena.tile(7, 7), 10).pick(...arena.tile(11, 6), 10).pick(...arena.tile(11, -6), 10).pick(...arena.tile(16, 7), 10).pick(...arena.tile(16, -7), 10);
  g.whetstone(...arena.tile(2, -8)).whetstone(...arena.tile(2, 8));
  wash(g, arena, [FEST[0], FEST[1], FEST[2]], { cans: 4, program: 'chase', every: 2, strobe: true });
  sign(arena, 12, 'THE ORIGINAL', FEST[1], 0.5, 1.9);
  d.hall(3, MUD);
  d.exit(3);
  return g;
}
