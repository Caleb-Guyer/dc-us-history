import test from 'node:test';
import assert from 'node:assert/strict';
import {createRun,stepRun,chooseGate,gate,summary} from './t911-games-sim.mjs';
import {CAMPAIGNS} from './t911-games-data.mjs';

const mission=(mode,more={})=>({id:`test-${mode}`,mode,target:6,duration:36,decisions:[],...more});
const advance=(s,seconds,input={})=>{for(let t=0;t<seconds&&s.status==='playing';t+=1/60)stepRun(s,input,1/60);return s;};
function pilot(s){
 const e=s.entities.filter(x=>x.pickup&&x.x>s.player.x-100).sort((a,b)=>a.x-b.x)[0];
 const dy=e?e.y-s.player.y:280-s.player.y;
 return {up:dy<-8,down:dy>8,action:s.mission.mode==='factory'||s.time%1.9<.03};
}
test('all modes have normal horizontal and vertical movement',()=>{
 for(const mode of ['factory','canal','courier','river','dispatch','press']){
  const s=createRun(mission(mode));const {x,y}=s.player;
  advance(s,.2,{up:true,right:true});assert.ok(s.player.x>x);assert.ok(s.player.y<y);
  advance(s,.4,{down:true,left:true});assert.ok(s.player.x<x);assert.ok(s.player.y>y);
 }
});
test('diagonal movement has the same total speed as a straight move',()=>{
 const a=createRun(mission('river')),b=createRun(mission('river'));stepRun(a,{right:true},.2);stepRun(b,{right:true,up:true},.2);
 assert.ok(Math.abs((a.player.x-230)-Math.hypot(b.player.x-230,b.player.y-280))<1e-7);
});
test('seeded streams are repeatable and changing the seed changes their speed',()=>{
 const a=createRun(mission('canal'),{seed:71}),b=createRun(mission('canal'),{seed:71}),c=createRun(mission('canal'),{seed:72});
 advance(a,5);advance(b,5);advance(c,5);assert.deepEqual(a,b);assert.notDeepEqual(a.entities,c.entities);
});
test('equivalent frame partitions preserve movement, spawning and mission time',()=>{
 const a=createRun(mission('canal')),b=createRun(mission('canal'));
 for(let n=0;n<120;n++)stepRun(a,{up:true},1/60);
 for(let n=0;n<40;n++)stepRun(b,{up:true},.05);
 assert.ok(Math.abs(a.time-b.time)<1e-8);assert.ok(Math.abs(a.player.y-b.player.y)<1e-8);assert.equal(a.spawnCount,b.spawnCount);
 assert.ok(Math.abs(a.entities[0].x-b.entities[0].x)<1e-7);
});
test('factory processing needs action in the forgiving work window',()=>{
 const s=createRun(mission('factory'));s.invulnerable=0;
 s.entities.push({id:99,kind:'spool',x:285,y:280,r:25,vx:0,pickup:true,telegraph:0});
 stepRun(s,{},.1);assert.equal(s.collected,0);
 stepRun(s,{action:true},.1);assert.equal(s.collected,1);assert.equal(s.combo,1);
 stepRun(s,{action:true},.1);assert.equal(s.collected,1);
 s.entities.push({id:100,kind:'spool',x:285,y:420,r:25,vx:0,pickup:true,telegraph:0});
 advance(s,.5,{action:true});assert.equal(s.collected,1,'another station must be reached');
});
test('boats and couriers collect objects by reaching them without a fire button',()=>{
 for(const mode of ['canal','river','courier','dispatch','press']){
  const s=createRun(mission(mode));s.entities.push({id:99,kind:'chart',x:250,y:280,r:25,vx:0,pickup:true,telegraph:0});
  stepRun(s,{},1/60);assert.equal(s.collected,1);assert.ok(s.score>0);
 }
});
test('one collision grants invulnerability against a pileup',()=>{
 const s=createRun(mission('river'));s.invulnerable=0;
 for(let id=100;id<104;id++)s.entities.push({id,kind:'rock',x:230,y:280,r:28,vx:0,pickup:false,telegraph:0});
 stepRun(s,{},1/60);assert.equal(s.health,80);assert.equal(s.hits,1);
});
test('dash has a cooldown and a held key does not fire unlimited dashes',()=>{
 const s=createRun(mission('courier'));stepRun(s,{action:true},1/60);assert.ok(s.player.dash>0);assert.equal(s.actionCount,1);
 advance(s,2,{action:true});assert.equal(s.actionCount,1);stepRun(s,{},1/60);stepRun(s,{action:true},1/60);assert.equal(s.actionCount,2);
});
test('dispatch cover protects against a volley and damage works after it is released',()=>{
 const s=createRun(mission('dispatch'));s.invulnerable=0;
 s.entities.push({id:98,kind:'volley',x:230,y:280,r:28,vx:0,pickup:false,telegraph:0});
 stepRun(s,{duck:true},1/60);assert.equal(s.health,100);
 s.entities.push({id:99,kind:'volley',x:230,y:s.player.y,r:28,vx:0,pickup:false,telegraph:0});
 stepRun(s,{},1/60);assert.equal(s.health,80);
});
test('context decisions pause the action and are answered only once',()=>{
 const s=createRun(mission('river',{decisions:[{at:.1,prompt:'Which route?',choices:['River only','Overland too','Sea only'],answer:1,why:'No all-water passage.'}]}));
 advance(s,4);assert.equal(s.status,'gate');assert.equal(gate(s).answer,1);const time=s.time;
 stepRun(s,{right:true},.25);assert.equal(s.time,time);chooseGate(s,7);assert.equal(s.status,'gate');
 chooseGate(s,1);assert.equal(s.status,'playing');assert.equal(s.decisions.length,1);const score=s.score;
 chooseGate(s,1);assert.equal(s.decisions.length,1);assert.equal(s.score,score);advance(s,.2);assert.equal(s.status,'playing');
});
test('a wrong learning decision preserves the run and supplies recovery protection',()=>{
 const s=createRun(mission('river',{decisions:[{at:0,choices:['A','B'],answer:1}]}));stepRun(s,{},1/60);chooseGate(s,0);
 assert.equal(s.status,'playing');assert.equal(s.health,100);assert.ok(s.invulnerable>0);assert.deepEqual(s.decisions,[{index:0,option:0,correct:false}]);
});
test('zero health and unmet deadline produce retryable losses; terminal runs freeze',()=>{
 const s=createRun(mission('river'));s.health=20;s.invulnerable=0;s.entities.push({id:99,kind:'rock',x:230,y:280,r:28,vx:0,pickup:false,telegraph:0});stepRun(s,{},1/60);assert.equal(s.status,'lost');
 const frozen=structuredClone(s);stepRun(s,{action:true},.25);assert.deepEqual(s,frozen);
 const timed=createRun(mission('factory',{duration:18,target:99}));advance(timed,20);assert.equal(timed.status,'lost');assert.match(timed.reason,/Collected/);
});
test('all six objectives are achievable through ordinary controls and both decisions',()=>{
 for(const mode of ['factory','canal','courier','river','dispatch','press']){
  const s=createRun(mission(mode,{decisions:[{at:.3,choices:['A','B'],answer:0},{at:.65,choices:['A','B'],answer:1}]}),{seed:19});
  for(let n=0;n<60*42&&!['won','lost'].includes(s.status);n++){
   if(s.status==='gate')chooseGate(s,gate(s).answer);else stepRun(s,pilot(s),1/60);
  }
  assert.equal(s.status,'won',`${mode}: ${s.reason}; ${s.collected} collected, ${s.health} health`);
  const out=summary(s);assert.equal(out.won,true);assert.equal(out.decisionsCorrect,2);assert.equal(out.decisionsTotal,2);assert.ok(out.seconds<=36.1);assert.ok(out.collected>=6);
 }
});
test('simulation ignores invalid time and caps a background frame',()=>{
 const s=createRun(mission('press'));stepRun(s,{},NaN);stepRun(s,{},-2);assert.equal(s.time,0);stepRun(s,{},999);assert.ok(s.time<=.251);
});
test('all authored mission targets are reachable over several seeds without shortcuts',()=>{
 for(const campaign of Object.values(CAMPAIGNS))for(const m of campaign.missions)for(const seed of [1,19,73,404]){
  const s=createRun(m,{seed});let input={};
  for(let frame=0;frame<60*(m.duration+2)&&!['won','lost'].includes(s.status);frame++){
   if(s.status==='gate'){chooseGate(s,gate(s).answer);continue;}
   // Four input updates per second approximate ordinary human reaction time.
   // The controller reads only visible entities; no coordinates or credit change.
   if(frame%15===0)input=pilot(s);
   stepRun(s,input,1/60);
  }
  assert.equal(s.status,'won',`${m.id}, seed ${seed}: ${s.reason} (${s.collected}/${m.target})`);
  assert.ok(s.collected>=m.target);assert.equal(s.decisions.length,m.decisions.length);assert.ok(s.health>0);assert.ok(s.paths>=2);assert.equal(s.paths,s.visitedPickupLanes.length);assert.equal(summary(s).paths,s.paths);
 }
});
test('standing still cannot complete any authored campaign mission',()=>{
 for(const campaign of Object.values(CAMPAIGNS))for(const m of campaign.missions){
  const s=createRun(m,{seed:17});
  for(let frame=0;frame<60*(m.duration+2)&&!['won','lost'].includes(s.status);frame++){
   if(s.status==='gate')chooseGate(s,gate(s).answer);else stepRun(s,{action:m.mode==='factory'},1/60);
  }
  assert.equal(s.status,'lost',`${m.id}: idle play must not win`);assert.ok(s.paths<=1);assert.ok(s.reason.includes('paths')||s.reason.includes('stations')||s.reason.includes('Collected'));
 }
});
test('path credit is earned by collecting distinct lanes rather than moving through them',()=>{
 const s=createRun(mission('canal'));advance(s,.4,{up:true});assert.equal(s.paths,0);
 const add=(id,lane)=>s.entities.push({id,kind:'crate',x:s.player.x,y:s.player.y,r:25,vx:0,lane,pickup:true,telegraph:0});
 add(101,0);stepRun(s,{},1/60);assert.deepEqual(s.visitedPickupLanes,[0]);assert.equal(s.paths,1);
 add(102,0);stepRun(s,{},1/60);assert.equal(s.paths,1);
 add(103,1);stepRun(s,{},1/60);assert.deepEqual(s.visitedPickupLanes,[0,1]);assert.equal(s.paths,2);
});
