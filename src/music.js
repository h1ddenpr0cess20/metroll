/**
 * The compilation's music. Every track has a band playing in the style of
 * its decade, made on the spot with Web Audio, no samples: drums (kick,
 * snare, hats or a ride, toms, claps, rim clicks, crash), a bass (electric
 * or synth), a rhythm part (guitars through a distortion and a cabinet,
 * clean guitars, organ, strings, brass or piano), a lead (a shredder, a raw
 * square, a growl, a theremin, a muted trumpet, vibes) and synths where the
 * era wants them, all in a small room of reverb. Each plays its part in a
 * style the track picks (its key, a chord progression, a drum pattern, a
 * way of comping, a swing) as a song (`FORM`): an intro, verses, choruses
 * with the lead on top, a breakdown and a solo, with a fill into every
 * change.
 *
 * The main title (`metroll`) is a heavy anthem, the guitars wide open. The
 * tracks run from Birmingham's slow tritone riffs, by way of the hair
 * metal of the Strip, thrash, goth, hardcore, death metal's blast beats,
 * black metal's tremolo, a New Orleans funeral dirge, the machines of
 * industrial, nu metal's syncopation and screamo's sing-along, to the
 * festival where all of them end up in a field.
 *
 * The score keeps time for everything else in the game. `beatAt(now)` is how
 * many beats from the downbeat the music is, and the light show and the
 * drops are keyed to it.
 *
 * Nothing in here touches the page: it takes an AudioContext and gives back a
 * scheduler.
 */

const NOTE = (n) => 440 * Math.pow(2, (n - 69) / 12);

/** The scales a lead picks from, in semitones above the key. */
const SCALES = {
  minor: [0, 3, 5, 7, 10, 12, 15, 17],
  major: [0, 2, 4, 7, 9, 12, 14, 16],
  blues: [0, 3, 5, 6, 7, 10, 12, 15],
  dorian: [0, 2, 3, 5, 7, 9, 10, 12],
  phrygian: [0, 1, 3, 5, 7, 8, 10, 12],
  mixolydian: [0, 2, 4, 5, 7, 9, 10, 12],
  harmonic: [0, 2, 3, 5, 7, 8, 11, 12],
  hijaz: [0, 1, 4, 5, 7, 8, 10, 12],
};

/** Each mode's notes, semitones above the key: for keeping a chord's third in the key. */
const KEYS = {
  minor: [0, 2, 3, 5, 7, 8, 10],
  major: [0, 2, 4, 5, 7, 9, 11],
  blues: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  harmonic: [0, 2, 3, 5, 7, 8, 11],
  hijaz: [0, 1, 4, 5, 7, 8, 10],
};

/**
 * Drum patterns on sixteen steps to the bar: where the kick, snare and hat
 * fall. `hat` is every step it plays on, `open` the steps it rings; `ride`
 * plays a ride cymbal instead of the hats, `rim` a rim click, `tom` the toms,
 * `clap` a clap. `lean` plays each hit with fewer layers, so a blast beat
 * stays inside what the audio thread can do.
 */
const DRUMS = {
  rock: { kick: [0, 8, 10], snare: [4, 12], hat: [0, 2, 4, 6, 8, 10, 12, 14], open: [14], kicksLate: [6] },
  drive: { kick: [0, 6, 8], snare: [4, 12], hat: [0, 2, 4, 6, 8, 10, 12, 14], open: [], kicksLate: [10, 14] },
  // Birmingham: slow, heavy, a kick that lands like a dropped anvil.
  heavy: { kick: [0, 8, 10], snare: [4, 12], hat: [0, 4, 8, 12], open: [], kicksLate: [6, 14] },
  // The Strip: a big gated snare with a clap on it, hats on every eighth.
  glam: { kick: [0, 6, 8], snare: [4, 12], clap: [4, 12], hat: [0, 2, 4, 6, 8, 10, 12, 14], open: [14], kicksLate: [10] },
  // The Bay Area: the skank beat, the snare on every off-beat, flat out.
  thrash: { kick: [0, 3, 4, 8, 11, 12], snare: [2, 6, 10, 14], hat: [0, 4, 8, 12], open: [], kicksLate: [14], lean: true },
  // Whitby: tom-toms, a ride, not much else, the dark coming in slowly.
  goth: { kick: [0, 10], snare: [], hat: [], ride: [2, 6, 10, 14], open: [], kicksLate: [], tom: [0, 3, 4, 8, 11, 12], rim: [8], soft: 0.9 },
  // New York: a d-beat, and the breakdown's two-step.
  dbeat: { kick: [0, 6, 8, 14], snare: [4, 12, 15], hat: [0, 2, 4, 6, 8, 10, 12, 14], open: [], kicksLate: [], lean: true },
  // Tampa and Norway: blast beats, the kick and the snare trading sixteenths.
  blast: { kick: [0, 2, 4, 6, 8, 10, 12, 14], snare: [1, 3, 5, 7, 9, 11, 13, 15], hat: [], open: [], kicksLate: [], lean: true },
  // New Orleans: a dirge, a kick every so often, the ride a slow tick.
  doom: { kick: [0, 10], snare: [8], hat: [], ride: [0, 4, 8, 12], open: [], kicksLate: [], soft: 1.05 },
  // Berlin: four on the floor, a clap, a rim click ticking over like a machine.
  industrial: { kick: [0, 4, 8, 12], snare: [4, 12], clap: [4, 12], hat: [2, 6, 10, 14], open: [2, 6, 10, 14], rim: [3, 7, 11, 15], kicksLate: [] },
  // Woodstock: a syncopated groove, the kick off the beat, toms at the end of the bar.
  numetal: { kick: [0, 3, 6, 10, 12], snare: [4, 12], hat: [0, 2, 4, 6, 8, 10, 12, 14], open: [14], kicksLate: [8], tom: [14, 15] },
  // The festival: double bass drums under a snare backbeat and the ride.
  power: { kick: [0, 2, 4, 6, 8, 10, 12, 14], snare: [4, 12], hat: [], ride: [0, 4, 8, 12], open: [], kicksLate: [], lean: true },
  half: { kick: [0, 7, 10], snare: [8], hat: [0, 2, 4, 6, 8, 10, 12, 14], open: [], kicksLate: [] },
  stomp: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [0, 2, 4, 6, 8, 10, 12, 14], open: [], kicksLate: [], clap: [4, 12] },
};

