import { CAST } from './models/cast/index.js';
import { isBaked, ready } from './models/library.js';
import { createModel } from './models/model.js';

/**
 * Who is in the way: the annoying people of fifty years of metal, the posers
 * and the gatekeepers, the hair bands and the scene kids, the people who work
 * the shows, and the animals the scene keeps. Each has how it gets about —
 * `walk` (pushed over the floor as Metroll is, and after it when it comes
 * near), `crawl` (round a set loop on the floor) or `fly` (round a set loop
 * above everyone's heads, over gaps and all) — and how it takes being rolled
 * over:
 *
 *   `toughness`  the speed (tiles a second) Metroll has to hit it at to smash
 *                it in one go. Slower and it only gets knocked about: it takes
 *                that much of its `hp` and Metroll takes some of its `power`.
 *   `power`      how much it hurts to bounce off it.
 *   `hype`       what smashing it is worth (the cred).
 *   `hp`         (a boss) how much it takes in all.
 *   `tactic`     (a boss) what it does besides come at Metroll: `lunge` (every
 *                so often a sudden rush), `tempo` (it moves on the beat:
 *                still, then a surge) or `stomp` (it stops, stamps, and the
 *                floor throws Metroll back).
 *
 * How each one looks is its model (models/cast/): sculpted in code, baked in
 * the background as the page loads.
 */

export const FOES = Object.freeze({
  // Everywhere: the people who come with the scene, and the people who work the shows.
  poser: { name: 'Poser', blurb: 'Wears the T-shirt of a band he has never heard. Knows one riff. It is the wrong one.', move: 'walk', toughness: 4, power: 3, hype: 40, radius: 0.37, speed: 3.0 },
  gatekeeper: { name: 'Gatekeeper', blurb: 'Has been to every gig since 1983. Will explain why this is not real metal. Has patches. So many patches.', move: 'walk', toughness: 7, power: 7, hype: 110, radius: 0.43, speed: 2.4, shout: 'THAT\'S NOT REAL METAL!' },
  merchguy: { name: 'Merch Guy', blurb: 'Fifty quid for a T-shirt. Seventy for the hoodie. The band gets four.', move: 'walk', toughness: 4, power: 4, hype: 50, radius: 0.38, speed: 3.2, shout: 'T-SHIRTS!' },
  soundguy: { name: 'Sound Engineer', blurb: 'Check one. Check two. Check you.', move: 'walk', toughness: 5, power: 5, hype: 60, radius: 0.37, speed: 3.0, shout: 'CHECK ONE!' },
  roadie: { name: 'Roadie', blurb: 'Carries everything. Resents everything. Has seen worse than you.', move: 'walk', toughness: 8, power: 8, hype: 130, radius: 0.47, speed: 2.4 },
  critic: { name: 'Music Critic', blurb: 'Gives it two stars. Has not heard it. Does not need to.', move: 'walk', toughness: 4, power: 4, hype: 70, radius: 0.35, speed: 3.4 },
  security: { name: 'Venue Security', blurb: 'Has a radio. Is using the radio. About you.', move: 'walk', toughness: 9, power: 9, hype: 140, radius: 0.49, speed: 2.8 },
  bouncer: { name: 'Doorman', blurb: 'Your name is not on the list. In any decade.', move: 'walk', toughness: 10, power: 11, hype: 160, radius: 0.51, speed: 2.6 },
  // Birmingham.
  hippie: { name: 'Hippie', blurb: 'Peace, love and a complaint about the volume.', move: 'walk', toughness: 4, power: 3, hype: 50, radius: 0.36, speed: 3.0, shout: 'TURN IT DOWN, MAN!' },
  foreman: { name: 'Foreman', blurb: 'Flat cap, clipboard. Knows exactly how long you have been on your break.', move: 'walk', toughness: 6, power: 6, hype: 90, radius: 0.4, speed: 2.8, shout: 'BREAK\'S OVER!' },
  folkie: { name: 'Folkie', blurb: 'An acoustic guitar and a finger in one ear. Would like something nicer.', move: 'walk', toughness: 4, power: 4, hype: 50, radius: 0.37, speed: 3.0 },
  drunk: { name: 'The Regular', blurb: 'Fourth pint. Will explain the riff to you. Wrongly.', move: 'walk', toughness: 5, power: 5, hype: 60, radius: 0.4, speed: 2.4 },
  bobby: { name: 'Bobby', blurb: 'Evening all. Mind how you roll. And the noise.', move: 'walk', toughness: 6, power: 6, hype: 80, radius: 0.38, speed: 3.2, shout: 'OI!' },
  pigeon: { name: 'Pigeon', blurb: 'Seen every canal in the Midlands. Has opinions about your tone.', move: 'fly', toughness: 2, power: 2, hype: 30, radius: 0.3, speed: 3.2 },
});

