import { digger } from '../dig.js';
import { Venue } from '../venue.js';
import { across, backTile, barred, branch, flat, wallTile, wash } from './helpers.js';

/**
 * Track 9: Berlin, 1995. Industrial: a power station that nobody has
 * switched off, with a club in the cellar of it. A yard; an assembly line
 * where the hydraulic presses come down on the beat, the welders do not
 * look up and a conveyor belt is going the way it is going; a cooling
 * pond crossed on a flatcar; a tiled tunnel with the engineers in it; a queue
 * that has been there since Thursday, outside a door with a policy. The
 * policy is no. The policy has been no since 1989. The club is a concrete
 * room the size of a hangar with a strobe in it, and it is, by the
 * standards of the rest of this record, quite warm.
 */

export const BERLIN = {
  tiles: ['#5a6068', '#484e56', '#c8a020', '#6a7078'],
  walls: ['#6a7078', '#585e66', '#7a6a5a', '#4a5058'],
  ambient: [0.85, 0.9, 1.0], lamp: '#ffe8a0', trap: '#0a0c10', lift: '#c8a020', exit: '#a8ff3a', sticky: '#3a3a2a', vary: 0.06,
};

/** A Berlin cellar at four in the morning: acid green, magenta, cyan, the amber of a work lamp. */
const NEON = ['#a8ff3a', '#ff3a8a', '#3ad8ff', '#ffc83a'];

