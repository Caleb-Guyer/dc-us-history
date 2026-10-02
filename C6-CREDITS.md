## The Wider War — 4.12.0

Original June 1778–July 1779 crew dialogue, six authored scenes, a following combat section, two navigable convoy routes, covered supplies, naval silhouettes, shoals, recoverable hull damage, independent tiller/look, a survivor and pursuing cutter, burned stores, carried water, cooled/lifted timber and civilian adult/child rigs. Adrien Morel, Lydia Blake, her relatives, the survivor and the local operations are invented. Adrien's stock English performance is a translation convention, not a claimed reconstruction of an accent or historical speech.

63 new stock synthetic performances, with no human voice cloned. **Beyond the Water We Can See** and **A Light Behind Us** are original local instrument arrangements. The earlier drill score returns for its combat payoff. No commercial game assets, recordings or music are copied.

## The Winter Line — 4.11.0

Original winter dialogue, five authored scenes, a physically pulled covered sledge, changing ford and raised crossing, cooperative care and laundry, local credit/barter settlement, following practice detachment and wooden targets. Anne Hart, Asa Freeman, the patient and merchant are fictional individuals. Mara is not Esther DeBerdt Reed; the latter's 1780 work remains for its proper date.

64 new stock synthetic performances, with no cloned human voice. The original 80 BPM **Keep the Fire Going** and 110 BPM **One Command, Many Hands** scores reuse the project's procedural instrument system. No Halo or Call of Duty media is copied.

## Three Roads to Albany — 4.10.0

Original October 1777 crew dialogue, seven authored scenes, autumn relay, handled map markers, timed axe/tree fall, protected civilian rope passage, woodland fieldworks, advancing militia, river-watch boats, two signal posts, carried courier, physical blocking timber, white flag, laid-down weapons and marching British prisoners. Jacob and the river courier are invented individuals. Stock synthetic English represents translated dialogue; no claim is made to reproduce Mohawk language, a documented accent or a real person’s voice. Jacob’s coat is an original ordinary travel costume, not a claimed reconstruction.

66 new performances and one original 108 BPM score, **Where the Roads Close**. Existing crew voices, rigs and original score system are reused. No commercial game assets or music are copied.

## A City Is Not an Army — 4.9.0

Original September 1777 crew dialogue, five staged scenes, farm withdrawal, packing room, annotated map, physical journal loads, collapsing timber, two usable river crossings and collision-aware wagon/companion routes. Daniel Pike is an invented wounded courier. The player helps one departing wagon; this is not a claim that the fictional crew saved the entire Congress archive.

51 new performances use stock synthetic voices. No real person’s voice is cloned. **The Papers We Carry**, 104 BPM, is an original local instrumental arrangement. All environments and props are code-built, with no borrowed Halo or Call of Duty assets.

## Across the Black Water — 4.8.0

The December 1776–January 1777 crew dialogue, five staged scenes, snow and water animation, drifting ice, ferry/cargo models, street and farm sets, tiller physics, coordinated covering operation, surrender and extraction are original game work. The crew’s operations and Hessian representative are fictional. The representative’s English dialogue is a translation convention, with no claim to reproduce a documented person’s words.

51 new synthetic performances use existing stock Kokoro voices; no real person’s voice is cloned. Three new original local arrangements: Across the Black Water (84 BPM), The Town Before Morning (116 BPM), Keep the Place Beside You (76 BPM). No borrowed Halo or Call of Duty assets, recordings, or scores.

# Chapter 6 — production credits

The Long Road Home through The Wider War uses original game dialogue, code-built environments, and the established Chapter 5 cast rigs. Cutscenes render in real time. No generated cover image or prerecorded movie is used to imply a different gameplay renderer.

## Voice

669 prerecorded synthetic performances, 3436.729 seconds, generated locally using the existing Kokoro-82M v1.0 / kokoro-onnx production setup. These are stock synthetic voices, not recordings or imitations of historical people or named human performers. See VOICE-CREDITS.md for the upstream model and inference-package licenses. The inference model and libraries are not shipped in the browser game.

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
| Jacob, fictional individual Mohawk messenger | am_onyx, different speaking rate |
| Anne Hart, fictional camp worker | af_heart, different speaking rate |
| Asa Freeman, fictional free Black soldier | am_michael, different speaking rate |
| Local merchant | bm_fable, different speaking rate |
| Adrien Morel, fictional French supply agent | bm_lewis, different speaking rate |
| Lydia Blake, fictional displaced civilian | af_bella |

