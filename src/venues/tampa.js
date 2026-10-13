import { digger } from '../dig.js';
import { Venue } from '../venue.js';
import { across, backTile, barred, branch, flat, loop, wallTile, wash } from './helpers.js';

/**
 * Track 6: Tampa, 1991. Death metal: a strip-mall recording studio in the
 * Florida heat, and everything between you and it. A car park with a van in
 * it; a boardwalk out over the swamp, the gators underneath it and the green
 * gas coming up between the boards on the beat; a churchyard on a hummock,
 * its headstones hung on chains over the path; an airboat across the bayou;
 * a county morgue with a steel door that wants a pass; and the studio at the
 * end of it, lined in foam, where the vocals are being recorded. They are
 * being recorded with a bucket over a microphone. It is the most Florida
 * thing that has ever happened.
 */

export const TAMPA = {
  tiles: ['#4a5a3a', '#3a4a30', '#6a7a3a', '#5a6a48'],
  walls: ['#6a7a5a', '#4a5a3a', '#8a8a6a', '#5a6a4a'],
  ambient: [0.8, 0.95, 0.82], lamp: '#d8ff90', trap: '#0c1c14', lift: '#3a6a4a', exit: '#7aff3a', sticky: '#2a3a1a', vary: 0.09,
};

/** The swamp after dark: sludge green, a streetlight's sick yellow, a tail light's red, the blue-green of a motel pool. */
const SLUDGE = ['#6aff3a', '#e8ff7a', '#ff3a3a', '#3ad8c8'];

