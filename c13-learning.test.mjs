import test from 'node:test';
import assert from 'node:assert/strict';
import {QUESTIONS, TERMS, SECTIONS} from './c13-data.mjs';
import {freshState, cleanState, markSectionReviewed, nextGoal, progress, startCards,
  revealCard, rateCard, completeGame, startQuiz, buildQuiz, currentQuestion,
  answerQuestion, advanceQuestion, quizReport, saveState, loadState, missed} from './c13-state.mjs';

const byId = new Map(QUESTIONS.map(q => [q.id, q]));
const sectionGame = {'13.2': 'c13-assembly', '13.4': 'c13-press', '13.5': 'c13-convention'};
const clone = value => JSON.parse(JSON.stringify(value));
const topics = section => QUESTIONS.filter(q => q.section === section && q.kind === 'topic');
function finishQuiz(state, correct = true) {
  while (state.active) {
    const q = currentQuestion(state).question;
    answerQuestion(state, correct ? q.answer : (q.answer + 1) % 4);
    advanceQuestion(state);
  }
}
function finishCards(state, recalled = true) {
  while (state.cards.active) { revealCard(state); rateCard(state, recalled); }
}
function preparedState() {
  const state = freshState();
  for (const section of SECTIONS) {
    markSectionReviewed(state, section.id);
    for (const q of topics(section.id).slice(0, 3)) state.stats[q.id] = {tried: 1, right: 1, last: true};
  }
  state.cards.recalled = TERMS.map(t => t.id);
  for (const id of Object.values(sectionGame)) completeGame(state, id, 200);
  return state;
}

test('review checkpoints record only known sections and do not award recall or question credit', () => {
  const state = freshState(), before = progress(state);
  assert.deepEqual(state.learning, {reviewed: []});
  assert.equal(nextGoal(state).action, 'guide');
  assert.equal(nextGoal(state).section, '13.1');
  assert.equal(markSectionReviewed(state, '13.1'), true);
  assert.equal(markSectionReviewed(state, '13.1'), false);
  for (const id of ['13.9', 'chapter10', null, undefined, {}]) assert.equal(markSectionReviewed(state, id), false);
  assert.deepEqual(state.learning.reviewed, ['13.1']);
  assert.deepEqual(progress(state), before);
  assert.deepEqual(cleanState(clone(state)), state);
  const cleaned = cleanState({...freshState(), learning: {reviewed: ['13.3', '13.1', '13.3', 'bad', null]}});
  assert.deepEqual(cleaned.learning, {reviewed: ['13.3', '13.1']});
  for (const learning of [null, [], {reviewed: '13.1'}, {reviewed: null}])
    assert.deepEqual(cleanState({...freshState(), learning}).learning, {reviewed: []});
});

test('a new learner completes guide, term introduction, relevant game and short checks before rehearsal', () => {
  const state = freshState();
  for (const [index, section] of SECTIONS.entries()) {
    let goal = nextGoal(state);
    assert.equal(goal.action, 'guide'); assert.equal(goal.section, section.id);
    assert.equal(markSectionReviewed(state, section.id), true);
    goal = nextGoal(state);
    assert.equal(goal.action, 'cards'); assert.equal(goal.section, section.id);
    assert.equal(goal.size, 5); assert.equal(goal.unseen, true);
    assert.equal(startCards(state, {...goal, seed: index + 17}), true);
    assert.ok(state.cards.active.deck.every(id => TERMS.find(t => t.id === id).section === section.id));
    finishCards(state);
    if (sectionGame[section.id]) {
      goal = nextGoal(state); assert.equal(goal.action, 'game'); assert.equal(goal.id, sectionGame[section.id]);
      completeGame(state, goal.id, 200);
    }
    goal = nextGoal(state);
    assert.equal(goal.action, 'quiz'); assert.equal(goal.mode, 'topics');
    assert.equal(goal.section, section.id); assert.equal(goal.size, 3);
    assert.equal(startQuiz(state, {...goal, seed: index + 31}), true);
    assert.equal(state.active.deck.length, 3);
    assert.ok(state.active.deck.every(d => byId.get(d.id).kind === 'topic' && byId.get(d.id).section === section.id));
    finishQuiz(state);
  }
  assert.equal(nextGoal(state).mode, 'exam');
  assert.equal(state.quizBest, null);
  assert.equal(progress(state).questions.correct, 15);
  assert.equal(progress(state).cards.recalled, TERMS.length);
  assert.equal(progress(state).games.completed, 3);
  assert.ok(progress(state).percent < 100, 'first rehearsal must not require finishing the entire bank');
  assert.deepEqual(cleanState(clone(state)), state);
});

