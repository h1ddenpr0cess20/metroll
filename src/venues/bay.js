import { digger } from '../dig.js';
import { Venue } from '../venue.js';
import { across, backTile, barred, branch, flat, frontHeading, loop, toBack, wallTile, wash } from './helpers.js';

/**
 * Track 3: the Bay Area, 1986. Thrash: everything is faster, and then it
 * gets faster. Off the tour van on an Oakland street, past the skaters and
 * the tape traders (every one a copy of a copy), down into the concrete
 * bowl of a skate park, along the corridor of the warehouse, where the
 * double-bass drums come down on the beat, and into the pit: the crowd
 * surging first one way and then the other, the surfers going over. The pass
 * is on the tour bus. The way to the stage is across the room on the hands of
 * the crowd.
 */

export const BAY = {
  tiles: ['#4a4e56', '#3a3e46', '#2a4a8a', '#686c76'],
  walls: ['#4a5a78', '#3a4a68', '#6a3a2a', '#5a6a88'],
  ambient: [0.8, 0.84, 1.0], lamp: '#ffcf80', trap: '#1a1e28', lift: '#ffd23a', exit: '#ff3a2a', sticky: '#3a4a2a', vary: 0.08,
};

/** An Oakland night in the fog: a sodium lamp, the blue of the bridge, high-top white, a red tail-light. */
const FOG = ['#ff7a2a', '#2ad0ff', '#f4f2ee', '#e8302a'];

