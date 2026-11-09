import { CAST } from './models/cast/index.js';
import { createRockMesh } from './rockboss.js';
import { isBaked, ready } from './models/library.js';
import { createFoeMeshes } from 'madness-engine/venue/foemesh';

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
 * the background as the page loads. The one exception is Rock, the last boss
 * (`original`): the boulder of the first game, untouched (rockboss.js).
 */

export const FOES = Object.freeze({
  // Everywhere: the people who come with the scene, and the people who work the shows.
  poser: { name: 'Poser', blurb: 'Wears the T-shirt of a band they have never heard. Knows one riff. It is the wrong one.', move: 'walk', toughness: 4, power: 3, hype: 40, radius: 0.37, speed: 3.0 },
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
  // The Strip.
  frontman: { name: 'The Frontman', blurb: 'Has used a whole can of hairspray. Is on their second.', move: 'walk', toughness: 6, power: 6, hype: 90, radius: 0.41, speed: 3.0, shout: 'WE ARE ONE!' },
  shredder: { name: 'Shredder', blurb: 'Plays a hundred notes a second. Not one of them for you.', move: 'walk', toughness: 5, power: 5, hype: 70, radius: 0.38, speed: 3.4 },
  promoter: { name: 'A&R Man', blurb: 'Will sign you. Will not pay you. Has a car phone the size of a brick.', move: 'walk', toughness: 5, power: 4, hype: 60, radius: 0.37, speed: 3.6, shout: 'LUNCH!' },
  blader: { name: 'Rollerblader', blurb: 'Neon, a Walkman, eight wheels. Has right of way. Thinks.', move: 'walk', toughness: 5, power: 5, hype: 70, radius: 0.4, speed: 5.2 },
  limodriver: { name: 'Limo Driver', blurb: 'Waiting for a Mr. Smith. Has decided that you are Mr. Smith.', move: 'walk', toughness: 6, power: 6, hype: 80, radius: 0.38, speed: 2.8 },
  // The Bay Area.
  mosher: { name: 'Mosher', blurb: 'In the pit since 1984. Windmills. Will not leave. Has not been asked to.', move: 'walk', toughness: 5, power: 6, hype: 70, radius: 0.39, speed: 4.4, shout: 'PIT!' },
  skater: { name: 'Skater', blurb: 'A deck, a grudge, a Walkman. Ollies over everything. Not you.', move: 'walk', toughness: 4, power: 5, hype: 60, radius: 0.38, speed: 5.0 },
  tapetrader: { name: 'Tape Trader', blurb: 'Has your demo. Bootlegged it. Badly. A copy of a copy of a copy.', move: 'walk', toughness: 4, power: 3, hype: 50, radius: 0.35, speed: 4.2, shout: 'WANNA TRADE?' },
  crowdsurfer: { name: 'Crowd Surfer', blurb: 'Carried over everybody. Has no plan for coming down. Will land on you.', move: 'fly', toughness: 3, power: 3, hype: 60, radius: 0.36, speed: 3.0 },
  // Whitby.
  goth: { name: 'Goth', blurb: 'Black on black on black. Somebody has died. It is always the same one: the sun.', move: 'walk', toughness: 5, power: 5, hype: 70, radius: 0.39, speed: 2.6 },
  dracfan: { name: 'Dracula Fan', blurb: 'Plastic fangs, a satin cape, a flag on a stick. Has been to Whitby eleven times.', move: 'walk', toughness: 4, power: 4, hype: 60, radius: 0.36, speed: 3.6, shout: 'I VANT TO...' },
  poet: { name: 'Poet', blurb: 'About to read. At length. Has a scroll. Has a lot of scroll.', move: 'walk', toughness: 4, power: 4, hype: 60, radius: 0.36, speed: 2.8, shout: 'O, DARKNESS!' },
  mourner: { name: 'Mourner', blurb: 'A funeral. It is always a funeral. The umbrella is for the sun.', move: 'walk', toughness: 6, power: 6, hype: 90, radius: 0.41, speed: 2.2 },
  bat: { name: 'Bat', blurb: 'Lives in the abbey. Has seen things. Mostly goths.', move: 'fly', toughness: 2, power: 2, hype: 40, radius: 0.3, speed: 3.4 },
  blackcat: { name: 'Black Cat', blurb: 'Crosses your path on purpose. Is bad luck, and knows it.', move: 'crawl', toughness: 3, power: 3, hype: 50, radius: 0.28, speed: 3.8 },
  count: { name: 'The Count', blurb: 'Has not been seen in the mirror for some time. Arrives whenever he likes. Hungry.', move: 'walk', toughness: 9, power: 9, hype: 600, radius: 0.9, speed: 1.6, boss: true, hp: 50, tactic: 'lunge' },
  // New York.
  punk: { name: 'Punk', blurb: 'Safety pins, a mohawk and an opinion about your band. Hardcore thinks they sold out.', move: 'walk', toughness: 5, power: 6, hype: 70, radius: 0.37, speed: 4.2 },
  cop: { name: 'Beat Cop', blurb: 'Has a nightstick, a hunch and a coffee. Hates the noise. Hates the kids more.', move: 'walk', toughness: 6, power: 6, hype: 80, radius: 0.37, speed: 3.4, shout: 'FREEZE!' },
  rat: { name: 'Subway Rat', blurb: 'Carrying a slice of pizza bigger than itself. Wants your demo.', move: 'crawl', toughness: 2, power: 2, hype: 40, radius: 0.28, speed: 3.6 },
  hxckid: { name: 'Straight Edge Kid', blurb: 'X on each hand. Does not drink. Does not shut up about it.', move: 'walk', toughness: 4, power: 4, hype: 50, radius: 0.35, speed: 4.6, shout: 'STRAIGHT EDGE!' },
  toughguy: { name: 'Tough Guy', blurb: 'Windmills. Karate kicks. Hits nobody. Hits you.', move: 'walk', toughness: 7, power: 8, hype: 110, radius: 0.46, speed: 3.6, shout: 'HARDCORE!' },
  diver: { name: 'Stage Diver', blurb: 'Dives off the stage into a crowd that has stepped aside.', move: 'fly', toughness: 3, power: 3, hype: 60, radius: 0.35, speed: 3.0 },
  zinekid: { name: 'Zine Kid', blurb: 'Has photocopied their opinion of you. Has copies.', move: 'walk', toughness: 4, power: 3, hype: 50, radius: 0.34, speed: 3.6, shout: 'ISSUE #4!' },
  // Tampa.
  headbanger: { name: 'Headbanger', blurb: 'Headbangs at a speed that violates several laws.', move: 'walk', toughness: 5, power: 6, hype: 70, radius: 0.38, speed: 4.0 },
  zombie: { name: 'Zombie', blurb: 'Up out of the swamp for the vocals. A bit underdressed.', move: 'walk', toughness: 6, power: 6, hype: 80, radius: 0.39, speed: 1.8 },
  gator: { name: 'Gator', blurb: 'Florida\'s second-worst idea. After the other one.', move: 'crawl', toughness: 7, power: 8, hype: 110, radius: 0.48, speed: 2.6 },
  floridaman: { name: 'Florida Man', blurb: 'Has a story. It is not a good story. It is about you.', move: 'walk', toughness: 5, power: 5, hype: 60, radius: 0.4, speed: 3.4, shout: 'HOLD MY BEER!' },
  coroner: { name: 'Coroner', blurb: 'Pronounces you dead. Often prematurely.', move: 'walk', toughness: 6, power: 6, hype: 80, radius: 0.37, speed: 3.0, shout: 'TIME OF DEATH!' },
  // Norway.
  corpsepaint: { name: 'Corpse Paint', blurb: 'Grim. Frostbitten. Has not smiled since 1991 and is not about to start for you.', move: 'walk', toughness: 6, power: 7, hype: 90, radius: 0.37, speed: 3.0, shout: 'TRVE!' },
  wolf: { name: 'Wolf', blurb: 'Out of the spruce. Has heard every album and is unmoved.', move: 'crawl', toughness: 4, power: 6, hype: 70, radius: 0.34, speed: 4.4 },
  crow: { name: 'Crow', blurb: 'Here before the band. Will be here after. Wants the demo tape.', move: 'fly', toughness: 2, power: 2, hype: 40, radius: 0.3, speed: 3.6 },
  troll: { name: 'Troll', blurb: 'Under the bridge since the Middle Ages. Wants a toll. Does not take cards.', move: 'walk', toughness: 9, power: 9, hype: 150, radius: 0.62, speed: 1.9, shout: 'TOLL!' },
  skier: { name: 'Skier', blurb: 'Here for the Olympics. Has no idea what is on in the church car park.', move: 'walk', toughness: 4, power: 4, hype: 50, radius: 0.37, speed: 4.0, shout: 'ON YOUR LEFT!' },
  // New Orleans.
  stoner: { name: 'Stoner', blurb: 'On the couch since the last record. Will get up in a minute. Has been saying that since the last record.', move: 'walk', toughness: 4, power: 4, hype: 50, radius: 0.4, speed: 1.4 },
  pallbearer: { name: 'Pallbearer', blurb: 'Carrying one corner of a coffin. The rest of the funeral is late.', move: 'walk', toughness: 5, power: 5, hype: 80, radius: 0.4, speed: 2.0 },
  brassman: { name: 'Brass Man', blurb: 'A second line, a first line and a one-man blockage of Bourbon Street.', move: 'walk', toughness: 5, power: 5, hype: 70, radius: 0.37, speed: 3.6, shout: 'WOO!' },
  cultist: { name: 'Cultist', blurb: 'Chanting. Not at you, probably. Candle, book, bad attitude.', move: 'walk', toughness: 5, power: 5, hype: 90, radius: 0.38, speed: 1.8 },
  doomlord: { name: 'The Doomlord', blurb: 'Plays one chord. It takes six minutes. Everyone is very impressed.', move: 'walk', toughness: 9, power: 8, hype: 700, radius: 1.0, speed: 1.2, boss: true, hp: 45, tactic: 'stomp' },
  // Berlin.
  welder: { name: 'Welder', blurb: 'Does not look up. Does not need to. Everything is about to be on fire.', move: 'walk', toughness: 5, power: 5, hype: 90, radius: 0.4, speed: 2.4 },
  engineer: { name: 'Engineer', blurb: 'Here to inspect. Has found several things wrong, of which you are the largest.', move: 'walk', toughness: 5, power: 6, hype: 70, radius: 0.41, speed: 3.0, shout: 'ACHTUNG!' },
  raver: { name: 'Raver', blurb: 'Dancing since Friday. It is Monday. Does not intend to be told.', move: 'walk', toughness: 3, power: 3, hype: 50, radius: 0.35, speed: 4.2, shout: 'WHOOO!' },
  clubber: { name: 'Clubber', blurb: 'In a queue since Thursday. Sunglasses. Indoors. At night. Black.', move: 'walk', toughness: 5, power: 5, hype: 70, radius: 0.37, speed: 2.6 },
  robot: { name: 'Line Robot', blurb: 'One job. Has done it since 1974. You are the job.', move: 'walk', toughness: 6, power: 6, hype: 100, radius: 0.42, speed: 2.0, shout: 'BEEP.' },
  // Woodstock '99.
  nuguy: { name: 'Nu Guy', blurb: 'Wants to break stuff. Would like to be asked what. Has a lot of feelings, mostly about you.', move: 'walk', toughness: 6, power: 7, hype: 90, radius: 0.43, speed: 3.4, shout: 'BREAK STUFF!' },
  dj: { name: 'DJ', blurb: 'Was booked for a metal show. Is playing what they like. It is going about as well as you would expect.', move: 'walk', toughness: 3, power: 3, hype: 50, radius: 0.37, speed: 3.0, shout: 'KEEP ROLLIN\'!' },
  candlekid: { name: 'Candle Kid', blurb: 'A vigil, a candle and a lot of hope. Within the hour: a bonfire.', move: 'walk', toughness: 3, power: 3, hype: 40, radius: 0.34, speed: 2.4 },
  medic: { name: 'Medic', blurb: 'Has seen four hundred cases of the same thing since noon. The thing is water.', move: 'walk', toughness: 5, power: 4, hype: 60, radius: 0.38, speed: 4.4, shout: 'MAKE A HOLE!' },
  // Warped Tour.
  scenekid: { name: 'Scene Kid', blurb: 'Four thousand friends. Knows none of them. The phone is at the MySpace angle.', move: 'walk', toughness: 3, power: 3, hype: 50, radius: 0.34, speed: 3.8, shout: 'RAWR!' },
  emo: { name: 'Emo', blurb: 'Fine. Totally fine. Has a journal. Would like to read you a page.', move: 'walk', toughness: 3, power: 3, hype: 50, radius: 0.35, speed: 2.2 },
  streetteam: { name: 'Street Team', blurb: 'Free stickers. Free flyers. A free energy drink, if you listen to the whole sentence.', move: 'walk', toughness: 4, power: 3, hype: 50, radius: 0.37, speed: 4.0, shout: 'FREE STICKERS!' },
  screamer: { name: 'Screamer', blurb: 'Whisper to the end of the world in one bar. Has lost their voice every week since 2003.', move: 'walk', toughness: 6, power: 6, hype: 90, radius: 0.38, speed: 3.6, shout: 'AAAAARGH!' },
  // Wacken.
  viking: { name: 'Viking', blurb: 'Came a long way by boat for a festival that turns out to be a field. Will take the field.', move: 'walk', toughness: 6, power: 7, hype: 90, radius: 0.43, speed: 3.0, shout: 'VALHALLA!' },
  wizard: { name: 'Wizard', blurb: 'Seven hundred years in a tower, writing a concept album about a dragon. Here to read it to you.', move: 'walk', toughness: 5, power: 6, hype: 80, radius: 0.38, speed: 2.0 },
  knight: { name: 'Knight', blurb: 'From the re-enactment society in the next field. Cannot see out of the helm. Cannot hear. Cannot be told.', move: 'walk', toughness: 7, power: 7, hype: 100, radius: 0.43, speed: 2.4, shout: 'FOR THE REALM!' },
  beerguy: { name: 'Beer Guy', blurb: 'Thirty beers in. The happiest man in Germany. Will tell you why, at length.', move: 'walk', toughness: 4, power: 4, hype: 60, radius: 0.45, speed: 2.2, shout: 'PROST!' },
  purist: { name: 'Purist', blurb: 'Will tell you which of your favourites are not metal. All of them. Metal ended in 1986.', move: 'walk', toughness: 6, power: 6, hype: 90, radius: 0.37, speed: 2.8, shout: 'POSER!' },
  rock: { name: 'Rock', blurb: 'The original. Rolled through thirty venues and has taken it badly that somebody gave the spiked one the record.', move: 'walk', toughness: 9, power: 9, hype: 1000, radius: 1.0, speed: 1.6, boss: true, hp: 60, tactic: 'tempo', shout: 'ROCK AND ROLL!', original: true },
  pigeon: { name: 'Pigeon', blurb: 'Seen every canal in the Midlands. Has opinions about your tone.', move: 'fly', toughness: 2, power: 2, hype: 30, radius: 0.3, speed: 3.2 },
});

export { BOARD_DETAIL, FLIGHT, KNOCKED_OUT, STRIKE } from 'madness-engine/venue/foemesh';

const engine = createFoeMeshes({ foes: FOES, cast: CAST, isBaked, ready });

/** A foe to look at: the engine's mesh, with this game's roster and cast. Rock is not sculpted: he is the boulder from the first game, as he was. */
export const createFoeMesh = (GFX, kind) => (FOES[kind]?.original ? createRockMesh(GFX, FOES[kind].radius) : engine.createFoeMesh(GFX, kind));
