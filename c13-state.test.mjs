import test from 'node:test';
import assert from 'node:assert/strict';
import {QUESTIONS, TERMS, SECTIONS} from './c13-data.mjs';
import {STORAGE_KEY, PREVIEW_KEY, GAME_IDS, freshState, cleanState, loadState, saveState,
  shuffle, buildQuiz, startQuiz, currentQuestion, answerQuestion, advanceQuestion, quizReport,
  missed, startCards, revealCard, rateCard, completeGame, progress, nextGoal, markSectionReviewed} from './c13-state.mjs';
const byId = new Map(QUESTIONS.map(q => [q.id, q]));
function finish(s, wrong = 0) {
  let i = 0;
  while (s.active) {
    const {question} = currentQuestion(s);
    answerQuestion(s, i++ < wrong ? (question.answer + 1) % 4 : question.answer);
    advanceQuestion(s);
  }
}
const clone = value => JSON.parse(JSON.stringify(value));

test('Chapter 13 rehearsal always has exactly 3 distinct bold terms and 12 topics across all five sections', () => {
  const decks = new Set(), extras = new Set();
  for (let seed = 0; seed < 100; seed++) {
    const round = buildQuiz(freshState(), {mode: 'exam', seed, section: SECTIONS[0].id, size: 1});
    assert.equal(round.deck.length, 15);
    assert.equal(new Set(round.deck.map(d => d.id)).size, 15);
    const qs = round.deck.map(d => byId.get(d.id)), terms = qs.filter(q => q.kind === 'term');
    assert.equal(terms.length, 3);
    assert.equal(new Set(terms.map(q => q.termId)).size, 3);
    assert.equal(qs.filter(q => q.kind === 'topic').length, 12);
    for (const s of SECTIONS) assert.ok(qs.some(q => q.section === s.id));
    const topicCounts = SECTIONS.map(s => qs.filter(q => q.kind === 'topic' && q.section === s.id).length);
    assert.deepEqual([...topicCounts].sort(), [2, 2, 2, 3, 3]);
    extras.add(topicCounts.join(','));
    decks.add(round.deck.map(d => d.id).join(','));
    assert.deepEqual(round, buildQuiz(freshState(), {mode: 'exam', seed}));
  }
  assert.ok(decks.size > 90);
  assert.ok(extras.size > 5);
});
test('shuffled displayed answers retain canonical correctness and answer once before explicit advancement', () => {
  const s = freshState(); startQuiz(s, {size: 5, seed: 77});
  assert.equal(advanceQuestion(s), false);
  const first = currentQuestion(s);
  assert.deepEqual([...first.order].sort(), [0, 1, 2, 3]);
  assert.equal(first.question.choices[first.order[first.order.indexOf(first.question.answer)]], first.question.choices[first.question.answer]);
  assert.equal(answerQuestion(s, -1), false);
  assert.equal(answerQuestion(s, first.question.answer), true);
  assert.equal(answerQuestion(s, (first.question.answer + 1) % 4), false);
  assert.equal(s.active.index, 0);
  assert.equal(currentQuestion(s).selected, first.question.answer);
  assert.equal(progress(s).questions.correct, 1);
  assert.equal(advanceQuestion(s), true);
  assert.equal(s.active.index, 1);
  assert.equal(shuffle([1, 2, 3, 4], 77).length, 4);
});
test('interrupted quizzes preserve the exact deck, locked answer, mode and credit through storage', () => {
  const storage = new Map(); storage.getItem = storage.get; storage.setItem = storage.set;
  const s = freshState(); startQuiz(s, {mode: 'exam', seed: 2});
  const q = currentQuestion(s).question;
  answerQuestion(s, q.answer);
  assert.equal(saveState(s, storage), true);
  const restored = loadState(storage);
  assert.deepEqual(restored, s);
  assert.equal(answerQuestion(restored, q.answer), false);
  advanceQuestion(restored);
  assert.equal(restored.active.index, 1);
  assert.equal(progress(restored).questions.correct, 1);
});
test('question filters honor section, terms, all-bank and real mistakes while empty filters do not replace a round', () => {
  const s = freshState(), section = SECTIONS[2].id;
  startQuiz(s, {section, size: 'all', seed: 4});
  assert.equal(s.active.deck.length, QUESTIONS.filter(q => q.section === section).length);
  assert.ok(s.active.deck.every(d => byId.get(d.id).section === section));
  startQuiz(s, {mode: 'terms', size: 'all'});
  assert.ok(s.active.deck.every(d => byId.get(d.id).kind === 'term'));
  finish(s, 2);
  assert.equal(missed(s).length, 2);
  startQuiz(s, {mode: 'missed', size: 'all'});
  assert.deepEqual(new Set(s.active.deck.map(d => d.id)), new Set(missed(s)));
  finish(s);
  assert.equal(missed(s).length, 0);
  startQuiz(s, {size: 1}); const active = s.active;
  assert.equal(startQuiz(s, {mode: 'missed'}), false);
  assert.equal(s.active, active);
  assert.equal(buildQuiz(s, {section: 'bad'}), null);
  assert.equal(buildQuiz(s, {mode: 'bad'}), null);
  assert.equal(buildQuiz(s, {size: Infinity}), null);
  assert.equal(buildQuiz(s, {size: -3}), null);
});
test('practice prefers mistakes then unseen questions, and repeated correct answers cannot farm unique progress', () => {
  const s = freshState();
  for (const q of QUESTIONS) s.stats[q.id] = {tried: 1, right: 1, last: true};
  const target = QUESTIONS[0], unseen = QUESTIONS.find(q => q.id !== target.id);
  s.stats[target.id] = {tried: 1, right: 0, last: false}; delete s.stats[unseen.id];
  startQuiz(s, {size: 1, seed: 3}); assert.equal(currentQuestion(s).question.id, target.id); finish(s);
  startQuiz(s, {size: 1, seed: 3}); assert.equal(currentQuestion(s).question.id, unseen.id); finish(s);
  const n = progress(s).questions.correct;
  startQuiz(s, {size: 5, seed: 3}); finish(s);
  assert.equal(progress(s).questions.correct, n);
  assert.equal(progress(s).questions.correct, QUESTIONS.length);
});
test('quiz reports calculate canonical scores and preserve best rehearsal independently of practice', () => {
  const s = freshState(); startQuiz(s, {mode: 'exam', seed: 3}); finish(s, 2);
  assert.equal(s.last.score, 13); assert.equal(s.last.total, 15);
  assert.equal(s.last.termTotal, 3);
  assert.equal(s.last.sections.reduce((sum, section) => sum + section.total, 0), 15);
  assert.equal(s.quizBest.score, 13);
  const best = clone(s.quizBest);
  startQuiz(s, {size: 5}); finish(s); assert.equal(s.last.score, 5);
  assert.deepEqual(s.quizBest, best);
  startQuiz(s, {mode: 'exam', seed: 9}); finish(s, 4); assert.equal(s.quizBest.score, 13);
  startQuiz(s, {mode: 'exam', seed: 10}); finish(s); assert.equal(s.quizBest.score, 15);
  const forged = {...s.last, score: 999, termScore: 999};
  assert.equal(quizReport(forged).score, 15);
  assert.equal(quizReport(forged).termScore, 3);
  assert.equal(cleanState({...s, quizBest: forged}).quizBest.score, 15);
});
test('malformed saves discard invalid decks, foreign IDs, early answers and falsely shaped rehearsals', () => {
  const s = freshState(); startQuiz(s, {mode: 'exam', seed: 2});
  const bad = [];
  let v = clone(s); v.active.deck[0] = null; bad.push(v);
  v = clone(s); v.active.deck[1] = v.active.deck[0]; bad.push(v);
  v = clone(s); v.active.deck[0].order = [0, 0, 2, 3]; bad.push(v);
  v = clone(s); v.active.answers[2] = 0; bad.push(v);
  v = clone(s); v.active.deck.pop(); v.active.answers.pop(); bad.push(v);
  v = clone(s); v.active.index = 50; bad.push(v);
  v = clone(s); v.active.deck[0].id = 'c10-politics-01'; bad.push(v);
  for (const candidate of bad) assert.equal(cleanState(candidate).active, null);
  const q = QUESTIONS[0];
  assert.equal(cleanState({...freshState(), last: {mode: 'practice', rows: [{id: q.id, option: q.answer}, {id: q.id, option: q.answer}]}}).last, null);
  assert.equal(cleanState({...freshState(), quizBest: {mode: 'exam', rows: [{id: q.id, option: q.answer}]}}).quizBest, null);
  assert.deepEqual(cleanState({version: 19}), freshState());
  const stats = cleanState({version: 1, stats: {[q.id]: {tried: Infinity, right: Infinity, last: true}, foreign: {tried: 5, right: 5, last: true}}}).stats;
  assert.deepEqual(stats, {});
});
test('flashcards require recall before credit and restore an interrupted reveal accurately', () => {
  const s = freshState(); assert.equal(startCards(s, {size: 5, seed: 1}), true);
  assert.equal(rateCard(s, true), false);
  assert.equal(revealCard(s), true); assert.equal(revealCard(s), false);
  assert.equal(progress(s).cards.recalled, 0);
  assert.deepEqual(cleanState(clone(s)), s);
  const first = s.cards.active.deck[0];
  assert.equal(rateCard(s, false), true); assert.deepEqual(s.cards.again, [first]);
  assert.equal(rateCard(s, true), false);
  startCards(s, {review: true, size: 'all'});
  assert.deepEqual(s.cards.active.deck, [first]);
  revealCard(s); rateCard(s, true);
  assert.equal(s.cards.active, null); assert.deepEqual(s.cards.recalled, [first]); assert.deepEqual(s.cards.again, []);
  assert.deepEqual(s.cards.last, {total: 1, recalled: 1});
});
test('card selection reaches every bold term without repeating remembered terms ahead of unseen terms', () => {
  const s = freshState();
  const seen = new Set();
  for (let batch = 0; batch < Math.ceil(TERMS.length / 5); batch++) {
    startCards(s, {size: 5, seed: batch});
    while (s.cards.active) {
      const id = s.cards.active.deck[s.cards.active.index];
      if (seen.size < TERMS.length) assert.equal(seen.has(id), false);
      seen.add(id); revealCard(s); rateCard(s, true);
    }
  }
  assert.equal(seen.size, TERMS.length); assert.equal(progress(s).cards.recalled, TERMS.length);
  assert.equal(progress(s).questions.correct, 0);
  assert.equal(startCards(s, {review: true}), false);
  startCards(s, {section: SECTIONS[0].id, size: 'all'});
  assert.ok(s.cards.active.deck.every(id => TERMS.find(t => t.id === id).section === SECTIONS[0].id));
});
test('invalid card saves cannot create terms, ratings, duplicate recall or incompatible active cards', () => {
  const id = TERMS[0].id, s = freshState();
  const c = cleanState({...s, cards: {recalled: [id, id, 'foreign'], again: [id, 'foreign'], active: {deck: [id], index: 0, ratings: [true], revealed: true}}});
  assert.deepEqual(c.cards.recalled, [id]); assert.deepEqual(c.cards.again, []); assert.equal(c.cards.active, null);
  assert.equal(progress(c).cards.recalled, 1);
});
test('game completion uses only known games and finite scores, retains best, and never grants question or card credit', () => {
  const s = freshState();
  assert.equal(completeGame(s, 'foreign', 100), false);
  assert.equal(completeGame(s, GAME_IDS[0], Infinity), false);
  assert.equal(completeGame(s, GAME_IDS[0], -1), false);
  assert.equal(completeGame(s, GAME_IDS[0], 500), true);
  completeGame(s, GAME_IDS[0], 50); assert.equal(s.games[GAME_IDS[0]].score, 500);
  assert.deepEqual(cleanState(clone(s)), s);
  assert.equal(progress(s).games.completed, 1); assert.equal(progress(s).questions.correct, 0); assert.equal(progress(s).cards.recalled, 0);
  const malformed = cleanState({...s, games: {[GAME_IDS[0]]: {completed: true, score: Infinity}, fake: {completed: true, score: 1}}});
  assert.equal(progress(malformed).games.completed, 0);
});
test('completion is transparent, bounded and reaches 100 only after every question, card and game', () => {
  const s = freshState(); assert.equal(progress(s).percent, 0);
  for (const q of QUESTIONS) s.stats[q.id] = {tried: 1, right: 1, last: true};
  assert.equal(progress(s).percent, 60);
  s.cards.recalled = TERMS.map(t => t.id); assert.equal(progress(s).percent, 85);
  for (const id of GAME_IDS) completeGame(s, id, 1);
  assert.equal(progress(s).percent, 100); assert.equal(progress(s).complete, true);
  delete s.stats[QUESTIONS[0].id]; assert.ok(progress(s).percent < 100); assert.equal(progress(s).complete, false);
  assert.equal(progress(s).sections.reduce((sum, section) => sum + section.total, 0), QUESTIONS.length);
});
test('next goal starts with learning, preserves chosen sessions and rehearses after broad practice', () => {
  const s = freshState(); assert.equal(nextGoal(s).action, 'guide'); assert.equal(nextGoal(s).section, '13.1');
  startCards(s, {size: 1}); assert.equal(nextGoal(s).action, 'resume-cards');
  startQuiz(s, {size: 1}); assert.equal(nextGoal(s).action, 'resume-quiz'); finish(s, 1);
  assert.equal(nextGoal(s).action, 'resume-cards');
  s.cards.active = null; s.cards.recalled = TERMS.map(t => t.id);
  for (const section of SECTIONS) {
    markSectionReviewed(s, section.id);
    for (const q of QUESTIONS.filter(q => q.kind === 'topic' && q.section === section.id).slice(0, 3))
      s.stats[q.id] = {tried: 1, right: 1, last: true};
  }
  for (const id of GAME_IDS) completeGame(s, id);
  if (missed(s).length) { assert.equal(nextGoal(s).mode, 'missed'); startQuiz(s, {mode: 'missed'}); finish(s); }
  assert.equal(nextGoal(s).mode, 'exam'); assert.ok(progress(s).percent < 100);
  for (const q of QUESTIONS) s.stats[q.id] = {tried: 1, right: 1, last: true};
  assert.equal(nextGoal(s).mode, 'exam');
});
test('storage failures stay usable and preview/reset operations cannot change another section or normal record', () => {
  const values = new Map([['dc-test911-v1', 'previous review'], ['dc-c10-review-v1', 'previous quiz']]);
  const storage = {getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value)};
  const s = freshState(); completeGame(s, GAME_IDS[0], 20);
  saveState(s, storage, STORAGE_KEY); saveState(freshState(), storage, PREVIEW_KEY);
  assert.equal(loadState(storage, STORAGE_KEY).games[GAME_IDS[0]].score, 20);
  assert.equal(progress(loadState(storage, PREVIEW_KEY)).percent, 0);
  assert.equal(values.get('dc-test911-v1'), 'previous review'); assert.equal(values.get('dc-c10-review-v1'), 'previous quiz');
  saveState(freshState(), storage, PREVIEW_KEY);
  assert.equal(loadState(storage, STORAGE_KEY).games[GAME_IDS[0]].score, 20);
  const failing = {getItem() { throw Error('blocked'); }, setItem() { throw Error('full'); }};
  assert.deepEqual(loadState(failing), freshState()); assert.equal(saveState(s, failing), false);
  storage.setItem(STORAGE_KEY, '{'); assert.deepEqual(loadState(storage), freshState());
  storage.setItem(STORAGE_KEY, JSON.stringify({version: 1, stats: {'c10-politics-01': {tried: 3, right: 3, last: true}}}));
  assert.deepEqual(loadState(storage), freshState());
});
