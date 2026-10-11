# Midterm 5.1.0 validation

## Automated checks

264 tests passed across the existing Chapters 4–6 campaigns and the new study/game modules; all package syntax checks passed. The new checks cover unique source-backed questions, 16 Chapter 7 and 10 Chapter 8 textbook terms, 60 seeded rehearsal selections, correct 10/15/15 group totals and 3 term slots per later chapter, save validation, interrupted rounds, independent card/question credit, repeat-credit prevention and complete-route requirements.

Game checks additionally cover the sub-minute courier course, required dispatches, obstacle collisions, jumps, dash cooldowns, bounded lanes, fort sprint stamina, directional dodge recovery, proximity-required powder-fire work, actual missed-shot coordinates and exact click-destination convergence at low frame rates. Existing game checks cover a viable convention route, failed coalitions, separate ratification, all packaged dialogue files, pause/resume and skipped-line cancellation, normalized non-inverted movement, proximity-required supply actions, cannon aim/range/cooldown, final-watch and flag completion, cover/assist damage and checkpoint recovery.

The bank contains 161 concepts: 6, 6, 8, 11, 17, 6, 54 and 53 in Chapters 1–8 respectively. The focus route has 115. Supplemental early material is explicitly labeled; source limitations appear in the product.

## Browser play and study verification

Testing used hidden browser tabs with `?muted=1&preview=1`, keeping production progress untouched. Both speech and music elements were observed muted and paused. Audible audition and a physical phone/gamepad playthrough are not claimed.

- Completed a five-question round and five recalled cards; verified reload persistence and independent credit.
- Saved a card round partway through and resumed at its original card. Saved incorrect-question feedback, reloaded and recovered it.
- Verified Chapter 7's term-only pool of 16, incorrect feedback, a completed term round and retry of only the actual miss.
- Completed matching and chronological challenges, including rejection/recovery of a wrong pair/order.
- Completed a 40-question rehearsal through visible answer controls, including saving/reloading at question 15. Feedback stayed hidden until the finished 40/40 result; question and answer order varied.
- Exported a JSON backup through the interface and restored it through the file chooser, with a visible success message and restored milestones.
- Verified library search and expandable explanations. Opening library entries alone earns no credit.
- Played the rebuilt Chapter 7 courier through all three actual pickups with lane, jump and dash controls, then five debate proposals, the slavery record, all ratification milestones and the ending. Prior undo/failure tests remain in place.
- Played the rebuilt Chapter 8 through all four supply deliveries using actual projected ground clicks, four aimed barge hits, both powder-cover fires, the dawn transition and held-E flag completion. Verified normal upward movement, pause and assist. The phone viewport exercised failure, checkpoint retry and pause; pure checks retain supply-preserving recovery.
- Observed both finished games credited as 2/2 in the hub's shared record.
- Inspected desktop and 375 × 812 embedded CSS viewport layouts, including readable cinematic captions, visible fort touch controls, courier touch steering/jump/dash and pause/retry. Neither game had horizontal overflow in the embedded phone viewport. The preview frame is a private test fixture and is not part of publication.

## Serving and publication

The release is static HTML/CSS/JavaScript and packaged media, with no build or live API. Existing campaign entry files are retained. The repository's GitHub Pages publishing mechanism deploys the main branch. Release uploads include only authored product files, tests, guides and the new packaged recordings; original classroom documents, lecture photos, local tools, source extraction and preview saves are excluded.

Deployment acceptance requires a successful Pages run for the runtime commit and a public-site check of the hub, question flow and both new game entries. Detailed commit/deployment identifiers are kept in the local release record after publication.

