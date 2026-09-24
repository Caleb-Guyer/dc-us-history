import test from 'node:test';
import assert from 'node:assert/strict';
import {CHAPTER5,PROLOGUE,EPILOGUE} from './c5-data.mjs';
import {C5_VOICES} from './c5-voices.mjs';
import {CINEMATICS,sceneKey,editorialShot,blocking,FilmClock} from './c5-cinema-plan.mjs';
import {makeActor,poseActor,disposeTree} from './c5-actors.mjs';

test('the opening, all fourteen mission scenes, and the epilogue have authored coverage for every recorded line',()=>{
 const ids=[...PROLOGUE.map((_,i)=>'prologue.'+i),...CHAPTER5.flatMap(m=>[...m.intro.map((_,i)=>m.id+'.in'+i),...m.outro.map((_,i)=>m.id+'.out'+i)]),...EPILOGUE.map((_,i)=>'epilogue.'+i)];
 assert.equal(Object.keys(CINEMATICS).length,16);
 for(const id of ids){const voice=C5_VOICES.find(v=>v.id===id),key=sceneKey(id),spec=CINEMATICS[key],beat=Number(id.match(/\d+$/)[0]);assert.ok(spec.cast[voice.speaker],id);assert.ok(!spec.hide?.includes(voice.speaker),id+' speaker hidden');assert.ok(spec.frames[beat],id);for(const s of spec.frames[beat]){assert.ok(s.kind);if(s.kind!=='detail')assert.ok(spec.cast[s.subject],id+' camera subject');}}
});
test('camera cuts use the voice duration and stay stable before a cut, during pause, and at the end',()=>{
 const first=editorialShot('prologue',0,1,8);assert.equal(first.kind,'detail');assert.equal(editorialShot('prologue',0,1,8).progress,first.progress);assert.equal(editorialShot('prologue',0,5,8).kind,'wide');assert.equal(editorialShot('prologue',0,200,8).progress,1);assert.equal(editorialShot('line.in',0,3.2,3.3).part,0);
});
test('film playback leaves a lead-in, waits for audio, holds the reaction, and restarts cleanly',()=>{
 const c=new FilmClock(['a','b']);assert.equal(c.tick(.5,null),null);assert.equal(c.tick(.56,null),'cue');assert.equal(c.at,0);
 for(let i=0;i<100;i++)assert.equal(c.tick(.05,{time:i*.05}),null);assert.equal(c.tick(.4,null),null);assert.equal(c.tick(.26,null),'advance');assert.equal(c.advance(),true);assert.equal(c.at,1);assert.equal(c.lineTime,0);assert.equal(c.tick(.17,null),'cue');
 const freeze=JSON.stringify(c);c.tick(0,{time:0});assert.equal(JSON.stringify(c),freeze);c.restart();assert.equal(c.at,0);assert.equal(c.time,0);assert.equal(c.started,false);assert.equal(c.tick(.2,null),null);
});
test('blocking keeps the speaker present, preserves finite positions, and changes actions with the scene',()=>{
 for(const [key,spec]of Object.entries(CINEMATICS))for(const person of Object.keys(spec.cast))for(const time of [0,2,8,22]){const a=blocking(key,person,time,2);if(spec.hide?.includes(person)){assert.equal(a,null);continue;}for(const k of ['x','y','z','yaw'])assert.ok(Number.isFinite(a[k]),key+person);}
 assert.notEqual(blocking('line.in','ROWAN',0).z,blocking('line.in','ROWAN',6).z);assert.equal(blocking('line.in','ROWAN',6).pose,'listen');assert.equal(blocking('kingstreet.in','MARA',4).pose,'kneel');assert.equal(blocking('harbor.in','ROWAN',4).pose,'row');
});
test('the articulated cast supports every action without invalid transforms or leaking a held prop into idle',()=>{
 for(const key of ['ROWAN','MARA','ISAIAH','WARD','THOMAS']){const g=makeActor(key);for(const pose of ['walk','run','listen','paper','read','give','point','work','row','kneel','brace','reach']){poseActor(g,{time:4.6,pose,speaking:true,voiceTime:2,mood:'tense'});g.updateMatrixWorld(true);g.traverse(o=>assert.ok(o.matrixWorld.elements.every(Number.isFinite),key+pose));}poseActor(g,{pose:'paper'});assert.equal(g.userData.paper.visible,true);poseActor(g,{pose:'listen'});assert.equal(g.userData.paper.visible,false);disposeTree(g);}
});
test('offering a dispatch extends the hand in front of the body, and reading looks down toward it',()=>{
 const g=makeActor('ROWAN');poseActor(g,{pose:'give'});g.updateMatrixWorld(true);assert.ok(g.userData.hands[1].matrixWorld.elements[14]<-.4);poseActor(g,{pose:'read'});assert.ok(g.userData.head.rotation.x<0);g.updateMatrixWorld(true);assert.ok(g.userData.hands[1].matrixWorld.elements[14]<0);disposeTree(g);
});
