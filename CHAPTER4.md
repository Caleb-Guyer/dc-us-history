# Crown & Current

**[Play the game](https://caleb-guyer.github.io/dc-us-history/chapter4.html)**

A free browser action game for dual-credit U.S. History, Chapter 4: **Rule Britannia**. First-person battles, stealth, naval combat, town building, and strategy put the history inside the action.

The campaign opens at Quebec in 1759, then jumps back to the events that built the empire. Short lines and mission consequences carry the historical context. There are no required reading panels or quiz interruptions during the campaign.

## Seven missions

| Mission | Genre | History through play |
| --- | --- | --- |
| Run through the ashes | First-person stealth | Escape Jamestown; the legacy of Bacon’s Rebellion |
| A place for everyone | Town builder | House newcomers in Penn’s religiously tolerant colony |
| Break the king’s seal | Stealth courier | Carry news of the Bill of Rights after Andros’s overthrow; Hobbes and Locke |
| Run the blockade | Naval combat | Collect molasses, evade patrols, and experience weak trade enforcement |
| Hold until the money comes | Tactical defense | Start underfunded after Albany; deploy Pitt’s reinforcements |
| Take the heights | First-person battle | Fight through three positions on the road to Quebec |
| Someone has to pay | Crisis management | Supply Britain’s expanded empire by taxing or borrowing |

Encounters are fictional game scenarios. Reloads, maps, damage, budgets, and troop counts are designed for play, not exact historical simulation. See [SOURCES.md](SOURCES.md).

## Character voices

The campaign includes **67 prerecorded dialogue clips** (about 5 minutes), voiced briefings and outcomes, and eight stock synthetic voices cast across the characters. Warnings and reactions respond to health, patrol detection, cargo, construction, garrison supplies, taxation, and borrowing. Dialogue plays one line at a time; combat sounds soften during speech. Pause freezes the current voice and its captions, while changing missions cancels old dialogue.

Use **Settings** (or **Audio & settings** in the pause menu) for independent voice/effects volume, voice mute, subtitles, and a voice preview. Briefings can be replayed. Clips load as needed, and missing/blocked audio falls back to captions. The voice assets are ordinary MP3 files hosted with the game: players need no speech service, account, download of an AI model, or microphone. See [VOICE-CREDITS.md](VOICE-CREDITS.md) for production details.

## Music

An **eight-track original instrumental score** changes with every mission: tense stealth pulses, a warm Pennsylvania theme, sailing music, field drums and strings for combat, and a darker imperial-debt cue. Tracks fade into one another and loop without MP3 padding. Music softens under dialogue and pauses with the game or when the tab is hidden.

Music begins after your first click or keypress. **Settings → Music volume** controls its level separately from voices and effects; **Music: off** mutes only the soundtrack. The HUD's **Sound** button mutes everything. The game loads music as needed, directly from this repository. [MUSIC-CREDITS.md](MUSIC-CREDITS.md) includes the track list and original synthesis source.

## Controls

- **First person:** WASD movement, mouse or arrow keys to aim, click/F to fire or throw a distraction, Shift sprint, C crouch, Space jump, P/Escape pause. Click the world to capture your mouse.
- **Naval:** WASD or arrows to sail, mouse to aim, click/Space to fire, Shift for full sail.
- **Builder:** 1/2/3 choose a home/farm/meetinghouse, click an empty plot. Click floating supply crates. 4 demolishes for a partial refund.
- **Defense:** 1/2 choose militia/cannon, click a deployment ring. Space launches a free barrage at the cursor.
- **Crisis:** click garrisons to resupply; 1 taxes the colonies and 2 borrows money.

Touch controls are included; landscape provides more room. Settings offer Standard and Story difficulty. Progress saves after each mission. No account or API key is required. WebGL is required for first-person missions; the other modes use Canvas 2D.

## Quiz practice

Separate from the campaign, the final dispatch has exactly **15 multiple-choice questions**:

- **10 class-priority topics:** Bacon’s Rebellion’s legacy, Pennsylvania, the 1689 Bill of Rights, imperial ties, Albany, Pitt, Quebec, the colonies in 1763, debt, and the war’s legacy.
- **3 key terms**, always including salutary neglect in a priority run.
- **2 government questions:** one on Hobbes and one on Locke.

Answer positions and question order are shuffled. Each answer has an explanation, and missed questions appear in the review. A whole-chapter mix covers all five sections. These are original study questions, not the teacher’s actual questions.

## Run locally

Requires Node.js 18+ for the development server. No install step is needed:

```sh
npm start
```

Open the printed URL. JavaScript modules require a local server or GitHub Pages; do not double-click the HTML file. Set `PORT` to use another port.

```sh
npm test
npm run check
```

Tests cover quiz composition, priority coverage, collision and line of sight, shooting/reloading, capture objectives, winning strategies for the building, defense, and debt systems, dialogue playback, and music transitions, pause/resume, muting, dialogue ducking, stale downloads, failure recovery, and packaged audio assets.

## GitHub Pages

Use **Settings → Pages → Deploy from a branch → main → /(root)**. Assets use relative paths and Three.js is included locally. There is no build step or backend. Changes pushed or uploaded to `main` are republished by Pages.

## Source layout

- `action.mjs`: menus, controls, campaign, audio, quiz UI, and saves.
- `missions.mjs`: mission definitions, collision, patrol/combat simulation, and objectives.
- `world.mjs`: the first-person Three.js world and weapon rendering.
- `boards.mjs`: naval, building, defense, and crisis systems.
- `content.js` and `engine.js`: reference material, practice questions, and balanced quiz selection.
- `action.css`: interface and touch controls.
- `dialogue.mjs`, `voice-lines.mjs`, and `voice-*.mp3`: voice playback, cast/script metadata, and prerecorded performances.
- `music.mjs`, `score.mjs`, and `music-*.mp3`: soundtrack playback, track metadata, and original instrumental loops. `compose-score.py` is the optional offline composition/synthesis source.

The flat layout makes static uploads straightforward. Three.js and original game code are MIT licensed; licenses are included. Original narrative, questions, and generated scenery are offered under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), to the extent rights apply, with credit to Crown & Current contributors. OpenStax material remains under its own CC BY 4.0 license. Exact image prompts are in [ART-PROMPTS.json](ART-PROMPTS.json).

No analytics or remote saves. Google Fonts is an optional display dependency with local fallbacks. All game code, images, and 3D rendering dependencies are included.
