import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,tick,currentGoal,restore,snapshot,distance,blocked,collide} from './c6-sim.mjs';
import {hillCanVolley,hillSupply} from './c6-hill.mjs';
import {continueProgress,SCENES} from './c6-data.mjs';
const step=(s,input={},seconds=1)=>{const events=[];for(let i=0;i<seconds*40;i++)events.push(...tick(s,input,.025));return events;};
function use(s){const g=currentGoal(s);s.player.x=g.x;s.player.z=g.z;return step(s,{interact:true},2.1);}
function prepare(side='left'){const s=fresh('breeds');use(s);s.player.x=side==='right'?12:-12;use(s);use(s);assert.equal(s.stage,3);return s;}
function fight(s,limit=160){const events=[];s.player.x=0;s.player.z=3;
 for(let i=0;i<limit*40&&!s.failed&&[3,5,6].includes(s.stage);i++){
  const target=s.enemies.filter(e=>e.hp>0&&e.z>-30).sort((a,b)=>distance(a,s.player)-distance(b,s.player))[0];
  if(target){s.player.yaw=Math.atan2(-(target.x-s.player.x),-(target.z-s.player.z));s.player.pitch=Math.atan2(1.15-1.7,distance(target,s.player));}
  const shoot=s.loaded&&!!target,order=hillCanVolley(s)&&s.enemies.some(e=>e.hp>0&&e.z>-31);
  events.push(...tick(s,{fire:shoot,aim:true,reload:!s.loaded,crouch:!shoot,interact:order},.025));
 }
 return events;
}
test('three assaults lead to forced withdrawal, two rescues and Ward extraction',()=>{
 let s=prepare();fight(s);assert.equal(s.failed,false);assert.equal(s.stage,4);assert.ok(s.shotsFired>0);assert.ok(s.hill.signalCount>0);
 use(s);assert.equal(s.stage,5);const events=fight(s);assert.equal(s.failed,false);assert.equal(s.stage,7);assert.equal(s.hill.phase,3);assert.equal(s.hill.retreat,true);assert.equal(s.finished,false);assert.ok(events.some(e=>e.type==='hillBreak'));assert.equal(s.hill.gunCrew,false);
 s=restore(snapshot(s));assert.equal(s.stage,7);use(s);assert.equal(s.carrying,true);assert.equal(s.armed,false);use(s);assert.equal(s.hill.rescues,1);use(s);use(s);assert.equal(s.hill.rescues,2);use(s);assert.equal(s.hill.wardCalled,true);use(s);assert.equal(s.finished,false);step(s,{interact:true},7);assert.equal(s.finished,true);assert.ok(s.hill.wardProgress>=.85);
});
test('both ammunition positions work and supplies cannot be farmed across saves',()=>{
 for(const side of ['left','right']){let s=prepare(side);assert.equal(s.hill.reserve,side);s.player.x=side==='right'?12:-12;s.player.z=9;s.player.health=50;assert.equal(hillSupply(s),true);step(s,{interact:true},.025);assert.equal(s.hill.reserveUsed,true);assert.equal(s.ammo,15);assert.equal(s.player.health,70);s=restore(snapshot(s));step(s,{interact:true},.025);assert.equal(s.ammo,15);assert.equal(hillSupply(s),false);}
});
test('abandoning the firing line loses the section and never clears an assault',()=>{
 const s=prepare(),before=s.hill.clock;s.player.x=0;s.player.z=45;step(s,{},40);assert.equal(s.failed,true);assert.equal(s.stage,3);assert.equal(s.finished,false);assert.equal(s.hill.clock,before);
});
test('cover blocks musket fire, shells warn before hitting, rear is sheltered',()=>{
 assert.equal(blocked('breeds',{x:0,z:-20,y:1.45},{x:0,z:3,y:1.02}),true);assert.equal(blocked('breeds',{x:0,z:-20,y:1.45},{x:0,z:3,y:1.7}),false);
 const s=prepare();s.enemies=[];s.hill.phase=3;s.hill.teamAmmo=100;s.player.x=9;s.player.z=4;const warning=step(s,{crouch:true},13.1);assert.ok(warning.some(e=>e.type==='shellWarning'));assert.equal(s.player.health,100);assert.ok(s.hill.shellIn>0);step(s,{crouch:true},3);assert.equal(s.player.health,74);
 const safe=prepare();safe.hill.phase=3;safe.hill.teamAmmo=100;safe.enemies=[];step(safe,{},13.1);safe.player.z=43;step(safe,{},3);assert.equal(safe.player.health,100);
});
test('third assault cannot become an alternative victory by killing every attacker',()=>{
 const s=prepare();s.stage=6;s.hill.phase=3;s.hill.clock=0;s.hill.teamAmmo=24;s.enemies=[];const events=step(s,{crouch:true},20);assert.equal(s.stage,7);assert.equal(s.finished,false);assert.ok(events.some(e=>e.type==='hillBreak'));
});
test('new save migration and corrupt hill state are handled without erasing progress',()=>{
 const old={complete:true,seen:['ending','northEnding'],prefs:{muted:true},checkpoint:null,scene:null};const next=continueProgress(old);assert.equal(next.scene,'hillIntro');assert.equal(next.complete,false);assert.equal(old.complete,true);
 const done={...old,seen:[...old.seen,'hillLegacy']};assert.equal(continueProgress(done),done);assert.equal(SCENES.northEnding.after,'hillIntro');assert.equal(SCENES.hillEnding.after,'hillLegacy');
 for(const value of [null,{...fresh('breeds').hill,line:101},{...fresh('breeds').hill,phase:NaN}]){const raw=snapshot(fresh('breeds'));raw.hill=value;assert.equal(restore(raw),null);}
});
test('advancing redcoats remain outside earthworks and do not inherit player jumping',()=>{
 const s=prepare();s.stage=7;s.hill.retreat=true;s.player.z=45;s.player.y=2;
 for(let i=0;i<2400;i++){tick(s,{},.025);for(const e of s.enemies)assert.equal(collide(s,e.x,e.z,.23,0),false);}
 assert.ok(s.enemies.some(e=>e.z>1));
});
