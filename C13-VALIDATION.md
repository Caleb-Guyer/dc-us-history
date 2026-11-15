# Chapter 13 validation · 8.4.0

All **446 automated tests** and **147 configured syntax checks** pass. Added regressions cover overlapping physical key and pointer sources, focus loss, storage failures and recovery, coherent cache versions, the printshop departure path, connected cloth and hand skinning, apron clearance and held-paper contact. All 104 question IDs, correct answers and answer positions remain compatible with saved records. The final content sweep replaced 198 wrong choices in 71 further question sets with same-topic misconceptions; it left correct-answer text, explanations, sources, ordering and term metadata unchanged. The quiz retains fourteen bold terms and exactly three term questions plus twelve chapter questions across the five sections.

Muted background browser play completed all three missions with ordinary controls: eight workshop jobs across three benches, six courier bundles in 13 active seconds, and all six hall tasks with carried pages and both final holds. Each required its two historical decisions. Workshop credit survived leaving the ending early and reloading. A recalled card and a locked practice answer survived reload and browser Back; the hub showed 3/3 games, 1/14 cards and 1/104 questions.

Visual checks caught and corrected intersecting aprons, cream shirt diamonds, fixed shoulder seam tubes, paper passing through hands, floating tools and bundles, an exterior workshop camera and the printshop's unfinished ground and horizon. The finished views were reloaded and checked. Detailed/Balanced switching worked from the keyboard. All fourteen local material maps loaded without failures, and no browser warnings or errors were captured in the completed checks.

At **812×375**, the game, pause panel, decisions and all six held touch controls fit within the viewport without horizontal overflow. Held touch movement was used in the hall playthrough. At **375×812**, scene captions and controls remained readable and on screen. The temporary viewport override was reset. Space activated a focused Pause button instead of triggering the game action.

Storage-failure and history-conflict cases were checked with controlled providers in automated tests; normal reload and Back were also checked in the browser. Failed win saves retry when finishing or leaving the ending. Unsaved work can remain in the live tab, but a full reload still depends on usable browser storage. Sound stayed locked off throughout testing; optional device speech and synthesized music were not audibly auditioned.

## Gameplay update · 8.3.0

All **429 automated tests** pass. New regressions cover fresh timing versus held assistance, real bench reach, carrying and delivering pages, sustained task holds and cancellation, varied facial geometry, hairline clearance and packet support. The configured syntax checks also pass.

Muted background browser checks completed all three games with ordinary controls: eight workshop jobs across three benches with a precision tap, six courier deliveries with a clean vault in **13 active seconds**, and all six convention tasks in **17 seconds**. The convention route used held on-screen movement at **375×812**, carried the pages between actual task points, cleared the carried state at delivery, and completed both short holds. Each mission required both historical decisions. A deliberate wrong choice allowed correction.

The workshop win was left through Games before its ending finished; its credit survived reload. This checks the repaired early-exit save case. Revealed flashcards restored after reload and accepted a recall rating. A saved rehearsal answer restored locked at 1/15. The quiz still selects exactly three term questions and twelve chapter questions across all five sections. Wrong-answer polish keeps all IDs, correct answers, positions, source references and save formats compatible.

Visual checks covered tailored clothes, facial variation, readable compact subtitles, differentiated workshop stations, moving courier streets, the Martha close-up, Detailed/Balanced switching, all **14/14 material maps**, phone captions and task controls. No browser console warnings or errors were captured in the completed playthroughs. The viewport override was reset. Sound stayed locked off; optional device speech and synthesized music were not audibly auditioned.

## Character and material update · 8.2.0

All **422 automated tests** pass. New checks cover sculpted character geometry, articulated animation, the exact fourteen-map material manifest, local asset integrity and the cinematic depth calculations. Configured syntax checks cover the new rendering modules as well as the existing site.

Muted browser play completed all three games with ordinary keyboard input and held on-screen steering: the workshop finished eight jobs across three benches in **17 active seconds**; the courier delivered six bundles in **11 seconds**, with a clean cart vault; the hall completed six preparation tasks in **21 seconds**. Each required both historical decisions and finished without waiting for the deadline. Completed game credit survived reload.

