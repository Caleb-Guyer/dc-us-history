import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from './three.module.js';
import {fresh,tick,collide,currentGoal,goalNear,restore,snapshot,angle} from './c6-sim.mjs';
import {SCENES,LINES,continueProgress,LEVELS} from './c6-data.mjs';
import {retreatCamera} from './c6-retreat-world.mjs';
import {retreatCanUse,retreatDefending} from './c6-retreat.mjs';
const step=(s,input={},seconds=1)=>{let events=[];for(let i=0;i<seconds/.025;i++)events.push(...tick(s,input,.025));return events;};
function walk(s,x,z){const start={x:Math.round(s.player.x),z:Math.round(s.player.z)},end={x:Math.round(x),z:Math.round(z)},key=p=>p.x+','+p.z,queue=[start],parent=new Map([[key(start),null]]);let found;
 for(let i=0;i<queue.length&&i<15000;i++){const p=queue[i];if(p.x===end.x&&p.z===end.z){found=p;break;}for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const n={x:p.x+dx,z:p.z+dz};if(parent.has(key(n))||collide(s,n.x,n.z))continue;parent.set(key(n),p);queue.push(n);}}
 assert.ok(found,'physical route to '+x+','+z);const path=[];while(found){path.unshift(found);found=parent.get(key(found));}
 for(const p of path)for(let i=0;i<55&&Math.hypot(p.x-s.player.x,p.z-s.player.z)>.13;i++){s.player.yaw=0;tick(s,{right:p.x-s.player.x>.1,left:p.x-s.player.x<-.1,back:p.z-s.player.z>.1,forward:p.z-s.player.z<-.1,crouch:s.armed},.025);assert.equal(s.failed,false,'alive on the walking route');if(s.retreat.escort)assert.equal(collide(s,s.ward.x,s.ward.z,.22,0),false,'the daughter stays outside buildings');}
 assert.ok(Math.hypot(x-s.player.x,z-s.player.z)<.4,'walk reached destination');
}
function use(s){assert.ok(goalNear(s),'at the actual goal');assert.ok(retreatCanUse(s));step(s,{interact:true},Math.max(1.35,(currentGoal(s).time||.8)+.1));}
function ferryTo(s,goal){for(let i=0;i<24000;i++){
 const q=s.retreat,d=Math.hypot(q.boatX-goal.x,q.boatZ-goal.z);if(d<3.9&&q.speed<1.4)return;
 const lead=2,desired=Math.atan2(-(goal.x-q.boatX-q.vx*lead),-(goal.z-q.boatZ-q.vz*lead)),delta=angle(desired-q.boatYaw),brake=d<3.2||d<8&&q.speed>2.5;
 tick(s,{left:!brake&&delta<-.09,right:!brake&&delta>.09,forward:!brake&&Math.abs(delta)<=.09,back:brake},.025);
 }assert.fail('ferry did not reach and slow at its landing: '+JSON.stringify(s.retreat));}