export function bay() {
  const g = new Venue({
    name: 'The Bay Area', act: 3, cols: 130, rows: 130, palette: BAY, tempo: 168,
    intro: 'Faster. Everything. Faster. Including you, apparently.',
    look: {
      place: 'The Bay Area', year: 1986, genre: 'Thrash', poster: '#2a4a8a', grade: 'denim', voice: 'thrash', theme: 'bay',
      floor: 'concrete', wall: 'brick', lamp: 'bulb', crusher: 'kick', lift: 'crowd', gate: 'bars',
      hemi: ['#8aa0c8', '#141a24', 0.9], key: '#c8d8ff', keyK: 0.9, lantern: '#ffe0b0',
      skyColors: ['#06080e', '#0c1220', '#162a40', '#264660', '#4a7090'], stars: false, skyline: '#080c14', horizon: 'bay', glow: '#ffb060',
      reflect: FOG, ceiling: '#1a2230',
      rig: { colors: FOG.slice(0, 2), program: 'static', every: 4 },
    },
  });
  const sign = (p, along, text, color = FOG[0], size = 0.55, height = 1.6) => g.light('neon', ...wallTile(p, along), { text, color, height, size });
  const lamppost = (p, along) => g.light('streetlamp', ...wallTile(p, along), { height: 2.4 });

  // The street the van is parked on.
  g.room(2, 4, 7, 7, 40, { lamps: 3, floor: 'asphalt', wall: 'brick' });
  g.block(3, 5, 3, 2, 0.9, { prop: 'van' });
  g.start = { x: 5, z: 9 };
  const d = digger(g, { x: 9, z: 7, h: 40, heading: '+x' });

  // The street: moshers on the corner, a skater or two, a tape trader with a shoebox, tyres to bounce off, a boombox on a crate.
  const street = d.hall(15, { width: 5, wall: 'brick', floor: 'asphalt' });
  for (const a of [1, 2, 3]) g.pick(...street.tile(a, 0), 5);
  g.pick(...street.tile(8, 1), 5).pick(...street.tile(12, -1), 10);
  g.foe('mosher', ...street.tile(5, 1), { range: 4 }).foe('skater', ...street.tile(9, 0), { range: 6 });
  g.foe('tapetrader', ...street.tile(12, 1), { range: 4 });
  g.bumper(...street.tile(6, -1), { radius: 0.4, look: 'tyres' });
  g.bumper(...street.tile(11, 1), { radius: 0.4, look: 'tyres' });
  g.pillar(...backTile(street, 9), 0.6, { prop: 'boombox' });
  lamppost(street, 3);
  sign(street, 7, 'ALL AGES', FOG[0], 0.5, 1.7);
  // Off the front of it, behind a hoarding (the record shop is boarded up): the first demo tape. Run at it.
  const shop = branch(d, street, 3, 'front', 3);
  const shopHall = shop.hall(3, { width: 3, wall: 'brick' });
  flat(g, shopHall, 1, { look: 'flat' });
  const store = shop.room(5, 5, { wall: 'brick', floor: 'concrete' });
  g.demo(...store.tile(3, 0));
  g.vinyl(...store.tile(1, -1), 50).pick(...store.tile(1, 1), 10);
  d.turn('+z', { wall: 'brick', floor: 'asphalt' });
  d.hall(2, { wall: 'brick', floor: 'asphalt' });

  // The skate park: a concrete bowl, the skaters in it, a pipe off the side with the second demo tape at the end of it.
  const park = d.room(17, 15, { wall: 'block', floor: 'concrete' });
  g.bowl(...park.rect(3, 11, -3, 7), d.h, 0.9, { tex: 'concrete' });
  g.foe('skater', ...park.tile(7, -1), { range: 4 }).foe('skater', ...park.tile(10, 2), { range: 4 }).foe('mosher', ...park.tile(14, -3), { range: 4 });
  g.pick(...park.tile(2, 0), 10).pick(...park.tile(6, 0), 5).pick(...park.tile(9, 0), 5).pick(...park.tile(12, 1), 10).pick(...park.tile(15, 5), 5);
  g.bumper(...park.tile(4, 5), { radius: 0.4, look: 'tyres' });
  g.pillar(...backTile(park, 13), 0.6, { prop: 'boombox' });
  lamppost(park, 4);
  sign(park, 8, 'NO SKATING', FOG[3], 0.5, 1.7);
  const pipe = branch(d, park, 3, 'front', 8);
  const pipeHall = pipe.hall(6, { width: 3, wall: 'block' });
  flat(g, pipeHall, 4, { look: 'drywall', breakAt: 6.5 });
  const nook = pipe.room(5, 5, { wall: 'block', floor: 'concrete' });
  g.demo(...nook.tile(3, 0));
  g.whetstone(...nook.tile(1, -1)).vinyl(...nook.tile(1, 1), 60);
  d.hall(3, { wall: 'block', floor: 'concrete' });
  d.turn('+x', { wall: 'brick', floor: 'asphalt' });
  d.hall(5, { wall: 'brick', floor: 'asphalt' });

  // The warehouse corridor: the bass drums coming down on the beat, double kicks, one after another, and the first whetstone behind them.
  const corridor = d.hall(15, { width: 5, wall: 'corrugated', floor: 'concrete' });
  g.drop(...across(corridor, 4, { beats: 8 }));
  g.pick(...corridor.tile(5, 0), 5).pick(...corridor.tile(5, 1), 5).pick(...corridor.tile(5, -1), 5);
  g.drop(...across(corridor, 10, { beats: 8, offset: 0.5 }));
  g.pick(...corridor.tile(11, 0), 10);
  g.foe('mosher', ...corridor.tile(7, 1), { range: 3 });
  g.whetstone(...corridor.tile(13, 0));
  sign(corridor, 7, 'LOUD', FOG[3], 0.5, 1.7);
  // The tour bus, off the side: the pass is on the dashboard.
  const bus = branch(d, corridor, 12, 'back', 3);
  bus.hall(3, { wall: 'block' });
  const lounge = bus.room(6, 7, { wall: 'block', floor: 'carpet' });
  g.pass(...lounge.tile(3, 0));
  g.foe('roadie', ...lounge.tile(2, 2), { range: 4 });
  g.pick(...lounge.tile(4, -2), 10).pick(...lounge.tile(4, 2), 10);
  d.turn('+z', { wall: 'corrugated', floor: 'concrete' });
  d.hall(3, { wall: 'corrugated', floor: 'concrete' });

  // The pit: the crowd surging out to one side and then the other, the surfers going over.
  const pit = d.hall(20, { width: 9, wall: 'block', floor: 'concrete' });
  const toward = frontHeading(pit);
  g.belt(...pit.rect(4, 3, pit.lo, 9), toward);
  g.belt(...pit.rect(12, 3, pit.lo, 9), toward);
  g.foe('mosher', ...pit.tile(6, -2), { range: 6 }).foe('mosher', ...pit.tile(10, 2), { range: 6 }).foe('skater', ...pit.tile(15, 0), { range: 5 });
  g.foe('crowdsurfer', ...pit.tile(9, 0), { path: [pit.tile(3, -2), pit.tile(17, -2), pit.tile(17, 2), pit.tile(3, 2)] });
  g.pick(...pit.tile(2, 0), 10).pick(...pit.tile(8, 3), 5).pick(...pit.tile(8, -3), 5).pick(...pit.tile(17, -3), 10).pick(...pit.tile(17, 3), 10);
  g.lighter(...pit.tile(18, 0));
  wash(g, pit, [FOG[0], FOG[1]], { cans: 3, program: 'chase', every: 2 });
  sign(pit, 10, 'WALL OF NOISE', FOG[0], 0.5, 1.8);
  // The back door of the pit, behind plasterboard: the third demo tape.
  const store2 = branch(d, pit, 14, 'back', 5);
  const room2 = store2.hall(5, { width: 3, wall: 'block' });
  flat(g, room2, 3, { look: 'drywall', breakAt: 6.5 });
  const loft = store2.room(5, 5, { wall: 'block', floor: 'planks' });
  g.demo(...loft.tile(3, 0));
  g.vinyl(...loft.tile(1, 1), 70);
  d.turn('+x', { wall: 'block', floor: 'concrete' });
  d.hall(3, { wall: 'block', floor: 'concrete' });

  // The gate to the stage: iron bars, and nobody through them without a pass.
  const gate = d.hall(8, { width: 3, wall: 'block', floor: 'concrete' });
  barred(g, gate, 3, 'bars');
  g.pick(...gate.tile(1, 0), 5);
  sign(gate, 6, 'BACKSTAGE', '#ff4a3a', 0.4, 1.7);

  // The room: the crowd's hands across the floor in front of the stage, and then the stage.
  d.hall(1, { width: 13, floor: 'planks', wall: 'block' });
  const floor = d.ferry(11, { size: 3, period: 8 });
  g.zap(...floor.rect(0, 11, floor.lo - 2, 7), d.h - 1.6, { fill: true });
  g.light('strobe', ...floor.tile(5, -3), { colors: ['#ffffff'], reach: 9, height: 2.8 });
  d.hall(2, { floor: 'planks', wall: 'block' });
  d.turn('+x', { floor: 'planks', wall: 'block' });
  d.hall(3, { floor: 'planks', wall: 'block' });
  const stage = d.room(15, 11, { floor: 'planks', wall: 'posters' });
  g.block(...stage.rect(2, 3, stage.back * 4, 2), 1.4, { prop: 'amp' });
  g.block(...stage.rect(9, 3, stage.back * 4, 2), 1.4, { prop: 'speaker' });
  g.block(...stage.rect(5, 5, -stage.back * 5, 1), 1.0, { prop: 'barrier', sturdy: true });
  g.foe('soundguy', ...stage.tile(4, -2), { range: 4 }).foe('roadie', ...stage.tile(8, 2), { range: 4 }).foe('bouncer', ...stage.tile(12, 0), { range: 3 });
  g.pick(...stage.tile(2, 0), 10).pick(...stage.tile(6, -3), 10).pick(...stage.tile(10, 3), 10);
  g.whetstone(...stage.tile(2, -2));
  wash(g, stage, [FOG[0], FOG[3]], { cans: 2, program: 'chase' });
  sign(stage, 7, 'THRASH TILL DEATH', FOG[3], 0.5, 1.8);
  d.hall(3, { floor: 'planks', wall: 'posters' });
  d.exit(3);
  void loop; void toBack;
  return g;
}
