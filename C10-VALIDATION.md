# Chapter 10 release validation

Release 6.0.0 adds the six-episode Majority campaign and Question Room. The app is static HTML, CSS, JavaScript and packaged media. No build, account or live API is required.

## Automated checks

All **290 tests passed**, including existing Chapter 4–8 and study-hall regression tests plus 26 new Chapter 10 checks. All package syntax checks passed. The new checks exercise actual movement through the courier route, all six harbor arrivals, placard pickup and delivery, collisions/recovery, normalized directions, required items, press timing and anti-spam, eight correct bank transfers, inspection before record placement, sequential episode credit and packaged voice files matching current dialogue.

Question checks validate 90 distinct four-option questions, 18 per topic, all 16 bold terms, explanations and source references. One hundred seeded mixed rounds preserve balanced section coverage. Topic, term and missed-question filters remain distinct. Save checks preserve deck/order, locked answers, feedback mode and progress, reject malformed decks, recover from malformed completion lists and prevent duplicate credit. Correctness and results are recomputed from canonical answers.

The historical audit read all 67 source paragraphs and reviewed all 90 questions. The public source guide records textbook errors and disputed statistics rather than turning them into correct quiz answers.

## Muted browser verification

Testing used hidden browser tabs with `?muted=1&preview=1`. Speech and music elements were observed muted, paused and at time zero. Test progress was separate from production progress. Audible audition and physical phone/gamepad testing are not claimed.

- Completed the courier with all four actual electoral-return pickups, rapid lane changes, jump/dash inputs and the correct no-majority conclusion.
- Printed all six headlines through timed presses, including wide-timing assistance, then verified the power/exclusion conclusion.
- Routed all six actual harbor ships using the displayed ship/dock controls. The historical resolution retained both federal enforcement authority and tariff compromise; it did not invent a battle.
- Tested a wrong bank tray, corrective feedback, physical pointer dragging and all eight transfers across the 1833/1836 rule change.
- Inspected the three court records, tested a wrong slot, physically dragged a record and completed the legal timeline. The following scene identifies the 1838–39 Cherokee forced migration under Van Buren.
- Carried all three rally placards to their corresponding platforms using actual ground movement, proximity interactions and a dash around parade traffic. Reached the campaign ending and direct quiz entry.
- Finished a 15-question rehearsal with a deliberate miss. Feedback stayed hidden, the first locked answer and deck restored after reload, and the result was 14/15. Retried and corrected the actual miss with an explanation.
- Completed all 90 distinct questions through the answer controls, saving/reloading at question 46. The result was 90/90 with 90 unique IDs. Verified the human-readable list of all 16 terms.
- Inspected 375 × 812 embedded CSS viewport layouts for question choices, sorting controls and courier touch buttons. Tested phone-layout sorting, steering, jump, dash and pause; no horizontal overflow was observed. Internal preview fixtures are excluded from publication.
- Checked browser logs after the complete playthrough: no runtime errors. Chapter 10 saves use their own namespace and do not alter the Chapters 1–8 practice route.

## Release acceptance

The publication includes only authored runtime files, tests, public guides and referenced voice recordings. It excludes classroom documents, extracted source text, private audit notes, local voice tools and QA fixtures. Deployment acceptance requires the GitHub Pages run for the release commit to succeed, matching public-file hashes and a public browser smoke test. Commit, deployment and hash details are recorded locally after publication.
