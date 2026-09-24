import test from 'node:test';
import assert from 'node:assert/strict';
import {CHAPTER5,PROLOGUE,EPILOGUE} from './c5-data.mjs';
import {C5_VOICES} from './c5-voices.mjs';
import {CINEMATICS,sceneKey,editorialShot,blocking,FilmClock} from './c5-cinema-plan.mjs';
import {makeActor,poseActor,tendWound,disposeTree} from './c5-actors.mjs';

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
 assert.notEqual(blocking('line.in','ROWAN',0).z,blocking('line.in','ROWAN',6).z);assert.equal(blocking('line.in','ROWAN',6).pose,'listen');assert.equal(blocking('kingstreet.in','MARA',4).pose,'listen');assert.equal(blocking('harbor.in','ROWAN',4).pose,'row');
});
test('the articulated cast supports every action without invalid transforms or leaking a held prop into idle',()=>{
 for(const key of ['ROWAN','MARA','ISAIAH','WARD','THOMAS']){const g=makeActor(key);for(const pose of ['walk','run','listen','paper','read','give','point','work','row','kneel','brace','reach','hit','recover','tend']){poseActor(g,{time:4.6,pose,progress:.6,speaking:true,voiceTime:2,mood:'tense'});g.updateMatrixWorld(true);g.traverse(o=>assert.ok(o.matrixWorld.elements.every(Number.isFinite),key+pose));}poseActor(g,{pose:'paper'});assert.equal(g.userData.paper.visible,true);poseActor(g,{pose:'listen'});assert.equal(g.userData.paper.visible,false);disposeTree(g);}
});
test('Isaiah is hit on the shot cue, stays wounded through the rescue, and survives the aftermath',()=>{
 const before=blocking('kingstreet.in','ISAIAH',4,0,4),impact=blocking('kingstreet.in','ISAIAH',6,1,.4),fallen=blocking('kingstreet.in','ISAIAH',8,1,2);
 assert.equal(before.injury,false);assert.equal(impact.injury,true);assert.ok(impact.progress>0&&impact.progress<1);assert.equal(fallen.progress,1);
 for(const beat of [2,3,4]){const a=blocking('kingstreet.in','ISAIAH',12,beat,0);assert.equal(a.injury,true);assert.equal(a.progress,1);assert.equal(a.pose,'hit');}
 assert.equal(blocking('kingstreet.in','MARA',12,1,2).pose,'brace');assert.equal(blocking('kingstreet.in','MARA',12,2,2).pose,'tend');
 const after=blocking('kingstreet.out','ISAIAH',2,0,0);assert.equal(after.pose,'recover');assert.equal(after.bandaged,true);
 assert.match(CHAPTER5[3].intro[3][1],/still here/);assert.match(CHAPTER5[3].outro[2][1],/coming home/);
 assert.equal(blocking('tea.in','ISAIAH',2,0,0).injury,false);
});
test('the injury rig visibly lowers Isaiah, keeps feet above the snow, and resets dressing on scene change',()=>{
 const g=makeActor('ISAIAH');poseActor(g,{pose:'listen'});g.updateMatrixWorld(true);const height=g.userData.head.matrixWorld.elements[13];
 poseActor(g,{pose:'hit',progress:1,injury:true});g.updateMatrixWorld(true);assert.ok(g.userData.head.matrixWorld.elements[13]<height-.5);assert.equal(g.userData.wound.visible,true);
 for(const knee of g.userData.knees)assert.ok(knee.matrixWorld.elements[13]>.15,'knees remain above ground');
 for(const progress of [0,.25,.5,.75,1]){poseActor(g,{pose:'hit',progress});g.updateMatrixWorld(true);for(const knee of g.userData.knees)assert.ok(knee.children.at(-1).getWorldPosition(g.position.clone()).y>-.03,'boots do not pass through the snow');}
 poseActor(g,{pose:'recover',injury:true,bandaged:true});assert.equal(g.userData.bandage.visible,true);assert.equal(g.userData.wound.visible,false);
 poseActor(g,{pose:'tend'});assert.equal(g.userData.dressing.visible,true);poseActor(g,{pose:'listen'});assert.equal(g.userData.bandage.visible,false);assert.equal(g.userData.dressing.visible,false);assert.equal(g.userData.root.position.y,0);disposeTree(g);
});
test('Isaiah clutches the wounded shoulder and Mara places her dressing at that shoulder',()=>{
 const patient=makeActor('ISAIAH'),caregiver=makeActor('MARA');
 for(const g of [patient,caregiver]){const a=blocking('kingstreet.in',g.userData.key,12,3,2);g.position.set(a.x,a.y,a.z);g.rotation.y=a.yaw;poseActor(g,a);}
 tendWound(caregiver,patient);patient.updateMatrixWorld(true);caregiver.updateMatrixWorld(true);
 const wound=patient.userData.wound.getWorldPosition(patient.position.clone());
 for(const hand of [patient.userData.hands[1],...caregiver.userData.hands])assert.ok(hand.getWorldPosition(patient.position.clone()).distanceTo(wound)<.16);
 disposeTree(patient);disposeTree(caregiver);
});
test('offering a dispatch extends the hand in front of the body, and reading looks down toward it',()=>{
 const g=makeActor('ROWAN');poseActor(g,{pose:'give'});g.updateMatrixWorld(true);assert.ok(g.userData.hands[1].matrixWorld.elements[14]<-.4);poseActor(g,{pose:'read'});assert.ok(g.userData.head.rotation.x<0);g.updateMatrixWorld(true);assert.ok(g.userData.hands[1].matrixWorld.elements[14]<0);disposeTree(g);
});
