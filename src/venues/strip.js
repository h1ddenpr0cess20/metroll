import { digger } from '../dig.js';
import { Venue } from '../venue.js';
import { across, backTile, barred, branch, flat, loop, wallTile, wash } from './helpers.js';

/**
 * Track 2: the Sunset Strip, 1986. Hair metal: everything is bigger, pinker,
 * louder and flammable. Out of the limousine in the car park, along a
 * sidewalk of clubs under their neon (rollerbladers, motorbikes, a man from
 * a record label on a phone the size of a brick), down the alley behind
 * them, where the dressing-room cans of hairspray come down on the beat; the
 * hotel pool and its hot tub; a washed-out hill road, and a pink limousine
 * going back and forth across the gap; and the club itself: the velvet rope
 * (the pass is in the dressing room), the dance floor, the fireworks and the
 * stage door, and the lighters, held up, for the power ballad. A key change
 * in the music, and one in the venue.
 */

export const STRIP = {
  tiles: ['#3a3440', '#2c2834', '#c8206a', '#5a4a66'],
  walls: ['#8a3a6a', '#6a2a52', '#2a6a8a', '#a04a7a'],
  ambient: [0.9, 0.8, 1.0], lamp: '#ff8ad8', trap: '#201830', lift: '#ff3a9a', exit: '#ffd23a', sticky: '#3a2a4a', vary: 0.06,
};

/** The Strip at night: hot pink, cyan, a yellow marquee, the purple of the sky. */
const NEON = ['#ff2d95', '#2ad0ff', '#ffd23a', '#8a4be8'];

