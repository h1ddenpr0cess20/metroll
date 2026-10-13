/**
 * What Metroll says. A spiked steel ball, a morning star's head with no
 * morning star attached, rolled through fifty years of metal by nobody in
 * particular; it has opinions about all of it, and it will share them. It
 * is sarcastic, it is smug, and it trolls: the posers, the gatekeepers and
 * the scenesters in the way, the bands, the fans, the genres, and above
 * all you. A line is picked for what just happened; the people have a
 * line of their own, said the first time one is smashed.
 *
 * On each track it picks up the way they talk there (`look.voice`): doom
 * drags, hair metal worries about its hair, black metal is very cold, and
 * the scene kids are very sad.
 */

export const QUIPS = Object.freeze({
  smash: ['Sit down.', 'Skill issue.', 'Cry about it.', 'Next.', 'Bold of you to stand there.', 'Were you in the way? You were.', 'Ratio.', 'Thanks for the feedback.', 'Imagine standing there.', 'Oh, was that your spot?'],
  crit: ['Absolutely obliterated. Not sorry.', 'Flattened. Would troll again.', 'That\'s going on my résumé.', 'Cope.', 'I didn\'t even try. That was the embarrassing part.', 'Review: one star. Pit: one dent.'],
  bonk: ['Ow. Fine. That was a decent hit.', 'Okay, that one went to the gym.', 'I felt that. Moving on.', 'Rude. Do it again so I can ignore it.', 'Firm. I\'ll allow it.'],
  tap: ['That was a tickle. A very small insult.', 'Speed, Metroll. Speed.', 'Walked into a guy. Very metal.', 'Barely a mosh.', 'Is that all you\'ve got? It\'s all I\'ve got, apparently.', 'I have been bounced. Nobody tell anyone.'],
  fell: ['Gravity: one. Metroll: nil.', 'Down. Like my reviews.', 'I meant to do that.', 'Not on the setlist.', 'Edge. Of course there was an edge.'],
  zapped: ['Shocking. Truly.', 'Wrong outlet.', 'Plugged in. Wrong end.', 'I\'m conductive. That was a mistake.'],
  crushed: ['Flattened by a prop. Somebody\'s getting a strongly worded email.', 'Rude. Whoever hung that, I want a word.', 'It came down. I was under it. Physics, I guess.'],
  burnt: ['Pyro. Lovely. Warm.', 'Toasted. Hope the crowd enjoyed that.', 'Somebody\'s showing off with the flames.'],
  scalded: ['Steam. A facial. Unrequested.', 'Hot. Wet. Not how I like my metal.'],
  thud: ['Floor. Hard. Noted.', 'Landed. Gracefully. Nobody saw.'],
  whetstone: ['Sharpened. Back to being rude.', 'A whetstone. Fresh spikes, same attitude.', 'Spikes restored. Personality unchanged.', 'Ahh. A trim. I mean, a sharpening.'],
  lighter: ['A lighter. For the encore. Everybody wants a power ballad in the end.', 'Hold it up. Sway. Don\'t make it weird.', 'Fire. In a pocket. This is how it starts.'],
  pass: ['A backstage pass. Finally, someone believes in me.', 'ALL ACCESS. What could go wrong.', 'Laminated. I feel important.'],
  locked: ['Security wants a pass. Cute.', 'It\'s shut. I need the pass.', 'Not on the list. I\'m never on the list.'],
  sturdy: ['That wall is real. Unlike half this scene.', 'Not breaking. Need more speed.', 'Solid. Like a power chord.'],
  broke: ['Wall? What wall.', 'Oops. Property damage.', 'Shortcut. You\'re welcome.', 'There was a room behind that.', 'I\'ll pay for that. I won\'t.'],
  demo: ['A demo tape. The only copy. Obviously going straight into my collection.', 'Found it. It\'s terrible. I love it.', 'Rare demo. Rare because nobody should hear it.', 'Cassette. Hiss included. Free.'],
  encore: ['...Fine. One more. For the fans. (There are no fans.)', 'Encore? Oh no, whatever shall I do.', 'Back up. Never doubted it.', 'Standing ovation. From a guy.'],
  combo: ['Combo. Hit the guys, not the gym.', 'That\'s a lot of people being wrong at once.', 'Now we\'re trolling.', 'Is this what they mean by a circle pit?'],
  clear: ['Track done. On to worse taste.', 'Another genre, another pile of posers.', 'Next track. I assume it\'s louder.', 'Review time. Be honest. Be mean.'],
  tour: ['That\'s the whole discography. Even the bad ones.', 'Twelve tracks. I\'d give it three stars. Maybe two.', 'Fifty years of metal. Still not real metal, apparently.'],
  shattered: ['Well. That\'s the worst review yet.', 'Spikes: gone. Dignity: gone. Cred: unchanged.', 'Rolled out. Metal lives. Barely.', 'Wrecked. By a guy. A guy!'],
  ready: ['Let\'s go. I\'m not here to make friends.', 'Alright. Who needs trolling first?', 'Another gig. Another crowd to disappoint.', 'Fine. Let\'s do this. Loudly.'],
});

