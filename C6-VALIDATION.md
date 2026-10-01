# Chapter 6 — No Ground Left checks (4.7.0)

- 120 tests pass. Nine new behavior tests complete the walked rescue and city routes, three physical ferry trips, two Harlem pursuing groups, required wagon clearance and escort, and Ward's return. They also check recovery, docking speed, independent boat/look controls, non-inverted pitch, malformed saves, and previous-release migration. The daughter follows a collision-aware companion route.
- Every one of 39 scenes has a camera for each line, bounded motion, and framing outside solids. All 374 voice performances have packaged nonempty files, matching speaker/text and duration metadata. All 10 original scores have exact byte sizes, valid loops, unclipped peaks and RMS metadata. New peaks: retreat 0.7013; river 0.7944.
- Muted hidden-browser checks exercise real keyboard upward looking, an oar stroke, sustained alternating rowing, movement, pause, gallery and rendered sets. Passenger seating, visible wounded men, bank/ground height and foreground crowd placement were corrected during visual review. Complete mission routes are tested in simulation; this is not a claim of an independent blind playthrough.
- Publishing must upload new media before the changed runtime, and include the root c6.mjs entry, stylesheet, HTML, imported modules and referenced media. Verify the live edition, mission order, entry query key, actual gameplay, mute, console and Pages completion.
- Audio has not been audibly auditioned because the user requested muted testing. Physical phones, gamepads, visible pointer lock and independent playtesting remain unverified. The remaining missions and full paragraph-by-paragraph campaign audit are unfinished.

## Earlier checks

# Chapter 6 — release checks

Version 4.6.0 adds A Country on Paper and Words Beyond the Door. The full campaign is still in development.

- 111 tests pass across Chapters 4–6 and shared systems. Eleven new tests exercise the complete walked print run, shared/private allocation and repair, physical ballots, three timed sheets, invalid strokes and supply recycling, press exit/resume, retained short carriage taps, both walked delivery orders, required rain recovery, save validation, non-inverted looking, and previous-release migration.
- Every scene has one camera per line, bounded motion, and framing outside solid scenery. All 290 recorded lines have packaged nonempty files; all eight original music loops have exact file-size, loop, and peak/RMS metadata. Ink Before Thunder peaks at 0.6477, RMS 0.1803.
- Hidden browser checks use forced mute and isolated playtest saves. Actual E/D/Space/A keyboard input printed three clean sheets. Reopening the page preserved the first sheet. The press HUD hides navigation markers; captions and the active timing band remain readable. Gallery framing and pause were checked with no console errors. Complete simulated walking routes cover both dispatch orders, including recovery; this is not a claim of a blind first-play test.
- Release packaging explicitly includes c6.mjs and c6.css as well as imported modules and referenced media. The published entry module and edition text must be checked, rather than relying only on a data-version attribute.
- Test sessions remain muted; audio has not been audibly auditioned. Hidden-tab frame throttling slows the timing gauge during testing. Physical phones, gamepads, visible pointer lock, and independent playtesting remain unverified.

## Previous installment

# Chapter 6 — release checks

Version 4.5.0 adds Lift the Horizon, Dorchester Heights, and The Open Street. The full Chapter 6 campaign remains in development.

- 100 tests pass across Chapters 4–6 and shared systems. Nine new tests exercise complete movement through both hauling routes, brakes and gravity, real-load completion, required bracing/ballast/chocks, sight direction, recoverable edge slips, load save validation, Boston’s physical street barrier, save migration, and non-inverted hauling cameras.
- Complete winter and ridge routes are traversed with actual simulation input, including carrying materials and crossing the road. Separate UI checks use localhost-only phase fixtures for rendering, keyboard movement, interactions, cinematic/gallery flow, pause, and forced mute. Fixtures are gated to local hosts and use an isolated playtest save.
- All scenes have a camera for every line, bounded push-ins, finite positions, and framing outside solid collision. All 226 recordings have packaged nonempty files with measured levels. Seven music arrangements have packaged media and loop boundaries; winter peak 0.6692, RMS 0.1804.
- Syntax checks cover the full module set. The heavy load is distinct from the player, and walking without the rope cannot deliver it. Braking does not make the puller jump. Ballast must be carried to the opposite side. Wheels rotate with distance rather than elapsed time. A completed 4.4 save continues at the explicitly dated return to January.
- Browser work stays hidden and locked to `muted=1`. Voice, score, and runtime effects are disabled; captions remain available. Audio has not been audibly auditioned. Hidden-tab animation can be throttled, so route timing is not an independent first-play measurement.
- Physical phones, gamepads, visible-browser pointer lock, and an independent blind playtest remain unverified. Automated success is not evidence that the whole game is enjoyable or that the player mastered the chapter. WebGL is required.

