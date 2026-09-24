# DC US History

**[Play The Last Dispatch — Chapter 5](https://caleb-guyer.github.io/dc-us-history/)** · **[Play Crown & Current — Chapter 4](https://caleb-guyer.github.io/dc-us-history/chapter4.html)**

Free browser games for dual-credit U.S. History. No install, login, ads, or API keys. The repository was renamed from `crown-and-current` to `dc-us-history`; use the new GitHub Pages address above.

## Chapter 5: The Last Dispatch

Play **Rowan Vale**, a printer’s apprentice turned courier. From the Proclamation Line to a blockaded Boston, Rowan’s crew and Loyalist brother are pulled apart by the same events that unite the colonies. An original fictional story carries the history through short spoken exchanges and actions.

- **Seven missions:** a frontier escort with defensive combat, a covert print run, a workshop scramble, civilian rescue on King Street, a tea-ship heist, harbor relief runs, and a final dispatch extraction.
- **A recurring cast of five**, with 81 prerecorded dialogue clips—about 6 minutes 37 seconds. Sixteen directed cutscenes use dedicated sets, articulated faces and hands, character blocking, object inserts, close-ups, reaction shots, camera movement, focus blur, and practical lighting.
- **Scenes with action:** walk the frontier, enter the printshop, work at the loom, help the wounded, prepare the tea heist, row through the blockade, and save the dispatch from the fire. Dialogue has room for establishing shots and reactions, with timed sound effects. Pause, restart, advance, or skip a scene. **Missions → Story scenes** replays any cutscene without changing campaign progress.
- **A clear HUD:** current objective, direction, health, and the action you can take nearby. Longer explanations live in an optional archive.
- **Checkpoints:** each completed task saves your place. Restart from the last checkpoint after a failure or return later. Workshop deliveries and harbor relief runs also save.
- **An original instrumental soundtrack**, separate music/voice/effects volume, automatic dialogue ducking, and pause handling.
- **All 15 supplied Chapter 5 key terms** occur along the required story path. Optional practice offers five random terms or a full 15-term review, with feedback. This is Chapter 5 practice, not a reproduction of the entire Chapter 1–5 test.

| Mission | Play style | History in the actions |
| --- | --- | --- |
| A line through the pines | First-person escort / field combat | Proclamation Line; imperial victory’s limits |
| Ink under pressure | Infiltration / printing | Juryless maritime courts; direct tax; Sons of Liberty; representation |
| A different kind of resistance | Workshop rush | Daughters of Liberty; boycotts; indirect tax; Massachusetts Circular |
| Five names in the snow | Civilian rescue | Boston Massacre and the responsibility of reporting it |
| Only the tea | Shipboard stealth / heist | Committees of Correspondence; Tea Act; Loyalists |
| A city without a harbor | Boat evasion / relief | Four Coercive Acts; Intolerable Acts; colonial support |
| The last dispatch | Extraction / combat | Suffolk Resolves and collective resistance in 1774 |

The cast, local encounters, rescues and armed pursuits are fictional; historical events and concepts are sourced. The cover is illustrated key art; gameplay uses stylized procedural 3D and Canvas 2D. See [historical scope and sources](C5-SOURCES.md), [art credits and prompt](C5-ART.md), [voice production](VOICE-CREDITS.md), and [music credits](MUSIC-CREDITS.md).

## Controls

**First person:** WASD moves, mouse or arrow keys look, hold E to interact, Shift sprints, C crouches, Space jumps. Click or F fires in armed missions and throws a distraction in stealth. The rescue mission has no player weapon. Right mouse aims. P or Escape pauses; click the world to capture the mouse.

**Workshop:** WASD or arrows move, hold E in the lit station to pick up flax, spin yarn, weave cloth, and deliver. Space dashes past moving carts. Complete four bundles before time runs out.

**Boat:** WASD or arrows steer. Shift rows fast, C conceals your wake from lantern beams. Pick up the next marked relief crate and return to the dock at the bottom of the harbor. Complete four deliveries.

**Scenes:** Space advances a line; Skip scene advances the whole scene. Pause is available throughout. Touch controls are included; swipe the 3D world to look. Landscape gives the game more room. Story difficulty reduces damage and extends the workshop timer.

## Chapter 4 is still here

[Crown & Current](chapter4.html) retains its seven missions, 67 dialogue clips, music, saved progress and 15-question practice. Its existing browser save key is unchanged. See [Chapter 4 documentation](CHAPTER4.md).

## Run and verify locally

Static files, no build step or runtime package install. Node.js 18+ runs the included development server:

```sh
npm start
npm test
npm run check
```

Open the printed localhost URL. Use a local server or GitHub Pages; ES modules do not work by double-clicking an HTML file. `PORT` changes the development port.

Tests cover both chapters: quiz composition and key-term coverage, physical navigation, shooting and cover, civilian rescue checkpoints, complete workshop and harbor simulations, packaged dialogue, and music/voice lifecycle behavior. Browser checks also verify presentation, scenes, mission entry, audio, pause/settings, and practice navigation.

GitHub Pages: **Settings → Pages → Deploy from a branch → main → /(root)**. All asset and module paths are relative. All game dependencies and media are hosted in the repository; Google Fonts is optional with local font fallbacks.

## Source map

- `index.html`, `chapter5.html`, `c5.css`, `c5.mjs`: Chapter 5 presentation and campaign control.
- `c5-data.mjs`: cast, script, missions, reference terms and practice.
- `c5-sim.mjs`: movement, stealth/combat, checkpoints, workshop and harbor rules.
- `c5-world.mjs`, `c5-board.mjs`: 3D and 2D rendering.
- `c5-cinema-plan.mjs`, `c5-cinema.mjs`, `c5-actors.mjs`: editorial timing, scene blocking, dedicated sets, camera coverage, articulated cast, and cinematic rendering. Narrow screens get adjusted framing; reduced-motion preferences remove camera drift, shake, grain, and the brief distant gunfire light.
- `c5-voices.mjs`, `c5-voice-*.mp3`: Chapter 5 recordings.
- `chapter4.html`, `action.mjs`, `missions.mjs`, `world.mjs`, `boards.mjs`: preserved Chapter 4 game.
- `dialogue.mjs`, `music.mjs`, `score.mjs`: shared audio systems.

Code is MIT licensed. Chapter 5 reference adaptations are attributed to OpenStax under CC BY-NC-SA 4.0, as detailed in C5-SOURCES.md. Original key art and music are offered under CC BY 4.0 to the extent rights apply. Third-party licenses remain in force. No analytics, remote saves, microphone requests, or AI calls in gameplay.