/** How the rhythm part comps: 0 nothing, 1 a short stab or a muted chug, 2 a chord that rings. */
const STRUMS = {
  chug: [2, 0, 1, 1, 1, 0, 1, 1, 2, 0, 1, 1, 1, 0, 1, 1],
  eighths: [2, 0, 1, 0, 1, 0, 1, 0, 2, 0, 1, 0, 1, 0, 1, 0],
  gallop: [2, 0, 1, 1, 2, 0, 1, 1, 2, 0, 1, 1, 2, 0, 1, 1],
  anthem: [2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0],
  sparse: [2, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 1, 0, 1, 0],
  stabs: [2, 0, 0, 1, 0, 0, 2, 0, 0, 1, 0, 0, 2, 0, 1, 0],
  hold: [2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
  whole: [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  // Palm-muted sixteenths with a ring on the beat: the thrash and death-metal engine.
  palm: [2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1],
  // The djent stutter: the chug where you do not expect it.
  djent: [2, 0, 0, 1, 0, 1, 0, 0, 2, 0, 1, 0, 0, 1, 0, 0],
  // A breakdown's one big hit and a handful of little ones.
  breakdown: [2, 0, 0, 0, 1, 1, 0, 0, 2, 0, 0, 0, 1, 0, 2, 0],
};


/**
 * The themes, by name (a track's `look.theme`): key (MIDI of the tonic, low),
 * scale for the lead, a progression (a chord a bar, as semitones above the
 * key), drums, how the `rhythm` part is played (`rhythm`: 'drive', 'clean',
 * 'brass', 'organ', 'strings', 'piano' or 'none') and its `strum` (`mono`
 * keeps the guitars to one side, to leave the drums their room), the `bass` line
 * ('eighths', 'drive', 'octave', 'walk', 'boom', 'bossa' or 'pedal') and its
 * `tone` ('electric' or 'synth'), the lead's riff (steps and scale degrees
 * over two bars) and its voice, how much the off-beats lag (`swing`, 0
 * straight to 0.67 a full triplet), whether the chords take their sevenths,
 * and which extras play.
 */
export const THEMES = {
  // The main title: a heavy anthem, the guitars wide open, the bass driving under them.
  metroll: {
    key: 40, scale: 'minor', prog: [0, 0, 8, 8, 10, 10, 7, 7], drums: 'glam', rhythm: 'drive', strum: 'eighths', bass: 'drive', tone: 'electric',
    riff: [[0, 4, 2], [2, 5, 2], [4, 4, 4], [8, 2, 2], [10, 3, 2], [12, 4, 4], [16, 5, 3], [19, 4, 1], [20, 3, 2], [22, 2, 2], [24, 1, 4], [28, 0, 4]],
    lead: 'shred', gain: 1,
  },
  // Birmingham, 1970: slow, heavy, a tritone on the riff for the first time, and the drums swinging a little behind it.
  brum: {
    key: 40, scale: 'blues', prog: [0, 0, 0, 0, 3, 3, 5, 6], drums: 'heavy', rhythm: 'drive', strum: 'sparse', bass: 'eighths', tone: 'electric', swing: 0.3,
    riff: [[0, 0, 3], [4, 0, 1], [5, 3, 3], [8, 2, 2], [10, 1, 2], [12, 0, 4], [16, 0, 3], [20, 0, 1], [21, 3, 3], [24, 4, 2], [26, 3, 2], [28, 2, 2], [30, 0, 2]],
    lead: 'saw', gain: 1,
  },
  // The Strip, 1986: a major-key anthem, the guitars doubled, a keyboard pad over it, the lead in flashy runs.
  strip: {
    key: 45, scale: 'major', prog: [0, 0, 5, 5, 7, 7, 5, 7], drums: 'glam', rhythm: 'drive', strum: 'eighths', bass: 'drive', tone: 'electric', pad: true,
    riff: [[0, 0, 1], [1, 1, 1], [2, 2, 1], [3, 3, 1], [4, 4, 2], [6, 3, 2], [8, 2, 2], [10, 1, 2], [12, 0, 4], [16, 2, 1], [17, 3, 1], [18, 4, 1], [19, 5, 1], [20, 6, 2], [22, 5, 2], [24, 4, 4], [28, 3, 2], [30, 2, 2]],
    lead: 'shred', gain: 1,
  },
  // The Bay Area, 1986: flat out, palm-muted, chromatic, the snare on the off-beat.
  bay: {
    key: 40, scale: 'phrygian', prog: [0, 0, 1, 0, 0, 0, 3, 1], drums: 'thrash', rhythm: 'drive', strum: 'palm', mono: true, bass: 'drive', tone: 'electric',
    riff: [[0, 0, 1], [1, 0, 1], [2, 1, 1], [3, 0, 1], [4, 3, 2], [6, 2, 1], [7, 1, 1], [8, 0, 1], [9, 0, 1], [10, 1, 1], [11, 0, 1], [12, 4, 2], [14, 3, 2], [16, 0, 1], [17, 1, 1], [18, 2, 1], [19, 3, 1], [20, 4, 1], [21, 3, 1], [22, 2, 1], [23, 1, 1], [24, 0, 4], [28, 1, 2], [30, 0, 2]],
    lead: 'shred', gain: 1,
  },
  // Whitby, 1988: a clean guitar going round, strings and an organ under it, a theremin keening over the top.
  abbey: {
    key: 45, scale: 'harmonic', prog: [0, 0, 8, 8, 5, 5, 7, 7], drums: 'goth', rhythm: 'clean', strum: 'sparse', bass: 'octave', tone: 'electric', pad: true, arp: true,
    riff: [[0, 4, 4], [4, 5, 2], [6, 4, 2], [8, 2, 6], [14, 3, 2], [16, 4, 4], [20, 6, 2], [22, 5, 2], [24, 4, 6], [30, 2, 2]],
    lead: 'theremin', gain: 1, drumLevel: 1.2,
  },
  // New York, 1989: a d-beat, power chords, a raw square lead, over before you noticed.
  nyc: {
    key: 38, scale: 'minor', prog: [0, 0, 3, 3, 5, 5, 3, 7], drums: 'dbeat', rhythm: 'drive', strum: 'eighths', mono: true, bass: 'drive', tone: 'electric',
    riff: [[0, 4, 2], [2, 4, 1], [3, 3, 1], [4, 2, 2], [6, 0, 2], [8, 4, 2], [10, 4, 1], [11, 5, 1], [12, 4, 2], [14, 2, 2], [16, 0, 4], [20, 0, 2], [22, 2, 2], [24, 4, 4], [28, 2, 2], [30, 0, 2]],
    lead: 'square', gain: 1,
  },
  // Tampa, 1991: blast beats, the lowest guitars there are, the riff as chromatic as a bad dream.
  swamp: {
    key: 36, scale: 'phrygian', prog: [0, 0, 1, 1, 0, 0, 6, 1], drums: 'blast', rhythm: 'drive', strum: 'palm', mono: true, bass: 'drive', tone: 'electric',
    riff: [[0, 0, 2], [2, 1, 1], [3, 0, 1], [4, 3, 2], [6, 2, 2], [8, 0, 2], [10, 1, 1], [11, 2, 1], [12, 3, 2], [14, 4, 2], [16, 0, 4], [20, 1, 2], [22, 0, 2], [24, 3, 2], [26, 2, 2], [28, 1, 2], [30, 0, 2]],
    lead: 'growl', gain: 1.1,
  },
  // Norway, 1993: tremolo-picked, high and cold, the blast beat under it and a pad like snow.
  fjord: {
    key: 33, scale: 'harmonic', prog: [0, 0, 3, 3, 5, 5, 7, 7], drums: 'blast', rhythm: 'drive', strum: 'hold', mono: true, bass: 'pedal', tone: 'electric', pad: true,
    riff: [[0, 4, 1], [1, 4, 1], [2, 4, 1], [3, 4, 1], [4, 5, 1], [5, 5, 1], [6, 5, 1], [7, 5, 1], [8, 6, 1], [9, 6, 1], [10, 6, 1], [11, 6, 1], [12, 5, 1], [13, 5, 1], [14, 4, 1], [15, 4, 1], [16, 4, 1], [17, 4, 1], [18, 4, 1], [19, 4, 1], [20, 3, 2], [22, 2, 2], [24, 4, 1], [25, 4, 1], [26, 4, 1], [27, 4, 1], [28, 2, 2], [30, 1, 2]],
    lead: 'saw', gain: 1,
  },
  // New Orleans, 1991: a funeral, the brass band's dirge with the guitars coming in underneath it, one riff, very slowly.
  bayou: {
    key: 33, scale: 'blues', prog: [0, 0, 0, 0, 3, 3, 5, 5], drums: 'doom', rhythm: 'brass', strum: 'hold', bass: 'pedal', tone: 'electric', guitars: true, pad: true,
    riff: [[0, 3, 8], [8, 2, 6], [14, 1, 2], [16, 0, 10], [26, 1, 2], [28, 2, 4]],
    lead: 'muted', gain: 1.1, drumLevel: 1.1,
  },
  // Berlin, 1996: four on the floor, a synth bass ticking over, an arpeggio like a machine, a hard square lead.
  powerplant: {
    key: 35, scale: 'phrygian', prog: [0, 0, 0, 0, 1, 1, 0, 6], drums: 'industrial', rhythm: 'drive', strum: 'stabs', mono: true, bass: 'octave', tone: 'synth', arp: true, pad: true,
    riff: [[0, 0, 1], [2, 0, 1], [4, 1, 1], [6, 0, 1], [8, 3, 2], [10, 2, 2], [12, 1, 2], [14, 0, 2], [16, 0, 1], [18, 0, 1], [20, 1, 1], [22, 0, 1], [24, 4, 2], [26, 3, 2], [28, 1, 2], [30, 0, 2]],
    lead: 'square', gain: 1,
  },
  // Woodstock, 1999: a syncopated stutter of a riff, the bass up front, the lead sparse and sour.
  airfield: {
    key: 38, scale: 'minor', prog: [0, 0, 0, 3, 0, 0, 5, 3], drums: 'numetal', rhythm: 'drive', strum: 'djent', mono: true, bass: 'eighths', tone: 'electric',
    riff: [[0, 0, 2], [3, 0, 1], [5, 2, 1], [8, 0, 2], [11, 3, 1], [13, 2, 1], [16, 0, 2], [19, 0, 1], [21, 3, 1], [24, 4, 3], [28, 3, 2], [30, 2, 2]],
    lead: 'tube', gain: 1,
  },
  // Warped Tour, 2005: a sing-along over fast power chords, the bridge a breakdown.
  fairground: {
    key: 36, scale: 'major', prog: [9, 9, 5, 5, 0, 0, 7, 7], drums: 'drive', rhythm: 'drive', strum: 'eighths', mono: true, bass: 'drive', tone: 'electric', guitars: true,
    riff: [[0, 4, 2], [2, 5, 2], [4, 4, 4], [8, 2, 2], [10, 3, 2], [12, 2, 4], [16, 4, 2], [18, 5, 2], [20, 6, 4], [24, 5, 2], [26, 4, 2], [28, 2, 4]],
    lead: 'tube', gain: 1,
  },
  // Wacken: the last night, all of them at once: double bass drums, a gallop, brass and a keyboard pad, a shredder over the top.
  festival: {
    key: 38, scale: 'dorian', prog: [0, 0, 7, 7, 9, 9, 5, 7], drums: 'power', rhythm: 'brass', strum: 'stabs', bass: 'drive', tone: 'electric', guitars: true, pad: true,
    riff: [[0, 4, 2], [2, 5, 2], [4, 6, 4], [8, 5, 2], [10, 4, 2], [12, 2, 4], [16, 3, 2], [18, 4, 2], [20, 5, 4], [24, 6, 2], [26, 7, 2], [28, 5, 4]],
    lead: 'shred', gain: 1.05,
  },
};

/**
 * A song, in bars: an intro that builds, a verse, the chorus, a second verse
 * with the riff answered, the chorus again, a half-time breakdown, a solo, and
 * the chorus once more, the riff up an octave. Then round again.
 */
const FORM = [['intro', 4], ['verse', 8], ['chorus', 8], ['verse', 8], ['chorus', 8], ['break', 4], ['solo', 4], ['chorus', 8]];
const FORM_LENGTH = FORM.reduce((n, [, l]) => n + l, 0);

/** A distortion: a soft clip that gets harder as `k` goes up. */
function distortion(k = 40) {
  const n = 1024;
  const curve = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    curve[i] = ((3 + k) * x * 0.35) / (Math.PI + k * Math.abs(x) * 0.35);
  }
  return curve;
}

/** A little room: two channels of noise dying away over `seconds`. */
function room(ctx, seconds = 0.9, decay = 3) {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const data = buffer.getChannelData(c);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
  }
  return buffer;
}