/** Heavy metal, Birmingham, 1970: the grim north. */
const BRUM = Object.freeze({
  smash: ['Proper heavy, that.', 'Bit grim, innit.', 'Down the pub with you.', 'Tea\'s gone cold. So have you.'],
  bonk: ['Steady on. That\'s a lot of denim.', 'Ow. Grim.'],
  tap: ['Barely a riff, that.', 'Gentle. Too gentle. It\'s the rain.'],
  fell: ['Down. Into the canal, probably.', 'Dropped like a bad album.'],
  whetstone: ['A bit of sharpening. Lovely. Back to the foundry.'],
  broke: ['Mind the wall. Oh, you didn\'t.'],
  demo: ['A demo. In Brum. The first ever, probably.'],
  ready: ['Raining. Naturally. Birmingham, 1970. Let\'s invent something.', 'Okay. A tritone walks into a pub.'],
  clear: ['Heavy. Now somebody tell everyone they\'ve invented it.'],
});

/** Hair metal, the Sunset Strip: spandex, hairspray and the power ballad. */
const GLAM = Object.freeze({
  smash: ['Your hair is bigger than your talent.', 'Hairspray. Flammable. Noted.', 'Spandex? In this economy?', 'Nice hair. Shame about the band.', 'That was somebody\'s Aqua Net.'],
  crit: ['Absolutely hairless. Flattened.', 'Gone. Take your guitar solo with you.'],
  bonk: ['Ow. The hair absorbed it.'],
  tap: ['Bounced off the hairdo. Ridiculous.'],
  burnt: ['Pyro. And hairspray. Brilliant plan.', 'Warm. So is the hair.'],
  lighter: ['A lighter. Power ballad incoming. Get the lighters up.', 'Lighters up. Sway. Cry. Wait for the key change.'],
  encore: ['The encore. Of course there\'s an encore. It\'s a power ballad.'],
  demo: ['A demo tape. Four hundred hair bands got signed off one of these.'],
  ready: ['The Strip. 1986. Where the hair is bigger than the venue.', 'Okay. Smile. Hair. Go.'],
  clear: ['Key change. Fireworks. Hair. Next.'],
});

/** Thrash, the Bay Area: faster, and then faster. */
const THRASH = Object.freeze({
  smash: ['Mosh pit? More like mosh puddle.', 'Faster. Everything. Faster.', 'That was a circle pit. I was the circle.', 'Don\'t Thrash me, bro.'],
  crit: ['Absolutely demolished. Fast.'],
  bonk: ['Okay, that guy was in the pit.'],
  tap: ['Too slow. It\'s thrash. Go faster.', 'Slower than the tempo. Embarrassing.'],
  combo: ['Circle pit. Metroll is the circle.', 'Speed. Chaos. Combo.'],
  whetstone: ['Sharpened. Now louder and faster.'],
  ready: ['Bay Area. 1986. Everyone has high-tops and a grudge.', 'Faster. Always faster.'],
  clear: ['Next track. Faster.'],
});

/** Goth, Whitby: everything is beautiful and dead. */
const GOTH = Object.freeze({
  smash: ['Nice eyeliner. Did your mum help?', 'Black. Again. Shocking.', 'Everything is so beautiful. And so dead.', 'Brooding. Allegedly.'],
  crit: ['Dramatic. Dead. Like all of you.', 'Flattened. Quote a poem about it.'],
  bonk: ['Ow. The velvet absorbed it.'],
  tap: ['Gloomy bounce. Barely.'],
  fell: ['Down into a crypt. Of course. On brand.'],
  zapped: ['Bats and wires. This is why we can\'t have gothic things.'],
  demo: ['A demo. Black cassette. A love letter to nobody.'],
  ready: ['Whitby. Fog. A man in a cape. Original.', 'Okay. Mist. Black. Ravens. Go.'],
  clear: ['The mist parts. Nothing was behind it. Moving on.'],
});

