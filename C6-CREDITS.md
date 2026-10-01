## A City Is Not an Army — 4.9.0

Original September 1777 crew dialogue, five staged scenes, farm withdrawal, packing room, annotated map, physical journal loads, collapsing timber, two usable river crossings and collision-aware wagon/companion routes. Daniel Pike is an invented wounded courier. The player helps one departing wagon; this is not a claim that the fictional crew saved the entire Congress archive.

51 new performances use stock synthetic voices. No real person’s voice is cloned. **The Papers We Carry**, 104 BPM, is an original local instrumental arrangement. All environments and props are code-built, with no borrowed Halo or Call of Duty assets.

## Across the Black Water — 4.8.0

The December 1776–January 1777 crew dialogue, five staged scenes, snow and water animation, drifting ice, ferry/cargo models, street and farm sets, tiller physics, coordinated covering operation, surrender and extraction are original game work. The crew’s operations and Hessian representative are fictional. The representative’s English dialogue is a translation convention, with no claim to reproduce a documented person’s words.

51 new synthetic performances use existing stock Kokoro voices; no real person’s voice is cloned. Three new original local arrangements: Across the Black Water (84 BPM), The Town Before Morning (116 BPM), Keep the Place Beside You (76 BPM). No borrowed Halo or Call of Duty assets, recordings, or scores.

# Chapter 6 — production credits

The Long Road Home through A City Is Not an Army uses original game dialogue, code-built environments, and the established Chapter 5 cast rigs. Cutscenes render in real time. No generated cover image or prerecorded movie is used to imply a different gameplay renderer.

## Voice

476 prerecorded synthetic performances, 2181.921 seconds, generated locally using the existing Kokoro-82M v1.0 / kokoro-onnx production setup. These are stock synthetic voices, not recordings or imitations of historical people or named human performers. See VOICE-CREDITS.md for the upstream model and inference-package licenses. The inference model and libraries are not shipped in the browser game.

| Character | Stock voice |
| --- | --- |
| Rowan Vale | am_fenrir |
| Elias Ward | bm_george |
| Mara Reed | af_heart |
| Isaiah Mercer | am_michael |
| Thomas Vale | bm_fable |
| Nathan Cole, fictional runner | am_puck |
| Jonas Bell | am_onyx |
| Royal intermediary | bm_lewis |
| Virginia enslaver | am_eric |
| Local militia captain | bm_george |
| Daniel Pike, fictional Congress courier | am_eric |

`c6-voices.mjs` records exact text, voice identifiers, speaking rates, filenames, duration, and level measurements. Filenames are content-addressed. Audio is mono 24 kHz MP3 at 96 kbps with trimming, normalization, and edge fades. The dialogue controller handles caption fallback, queuing, pause/resume, and missing media. No live synthesis, microphone, account, or API key is required.

## Music and sound

Fourteen original instrumental arrangements, 585.529 seconds of loop material, rendered from the project’s original procedural instrument system. No sampled commercial recording or Halo music is used.

- **A Place in the Wagon** — 68 BPM; reunion and the crew’s closing scene.
- **Lanterns on the Powder Road** — 88 BPM; the warning route.
- **Before the First Light** — 94 BPM; rescue and uncertain movement.
- **Everyone We Can** — 120 BPM; the wagon defense.
- **The Last Cartridges** — 112 BPM; the three assaults at Breed’s Hill.
- **Names on the Water** — 88 BPM; Isaiah’s coastal passage.
- **The Weight We Carry** — 100 BPM; the winter gun road and ascent.
- **Ink Before Thunder** — 92 BPM; the Philadelphia print run and street dispatch.
- **Leave a Road Behind** — 110 BPM; the New York fighting retreats.
- **Every Quiet Oar** — 72 BPM; the East River evacuation.
- **Across the Black Water** — 84 BPM; the Delaware crossing and far-bank landing.
- **The Town Before Morning** — 116 BPM; the Trenton and Princeton crew operations.
- **Keep the Place Beside You** — 76 BPM; the winter victory aftermath.
- **The Papers We Carry** — 104 BPM; the Congress packing room and western road.

