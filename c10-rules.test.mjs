import test from 'node:test';
import assert from 'node:assert/strict';
import {statSync} from 'node:fs';
import {
 fresh,clean,completeEpisode,missed,startRound,selectRehearsal,answerQuestion,nextQuestion,
 createPress,stepPress,stampPress,nextSheet,pressNeedle,
 createBank,stepBank,routeMoney,nextTransfer,
 createRecord,inspectRecord,placeRecord
} from './c10-rules.mjs';
import {QUESTIONS,KEY_TERMS,TOPICS} from './c10-questions.mjs';
import {EPISODES,PRESS_JOBS,BANK_SLIPS,RECORDS,LINES} from './c10-data.mjs';
import {VOICES} from './c10-voices.mjs';

const copy=x=>JSON.parse(JSON.stringify(x));
const question=id=>QUESTIONS.find(q=>q.id===id);
function finishRound(s,{size=5,right=5,mode='exam',seed=1}={}){
 assert.equal(startRound(s,{size,mode,seed}),true);
 const deck=copy(s.active.deck);
 for(let i=0;i<deck.length;i++){
  const q=question(deck[i].id);
  assert.equal(answerQuestion(s,i<right?q.answer:(q.answer+1)%4),true);
  assert.equal(nextQuestion(s),true);
 }
 assert.equal(s.active,null);
 return deck;
}

test('Chapter 10 rehearsals contain exactly three terms and twelve content questions across all five sections',()=>{
 const terms=new Set(KEY_TERMS),variants=new Set(),seenTerms=new Set();
 for(let seed=1;seed<=100;seed++){
  const deck=selectRehearsal({seed});assert.equal(deck.length,15);assert.equal(new Set(deck).size,15);
  assert.equal(deck.filter(id=>terms.has(id)).length,3);assert.equal(deck.filter(id=>!terms.has(id)).length,12);
  for(const t of TOPICS)assert.equal(deck.filter(id=>question(id).topic===t.id).length,3);
  deck.filter(id=>terms.has(id)).forEach(id=>seenTerms.add(id));
  assert.deepEqual(selectRehearsal({seed}),deck);variants.add(deck.join());
 }
 assert.equal(variants.size,100);assert.equal(seenTerms.size,16,'repeated rehearsals rotate through the whole bold-term pool');
});

test('The explicit quiz format forces the fifteen-question rehearsal and restores its exact answered deck',()=>{
 const s=fresh();startRound(s,{format:'chapter10',topic:'removal',size:90,mode:'practice',review:true,termsOnly:true,seed:87});
 assert.equal(s.active.format,'chapter10');assert.equal(s.active.mode,'exam');assert.equal(s.active.deck.length,15);
 assert.equal(s.active.deck.filter(d=>question(d.id).term).length,3);
 const first=question(s.active.deck[0].id);answerQuestion(s,first.answer);
 const restored=clean(copy(s));assert.deepEqual(restored.active,s.active);assert.equal(answerQuestion(restored,first.answer),false);
 assert.equal(nextQuestion(restored),true);assert.equal(restored.active.index,1);
 for(let i=1;i<15;i++){answerQuestion(restored,question(restored.active.deck[i].id).answer);nextQuestion(restored);}
 assert.equal(restored.last.format,'chapter10');assert.equal(restored.last.score,15);assert.deepEqual(clean(copy(restored)).last,restored.last);
});

test('All-topic fifteen-question exam entry uses the quiz split while ordinary practice remains flexible',()=>{
 const s=fresh();startRound(s,{mode:'exam',size:15,seed:4});assert.equal(s.active.format,'chapter10');assert.equal(s.active.deck.filter(d=>question(d.id).term).length,3);
 for(const options of [{mode:'practice',size:15},{mode:'exam',size:5},{mode:'exam',size:15,topic:'politics'},{mode:'exam',size:15,termsOnly:true},{mode:'exam',size:15,review:true}]){
  startRound(s,{...options,seed:13});assert.equal(s.active.format,undefined);assert.deepEqual(clean(copy(s)).active,s.active);
 }
 const previous=copy(s.active);assert.equal(startRound(s,{format:'not-a-format'}),false);assert.deepEqual(s.active,previous);
});

