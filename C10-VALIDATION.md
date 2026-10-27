# Chapter 10 — release 6.1.0 validation

The six-episode campaign is upgraded; the 90-question bank, sixteen terms, historical outcomes and save namespace are preserved.

## Automated checks

301 repository tests pass, covering older campaigns, the study hub and Chapter 10. All configured JavaScript syntax checks pass, including the new cinematic director and dispatch module.

New checks cover moving wagon collision lanes, clean vaults and close passes; selected-ship boosts, cooldowns and wind; optional single-use rally pennants and dash rewards; timed dispatches requiring the correct historical destination. Early/late launches grant no progress and missed parcels recycle. All eight transfers must complete across the 1833/1836 rule change. Existing checks retain canonical quiz answers, balanced rounds, interrupted saves, exam feedback and sequential campaign credit.

Separate geometry checks sample fourteen authored dialogue tracks at 100 frames in desktop and portrait proportions. Street and harbor checks run 650 updates per scene at both proportions. These validate finite cameras, transforms and geometry, not measured frame rates on physical phones.

## Muted browser verification

Tests used hidden tabs with ?muted=1&preview=1. Speech/music elements were observed muted, paused and at time zero. Preview progress uses a separate record. Audible audition and physical phone/gamepad testing are not claimed.

- Completed all four courier pickups through steering, sprinting and dashing, including rapid lane changes; reached the no-majority conclusion.
- Printed all six headlines through actual rhythm controls and verified the following power/exclusion scene.
- Routed all six actual harbor boats, used full-sail boosts, and verified replacement ships and the compromise ending.
- Completed all eight timed dispatches using keyboard rail selection and launching, including perfect rewards and the public-land specie rule change.
- Inspected all three court records, tested a wrong slot, rebuilt the legal timeline and inspected the forced-migration scene.
- Carried all three rally placards through actual movement, proximity interaction and dashes. Verified crowd bonuses and campaign completion.
- Inspected representative courier, harbor, bank, record and rally cinematics: moving actors, historical inserts, sentence-length captions, pause/skip and the family departure camera. Repaired hidden harbor water and an obstructed bank camera during QA.
- Finished a 15-question rehearsal at 15/15, reloading after its first locked answer. Question, option order and saved answer restored; explanations remained hidden until results.
- Inspected a 375 x 812 embedded CSS viewport for cinematics and dispatch. Successfully tested the touch launch control and assisted timing display. Private fixtures are excluded from publication.
- Final desktop walkthrough browser logs showed no runtime errors or warnings.

The 6.0 baseline additionally completed all ninety distinct questions through answer controls and checked the sixteen-term list. Quiz content and the study save format are unchanged in 6.1.

## Publication acceptance

Publish authored runtime files, tests and public guides only. Exclude classroom documents, extracted text, private audits, local tools and QA fixtures. Acceptance requires a successful GitHub Pages run for the release commit, matching changed public-file hashes, and a muted live browser smoke test. Commit, deployment and hash evidence is recorded locally after publication.
