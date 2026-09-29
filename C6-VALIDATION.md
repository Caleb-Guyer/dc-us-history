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

These checks are not a full manual playthrough on every device. Mobile presentation was checked through a browser viewport; physical phones and controller support were not tested. WebGL is required. Captions provide a fallback if audio cannot load. Later Chapter 6 missions remain planned work.