test('Saved quiz-format claims cannot restore the wrong count, mode, term split or section coverage',()=>{
 const s=fresh();startRound(s,{format:'chapter10',seed:41});const valid=copy(s.active);
 const mutations=[
  r=>{r.format='unknown';},r=>{r.format=null;},r=>{r.mode='practice';},
  r=>{r.deck.pop();r.answers.pop();},
  r=>{const term=r.deck.findIndex(d=>question(d.id).term),replacement=QUESTIONS.find(q=>!q.term&&!r.deck.some(d=>d.id===q.id));r.deck[term].id=replacement.id;},
  r=>{const a=r.deck.find(d=>!question(d.id).term),replacement=QUESTIONS.find(q=>!q.term&&q.topic!==question(a.id).topic&&!r.deck.some(d=>d.id===q.id));a.id=replacement.id;}
 ];
 for(const mutate of mutations){const raw=fresh();raw.active=copy(valid);mutate(raw.active);assert.equal(clean(raw).active,null);}
 const legacy=fresh();legacy.active=copy(valid);delete legacy.active.format;assert.deepEqual(clean(legacy).active,legacy.active,'valid older saves without format remain usable');
});

test('The dedicated quiz best survives practice and does not inherit an older extended-exam best',()=>{
 const s=fresh();finishRound(s,{size:90,right:90,seed:18});assert.deepEqual(s.best,{score:90,total:90});assert.equal(s.quizBest,null);
 finishRound(s,{size:15,right:12,seed:19});assert.equal(s.quizBest.score,12);assert.equal(s.quizBest.rows.length,15);assert.equal(s.quizBest.format,'chapter10');
 const best=copy(s.quizBest);
 finishRound(s,{size:5,right:5,mode:'practice',seed:20});assert.equal(s.last.mode,'practice');assert.deepEqual(s.quizBest,best);assert.deepEqual(clean(copy(s)).quizBest,best);
 finishRound(s,{size:15,right:10,seed:21});assert.deepEqual(s.quizBest,best,'a lower rehearsal cannot replace the best');
 finishRound(s,{size:15,right:12,seed:22});assert.deepEqual(s.quizBest,best,'an equal result keeps the existing record');
 finishRound(s,{size:15,right:14,seed:23});assert.equal(s.quizBest.score,14);assert.notDeepEqual(s.quizBest.rows,best.rows);
 s.last.rows[0].option=(s.last.rows[0].option+1)%4;assert.notDeepEqual(s.last.rows,s.quizBest.rows,'the best owns separate canonical answer rows');
 const old=copy(s);delete old.quizBest;assert.equal(clean(old).quizBest,null,'older saves remain valid without inventing a dedicated best');
});

test('Saved dedicated quiz best scores are recomputed from canonical answers',()=>{
 const s=fresh();finishRound(s,{size:15,right:11,seed:61});const raw=copy(s);raw.quizBest.score=999;raw.quizBest.total=90;
 const restored=clean(raw);assert.equal(restored.quizBest.score,11);assert.equal(restored.quizBest.total,undefined);assert.deepEqual(restored.quizBest.rows,s.quizBest.rows);
 raw.quizBest.rows[0].option=(question(raw.quizBest.rows[0].id).answer+1)%4;assert.equal(clean(raw).quizBest.score,10,'the saved score cannot override answer correctness');
 const original=copy(raw.quizBest.rows);restored.quizBest.rows[1].option=(restored.quizBest.rows[1].option+1)%4;assert.deepEqual(raw.quizBest.rows,original,'cleaned records own independent answer arrays');
});

test('Malformed quiz best records cannot claim credit for duplicate, unbalanced or invalid answers',()=>{
 const s=fresh();finishRound(s,{size:15,right:13,seed:71});const valid=copy(s.quizBest);
 const mutations=[
  r=>{r.format='practice';},r=>{delete r.format;},r=>{r.mode='practice';},r=>{r.rows.pop();},
  r=>{r.rows[0].option=4;},r=>{r.rows[0].option=null;},r=>{r.rows[0].id='not-a-question';},
  r=>{r.rows[1]={...r.rows[0]};},
  r=>{const i=r.rows.findIndex(a=>question(a.id).term),replacement=QUESTIONS.find(q=>!q.term&&!r.rows.some(a=>a.id===q.id));r.rows[i].id=replacement.id;},
  r=>{const a=r.rows.find(a=>!question(a.id).term),replacement=QUESTIONS.find(q=>!q.term&&q.topic!==question(a.id).topic&&!r.rows.some(a=>a.id===q.id));a.id=replacement.id;}
 ];
 for(const mutate of mutations){const raw=fresh();raw.quizBest=copy(valid);mutate(raw.quizBest);assert.equal(clean(raw).quizBest,null);}
});