export function tampa() {
  const g = new Venue({
    name: 'Tampa', act: 6, cols: 150, rows: 130, palette: TAMPA, tempo: 180,
    intro: 'It is ninety degrees at midnight. There is something in the water. It is not the worst thing in Florida.',
    look: {
      place: 'Tampa', year: 1991, genre: 'Death Metal', poster: '#3a6a2a', grade: 'swamp', voice: 'death', theme: 'swamp',
      floor: 'grass', wall: 'hedge', lamp: 'bulb', crusher: 'gravestone', lift: 'airboat', pyro: 'sludge', gate: 'bars',
      hemi: ['#8ac8a0', '#0c1a12', 0.9], key: '#cfe8d0', keyK: 0.8, lantern: '#e8ffa0',
      skyColors: ['#020806', '#06140e', '#0e2a1c', '#1a3e28', '#2e5a30'], stars: true, skyline: '#02060a', horizon: 'swamp', glow: '#9aff6a',
      reflect: SLUDGE, ceiling: '#0e1a14',
      rig: { colors: SLUDGE.slice(0, 2), program: 'static', every: 4 },
    },
  });
  const sign = (p, along, text, color = SLUDGE[1], size = 0.5, height = 1.6) => g.light('neon', ...wallTile(p, along), { text, color, height, size });
  const lamppost = (p, along) => g.light('streetlamp', ...wallTile(p, along), { height: 2.4 });
  const BOARDS = { floor: 'planks', wall: 'hedge' };

  // The car park behind the strip mall: the van, a palm in a tub, and the sound of the cicadas.
  g.room(2, 12, 9, 9, 36, { lamps: 2, floor: 'asphalt', wall: 'stucco' });
  g.block(3, 13, 3, 2, 0.9, { prop: 'van' });
  g.bumper(8, 14, { radius: 0.4, look: 'palm' });
  g.start = { x: 6, z: 17 };
  const d = digger(g, { x: 11, z: 16, h: 36, heading: '+x' });

  // The frontage: a pawn shop, a nail salon, a vape place, a studio nobody has noticed; the locals out in front of them.
  const mall = d.hall(15, { width: 5, floor: 'asphalt', wall: 'stucco' });
  for (const a of [1, 2, 3]) g.pick(...mall.tile(a, 0), 5);
  g.foe('headbanger', ...mall.tile(5, 1), { range: 5 }).foe('floridaman', ...mall.tile(9, -1), { range: 5 });
  g.pick(...mall.tile(7, 0), 5).pick(...mall.tile(11, 1), 10);
  g.bumper(...mall.tile(6, -2), { radius: 0.4, look: 'palm' });
  g.bumper(...mall.tile(12, 2), { radius: 0.4, look: 'palm' });
  g.foe('rat', ...mall.tile(13, 0), { path: loop(mall, 1, 8, 15) });
  lamppost(mall, 3);
  lamppost(mall, 12);
  sign(mall, 8, 'SUNSHINE STATE', SLUDGE[1], 0.5, 1.7);
  // The back of the pawn shop, behind a sheet of plywood: the first demo tape. Run at it.
  const pawn = branch(d, mall, 4, 'front', 3);
  const stockroom = pawn.hall(7, { width: 3, wall: 'stucco' });
  flat(g, stockroom, 6, { look: 'wood', breakAt: 6.5 });
  const back = pawn.room(5, 5, { wall: 'stucco', floor: 'concrete' });
  g.demo(...back.tile(3, 0));
  g.vinyl(...back.tile(1, -1), 50).pick(...back.tile(1, 1), 10);
  d.turn('+z', { floor: 'asphalt', wall: 'stucco' });
  d.hall(3, { floor: 'asphalt', wall: 'stucco' });

  // Down off the kerb and out along a boardwalk over the swamp: gators underneath, sludge coming up between the boards, mud the boot comes out of slowly.
  d.stairs(6, 3, { width: 3, floor: 'planks', wall: 'hedge' });
  const walk = d.hall(24, { width: 5, ...BOARDS });
  g.foe('gator', ...walk.tile(4, 1), { path: loop(walk, 1, 2, 10) });
  g.foe('gator', ...walk.tile(15, -1), { path: loop(walk, 1, 12, 22) });
  g.foe('zombie', ...walk.tile(9, 0), { range: 4 });
  for (const a of [1, 2, 3]) g.pick(...walk.tile(a, 0), 5);
  g.pyro(...across(walk, 7, { beats: 4 }));
  g.pyro(...across(walk, 12, { beats: 4, offset: 0.5 }));
  g.pyro(...across(walk, 17, { beats: 4 }));
  g.pick(...walk.tile(8, -1), 5).pick(...walk.tile(8, 1), 5).pick(...walk.tile(13, 0), 10).pick(...walk.tile(18, 0), 10);
  g.sticky(...walk.rect(20, 2, walk.lo, 2));
  g.whetstone(...walk.tile(22, 1));
  lamppost(walk, 5);
  lamppost(walk, 14);
  sign(walk, 10, 'DO NOT FEED THE GATORS', SLUDGE[2], 0.45, 1.7);
  // A fishing shack on stilts, off the boardwalk, its door nailed shut: the second demo tape.
  const shack = branch(d, walk, 17, 'back', 3);
  const hut = shack.hall(7, { width: 3, wall: 'timber' });
  flat(g, hut, 6, { look: 'wood', breakAt: 6.5 });
  const cabin = shack.room(5, 5, { wall: 'timber', floor: 'planks' });
  g.demo(...cabin.tile(3, 0));
  g.vinyl(...cabin.tile(1, -1), 60).pick(...cabin.tile(1, 1), 10);
  d.turn('+x', { ...BOARDS });
  d.hall(3, { ...BOARDS });

  // The churchyard on its hummock: the cypress knees in the water, the headstones hung on chains over the path and let go on the beat, the dead who got up for the vocals.
  const yard = d.room(20, 15, { floor: 'grass', wall: 'hedge' });
  g.pillar(...backTile(yard, 2), 1.1, { prop: 'stump' });
  g.pillar(...backTile(yard, 7), 1.1, { prop: 'stump' });
  g.pillar(...backTile(yard, 12), 1.1, { prop: 'stump' });
  g.drop(...across(yard, 4, { beats: 4 }));
  g.drop(...across(yard, 9, { beats: 4, offset: 0.5 }));
  g.drop(...across(yard, 14, { beats: 4 }));
  g.pick(...yard.tile(2, 0), 5).pick(...yard.tile(6, 3), 5).pick(...yard.tile(6, -3), 5).pick(...yard.tile(11, 0), 10).pick(...yard.tile(16, 3), 10);
  for (const [a, b] of [[7, 5], [12, 5], [16, -5]]) g.pillar(...yard.tile(a, b), 0.8, { prop: 'gravestones' });
  g.bumper(...yard.tile(6, 0), { radius: 0.4, look: 'cross' });
  g.bumper(...yard.tile(11, -4), { radius: 0.4, look: 'cross' });
  g.foe('zombie', ...yard.tile(7, -2), { range: 5 }).foe('zombie', ...yard.tile(12, 2), { range: 5 });
  g.foe('headbanger', ...yard.tile(16, 0), { range: 5 });
  g.foe('coroner', ...yard.tile(18, -3), { range: 4 });
  g.lighter(...yard.tile(2, 5));
  lamppost(yard, 3);
  // The crypt, down the back of the yard behind a plastic ghost: the pass, and the coroner who is guarding it.
  const crypt = branch(d, yard, 9, 'back', 8);
  crypt.hall(3, { wall: 'stone' });
  const vault = crypt.room(6, 7, { wall: 'stone', floor: 'marble' });
  g.pass(...vault.tile(3, 0));
  g.pillar(...vault.tile(5, 3), 0.8, { prop: 'tomb' });
  g.foe('coroner', ...vault.tile(2, 2), { range: 4 });
  g.pick(...vault.tile(4, -2), 10);
  d.hall(3, { floor: 'grass', wall: 'hedge' });
  d.stairs(6, 3, { width: 3, ...BOARDS });

  // The bayou: black water, an airboat that goes across it at the pace of one, the far bank with its own welcoming committee.
  const dock = d.hall(7, { width: 3, ...BOARDS });
  g.foe('floridaman', ...dock.tile(3, 0), { range: 3 });
  g.pick(...dock.tile(1, 0), 5).pick(...dock.tile(5, 1), 5);
  lamppost(dock, 2);
  d.ferry(15, { size: 3, period: 9 });
  const bank = d.hall(9, { width: 5, floor: 'grass', wall: 'hedge' });
  g.pick(...bank.tile(2, 0), 5).pick(...bank.tile(6, 1), 10);
  g.foe('gator', ...bank.tile(5, 0), { path: loop(bank, 1, 1, 8) });
  g.foe('zombie', ...bank.tile(7, -1), { range: 3 });
  g.whetstone(...bank.tile(7, 2));
  g.bumper(...bank.tile(3, -2), { radius: 0.4, look: 'firebarrel' });
  d.hall(3, { floor: 'grass', wall: 'hedge' });
  d.turn('+z', { floor: 'concrete', wall: 'block' });
  d.hall(3, { floor: 'concrete', wall: 'block' });

  // The county morgue: steel tables, a gurney in the corridor, a barrel of something green that should not be there, and a steel door that wants a pass.
  const hall = d.hall(14, { width: 5, floor: 'checker', wall: 'block' });
  g.block(...hall.rect(2, 2, hall.back * 2, 1), 0.7, { prop: 'gurney' });
  g.block(...hall.rect(6, 2, hall.back * 2, 1), 0.7, { prop: 'gurney' });
  g.pillar(...backTile(hall, 4), 0.8, { prop: 'toxicbarrel' });
  g.pillar(...backTile(hall, 8), 0.8, { prop: 'toxicbarrel' });
  g.foe('coroner', ...hall.tile(5, 0), { range: 5 }).foe('floridaman', ...hall.tile(9, 1), { range: 4 });
  g.pick(...hall.tile(1, 0), 5).pick(...hall.tile(4, 1), 5).pick(...hall.tile(7, -1), 5).pick(...hall.tile(12, 0), 10);
  g.light('par', ...wallTile(hall, 4), { colors: ['#e8fff4', '#cfe8e0'], program: 'static', glow: 0.8, reach: 8, aim: [2, 2], height: 1.8 });
  barred(g, hall, 11, 'bars');
  sign(hall, 6, 'MORGUE', SLUDGE[3], 0.5, 1.7);
  d.hall(2, { floor: 'checker', wall: 'block' });
  d.turn('+x', { floor: 'concrete', wall: 'foam' });
  d.hall(3, { floor: 'concrete', wall: 'foam' });

  // The studio: foam on every wall, a console the length of the room, a bucket over a microphone, and a band who have been in here for nine days.
  const live = d.room(18, 13, { wall: 'foam', floor: 'carpet' });
  g.block(...live.rect(3, 2, live.back * 5, 2), 1.3, { prop: 'console' });
  g.pillar(...backTile(live, 8), 1.2, { prop: 'speaker' });
  g.pillar(...backTile(live, 14), 1.2, { prop: 'speaker' });
  g.foe('headbanger', ...live.tile(6, -2), { range: 5 }).foe('headbanger', ...live.tile(10, 2), { range: 5 });
  g.foe('zombie', ...live.tile(12, -2), { range: 5 });
  g.foe('soundguy', ...live.tile(15, 1), { range: 4 });
  g.pick(...live.tile(2, 0), 10).pick(...live.tile(5, 3), 5).pick(...live.tile(9, -3), 10).pick(...live.tile(13, 3), 10).pick(...live.tile(16, -3), 10);
  g.whetstone(...live.tile(3, -3));
  wash(g, live, [SLUDGE[0], SLUDGE[2]], { cans: 3, program: 'pulse', every: 1 });
  sign(live, 9, 'RECORDING: DO NOT ENTER', SLUDGE[2], 0.42, 1.7);
  // The tape store, behind a panel: the last demo tape.
  const store = branch(d, live, 6, 'front', 7);
  const racks = store.hall(7, { width: 3, wall: 'block' });
  flat(g, racks, 6, { look: 'drywall', breakAt: 6.5 });
  const vault2 = store.room(5, 5, { wall: 'block', floor: 'concrete' });
  g.demo(...vault2.tile(3, 0));
  g.vinyl(...vault2.tile(1, 1), 70);
  d.hall(2, { wall: 'foam' });
  const booth = d.room(8, 9, { wall: 'foam', floor: 'carpet' });
  g.block(...booth.rect(2, 2, booth.back * 3, 2), 1.3, { prop: 'amp' });
  g.block(...booth.rect(5, 2, booth.back * 3, 2), 1.3, { prop: 'speaker' });
  g.foe('soundguy', ...booth.tile(3, 0), { range: 3 });
  g.pick(...booth.tile(1, 0), 10);
  d.hall(3, { wall: 'foam' });
  d.exit(3);
  return g;
}
