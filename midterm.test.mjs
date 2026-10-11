import test from 'node:test';
import assert from 'node:assert/strict';
import {BANK,FOCUS,SOURCES} from './midterm-data.mjs';
import {fresh,clean,cleanSession,makeSession,answer,next,progress,nextGoal,creditDrill,creditGame,TASKS,BY_ID} from './midterm-state.mjs';
function rng(seed=17){return ()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
function respond(s,right=true){const d=s.active.deck[s.active.index];if(s.active.kind==='cards')s={...s,active:{...s.active,revealed:true}};return next(answer(s,s.active.kind==='cards'?Number(right):d.order.indexOf(right?0:1)));}
test('Every study concept is distinct, has four unique choices and an accountable source',()=>{
 assert.equal(new Set(BANK.map(q=>q.id)).size,BANK.length);
 for(const q of BANK){assert.equal(q.a.length,4,q.id);assert.equal(new Set(q.a).size,4,q.id);assert.ok(q.q&&q.why&&q.front&&q.back,q.id);assert.ok(SOURCES[q.source],q.id);}
 assert.equal(BANK.filter(q=>q.c===7&&q.k).length,16);
 assert.equal(BANK.filter(q=>q.c===8&&q.k).length,10);
 assert.ok(FOCUS.length>100);
});
test('Rehearsals respect all three teacher groups, the term counts and unique concepts across seeds',()=>{
 const samples=new Set();for(let seed=1;seed<=60;seed++){
  const r=makeSession(fresh(),{kind:'exam',rng:rng(seed)}),qs=r.deck.map(d=>BY_ID.get(d.id));
  assert.equal(qs.length,40);assert.equal(new Set(qs.map(q=>q.id)).size,40);
  assert.equal(qs.filter(q=>q.c>=2&&q.c<=6).length,10);
  for(const c of [7,8]){assert.equal(qs.filter(q=>q.c===c).length,15);assert.equal(qs.filter(q=>q.c===c&&q.k).length,3);assert.equal(qs.filter(q=>q.c===c&&q.p&&!q.k).length,12);}
  assert.ok(qs.every(q=>q.c!==1));samples.add(r.deck.map(d=>d.id).join(','));
 }assert.ok(samples.size>50);
});
test('A wrong answer earns no question credit; correcting it clears review; repeats cannot farm completion',()=>{
 let s=fresh();s.active=makeSession(s,{count:1,rng:rng()});const id=s.active.deck[0].id;
 s=respond(s,false);assert.equal(progress(s).quiz,0);assert.equal(nextGoal(s).kind,'review');
 s.active=makeSession(s,{review:true,count:1});assert.equal(s.active.deck[0].id,id);s=respond(s);
 assert.equal(progress(s).quiz,1);assert.equal(progress(s).missed,0);const before=progress(s).percent;
 for(let i=0;i<15;i++){s.active=makeSession(s,{ids:[id]});s=respond(s);}
 assert.equal(progress(s).quiz,1);assert.equal(progress(s).percent,before);
});
test('Card credit requires reveal and a recall check; quiz credit and card credit are independent',()=>{
 let s=fresh();s.active=makeSession(s,{kind:'cards',count:1});assert.equal(answer(s,1),s);
 s={...s,active:{...s.active,revealed:true}};s=next(answer(s,0));assert.equal(progress(s).cards,0);
 s.active=makeSession(s,{kind:'cards',review:true,count:1});s=respond(s);
 assert.equal(progress(s).cards,1);assert.equal(progress(s).quiz,0);
});
test('An interrupted round restores question order, response and feedback, including exam hidden feedback',()=>{
 let s=fresh();s.active=makeSession(s,{kind:'exam',rng:rng()});const d=s.active.deck[0];s=answer(s,d.order.indexOf(0));
 const restored=clean(JSON.parse(JSON.stringify(s)));assert.deepEqual(restored,s);assert.equal(restored.exams.length,0);
 s=next(restored);while(s.active)s=respond(s);assert.equal(s.exams.length,1);assert.equal(s.exams[0].score,40);assert.equal(s.last.index,40);
});
test('Save validation rejects invalid decks, forged answer correctness and malformed optional records',()=>{
 const r=makeSession(fresh());assert.equal(cleanSession({...r,deck:[r.deck[0],r.deck[0]]}),null);
 assert.equal(cleanSession({...r,answers:[{id:r.deck[0].id,option:1,right:true}]}),null);
 assert.deepEqual(clean({version:99}),fresh());
 const s=clean({version:1,stats:{bogus:{right:100}},games:['7','7','9'],drills:['unknown'],exams:[{score:41,date:'x'}]});
 assert.deepEqual(s.games,['7']);assert.deepEqual(s.stats,{});assert.deepEqual(s.drills,[]);assert.deepEqual(s.exams,[]);
});
test('100% requires every focus concept, recall card, challenge, both games and one finished rehearsal',()=>{
 let s=fresh();for(const q of FOCUS)s.stats[q.id]={right:1,wrong:0,recall:1,again:0,lastCorrect:true,lastRecall:true};
 for(const id of TASKS)s=creditDrill(s,id);s=creditGame(creditGame(s,7),8);
 assert.equal(progress(s).percent,96);s.exams=[{score:40,date:'2026-10-10'}];assert.equal(progress(s).percent,100);
 assert.equal(creditGame(s,9),s);assert.equal(creditDrill(s,'unknown'),s);
 s.games=['7'];assert.equal(progress(s).percent,97);s.games=['7','8'];s.stats[FOCUS[0].id].right=0;assert.ok(progress(s).percent<100);
});