/** Hardcore, New York: a basement and a lot of crossed Xs. */
const HARDCORE = Object.freeze({
  smash: ['Two-step? That\'s the whole dance?', 'Stage dive? More like stage fall.', 'Straight edge. Straight into the spikes.', 'Thirty seconds. That was the whole song.'],
  crit: ['Huge. Floorpunch, rolled.'],
  bonk: ['Okay, that guy has done a pit before.'],
  tap: ['You\'re supposed to be fast. It\'s a hardcore show.'],
  fell: ['Stage dive. Nobody caught me.', 'Down the basement steps. Classic.'],
  demo: ['A demo tape. Seven-inch next, obviously.'],
  ready: ['A basement. 1989. Smells like victory. Also a basement.', 'Everyone has a crew. I have spikes.'],
  clear: ['Show over. Thirty minutes. Sold out.'],
});

/** Death metal, Tampa: it is about death, and it is very serious. */
const DEATH = Object.freeze({
  smash: ['Gutturals. The words are optional.', 'Brutal. Allegedly.', 'The vocalist sounds like a bin. Respect.', 'Cartoon gore. Very edgy.'],
  crit: ['That was brutal. Sorry. Brutal-ish.'],
  bonk: ['A bit of bone. Not much.'],
  tap: ['I bounced off a guy in a Cannibal shirt. Mortifying.'],
  scalded: ['Swamp steam. Smells like my reviews.'],
  demo: ['A demo. Recorded in a morgue. Probably.'],
  ready: ['Tampa. 1991. A swamp, a studio, a lot of bad ideas. Brilliant.', 'It\'s about death. Again. Of course.'],
  clear: ['Death metal: still about death. Next.'],
});

/** Black metal, Norway: trve, kvlt, and cold. */
const BLACK = Object.freeze({
  smash: ['Trve. Kvlt. Cold. Boring.', 'Corpse paint? Sweet. Did you do it in the mirror?', 'Frostbitten. Of course. Everything is frostbitten.', 'Spooky forest. A guy with a sword. There\'s always a guy with a sword.'],
  crit: ['Necro. Lo-fi. Flattened.'],
  bonk: ['Ow. The corpse paint cracked.'],
  tap: ['Even the snow was more convincing.'],
  fell: ['Down the fjord. Cold. So cold.'],
  demo: ['Demo. Recorded on a tape deck in a barn. Sounds incredible. Sounds terrible. Same thing.'],
  ready: ['Norway. 1993. A forest, a bad idea and a man holding an axe for a photo.', 'It\'s snowing. Of course it is.'],
  clear: ['The forest is silent. As promised in the liner notes.'],
});

/** Doom, New Orleans: everything is slow, and heavy, and slow. */
const DOOM = Object.freeze({
  smash: ['Sloooow. But it connected.', 'Riff. Wait. Another riff. Same riff. Tuned lower.', 'Heavy. Then heavier. Then asleep.', 'That took... a while. Worth it.'],
  crit: ['Crushed. Very. Slowly.'],
  bonk: ['Ow. The ow arrives slowly.'],
  tap: ['Dragged. Barely. The tempo is a dirge.'],
  fell: ['Down. Slowly. Painfully. Doomfully.'],
  whetstone: ['A whetstone. Slowly. Slooowly.'],
  demo: ['A demo. Forty minutes. One song.'],
  ready: ['New Orleans. Humid. A funeral. A riff. One riff. Forever.', 'Okay. Turn it down a bit. No. Down. Tune lower.'],
  clear: ['It\'s over. Was it? Hard to tell. Everything is a drone.'],
});

/** Industrial, Berlin: a factory, and cold feelings. */
const INDUSTRIAL = Object.freeze({
  smash: ['Beep. Boop. Criticism detected.', 'Gears. Pistons. Pretension.', 'Machine says no. Machine rolls on.', 'Cold. Efficient. Like my sarcasm.'],
  crit: ['Crushed. Properly. In a press.'],
  bonk: ['A dent. In a factory. Authentic.'],
  tap: ['Bounced off a robot. Humiliating.'],
  zapped: ['High voltage. Of course. It\'s industrial.'],
  crushed: ['Hydraulic press. A classic of the genre.'],
  burnt: ['More fire. Less thought. Very Berlin.'],
  demo: ['A demo. On reel to reel. It is mostly a drill.'],
  ready: ['Berlin. A power station. Leather, fog, a drill. Sure.', 'Black leather and a pneumatic hammer. Fine.'],
  clear: ['Shift over. The machine rests. I don\'t.'],
});

