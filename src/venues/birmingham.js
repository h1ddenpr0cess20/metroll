import { digger } from '../dig.js';
import { Venue } from '../venue.js';
import { across, backTile, barred, branch, flat, loop, toBack, wallTile } from './helpers.js';

/**
 * Track 1: Birmingham, 1970. Heavy metal is invented here, in the rain, by
 * four men who have just come off a shift. Off the van in the depot yard, along
 * a wet street of terraces and oil drums, across the canal on a narrowboat, into
 * the works, where the anvils come down on the beat and the furnaces breathe
 * fire; through the foreman's office (the backstage pass), the gate that wants
 * it, and into the pub, where the regulars have views, and up the stairs to the
 * back room where the band is. Everything is taught here: rolling over picks,
 * running at somebody to smash them, something that drops on the beat, a
 * security gate and its pass, a hoarding that someone ought to run at with a
 * demo tape behind it. Slow, and very heavy, and the first tritone anyone has
 * ever played on purpose.
 */

export const BIRMINGHAM = {
  tiles: ['#4c4a48', '#3c3a38', '#8a3a2a', '#6a6866'],
  walls: ['#6a3a2e', '#583026', '#4a3a34', '#7a4a3a'],
  ambient: [0.82, 0.8, 0.84], lamp: '#ff9a40', trap: '#2a2a2a', lift: '#1e4a3a', exit: '#e8202a', sticky: '#4a3a1a', vary: 0.08,
};

/** The works at night: sodium lamps, furnace orange, a red bus, the cold blue of the canal. */
const SMOKE = ['#ff8a2a', '#ffd890', '#e8302a', '#4a6ab8'];

