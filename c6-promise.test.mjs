import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,tick,restore,snapshot,collide,currentGoal,distance} from './c6-sim.mjs';
import {continueProgress,SCENES} from './c6-data.mjs';
import {patrolAt} from './c6-promise.mjs';
import * as T from './three.module.js';
import {promiseCamera} from './c6-promise-world.mjs';
import {applyLook} from './c6-controls.mjs';
const step=(s,input={},seconds=1)=>{const events=[];for(let i=0;i<seconds*40;i++)events.push(...tick(s,input,.025));return events;};
function use(s,input={}){const g=currentGoal(s);s.player.x=g.x;s.player.z=g.z;s.promise.vx=s.promise.vz=0;return step(s,{interact:true,...input},2.1);}
test('Jonas boards, cover is required, contact starts pursuit, cut boom opens escape',()=>{
 let s=fresh('tidewater');assert.equal(s.armed,false);const join=use(s);assert.equal(s.stage,1);assert.ok(join.some(e=>e.key==='promiseJoin'));assert.equal(s.promise.aboard,true);
 use(s);assert.equal(s.stage,1,'waiting upright is not the quiet action');use(s,{crouch:true});assert.equal(s.stage,2);
 s=restore(snapshot(s));assert.equal(s.promise.aboard,true);const contact=use(s);assert.equal(s.stage,3);assert.ok(contact.some(e=>e.key==='promiseContact'));assert.equal(s.promise.pursuit,true);
 assert.equal(collide(s,23,-130,.8,0),true);use(s);assert.equal(s.stage,4);assert.equal(s.promise.boom,true);assert.equal(collide(s,23,-130,.8,0),false);
 s=restore(snapshot(s));use(s);assert.equal(s.finished,true);assert.equal(s.failed,false);assert.equal(s.shotsFired,0);
});
test('boat momentum, braking, scenery sliding and diagonal speed are bounded',()=>{
 const a=fresh('tidewater'),b=fresh('tidewater');step(a,{forward:true},1);step(b,{forward:true,right:true},1);assert.ok(Math.abs(a.promise.speed-b.promise.speed)<.01);assert.ok(a.player.z<24);
 const at={...a.player};step(a,{},1);assert.ok(distance(at,a.player)<1.3);assert.ok(a.promise.speed<.1);
 for(let i=0;i<1500;i++){tick(a,{forward:true,sprint:true,jump:true},.025);assert.equal(collide(a,a.player.x,a.player.z,.79,0),false);assert.equal(a.player.y,0);}assert.ok(a.player.z>9,'island stops bow');
 const silent=fresh('tidewater');step(silent,{forward:true,crouch:true,sprint:true},2);assert.ok(silent.promise.speed<=2.71);assert.equal(silent.player.stamina,100);
});
test('reeds lose lantern exposure, while standing in a clear cone reveals the boat',()=>{
 const s=fresh('tidewater');for(let i=0;i<100;i++){const a=patrolAt(0,s.time);s.player.x=a.x-Math.sin(a.yaw)*7;s.player.z=a.z-Math.cos(a.yaw)*7;tick(s,{},.025);}assert.ok(s.promise.exposure>.4);
 s.player.x=-23;s.player.z=-58;step(s,{crouch:true},3);assert.equal(s.promise.hidden,true);assert.equal(s.promise.exposure,0);
});
test('interception warns before damage and changing course avoids the shot',()=>{
 const a=fresh('tidewater');a.stage=4;Object.assign(a.promise,{aboard:true,boom:true,pursuit:true,chaserZ:30,chaserX:0});a.player.z=-148;
 step(a,{},5.6);assert.ok(a.promise.warning>0);assert.equal(a.player.health,100);const b=restore(snapshot(a));step(a,{},1.9);assert.equal(a.player.health,77);
 step(b,{right:true,sprint:true},1.9);assert.equal(b.player.health,100);assert.ok(b.player.x>10);
 const stopped=fresh('tidewater');stopped.stage=4;Object.assign(stopped.promise,{aboard:true,boom:true,pursuit:true,chaserX:0,chaserZ:20});step(stopped,{},30);assert.equal(stopped.failed,true);assert.equal(stopped.finished,false);
});
test('Moores Creek repair creates passage and the rescue survives reloads',()=>{
 let s=fresh('moorescreek');assert.equal(collide(s,0,-5,.3,0),true);use(s);const boards=use(s);assert.ok(boards.some(e=>e.id==='creek.boards'));assert.equal(s.promise.bridge,true);assert.equal(collide(s,0,-5,.3,0),false);
 use(s);assert.equal(s.carrying,true);s=restore(snapshot(s));assert.equal(s.carrying,true);assert.equal(s.promise.bridge,true);use(s);assert.equal(s.promise.rescued,true);assert.equal(s.carrying,false);use(s);assert.equal(s.finished,true);
});
test('completed saves unlock this installment and completed new saves remain complete',()=>{
 const old={complete:true,seen:['ending','northEnding','hillLegacy'],prefs:{muted:true},scene:null,checkpoint:null};const n=continueProgress(old);assert.equal(n.scene,'promiseIntro');assert.equal(n.complete,false);assert.equal(old.complete,true);
 const unfinished={...old,complete:false,checkpoint:snapshot(fresh('breeds'))};assert.equal(continueProgress(unfinished),unfinished);
 const done={...old,seen:[...old.seen,'promiseCoda','liftHome','paperCoda','retreatEnding']};assert.equal(continueProgress(done),done);assert.equal(SCENES.promiseEnd.after,'creekIntro');assert.equal(SCENES.creekEnd.after,'promiseCoda');assert.equal(SCENES.promiseCoda.after,'liftIntro');
 for(const h of [null,{...fresh('tidewater').promise,vx:Infinity},{...fresh('tidewater').promise,exposure:2}]){const raw=snapshot(fresh('tidewater'));raw.promise=h;assert.equal(restore(raw),null);}
});
// A steering pilot exercises real movement along a complete collision-free route.
function travel(s,points){for(const [x,z] of points){let limit=0;while(Math.hypot(s.player.x-x,s.player.z-z)>1.0&&limit++<2500){s.player.yaw=Math.atan2(-(x-s.player.x),-(z-s.player.z));tick(s,{forward:true,sprint:s.stage>=3,crouch:s.stage<3},.025);assert.equal(s.failed,false,'survives route');assert.equal(collide(s,s.player.x,s.player.z,s.level==='tidewater'?.79:.29,0),false);}assert.ok(limit<2500,'reaches '+x+','+z);}}
test('boat mission can be navigated through every channel using actual input',()=>{
 const s=fresh('tidewater');travel(s,[[-23,21],[-23,-23]]);step(s,{interact:true},2);assert.equal(s.stage,1);
 travel(s,[[-23,-58]]);step(s,{interact:true,crouch:true},3);assert.equal(s.stage,2);
 travel(s,[[2,-58],[24,-64],[24,-94]]);step(s,{interact:true},2);assert.equal(s.stage,3);
 travel(s,[[25,-109],[25,-127],[23,-128]]);step(s,{interact:true},2);assert.equal(s.stage,4);
 travel(s,[[23,-143],[0,-160]]);step(s,{interact:true},1);assert.equal(s.finished,true);assert.equal(s.failed,false);
});
test('boat looking up and down keeps the same non-inverted controls as the FPS',()=>{
 const s=fresh('tidewater'),w={camera:new T.PerspectiveCamera()},direction=()=>{promiseCamera(w,s,true);return w.camera.getWorldDirection(new T.Vector3());};
 const start=direction();applyLook(s.player,0,-40,1);const up=direction();assert.ok(up.y>start.y);applyLook(s.player,0,80,1);assert.ok(direction().y<start.y);
 s.player.pitch=0;s.player.yaw=0;applyLook(s.player,40,0,1);assert.ok(direction().x>0);
});
test('the pursuing skiff cannot cut through an island to reach the player',()=>{
 const s=fresh('tidewater');s.stage=4;s.player.x=-25;s.player.z=-135;Object.assign(s.promise,{pursuit:true,boom:true,chaserX:25,chaserZ:-110});
 for(let i=0;i<800&&!s.failed;i++){tick(s,{},.025);assert.equal(collide(s,s.promise.chaserX,s.promise.chaserZ,.79,0),false);}
});