Visual checks verified all **14/14 local material maps loaded with no failures**, Detailed/Balanced switching, fifteen-shot camera definitions, readable close-ups, prop staging and the 375×812 phone layout without horizontal overflow. The phone hall route used held movement controls. The viewport override was reset. No browser warnings or errors were captured during the completed playthroughs. Sound stayed locked off with `muted=1`; optional speech and music were not audibly auditioned.

The 104-question bank, fourteen bold terms, exact 15-question quiz format and study save schema are unchanged. The new material pack totals about 7.6 MB before HTTP compression and loads locally from the site. This is a browser 3D game with authored geometry and photographed surfaces; scenes and representative characters do not claim to be literal reconstructions. [Art provenance and licenses](C13-ART.md) accompany the release.

## Action update · 8.1.0

All **414 automated tests** and configured syntax checks pass. The update adds simulation tests for sprint energy, normalized diagonal movement, timing chains, hazard warnings, close passes, volunteer crossings and held-action behavior; three director checks cover all fifteen shots, bounded cameras and historical distinctions.

Muted browser playtests completed all three revised games using ordinary keyboard and held on-screen controls:

| Game | Tasks | Active play | Observed result |
| --- | ---: | ---: | --- |
| The Shared Bench | 8/8 | 17 seconds | Three benches, an 8× chain, two decisions and deliberate correction |
| The Abolition Press | 6/6 | 16 seconds | Three paths, one clean cart vault, sprint input and two decisions |
| Open the Hall | 6/6 | 17 seconds | Held touch steering, visible preparation, two milestone decisions and immediate finish |

The 375×812 phone checks covered the simplified menu, direct story launch, readable scene captions, declaration inserts, touch controls and focused-button pause recovery. Viewport overrides were reset. Completed games persisted after reload, and the separate review record retained game credit. Sound was locked off with `muted=1`; no browser console warnings or errors were captured in the completed playthroughs. Device speech and optional synthesized music were not audibly auditioned.

The 104-question bank, fourteen bold terms and quiz format remain intact. Source coverage and original release checks follow below.

## Initial release · 8.0.0

All **405 automated tests** and the configured JavaScript syntax checks pass. New checks cover source and bold-term coverage, exact rehearsal composition across 100 seeds, shuffled answer correctness, saved sessions, mistake correction, flashcard credit, isolated storage, malformed-save recovery, mission feasibility, natural movement, timing, vaults and task-driven decisions. The uploaded classroom Word file, extracted text and private QA fixtures are excluded from publication.

The review uses a separate Chapter 13 save namespace. Browser testing uses `?muted=1&preview=1`, which keeps the test record separate from ordinary progress. The original Chapter 4–11 files and records are retained.

## Muted browser checks

- Completed a 15-question rehearsal with exactly 3 distinct key terms and 12 chapter-topic questions across all five sections. A deliberate mistake produced a 14/15 result and a working correction round. Rehearsal explanations appeared only at the finish.
- Saved and reloaded the rehearsal at question 6. Completed all 104 distinct practice questions with immediate explanations and restored the full round at question 53.
- Completed all 14 term cards, tested a “need another look” rating, and restored a revealed card after leaving and reloading. Term search and all five section links were checked.
- Completed the cooperative workshop with ordinary keyboard movement and work controls: 8/8 tasks, 33 active seconds. A wrong decision showed feedback and allowed correction.
- Completed the abolition courier with ordinary steering and vault input: 6/6 bundles, 36 active seconds. Escape resumed from a focused pause-menu button.
- Completed the revised convention mission with held on-screen steering and keyboard controls: six preparation tasks, both milestone decisions and 17 active seconds. The game finished when the tasks were complete, without waiting for the deadline.
- Checked the 375×812 phone layout for term search, practice, captions, decisions and touch controls; no horizontal overflow. Reset the viewport afterward.
- Verified scene pause/skip, direct game links, return navigation, saved game credit and browser reload. The preview record reached 100% with 104/104 questions, 14/14 cards and 3/3 games. The ordinary Chapter 13 record remained at 0%.
- Sound remained off throughout. No browser console errors or warnings were captured during the completed checks. Optional speech and music were not audibly auditioned.

The games teach selected connections through fictional representative tasks in documented settings. The complete review bank provides broader chapter coverage. Study completion is activity credit, not a predicted class score.