/** Nu metal, Woodstock '99: baggy pants, wallet chains, and rage. */
const NUMETAL = Object.freeze({
  smash: ['Break stuff? I\'m breaking you.', 'Baggy pants. Wallet chain. Nine out of ten decisions.', 'Duuude. Bro. Dude.', 'Rap-rock. Peak 1999.', 'Turntable? In a metal band? Bold.'],
  crit: ['Absolutely nu. Absolutely metal. Absolutely flattened.'],
  bonk: ['Okay, that guy had a wallet chain.'],
  tap: ['I bounced off a baggy-pants guy. Bro.'],
  burnt: ['Woodstock. Fire. Historical.', 'Peace, love and extremely hot.'],
  fell: ['Down in the mud. Woodstock. Classic.'],
  demo: ['Demo. Burned on a CD-R. Labelled in Sharpie.'],
  ready: ['Woodstock. 1999. It\'s hot, it\'s loud, what could go wrong.', 'Alright. Rage. Peace. Mud. Go.'],
  clear: ['Peace. Love. Rage. Next.'],
});

/** Screamo / scene, Warped Tour: eyeliner and feelings. */
const SCENE = Object.freeze({
  smash: ['Hair flip. Detected. Flattened.', 'Skinny jeans. Poor circulation.', 'My eyeliner is thicker than your sound.', 'Eight scream layers. Three real words.', 'MySpace top 8. I\'m not in it.'],
  crit: ['Dramatic. Spectacular. Tragic.'],
  bonk: ['Ow. Feelings. And a bit of elbow.'],
  tap: ['I bounced off a tiny scene kid. Mortifying.'],
  burnt: ['Warped Tour. Black asphalt. In July. Hot.'],
  demo: ['A demo. Bedroom recording. Feelings, mostly.'],
  ready: ['Warped Tour. 2005. Everyone is sad and sweaty. I fit right in.', 'Fringe. Everywhere. Alright.'],
  clear: ['Cried. Screamed. Rolled. Next.'],
});

/** The festival, Wacken: all of it, in a field, in the mud. */
const FESTIVAL = Object.freeze({
  smash: ['True metal? Prove it. By getting rolled.', 'Mud. Beer. Helmets with horns. Authentic.', 'Wall of Death? Walls lose.', 'Your vest has four hundred patches. Not one of them is yours.'],
  crit: ['Not very true. Very flat.'],
  bonk: ['A guy in a viking helmet. Fair enough.'],
  tap: ['Bounced off a guy in armour. Bold of me.'],
  fell: ['Down. In a field. In the mud. Of course.'],
  demo: ['Demo tape. Last of the lot. I can\'t hear it. It\'s a festival.'],
  ready: ['Wacken. Everyone is here. Every genre. Every opinion. Let\'s ruin the day.', 'The last track. I\'m going to pretend this means something.'],
  clear: ['All the genres. All trolled. Good night.'],
});

const VOICES = { brum: BRUM, glam: GLAM, thrash: THRASH, goth: GOTH, hardcore: HARDCORE, death: DEATH, black: BLACK, doom: DOOM, industrial: INDUSTRIAL, numetal: NUMETAL, scene: SCENE, festival: FESTIVAL };

/**
 * A line for `kind`, in `voice` where it has one (most of the time: the rest of the
 * time Metroll is just itself), picked by `random` (a function giving 0 to 1).
 */
export function say(kind, voice = null, random = Math.random) {
  const own = VOICES[voice]?.[kind];
  const lines = own?.length && random() < 0.7 ? own : QUIPS[kind];
  if (!lines?.length) return '';
  return lines[Math.floor(random() * lines.length) % lines.length];
}

/**
 * What Metroll says to Rock: the granite boulder from the first game, who
 * rolled through thirty venues before the spikes, and is the last boss at
 * Wacken. A cameo. They are, at heart, family; it does not stop Metroll.
 */
const ROCK = Object.freeze({
  tap: ['Rock. Buddy. You\'ve put on weight.', 'Bounced off the old man. Respect your elders. Briefly.', 'He\'s harder than he looks. He\'s a rock.'],
  bonk: ['Ow. He\'s solid. I\'m spiked. Somebody has to give.', 'Okay, that one was family.', 'He is not going down easy. He is a boulder.'],
  smash: ['Sorry, Rock. Genre\'s moved on.', 'Dad rock, literally. Flattened.', 'The original. Original sin: being in my way.', 'You had a good run. Thirty venues. Now you\'re gravel.'],
  crit: ['Rock. Sorry. Not sorry. A little sorry.', 'Cracked the original. I\'ll hear about this.'],
  fell: ['Rock\'s watching. This is humiliating.'],
});

/** A line for what just happened to or with Rock, the final boss. */
export function sayRock(kind, random = Math.random) {
  const lines = ROCK[kind] ?? ROCK.bonk;
  return lines[Math.floor(random() * lines.length) % lines.length];
}

export { VOICES };