/**
 * How far ahead of the audio clock the score's bars are scheduled, in
 * seconds. The scheduler runs on the page's main thread, which can be held up
 * by a long frame or a background bake; this much in hand rides that out.
 */
export const LOOKAHEAD = 4;

/** Where the lead plays, in semitones over the key (a low tonic): two octaves up, in the middle of the band, not over it. */
const LEAD = 24;

/** The chord on `shift` (semitones above the key) in `theme`'s key: its notes above its root. */
export function chordOf(theme, shift) {
  const key = KEYS[theme.scale] ?? KEYS.minor;
  const has = (n) => key.includes(((shift + n) % 12 + 12) % 12);
  // The five of a minor key takes a major third, if the theme wants its dominant.
  const third = theme.dominant && shift === 7 ? 4 : has(4) ? 4 : 3;
  const fifth = has(7) || !has(6) ? 7 : 6;
  if (!theme.sevenths) return [0, third, fifth];
  const seventh = theme.dominant && shift === 7 ? 10 : third === 4 && has(11) ? 11 : 10;
  return [0, third, fifth, seventh];
}

export function createBand(ctx, out, noise) {
  // The bus: everything through a compressor, a little of it through the room.
  const bus = ctx.createGain();
  // A little headroom into the compressor, so the busiest choruses don't touch the ceiling.
  bus.gain.value = 0.85;
  const glue = ctx.createDynamicsCompressor();
  glue.threshold.value = -16;
  glue.knee.value = 12;
  glue.ratio.value = 4;
  glue.attack.value = 0.006;
  glue.release.value = 0.18;
  const verb = ctx.createConvolver();
  verb.buffer = room(ctx);
  const wet = ctx.createGain();
  wet.gain.value = 0.16;
  // And a limiter on the end, so a loud chorus can't clip.
  const limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = -4;
  limiter.knee.value = 0;
  limiter.ratio.value = 20;
  limiter.attack.value = 0.001;
  limiter.release.value = 0.08;
  // The top end taken down a little and rolled off above the cymbals, so nothing up there is shrill.
  const air = ctx.createBiquadFilter();
  air.type = 'highshelf'; air.frequency.value = 6000; air.gain.value = -3;
  const roof = ctx.createBiquadFilter();
  roof.type = 'lowpass'; roof.frequency.value = 11000; roof.Q.value = 0.5;
  bus.connect(air).connect(roof).connect(glue);
  bus.connect(verb).connect(wet).connect(glue);
  glue.connect(limiter).connect(out);

  const curve = distortion(46);
  const curveLead = distortion(22);

  let target = bus;
  /** How loud the drums are against everything else, for this song. */
  let drumLevel = 1;
  /** Whether the drums are playing a fast pattern, each hit with fewer layers. */
  let lean = false;
  const env = (g, when, peak, attack, hold, release) => {
    g.gain.setValueAtTime(0.0001, when);
    g.gain.linearRampToValueAtTime(peak, when + attack);
    g.gain.setValueAtTime(peak, when + attack + hold);
    g.gain.exponentialRampToValueAtTime(0.0001, when + attack + hold + release);
    return when + attack + hold + release + 0.04;
  };
  const osc = (type, freq, when, end, dest, detune = 0) => {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, when);
    o.detune.value = detune;
    o.connect(dest);
    o.start(when);
    o.stop(end);
    return o;
  };
  const voice = (level = 1) => {
    const g = ctx.createGain();
    g.gain.value = level;
    g.connect(target);
    return g;
  };
  /**
   * A burst of noise through a filter. The filters are shared, one for each
   * sound of the kit, made once a song: a hit only adds its source and its
   * envelope (a sweep, `to`, needs a filter of its own).
   */
  let filters = new Map();
  const shared = (type, freq, q) => {
    const key = `${type} ${freq} ${q}`;
    if (!filters.has(key)) {
      const f = ctx.createBiquadFilter();
      f.type = type; f.frequency.value = freq; f.Q.value = q;
      f.connect(target);
      filters.set(key, f);
    }
    return filters.get(key);
  };
  const noiseHit = (when, { freq = 1000, type = 'bandpass', q = 1, level = 0.3, length = 0.1, to = null }) => {
    const s = ctx.createBufferSource();
    s.buffer = noise;
    const g = ctx.createGain();
    g.gain.setValueAtTime(level * drumLevel, when);
    g.gain.exponentialRampToValueAtTime(0.0001, when + length);
    if (to) {
      const f = ctx.createBiquadFilter();
      f.type = type;
      f.frequency.setValueAtTime(freq, when);
      f.frequency.exponentialRampToValueAtTime(to, when + length);
      f.Q.value = q;
      f.connect(target);
      g.connect(f);
    } else g.connect(shared(type, freq, q));
    s.connect(g);
    s.start(when, Math.random() * 0.4);
    s.stop(when + length + 0.05);
  };

  // ——— the kit.
  function kick(when, level = 1) {
    level *= drumLevel;
    const g = voice();
    const end = env(g, when, 1.0 * level, 0.002, 0.03, 0.28);
    const o = osc('sine', 150, when, end, g);
    o.frequency.exponentialRampToValueAtTime(48, when + 0.09);
    // The beater's click on top (not for a blast beat).
    if (!lean) noiseHit(when, { freq: 3000, type: 'highpass', q: 0.7, level: 0.12 * level / drumLevel, length: 0.012 });
  }
  function snare(when, level = 1) {
    noiseHit(when, { freq: 1800, type: 'bandpass', q: 0.7, level: 0.55 * level, length: 0.17 });
    // The wires, under the crack.
    if (!lean) noiseHit(when, { freq: 4500, type: 'highpass', q: 0.7, level: 0.18 * level, length: 0.13 });
    const g = voice();
    const end = env(g, when, 0.42 * level * drumLevel, 0.001, 0.01, 0.11);
    const o = osc('triangle', 230, when, end, g);
    o.frequency.exponentialRampToValueAtTime(150, when + 0.09);
  }
  /** Brushes on the snare: a soft swish, a little slap. */
  function brush(when, level = 1) {
    noiseHit(when, { freq: 3200, type: 'bandpass', q: 0.5, level: 0.22 * level, length: 0.16, to: 1800 });
    noiseHit(when, { freq: 1600, type: 'bandpass', q: 0.9, level: 0.12 * level, length: 0.05 });
  }
  function clap(when, level = 1) {
    for (let i = 0; i < 3; i++) noiseHit(when + i * 0.011, { freq: 1500, type: 'bandpass', q: 1.2, level: 0.28 * level, length: 0.07 });
  }
  function hat(when, level = 1, open = false) {
    noiseHit(when, { freq: 7000, type: 'highpass', q: 0.7, level: 0.3 * level, length: open ? 0.28 : 0.04 });
  }
  /** A ride cymbal: a ping with a long shimmer under it. */
  function ride(when, level = 1) {
    noiseHit(when, { freq: 6500, type: 'bandpass', q: 1.4, level: 0.2 * level, length: 0.45 });
    noiseHit(when, { freq: 5000, type: 'highpass', q: 0.6, level: 0.06 * level, length: 0.8 });
  }
  /** A rim click: a short dry knock. */
  function rim(when, level = 1) {
    noiseHit(when, { freq: 1700, type: 'bandpass', q: 5, level: 0.4 * level, length: 0.03 });
  }
  function tom(when, pitch = 120, level = 1) {
    const g = voice();
    const end = env(g, when, 0.6 * level * drumLevel, 0.002, 0.02, 0.28);
    const o = osc('sine', pitch * 1.6, when, end, g);
    o.frequency.exponentialRampToValueAtTime(pitch, when + 0.12);
    noiseHit(when, { freq: 900, type: 'bandpass', level: 0.1 * level, length: 0.05 });
  }
  function crash(when, level = 1) {
    noiseHit(when, { freq: 4000, type: 'highpass', q: 0.5, level: 0.26 * level, length: 1.3 });
    noiseHit(when, { freq: 7000, type: 'bandpass', q: 0.8, level: 0.12 * level, length: 0.8 });
  }

  // ——— the rhythm section.
  /**
   * The guitar rigs, built once a song: each a distortion into a cabinet (a
   * high pass, a mid push, a low pass) and panned to its side, and a clean
   * rig beside it (a high pass and a low pass, a touch of tremolo). A strum
   * only adds its oscillators and their envelope; the rig is shared, so a
   * busy bar costs a few oscillators, not a few dozen filters.
   */
  const rig = (pan) => {
    const input = ctx.createGain();
    const shape = ctx.createWaveShaper();
    shape.curve = curve;
    shape.oversample = '2x';
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass'; hp.frequency.value = 90;
    const mid = ctx.createBiquadFilter();
    mid.type = 'peaking'; mid.frequency.value = 900; mid.gain.value = 4; mid.Q.value = 0.8;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 3800; lp.Q.value = 0.5;
    const p = ctx.createStereoPanner();
    p.pan.value = pan;
    const out = ctx.createGain();
    out.gain.value = 0.17;
    input.connect(shape).connect(hp).connect(mid).connect(lp).connect(p).connect(out).connect(target);
    // The clean side: no distortion, a brighter top, and a slow tremolo on the level.
    const clean = ctx.createGain();
    const chp = ctx.createBiquadFilter();
    chp.type = 'highpass'; chp.frequency.value = 120;
    const clp = ctx.createBiquadFilter();
    clp.type = 'lowpass'; clp.frequency.value = 2600;
    const cp = ctx.createStereoPanner();
    cp.pan.value = pan * 0.7;
    const cout = ctx.createGain();
    cout.gain.value = 0.3;
    clean.connect(chp).connect(clp).connect(cp).connect(cout).connect(target);
    return { input, out, clean, cout };
  };
  /** The rigs of the song now playing (see `fresh`). */
  let rigs = null;

  /** A guitar through the distortion: a power chord (root, fifth, octave) of detuned saws, into one of the rigs. */
  function guitar(when, root, length, { open = false, side = 0, level = 1 } = {}) {
    const gain = ctx.createGain();
    gain.connect(rigs[side].input);
    const hold = open ? Math.max(0.1, length - 0.05) : 0.03;
    const end = env(gain, when, level, 0.003, hold, open ? 0.35 : 0.05);
    [root, root + 7, root + 12].forEach((n, i) => {
      osc('sawtooth', NOTE(n), when, end, gain, i % 2 ? 5 : -5);
      if (i === 0) osc('sawtooth', NOTE(n), when, end, gain, side ? 9 : -9);
    });
  }

  /** A clean guitar, or (`twang`) a bright one with a quick bend into the note: the chord, plucked. */
  function cleanGuitar(when, notes, length, { open = false, side = 0, level = 1, twang = false } = {}) {
    const gain = ctx.createGain();
    gain.connect(rigs[side].clean);
    const end = env(gain, when, 0.5 * level, 0.002, open ? Math.max(0.05, length * 0.4) : 0.02, open ? 0.5 : 0.08);
    notes.forEach((n, i) => {
      const o = osc(twang ? 'sawtooth' : 'triangle', NOTE(n), when + i * 0.006, end, gain, side ? 4 : -4);
      if (twang) o.detune.setValueAtTime(-40, when + i * 0.006);
      if (twang) o.detune.linearRampToValueAtTime(0, when + i * 0.006 + 0.05);
    });
  }

  /** A piano: each note a hammer's strike, a bright attack and a long fall, the octave above faint. */
  function piano(when, notes, length, level = 1) {
    for (const n of notes) {
      const g = voice(0.11 * level);
      const end = env(g, when, 1, 0.003, 0.02, Math.min(1.6, 0.25 + length * 1.2));
      osc('triangle', NOTE(n), when, end, g);
      const shimmer = ctx.createGain();
      shimmer.gain.value = 0.25;
      shimmer.connect(g);
      osc('sine', NOTE(n) * 2, when, end, shimmer, 3);
    }
  }

  /** Brass: a chord of saws through a filter that opens on the attack and settles, a little behind the beat. */
  function brass(when, notes, length, level = 1) {
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass'; f.Q.value = 1.5;
    f.frequency.setValueAtTime(600, when);
    f.frequency.exponentialRampToValueAtTime(2200, when + 0.05);
    f.frequency.exponentialRampToValueAtTime(1100, when + 0.05 + Math.max(0.05, length * 0.5));
    const g = voice(0.07 * level);
    f.connect(g);
    const end = env(g, when, 1, 0.03, Math.max(0.03, length * 0.6), 0.12);
    for (const n of notes) {
      osc('sawtooth', NOTE(n), when, end, f, -6);
      osc('sawtooth', NOTE(n), when, end, f, 7);
    }
  }

  /** An organ: drawbars of sine and square, held, with the wobble of a spinning speaker. */
  function organ(when, notes, length, level = 1) {
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = 2200;
    const g = voice(0.05 * level);
    f.connect(g);
    const end = env(g, when, 1, 0.04, Math.max(0.05, length * 0.85), 0.25);
    const wob = ctx.createOscillator();
    wob.frequency.value = 6.2;
    const depth = ctx.createGain();
    depth.gain.value = 9;
    wob.connect(depth);
    for (const n of notes) {
      const a = osc('sine', NOTE(n), when, end, f);
      const b = osc('triangle', NOTE(n + 12), when, end, f);
      depth.connect(a.detune); depth.connect(b.detune);
    }
    wob.start(when); wob.stop(end);
  }

  /** Strings: detuned saws with a slow bow, or (short) a sawing stroke. */
  function strings(when, notes, length, level = 1) {
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = 1600;
    const g = voice(0.045 * level);
    f.connect(g);
    const short = length < 0.25;
    const end = env(g, when, 1, short ? 0.015 : 0.12, Math.max(0.02, length * (short ? 0.5 : 0.7)), short ? 0.08 : 0.3);
    for (const n of notes) for (const d of [-7, 7]) osc('sawtooth', NOTE(n), when, end, f, d);
  }

  /** The bass: an electric (a filtered saw over a sine), an upright (a plucked sine and triangle) or a synth (a square through a squelch). */
  function bass(when, note, length, level = 1, tone = 'electric') {
    if (tone === 'upright') {
      const g = voice(0.95 * level);
      const end = env(g, when, 1, 0.004, Math.max(0.02, length * 0.3), Math.max(0.12, length * 0.7));
      osc('sine', NOTE(note), when, end, g);
      const body = ctx.createGain();
      body.gain.value = 0.35;
      body.connect(g);
      osc('triangle', NOTE(note), when, end, body);
      noiseHit(when, { freq: 600, type: 'bandpass', q: 2, level: 0.05, length: 0.02 });
      return;
    }
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    if (tone === 'synth') {
      f.Q.value = 7;
      f.frequency.setValueAtTime(1600, when);
      f.frequency.exponentialRampToValueAtTime(180, when + 0.16);
    } else {
      f.frequency.setValueAtTime(900, when);
      f.frequency.exponentialRampToValueAtTime(260, when + 0.18);
    }
    const g = voice(0.72 * level);
    f.connect(g);
    const end = env(g, when, 1, 0.005, Math.max(0.02, length * 0.55), 0.09);
    osc(tone === 'synth' ? 'square' : 'sawtooth', NOTE(note), when, end, f);
    osc('sine', NOTE(note - 12), when, end, g);
  }

  /** The lead's rig: a milder distortion (or none, for the clean voices), a filter, and an echo with feedback. */
  let leadRig = null;
  const makeLeadRig = () => {
    const input = ctx.createGain();
    const clean = ctx.createGain();
    const shape = ctx.createWaveShaper();
    shape.curve = curveLead;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 3200;
    const out = ctx.createGain();
    out.gain.value = 0.2;
    input.connect(shape).connect(lp).connect(out);
    clean.connect(lp);
    const echo = ctx.createDelay(1);
    echo.delayTime.value = 0.3;
    const fb = ctx.createGain();
    fb.gain.value = 0.28;
    const send = ctx.createGain();
    send.gain.value = 0.35;
    lp.connect(send).connect(echo);
    echo.connect(fb).connect(echo);
    echo.connect(out);
    out.connect(target);
    return { input, clean, out, lp };
  };

  /**
   * A song's own output and rigs: what it plays goes through these, so when
   * it stops and fades, all of it fades, and the next song starts clean.
   */
  const fresh = () => {
    target = ctx.createGain();
    target.connect(bus);
    filters = new Map();
    rigs = [rig(-0.6), rig(0.6)];
    leadRig = makeLeadRig();
    return target;
  };

  /** The note the lead last played, for the theremin to slide from. */
  let lastLead = null;

  /**
   * The lead: a single line, in its voice. The rock voices ('saw', 'square',
   * 'tube', 'shred', 'growl') go through the lead's distortion; the rest are
   * played clean: a trumpet ('trumpet', muted for a funeral as 'muted'), a
   * theremin sliding from note to note, and vibes, struck and shimmering.
   */
  function lead(when, note, length, kind = 'saw', level = 1) {
    const gain = ctx.createGain();
    const rock = kind === 'saw' || kind === 'square' || kind === 'tube' || kind === 'shred' || kind === 'growl';
    gain.connect(rock ? leadRig.input : leadRig.clean);
    const vibrato = (oscs, rate, cents, delay) => {
      const vib = ctx.createOscillator();
      vib.frequency.value = rate;
      const depth = ctx.createGain();
      depth.gain.setValueAtTime(0, when);
      depth.gain.linearRampToValueAtTime(cents, when + delay);
      vib.connect(depth);
      for (const o of oscs) depth.connect(o.detune);
      vib.start(when);
      return vib;
    };
    if (rock) {
      const end = env(gain, when, level, 0.012, Math.max(0.05, length * 0.8), 0.14);
      const type = kind === 'square' || kind === 'growl' ? 'square' : 'sawtooth';
      leadRig.lp.frequency.setValueAtTime(kind === 'tube' ? 2000 : kind === 'shred' ? 3800 : kind === 'growl' ? 1000 : 2600, when);
      const a = osc(type, NOTE(note), when, end, gain, -7);
      const b = osc(type, NOTE(note), when, end, gain, 7);
      if (kind === 'growl') {
        // The growl: a low note that sags as it is held, with grit on it.
        a.detune.setValueAtTime(0, when); a.detune.linearRampToValueAtTime(-60, when + Math.max(0.1, length));
        noiseHit(when, { freq: 600, type: 'bandpass', q: 1.2, level: 0.05, length: Math.min(0.3, length) });
      } else vibrato([a, b], kind === 'shred' ? 6.4 : 5.2, kind === 'shred' ? 24 : 14, kind === 'shred' ? 0.12 : 0.25).stop(end);
      lastLead = note;
      return;
    }
    leadRig.lp.frequency.setValueAtTime(kind === 'muted' ? 1600 : kind === 'theremin' ? 3000 : 2500, when);
    if (kind === 'vibes') {
      const end = env(gain, when, 3.2 * level, 0.002, 0.02, Math.min(1.4, 0.3 + length));
      const a = osc('sine', NOTE(note), when, end, gain);
      const bell = ctx.createGain();
      bell.gain.value = 0.18;
      bell.connect(gain);
      osc('sine', NOTE(note) * 4, when, end, bell);
      // The fans in the bars, turning: a tremolo.
      const trem = ctx.createOscillator();
      trem.frequency.value = 5.5;
      const depth = ctx.createGain();
      depth.gain.value = 0.6 * level;
      trem.connect(depth).connect(gain.gain);
      trem.start(when); trem.stop(end);
      void a;
    } else if (kind === 'theremin') {
      const end = env(gain, when, 2.4 * level, 0.08, Math.max(0.05, length * 0.85), 0.2);
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(NOTE(lastLead ?? note), when);
      o.frequency.exponentialRampToValueAtTime(NOTE(note), when + Math.min(0.2, length * 0.5));
      o.connect(gain);
      o.start(when); o.stop(end);
      vibrato([o], 6.5, 28, 0.15).stop(end);
    } else {
      // A trumpet, bright (or muted, nasal: a funeral's).
      const f = ctx.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.setValueAtTime(kind === 'muted' ? 1300 : 1400, when);
      f.Q.value = kind === 'muted' ? 3 : 1.1;
      f.connect(gain);
      const end = env(gain, when, 1.8 * level, 0.025, Math.max(0.04, length * 0.8), 0.14);
      const a = osc('sawtooth', NOTE(note), when, end, f, -3);
      const b = osc('sawtooth', NOTE(note), when, end, f, 4);
      // Scooping up into the note, as a horn does.
      a.detune.setValueAtTime(-40, when);
      a.detune.linearRampToValueAtTime(-3, when + 0.06);
      vibrato([a, b], 5.4, 12, 0.3).stop(end);
    }
    lastLead = note;
  }

  /** A synth arpeggio and pad: saws through a filter that opens and closes. */
  function arp(when, note, length, level = 1) {
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass'; f.Q.value = 3;
    f.frequency.setValueAtTime(450, when);
    f.frequency.exponentialRampToValueAtTime(1800, when + length * 0.6);
    const g = voice(0.05 * level);
    f.connect(g);
    const end = env(g, when, 1, 0.003, length * 0.4, length * 0.5);
    osc('sawtooth', NOTE(note), when, end, f, -8);
    osc('triangle', NOTE(note), when, end, f, 8);
  }
  function pad(when, notes, length, level = 1) {
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = 1000;
    const g = voice(0.03 * level);
    f.connect(g);
    const end = env(g, when, 1, length * 0.3, length * 0.3, length * 0.5);
    for (const n of notes) for (const d of [-8, 8]) osc('sawtooth', NOTE(n), when, end, f, d);
  }

  let playing = null;

  /** Where bar `bar` falls in the song: its section, how far into it, and which time round that section is. */
  function placeOf(bar) {
    let at = bar % FORM_LENGTH;
    const seen = {};
    for (const [name, length] of FORM) {
      if (at < length) return { name, of: at, length, time: seen[name] ?? 0 };
      seen[name] = (seen[name] ?? 0) + 1;
      at -= length;
    }
    return { name: 'verse', of: 0, length: 8, time: 0 };
  }

  /** Bar `bar` of `theme` from time `when`, at `tempo`: what each of the band plays, by where it is in the song. */
  function playBar(theme, tempo, bar, when) {
    const beat = 60 / tempo;
    const step = beat / 4;
    // Swung, the off-beat eighths come late, toward the triplet.
    const swing = theme.swing ?? 0;
    const at = (i) => when + step * i + (i % 4 === 2 ? swing * step : i % 2 === 1 ? swing * step * 0.5 : 0);
    const { name, of, length, time } = placeOf(bar);
    const phrase = of % 8;
    const last = of === length - 1;
    const loud = name === 'chorus' || name === 'solo';
    const drums = DRUMS[theme.drums] ?? DRUMS.rock;
    const soft = drums.soft ?? 1;
    drumLevel = theme.drumLevel ?? 1;
    lean = Boolean(drums.lean);
    const shift = theme.prog[phrase] ?? 0;
    const next = theme.prog[(phrase + 1) % 8] ?? 0;
    const root = theme.key + shift;
    const level = theme.gain ?? 1;
    const chord = chordOf(theme, shift);
    const third = chord[1];

    // ——— drums.
    if (name === 'intro') {
      // A build: kick and hats (or the ride), the snare joining halfway, a roll into the verse.
      for (let i = 0; i < 16; i++) {
        const t = at(i);
        if (last && i >= 8) { (drums.brush ? brush : snare)(t, 0.4 + ((i - 8) / 8) * 0.7); continue; }
        if (i % 4 === 0) kick(t, 0.9 * soft);
        if (drums.ride) { if (drums.ride.includes(i)) ride(t, 0.8); } else if (i % 2 === 0) hat(t, (i % 4 === 0 ? 0.8 : 0.55) * soft);
        if (of >= length / 2 && (i === 4 || i === 12)) (drums.brush ? brush : snare)(t, 0.85);
      }
    } else if (name === 'break') {
      // Half time: the kick on one, the snare on three, the ride (or the hats) on the quarters.
      for (let i = 0; i < 16; i++) {
        const t = at(i);
        if (last && i >= 12) { if (i % 2 === 0) tom(t, [170, 120][(i - 12) / 2]); continue; }
        if (i === 0 || i === 10) kick(t, soft);
        if (i === 8) (drums.brush ? brush : snare)(t, 1.05);
        if (i % 4 === 0) (drums.ride ? ride : hat)(t, 0.75, i === 4);
      }
    } else {
      for (let i = 0; i < 16; i++) {
        const t = at(i);
        if (last && i >= 12) {
          // A roll down the toms into the next section.
          if (i % 2 === 0) tom(t, [190, 150, 120, 95][(i - 12) / 2], 0.9);
          if (i === 12) kick(t, soft);
          continue;
        }
        if (drums.kick.includes(i) || (loud && drums.kicksLate.includes(i))) kick(t, (i === 0 ? 1 : 0.85) * soft);
        if (drums.snare.includes(i)) {
          const accent = drums.accent ? (drums.accent.includes(i) ? 1.1 : 0.55) : loud ? 1.05 : 0.95;
          (drums.brush ? brush : snare)(t, accent);
        }
        if (drums.clap?.includes(i)) clap(t, 0.9);
        if (drums.rim?.includes(i)) rim(t, 0.8);
        // Taiko: a big low drum, struck.
        if (drums.tom?.includes(i)) tom(t, i % 4 === 3 ? 95 : 70, 0.95);
        if (drums.ride?.includes(i)) ride(t, i % 4 === 0 ? 0.9 : 0.6);
        if (drums.hat.includes(i)) hat(t, (i % 4 === 0 ? 1 : 0.7) * (drums.ride ? 0.6 : soft), drums.open.includes(i) && loud);
      }
    }
    if (of === 0 && name !== 'intro') crash(when, (loud ? 1 : 0.8) * soft);
    if (bar % FORM_LENGTH === 0) crash(when, 0.6 * soft);

    // ——— bass.
    const bassNote = root + 12;
    const tone = theme.tone ?? 'electric';
    if (name === 'intro' && of < length / 2) {
      // Not yet.
    } else if (name === 'break' || theme.bass === 'pedal') {
      bass(when, bassNote, beat * (name === 'break' ? 3.5 : 3.8), 1, tone);
    } else if (theme.bass === 'octave') {
      for (let i = 0; i < 16; i += 2) bass(at(i), bassNote + (i % 4 === 2 ? 12 : 0), step * 2, 0.95, tone);
    } else if (theme.bass === 'walk') {
      // A walk up the chord and back, stepping into the next bar's root.
      const walk = [0, 0, third, 5, 7, 5, third, (next - shift + 12) % 12 === 0 ? 2 : next - shift - 1];
      for (let i = 0; i < 8; i++) bass(at(2 * i), bassNote + walk[i], step * 2, i === 0 ? 1 : 0.9, tone);
    } else if (theme.bass === 'drive') {
      // Eighth notes on the root, pumping, the last one stepping up or down into the next chord.
      const into = next === shift ? 0 : next - shift > 0 && next - shift <= 6 ? next - shift - 2 : next - shift + 1;
      for (let i = 0; i < 16; i += 2) {
        const n = i === 14 && into ? bassNote + into : bassNote + (i === 6 && loud ? 12 : 0);
        bass(at(i), n, step * 1.5, i === 0 ? 1.08 : i % 4 === 0 ? 0.95 : 0.85, tone);
      }
    } else if (theme.bass === 'boom') {
      // Oom-pah: the root on one and three, the fifth below on two and four.
      for (let i = 0; i < 4; i++) bass(at(i * 4), bassNote + (i % 2 ? -5 : 0), beat * 0.8, i % 2 ? 0.85 : 1, tone);
    } else if (theme.bass === 'bossa') {
      for (const [i, n] of [[0, 0], [6, 7], [8, 0], [14, 7]]) bass(at(i), bassNote + n - (n ? 12 : 0), step * 2, 0.9, tone);
    } else {
      for (let i = 0; i < 16; i += 2) bass(at(i), bassNote, step * 1.6, i === 0 ? 1.05 : 0.9, tone);
    }

    // ——— the rhythm part: the chord, comped, by whoever is playing it.
    const kind = theme.rhythm ?? 'drive';
    // The chords an octave over the bass, under the lead.
    const voicing = chord.map((n) => root + 12 + n);
    const comp = (t, len, open, g) => {
      if (kind === 'drive') {
        guitar(t, root + 12, len, { open, side: 0, level: level * g * (theme.mono ? 1.3 : 1) });
        if (!theme.mono) guitar(t + 0.007, root + 12, len, { open, side: 1, level: level * g });
      } else if (kind === 'clean' || kind === 'twang') {
        cleanGuitar(t, voicing, len, { open, side: 0, level: level * g, twang: kind === 'twang' });
        if (kind === 'twang') cleanGuitar(t + 0.009, voicing, len, { open, side: 1, level: level * g * 0.6, twang: true });
      } else if (kind === 'piano') piano(t, open ? [root, ...voicing] : voicing, len, level * g);
      else if (kind === 'brass') brass(t, voicing.map((n) => n + 12), len, level * g);
      else if (kind === 'organ') organ(t, voicing, len, level * g);
      else if (kind === 'strings') strings(t, voicing.map((n) => n + 12), len, level * g);
    };
    if (kind === 'none') {
      // Nothing.
    } else if (name === 'intro') {
      // One chord, left to ring, on the first bar of each half.
      if (of % 2 === 0) comp(when, beat * 7.5, true, 0.85);
    } else if (name === 'break') {
      comp(when, beat * 3.8, true, 0.8);
    } else {
      const strum = STRUMS[theme.strum] ?? STRUMS.chug;
      const g = loud ? 1.05 : 0.9;
      for (let i = 0; i < 16; i++) {
        const hit = strum[i];
        if (!hit) continue;
        const len = hit === 2 ? step * (theme.strum === 'anthem' || theme.strum === 'hold' || theme.strum === 'whole' ? (theme.strum === 'whole' ? 15 : 5) : 3.2) : step * 0.9;
        comp(at(i), len, hit === 2, g);
      }
    }
    // The main title's guitars, over the piano, from the first chorus on.
    if (theme.guitars && loud) {
      for (let i = 0; i < 16; i += theme.mono ? 4 : 2) {
        guitar(at(i), root + 12, step * 1.8, { open: i % 8 === 0, side: 0, level: level * 0.55 });
        guitar(at(i) + 0.007, root + 12, step * 1.8, { open: i % 8 === 0, side: 1, level: level * 0.55 });
      }
    }

    // ——— the lead.
    const scale = SCALES[theme.scale] ?? SCALES.minor;
    const riff = (up, g, from = 0) => {
      for (const [s, degree, len] of theme.riff) {
        if (s < from * 16 || s >= from * 16 + 16) continue;
        lead(at(s - from * 16), theme.key + LEAD + up + scale[degree % scale.length], step * len, theme.lead, level * g);
      }
    };
    if (name === 'chorus') {
      // The riff, over two bars; the last time round, doubled an octave under.
      riff(0, 1, of % 2);
      if (time >= 2) riff(-12, 0.45, of % 2);
    } else if (name === 'verse' && time >= 1 && of >= 4) {
      // The second verse: the riff answered, down an octave and quiet.
      riff(-12, 0.55, of % 2);
    } else if (name === 'solo') {
      // A solo: a run up and down the scale, a different shape every bar, bending into the long notes.
      let seed = (bar * 7919 + theme.key * 31) % 233280;
      const rand = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
      let degree = 3 + Math.floor(rand() * 3);
      for (let i = 0; i < 16;) {
        const len = rand() < 0.3 ? 4 : rand() < 0.6 ? 2 : 1;
        degree = Math.max(0, Math.min(scale.length - 1, degree + (rand() < 0.5 ? -1 : 1) * (rand() < 0.25 ? 2 : 1)));
        lead(at(i), theme.key + LEAD + scale[degree], step * len, theme.lead, level * 0.95);
        i += len;
      }
    }

    // ——— synths: an arpeggio round the chord, a pad under it.
    if (theme.arp && name !== 'intro' && name !== 'break') {
      const notes = [0, third, chord[2], 12];
      for (let i = 0; i < 16; i++) arp(at(i), root + 24 + notes[i % 4], step * 0.9, level * (loud ? 1 : 0.7));
    }
    if (theme.pad && (loud || name === 'break') && of % 2 === 0) pad(when, [root + 24, root + 24 + third, root + 24 + chord[2]], beat * 8, level);
  }

  return {
    /**
     * Plays `theme` at `tempo` from now, until stopped, with the downbeat
     * `beat0` beats ago (so it can come back in step with a clock that kept
     * running). The first bar it plays is the next one that starts.
     */
    start(theme, tempo, beat0 = 0) {
      this.stop();
      fresh();
      lastLead = null;
      const beat = 60 / tempo, barLength = beat * 4;
      // From the top, the count-in is short; picking up a clock that kept running, in step with it.
      const t0 = beat0 > 0 ? ctx.currentTime - beat0 * beat : ctx.currentTime + 0.12;
      const firstBar = beat0 > 0 ? Math.max(0, Math.ceil((beat0 * beat + 0.12) / barLength)) : 0;
      const state = { theme, tempo, t0, bar: firstBar, out: target };
      // Bars are scheduled well ahead of the clock, so the page can stall (a model baking, shaders
      // compiling, a slow frame) for seconds and the score plays on regardless. A bar whose start has
      // already gone is skipped, not crammed in late: the band picks up again on the next downbeat.
      const fill = () => {
        const now = ctx.currentTime;
        const behind = Math.floor((now - t0) / barLength) + 1;
        if (state.bar < behind) state.bar = behind;
        while (t0 + state.bar * barLength < now + LOOKAHEAD) {
          // A bar that goes wrong is lost, not the rest of the song after it.
          try { playBar(theme, tempo, state.bar, t0 + state.bar * barLength); } catch (e) { console.warn('music: bar', state.bar, e); }
          state.bar++;
        }
      };
      fill();
      state.timer = setInterval(fill, 250);
      playing = state;
    },

    stop() {
      if (!playing) return;
      clearInterval(playing.timer);
      // What was already scheduled fades out rather than playing on.
      const gain = playing.out;
      gain.gain.setTargetAtTime(0, ctx.currentTime, 0.08);
      setTimeout(() => gain.disconnect(), 1500);
      playing = null;
    },

    get playing() { return Boolean(playing); },

    /** Which theme is playing, if any. */
    get theme() { return playing?.theme ?? null; },

    /** How many beats from the downbeat the score is, at the audio clock's `now`; null if it isn't playing. */
    beatAt(now = ctx.currentTime) {
      return playing ? ((now - playing.t0) * playing.tempo) / 60 : null;
    },

    /** `bars` bars of `theme` scheduled at once from now: for rendering offline (an OfflineAudioContext). */
    sketch(theme, tempo, bars) {
      fresh();
      lastLead = null;
      const bar = (60 / tempo) * 4;
      for (let i = 0; i < bars; i++) playBar(theme, tempo, i, ctx.currentTime + 0.05 + i * bar);
    },
  };
}
