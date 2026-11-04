import test from 'node:test';
import assert from 'node:assert/strict';
import {CH9_QUESTIONS,CH9_TERMS,CH9_SECTIONS} from './t911-ch9.mjs';

test('Chapter 9 practice covers all four sections with sixty distinct sourced questions and balanced answer positions',()=>{
 assert.equal(CH9_QUESTIONS.length,60);
 assert.equal(new Set(CH9_QUESTIONS.map(q=>q.id)).size,60);
 assert.equal(new Set(CH9_QUESTIONS.map(q=>q.prompt)).size,60);
 assert.deepEqual(CH9_SECTIONS.map(s=>s.id),['9.1','9.2','9.3','9.4']);
 for(const section of CH9_SECTIONS)assert.ok(CH9_QUESTIONS.filter(q=>q.section===section.id).length>=10);
 for(const q of CH9_QUESTIONS){assert.equal(q.chapter,9);assert.equal(q.choices.length,4);assert.equal(new Set(q.choices.map(c=>c.trim().toLowerCase())).size,4);assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4);assert.ok(q.why.length>40);assert.match(q.source,/^Edited chapter 9 · 9\.[1-4] · P\d{3}/);assert.ok(CH9_SECTIONS.some(s=>s.id===q.section));}
 for(let i=0;i<4;i++)assert.equal(CH9_QUESTIONS.filter(q=>q.answer===i).length,15);
});

test('all twelve verified bold Chapter 9 terms have a definition, example, distinction and one canonical recall question',()=>{
 assert.deepEqual(CH9_TERMS.map(t=>t.name),['Artisans','Putting-out system','Deskilling','Labor theory of value','Working Men’s Party','Land offices','Specie','Machine tools','Cumberland Road','Erie Canal','Mohawk and Hudson Railroad','Free moral agency']);
 assert.equal(new Set(CH9_TERMS.map(t=>t.id)).size,12);
 assert.equal(CH9_QUESTIONS.filter(q=>q.term).length,12);
 for(const t of CH9_TERMS){assert.equal(t.chapter,9);assert.ok(t.definition.length>35&&t.example.length>35&&t.contrast.length>35);assert.match(t.source,/Edited chapter 9/);const linked=CH9_QUESTIONS.filter(q=>q.term===t.id);assert.equal(linked.length,1);assert.equal(linked[0].id,t.questionId);}
});

test('Chapter 9 content does not turn inaccurate textbook firsts into correct answers',()=>{
 const byId=new Map(CH9_QUESTIONS.map(q=>[q.id,q]));
 const fulton=byId.get('t911-c9-36');assert.match(fulton.why,/commercially successful/);assert.match(fulton.why,/did not invent the steam engine/);
 const rail=byId.get('t911-c9-46');assert.match(rail.choices[rail.answer],/Albany and Schenectady/);assert.match(rail.why,/not depend on calling it the nation’s first/);
 assert.match(byId.get('t911-c9-29').prompt,/1816/);
 const goods=byId.get('t911-c9-22');assert.match(goods.why,/did not eliminate poverty/);
 const regions=byId.get('t911-c9-23');assert.match(regions.choices[regions.answer],/enslaved workers/);
});