test('A saved answered question restores the same deck, option order, feedback and credits',()=>{
 const s=fresh();assert.ok(startRound(s,{size:15,mode:'practice',seed:310}));
 const first=question(s.active.deck[0].id);
 assert.equal(nextQuestion(s),false,'an unanswered question cannot be skipped');
 assert.equal(answerQuestion(s,first.answer),true);
 const snapshot=copy(s),restored=clean(snapshot);
 assert.deepEqual(restored.active,s.active);
 assert.deepEqual(restored.stats,s.stats);
 assert.equal(answerQuestion(restored,(first.answer+1)%4),false,'reload cannot create a second answer');
 assert.deepEqual(restored.stats[first.id],{tried:1,right:1,last:true});
 assert.equal(nextQuestion(restored),true);assert.equal(restored.active.index,1);
 assert.equal(restored.active.answers[0],first.answer);
 assert.equal(restored.active.answers[1],null);
 restored.active.deck[0].order.reverse();
 assert.deepEqual(snapshot.active,s.active,'the cleaned round owns independent arrays');
});

test('Wrong answers enter review, invalid/double answers earn nothing, and later correction clears the miss',()=>{
 const s=fresh();startRound(s,{size:1,seed:22});
 const q=question(s.active.deck[0].id);
 for(const invalid of [-1,4,1.5,NaN,'0',null])assert.equal(answerQuestion(s,invalid),false);
 assert.equal(Object.keys(s.stats).length,0);
 assert.equal(answerQuestion(s,(q.answer+1)%4),true);
 assert.equal(answerQuestion(s,q.answer),false);
 assert.deepEqual(s.stats[q.id],{tried:1,right:0,last:false});
 assert.deepEqual(missed(s),[q.id]);
 nextQuestion(s);assert.equal(s.last.score,0);assert.equal(s.best,null);
 startRound(s,{size:1,seed:22});
 assert.equal(s.active.deck[0].id,q.id);
 answerQuestion(s,q.answer);nextQuestion(s);
 assert.deepEqual(s.stats[q.id],{tried:2,right:1,last:true});assert.deepEqual(missed(s),[]);
});

test('Exam restoration keeps its mode and results compare accuracy rather than raw question counts',()=>{
 const s=fresh();startRound(s,{size:5,mode:'exam',seed:7});
 const first=question(s.active.deck[0].id);answerQuestion(s,first.answer);nextQuestion(s);
 const restored=clean(copy(s));assert.equal(restored.active.mode,'exam');assert.equal(restored.active.index,1);
 assert.deepEqual(restored.active,s.active);
 finishRound(s,{size:5,right:3,seed:2});assert.deepEqual(s.best,{score:3,total:5});
 finishRound(s,{size:5,right:5,mode:'practice',seed:3});
 assert.equal(s.last.mode,'practice');assert.equal(s.last.score,5);assert.deepEqual(s.best,{score:3,total:5});
 finishRound(s,{size:10,right:5,seed:4});assert.deepEqual(s.best,{score:3,total:5},'a lower percentage cannot replace the best');
 finishRound(s,{size:15,right:12,seed:5});assert.deepEqual(s.best,{score:12,total:15});
 finishRound(s,{size:5,right:4,seed:6});assert.deepEqual(s.best,{score:12,total:15},'equal percentages preserve the existing record');
 assert.equal(s.last.rows.length,5);assert.equal(s.last.score,4);assert.equal(s.last.mode,'exam');
 assert.deepEqual(clean(copy(s)).last,s.last);assert.deepEqual(clean(copy(s)).best,s.best);
});

