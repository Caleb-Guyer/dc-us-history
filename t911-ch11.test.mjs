import test from 'node:test';
import assert from 'node:assert/strict';
import {CH11_QUESTIONS as questions,CH11_TERMS as terms,CH11_SECTIONS as sections} from './t911-ch11.mjs';

test('Chapter 11 has sixty unique sourced questions, all five sections and balanced answers',()=>{
 assert.equal(questions.length,60);assert.equal(new Set(questions.map(q=>q.id)).size,60);
 assert.equal(new Set(questions.map(q=>q.prompt)).size,60);
 assert.deepEqual([0,1,2,3].map(i=>questions.filter(q=>q.answer===i).length),[15,15,15,15]);
 assert.deepEqual([...new Set(questions.map(q=>q.section))],sections.map(s=>s.id));
 for(const q of questions){assert.equal(q.chapter,11);assert.equal(q.choices.length,4);assert.equal(new Set(q.choices).size,4);assert.ok(q.answer>=0&&q.answer<4);assert.ok(q.why.length>60);assert.match(q.source,/Edited chapter 11 · 11\.[1-5] · P\d/);assert.ok(!JSON.stringify(q).includes('\uFFFD'));}
});
test('the seventeen actual bold body terms map one-to-one to canonical recall questions',()=>{
 const names=['Northwest Passage','Corps of Discovery','filibuster','Tallmadge Amendment','Missouri Compromise','empresario','Tejanos','alcalde','Californios','Mexican Cession','forty-niners','Wilmot Proviso','Liberty Party','Barnburners','Free-Soil Party','Slave Power','Compromise of 1850'];
 assert.deepEqual(terms.map(t=>t.name.toLowerCase()),names.map(n=>n.toLowerCase()));assert.equal(new Set(terms.map(t=>t.id)).size,17);
 assert.equal(questions.filter(q=>q.term).length,17);
 for(const t of terms){const q=questions.find(q=>q.id===t.questionId);assert.equal(q.term,t.id);assert.equal(questions.filter(q=>q.term===t.id).length,1);for(const key of ['definition','example','contrast','source'])assert.ok(t[key].length>20);}
});
test('historical qualifications prevent important textbook simplifications becoming false answers',()=>{
 const term=name=>terms.find(t=>t.name===name);
 assert.match(term('Tallmadge Amendment').definition,/gradually/);
 assert.match(term('Tallmadge Amendment').contrast,/not enacted/);
 assert.match(term('Missouri Compromise').definition,/except Missouri/);
 assert.match(term('forty-niners').contrast,/1848/);
 assert.match(term('Wilmot Proviso').contrast,/failed in the Senate/);
 assert.match(term('Free-Soil Party').contrast,/not mean all/);
 assert.match(term('Slave Power').contrast,/political accusation/);
 assert.match(term('Compromise of 1850').contrast,/did not abolish slavery/);
 const border=questions.find(q=>q.prompt.includes('American soil'));
 assert.match(border.choices[border.answer],/both governments claimed/);
 const dc=questions.find(q=>q.prompt.startsWith('What changed in Washington'));
 assert.match(dc.choices[dc.answer],/slavery itself remained legal/);
});
