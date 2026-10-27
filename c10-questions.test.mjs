import test from 'node:test';
import assert from 'node:assert/strict';
import {QUESTIONS,TOPICS,KEY_TERMS,selectQuestions} from './c10-questions.mjs';

test('Chapter 10 has ninety distinct, sourced four-option questions with explanations',()=>{
 assert.equal(QUESTIONS.length,90);
 assert.equal(new Set(QUESTIONS.map(q=>q.id)).size,90);
 assert.equal(new Set(QUESTIONS.map(q=>q.prompt.toLowerCase())).size,90);
 for(const q of QUESTIONS){
  assert.ok(TOPICS.some(t=>t.id===q.topic),q.id);
  assert.equal(typeof q.term,'boolean',q.id);
  assert.equal(q.choices.length,4,q.id);
  assert.equal(new Set(q.choices.map(x=>x.toLowerCase())).size,4,q.id);
  assert.ok(q.choices.every(x=>typeof x==='string'&&x.length>3),q.id);
  assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4,q.id);
  assert.ok(q.why.length>=50,q.id);
  assert.ok(q.source.length>=1&&q.source.every(s=>/^P0[0-6][0-9]$/.test(s)&&Number(s.slice(1))<=67),q.id);
 }
});
test('Every topic has eighteen questions and correct answers do not favor one option',()=>{
 assert.deepEqual(TOPICS.map(t=>QUESTIONS.filter(q=>q.topic===t.id).length),[18,18,18,18,18]);
 const answerCounts=[0,0,0,0];QUESTIONS.forEach(q=>answerCounts[q.answer]++);
 assert.ok(Math.max(...answerCounts)-Math.min(...answerCounts)<=1);
});
test('All sixteen bold chapter terms have dedicated recall questions',()=>{
 assert.equal(KEY_TERMS.length,16);
 const required=['code of deference','universal manhood suffrage','spoils system','corrupt bargain','American System','Tariff of Abominations','rotation in office','Kitchen Cabinet','nullification','monster bank','Whigs','Five Civilized Tribes','Trail of Tears','tyranny of the majority','second party system','log cabin campaign'];
 const text=QUESTIONS.filter(q=>q.term).map(q=>q.prompt).join(' ').toLowerCase();
 required.forEach(term=>assert.ok(text.includes(term.toLowerCase()),term));
});
test('Mixed fifteen-question rounds cover each section evenly, are repeatable and vary across seeds',()=>{
 const seen=new Set();
 for(let seed=1;seed<=100;seed++){
  const ids=selectQuestions({seed});
  assert.equal(ids.length,15);
  assert.equal(new Set(ids).size,15);
  assert.deepEqual(TOPICS.map(t=>ids.filter(id=>QUESTIONS.find(q=>q.id===id).topic===t.id).length),[3,3,3,3,3]);
  assert.deepEqual(ids,selectQuestions({seed}));
  seen.add(ids.join(','));
 }
 assert.ok(seen.size>95);
});
test('Topic, term and missed-question review filters remain distinct and never invent IDs',()=>{
 const topic=selectQuestions({topic:'removal',size:100});
 assert.equal(topic.length,18);assert.ok(topic.every(id=>QUESTIONS.find(q=>q.id===id).topic==='removal'));
 const terms=selectQuestions({termsOnly:true,size:100});
 assert.equal(terms.length,16);assert.ok(terms.every(id=>KEY_TERMS.includes(id)));
 const missed=[QUESTIONS[1].id,QUESTIONS[22].id,QUESTIONS[88].id];
 assert.deepEqual(new Set(selectQuestions({missed,size:50})),new Set(missed));
 assert.deepEqual(selectQuestions({missed:['unknown']}),[]);
 assert.equal(selectQuestions({size:1000}).length,90);
});
test('Context does not turn disputed source anecdotes into correct quiz answers',()=>{
 const all=QUESTIONS.map(q=>q.choices[q.answer]+' '+q.why).join(' ');
 assert.ok(!all.includes('E. C. Booz'));
 assert.ok(!all.includes('25 percent'));
 assert.ok(!all.includes('50 percent'));
 assert.ok(all.includes('alleged, not conclusively proven'));
 assert.ok(all.includes('Van Buren in 1838–1839'));
});