export function berlin() {
  const g = new Venue({
    name: 'Berlin', act: 9, cols: 150, rows: 130, palette: BERLIN, tempo: 136,
    intro: 'A power station that nobody has switched off, and a club in the cellar. The door policy is no.',
    look: {
      place: 'Berlin', year: 1995, genre: 'Industrial', poster: '#2a3a2a', grade: 'industrial', voice: 'industrial', theme: 'powerplant',
      floor: 'plate', wall: 'corrugated', lamp: 'bulb', crusher: 'piston', lift: 'flatcar', pyro: 'sparks', gate: 'velvet',
      hemi: ['#a0b0c8', '#0c1014', 0.9], key: '#e0e8ff', keyK: 0.85, lantern: '#ffe0a0',
      skyColors: ['#06080c', '#0e1218', '#1a2028', '#2a3038', '#4a4838'], stars: false, skyline: '#05070a', horizon: 'powerplant', glow: '#ffa040',
      reflect: NEON, ceiling: '#101418',
      rig: { colors: NEON.slice(0, 2), program: 'static', every: 4 },
    },
  });
  const sign = (p, along, text, color = NEON[3], size = 0.5, height = 1.6) => g.light('neon', ...wallTile(p, along), { text, color, height, size });
  const lamppost = (p, along) => g.light('streetlamp', ...wallTile(p, along), { height: 2.4 });
  const STEEL = { floor: 'plate', wall: 'corrugated' };
  const TILE = { floor: 'checker', wall: 'block' };

  // The yard: a gate with no guard, oil drums, a gear on a post that is supposed to be turning, and the sound of something very large a long way down.
  g.room(2, 14, 9, 9, 50, { lamps: 2, floor: 'plate', wall: 'corrugated' });
  g.pillar(3, 15, 1.1, { prop: 'oildrums' });
  g.pillar(4, 15, 1.1, { prop: 'oildrums' });
  g.bumper(8, 16, { radius: 0.4, look: 'gear' });
  g.bumper(5, 21, { radius: 0.4, look: 'firebarrel' });
  g.start = { x: 6, z: 19 };
  const d = digger(g, { x: 11, z: 18, h: 50, heading: '+x' });

  // The assembly line: robots at their stations, welders who do not look up, the presses coming down on the beat, the sparks, and a conveyor belt that is going the way it is going.
  const line = d.hall(22, { width: 5, ...STEEL });
  for (const a of [1, 2, 3]) g.pick(...line.tile(a, 0), 5);
  g.foe('robot', ...line.tile(5, 1), { range: 4 }).foe('welder', ...line.tile(9, -1), { range: 4 });
  g.drop(...across(line, 7, { beats: 4, offset: 0.5 }));
  g.pick(...line.tile(8, 0), 5).pick(...line.tile(8, 1), 5);
  g.drop(...across(line, 12, { beats: 4 }));
  g.pyro(...across(line, 16, { beats: 4 }));
  g.foe('engineer', ...line.tile(14, 1), { range: 4 });
  g.pick(...line.tile(13, 0), 10).pick(...line.tile(18, 0), 10);
  g.belt(...line.rect(18, 3, line.lo + 1, 3), '+x');
  g.whetstone(...line.tile(21, 1));
  g.bumper(...line.tile(10, 2), { radius: 0.4, look: 'gear' });
  lamppost(line, 3);
  sign(line, 9.5, 'SHIFT CHANGE', NEON[3], 0.36, 1.7);
  // The tool shed, off the front of the line, behind a sheet of plasterboard: the first demo tape. Run at it.
  const shed = branch(d, line, 4, 'front', 3);
  const racks = shed.hall(7, { width: 3, wall: 'corrugated' });
  flat(g, racks, 6, { look: 'drywall', breakAt: 6.5 });
  const store = shed.room(5, 5, { wall: 'corrugated', floor: 'concrete' });
  g.demo(...store.tile(3, 0));
  g.vinyl(...store.tile(1, -1), 50).pick(...store.tile(1, 1), 10);
  // The control room, off the back of the line: the pass, and the engineer who is checking it.
  const control = branch(d, line, 14, 'back', 3);
  control.hall(3, { wall: 'block' });
  const desk = control.room(6, 7, { wall: 'block', floor: 'concrete' });
  g.pass(...desk.tile(3, 0));
  g.pillar(...desk.tile(5, 3), 1.1, { prop: 'oildrums' });
  g.foe('engineer', ...desk.tile(2, 2), { range: 4 });
  g.pick(...desk.tile(4, -2), 10);
  d.turn('+z', STEEL);
  d.hall(3, STEEL);

  // The cooling pond: black water under the pipes, a flatcar that goes across it at the pace of one.
  const quay = d.hall(8, { width: 3, ...STEEL });
  g.foe('welder', ...quay.tile(4, 0), { range: 3 });
  g.pick(...quay.tile(1, 0), 5).pick(...quay.tile(6, 1), 5);
  lamppost(quay, 2);
  d.ferry(15, { size: 3, period: 9 });
  const bank = d.hall(9, { width: 5, ...STEEL });
  g.pick(...bank.tile(2, 0), 5).pick(...bank.tile(6, 1), 10);
  g.foe('robot', ...bank.tile(5, -1), { range: 3 });
  g.lighter(...bank.tile(7, -1));
  g.whetstone(...bank.tile(8, 1));
  // A plank out across the pond to the pump house: the second demo tape.
  const pump = branch(d, bank, 4, 'front', 3);
  pump.hall(2, { wall: 'corrugated' });
  pump.bridge(7, { floor: 'plate' });
  const house = pump.room(5, 5, { wall: 'corrugated', floor: 'concrete' });
  g.demo(...house.tile(2, 0));
  d.turn('+x', STEEL);
  d.hall(3, STEEL);

  // The tunnel: white tile and a yellow stripe, a press that has been left on, the engineers with their torches.
  const tunnel = d.hall(15, { width: 5, ...TILE });
  g.drop(...across(tunnel, 5, { beats: 4 }));
  g.pick(...tunnel.tile(1, 0), 5).pick(...tunnel.tile(3, 1), 5).pick(...tunnel.tile(7, 0), 10).pick(...tunnel.tile(12, 1), 5).pick(...tunnel.tile(13, 0), 10);
  g.pyro(...across(tunnel, 10, { beats: 4, offset: 0.5 }));
  g.foe('engineer', ...tunnel.tile(3, -1), { range: 4 }).foe('welder', ...tunnel.tile(8, 1), { range: 4 });
  g.whetstone(...tunnel.tile(14, -1));
  lamppost(tunnel, 2);
  sign(tunnel, 3, 'ACHTUNG', NEON[1], 0.45, 1.7);
  d.hall(3, TILE);

  // The queue: down the side of a brick wall, in black, since Thursday; a door at the end of it with a velvet rope and a policy.
  const queue = d.hall(12, { width: 5, floor: 'asphalt', wall: 'brick' });
  for (const a of [2, 4, 6]) g.foe('clubber', ...queue.tile(a, a % 4 === 0 ? 1 : -1), { range: 3 });
  g.foe('raver', ...queue.tile(8, 0), { range: 4 });
  g.pick(...queue.tile(1, 0), 5).pick(...queue.tile(3, 1), 5).pick(...queue.tile(5, 0), 10).pick(...queue.tile(7, -1), 5);
  barred(g, queue, 10, 'velvet');
  sign(queue, 8, 'DOOR POLICY: NO', NEON[0], 0.45, 1.7);
  d.hall(2, { floor: 'concrete', wall: 'block' });

  // The club: concrete, a strobe, a wall of speakers, the floor full of people who have not stopped.
  const club = d.room(22, 17, { floor: 'panels', wall: 'block' });
  g.pillar(...backTile(club, 4), 1.2, { prop: 'speaker' });
  g.pillar(...backTile(club, 18), 1.2, { prop: 'speaker' });
  for (const [a, b] of [[7, -6], [7, 6], [14, -6], [14, 6]]) g.pillar(...club.tile(a, b), 1.0, { prop: 'speaker' });
  g.foe('raver', ...club.tile(8, 0), { range: 5 }).foe('raver', ...club.tile(13, 3), { range: 5 }).foe('clubber', ...club.tile(11, -3), { range: 5 });
  g.foe('welder', ...club.tile(18, 0), { range: 4 });
  g.pick(...club.tile(2, 0), 10).pick(...club.tile(6, -3), 10).pick(...club.tile(6, 3), 10).pick(...club.tile(10, 5), 10).pick(...club.tile(15, -5), 10).pick(...club.tile(19, 3), 10);
  g.whetstone(...club.tile(2, -7)).whetstone(...club.tile(2, 7));
  wash(g, club, [NEON[0], NEON[1], NEON[2]], { cans: 4, program: 'chase', every: 2, strobe: true });
  sign(club, 11, 'NO PHOTOS', NEON[2], 0.45, 1.9);
  // The cloakroom, off the front of the floor, behind a plasterboard panel: the last demo tape.
  const cloak = branch(d, club, 12, 'front', 9);
  const coats = cloak.hall(7, { width: 3, wall: 'block' });
  flat(g, coats, 6, { look: 'drywall', breakAt: 6.5 });
  const rail = cloak.room(5, 5, { wall: 'block', floor: 'concrete' });
  g.demo(...rail.tile(3, 0));
  g.vinyl(...rail.tile(1, 1), 70);
  d.hall(2, { wall: 'block' });
  const stage = d.room(8, 9, { wall: 'block', floor: 'plate' });
  g.block(...stage.rect(2, 2, stage.back * 3, 2), 1.3, { prop: 'amp' });
  g.block(...stage.rect(5, 2, stage.back * 3, 2), 1.3, { prop: 'speaker' });
  g.foe('soundguy', ...stage.tile(3, 0), { range: 3 });
  g.pick(...stage.tile(1, 0), 10);
  d.hall(3, { wall: 'block' });
  d.exit(3);
  return g;
}
