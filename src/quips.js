/**
 * What Rock says. Not much, and flatly: he is several tons of granite, he
 * is on a world tour, and abroad is all a bit much. A line is picked for
 * what just happened; the people have a line of their own, said the first
 * time one is smashed.
 *
 * At some stops he picks up the way they talk there (`look.voice`): in
 * London he goes terribly British about it all, and up the mountain
 * everything is about the cold.
 */

export const QUIPS = Object.freeze({
  smash: ['Noted.', 'Excuse me.', 'They\'ll be fine.', 'Was that someone?', 'Mm.', 'Rolling through.', 'I did say I was coming through.', 'Sorry. No I\'m not.', 'Local customs. Mine.'],
  crit: ['That was a lot of person.', 'Rock accepts the applause.', 'Oops. Anyway.', 'That one had it coming. They all do.', 'I don\'t speak the language. I speak this.'],
  bonk: ['Ow. For a rock, I felt that.', 'Firm.', 'I need a run-up.', 'That was a person. Dense.'],
  tap: ['That\'s just bumping into someone.', 'Speed, Rock. Speed.', 'Walking into people. Like a tourist.'],
  fell: ['Gravity works here too.', 'Down. As is tradition.', 'I\'m a rock. This is what I do.', 'That\'s not on the itinerary.'],
  zapped: ['I did not need that.', 'Mm. Tingly.', 'Wrong plug. Wrong country.'],
  crushed: ['That came down. I was under it.', 'Flattened. By the scenery. Rude.'],
  burnt: ['Warm.', 'Medium rare.', 'That was pyro. Somebody\'s showing off.'],
  scalded: ['Steam. I\'ve been steamed.', 'A facial. I didn\'t book a facial.'],
  thud: ['Hard landing.', 'Ouch. Floor.'],
  tape: ['Gaffer tape fixes everything.', 'Patched.', 'Silver tape. Holds a rock together. In any country.'],
  lighter: ['A lighter. In case of me.', 'Somebody will hold this up. For me. Later.'],
  pass: ['My passport. I look awful in the photo.', 'Passport. Fine. I\'ll show it.'],
  locked: ['They want to see my passport.', 'It\'s shut. I need the passport.'],
  sturdy: ['It\'s holding. I need more speed.', 'That wall is real. For now.'],
  broke: ['It was a wall. Was.', 'There was a room behind that.', 'I\'ll pay for that. I won\'t.', 'Shortcut.'],
  globe: ['A snow globe. Shake it. Snow. Every time.', 'A souvenir. For me. From me.', 'It\'s round. I like it.'],
  encore: ['...Fine. One more.', 'They want an encore. Do I have a choice?', 'Back up. I\'m a professional.'],
  combo: ['Now we\'re rolling.', 'That\'s a lot of people at once.', 'Combo. Is that what this is.'],
  clear: ['That was a show.', 'Next city.', 'Thank you, good night.', 'Where are we again?'],
  tour: ['That\'s the tour. I\'d like to go home.', 'Ten cities. I remember none of them.'],
  shattered: ['I\'ve been better.', 'In pieces. As expected.', 'Well. That\'s that.', 'Send me home in a box. Several boxes.'],
  ready: ['Okay.', 'Let\'s go.', 'Where\'s the venue?', 'Rolling.', 'Nobody told me about the jet lag.'],
});

/** London: Rock, terribly British about it all. */
export const BRITISH = Object.freeze({
  smash: ['Frightfully sorry.', 'Mind the gap. You didn\'t.', 'Pardon me. Do carry on.', 'Bit of a do, isn\'t it.'],
  crit: ['Absolutely flattened, I\'m afraid.', 'Not cricket, that. Still.'],
  bonk: ['Steady on.', 'That was rather solid.'],
  tap: ['Terribly sorry. After you.', 'I queued for that. Didn\'t get it.'],
  fell: ['Down the stairs. Lovely.', 'Bit of a tumble.'],
  tape: ['Keep calm and tape on.', 'Nothing a bit of tape won\'t fix.'],
  pass: ['Passport. Jolly good.'],
  locked: ['Papers, apparently. Fair enough.'],
  globe: ['A snow globe. How very kind.', 'Lovely. Snow. Indoors.'],
  clear: ['Smashing. Literally.', 'Cheers, London.'],
  ready: ['Raining. Naturally.', 'Right. Tea after.'],
});

/** Up the mountain: everything is about the cold. */
export const ALPINE = Object.freeze({
  smash: ['Cold out. Colder for them.', 'Down the slope. Down they go.', 'Downhill. My event.'],
  crit: ['Avalanche. It was me.', 'That\'s a black run.'],
  bonk: ['Ow. Frozen solid. Both of us.', 'Packed snow. Packed person.'],
  tap: ['Slipped. On ice. A rock.', 'I need more slope.'],
  fell: ['That was a crevasse.', 'Down the mountain. Faster than planned.'],
  crushed: ['Snowball. The size of a car.', 'Avalanche. Of course.'],
  tape: ['Tape. Frozen to me now.'],
  globe: ['A snow globe. On a mountain. Of snow.', 'More snow. Smaller.'],
  clear: ['Off the mountain. Never again.', 'Après-roll.'],
  ready: ['Summit. Only one way to go.', 'Thin air. Thick rock.'],
});

const VOICES = { british: BRITISH, alpine: ALPINE };

/** A line for `kind`, in `voice` where it has one, picked by `random` (a function giving 0 to 1). */
export function say(kind, voice = null, random = Math.random) {
  const lines = VOICES[voice]?.[kind] ?? QUIPS[kind];
  if (!lines?.length) return '';
  return lines[Math.floor(random() * lines.length) % lines.length];
}
