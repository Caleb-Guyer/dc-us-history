import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,tick,currentGoal,restore,snapshot} from './c6-sim.mjs';
import {continueProgress} from './c6-data.mjs';
const step=(s,input={},seconds=1)=>{const e=[];for(let i=0;i<seconds*40;i++)e.push(...tick(s,input,.025));return e;};
const use=s=>{const g=currentGoal(s);s.player.x=g.x;s.player.z=g.z;return step(s,{interact:true,crouch:true},2);};
test('quiet capture hands back the same checkpoint after the cinematic',()=>{
 let s=fresh('ticonderoga');use(s);assert.equal(s.stage,1);use(s);assert.equal(s.stage,2);const events=use(s);
 assert.equal(s.stage,3);assert.equal(s.fort.captured,true);assert.ok(events.some(e=>e.type==='fortCapture'));assert.equal(s.armed,false);assert.equal(s.shotsFired,0);
 s=restore(snapshot(s));assert.equal(s.stage,3);assert.equal(s.fort.captured,true);use(s);use(s);use(s);assert.equal(s.stage,6);assert.equal(s.fort.rope,true);
 step(s,{},10);assert.ok(s.fort.haul<.01,'waiting does not move the gun');
 s.player.yaw=0;step(s,{back:true},8);assert.equal(s.stage,7);assert.equal(s.fort.haul,1);use(s);assert.equal(s.finished,true);
});
test('sentry alarm creates a recoverable crew rescue, not a shootout',()=>{
 let s=fresh('ticonderoga');s.player.x=0;s.player.z=-7;
 step(s,{},14);assert.equal(s.fort.alarm,true);assert.match(currentGoal(s).label,/Nathan/);assert.equal(s.player.health,100);
 s=restore(snapshot(s));use(s);assert.equal(s.fort.rescued,true);assert.equal(s.stage,2);use(s);assert.equal(s.stage,3);assert.equal(s.fort.captured,true);
 assert.equal(s.kills,0);assert.equal(s.enemies.length,0);
});
test('fort walls hide the player and interrupted interactions require proximity',()=>{
 const s=fresh('ticonderoga');s.player.x=-15;s.player.z=0;step(s,{},20);assert.equal(s.fort.alarm,false);
 s.player.x=0;s.player.z=28;step(s,{interact:true},8);assert.equal(s.stage,0);assert.equal(s.fort.signal,false);
});
test('gun hauling stays in its lane and persists across checkpoints',()=>{
 const s=fresh('ticonderoga');s.stage=6;s.fort.captured=true;s.fort.rope=true;s.player.x=12;s.player.z=-24;step(s,{},10);assert.equal(s.fort.haul,0);
 s.player.x=-3;s.player.z=-28;step(s,{},4);assert.equal(s.fort.haul,.5);const loaded=restore(snapshot(s));assert.equal(loaded.fort.haul,.5);assert.equal(loaded.fort.rope,true);
 loaded.player.z=-24;step(loaded,{},4);assert.equal(loaded.stage,7);assert.equal(loaded.fort.rope,false);
});
test('incomplete or corrupt fort saves are rejected without affecting opening saves',()=>{
 const s=snapshot(fresh('ticonderoga'));s.fort.haul=NaN;assert.equal(restore(s),null);s.fort=null;assert.equal(restore(s),null);assert.ok(restore(snapshot(fresh('release'))));
});
test('completed opening saves advance while unfinished and completed new campaigns retain progress',()=>{
 const old={complete:true,seen:['release','gate','nightIntro','lexington','concordIntro','ending'],checkpoint:null,scene:null,prefs:{muted:true}};
 const next=continueProgress(old);assert.equal(next.scene,'northIntro');assert.equal(next.complete,false);assert.deepEqual(next.prefs,old.prefs);assert.equal(old.complete,true);
 const ongoing={...old,complete:false,checkpoint:snapshot(fresh('concord'))};assert.equal(continueProgress(ongoing),ongoing);
 const finished={...old,seen:[...old.seen,'northEnding','hillLegacy','promiseCoda','liftHome','paperCoda','retreatEnding','crossingEnding','philadelphiaEnding','albanySurrender','winterAlliance','widerEnding']};assert.equal(continueProgress(finished),finished);
});

