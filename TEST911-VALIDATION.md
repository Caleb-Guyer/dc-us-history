# Chapters 9–11 test review — release 7.0.0

## Inputs and coverage

The three supplied Word files were read as source material, including their bold formatting. Private extraction produced 71 Chapter 9 paragraphs, 67 Chapter 10 paragraphs and 68 Chapter 11 paragraphs; the documents contain no embedded images. Full source files and extracted text are excluded from publication.

The bank contains 210 original practice questions spanning all 14 sections: 60 from Chapter 9, 90 from Chapter 10 and 60 from Chapter 11. The reuploaded Chapter 10 file has the same SHA-256 hash as the previously verified text, so its existing material is reused. Bold-term review contains 45 terms: 12, 16 and 17 respectively, excluding headings. Each term has a meaning, example, common confusion, source reference and canonical recall question.

The teacher supplied 40 multiple-choice questions and a 20-point base. Rehearsals use a rotating 14/13/13 chapter balance for broad practice; no teacher chapter or term quota is inferred. Practice scores are reported out of the questions answered. Historical qualifications and primary references appear in TEST911-SOURCES.md.

## Automated checks

All 337 repository tests and configured JavaScript syntax checks pass, including the earlier games and review hubs. New checks cover unique questions, all sections, complete term mappings, answer-position balance, source qualifications, forty-question composition across 120 seeds, exact scope/review filters, canonical scoring, malformed saves, locked answers and shuffled options, persistent exam best, short card sets, reveal-before-rating, weak-material priority and isolation from earlier records.

## Muted browser checks

Tests used hidden browser tabs and separate preview records. The new review pages have no audio.

- Completed a 40-question rehearsal through actual answer controls with two deliberate misses. The result was 38/40 (95%). The deck had 40 distinct IDs, chapter counts of 13/14/13 and all 14 sections.
- Reloaded after the first locked answer and again at question 20. Question, option order, answer lock and exam mode restored; explanations stayed hidden until the result.
- Reviewed the two actual misses in a separate practice round and corrected both. The 38/40 rehearsal best survived that practice and a later five-question round.
- Verified the full 45-term glossary, search, the 17-term Chapter 11 filter and the two Missouri-crisis terms in section 11.2.
- Completed a default five-card round, restored a revealed card after reload, marked one card for another look, and reviewed that actual card. A complete optional card round rendered all 45 distinct cards with nonempty meanings, examples and distinctions, then saved all ratings.
- In a 375 × 812 embedded CSS viewport, checked term search, expansion, chapter/section selectors, an actual touch answer and immediate feedback. Chapter 9 section 9.3 practice stayed within its selected scope. Document width equaled scroll width at 360 CSS pixels after the scrollbar; no horizontal overflow. Physical-device testing is not claimed.
- Continued the phone's answered round on desktop and finished it. Native Enter on Save & exit exited rather than revealing or advancing an item.
- Verified the three separate home-page entries. The earlier Chapter 10 preview record remained at 16/16 cards, 90/90 questions and 15/15 best; the midterm remained at 9%. New test work did not overwrite either record.
- Browser logs showed no runtime errors or warnings during the completed walkthrough.

## Publication acceptance

Publish only application files, tests and public guides. Exclude source documents, private extractions, audit notes, answer fixtures and phone QA pages. Acceptance requires the GitHub Pages run for this release commit to succeed, public hashes to match the tested release and a live review-hub smoke test. Commit, run and file verification evidence is saved locally after deployment.