export function birmingham() {
  const g = new Venue({
    name: 'Birmingham', act: 1, cols: 110, rows: 110, palette: BIRMINGHAM, tempo: 84,
    intro: 'Heavy metal does not exist yet. Somebody has to roll over it.',
    look: {
      place: 'Birmingham', year: 1970, genre: 'Heavy metal', poster: '#8a3a2a', grade: 'steel', weather: 'rain', voice: 'brum', theme: 'brum',
      floor: 'asphalt', wall: 'brick', lamp: 'bulb', crusher: 'anvil', lift: 'narrowboat', gate: 'border',
      hemi: ['#9aa0b0', '#3a2a22', 0.95], key: '#c8d0e8', keyK: 0.95, lantern: '#ffd0a0',
      skyColors: ['#0a0908', '#14100e', '#221612', '#3a2214', '#5a3418'], stars: false, skyline: '#0a0807', horizon: 'foundry', glow: '#ff7a1a',
      reflect: SMOKE, ceiling: '#2a1a14',
      rig: { colors: SMOKE.slice(0, 3), program: 'static', every: 4 },
    },
  });
  const sign = (p, along, text, color = SMOKE[0], size = 0.55, height = 1.6) => g.light('neon', ...wallTile(p, along), { text, color, height, size });
  const lamppost = (p, along) => g.light('streetlamp', ...wallTile(p, along), { height: 2.4 });

  // The depot yard, by the van.
  g.room(2, 4, 5, 5, 40, { lamps: 3, floor: 'asphalt', wall: 'brick' });
  g.start = { x: 4, z: 6 };
  const d = digger(g, { x: 7, z: 6, h: 40, heading: '+x' });
  // A wet street of terraces: picks somebody dropped, oil drums to bounce off, a poser with his tag still on.
  const street = d.hall(11, { wall: 'brick', floor: 'cobble' });
  for (const a of [1, 2, 3]) g.pick(...street.tile(a, 0), 5);
  g.pick(...street.tile(9, 1), 5);
  g.foe('poser', ...street.tile(5, 1), { range: 4 });
  g.bumper(...street.tile(7, 0), { radius: 0.4, look: 'oildrum' });
  g.bumper(...street.tile(7, 1), { radius: 0.4, look: 'oildrum' });
  g.pillar(...backTile(street, 9), 1.1, { prop: 'oildrums' });
  lamppost(street, 2);
  sign(street, 6, 'THE CROWN', SMOKE[0], 0.5);
  d.turn('+z', { wall: 'brick', floor: 'cobble' });
  d.hall(5, { wall: 'brick', floor: 'cobble' });
  d.stairs(4, 2, { floor: 'cobble' });

  // The canal: a towpath, a gap of black water and a narrowboat that goes back and forth across it.
  const bank = d.hall(8, { wall: 'brick', floor: 'cobble' });
  g.foe('hippie', ...bank.tile(4, 1), { range: 4 });
  g.pick(...bank.tile(1, 0), 5).pick(...bank.tile(2, 0), 5).pick(...bank.tile(6, -1), 10);
  g.foe('pigeon', ...bank.tile(4, 0), { path: loop(bank, 1) });
  lamppost(bank, 3);
  sign(bank, 6, 'CANAL', SMOKE[3], 0.5);
  d.ferry(15, { size: 3, period: 9 });
  const far = d.hall(7, { wall: 'brick', floor: 'cobble' });
  g.foe('foreman', ...far.tile(3, 0), { range: 4 });
  g.pick(...far.tile(1, 0), 5).pick(...far.tile(5, 1), 5);
  d.turn('+x', { wall: 'brick', floor: 'plate' });

  // The works yard: oil drums, furnaces, and everyone with a clipboard; a furnace-house with the first demo tape behind a breakaway.
  const yard = d.room(15, 11, { floor: 'plate', wall: 'brick' });
  for (const k of [2, 5]) g.pillar(...backTile(yard, k), 1.1, { prop: 'oildrums' });
  g.pillar(...backTile(yard, 7), 1.2, { prop: 'anvil' });
  g.block(...yard.rect(10, 2, yard.back * 5, 1), 1.3, { prop: 'furnace' });
  g.foe('foreman', ...yard.tile(5, -2), { range: 6 }).foe('roadie', ...yard.tile(9, 2), { range: 5 });
  g.foe('merchguy', ...yard.tile(12, -3), { range: 4 });
  for (const [a, b] of [[4, 3], [8, -3]]) g.bumper(...yard.tile(a, b), { radius: 0.4, look: 'oildrum' });
  g.pick(...yard.tile(3, 3), 10).pick(...yard.tile(12, 3), 10).pick(...yard.tile(6, 0), 5);
  g.vinyl(...yard.tile(13, -4), 50);
  sign(yard, 6.5, 'LUCAS WORKS', SMOKE[0], 0.5, 1.7);
  lamppost(yard, 3);
  lamppost(yard, 12);
  // The foreman's office, off the back of the yard: the pass, left under a flask of tea.
  const lodge = branch(d, yard, 12, 'back', 6);
  lodge.hall(3, { wall: 'brick' });
  const office = lodge.room(6, 7, { wall: 'brick', floor: 'planks' });
  g.pass(...office.tile(3, 0));
  g.pillar(...office.tile(5, 3), 1.1, { prop: 'oildrums' });
  g.foe('foreman', ...office.tile(2, 2), { range: 4 });
  g.pick(...office.tile(4, -2), 10);
  // Off the front of the yard, behind a hoarding: the first demo tape. Run at it.
  const shed = branch(d, yard, 7, 'front', 6);
  const shedHall = shed.hall(3, { width: 3, wall: 'brick' });
  flat(g, shedHall, 1, { look: 'flat' });
  const store = shed.room(5, 5, { wall: 'brick', floor: 'concrete' });
  g.demo(...store.tile(3, 0));
  g.pick(...store.tile(1, -1), 10).pick(...store.tile(1, 1), 10);
  d.hall(5, { wall: 'brick', floor: 'plate' });
  d.turn('+z', { wall: 'corrugated', floor: 'plate' });

  // The foundry: the anvils coming down on the beat, the furnaces breathing between them, a conveyor running with the way.
  const foundry = d.hall(14, { wall: 'corrugated', floor: 'plate', width: 5 });
  g.drop(...across(foundry, 4, { beats: 4 }));
  g.pick(...foundry.tile(5, 0), 5).pick(...foundry.tile(5, 1), 5).pick(...foundry.tile(5, -1), 5);
  g.drop(...across(foundry, 9, { beats: 4, offset: 0.5 }));
  g.pick(...foundry.tile(10, 0), 10);
  g.foe('roadie', ...foundry.tile(7, 1), { range: 3 });
  // Past the second anvil, the first whetstone: for whatever the anvils took off the spikes.
  g.whetstone(...foundry.tile(12, 0));
  sign(foundry, 7, 'MIND THE HOT METAL', SMOKE[2], 0.4, 1.7);
  d.turn('+x', { wall: 'corrugated', floor: 'plate' });
  const furnaces = d.hall(10, { wall: 'corrugated', floor: 'grate', width: 3 });
  g.pyro(...across(furnaces, 3, { beats: 4 }));
  g.pick(...furnaces.tile(4, 0), 5);
  g.pyro(...across(furnaces, 7, { beats: 4, offset: 0.5 }));
  g.pick(...furnaces.tile(8, 0), 10);
  d.turn('-z', { wall: 'brick', floor: 'plate' });
  d.hall(3, { wall: 'brick', floor: 'plate' });

  // The works gate: the security barrier, shut, until somebody has a pass.
  const gate = d.hall(6, { wall: 'brick', floor: 'cobble' });
  barred(g, gate, 3);
  g.foe('gatekeeper', ...gate.tile(1, 1), { range: 3 });
  g.pick(...gate.tile(1, 0), 5);
  sign(gate, 5, 'STAFF ONLY', '#ff4a3a', 0.4, 1.7);
  d.turn('+x', { wall: 'brick', floor: 'cobble' });
  d.ramp(6, 3, { wall: 'brick', floor: 'cobble' });

  // The pub: a bar, a jukebox, tables full of regulars with views on everything, a folkie in the corner and a lighter for the way home.
  const pub = d.room(15, 11, { wall: 'wallpaper', floor: 'planks' });
  g.block(...pub.rect(2, 8, pub.back * 5, 1), 1.0, { prop: 'bar' });
  g.pillar(...pub.tile(11, -4), 1.2, { prop: 'jukebox' });
  g.pillar(...pub.tile(7, 2), 0.8, { prop: 'table' });
  g.foe('drunk', ...pub.tile(5, 2), { range: 5 }).foe('drunk', ...pub.tile(9, -1), { range: 5 });
  g.foe('folkie', ...pub.tile(12, 2), { range: 4 });
  g.foe('critic', ...pub.tile(10, 3), { range: 4 });
  g.foe('bobby', ...pub.tile(7, -3), { range: 5, path: [pub.tile(3, -3), pub.tile(11, -3)] });
  g.sticky(...pub.rect(4, 3, 1, 3));
  g.pick(...pub.tile(2, 1), 10).pick(...pub.tile(8, 4), 10).pick(...pub.tile(13, -2), 5);
  g.lighter(...pub.tile(13, 4));
  g.whetstone(...pub.tile(1, -4));
  sign(pub, 6, 'LAST ORDERS', SMOKE[1], 0.5, 1.8);
  g.light('par', ...wallTile(pub, 8), { colors: ['#ffb060', '#ff7a3a'], program: 'static', every: 4, glow: 0.7, reach: 8, aim: toBack(pub).map((v) => -4 * v), height: 1.6 });
  // The cellar, off the pub, behind the plasterboard: the last demo, among the barrels.
  const cellar = branch(d, pub, 9, 'front', 6);
  const cellarHall = cellar.hall(7, { wall: 'brick' });
  flat(g, cellarHall, 6, { breakAt: 6.5, look: 'drywall' });
  const barrels = cellar.room(5, 5, { wall: 'brick', floor: 'concrete' });
  g.demo(...barrels.tile(3, 0));
  g.vinyl(...barrels.tile(1, -1), 70).whetstone(...barrels.tile(1, 1));
  // One more, out along a plank on the roof of the outhouse.
  const roof = branch(d, pub, 12, 'back', 6);
  roof.hall(2, { wall: 'brick' });
  const plank = roof.bridge(7, { floor: 'planks' });
  g.foe('pigeon', ...plank.tile(3, 0), { path: [plank.tile(1, 0), plank.tile(5, 0)] });
  const slates = roof.room(5, 5, { wall: 'brick', floor: 'planks' });
  g.demo(...slates.tile(2, 0));

  // Up the stairs to the back room: the band's amps, the drum kit, a sound man and the man on the door.
  d.hall(4, { wall: 'wallpaper', floor: 'planks' });
  d.stairs(5, 2.5, { wall: 'wallpaper', floor: 'planks' });
  const room = d.room(12, 9, { wall: 'posters', floor: 'planks' });
  g.pillar(...backTile(room, 3), 1.2, { prop: 'amp' });
  g.pillar(...backTile(room, 8), 1.2, { prop: 'amp' });
  g.foe('soundguy', ...room.tile(4, -2), { range: 5 }).foe('bouncer', ...room.tile(8, 2), { range: 4 });
  g.pick(...room.tile(6, 0), 10);
  sign(room, 4.5, 'TONIGHT', SMOKE[2], 0.55, 1.8);
  d.hall(3, { wall: 'posters' });
  d.stairs(3, 1.5, { wall: 'posters' });
  d.hall(2, { wall: 'posters' });
  d.exit(3);
  return g;
}
