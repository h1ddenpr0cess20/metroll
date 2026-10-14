/**
 * The reels scripts/reel.js makes. Each is a soundtrack (a track's theme by
 * name, its tempo, and the bar of the song to start on), a line to open on,
 * and clips cut on its bar lines: from a track (they count from 0), so many
 * bars long, the best stretch of it the autopilot played. Every one ends on
 * the card with the address.
 */

/** New York's hardcore, a d-beat at 190, from the top of the first chorus (bar 12), so it is flat out from the first frame. */
const HARDCORE = { args: ['nyc', 190, 12], tempo: 190, lead: 0.15 };
/** The Strip's hair-metal anthem, at 126, and the Bay Area's thrash, at 168: each from its first chorus too. */
const HAIR = { args: ['strip', 126, 12], tempo: 126, lead: 0.15 };
const THRASH = { args: ['bay', 168, 12], tempo: 168, lead: 0.15 };

export const REELS = {
  rock: {
    hook: ['Smash every poser in metal', 'then fight the boulder who started it'],
    music: HARDCORE,
    worth: { boss: 30, bossdown: 160 },
    // The best of the Bay Area, New York (the hardcore track itself) and the Warped Tour; then Wacken's
    // main stage, Rock from the first blow to going over, and the whole discography done.
    clips: [
      { level: 2, bars: 3 },
      { level: 4, bars: 3 },
      { level: 10, bars: 3 },
      { level: 11, bars: 11 },
    ],
  },
  // The best four stretches of the Sunset Strip, in the order they happened, to its own anthem.
  hair: {
    hook: ['Hair metal had it coming', 'the Sunset Strip, 1986'],
    music: HAIR,
    clips: { level: 1, count: 4, bars: 3 },
  },
  // The best four stretches of the Bay Area, to its own thrash.
  thrash: {
    hook: ['Faster. Faster. Flat out.', 'the Bay Area, 1986 · thrash'],
    music: THRASH,
    clips: { level: 2, count: 4, bars: 4 },
  },
};

/**
 * What each sound the game makes is worth to a reel: a number, or a function
 * of what it was called with. `boss` (a blow landed on one) and `bossdown`
 * are noted by recorder.js.
 */
export const WORTH = {
  smash: (grade) => ({ crit: 26, smash: 16, bonk: 7, tap: 4, weak: 3 })[grade] ?? 6,
  panel: 6,
  pick: 1,
  demo: 10,
  pass: 8,
  gate: 8,
  whetstone: 5,
  lighter: 5,
  encore: 14,
  slam: 1.5,
  burst: 1,
  bumper: 2,
  zap: 4,
  fall: 3,
  clear: 20,
  boss: 0,
  bossdown: 0,
};

/** A boss beaten wants a moment after it, to see him go over. */
export const AFTER = { bossdown: 2, clear: 1.5 };

/** How long the card to end on stays up, in seconds. */
export const CARD = 4.6;

/** How long the opening line stays up, and when the address comes in under the HUD. */
export const HOOK = 2.4;
export const PILL = 2.7;

/**
 * The sound, before it goes out: the kick and the bass doubling the guitars are mostly sub on a
 * phone, so the very bottom is cut, the low end taken down a little and the top lifted.
 */
export const MIX = 'highpass=f=40,bass=g=-6:f=100:w=0.7,treble=g=4:f=3000:w=0.6';