`c6-score.mjs` preserves the tempo, measured loop boundaries, peak/RMS values, and filenames. Music transitions across play sections, ducks beneath speech, and pauses with gameplay. Lexington’s opening scene uses silence before the shot. Gunfire, interaction sounds, bell partials, and footsteps are synthesized at runtime with Web Audio.

## Visuals and software

Original procedural woodland, farm, courtyard, Lexington, and retreat environments; brick/wood/ground textures are drawn by code. Existing articulated character rigs are reused with newly authored blocking and camera coverage. Three.js is distributed locally under its existing license in THREE-LICENSE.txt. Optional Google Fonts are Barlow and Barlow Condensed, with system fallbacks; all game logic, voice, and music are local repository assets.

The 4.1 scenery pass adds original shader skies, layered trees, instanced hills and ground detail, softened dirt tracks, clouds, supply props, campfire lighting, wagon wheel animation, and a more articulated generic soldier rig. The camera director defines stable, bounded shot movement and gives each spoken beat a lead-in and reaction hold. These visuals are rendered by the game, with no external image-generation service or new media dependency.

Code retains the project’s MIT license. Original music and produced dialogue assets use the project’s CC BY 4.0 content terms to the extent rights apply. Source-derived reference content retains its separate attribution terms. No analytics, remote save service, paid API, or user-data collection is introduced.

Version 4.2 adds 30 locally generated performances and three real-time cinematics. The original Ticonderoga set includes code-built fort walls, ordnance, damaged gun fittings, rolling timber supports, an animated hauling rope, boats, shader lake water, a dawn sky, and batched trees, grass, and rubble. Nathan uses a separately colored instance of the existing crew rig. The mission reuses the original night, tension, and home score themes.

Version 4.3 adds 40 synthetic performances, four story scenes, and an original battle arrangement. The new code-built battlefield includes earthworks, ammunition posts, a damaged flank, cannon, wounded soldiers, lower harbor ships, distant Charlestown smoke, and instanced field detail. Militia visibly load and fire, incoming cannon shots have ground warnings, Ward ducks Rowan below the parapet, and extraction waits for Ward. No commercial game assets or soundtrack are used.


Version 4.4 adds 59 synthetic performances, seven real-time scenes, one original instrumental loop, and two playable sections. Procedural assets include animated water, skiffs with articulated crews, oars and wakes, a royal tender silhouette, reed beds, coastal islands, cypress-like trees, lantern visibility sectors, a mooring boom, and a repairable creek bridge. All are original code-built approximations. The inlet, channels, relief crossing and their geometry are fictional, not survey reconstructions. No commercial game assets, music samples, or likeness imitation is used.

Version 4.5 adds 48 synthetic performances, five real-time scenes, three playable sections, and the original winter score. Code-built snow, sledge, ropes, gun carriage, ballast, terrain, earthworks, ships and street barriers use no commercial game assets.

Version 4.6 adds 64 synthetic performances, five real-time scenes, two playable sections, and Ink Before Thunder. The hand press has a moving carriage, screw, platen, handle, type form and sheet; the city has covered workspaces, a dock, rain, and a courier road. Thomas’s desk has an original stylized Declaration texture with a fictional crooked letter, not a facsimile of a surviving historical printing. All scenes use the same real-time renderer and crew rigs.

## No Ground Left additions

84 new synthetic performances continue the established cast. The local 110 BPM instrumental **Leave a Road Behind** and 72 BPM **Every Quiet Oar** use the existing original synthesis engine; no Halo or other commercial game audio is used. Procedural ships, rowboat/oars, lit docks, battlefield haze, carried wounded, shelter door, signal cloth and moving wagon are original code-built set pieces. See the score manifest for exact levels and loops.
