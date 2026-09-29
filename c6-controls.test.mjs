import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from './three.module.js';
import {applyLook,mouseButtons} from './c6-controls.mjs';
import {fresh,tick,distance} from './c6-sim.mjs';
import {OpeningWorld} from './c6-world.mjs';

// Exercise the actual gameplay render path with a real Three.js camera;
// only the GPU and scenery are replaced for this headless regression check.
function view(s,input={}){
 const camera=new T.PerspectiveCamera(70,16/9,.055,320);camera.rotation.order='YXZ';
 const world=Object.assign(Object.create(OpeningWorld.prototype),{
  camera,scene:new T.Scene(),cast:{},enemies:[],extras:[],weapon:new T.Group(),marker:new T.Group(),door:new T.Group(),flash:{},groundGun:{},
  wagonObject:{position:new T.Vector3(),userData:{wheels:[]}},load(){},animate(){},setActor(){},
  renderer:{render(){camera.updateMatrixWorld();}}
 });
 // Enemy appearance is unrelated to where the actual camera points.
 world.enemies=s.enemies.map(()=>({visible:true,position:new T.Vector3(),rotation:new T.Euler(),userData:{legs:[],arms:[],gun:{rotation:{}},flash:{}}}));
 world.render(s,input,.025,{reduced:true});return camera;
}

test('mouse and touch up/down and left/right agree with the rendered view',()=>{
 for(const touch of [false,true])for(const [dx,dy,axis,sign] of [[0,-80,'y',1],[0,80,'y',-1],[-80,0,'x',-1],[80,0,'x',1]]){
  const s=fresh('release');applyLook(s.player,dx,dy,1,touch);
  const direction=view(s).getWorldDirection(new T.Vector3());
  assert.ok(direction[axis]*sign>0,`${touch?'touch':'mouse'} ${dx},${dy}: camera faces the input direction`);
 }
});

test('arrow look moves the actual camera in the labeled direction',()=>{
 for(const [key,axis,sign] of [['lookUp','y',1],['lookDown','y',-1],['lookLeft','x',-1],['lookRight','x',1]]){
  const s=fresh('release');for(let i=0;i<12;i++)tick(s,{[key]:true},.025);
  assert.ok(view(s).getWorldDirection(new T.Vector3())[axis]*sign>0,key);
 }
});

test('look limits and sensitivity do not flip or corrupt the camera',()=>{
 const a=fresh('release').player,b={...a};applyLook(a,100,-100,.5);applyLook(b,100,-100,1);
 assert.ok(Math.abs(b.pitch-a.pitch*2)<1e-8);assert.ok(Math.abs(b.yaw-a.yaw*2)<1e-8);
 applyLook(a,100000,-100000,NaN);assert.equal(a.pitch,.85);assert.ok(Number.isFinite(a.yaw));
 applyLook(a,0,100000,2,true);assert.equal(a.pitch,-.9);
});

test('a target centered by the camera is also the target hit by the musket',()=>{
 const s=fresh('concord');s.stage=2;s.armed=true;s.player.x=0;s.player.z=6;
 const enemy={id:0,x:3,z:-15,hp:1,yaw:0,route:[3,-15],cooldown:99,dead:0,fired:0};s.enemies=[enemy];
 s.player.yaw=Math.atan2(-(enemy.x-s.player.x),-(enemy.z-s.player.z));s.player.pitch=Math.atan2(1.15-1.7,distance(s.player,enemy));
 const projected=new T.Vector3(enemy.x,1.15,enemy.z).project(view(s,{aim:true}));
 assert.ok(Math.abs(projected.x)<1e-7&&Math.abs(projected.y)<1e-7,'target is on the crosshair');
 tick(s,{fire:true,aim:true},.025);assert.equal(enemy.hp,0);
});

test('releasing fire keeps right-button aim, and releasing aim keeps fire',()=>{
 assert.deepEqual(mouseButtons(3),{fire:true,aim:true});
 assert.deepEqual(mouseButtons(2),{fire:false,aim:true});
 assert.deepEqual(mouseButtons(1),{fire:true,aim:false});
 assert.deepEqual(mouseButtons(0),{fire:false,aim:false});
});
