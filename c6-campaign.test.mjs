import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {LEVELS,SCENES,LINES,continueProgress} from './c6-data.mjs';
import {fresh,tick,currentGoal,snapshot,restore} from './c6-sim.mjs';
import {cleanRecord,carryOutcome} from './c6-record.mjs';
const step=(s,input,time)=>{const events=[];for(let n=0;n<time*40;n++)events.push(...tick(s,input,.025));return events;};

test('the complete story graph reaches all 62 playable sections in order and the final door',()=>{
 const opening={release:'gate',night:'lexington',lexington:'concordIntro',concord:'ending'};
 const path=[],seen=new Set();let level='release',last='';
 while(level!=='complete'){
  assert.ok(LEVELS[level],level);assert.ok(!seen.has(level),'No story loop at '+level);seen.add(level);path.push(level);
  let next=LEVELS[level].after||opening[level];assert.ok(next,'Finish transition for '+level);
  // finishLevel starts its exit scene; finishScene then prefers a playable level
  // when a scene and level share a name (for example Lexington).
  const scenes=new Set();do{assert.ok(SCENES[next],next);assert.ok(!scenes.has(next),'Scene loop at '+next);scenes.add(next);last=next;next=SCENES[next].after;}while(SCENES[next]&&!LEVELS[next]);
  assert.notEqual(next,'checkpoint','A completed level cannot restart at its old checkpoint');level=next;
 }
 assert.deepEqual(path,Object.keys(LEVELS));assert.equal(path.length,62);assert.equal(last,'homeDoor');
});

test('the opening requires all three cargo/history interactions and preserves support on reload',()=>{
 let s=fresh('release');const ids=[];step(s,{interact:true},1.4);assert.equal(s.stage,0);
 for(let i=0;i<5;i++){const goal=currentGoal(s);s.player.x=goal.x;s.player.z=goal.z;ids.push(...step(s,{interact:true},1.4).filter(e=>e.type==='voice').map(e=>e.id));assert.equal(s.stage,i+1);if(!s.finished){s=restore(snapshot(s));assert.ok(s);assert.equal(s.carrying,true);}}
 assert.equal(s.finished,true);assert.deepEqual(ids,['help','prologue.inspect','prologue.trade','prologue.closed','prologue.gage','prologue.authority','prologue.base']);
 for(const id of ids)assert.ok(LINES.find(l=>l.id===id));
});

test('every published installment completion migrates forward without changing its local records',()=>{
 const routes={north:'hillIntro',hill:'promiseIntro',promise:'liftIntro',lift:'paperIntro',paper:'retreatIntro',retreat:'crossingIntro',crossing:'philadelphiaIntro',philadelphia:'albanyIntro',albany:'winterIntro',winter:'widerIntro',wider:'southIntro',south:'inlandIntro',inland:'chaseIntro',chase:'priceIntro',price:'seaIntro',sea:'siegeIntro',siege:'departIntro',departure:'homeIntro'};
 const endings={north:'northEnding',hill:'hillLegacy',promise:'promiseCoda',lift:'liftHome',paper:'paperCoda',retreat:'retreatEnding',crossing:'crossingEnding',philadelphia:'philadelphiaEnding',albany:'albanySurrender',winter:'winterAlliance',wider:'widerEnding',south:'southEnding',inland:'inlandEnding',chase:'chaseEnding',price:'priceEnding',sea:'seaEnding',siege:'siegeHistory',departure:'departHistory'};
 for(const [part,target]of Object.entries(routes)){const raw={complete:true,completedPart:part,seen:[endings[part]],checkpoint:null,outcomes:{princeton:{completed:true,rescues:1}},story:{wardFate:'dead',wardBuried:true}};const before=structuredClone(raw),next=continueProgress(raw);assert.equal(next.scene,target,part);assert.equal(next.complete,false);assert.deepEqual(raw,before);assert.equal(next.outcomes,raw.outcomes);assert.ok(SCENES[target]);const rec=cleanRecord(next,LEVELS,SCENES);const home=carryOutcome(fresh('homepress'),rec);assert.equal(home.home.nathan,true);assert.equal(home.home.daniel,false);assert.equal(home.home.samuel,false);}
});

test('all 54 paragraph mappings use real campaign lines, including mandatory corrections',()=>{
 const coverage=JSON.parse(fs.readFileSync(new URL('./C6-COVERAGE.json',import.meta.url),'utf8'));
 assert.equal(coverage.records.length,54);assert.equal(new Set(coverage.records.map(r=>r.paragraphId)).size,54);
 for(const r of coverage.records){assert.ok(r.lineIds.length>0,r.paragraphId);for(const id of r.lineIds)assert.ok(LINES.find(l=>l.id===id),r.paragraphId+'/'+id);}
 for(const id of ['home.memory.1','home.oaths.1','home.will.0','home.will.1','home.sources.0','home.sources.1'])assert.ok(Object.values(SCENES).some(s=>s.lines.includes(id)),id);
 const early=coverage.records.filter(r=>['P005','P006','P007','P008'].includes(r.paragraphId));assert.ok(early.every(r=>r.lineIds.some(id=>id.startsWith('prologue.'))));
});
