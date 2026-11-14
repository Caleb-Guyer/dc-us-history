import test from 'node:test';
import assert from 'node:assert/strict';
import {VERSION,SECTIONS,TERMS,QUESTIONS,BY_ID,TERM_BY_ID,QUIZ_SHAPE} from './c13-data.mjs';

test('Chapter 13 includes exactly its fourteen bold body terms, without headings',()=>{
 assert.equal(VERSION,'8.3.0');
 assert.deepEqual(TERMS.map(t=>t.name),['Second Great Awakening','millennialism','transcendentalism','pietistic','Shakers','Mormons','temperance','teetotalism','Phrenology','colonization','abolitionist','moral suasion','immediatism','Seneca Falls']);
 assert.equal(new Set(TERMS.map(t=>t.id)).size,14);
 for(const t of TERMS){assert.equal(TERM_BY_ID.get(t.id),t);for(const key of ['definition','example','contrast'])assert.ok(t[key].length>35,`${t.id}: ${key}`);assert.ok(SECTIONS.some(s=>s.id===t.section));}
});
test('104 original multiple-choice questions have valid answers, feedback and source accountability',()=>{
 assert.equal(QUESTIONS.length,104);assert.equal(new Set(QUESTIONS.map(q=>q.id)).size,104);assert.equal(new Set(QUESTIONS.map(q=>q.prompt)).size,104);
 assert.ok(BY_ID instanceof Map);
 const answerCounts=[0,0,0,0];
 for(const q of QUESTIONS){assert.equal(BY_ID.get(q.id),q);assert.equal(q.choices.length,4);assert.equal(new Set(q.choices).size,4);assert.ok(q.choices.every(c=>typeof c==='string'&&c.length>2));assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4);answerCounts[q.answer]++;assert.ok(q.explanation.length>50);assert.equal(q.why,q.explanation);assert.ok(['term','topic'].includes(q.kind));assert.ok(SECTIONS.some(s=>s.id===q.section));}
 assert.deepEqual(answerCounts,[26,26,26,26]);
});
test('every bold term has definition and application questions; all sections have ample topic practice',()=>{
 assert.equal(QUESTIONS.filter(q=>q.kind==='term').length,28);
 assert.equal(QUESTIONS.filter(q=>q.kind==='topic').length,76);
 for(const t of TERMS){const qs=QUESTIONS.filter(q=>q.termId===t.id);assert.equal(qs.length,2);assert.deepEqual(t.questionIds,qs.map(q=>q.id));assert.equal(t.questionId,qs[0].id);assert.ok(qs.every(q=>q.section===t.section&&q.kind==='term'));}
 assert.deepEqual(SECTIONS.map(s=>QUESTIONS.filter(q=>q.section===s.id&&q.kind==='topic').length),[17,12,16,21,10]);
 assert.deepEqual(QUIZ_SHAPE,{total:15,terms:3,topics:12,basePoints:25});
});
test('source references stay within the supplied reading and cite substantive paragraphs',()=>{
 const headings=new Set(['P001','P002','P014','P025','P037','P055']);
 for(const item of [...TERMS,...QUESTIONS]){assert.ok(Array.isArray(item.source)&&item.source.length>0);for(const ref of item.source){assert.match(ref,/^P\d{3}$/);assert.ok(Number(ref.slice(1))>=3&&Number(ref.slice(1))<=59);assert.ok(!headings.has(ref));}}
 const cited=new Set(QUESTIONS.flatMap(q=>q.source));
 for(let p=1;p<=59;p++){const ref=`P${String(p).padStart(3,'0')}`;if(!headings.has(ref))assert.ok(cited.has(ref),`Unreviewed body paragraph: ${ref}`);}
});
test('high-risk distinctions are explicitly taught rather than presented as valid harmful claims',()=>{
 assert.match(TERM_BY_ID.get('phrenology').definition,/discredited/);
 assert.match(TERM_BY_ID.get('phrenology').contrast,/pseudoscience/);
 assert.match(TERM_BY_ID.get('temperance').contrast,/moderation/);
 assert.match(TERM_BY_ID.get('teetotalism').definition,/including beer and wine/);
 assert.match(TERM_BY_ID.get('colonization').contrast,/racist/);
 assert.match(TERM_BY_ID.get('immediatism').contrast,/does not mean every abolitionist supported violent/);
 const later=QUESTIONS.find(q=>q.prompt.includes('1873'));
 assert.match(later.choices[later.answer],/after the antebellum/);
 const war=QUESTIONS.find(q=>q.prompt.includes('Thoreau'));
 assert.match(war.choices[war.answer],/Slavery and the Mexican-American War/);
});