## Previous installment

# Chapter 6 — release checks

Version 4.4.0 adds A King’s Promise and The Other Bank. This release is another campaign installment; the full Chapter 6 campaign is not yet complete.

- `npm test`: 91 tests across shared systems and all three chapters. Nine new tests exercise boarding, quiet concealment, pursuit and dodging, boom collision, rescue/repair persistence, save migration, a full navigated boat route, non-inverted boat camera controls, and pursuer collision.
- `npm run check`: syntax checks for the complete app/module set, including all three new mission modules.
- Existing checks verify all objectives are reachable after required world changes, every cinematic beat has a bounded camera with unobstructed framing, every line has a real packaged recording, and every score has measured loop boundaries and safe peak/RMS values.
- 178 prerecorded lines, 20 scenes, six score loops. New episode: 59 lines, seven scenes, two playable sections.
- Local browser review uses `?muted=1`, which locks voice, effects and music silent even when settings change. All testing remained hidden in the background.
- Local checks: rowing and braking through actual keyboard input; C quiet-stroke toggle and reed checkpoint; royal-tender interaction enters its scene and resumes stage 3; wounded pickup at Moores Creek; camera/character staging; scene and mission replay routes; no observed browser errors.
- Pure simulation drives the complete boat route through each channel, then escape, using movement inputs. Bridge repair, carrying, delivery and extraction are exercised with checkpoint round trips. This is separate from the partial manual browser playtest.
- Old completed campaign saves unlock the new opening. Unfinished saves remain intact. Individual earlier mission replays end before chaining into this episode. Local fixtures are gated to localhost and use a separate playtest save.

Publication and live-browser verification are recorded in the release metadata outside the shipped game. Prior release checks follow for context.

---

# Chapter 6 — release checks

Version 4.3.0, September 29, 2026. Playable scope now includes Hold Until Empty at Breed’s Hill after the opening and The Guns North. Later campaign missions remain in development.

- `npm test`: 82 tests pass across Chapters 4–6 and shared audio. New tests cover all three assaults on Normal, both ammunition choices, one-use supplies across saves, abandonment, incoming cannon warnings, cover, forced historical withdrawal, both rescues, waiting for Ward, extraction, save migration, corrupt state, and enemies navigating earthworks.
- `npm run check`: JavaScript syntax checks pass. All objectives remain reachable, all recorded lines have media, and every cinematic beat has a bounded camera outside solid scenery.
- Packaged media: 119 matching prerecorded voice clips and five original music tracks. The new 112 BPM arrangement has a measured peak of 0.7804 and RMS of 0.1803. No live synthesis is used.
- Browser testing uses a hidden browser with `muted=1`, which disables voice, score, and generated effects for the entire session. Audio was checked through manifests and measured levels; it was not audibly auditioned.
- New battlefield visual checks, normal keyboard movement and bracing interaction, firing/reload, contextual volley orders and ammunition response, upward look, pause/mute, cinematic playback, rescue handoff, and ending transitions are checked in the browser. Localhost-only phase fixtures supplement the full deterministic simulation playthrough; they do not run on GitHub Pages and use an isolated playtest save.
- The camera/control regressions still cover mouse, touch, arrows, sensitivity, and real Three.js crosshair alignment. Physical phones, gamepads, and visible-browser pointer lock were not exercised. WebGL is required.

## Previous installment

# Chapter 6 — release checks

Version 4.2.0, September 29, 2026. Playable scope: Ward’s release, the Powder Road, Lexington, Concord retreat, and The Guns North at Ticonderoga. Later missions remain in development.

