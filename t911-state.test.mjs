import test from 'node:test';
import assert from 'node:assert/strict';
import {QUESTIONS,TERMS} from './t911-data.mjs';
import {fresh,clean,shuffle,selectQuestions,makeRound,startRound,answerQuestion,nextQuestion,missed,progress,freshCards,cleanCards,startCards,revealCard,rateCard} from './t911-state.mjs';
const byId=new Map(QUESTIONS.map(q=>[q.id,q]));
function finishRound(s,{wrong=0}={}){let i=0;while(s.active){const q=byId.get(s.active.deck[s.active.index].id);answerQuestion(s,i<wrong?(q.answer+1)%4:q.answer);nextQuestion(s);i++;}return s;}

test('forty-question rehearsals rotate 14/13/13 chapter coverage and include every available section',()=>{
 const extra=new Set(),sets=new Set();for(let seed=0;seed<120;seed++){const ids=selectQuestions({mode:'exam',chapter:9,size:5,termsOnly:true,seed});assert.equal(ids.length,40);assert.equal(new Set(ids).size,40);assert.deepEqual(ids,selectQuestions({mode:'exam',seed}));const qs=ids.map(id=>byId.get(id)),counts=[9,10,11].map(c=>qs.filter(q=>q.chapter===c).length);assert.deepEqual([...counts].sort((a,b)=>a-b),[13,13,14]);extra.add([9,10,11][counts.indexOf(14)]);for(const section of new Set(QUESTIONS.map(q=>q.section)))assert.ok(qs.some(q=>q.section===section),section);sets.add(ids.join(','));}assert.equal(extra.size,3);assert.ok(sets.size>100);
});
test('chapter, section, term-only, full-bank and missed-question filters are exact',()=>{
 const section=QUESTIONS.find(q=>q.chapter===11).section;
 for(const chapter of [9,10,11]){const ids=selectQuestions({chapter,size:'all',seed:4});assert.equal(ids.length,QUESTIONS.filter(q=>q.chapter===chapter).length);assert.ok(ids.every(id=>byId.get(id).chapter===chapter));}
 const terms=selectQuestions({termsOnly:true,size:'all',seed:5});assert.equal(terms.length,QUESTIONS.filter(q=>q.term).length);assert.ok(terms.every(id=>byId.get(id).term));
 const sectionIds=selectQuestions({chapter:11,section,size:'all'});assert.ok(sectionIds.length>0);assert.ok(sectionIds.every(id=>byId.get(id).section===section));
 const targets=QUESTIONS.filter(q=>q.chapter===9).slice(0,3).map(q=>q.id);assert.deepEqual(new Set(selectQuestions({review:true,misses:[...targets,'unknown'],size:'all'})),new Set(targets));assert.deepEqual(selectQuestions({review:true,misses:[]}),[]);assert.deepEqual(selectQuestions({chapter:999}),[]);assert.deepEqual(selectQuestions({section:'missing'}),[]);assert.deepEqual(selectQuestions({size:NaN}),[]);assert.equal(selectQuestions({size:'all'}).length,QUESTIONS.length);
});
test('short mixed rounds cover all chapters, prioritize weak work and preserve deterministic option order',()=>{
 const s=fresh();for(const q of QUESTIONS)s.stats[q.id]={tried:1,right:1,last:true};const target=QUESTIONS.find(q=>q.chapter===9),unseen=QUESTIONS.find(q=>q.chapter===9&&q.id!==target.id);s.stats[target.id]={tried:1,right:0,last:false};delete s.stats[unseen.id];startRound(s,{chapter:9,size:1,seed:2});assert.equal(s.active.deck[0].id,target.id);answerQuestion(s,target.answer);nextQuestion(s);startRound(s,{chapter:9,size:1,seed:2});assert.equal(s.active.deck[0].id,unseen.id);
 const a=makeRound(fresh(),{size:5,seed:27}),b=makeRound(fresh(),{size:5,seed:27});assert.deepEqual(a,b);assert.equal(new Set(a.deck.map(d=>byId.get(d.id).chapter)).size,3);for(const d of a.deck)assert.deepEqual([...d.order].sort(),[0,1,2,3]);assert.notDeepEqual(a,makeRound(fresh(),{size:5,seed:28}));assert.deepEqual(shuffle([1,2,3],9),shuffle([1,2,3],9));
});
test('a locked answer restores the same question, option order, mode and credits',()=>{
 const s=fresh();startRound(s,{mode:'exam',seed:11});assert.equal(nextQuestion(s),false);const q=byId.get(s.active.deck[0].id);assert.equal(answerQuestion(s,9),false);assert.equal(answerQuestion(s,q.answer),true);assert.equal(answerQuestion(s,(q.answer+1)%4),false);const restored=clean(JSON.parse(JSON.stringify(s)));assert.deepEqual(restored,s);assert.equal(restored.active.mode,'exam');assert.equal(progress(restored).correct,1);nextQuestion(restored);assert.equal(restored.active.index,1);assert.equal(restored.active.answers[0],q.answer);
});
test('invalid active decks and result rows cannot restore a forged question or rehearsal',()=>{
 const s=fresh();startRound(s,{mode:'exam',seed:6});const copy=()=>JSON.parse(JSON.stringify(s));const cases=[];
 let raw=copy();raw.active.deck[0]=null;cases.push(raw);raw=copy();raw.active.deck[1]=raw.active.deck[0];cases.push(raw);raw=copy();raw.active.deck[0].order=[0,0,2,3];cases.push(raw);raw=copy();raw.active.answers[2]=1;cases.push(raw);raw=copy();raw.active.index=500;cases.push(raw);raw=copy();raw.active.deck=raw.active.deck.slice(0,39);raw.active.answers=raw.active.answers.slice(0,39);cases.push(raw);raw=copy();raw.active.mode='invented';cases.push(raw);for(const candidate of cases)assert.equal(clean(candidate).active,null);
 const q=QUESTIONS[0];assert.equal(clean({...fresh(),last:{mode:'practice',rows:[{id:q.id,option:q.answer},{id:q.id,option:q.answer}],score:2}}).last,null);assert.equal(clean({...fresh(),examBest:{mode:'exam',rows:[{id:q.id,option:q.answer}],score:40}}).examBest,null);assert.deepEqual(clean({version:99,stats:s.stats}),fresh());
});
test('a canonical forty-question best survives practice and cannot trust a claimed saved score',()=>{
 const s=fresh();startRound(s,{mode:'exam',seed:20});finishRound(s,{wrong:2});assert.equal(s.last.score,38);assert.equal(s.examBest.score,38);const bestRows=JSON.parse(JSON.stringify(s.examBest.rows));startRound(s,{size:5,seed:19});finishRound(s);assert.equal(s.last.score,5);assert.equal(s.examBest.score,38);assert.deepEqual(s.examBest.rows,bestRows);assert.equal(clean({...s,examBest:{...s.examBest,score:999}}).examBest.score,38);startRound(s,{mode:'exam',seed:25});finishRound(s,{wrong:5});assert.equal(s.examBest.score,38);s.last.rows[0].option=(s.last.rows[0].option+1)%4;assert.deepEqual(s.examBest.rows,bestRows);
});
test('mistakes enter review, later correction clears them and repeats do not farm unique progress',()=>{
 const s=fresh();startRound(s,{size:1,seed:31});const q=byId.get(s.active.deck[0].id);answerQuestion(s,(q.answer+1)%4);nextQuestion(s);assert.deepEqual(missed(s),[q.id]);assert.equal(progress(s).correct,0);assert.equal(startRound(s,{review:true,size:5,seed:1}),true);assert.equal(s.active.deck.length,1);answerQuestion(s,q.answer);nextQuestion(s);assert.equal(missed(s).length,0);assert.equal(progress(s).correct,1);assert.equal(startRound(s,{review:true}),false);startRound(s,{chapter:q.chapter,section:q.section,size:'all',seed:1});finishRound(s);const completed=progress(s).correct;startRound(s,{chapter:q.chapter,section:q.section,size:'all',seed:1});finishRound(s);assert.equal(progress(s).correct,completed);assert.ok(progress(s).tried>completed);
});
test('five-card sessions require a reveal before rating and restore an interrupted card',()=>{
 const s=freshCards();assert.equal(startCards(s,{seed:7}),true);assert.equal(s.active.deck.length,Math.min(5,TERMS.length));assert.equal(rateCard(s,true),false);assert.equal(revealCard(s),true);assert.equal(revealCard(s),false);assert.equal(s.recalled.length,0);assert.deepEqual(cleanCards(JSON.parse(JSON.stringify(s))),s);rateCard(s,true);assert.equal(s.recalled.length,1);assert.equal(rateCard(s,true),false);assert.equal(s.active.index,1);
});
test('card review keeps actual misses, later recall removes them, and familiar cards follow unseen terms',()=>{
 const s=freshCards();assert.equal(startCards(s,{review:true}),false);startCards(s,{chapter:9,size:1,seed:4});const id=s.active.deck[0];revealCard(s);rateCard(s,false);assert.deepEqual(s.again,[id]);startCards(s,{review:true,size:'all'});assert.deepEqual(s.active.deck,[id]);revealCard(s);rateCard(s,true);assert.deepEqual(s.again,[]);assert.deepEqual(s.recalled,[id]);startCards(s,{chapter:9,size:1,seed:4});assert.notEqual(s.active.deck[0],id);const n=freshCards();startCards(n,{size:'all',seed:5});while(n.active){revealCard(n);rateCard(n,true);}assert.equal(n.recalled.length,TERMS.length);assert.equal(n.last.total,TERMS.length);startCards(n,{size:5,seed:5});while(n.active){revealCard(n);rateCard(n,true);}assert.equal(n.recalled.length,TERMS.length);
});
test('card filters and malformed card saves cannot invent term IDs or out-of-order ratings',()=>{
 const s=freshCards();startCards(s,{chapter:11,size:'all',seed:1});assert.ok(s.active.deck.every(id=>TERMS.find(t=>t.id===id).chapter===11));const first=TERMS.find(t=>t.chapter===9),section=first.section||byId.get(first.questionId).section;startCards(s,{chapter:9,section,size:'all',seed:3});assert.ok(s.active.deck.every(id=>{const t=TERMS.find(t=>t.id===id);return (t.section||byId.get(t.questionId).section)===section;}));const bad={...s,active:{...s.active,ratings:[true]}};assert.equal(cleanCards(bad).active,null);const restored=cleanCards({version:1,recalled:[first.id,first.id,'unknown'],again:[first.id,'unknown']});assert.deepEqual(restored.recalled,[first.id]);assert.deepEqual(restored.again,[]);assert.equal(startCards(s,{chapter:100}),false);assert.equal(progress(fresh(),restored).recalled,1);
});
test('records from the earlier Chapter 10 hub cannot become test-review progress',()=>{
 const legacyId='c10-politics-01';assert.equal(byId.has(legacyId),false);
 const foreign={version:1,chapter:6,finished:['count'],stats:{[legacyId]:{tried:10,right:10,last:true}},active:{mode:'practice',deck:[{id:legacyId,order:[0,1,2,3]}],index:0,answers:[0]},last:{mode:'practice',rows:[{id:legacyId,option:0}],score:1},quizBest:{score:15}};
 assert.deepEqual(clean(foreign),fresh());assert.deepEqual(cleanCards({version:1,recalled:['kitchen-cabinet'],again:['spoils-system']}),freshCards());
});
