# Chapter 6 opening — release checks

Validated September 28, 2026. This release implements Part I only: Ward's release, the Powder Road warning route, Lexington rescue, and the local defense during the retreat from Concord.

- `npm test`: 57 passed, 0 failed, including 10 Chapter 6 tests and the existing Chapter 4/5 and shared audio checks.
- `npm run check`: all JavaScript syntax checks passed.
- Simulation checks: every objective is reachable around solid scenery; escort and rescue checkpoints restore; patrol detection can be escaped; crouching behind the stone wall blocks fire; muskets fire one round and require reloading; a complete defense and extraction is winnable; abandoning the wagon cannot complete the encounter; malformed saves are rejected.
- Asset checks: all 49 scripted lines have matching packaged recordings, and all four music arrangements exist.
- Browser checks: opening menu, cinematic playback and skip-to-play transition, six scene-gallery entries, movement, musket pickup, quick fire/reload inputs, pause/retry/settings, desktop layout, and a 390 × 844 mobile layout. No JavaScript errors appeared in the inspected browser logs.
- Quick action taps are buffered until the next game frame, and Chapter 6 uses its own save namespace. Localhost mission fixtures use a separate playtest save and are disabled on public hosts.

These checks are not a full manual playthrough on every device. Mobile presentation was checked through a browser viewport; physical phones and controller support were not tested. WebGL is required. Captions provide a fallback if audio cannot load. Later Chapter 6 missions remain planned work.
