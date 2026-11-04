import test from 'node:test';
import assert from 'node:assert/strict';
import {CAMPAIGNS,GAME_VERSION} from './t911-games-data.mjs';
import {BY_ID} from './t911-data.mjs';

test('short campaigns connect every chapter section to teaching scenes or six sourced recall questions',()=>{
 assert.equal(GAME_VERSION,'7.2.0');
 const ids=[];
 for(const chapter of [9,11]){
  const c=CAMPAIGNS[chapter];assert.equal(c.chapter,chapter);assert.equal(c.missions.length,3);assert.equal(c.debrief.length,6);assert.equal(new Set(c.debrief).size,6);
  const covered=new Set();
  for(const id of c.debrief){const q=BY_ID.get(id);assert.ok(q,`Missing debrief question ${id}`);assert.equal(q.chapter,chapter);covered.add(q.section);}
  for(const m of c.missions){ids.push(m.id);for(const s of m.sections)covered.add(s);assert.equal(m.opening.length,3);assert.equal(m.ending.length,2);assert.equal(m.decisions.length,2);assert.ok(m.duration>=25&&m.duration<=45);assert.ok(m.target>=6&&m.target<=16);assert.ok(m.lesson.length>70);assert.ok(m.controls.length>40);for(const b of [...m.opening,...m.ending]){assert.ok(b.text.length>20&&b.text.length<240);assert.ok(['wide','close','action','map'].includes(b.shot));assert.ok(['hero','other','world'].includes(b.focus));assert.ok(b.duration>=3&&b.duration<=5);}for(const d of m.decisions){assert.ok(d.at>.1&&d.at<.9);assert.equal(d.choices.length,3);assert.equal(new Set(d.choices).size,3);assert.ok(Number.isInteger(d.answer)&&d.answer>=0&&d.answer<3);assert.ok(d.why.length>65);}}
  assert.deepEqual([...covered].sort(),Array.from({length:chapter===9?4:5},(_,i)=>`${chapter}.${i+1}`));
  assert.ok(c.missions.reduce((n,m)=>n+m.duration+[...m.opening,...m.ending].reduce((s,b)=>s+b.duration,0),0)<210,'Action and scenes stay short before debrief');
  assert.match(c.description,/fictional/i);assert.match(c.sourceNotes.join(' '),/not.*quotation/i);
 }
 assert.equal(new Set(ids).size,6);assert.equal(new Set(Object.values(CAMPAIGNS).flatMap(c=>c.missions.map(m=>m.mode))).size,6);
});

test('campaign history keeps different events and consequences distinct',()=>{
 const c9=CAMPAIGNS[9],c11=CAMPAIGNS[11];
 const text=c=>JSON.stringify(c);
 assert.match(text(c9),/enslaved people/);assert.match(text(c9),/1825/);assert.match(text(c9),/working families/);assert.match(text(c9),/not.*America’s first steam railroad/);
 assert.match(text(c11),/thirteen-day siege/);assert.match(text(c11),/21 April 1836/);assert.match(text(c11),/1845/);assert.match(text(c11),/slavery there remains/);assert.match(text(c11),/fugitive-slave law/);assert.match(text(c11),/no continuous inland waterway/i);
 assert.ok(c11.missions.find(m=>m.mode==='dispatch').controls.includes('no kill points'));
 const print=c11.missions.find(m=>m.mode==='press');
 assert.match(print.decisions[1].choices[print.decisions[1].answer],/Wilmot proposed/);assert.match(print.decisions[1].why,/failed to become law/);
});