test('Malformed active decks, option orders, answer positions and modes cannot restore a live round',()=>{
 const s=fresh();startRound(s,{size:3,seed:9});const valid=copy(s.active);
 const variants=[
 r=>{r.mode='unknown';},
 r=>{r.deck=[];},
 r=>{r.deck[1].id=r.deck[0].id;},
 r=>{r.deck[0].id='not-a-question';},
 r=>{r.deck[0].order=[0,0,2,3];},
 r=>{r.deck[0].order=[0,1,2];},
 r=>{r.deck[0].order=[0,1,2,4];},
 r=>{r.deck[0].order=[0,1,2,2.5];},
 r=>{r.index=-1;},
 r=>{r.index=r.deck.length;},
 r=>{r.index=.5;},
 r=>{r.answers=[];},
 r=>{r.answers[0]=4;},
 r=>{r.answers[1]=0;},
 r=>{r.index=1;r.answers[0]=null;}
 ];
 for(const mutate of variants){const r=copy(valid);mutate(r);assert.equal(clean({...fresh(),active:r}).active,null);}
 const q=question(valid.deck[0].id),forged={...fresh(),last:{mode:'exam',score:90,rows:[{id:q.id,option:(q.answer+1)%4}]},best:{score:91,total:90}};
 const sanitized=clean(forged);assert.equal(sanitized.last.score,0);assert.equal(sanitized.best,null);
 assert.deepEqual(clean({version:200}),fresh());
});

test('Save cleaning tolerates malformed completion lists and only retains a sequential completed prefix',()=>{
 for(const finished of [null,42,{},'count,press,rally'])assert.deepEqual(clean({version:1,finished}),fresh());
 const cleaned=clean({version:1,finished:['count','bank','rally','not-an-episode']});
 assert.equal(cleaned.chapter,1);assert.deepEqual(cleaned.finished,['count']);
 const all=clean({version:1,finished:EPISODES.map(e=>e.id).reverse()});
 assert.equal(all.chapter,6);assert.deepEqual(all.finished,EPISODES.map(e=>e.id));
});

test('Only the current episode can receive campaign credit and a replay cannot advance or duplicate it',()=>{
 const s=fresh(),initial=copy(s);
 for(const index of [-1,1,5,6,NaN,'0'])completeEpisode(s,index);
 assert.deepEqual(s,initial);
 EPISODES.forEach((e,index)=>{
  completeEpisode(s,index);assert.equal(s.chapter,index+1);assert.equal(s.finished.at(-1),e.id);
  const after=copy(s);completeEpisode(s,index);completeEpisode(s,index+2);assert.deepEqual(s,after);
 });
 assert.deepEqual(s.finished,EPISODES.map(e=>e.id));
 completeEpisode(s,6);assert.equal(s.chapter,6);assert.equal(s.finished.length,6);
});

test('The press requires elapsed timing and two clean strikes per actual sheet; instant spam cannot finish',()=>{
 const s=createPress();assert.equal(nextSheet(s),false);
 assert.equal(stampPress(s),'good');assert.equal(s.strikes,1);
 for(let i=0;i<100;i++)assert.equal(stampPress(s),null);
 assert.equal(s.strikes,1);assert.equal(s.job,0);
 stepPress(s,.05);stepPress(s,.05);stepPress(s,.05);stepPress(s,.05);
 assert.equal(stampPress(s),'miss');assert.equal(s.strikes,1);assert.equal(s.combo,0);
 let cleanStrikes=1,sheets=0;
 for(let tick=0;tick<3000&&!s.done;tick++){
  stepPress(s,.05);
  if(s.wait){const at=s.time;stepPress(s,1);assert.equal(s.time,at);assert.ok(nextSheet(s));sheets++;continue;}
  if(s.time-s.lastStrike>=.2&&Math.abs(pressNeedle(s)-.5)<.12){const result=stampPress(s);assert.ok(['good','sheet'].includes(result));cleanStrikes++;}
 }
 assert.equal(s.done,true);assert.equal(sheets,PRESS_JOBS.length);assert.equal(cleanStrikes,PRESS_JOBS.length*2);
 assert.ok(s.time>5,'successful printing involves time passing through the gauge');
 const end=copy(s);stepPress(s,1);stampPress(s);nextSheet(s);assert.deepEqual(s,end);
 const assisted=createPress(true),normal=createPress();assisted.time=normal.time=.14;
 assert.equal(stampPress(normal),'miss');assert.equal(stampPress(assisted),'good','assist widens timing without removing timing');
});