test('repeating one question and answering term questions cannot replace distinct topic coverage', () => {
  const state = preparedState(); state.stats = {};
  const one = topics('13.1')[0];
  state.stats[one.id] = {tried: 100, right: 100, last: true};
  for (const q of QUESTIONS.filter(q => q.kind === 'term')) state.stats[q.id] = {tried: 1, right: 1, last: true};
  let goal = nextGoal(state);
  assert.equal(goal.mode, 'topics'); assert.equal(goal.section, '13.1');
  for (const q of topics('13.1').slice(0, 3)) state.stats[q.id] = {tried: 1, right: 1, last: true};
  goal = nextGoal(state); assert.equal(goal.mode, 'topics'); assert.equal(goal.section, '13.2');
});

test('topic-only practice stays topic-only in selection, saved decks and finished reports', () => {
  const state = freshState();
  const all = buildQuiz(state, {mode: 'topics', section: 'all', size: 'all', seed: 7});
  assert.equal(all.deck.length, QUESTIONS.filter(q => q.kind === 'topic').length);
  assert.ok(all.deck.every(d => byId.get(d.id).kind === 'topic'));
  assert.equal(startQuiz(state, {mode: 'topics', section: '13.4', size: 3, seed: 19}), true);
  const q = currentQuestion(state).question; answerQuestion(state, q.answer);
  const values = new Map(), storage = {getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value)};
  assert.equal(saveState(state, storage), true); assert.deepEqual(loadState(storage), state);
  const badActive = clone(state), term = QUESTIONS.find(q => q.kind === 'term' && q.section === '13.4');
  badActive.active.deck[0].id = term.id;
  assert.equal(cleanState(badActive).active, null);
  finishQuiz(state);
  assert.equal(state.last.mode, 'topics'); assert.equal(state.last.score, 3); assert.equal(state.quizBest, null);
  assert.deepEqual(quizReport(state.last), state.last);
  const badReport = clone(state.last); badReport.rows[0].id = term.id;
  assert.equal(quizReport(badReport), null);
  assert.equal(cleanState({...state, last: badReport}).last, null);
});

test('unseen cards exclude every rated term without losing an active deck when the pool is empty', () => {
  const state = freshState(), terms = TERMS.filter(t => t.section === '13.1');
  state.cards.recalled = [terms[0].id]; state.cards.again = [terms[1].id];
  assert.equal(startCards(state, {section: '13.1', unseen: true, size: 5, seed: 11}), true);
  assert.deepEqual(new Set(state.cards.active.deck), new Set(terms.slice(2).map(t => t.id)));
  finishCards(state, false);
  assert.equal(startCards(state, {section: '13.3', size: 1, seed: 2}), true);
  revealCard(state); const active = clone(state.cards.active);
  assert.equal(startCards(state, {section: '13.1', unseen: true, size: 5, seed: 3}), false);
  assert.deepEqual(state.cards.active, active);
});

test('saved sessions resume before recommendations without starting or replacing any work', () => {
  const state = freshState(); startCards(state, {size: 1, seed: 21});
  let before = clone(state); assert.equal(nextGoal(state).action, 'resume-cards'); assert.deepEqual(state, before);
  startQuiz(state, {mode: 'exam', seed: 6});
  const q = currentQuestion(state).question; answerQuestion(state, q.answer);
  before = clone(state); assert.equal(nextGoal(state).action, 'resume-quiz'); assert.deepEqual(state, before);
  assert.deepEqual(cleanState(before), state);
  finishQuiz(state); assert.equal(nextGoal(state).action, 'resume-cards');
});

