import {QUESTIONS, TERMS, SECTIONS} from './c13-data.mjs?v=8.4.0';

export const STORAGE_KEY = 'dc-c13-v1';
export const PREVIEW_KEY = 'dc-c13-preview-v1';
export const GAME_IDS = ['c13-press', 'c13-assembly', 'c13-convention'];
const byId = new Map(QUESTIONS.map(q => [q.id, q]));
const termById = new Map(TERMS.map(t => [t.id, t]));
const sections = new Set(SECTIONS.map(s => s.id));
const modes = new Set(['exam', 'practice', 'terms', 'missed']);
const option = n => Number.isInteger(n) && n >= 0 && n < 4;
const seedOf = n => Number.isFinite(Number(n)) ? Math.floor(Number(n)) >>> 0 : 1;
const finiteInt = (n, max = 1000000) => Number.isFinite(n) ? Math.min(max, Math.max(0, Math.floor(n))) : 0;
const unique = (list, valid) => Array.isArray(list) ? [...new Set(list.filter(id => valid.has(id)))] : [];

function random(seed) {
  let x = seedOf(seed);
  return () => {
    x = (x + 0x6d2b79f5) >>> 0;
    let t = Math.imul(x ^ (x >>> 15), x | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function shuffle(items, seed = 1) {
  const result = [...items], rng = random(seed);
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
const sizeOf = (size, available, fallback = 5) => size === 'all' ? available : Math.min(available, finiteInt(Number(size ?? fallback)));
const rank = (state, q) => state.stats[q.id]?.last === false ? 0 : !state.stats[q.id]?.tried ? 1 : 2;

// Choose one item per section per pass. The shuffled starting section rotates
// which sections receive the two extra topic questions in a 12-topic quiz.
function balanced(pool, count, seed, priority = () => 0) {
  const keys = shuffle([...new Set(pool.map(q => q.section))], seed);
  const buckets = keys.map((key, i) => shuffle(pool.filter(q => q.section === key), seed + i * 7919)
    .sort((a, b) => priority(a) - priority(b)));
  const result = [];
  let cursor = 0;
  while (result.length < count && buckets.some(b => b.length)) {
    const best = Math.min(...buckets.filter(b => b.length).map(b => priority(b[0])));
    for (let offset = 0; offset < buckets.length; offset++) {
      const index = (cursor + offset) % buckets.length, bucket = buckets[index];
      if (bucket.length && priority(bucket[0]) === best) {
        result.push(bucket.shift());
        cursor = (index + 1) % buckets.length;
        break;
      }
    }
  }
  return result;
}

export function freshState() {
  return {version: 1, stats: {}, active: null, last: null, quizBest: null,
    cards: {recalled: [], again: [], active: null, last: null}, games: {}};
}

function validExam(rows) {
  if (!Array.isArray(rows) || rows.length !== 15 || new Set(rows.map(r => r?.id)).size !== 15) return false;
  if (!rows.every(r => byId.has(r?.id))) return false;
  const questions = rows.map(r => byId.get(r.id)), terms = questions.filter(q => q.kind === 'term');
  return terms.length === 3 && new Set(terms.map(q => q.termId)).size === 3 &&
    questions.filter(q => q.kind === 'topic').length === 12 &&
    SECTIONS.every(s => questions.some(q => q.section === s.id));
}
function validRows(rows, mode, section = 'all') {
  return modes.has(mode) && (section === 'all' || sections.has(section)) && Array.isArray(rows) && rows.length > 0 &&
    rows.length <= QUESTIONS.length && new Set(rows.map(r => r?.id)).size === rows.length &&
    rows.every(r => byId.has(r?.id) && option(r.option) && (mode === 'exam' || section === 'all' || byId.get(r.id).section === section) &&
      (mode !== 'terms' || byId.get(r.id).kind === 'term')) && (mode !== 'exam' || validExam(rows));
}
export function quizReport(record) {
  if (!record || !validRows(record.rows, record.mode, record.section ?? 'all')) return null;
  const rows = record.rows.map(r => ({id: r.id, option: r.option}));
  const correct = r => r.option === byId.get(r.id).answer;
  const terms = rows.filter(r => byId.get(r.id).kind === 'term');
  return {mode: record.mode, section: record.section ?? 'all', rows,
    score: rows.filter(correct).length, total: rows.length,
    termScore: terms.filter(correct).length, termTotal: terms.length,
    sections: SECTIONS.map(s => {
      const group = rows.filter(r => byId.get(r.id).section === s.id);
      return {id: s.id, total: group.length, score: group.filter(correct).length};
    }), missed: rows.filter(r => !correct(r)).map(r => r.id)};
}
function cleanActive(raw) {
  if (!raw || !modes.has(raw.mode)) return null;
  const section = raw.section ?? 'all', deck = raw.deck;
  if (!(section === 'all' || sections.has(section)) || !Array.isArray(deck) || !deck.length || deck.length > QUESTIONS.length ||
      new Set(deck.map(d => d?.id)).size !== deck.length || !deck.every(d => byId.has(d?.id) &&
        Array.isArray(d.order) && d.order.length === 4 && new Set(d.order).size === 4 && d.order.every(option) &&
        (raw.mode === 'exam' || section === 'all' || byId.get(d.id).section === section) &&
        (raw.mode !== 'terms' || byId.get(d.id).kind === 'term')) ||
      (raw.mode === 'exam' && !validExam(deck)) || !Number.isInteger(raw.index) || raw.index < 0 || raw.index >= deck.length ||
      !Array.isArray(raw.answers) || raw.answers.length !== deck.length ||
      !raw.answers.every((a, i) => i < raw.index ? option(a) : i === raw.index ? a === null || option(a) : a === null)) return null;
  return {mode: raw.mode, section, deck: deck.map(d => ({id: d.id, order: [...d.order]})), index: raw.index, answers: [...raw.answers]};
}
function cleanCards(raw) {
  const cards = {recalled: unique(raw?.recalled, termById), again: unique(raw?.again, termById), active: null, last: null};
  cards.again = cards.again.filter(id => !cards.recalled.includes(id));
  const a = raw?.active;
  if (a && Array.isArray(a.deck) && a.deck.length > 0 && a.deck.length <= TERMS.length && new Set(a.deck).size === a.deck.length &&
      a.deck.every(id => termById.has(id)) && Number.isInteger(a.index) && a.index >= 0 && a.index < a.deck.length &&
      Array.isArray(a.ratings) && a.ratings.length === a.index && a.ratings.every(r => typeof r === 'boolean'))
    cards.active = {deck: [...a.deck], index: a.index, revealed: a.revealed === true, ratings: [...a.ratings]};
  const last = raw?.last;
  if (last && Number.isInteger(last.total) && last.total > 0 && last.total <= TERMS.length && Number.isInteger(last.recalled) && last.recalled >= 0 && last.recalled <= last.total)
    cards.last = {total: last.total, recalled: last.recalled};
  return cards;
}
export function cleanState(raw) {
  const state = freshState();
  if (raw?.version !== 1) return state;
  if (raw.stats && typeof raw.stats === 'object' && !Array.isArray(raw.stats)) {
    for (const q of QUESTIONS) {
      const value = raw.stats[q.id];
      if (!value || typeof value !== 'object') continue;
      const tried = finiteInt(value.tried), right = Math.min(tried, finiteInt(value.right));
      if (tried > 0) state.stats[q.id] = {tried, right, last: value.last === true && right > 0};
    }
  }
  state.active = cleanActive(raw.active);
  state.last = quizReport(raw.last);
  if (raw.quizBest?.mode === 'exam') state.quizBest = quizReport(raw.quizBest);
  state.cards = cleanCards(raw.cards);
  for (const id of GAME_IDS) {
    const game = raw.games?.[id];
    if (game?.completed === true && Number.isFinite(game.score) && game.score >= 0)
      state.games[id] = {completed: true, score: finiteInt(game.score, 1000000000)};
  }
  return state;
}
export function loadState(storage, key = STORAGE_KEY) {
  try { return cleanState(JSON.parse((storage ?? globalThis.localStorage).getItem(key))); } catch { return freshState(); }
}
export function saveState(state, storage, key = STORAGE_KEY) {
  try { (storage ?? globalThis.localStorage).setItem(key, JSON.stringify(cleanState(state))); return true; } catch { return false; }
}
export function missed(state) { return QUESTIONS.filter(q => state?.stats?.[q.id]?.last === false).map(q => q.id); }

export function buildQuiz(state, {mode = 'practice', section = 'all', size = 5, seed = Date.now()} = {}) {
  if (!modes.has(mode) || !(section === 'all' || sections.has(section))) return null;
  seed = seedOf(seed);
  let selected;
  if (mode === 'exam') {
    const groups = shuffle(TERMS, seed + 173);
    const termQuestions = groups.map((t, i) => shuffle(QUESTIONS.filter(q => q.kind === 'term' && q.termId === t.id), seed + i * 47)[0]).filter(Boolean).slice(0, 3);
    const topics = balanced(QUESTIONS.filter(q => q.kind === 'topic'), 12, seed + 521);
    selected = [...termQuestions, ...topics];
    if (!validExam(selected)) return null;
    section = 'all';
  } else {
    const misses = new Set(missed(state));
    const pool = QUESTIONS.filter(q => (section === 'all' || q.section === section) &&
      (mode !== 'terms' || q.kind === 'term') && (mode !== 'missed' || misses.has(q.id)));
    const count = sizeOf(size, pool.length);
    if (!count) return null;
    // A missed-only round is selected from the actual last-answer mistakes.
    // Other short rounds prefer weak/unseen questions within each section.
    selected = balanced(pool, count, seed, q => rank(state, q));
  }
  if (!selected.length) return null;
  return {mode, section, deck: shuffle(selected, seed + 1009).map((q, i) => ({id: q.id, order: shuffle([0, 1, 2, 3], seed + i * 1297)})),
    index: 0, answers: selected.map(() => null)};
}
export function startQuiz(state, options = {}) {
  const round = buildQuiz(state, options);
  if (!round) return false;
  state.active = round;
  return true;
}
export function currentQuestion(state) {
  const round = state.active;
  if (!round) return null;
  const row = round.deck[round.index];
  return {question: byId.get(row.id), order: row.order, selected: round.answers[round.index], index: round.index, total: round.deck.length};
}
// Choices and answers are canonical indexes; UI display order is separate.
export function answerQuestion(state, choice) {
  const round = state.active;
  if (!round || !option(choice) || round.answers[round.index] !== null) return false;
  const question = byId.get(round.deck[round.index].id);
  if (!question) return false;
  round.answers[round.index] = choice;
  const old = state.stats[question.id] || {tried: 0, right: 0, last: false};
  const right = choice === question.answer;
  state.stats[question.id] = {tried: finiteInt(old.tried + 1), right: finiteInt(old.right + Number(right)), last: right};
  return true;
}
export function advanceQuestion(state) {
  const round = state.active;
  if (!round || round.answers[round.index] === null) return false;
  if (round.index < round.deck.length - 1) { round.index++; return true; }
  state.last = quizReport({mode: round.mode, section: round.section, rows: round.deck.map((d, i) => ({id: d.id, option: round.answers[i]}))});
  if (round.mode === 'exam' && (!state.quizBest || state.last.score > state.quizBest.score)) state.quizBest = quizReport(state.last);
  state.active = null;
  return true;
}
export function startCards(state, {section = 'all', size = 5, review = false, seed = Date.now()} = {}) {
  if (!(section === 'all' || sections.has(section))) return false;
  const cards = state.cards;
  const pool = TERMS.filter(t => (section === 'all' || t.section === section) && (!review || cards.again.includes(t.id)));
  const count = sizeOf(size, pool.length);
  if (!count) return false;
  const priority = t => cards.again.includes(t.id) ? 0 : cards.recalled.includes(t.id) ? 2 : 1;
  cards.active = {deck: balanced(pool, count, seedOf(seed), priority).map(t => t.id), index: 0, revealed: false, ratings: []};
  return true;
}
export function revealCard(state) {
  if (!state.cards.active || state.cards.active.revealed) return false;
  state.cards.active.revealed = true;
  return true;
}
export function rateCard(state, recalled) {
  const cards = state.cards, round = cards.active;
  if (!round?.revealed || typeof recalled !== 'boolean') return false;
  const id = round.deck[round.index];
  cards.recalled = cards.recalled.filter(x => x !== id);
  cards.again = cards.again.filter(x => x !== id);
  (recalled ? cards.recalled : cards.again).push(id);
  round.ratings.push(recalled);
  round.index++;
  round.revealed = false;
  if (round.index === round.deck.length) {
    cards.last = {total: round.deck.length, recalled: round.ratings.filter(Boolean).length};
    cards.active = null;
  }
  return true;
}
export function completeGame(state, id, score = 0) {
  if (!GAME_IDS.includes(id) || !Number.isFinite(score) || score < 0) return false;
  state.games[id] = {completed: true, score: Math.max(state.games[id]?.score || 0, finiteInt(score, 1000000000))};
  return true;
}
export function progress(state) {
  const questionStats = state?.stats || {}, report = pool => ({total: pool.length,
    correct: pool.filter(q => questionStats[q.id]?.right > 0).length,
    missed: pool.filter(q => questionStats[q.id]?.last === false).length});
  const questions = report(QUESTIONS), cards = unique(state?.cards?.recalled, termById).length;
  const games = GAME_IDS.filter(id => state?.games?.[id]?.completed === true).length;
  const tried = QUESTIONS.reduce((sum, q) => sum + finiteInt(questionStats[q.id]?.tried), 0);
  const right = QUESTIONS.reduce((sum, q) => sum + finiteInt(questionStats[q.id]?.right), 0);
  const complete = questions.correct === QUESTIONS.length && cards === TERMS.length && games === GAME_IDS.length;
  const weighted = 60 * questions.correct / QUESTIONS.length + 25 * cards / TERMS.length + 15 * games / GAME_IDS.length;
  return {percent: complete ? 100 : Math.min(99, Math.floor(weighted)), complete,
    questions, cards: {recalled: cards, total: TERMS.length, again: unique(state?.cards?.again, termById).length},
    games: {completed: games, total: GAME_IDS.length},
    sections: SECTIONS.map(s => ({id: s.id, ...report(QUESTIONS.filter(q => q.section === s.id))})),
    tried, right, accuracy: tried ? Math.round(100 * right / tried) : null,
    quizBest: state?.quizBest?.score ?? null};
}
export function nextGoal(state) {
  const p = progress(state);
  if (state.active) return {action: 'resume-quiz', title: 'Finish your current round', description: 'Your place and locked answers are saved.'};
  if (state.cards.active) return {action: 'resume-cards', title: 'Finish your flashcards', description: 'Pick up with the term you were recalling.'};
  if (!p.tried) return {action: 'quiz', mode: 'exam', title: 'Try a 15-question rehearsal', description: 'Practice the quiz format: 3 key terms and 12 chapter questions.'};
  if (missed(state).length) return {action: 'quiz', mode: 'missed', size: 5, title: 'Correct your missed questions', description: 'Use a short round to check the ideas you just missed.'};
  if (p.cards.recalled < TERMS.length) return {action: 'cards', size: 5, title: 'Recall five bold terms', description: 'Say the meaning first, then reveal and rate your recall.'};
  const nextGame = GAME_IDS.find(id => !state.games[id]?.completed);
  if (nextGame) return {action: 'game', id: nextGame, title: 'Put reform into action', description: 'Finish a short historical game and its decisions.'};
  if (p.questions.correct < QUESTIONS.length) {
    const weakest = p.sections.filter(s => s.correct < s.total).sort((a, b) => a.correct / a.total - b.correct / b.total)[0];
    return {action: 'quiz', mode: 'practice', section: weakest.id, size: 5, title: `Review section ${weakest.id}`, description: 'Answer five questions from the section with the most work left.'};
  }
  return {action: 'quiz', mode: 'exam', title: 'Keep it fresh with a rehearsal', description: 'All study activities are complete. Try a new mix without looking at notes.'};
}
