import { CAST } from './models/cast/index.js';
import { isBaked, ready } from './models/library.js';
import { createModel } from './models/model.js';

/**
 * Who is in the way: the annoying people you meet on a world tour, the
 * locals and the visitors and the animals of each stop, and the people who
 * work the shows. Each has how it gets about — `walk` (pushed
 * over the floor as Rock is, and after him when he comes near), `crawl`
 * (round a set loop on the floor) or `fly` (round a set loop above
 * everyone's heads, over gaps and all, on a wire if need be) — and how it
 * takes being rolled over:
 *
 *   `toughness`  the speed (tiles a second) Rock has to hit it at to smash it
 *                in one go. Slower and it only gets knocked about: it takes
 *                that much of its `hp` and Rock takes some of its `power`.
 *   `power`      how much it hurts to bounce off it.
 *   `hype`       what smashing it is worth.
 *   `hp`         (a boss) how much it takes in all.
 *   `tactic`     (a boss) what it does besides come at Rock: `lunge` (every
 *                so often a sudden rush), `tempo` (it moves on the beat:
 *                still, then a surge) or `stomp` (it stops, stamps, and the
 *                floor throws Rock back).
 *
 * How each one looks is its model (models/cast/): sculpted in code, baked in
 * the background as the page loads.
 */