/** How high a flyer goes over the floor where its loop starts: over the crowd's heads. */
export const FLIGHT = 0.8;

/** How finely the foes on the board are meshed: half the grid of a close-up. */
export const BOARD_DETAIL = 0.5;

/** How long an attack plays through, and how long a beaten foe takes to go (see `launch`) before it is gone. */
export const STRIKE = 0.9;
export const KNOCKED_OUT = 1.35;

/**
 * A foe to look at, standing on (0, 0, 0) and facing +z (a flyer's (0, 0, 0)
 * is its middle). `animate(t, moving, how)` makes it live; `body` is the part
 * that turns to face the way it goes.
 *
 * `how`: `chasing` (it hurries), `striking` (Rock is in its reach: it
 * attacks, an attack at a time) and `down` (it is beaten).
 *
 * Each is sculpted (`models/cast/`, baked in the background as the page
 * loads, and there once its bake is in). Until then — and under node, where
 * nothing bakes — a plain stand-in goes in its place.
 */
export function createFoeMesh(GFX, kind) {
  const group = new GFX.Group();
  group.name = kind;
  const body = new GFX.Group();
  group.add(body);
  let model = null;
  const attach = () => {
    model = createModel(GFX, CAST[kind], { detail: BOARD_DETAIL });
    body.add(model.group);
    if (stand) body.remove(stand);
  };
  const stand = CAST[kind] ? null : standIn(GFX, kind);
  if (stand) body.add(stand);
  if (CAST[kind]) {
    if (isBaked(kind, BOARD_DETAIL)) attach();
    else if (typeof window !== 'undefined') ready(kind, BOARD_DETAIL).then(attach);
  }
  const choose = clips();
  return {
    group,
    body,
    animate(t, moving, { chasing = false, ...how } = {}) {
      if (!model) return;
      model.pose({ ...choose(t, moving, how), time: t, speed: chasing ? 1 : 0.6 });
    },
  };
}

/** Which clip it plays, and how far in: down once beaten, an attack when Rock is in reach, else walking or idle. */
function clips() {
  let clip = 'idle', since = 0;
  return (t, moving, { striking = false, down = false } = {}) => {
    let next = down ? 'ko' : striking ? 'attack' : moving ? 'walk' : 'idle';
    // An attack plays through before it does anything else, and then another, if Rock is still there.
    if (clip === 'attack' && !down && t - since < STRIKE) next = 'attack';
    else if (clip === 'attack' && next === 'attack') since = t;
    if (next !== clip) { clip = next; since = t; }
    return { clip, t: t - since };
  };
}

const STAND_IN = {
  walk: '#c8a070', fly: '#9aa8ff', crawl: '#c0605a',
};

/** A plain figure for a foe with no model (yet): a capsule and a head, in a colour by how it gets about. */
function standIn(GFX, kind) {
  const f = FOES[kind];
  const group = new GFX.Group();
  const material = new GFX.MeshStandardMaterial({ name: `standin-${kind}`, color: new GFX.Color(STAND_IN[f.move]), roughness: 0.7 });
  const h = f.radius * 2.4;
  const torso = new GFX.Mesh(new GFX.CylinderGeometry(f.radius * 0.8, f.radius * 0.9, h * 0.7, 12), material);
  torso.position.y = h * 0.35;
  const head = new GFX.Mesh(new GFX.SphereGeometry(f.radius * 0.7, 12, 8), material);
  head.position.y = h * 0.85;
  torso.castShadow = head.castShadow = true;
  group.add(torso, head);
  return group;
}