export function strip() {
  const g = new Venue({
    name: 'The Sunset Strip', act: 2, cols: 120, rows: 120, palette: STRIP, tempo: 126,
    intro: 'Everything here is flammable, including the hair. Mostly the hair.',
    look: {
      place: 'Sunset Strip', year: 1986, genre: 'Hair metal', poster: '#e8208a', grade: 'neon', voice: 'glam', theme: 'strip',
      floor: 'asphalt', wall: 'stucco', lamp: 'bulb', crusher: 'spraycan', lift: 'limo', pyro: 'fireworks', gate: 'velvet',
      hemi: ['#d890f0', '#201028', 0.9], key: '#ffd8f0', keyK: 0.85, lantern: '#ffc8f0',
      skyColors: ['#0a0418', '#2a0a4a', '#6a1a7a', '#c8306a', '#ff8a5a'], stars: true, skyline: '#12060e', horizon: 'strip', glow: '#ff3a9a',
      reflect: NEON, ceiling: '#1a0a28',
      rig: { colors: NEON.slice(0, 2), program: 'chase', every: 2 },
    },
  });
  const sign = (p, along, text, color = NEON[0], size = 0.55, height = 1.6) => g.light('neon', ...wallTile(p, along), { text, color, height, size });
  const marquee = (p, along, text) => g.light('marquee', ...wallTile(p, along), { text, color: NEON[2], height: 1.7, size: 0.5 });

  // The car park, and the limousine they came in.
  g.room(2, 4, 7, 7, 40, { lamps: 3, floor: 'asphalt', wall: 'stucco' });
  g.block(3, 5, 4, 2, 0.7, { prop: 'limo' });
  g.start = { x: 5, z: 9 };
  const d = digger(g, { x: 9, z: 7, h: 40, heading: '+x' });

  // The sidewalk: a row of clubs under their neon, bikes at the kerb, rollerblades, a man on a car phone.
  const walk = d.hall(16, { width: 5, wall: 'stucco', floor: 'asphalt' });
  for (const a of [1, 2, 3]) g.pick(...walk.tile(a, 0), 5);
  g.pick(...walk.tile(7, 1), 5).pick(...walk.tile(10, -1), 10).pick(...walk.tile(13, 1), 5);
  g.block(...walk.rect(4, 2, walk.back * 2, 1), 0.7, { prop: 'motorbike' });
  g.block(...walk.rect(9, 2, walk.back * 2, 1), 0.7, { prop: 'motorbike' });
  g.foe('poser', ...walk.tile(5, 1), { range: 4 }).foe('blader', ...walk.tile(9, 0), { range: 6 });
  g.foe('promoter', ...walk.tile(12, 1), { range: 5 });
  g.bumper(...walk.tile(6, -1), { radius: 0.4, look: 'palm' });
  g.bumper(...walk.tile(13, -1), { radius: 0.4, look: 'palm' });
  g.light('streetlamp', ...wallTile(walk, 3), { height: 2.4 });
  sign(walk, 5, 'CLUB GLITZ', NEON[0], 0.55, 1.7);
  sign(walk, 11, 'LEOPARD ROOM', NEON[1], 0.5, 1.7);
  // Off the front of it, behind a hoarding (the record shop is shut for the film crew): the first demo tape. Run at it.
  const shop = branch(d, walk, 8, 'front', 3);
  const shopHall = shop.hall(3, { width: 3, wall: 'stucco' });
  flat(g, shopHall, 1, { look: 'flat' });
  const store = shop.room(5, 5, { wall: 'stucco', floor: 'checker' });
  g.demo(...store.tile(3, 0));
  g.vinyl(...store.tile(1, -1), 60).pick(...store.tile(1, 1), 10);
  d.turn('+z', { wall: 'stucco', floor: 'asphalt' });
  d.hall(3, { wall: 'stucco', floor: 'asphalt' });

  // The alley behind the clubs: hairspray, a wall of it, coming down on the beat, and the can of it that dented everyone.
  const alley = d.hall(14, { width: 3, wall: 'block', floor: 'concrete' });
  g.drop(...across(alley, 4, { beats: 4 }));
  g.pick(...alley.tile(5, 0), 5).pick(...alley.tile(5, 1), 5).pick(...alley.tile(5, -1), 5);
  g.drop(...across(alley, 9, { beats: 4, offset: 0.5 }));
  g.pick(...alley.tile(10, 0), 10);
  g.foe('merchguy', ...alley.tile(7, 1), { range: 3 });
  // Past the second can, the first whetstone, for what the cans took off the spikes.
  g.whetstone(...alley.tile(12, 0));
  sign(alley, 7, 'STAGE DOOR ONLY', NEON[2], 0.4, 1.6);
  // The dressing room, off the side of the alley: mirrors, bulbs, and the pass, left on a chair.
  const dress = branch(d, alley, 5, 'front', 2);
  dress.hall(3, { wall: 'wallpaper' });
  const room = dress.room(6, 7, { wall: 'wallpaper', floor: 'carpet' });
  g.pass(...room.tile(3, 0));
  g.foe('frontman', ...room.tile(2, 2), { range: 4 });
  g.pick(...room.tile(4, -2), 10).pick(...room.tile(4, 2), 10);
  d.turn('+x', { wall: 'block', floor: 'concrete' });
  d.hall(3, { wall: 'block', floor: 'concrete' });

  // The hotel courtyard: a hot tub steaming, palms in tubs, loungers, a shredder on the roof of the pool house, fireworks on the beat.
  const court = d.room(17, 13, { wall: 'stucco', floor: 'marble' });
  g.block(...court.rect(3, 2, court.back * 5, 2), 0.7, { prop: 'hottub' });
  g.block(...court.rect(12, 2, court.back * 5, 2), 0.7, { prop: 'hottub' });
  for (const [a, b] of [[5, 3], [10, 3], [8, -3], [14, -2]]) g.bumper(...court.tile(a, b), { radius: 0.4, look: 'palm' });
  g.pyro(...court.tile(7, 0), { beats: 4 });
  g.pyro(...court.tile(7, 2), { beats: 4 });
  g.pyro(...court.tile(11, 0), { beats: 4, offset: 0.5 });
  g.foe('shredder', ...court.tile(6, -2), { range: 5 }).foe('frontman', ...court.tile(10, 3), { range: 5 });
  g.foe('blader', ...court.tile(8, 0), { path: loop(court, 2) });
  g.foe('limodriver', ...court.tile(14, 2), { range: 4 });
  g.pick(...court.tile(2, 2), 10).pick(...court.tile(9, -3), 10).pick(...court.tile(15, -3), 10).pick(...court.tile(14, 4), 5);
  g.vinyl(...court.tile(15, 4), 60);
  g.lighter(...court.tile(2, -4));
  wash(g, court, [NEON[0], NEON[1]], { cans: 3, program: 'chase' });
  sign(court, 8, 'POOL', NEON[1], 0.5, 1.8);
  // The pool house, behind its sugar-glass wall: the second demo tape.
  const poolhouse = branch(d, court, 9, 'front', 7);
  const phHall = poolhouse.hall(3, { width: 3, wall: 'stucco' });
  flat(g, phHall, 1, { look: 'glass', breakAt: 6 });
  const lounge = poolhouse.room(5, 5, { wall: 'stucco', floor: 'carpet' });
  g.demo(...lounge.tile(3, 0));
  g.whetstone(...lounge.tile(1, -1)).pick(...lounge.tile(1, 1), 10);
  d.hall(3, { wall: 'stucco', floor: 'asphalt' });
  d.turn('+z', { wall: 'stucco', floor: 'asphalt' });

  // The hill road: washed out, with a gap that a pink limousine drives across and back, and a lookout on a plank for the third demo.
  const road = d.hall(7, { width: 3, wall: 'stucco', floor: 'asphalt' });
  g.foe('poser', ...road.tile(3, 0), { range: 3 });
  g.pick(...road.tile(1, 0), 5).pick(...road.tile(5, 1), 10);
  d.ferry(15, { size: 3, period: 9 });
  const verge = d.hall(7, { width: 3, wall: 'stucco', floor: 'asphalt' });
  g.pick(...verge.tile(1, 0), 5).pick(...verge.tile(5, 0), 5);
  g.foe('promoter', ...verge.tile(4, 1), { range: 3 });
  const look = branch(d, verge, 3, 'front', 2);
  look.hall(2, { wall: 'stucco' });
  const plank = look.bridge(7, { floor: 'planks' });
  g.foe('blader', ...plank.tile(3, 0), { path: [plank.tile(1, 0), plank.tile(5, 0)] });
  const view = look.room(5, 5, { wall: 'stucco', floor: 'planks' });
  g.demo(...view.tile(2, 0));
  d.hall(3, { wall: 'stucco', floor: 'asphalt' });
  d.turn('+x', { wall: 'stucco', floor: 'asphalt' });
  d.ramp(6, 3, { wall: 'stucco', floor: 'asphalt' });

  // The club door: the velvet rope, and the man who has the list.
  const door = d.hall(7, { width: 3, wall: 'stucco', floor: 'asphalt' });
  barred(g, door, 3);
  g.foe('bouncer', ...door.tile(1, 1), { range: 3 });
  g.pick(...door.tile(5, 0), 5);
  marquee(door, 5, 'LIVE TONIGHT');
  d.hall(2, { wall: 'stucco', floor: 'carpet' });

  // The club: a dance floor in squares, the strobes, a hundred people with their hair up, the stage at the back of it.
  const club = d.room(17, 13, { wall: 'posters', floor: 'checker' });
  g.pillar(...backTile(club, 3), 1.2, { prop: 'amp' });
  g.pillar(...backTile(club, 14), 1.2, { prop: 'speaker' });
  g.foe('frontman', ...club.tile(6, -2), { range: 5 }).foe('shredder', ...club.tile(9, 3), { range: 5 });
  g.foe('critic', ...club.tile(12, -3), { range: 4 }).foe('soundguy', ...club.tile(14, 2), { range: 4 });
  g.foe('bouncer', ...club.tile(15, -1), { range: 3 });
  g.pick(...club.tile(2, 0), 10).pick(...club.tile(5, 3), 10).pick(...club.tile(9, -3), 10).pick(...club.tile(12, 1), 10);
  g.whetstone(...club.tile(3, -4));
  g.light('strobe', ...wallTile(club, 8), { colors: ['#ffffff'], reach: 9, height: 1.3 });
  wash(g, club, [NEON[0], NEON[1], NEON[3]], { cans: 3, program: 'chase' });
  marquee(club, 5, 'THE LAST GIG OF THE NIGHT');
  d.hall(3, { wall: 'posters' });
  d.exit(3);
  return g;
}
