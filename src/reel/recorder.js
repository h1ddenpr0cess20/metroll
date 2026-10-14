import '@fontsource/anton/400.css';
import '@fontsource/barlow-condensed/500.css';
import '@fontsource/barlow-condensed/600.css';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/pirata-one/400.css';
import '@fontsource/metal-mania/400.css';

import { createAudio } from '../audio.js';
import { BOARD_DETAIL } from '../foes.js';
import { createGame } from '../game.js';
import { createHud } from '../hud.js';
import { preload, ready, SCULPTED } from '../models/library.js';
import { createRoll } from '../roll.js';
import { createStage } from '../stage.js';
import { createStorage } from '../storage.js';
import { loadVenue, VENUES } from '../venues/index.js';
import * as GFX from '../vendor/gfx/index.js';
import { createPilot } from '../../test/helpers/autopilot.js';
import { createRecorder } from './core.js';

/**
 * Metroll, for the reels (reel.html; the filming is core.js): the game built
 * as main.js builds it, with nobody's hands on it and the tests' autopilot
 * at the wheel, hunting (raging at whoever is in reach, the RAGE button held).
 */

/** The bosses' hit points, as they were last frame: a blow landed on one is a moment worth seeing. */
let bossHp = new Map();

createRecorder({
  async ready() {
    preload();
    const jobs = new Map();
    for (let i = 0; i < VENUES.length; i++) {
      const v = loadVenue(i);
      for (const f of v.foes) jobs.set(`${f.kind}@${BOARD_DETAIL}`, [f.kind, BOARD_DETAIL]);
      for (const p of v.pickups) jobs.set(`${p.kind}@1`, [p.kind, 1]);
    }
    await Promise.all([...jobs.values()].filter(([n]) => SCULPTED[n]).map(([n, d]) => ready(n, d)));
    await Promise.all(['400 40px "Metal Mania"', '400 30px "Pirata One"', '400 20px Anton', '700 20px "Barlow Condensed"', '600 20px "Barlow Condensed"', '500 20px "Barlow Condensed"']
      .map((f) => document.fonts.load(f)));
  },

  createAudio,
  // The lights keep the beat of the reel's soundtrack.
  through: ['beat'],
  // The main title is the game's own music: the reel has its soundtrack.
  nowhere: ['title'],
  quiet: ['rolling', 'rev'],

  async build({ audio }) {
    const hud = createHud(document.body, { onStart() {}, onResume() {}, onRestart() {}, onNext() {}, onSetting() {}, onRevHeld() {} });
    hud.muted(false);
    const input = {
      stick: () => [0, 0],
      rev: () => false,
      view: () => ({ turn: 0, tilt: 0, zoom: 1 }),
      take: () => [],
    };
    const stage = await createStage(document.getElementById('view'));
    const game = createGame({ stage, hud, input, audio, storage: createStorage() });
    return { game, stage, GFX };
  },

  start(game, level) {
    bossHp = new Map();
    // The ball and its turn carry over from track to track: from the same rest every time, so the
    // run filmed is the run scouted, whatever was played before it.
    const { ball, roll } = game.debug.gig;
    Object.assign(ball, { nx: 0, ny: 1, nz: 0 });
    Object.assign(roll, createRoll());
    game.debug.pilot = null;
    game.startVenue(level);
  },
  // Hunting: it plays to be watched, at a good lick and raging at whoever is in reach.
  pilot: (game) => createPilot(game.debug.gig, { hunt: true }),
  attach: (game, pilot) => { game.debug.pilot = pilot; },
  ball: (game) => game.debug.ball,
  name: (game) => game.debug.gig.venue.name,
  state: (game) => game.state,
  phase: (game) => ({ play: 'live', lost: 'wait', ready: 'wait', clear: 'end', over: 'end' })[game.state] ?? 'wait',
  steering: (game) => game.state === 'play',
  // A thumb on RAGE while the autopilot charges.
  button: { selector: '#rev-button', held: (game, move) => game.state === 'play' && Boolean(move?.rev) && game.debug.gig.revving },

  /** A blow landed on a boss, and a boss beaten: no sound says which foe it was. */
  notes(game) {
    const out = [];
    for (const f of game.debug.gig.actors.foes) {
      if (!f.stats.boss) continue;
      const was = bossHp.get(f) ?? f.hp;
      if (f.hp < was - 1e-6) out.push('boss');
      if (f.dead && !bossHp.has(`${f.kind}:dead`)) { bossHp.set(`${f.kind}:dead`, true); out.push('bossdown'); }
      bossHp.set(f, f.hp);
    }
    return out;
  },

  /** A track's theme by name, at its tempo, from bar `bar` of the song (the chorus is bar 12), its downbeat `lead` seconds in. */
  music(audio, m) {
    const [theme, tempo, bar = 0] = m.args;
    const beat0 = bar * 4 - (m.lead ?? 0.15) * (tempo / 60);
    audio.startMusic({ look: { theme }, tempo }, { gig: { time: (beat0 * 60) / tempo } });
  },

  card: {
    logo: `<header class="logo">
        <p class="presents">fifty years of metal</p>
        <h1 class="top">Metroll</h1>
        <h1 class="bottom">Greatest Hits</h1>
        <p class="tag">a spiked ball trolls them all</p>
      </header>`,
    url: 'metroll-five.vercel.app',
  },
  theme: {
    display: 'Anton, Impact, "Arial Narrow Bold", sans-serif',
    body: '"Barlow Condensed", "Arial Narrow", system-ui, sans-serif',
    accent: '#d8202a',
    'accent-dark': '#4a0a0e',
    'accent-2': '#ffd23a',
    cool: '#e4e0d6',
    dim: '#9a9aa6',
    'pill-top': '158px',
    'pill-size': '15px',
    'url-size': '30px',
    'cta-size': '21px',
  },
});
