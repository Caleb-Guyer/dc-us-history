# Chapter 6 opening — production credits

The Long Road Home: Part I uses original game dialogue, code-built environments, and the established Chapter 5 cast rigs. Cutscenes render in real time. No generated cover image or prerecorded movie is used to imply a different gameplay renderer.

## Voice

49 prerecorded synthetic performances, approximately 172 seconds, generated locally using the existing Kokoro-82M v1.0 / kokoro-onnx production setup. These are stock synthetic voices, not recordings or imitations of historical people or named human performers. See VOICE-CREDITS.md for the upstream model and inference-package licenses. The inference model and libraries are not shipped in the browser game.

| Character | Stock voice |
| --- | --- |
| Rowan Vale | am_fenrir |
| Elias Ward | bm_george |
| Mara Reed | af_heart |
| Isaiah Mercer | am_michael |
| Thomas Vale | bm_fable |
| Nathan Cole, fictional runner | am_puck |

`c6-voices.mjs` records exact text, voice identifiers, speaking rates, filenames, duration, and level measurements. Filenames are content-addressed. Audio is mono 24 kHz MP3 at 96 kbps with trimming, normalization, and edge fades. The dialogue controller handles caption fallback, queuing, pause/resume, and missing media. No live synthesis, microphone, account, or API key is required.

## Music and sound

Four original instrumental arrangements, approximately 173 seconds of loop material, rendered from the project’s original procedural instrument system. No sampled commercial recording or Halo music is used.

- **A Place in the Wagon** — 68 BPM; reunion and the crew’s closing scene.
- **Lanterns on the Powder Road** — 88 BPM; the warning route.
- **Before the First Light** — 94 BPM; rescue and uncertain movement.
- **Everyone We Can** — 120 BPM; the wagon defense.

`c6-score.mjs` preserves the tempo, measured loop boundaries, peak/RMS values, and filenames. Music transitions across play sections, ducks beneath speech, and pauses with gameplay. Lexington’s opening scene uses silence before the shot. Gunfire, interaction sounds, bell partials, and footsteps are synthesized at runtime with Web Audio.

## Visuals and software

Original procedural woodland, farm, courtyard, Lexington, and retreat environments; brick/wood/ground textures are drawn by code. Existing articulated character rigs are reused with newly authored blocking and camera coverage. Three.js is distributed locally under its existing license in THREE-LICENSE.txt. Optional Google Fonts are Barlow and Barlow Condensed, with system fallbacks; all game logic, voice, and music are local repository assets.

The 4.1 scenery pass adds original shader skies, layered trees, instanced hills and ground detail, softened dirt tracks, clouds, supply props, campfire lighting, wagon wheel animation, and a more articulated generic soldier rig. The camera director defines stable, bounded shot movement and gives each spoken beat a lead-in and reaction hold. These visuals are rendered by the game, with no external image-generation service or new media dependency.

Code retains the project’s MIT license. Original music and produced dialogue assets use the project’s CC BY 4.0 content terms to the extent rights apply. Source-derived reference content retains its separate attribution terms. No analytics, remote save service, paid API, or user-data collection is introduced.
