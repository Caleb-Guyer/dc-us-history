import test from 'node:test';
import assert from 'node:assert/strict';
import {createUnion,enact,ready,acceptDraft,beginRatification,ratify} from './union-sim.mjs';
import {createFort,advance,interact,fire,beginBattery,restartCheckpoint,targetBarge,DEPOT,POSTS,GUN,FLAG} from './fort-sim.mjs';
import {VOICES} from './short-voices.mjs';
import {LINES} from './short-games-data.mjs';
import {existsSync} from 'node:fs';
test('Historical voice lines have packaged stock synthetic performances',()=>{for(const [id,line] of Object.entries(LINES)){assert.equal(VOICES[id].text,line.text);assert.ok(existsSync(new URL(VOICES[id].file,import.meta.url)),id);}});
test('Convention requires both chambers and checks, and a viable coalition before ratification',()=>{
 let s=createUnion();assert.equal(acceptDraft(s),s);
 for(const p of ['house','senate','tax','trade','checks','courts'])s=enact(s,p);
 assert.ok(ready(s));assert.equal(s.turn,6);assert.equal(enact(s,'house'),s);
 s=beginRatification(acceptDraft(s));assert.equal(s.phase,'ratify');s=ratify(s,'papers');assert.equal(ratify(s,'papers'),s);
 s=ratify(ratify(s,'amend'),'conventions');assert.equal(s.phase,'won');
});
test('Eight unbalanced debate rounds fail without changing the historical ratification record',()=>{let s=createUnion();for(let i=0;i<8;i++)s=enact(s,'lobby-large');assert.ok(s.failed);assert.equal(s.phase,'draft');assert.equal(enact(s,'house'),s);assert.equal(s.ratified.length,0);});
test('Up means decreasing screen y, diagonals preserve speed, and movement stays within the fort',()=>{
 const a=createFort(),b=createFort();advance(a,.05,{y:-1});advance(b,.05,{x:1,y:-1});assert.ok(a.player.y<DEPOT.y);assert.equal(a.player.x,DEPOT.x);
 assert.ok(Math.abs(Math.hypot(b.player.x-DEPOT.x,b.player.y-DEPOT.y)-(DEPOT.y-a.player.y))<1e-8);
 for(let i=0;i<300;i++)advance(a,.05,{x:1,y:-1,crouch:true});assert.equal(a.player.x,835);assert.equal(a.player.y,220);
});
test('Actual supply interactions gate nightfall; cannon position, aim and cooldown gate the barge phase',()=>{
 const s=createFort();s.player.x=200;s.player.y=240;assert.equal(interact(s).event,null);
 for(let i=0;i<4;i++){Object.assign(s.player,DEPOT);assert.equal(interact(s).event,'pickup');Object.assign(s.player,POSTS[i]);assert.equal(interact(s).event,'deliver');}
 assert.equal(s.phase,'transition');beginBattery(s);assert.equal(s.phase,'battery');assert.equal(fire(s,targetBarge(s)).event,null);
 Object.assign(s.player,GUN);assert.equal(fire(s,{x:999,y:999}).event,'miss');assert.equal(fire(s,targetBarge(s)).event,null);
 for(let i=0;i<31;i++)advance(s,.05,{crouch:true});assert.equal(fire(s,targetBarge(s)).event,'barge-hit');
 while(s.repelled<4){for(let i=0;i<31;i++)advance(s,.05,{crouch:true});fire(s,targetBarge(s));}
 assert.equal(s.phase,'lastwatch');Object.assign(s.player,{x:495,y:520});for(let i=0;i<481;i++)advance(s,.05,{crouch:true});assert.equal(s.phase,'flag');
 assert.equal(interact(s).event,null);Object.assign(s.player,FLAG);for(let i=0;i<5;i++)interact(s);assert.equal(s.phase,'won');assert.ok(s.completed);
});
test('Cover reduces a burst and assist reduces damage; retries preserve the correct local checkpoint',()=>{
 const a=createFort(),b=createFort({assist:true});for(const s of [a,b])s.shells=[{x:500,y:465,t:.01,max:2,r:60}];
 advance(a,.02,{crouch:true});advance(b,.02);assert.equal(a.player.health,88);assert.equal(b.player.health,89);
 a.delivered=4;a.repelled=2;a.failed=true;const c=restartCheckpoint(a);assert.equal(c.phase,'battery');assert.equal(c.repelled,0);assert.equal(c.player.health,100);
 a.repelled=4;assert.equal(restartCheckpoint(a).phase,'lastwatch');b.failed=true;assert.equal(restartCheckpoint(b).phase,'supply');assert.ok(restartCheckpoint(b).assist);
});