test('Every bank transfer needs its proper tray and an explicit next step before another slip can count',()=>{
 const s=createBank();assert.equal(nextTransfer(s),false);
 assert.equal(routeMoney(s,'unknown'),null);assert.equal(s.accepted,0);
 for(let index=0;index<BANK_SLIPS.length;index++){
  const slip=BANK_SLIPS[index],wrong=['state','land','exchange'].find(x=>x!==slip.to);
  assert.equal(s.index,index);assert.equal(routeMoney(s,wrong),'miss');
  assert.equal(s.index,index);assert.equal(s.accepted,index);assert.equal(s.pending,false);
  stepBank(s,.05);assert.ok(s.clock>0);
  assert.equal(routeMoney(s,slip.to),'good');assert.equal(s.accepted,index+1);assert.equal(s.pending,true);
  const waiting=copy(s);stepBank(s,1);assert.equal(routeMoney(s,slip.to),null);assert.deepEqual(s,waiting);
  assert.equal(nextTransfer(s),true);assert.equal(s.clock,0);
 }
 assert.equal(s.done,true);assert.equal(s.accepted,8);assert.equal(s.mistakes,8);
 const final=copy(s);routeMoney(s,'state');nextTransfer(s);stepBank(s,.05);assert.deepEqual(s,final);
});

test('Court records must be inspected and matched to their actual dates before completion',()=>{
 const s=createRecord();
 for(const r of RECORDS)assert.equal(placeRecord(s,r.id,r.slot),null);
 assert.equal(s.done,false);assert.deepEqual(s.placed,[null,null,null]);
 assert.equal(inspectRecord(s,'not-a-record'),null);assert.deepEqual(s.found,[]);
 const first=RECORDS[0];assert.equal(inspectRecord(s,first.id).title,first.title);
 inspectRecord(s,first.id);assert.deepEqual(s.found,[first.id]);
 assert.equal(placeRecord(s,first.id,2),'miss');assert.deepEqual(s.placed,[null,null,null]);
 assert.equal(placeRecord(s,first.id,first.slot),'good');
 const second=RECORDS[1];inspectRecord(s,second.id);assert.equal(placeRecord(s,second.id,second.slot),'good');
 assert.equal(placeRecord(s,RECORDS[2].id,2),null);assert.equal(s.done,false);
 inspectRecord(s,RECORDS[2].id);
 for(const slot of [-1,3,'2',NaN])assert.equal(placeRecord(s,RECORDS[2].id,slot),null);
 assert.equal(placeRecord(s,RECORDS[2].id,2),'finish');
 assert.equal(s.done,true);assert.deepEqual(s.placed,RECORDS.map(r=>r.id));
 const final=copy(s);assert.equal(inspectRecord(s,first.id),null);assert.equal(placeRecord(s,first.id,0),null);assert.deepEqual(s,final);
});

test('All fourteen film performances match their current authored lines and have packaged audio',()=>{
 const expected=['opening',...EPISODES.flatMap(e=>[e.intro,e.outro]),'final'];
 assert.equal(expected.length,14);assert.equal(new Set(expected).size,14);
 assert.deepEqual(new Set(Object.keys(LINES)),new Set(expected));assert.deepEqual(new Set(Object.keys(VOICES)),new Set(expected));
 for(const id of expected){
  const line=LINES[id],voice=VOICES[id];
  assert.equal(voice.text,line.text,id);assert.equal(voice.speaker,line.speaker,id);assert.equal(voice.voice,line.voice,id);
  assert.ok(Number.isFinite(voice.duration)&&voice.duration>1&&voice.duration<60,id);
  assert.ok(Number.isFinite(voice.rms)&&voice.rms>0,id);
  assert.ok(voice.file.endsWith('.mp3')&&!voice.file.includes('..'),id);
  const file=statSync(new URL(voice.file,import.meta.url));assert.ok(file.isFile()&&file.size>4000,id);
 }
});
