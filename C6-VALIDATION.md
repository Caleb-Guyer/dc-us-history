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