`c6-voices.mjs` records exact text, voice identifiers, speaking rates, filenames, duration, and level measurements. Filenames are content-addressed. Audio is mono 24 kHz MP3 at 96 kbps with trimming, normalization, and edge fades. The dialogue controller handles caption fallback, queuing, pause/resume, and missing media. No live synthesis, microphone, account, or API key is required.

## Music and sound

Nineteen original instrumental arrangements, 773.459 seconds of loop material, rendered from the project’s original procedural instrument system. No sampled commercial recording or Halo music is used.

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
- **Where the Roads Close** — 108 BPM; the northern flank and surrounding line.
- **Keep the Fire Going** — 80 BPM; the winter supply road and divided camp work.
- **One Command, Many Hands** — 110 BPM; formation movement and the practice range.
- **Beyond the Water We Can See** — 104 BPM; convoy navigation and interception.
- **A Light Behind Us** — 118 BPM; the burning shore and civilian rescue.

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


## The South Breaks additions — 4.13

74 new locally generated stock-voice synthetic performances; no actor imitation. Samuel uses am_eric, Bennett bm_fable, the Creek visitor am_onyx and Eliza af_bella; established cast voices continue. The visitor’s speech is an English translation convention. Original instrumental loops **The Roads Close** (116 BPM) and **Keep the Roll** (84 BPM) use the established deterministic synthesis engine. Peaks/RMS and measured loops are preserved in c6-score.mjs. No commercial game audio or assets are used.

Original code-built city, changing road barrier, bombardment warning ring, hospital cart/patients, rescue axe and broken timber, captured column, civilian skiff, guarded hulks and patrol lantern sector extend the established procedural art. The maps and uniforms are approximations, not precise historical reconstructions. Scenes use individually authored bounded cameras and visible character blocking. Music and voices were tested silently for metadata and packaged assets; no audible audition is claimed.


## Country Against Itself additions — 4.14

71 new locally generated stock Kokoro performances. Joseph uses am_eric, Hannah af_bella, the tenant bm_fable and the neighbor bm_george; no actor imitation. Original 120 BPM **Country Against Itself** and 78 BPM **The Chair in the House** use the established deterministic synthesis engine. Their peaks are 0.7142 and 0.6550, RMS about 0.1804. Voices and music were checked for packaged metadata and nonempty media, with playback forced silent during development.

Original procedural ditch, advancing line, actual withdrawing section, oath desks and gate, hollow house with window and hinged doors, porch fire/water, held torch, moving three-person household and supply depot extend the established rigs. Individually authored cameras support nine scenes. These sets are stylized fiction rather than surveyed reconstructions; no commercial game assets are used.


## Make Them Chase additions — 4.15

44 new original stock Kokoro performances. **The Signal He Followed**, 116 BPM, and **Ahead of the Hooves**, 138 BPM, are original local instrumental arrangements; peaks 0.7139/0.6650, RMS about 0.1804. The quieter previous inland score returns for the aftermath. No commercial game music, character voices or art is copied.

Original procedural horses with animated articulated legs, mounted crew pose, carried packs, red-coated pursuing rider, bridged tributary, Dan landing boats, following six-person section, advancing British formation and surrendered prisoners. Four scenes use individually authored cameras. These are stylized local sets, not surveyed battlefield reconstructions. Testing is forced silent.


## The Price of the Field additions — 4.16

56 new stock Kokoro synthetic performances. **The Cost of Ground**, 118 BPM, and **The Empty Place**, 66 BPM, are original local instrumental arrangements. The latter removes field percussion for the provision stop, bedside, aftermath and burial. Measured peaks 0.6869 / 0.7117, RMS about 0.1804. No commercial game music or voices copied; testing stays forced silent.

Original procedural flour cart and carried linen, six moving withdrawal soldiers, wound and chest dressing, physically carried Ward and stranger, hands positioned on the dressing with two-bone inverse kinematics, a still bedside performance after death, following survivors and a small roadside grave. Seven scenes use individually authored cameras. These are stylized fictional local sets rather than surveyed battlefield reconstructions.
