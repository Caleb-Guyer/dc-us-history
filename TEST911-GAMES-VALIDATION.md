# Short campaign validation · 7.1.0

All **364 configured tests** and all configured JavaScript syntax checks pass. New coverage validates contextual decision gates, collisions, dash protection and cooldowns, natural movement, factory work windows, frame slicing, seeded runs, terminal outcomes, checkpoint unlocking, malformed records, canonical debrief links and chapter coverage.

Feasibility tests play all six actual authored missions across four seeds using ordinary directional/action controls refreshed every 250 ms. The simulation requires collection across two distinct paths or stations; separate tests confirm that standing still cannot complete a mission. Wins preserve earlier checkpoints and best scores; retries never unlock later missions by themselves.

Background browser testing used `?muted=1&preview=1` throughout. It covered all six missions, historical decisions, corrective feedback after a deliberate wrong answer, a failed mission and retry, pause/resume, checkpoint restoration after reload, the final recall results (Chapter 9: deliberately 5/6; Chapter 11: 6/6), the return link and 3/3 campaign completion on both hub cards. The new games did not change the existing review-bank coverage, recalled cards or best rehearsal record. No browser errors or warnings were observed.

Responsive verification used a 375 × 812 browser viewport. It covered a historical decision, held on-screen movement buttons and the live mission HUD. No horizontal overflow was present. The temporary viewport override was reset afterward. This was browser viewport testing, not a claim of testing physical phone hardware.

Graphics checks inspected the mill, canal, expedition, Alamo, San Jacinto and press scenes. Cinematic subtitles sit beside the animation on desktop and below it on narrow screens. The canal uses a tow horse and line. San Jacinto uses coastal prairie; the Alamo has a distinct stone enclosure; Washington uses the period Capitol and low hills. Camera bounds prevent empty scene edges.

Optional audio is implemented with a local synthesized score, effects and browser speech. Tests remained muted as requested; no claim is made of a listening evaluation or identical voices across devices. Subtitles and every game interaction work with sound off. No paid API or external audio request is required.

The short campaigns teach selected connections; they do not replace all chapter review material or predict a test grade. Historical settings are grounded in the supplied edited chapters; fictional participants, speech and delivery tasks are disclosed in each menu and the [campaign guide](TEST911-GAMES.md).