export const FOES = Object.freeze({
  // Everywhere: the visitors, Rock's fans, and the people who work the shows.
  tourist: { name: 'Tourist', blurb: 'Map upside down. Camera the right way round. Pointed at you.', move: 'walk', toughness: 4, power: 3, hype: 40, radius: 0.39, speed: 2.4 },
  influencer: { name: 'Influencer', blurb: 'Here for the landmark. In front of the landmark.', move: 'walk', toughness: 4, power: 4, hype: 60, radius: 0.34, speed: 3.6, flash: true },
  fan: { name: 'Superfan in Training', blurb: 'Has a pen, a book and your face on a T-shirt. It is not your face.', move: 'walk', toughness: 4, power: 3, hype: 50, radius: 0.34, speed: 4.4, shout: 'SIGN IT!' },
  paparazzo: { name: 'Paparazzo', blurb: 'Followed you from the airport. Got your good side. You do not have a good side.', move: 'walk', toughness: 4, power: 4, hype: 50, radius: 0.37, speed: 3.4, flash: true },
  security: { name: 'Venue Security', blurb: 'Has a radio. Is using the radio. In several languages.', move: 'walk', toughness: 9, power: 9, hype: 140, radius: 0.49, speed: 2.8 },
  bouncer: { name: 'Doorman', blurb: 'Your name is not on the list. In any country.', move: 'walk', toughness: 10, power: 11, hype: 160, radius: 0.51, speed: 2.6 },
  drone: { name: 'Camera Drone', blurb: 'Getting the aerial shot of the tour. You are the aerial shot.', move: 'fly', toughness: 5, power: 5, hype: 80, radius: 0.39, speed: 2.4 },
  pigeon: { name: 'Pigeon', blurb: 'Has seen every statue in Europe. Has been on all of them.', move: 'fly', toughness: 2, power: 2, hype: 30, radius: 0.3, speed: 3.2 },
  // London.
  gent: { name: 'City Gent', blurb: 'Bowler hat, umbrella, The Times. Terribly sorry. Not sorry.', move: 'walk', toughness: 4, power: 4, hype: 50, radius: 0.36, speed: 3.2 },
  bobby: { name: 'Bobby', blurb: 'Evening all. Mind how you roll.', move: 'walk', toughness: 6, power: 6, hype: 80, radius: 0.38, speed: 3.2, shout: 'OI!' },
  guardsman: { name: 'Guardsman', blurb: 'Will not move. Will not smile. Will not blink. Will march.', move: 'walk', toughness: 7, power: 7, hype: 100, radius: 0.38, speed: 2.4 },
  punk: { name: 'Camden Punk', blurb: 'Safety pins, a mohawk and an opinion about your band.', move: 'walk', toughness: 5, power: 6, hype: 70, radius: 0.37, speed: 4.2 },
  corgi: { name: 'Corgi', blurb: 'Royal. Low. Fast. Unimpressed.', move: 'crawl', toughness: 3, power: 3, hype: 50, radius: 0.32, speed: 3.6 },
  // Paris.
  mime: { name: 'Mime', blurb: 'Is trapped in an invisible box. Wants you in it too.', move: 'walk', toughness: 4, power: 4, hype: 60, radius: 0.34, speed: 3.4 },
  artist: { name: 'Pavement Artist', blurb: 'Will paint your portrait. You are a rock. Still life, then.', move: 'walk', toughness: 4, power: 4, hype: 50, radius: 0.37, speed: 2.8 },
  waiter: { name: 'Waiter', blurb: 'Has a tray, a cloth over his arm and no intention of serving you.', move: 'walk', toughness: 5, power: 5, hype: 60, radius: 0.36, speed: 4.0 },
  cyclist: { name: 'Cyclist', blurb: 'A striped jumper, a beret, a baguette in the basket. Has right of way. Thinks.', move: 'walk', toughness: 5, power: 6, hype: 70, radius: 0.42, speed: 5.2 },
  poodle: { name: 'Poodle', blurb: 'Groomed this morning. Better haircut than the band.', move: 'crawl', toughness: 3, power: 3, hype: 50, radius: 0.3, speed: 3.4 },
  // Venice.
  gondolier: { name: 'Gondolier', blurb: 'Striped shirt, straw hat, a song. The song costs extra.', move: 'walk', toughness: 5, power: 5, hype: 60, radius: 0.37, speed: 3.0, shout: 'O SOLE MIO!' },
  reveler: { name: 'Carnival Mask', blurb: 'Nobody knows who is under there. Nobody has asked.', move: 'walk', toughness: 5, power: 5, hype: 70, radius: 0.36, speed: 3.6 },
  pizzaiolo: { name: 'Pizzaiolo', blurb: 'Spins the dough. Throws the dough. Has never missed.', move: 'walk', toughness: 5, power: 5, hype: 60, radius: 0.4, speed: 3.0 },
  nonna: { name: 'Nonna', blurb: 'You are too thin. You are a rock. You are still too thin.', move: 'walk', toughness: 8, power: 8, hype: 120, radius: 0.36, speed: 2.4, shout: 'MANGIA!' },
  // The Alps.
  skier: { name: 'Skier', blurb: 'Goggles, poles, a lot of very expensive anorak. Off-piste.', move: 'walk', toughness: 5, power: 6, hype: 70, radius: 0.38, speed: 5.0 },
  snowboarder: { name: 'Snowboarder', blurb: 'Says "gnarly" without irony. Sits down in the middle of the run.', move: 'walk', toughness: 4, power: 5, hype: 60, radius: 0.38, speed: 4.6 },
  yodeler: { name: 'Yodeler', blurb: 'Lederhosen, a feather in the hat, and a voice the next valley can hear.', move: 'walk', toughness: 5, power: 5, hype: 80, radius: 0.38, speed: 2.8, shout: 'YO-DEL-AY-EE-OO!' },
  stbernard: { name: 'St Bernard', blurb: 'Has a barrel round its neck. Has come to rescue you. From yourself.', move: 'walk', toughness: 6, power: 5, hype: 100, radius: 0.46, speed: 3.0 },
  ibex: { name: 'Ibex', blurb: 'Lives on cliffs. Has horns. Has opinions about boulders.', move: 'walk', toughness: 5, power: 6, hype: 90, radius: 0.4, speed: 4.2 },
  // Spain.
  bull: { name: 'Bull', blurb: 'Has been running with the runners since seven. Now runs at you.', move: 'walk', toughness: 9, power: 10, hype: 150, radius: 0.55, speed: 5.0 },
  matador: { name: 'Matador', blurb: 'A suit of lights and a red cape. Thinks you are a bull. You are not a bull.', move: 'walk', toughness: 6, power: 6, hype: 90, radius: 0.36, speed: 3.6, shout: '¡OLÉ!' },
  flamenco: { name: 'Flamenco Dancer', blurb: 'Stamps. Clicks. Stares. Stamps.', move: 'walk', toughness: 5, power: 5, hype: 70, radius: 0.36, speed: 3.4 },
  runner: { name: 'Bull Runner', blurb: 'White shirt, red scarf, no plan. Running from the bull. Into you.', move: 'walk', toughness: 4, power: 4, hype: 50, radius: 0.36, speed: 5.4 },
  // Egypt.
  camel: { name: 'Camel', blurb: 'Rides for tourists. Spits at boulders.', move: 'walk', toughness: 8, power: 8, hype: 120, radius: 0.6, speed: 2.6 },
  hawker: { name: 'Souvenir Seller', blurb: 'Has a pyramid on a keyring. Has a keyring on a pyramid. Very good price.', move: 'walk', toughness: 4, power: 4, hype: 50, radius: 0.37, speed: 4.0, shout: 'VERY GOOD PRICE!' },
  archaeologist: { name: 'Archaeologist', blurb: 'Hat, whip, satchel. Says you belong in a museum.', move: 'walk', toughness: 6, power: 6, hype: 90, radius: 0.37, speed: 3.6 },
  scarab: { name: 'Scarab', blurb: 'Rolls things. Has noticed you are a thing that rolls.', move: 'crawl', toughness: 3, power: 3, hype: 40, radius: 0.3, speed: 2.8 },
  mummy: { name: 'The Mummy', blurb: 'Woke up for the tour. Coming undone.', move: 'walk', toughness: 6, power: 6, hype: 80, radius: 0.39, speed: 1.8 },
  // Tokyo.
  salaryman: { name: 'Salaryman', blurb: 'Last train missed. Karaoke found. Microphone kept.', move: 'walk', toughness: 4, power: 4, hype: 50, radius: 0.36, speed: 3.4 },
  cosplayer: { name: 'Cosplayer', blurb: 'Has come as a giant robot. Has a giant foam sword. Has a photo session at three.', move: 'walk', toughness: 5, power: 5, hype: 70, radius: 0.38, speed: 3.6 },
  sumo: { name: 'Sumo Apprentice', blurb: 'Eats. Trains. Stamps. Pushes. In that order.', move: 'walk', toughness: 9, power: 9, hype: 140, radius: 0.52, speed: 2.4 },
  ninja: { name: 'Theme-Park Ninja', blurb: 'Invisible. Mostly. The badge says Kenji.', move: 'walk', toughness: 5, power: 6, hype: 80, radius: 0.35, speed: 4.8 },
  mascot: { name: 'Kawaii Mascot', blurb: 'Round, pink and promoting a prefecture. Wants a hug.', move: 'walk', toughness: 9, power: 3, hype: 150, radius: 0.61, speed: 2.4 },
  robot: { name: 'Robot Waiter', blurb: 'Beep. Boop. Your table is ready. You are not.', move: 'walk', toughness: 7, power: 7, hype: 100, radius: 0.43, speed: 2.2 },
  // Rio.
  sambista: { name: 'Samba Dancer', blurb: 'Feathers, sequins and a samba that does not stop for anybody.', move: 'walk', toughness: 5, power: 5, hype: 70, radius: 0.38, speed: 4.0 },
  capoeira: { name: 'Capoeirista', blurb: 'Is it a dance? Is it a fight? It is a kick. At you.', move: 'walk', toughness: 6, power: 7, hype: 90, radius: 0.37, speed: 4.4 },
  footballer: { name: 'Beach Footballer', blurb: 'Keepy-uppy since dawn. Has noticed a big round thing.', move: 'walk', toughness: 5, power: 5, hype: 70, radius: 0.37, speed: 4.8 },
  vendor: { name: 'Beach Vendor', blurb: 'Coconuts, corn, hats, sunglasses, a hammock. You need a hammock.', move: 'walk', toughness: 4, power: 4, hype: 50, radius: 0.4, speed: 3.0 },
  macaw: { name: 'Macaw', blurb: 'Loud, red and stealing everybody\'s chips.', move: 'fly', toughness: 3, power: 3, hype: 60, radius: 0.32, speed: 2.8, shout: 'SQUAWK!' },
  // Sydney.
  surfer: { name: 'Surfer', blurb: 'Waiting for the wave. Found you instead.', move: 'walk', toughness: 5, power: 5, hype: 70, radius: 0.37, speed: 3.8 },
  lifeguard: { name: 'Lifeguard', blurb: 'Red and yellow. Blows the whistle. Means it.', move: 'walk', toughness: 7, power: 7, hype: 100, radius: 0.4, speed: 4.2 },
  kangaroo: { name: 'Kangaroo', blurb: 'Boxes. Seriously. Has gloves on.', move: 'walk', toughness: 7, power: 8, hype: 110, radius: 0.45, speed: 4.4 },
  croc: { name: 'Saltwater Croc', blurb: 'Has been around since the dinosaurs. Has not been around a rock like you.', move: 'crawl', toughness: 7, power: 8, hype: 110, radius: 0.48, speed: 2.4 },
  // New York.
  cabbie: { name: 'Cab Driver', blurb: 'Off duty. Always off duty. Honks anyway.', move: 'walk', toughness: 5, power: 6, hype: 70, radius: 0.38, speed: 3.6, shout: 'HEY! I\'M WALKIN\' HERE!' },
  hotdog: { name: 'Hot Dog Vendor', blurb: 'Onions? Mustard? A boulder? Sure, why not.', move: 'walk', toughness: 5, power: 5, hype: 60, radius: 0.42, speed: 2.8 },
  cop: { name: 'Beat Cop', blurb: 'Has a nightstick, a hunch and a coffee.', move: 'walk', toughness: 6, power: 6, hype: 80, radius: 0.37, speed: 3.4, shout: 'FREEZE!' },
  dancer: { name: 'Broadway Hoofer', blurb: 'Five, six, seven, eight. Eight shows a week.', move: 'walk', toughness: 5, power: 4, hype: 60, radius: 0.36, speed: 4.0 },
  rat: { name: 'Subway Rat', blurb: 'Carrying a slice of pizza bigger than itself. Wants yours.', move: 'crawl', toughness: 2, power: 2, hype: 40, radius: 0.28, speed: 3.6 },
  // The ones in charge.
  yeti: { name: 'The Yeti', blurb: 'On holiday from the Himalaya. Does not ski. Lunges for whatever comes down the mountain.', move: 'walk', toughness: 9, power: 9, hype: 600, radius: 0.85, speed: 1.6, boss: true, hp: 50, tactic: 'lunge' },
  yokozuna: { name: 'The Yokozuna', blurb: 'Grand champion. Stamps the ring, and the ring throws you out of it.', move: 'walk', toughness: 9, power: 10, hype: 800, radius: 0.92, speed: 1.6, boss: true, hp: 58, tactic: 'stomp' },
  superfan: { name: 'The Superfan', blurb: 'Has been to every show of the tour. Has your face on his arm. Moves on the beat, like you taught him.', move: 'walk', toughness: 10, power: 12, hype: 1500, radius: 1.04, speed: 1.8, boss: true, hp: 70, tactic: 'tempo' },
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
