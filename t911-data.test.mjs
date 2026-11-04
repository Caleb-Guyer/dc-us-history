import test from 'node:test';
import assert from 'node:assert/strict';
import {QUESTIONS,TERMS,SECTIONS,CHAPTERS} from './t911-data.mjs';
test('the test bank has 210 distinct accountable questions spanning all three supplied chapters',()=>{
 assert.equal(QUESTIONS.length,210);assert.equal(new Set(QUESTIONS.map(q=>q.id)).size,210);assert.equal(new Set(QUESTIONS.map(q=>q.prompt)).size,210);
 for(const q of QUESTIONS){assert.ok([9,10,11].includes(q.chapter));assert.ok(SECTIONS.some(s=>s.id===q.section&&s.chapter===q.chapter));assert.equal(q.choices.length,4);assert.equal(new Set(q.choices).size,4);assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4);assert.ok(q.why.length>30);assert.ok(q.source.includes('P'));}
 for(const c of CHAPTERS)assert.equal(QUESTIONS.filter(q=>q.chapter===c.id).length,c.id===10?90:60);
 for(const s of SECTIONS)assert.ok(QUESTIONS.filter(q=>q.section===s.id).length>=5);
});
test('every bold term has a definition, an example and one canonical term question',()=>{
 assert.equal(TERMS.length,45);assert.equal(new Set(TERMS.map(t=>t.id)).size,45);
 for(const t of TERMS){assert.ok(t.name&&t.definition&&t.example&&t.contrast&&t.source);const q=QUESTIONS.find(q=>q.id===t.questionId);assert.equal(q?.term,t.id);assert.equal(q.chapter,t.chapter);assert.equal(q.section,t.section);assert.equal(QUESTIONS.filter(q=>q.term===t.id).length,1);}
 assert.equal(TERMS.filter(t=>t.chapter===9).length,12);assert.equal(TERMS.filter(t=>t.chapter===10).length,16);assert.equal(TERMS.filter(t=>t.chapter===11).length,17);
});
