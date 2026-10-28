import test from 'node:test';
import assert from 'node:assert/strict';
import {TERMS,TERM_BY_ID,TERM_BY_QUESTION} from './c10-terms.mjs';
import {TERM_NAMES} from './c10-data.mjs';
import {QUESTIONS,KEY_TERMS} from './c10-questions.mjs';

test('the sixteen actual bold article terms appear once in article order',()=>{
 assert.equal(TERMS.length,16);
 assert.deepEqual(TERMS.map(t=>t.name),TERM_NAMES);
 assert.equal(TERM_BY_ID.size,16);
 assert.equal(new Set(TERMS.map(t=>t.definition)).size,16);
 for(const t of TERMS){
  assert.match(t.id,/^[a-z]+(?:-[a-z]+)*$/);
  assert.ok(t.definition.length>=40&&t.definition.length<250,t.name+' concise meaning');
  assert.ok(t.example.length>=40&&t.example.length<250,t.name+' concrete example');
  assert.ok(t.contrast.length>=40&&t.contrast.length<250,t.name+' useful distinction');
  assert.match(t.source,/10\.[1-5]/);
  assert.equal(TERM_BY_ID.get(t.id),t);
 }
});

test('every review card maps to its own canonical key-term recall question',()=>{
 assert.equal(TERM_BY_QUESTION.size,16);
 assert.deepEqual(new Set(TERMS.map(t=>t.questionId)),new Set(KEY_TERMS));
 for(const t of TERMS){
  const q=QUESTIONS.find(q=>q.id===t.questionId);
  assert.equal(q?.term,true,t.name);
  assert.equal(TERM_BY_QUESTION.get(q.id),t);
 }
});

test('review meanings preserve the chapter’s important qualifications',()=>{
 const get=id=>TERM_BY_ID.get(id);
 assert.match(get('universal-manhood-suffrage').definition,/White men/);
 assert.match(get('universal-manhood-suffrage').contrast,/exclusions/);
 assert.match(get('corrupt-bargain').contrast,/not proved/);
 assert.match(get('nullification').definition,/claim/);
 assert.match(get('five-civilized-tribes').contrast,/not an objective ranking/);
 assert.match(get('trail-of-tears').definition,/1838–1839/);
 assert.match(get('trail-of-tears').contrast,/Van Buren/);
 assert.match(get('monster-bank').contrast,/1836/);
 assert.match(get('log-cabin-campaign').contrast,/privileged/);
});