test('Long Island remains a defeat even when local targets fall, and two wounded rescues can walk out',()=>{
 const s=fresh('longisland','story');walk(s,0,17);use(s);assert.equal(s.stage,1);s.enemies.forEach(e=>e.hp=0);step(s,{crouch:true},40);assert.equal(s.stage,2);assert.equal(s.retreat.flanked,true);assert.equal(s.finished,false);
 for(let i=2;i<7;i++){const g=currentGoal(s);walk(s,g.x,g.z);use(s);if(!s.finished)assert.ok(restore(snapshot(s)));}
 assert.equal(s.retreat.rescues,2);assert.equal(s.finished,true);assert.equal(s.carrying,false);
});
test('two real ferry crossings and a return run carry every party with no teleport or camera steering',()=>{
 const s=fresh('eastriver','story');walk(s,0,11);use(s);assert.equal(s.retreat.aboard,true);
 for(const target of [-99,10,-99]){ferryTo(s,{x:0,z:target});assert.ok(goalNear(s));assert.ok(retreatCanUse(s));use(s);use(s);if(!s.finished)assert.ok(restore(snapshot(s)));}
 assert.equal(s.finished,true);assert.equal(s.retreat.crossings,2);assert.equal(s.retreat.cargo,0);assert.equal(s.failed,false);
});
test('looking cannot turn the ferry; repeated one-sided strokes turn it and brakes recover balance',()=>{
 const s=fresh('eastriver');s.stage=1;s.retreat.aboard=true;s.retreat.moored=false;s.player.z=10;const yaw=s.retreat.boatYaw;step(s,{lookLeft:true,lookUp:true},2);assert.equal(s.retreat.boatYaw,yaw);assert.ok(s.player.pitch>0);step(s,{left:true},4);assert.ok(s.retreat.boatYaw<-.2);assert.ok(s.retreat.balance<-.5);const speed=s.retreat.speed,balance=Math.abs(s.retreat.balance);step(s,{back:true},3);assert.ok(s.retreat.speed<speed);assert.ok(Math.abs(s.retreat.balance)<balance*.2);
 const w={camera:new T.PerspectiveCamera()};s.player.pitch=0;retreatCamera(w,s,true);const low=w.camera.getWorldDirection(new T.Vector3()).y;s.player.pitch=.35;retreatCamera(w,s,true);assert.ok(w.camera.getWorldDirection(new T.Vector3()).y>low);
});
test('a fast ferry cannot tie up or disembark in the middle of the river',()=>{
 const s=fresh('eastriver');s.stage=1;s.retreat.aboard=true;s.retreat.moored=false;s.retreat.boatZ=-50;s.player.z=-50;step(s,{interact:true},3);assert.equal(s.stage,1);s.retreat.boatZ=-99;s.player.z=-99;s.retreat.speed=5;assert.equal(retreatCanUse(s),false);
});
test('the displaced family is reunited before shelter and a complete city route clears its buildings',()=>{
 const s=fresh('cityrefuge');for(let i=0;i<6;i++){const g=currentGoal(s);walk(s,g.x,g.z);use(s);if(i===2)assert.equal(s.retreat.escort,true);if(i===3)assert.equal(s.retreat.reunited,true);}assert.equal(s.finished,true);assert.equal(s.retreat.shelter,true);
});
test('Harlem requires the flank signal and participation with two distinct pursuing groups',()=>{
 const s=fresh('harlem','story');walk(s,-5,19);use(s);assert.equal(s.retreat.signaled,false);walk(s,-21,-10);use(s);assert.equal(retreatDefending(s),true);walk(s,-17,-13);const voices=[];
 for(let i=0;i<5000&&s.stage===2;i++)voices.push(...tick(s,{interact:true,crouch:true,reload:!s.loaded},.025));
 assert.equal(s.stage,3);assert.equal(s.retreat.wave,2);assert.ok(voices.some(e=>e.id==='harlem.second'));walk(s,0,22);use(s);assert.equal(s.finished,true);
});
test('White Plains cannot complete without freeing and escorting the wagon and calling Ward back',()=>{
 const s=fresh('whiteplains','story');walk(s,0,15);use(s);step(s,{crouch:true},40);assert.equal(s.stage,2);walk(s,-17,26);use(s);assert.equal(s.retreat.beam,true);walk(s,0,55);const before=s.retreat.wagonZ;step(s,{},3);assert.equal(s.retreat.wagonZ,before);
 walk(s,-17,s.retreat.wagonZ);for(let i=0;i<2000&&s.stage===3;i++){const q=s.retreat;tick(s,{back:s.player.z<q.wagonZ+3,crouch:true},.025);}assert.equal(s.stage,4);assert.equal(s.retreat.wagonZ,62);walk(s,0,12);use(s);walk(s,0,66);step(s,{},25);assert.equal(s.retreat.wardCalled,true);assert.ok(s.retreat.wardZ>=60);use(s);assert.equal(s.finished,true);assert.equal(s.failed,false);
});
test('boat, escort and retreat saves reject invalid mechanics and preserve partial progress',()=>{
 for(const id of Object.keys(LEVELS).filter(k=>fresh(k).retreat)){const raw=snapshot(fresh(id));assert.ok(restore(raw));for(const patch of [{boatX:999},{cargo:99},{wave:Infinity},{aboard:1},{lastOar:'magic'},{balance:2},{crossings:3}]){const bad=structuredClone(raw);Object.assign(bad.retreat,patch);assert.equal(restore(bad),null);}}
 const s=fresh('eastriver');s.stage=3;Object.assign(s.retreat,{aboard:true,moored:false,cargo:0,crossings:1,boatZ:-80,vz:3,boatYaw:Math.PI});s.player.z=-80;const r=restore(snapshot(s));assert.equal(r.retreat.boatZ,-80);assert.equal(r.retreat.crossings,1);assert.equal(r.retreat.aboard,true);
});
test('Philadelphia saves extend to New York, the dated sequence is correct, and every new scene has matching shots',()=>{
 const old={complete:true,seen:['liftHome','paperCoda'],checkpoint:null,prefs:{muted:true}};assert.equal(continueProgress(old).scene,'retreatIntro');assert.equal(continueProgress(old).complete,false);const done={...old,seen:[...old.seen,'retreatEnding']};assert.equal(continueProgress(done),done);
 assert.equal(SCENES.paperCoda.after,'retreatIntro');assert.equal(SCENES.retreatCrossed.after,'retreatPeace');assert.equal(SCENES.retreatCity.after,'retreatHarlem');assert.equal(SCENES.retreatLift.after,'retreatPlains');assert.equal(SCENES.retreatEnding.after,'complete');
 const text=LINES.filter(l=>/^(retreat\.|river\.|refuge\.|harlem\.|plains\.)/.test(l.id)).map(l=>l.text).join(' ');for(const term of ['thirty-two thousand','William Howe','Richard','Nova Scotia','Edward Rutledge','Connecticut','Hudson Valley','September fifteenth','October twenty-eighth','summer fighting season'])assert.ok(text.includes(term));assert.ok(!text.includes('John Rutledge'));
});
