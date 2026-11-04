import test from 'node:test';
import assert from 'node:assert/strict';
import {CAMPAIGNS} from './t911-games-data.mjs';
import {CINEMATIC_TRACKS,directorShot,sceneDuration} from './t911-games-director.mjs';
const distance=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));

test('all thirty historical beats have individually authored moving 3D cameras',()=>{
 const names=new Set();let count=0;
 for(const c of Object.values(CAMPAIGNS))for(const m of c.missions)for(const phase of ['opening','ending']){
  assert.equal(CINEMATIC_TRACKS[m.id][phase].length,m[phase].length);
  for(let beatIndex=0;beatIndex<m[phase].length;beatIndex++){
   const a=directorShot(m,{phase,beatIndex,progress:0}),b=directorShot(m,{phase,beatIndex,progress:1});
   assert.ok(distance(a.position,b.position)>1,'A shot must move visibly');assert.notEqual(a.fov,b.fov);assert.ok(!names.has(a.name));names.add(a.name);count++;
   for(let n=0;n<=20;n++){
    const shot=directorShot(m,{phase,beatIndex,progress:n/20});assert.ok([...shot.position,...shot.target,shot.fov].every(Number.isFinite));
    assert.ok(shot.position[1]>=1.8,'Camera cannot dip below a standing eye/floor');assert.ok(shot.target[1]>=1,'Shot cannot target below the ground');assert.ok(shot.fov>=30&&shot.fov<=60);
    assert.ok(distance(shot.position,shot.target)>2,'Avoid the near-plane or an undefined viewing direction');
   }
  }
 }
 assert.equal(count,30);
});
test('camera stages distinguish the Alamo, San Jacinto, the gold rush and map inserts',()=>{
 const dispatch=CAMPAIGNS[11].missions[1],press=CAMPAIGNS[11].missions[2];
 assert.equal(directorShot(dispatch,{beatIndex:0}).stage,'alamo');assert.equal(directorShot(dispatch,{beatIndex:1}).stage,'normal');
 assert.equal(directorShot(press,{beatIndex:1}).stage,'goldrush');assert.equal(directorShot(press,{beatIndex:0}).stage,'map');
 assert.deepEqual(directorShot(press,{beatIndex:0}).target,[0,1.4,-5]);
 assert.equal(directorShot(press,{beatIndex:0}).mapKind,'cession');
 assert.equal(directorShot(CAMPAIGNS[11].missions[0],{phase:'ending',beatIndex:1}).mapKind,'missouri');
 assert.equal(directorShot(CAMPAIGNS[9].missions[0],{phase:'ending',beatIndex:1}).mapKind,'industrial');
});
test('director input is clamped and scene duration stays within the short campaign budget',()=>{
 for(const c of Object.values(CAMPAIGNS)){
  let total=0;
  for(const m of c.missions){assert.ok(sceneDuration(m,'opening')<=15);assert.ok(sceneDuration(m,'ending')<=10);total+=m.duration+sceneDuration(m)+sceneDuration(m,'ending');assert.deepEqual(directorShot(m,{progress:-5}),directorShot(m,{progress:0}));assert.deepEqual(directorShot(m,{progress:9}),directorShot(m,{progress:1}));}
  assert.ok(total<210);
 }
 assert.ok(directorShot(null,{beatIndex:Infinity,progress:NaN}).position.every(Number.isFinite));assert.equal(sceneDuration(null),0);
});