- `npm test`: 75 tests pass across Chapters 4–6 and shared audio. New checks exercise quiet capture, alarm/rescue, cinematic checkpoint state, complete hauling and extraction, fort occlusion, interrupted interactions, malformed fort saves, and migration of completed opening saves. All objectives have a traversable route and every cinematic beat has bounded camera framing outside solid scenery.
- `npm run check`: all JavaScript syntax checks pass.
- Packaged media: 79 matching prerecorded voice clips and four original score arrangements. New performances total approximately 99 seconds. No model or synthesis service runs in the browser.
- Hidden, forced-muted browser playthrough: mission-select cinematic entry, approach, sentry alarm, Nathan rescue, checkpoint restart, passage entry, capture cinematic, correct return to stage 3, stores, cannon inspection, rope pickup, movement-driven hauling, final inventory handoff, final cinematic, and mission-complete screen. Returning to the story restored the existing Ward escort checkpoint.
- Sound stayed muted throughout testing. Recordings were generated and checked by file/manifest and audio-level validation; they were not audibly auditioned.
- The existing positive-pitch controls fixes remain covered by mouse, touch, arrow, sensitivity, and real Three.js camera/crosshair regressions.

The tests cover this installment, not the complete planned chapter. Physical phones, gamepads, and visible-browser pointer lock were not exercised in this pass. WebGL is required.

<details><summary>Earlier release checks</summary>

# Chapter 6 opening — release checks

Validated September 28, 2026. This release implements Part I only: Ward's release, the Powder Road warning route, Lexington rescue, and the local defense during the retreat from Concord.

- Version 4.1: `npm test`: 64 passed, 0 failed, including 17 Chapter 6 tests and the existing Chapter 4/5 and shared audio checks.
- `npm run check`: all JavaScript syntax checks passed.
- Simulation checks: every objective is reachable around solid scenery; escort and rescue checkpoints restore; patrol detection can be escaped; crouching behind the stone wall blocks fire; muskets fire one round and require reloading; a complete defense and extraction is winnable; abandoning the wagon cannot complete the encounter; malformed saves are rejected.
- Asset checks: all 49 scripted lines have matching packaged recordings, and all four music arrangements exist.
- Browser checks: opening menu, cinematic playback and skip-to-play transition, six scene-gallery entries, movement, musket pickup, quick fire/reload inputs, pause/retry/settings, desktop layout, and a 390 × 844 mobile layout. No JavaScript errors appeared in the inspected browser logs.
- Quick action taps are buffered until the next game frame, and Chapter 6 uses its own save namespace. Localhost mission fixtures use a separate playtest save and are disabled on public hosts.

The 4.1 regression checks also cover volley warning and actual cover protection, rescue dialogue order and healing, one-use supplies across restored saves, enemies routing around walls independently of a player jump, Ward routing around fences without teleporting, compatibility with older saves, and unobstructed camera framing for every cinematic beat. Camera push-ins stop at a bounded distance and reduced-motion cameras remain stationary.

The 4.1 browser pass uses a hidden tab with `muted=1&preview=1`. Both the page mute state and the speech element's muted state were verified. Checks include Ward's interaction, Concord pickup and reload, individual mission entry, campaign checkpoint preservation after replay, graphics switching, locked silent-session settings, the cinematic gallery, Lexington's volley indicator, and a 390 × 844 layout. No sound was auditioned during this pass; packaged media and the unchanged voice/music controllers are covered by asset and lifecycle tests.

Version 4.1.1: 69 automated tests pass, including five new controls regressions. These exercise the actual gameplay renderer with a real Three.js camera (without a GPU) to verify mouse, touch, and arrow directions, pitch limits, sensitivity, and agreement between the crosshair and the musket hit calculation. Mouse button tests verify that releasing one button preserves the other. Hidden, muted browser checks verify Up/Down visually and confirm that pressing S cancels auto-walk. Pointer capture was not granted in the hidden test browser, so physical mouse capture/unlock and multi-finger touch behavior were not manually exercised.

These checks are not a full manual playthrough on every device. Mobile presentation was checked through a browser viewport; physical phones and controller support were not tested. WebGL is required. Captions provide a fallback if audio cannot load. Later Chapter 6 missions remain planned work.

</details>
