/**
 * A stop as text, for laying one out: `node scripts/map.js 3` (stops count
 * from 1), `--heights` for the floor heights instead of what is where, and
 * `--overlaps` to say where one piece was dug over another.
 *
 *   .  floor     #  wall      ~  electrified floor      E  stage door      S  start
 *   ^  pyro or steam      X  a drop      |  passport control      /  breakaway      L  lift
 *   k  passport  $  picks or a suitcase      +  gaffer tape      !  lighter      G  snow globe
 *   m  someone walking     o  someone crawling or flying      s  sticky     >  belt     O  bumper
 */

import { FOES } from '../src/foes.js';
import { Venue } from '../src/venue.js';
import { VENUES, loadVenue } from '../src/venues/index.js';

const args = process.argv.slice(2);
const heights = args.includes('--heights');
const n = Number(args.find((a) => /^\d+$/.test(a)) ?? 1);
if (!(n >= 1 && n <= VENUES.length)) {
  console.error(`stops are 1 to ${VENUES.length}`);
  process.exit(1);
}
// Floor laid where there was floor already: two pieces dug over each other.
const overlaps = new Map();
if (args.includes('--overlaps')) {
  const surface = Venue.prototype.surface;
  Venue.prototype.surface = function (x, z, w, d, ...rest) {
    for (let j = z; j < z + d; j++) {
      for (let i = x; i < x + w; i++) {
        const c = this.cell(i, j);
        if (c && c.kind !== 'wall') overlaps.set(`${i},${j}`, [i, j]);
      }
    }
    return surface.call(this, x, z, w, d, ...rest);
  };
}
const venue = loadVenue(n - 1);
const grid = Array.from({ length: venue.rows }, () => Array(venue.cols).fill(' '));
for (let z = 0; z < venue.rows; z++) {
  for (let x = 0; x < venue.cols; x++) {
    const c = venue.cell(x, z);
    if (!c) continue;
    if (heights) {
      grid[z][x] = c.kind === 'wall' ? '#' : String(Math.round(Math.max(...c.h)) % 10);
      continue;
    }
    grid[z][x] = { wall: '#', zap: '~', exit: 'E' }[c.kind]
      ?? (c.trap ? '^' : c.crush ? 'X' : c.door ? (venue.doors.find((d) => x >= d.x && z >= d.z && x < d.x + d.w && z < d.z + d.d)?.kind === 'panel' ? '/' : '|')
        : c.fx === 'sticky' ? 's' : c.fx === 'belt' ? '>' : '.');
  }
}
if (!heights) {
  for (const l of venue.lifts) grid[l.z][l.x] = 'L';
  for (const b of venue.bumpers) grid[Math.floor(b.z)][Math.floor(b.x)] = 'O';
  const mark = { pass: 'k', whetstone: '+', lighter: '!', demo: 'G' };
  for (const p of venue.pickups) grid[Math.floor(p.z)][Math.floor(p.x)] = mark[p.kind] ?? '$';
  for (const m of venue.foes) grid[Math.floor(m.z)][Math.floor(m.x)] = FOES[m.kind].move === 'walk' ? 'm' : 'o';
}
grid[venue.start.z][venue.start.x] = 'S';
for (const [x, z] of overlaps.values()) grid[z][x] = '@';
console.log(`${venue.name} — ${venue.cols}×${venue.rows}, ${venue.foes.length} people in the way${overlaps.size ? `, ${overlaps.size} tiles dug twice (@)` : ''}`);
const ruler = Array.from({ length: venue.cols }, (_, x) => (x % 10 === 0 ? String((x / 10) % 10) : ' ')).join('');
console.log(`     ${ruler}`);
grid.forEach((row, z) => console.log(`${String(z).padStart(4)} ${row.join('').replace(/\s+$/, '')}`));