test('an untouched saved rehearsal waits behind learning while its deck remains available to resume', () => {
  const state = freshState(); startQuiz(state, {mode: 'exam', seed: 84});
  const untouched = clone(state), deck = clone(state.active.deck);
  let goal = nextGoal(state);
  assert.equal(goal.action, 'guide'); assert.equal(goal.section, '13.1');
  assert.deepEqual(state, untouched, 'recommending learning must not discard the saved rehearsal');
  const q = currentQuestion(state).question; answerQuestion(state, q.answer);
  const answered = clone(state);
  assert.equal(nextGoal(state).action, 'resume-quiz');
  assert.deepEqual(state, answered); assert.deepEqual(state.active.deck, deck);
  const prepared = preparedState(); startQuiz(prepared, {mode: 'exam', seed: 84});
  const ready = clone(prepared);
  assert.equal(nextGoal(prepared).action, 'resume-quiz');
  assert.deepEqual(prepared, ready); assert.deepEqual(prepared.active.deck, deck);
});

test('older records retain earned work and can infer an introduced section without a new checkpoint', () => {
  const original = freshState(), priorTopic = topics('13.1')[0];
  original.stats[priorTopic.id] = {tried: 1, right: 1, last: true};
  startQuiz(original, {mode: 'practice', section: '13.1', size: 1, seed: 9}); finishQuiz(original);
  original.cards.recalled = [TERMS[0].id]; completeGame(original, 'c13-press', 800);
  const {learning: ignored, ...legacy} = clone(original), restored = cleanState(legacy);
  assert.deepEqual(restored, {...legacy, learning: {reviewed: []}});
  assert.deepEqual(progress(restored), progress(original));
  assert.equal(nextGoal(restored).action, 'cards'); assert.equal(nextGoal(restored).section, '13.1');
  const rated = freshState(); rated.cards.again = [TERMS[0].id];
  assert.equal(nextGoal(rated).action, 'cards'); assert.equal(nextGoal(rated).section, '13.1');
  const played = preparedState(); played.learning.reviewed = []; played.stats = {};
  for (const q of topics('13.1').slice(0, 3)) played.stats[q.id] = {tried: 1, right: 1, last: true};
  played.cards.recalled = TERMS.filter(t => t.section === '13.1').map(t => t.id);
  assert.equal(nextGoal(played).action, 'cards'); assert.equal(nextGoal(played).section, '13.2');
});

test('misses and cards needing another look are revisited before the first rehearsal', () => {
  const state = preparedState(), q = topics('13.3')[0], term = TERMS[0];
  state.stats[q.id] = {tried: 1, right: 0, last: false};
  state.cards.recalled = state.cards.recalled.filter(id => id !== term.id); state.cards.again = [term.id];
  let goal = nextGoal(state); assert.equal(goal.mode, 'missed');
  startQuiz(state, {...goal, seed: 1}); finishQuiz(state);
  assert.deepEqual(missed(state), []);
  goal = nextGoal(state); assert.equal(goal.action, 'cards'); assert.equal(goal.review, true);
  startCards(state, {...goal, seed: 2}); assert.deepEqual(state.cards.active.deck, [term.id]); finishCards(state);
  assert.equal(nextGoal(state).mode, 'exam');
});

test('a completed rehearsal leads to focused practice and then another rehearsal without a bank-completion gate', () => {
  const state = preparedState(); assert.equal(nextGoal(state).mode, 'exam');
  startQuiz(state, {mode: 'exam', seed: 41}); finishQuiz(state);
  let goal = nextGoal(state);
  assert.equal(goal.action, 'quiz'); assert.equal(goal.mode, 'practice'); assert.equal(goal.size, 5);
  assert.ok(SECTIONS.some(s => s.id === goal.section));
  assert.ok(progress(state).percent < 100);
  startQuiz(state, {...goal, seed: 5}); finishQuiz(state);
  goal = nextGoal(state); assert.equal(goal.mode, 'exam');
  for (const q of QUESTIONS) state.stats[q.id] = {tried: 1, right: 1, last: true};
  assert.equal(progress(state).complete, true); assert.equal(nextGoal(state).mode, 'exam');
});
