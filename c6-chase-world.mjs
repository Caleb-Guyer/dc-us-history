import * as T from './three.module.js';
import {makeActor,poseActor} from './c5-actors.mjs?v=4.15.0-published';
import {CHASE_BLOCKS,chaseMounted} from './c6-chase.mjs?v=4.15.0-published';
import {CHASE_SCENES,CHASE_LINES} from './c6-chase-story.mjs?v=4.15.0-published';
const face=(x,z,tx,tz)=>Math.atan2(-(tx-x),-(tz-z));
function table(w,x,z){w.box(2,.1,1.2,0x8b795d,x,.9,z);for(const a of [-.85,.85])for(const b of [-.45,.45])w.box(.1,.9,.1,0x635b46,x+a,.45,z+b);w.box(.75,.013,.5,0xd3c5a8,x,.968,z);}
function horse(w,color=0x745341,riderKey=null){
 const g=w.group(),legs=[],knees=[],packs=[];
 w.sphere(.66,color,0,1.28,.05,g,[.68,.77,1.6]);w.sphere(.45,color,0,1.46,-.78,g,[.77,1.42,.62]);
 const neck=w.box(.42,.9,.43,color,0,1.84,-.86,g);neck.rotation.x=-.38;
 const head=w.group();w.scene.remove(head);g.add(head);head.position.set(0,2.27,-1.1);head.rotation.x=.15;
 w.sphere(.29,color,0,0,-.08,head,[.65,1.2,1.4]);w.sphere(.23,0x514439,0,-.19,-.43,head,[.73,.7,1.1]);
 for(const side of [-1,1]){const ear=w.mesh(new T.ConeGeometry(.085,.28,5),color,side*.135,.33,-.02,head);ear.rotation.z=side*.15;w.sphere(.035,0x171c1a,side*.18,.08,-.18,head);w.sphere(.017,0xc5b999,side*.185,.09,-.19,head);}
 for(let i=0;i<8;i++)w.box(.1,.22,.11,0x34352d,0,2.13-i*.075,-.67+i*.07,g);
 const tail=w.cyl(.08,.9,0x36372e,0,1.04,1.16,g);tail.rotation.x=-.42;
 for(const x of [-.3,.3])for(const z of [-.63,.73]){const leg=new T.Group(),knee=new T.Group();leg.position.set(x,1.08,z);g.add(leg);knee.position.y=-.5;leg.add(knee);w.cyl(.075,.5,color,0,-.25,0,leg);w.cyl(.048,.46,0x493b32,0,-.23,0,knee);w.box(.12,.13,.21,0x292d28,0,-.5,-.035,knee);legs.push(leg);knees.push(knee);}
 w.box(.81,.09,.7,0x605042,0,1.83,.05,g);w.box(.55,.08,.57,0x313c3a,0,1.91,.05,g);
 for(const x of [-.52,.52]){const p=w.box(.3,.45,.55,0xa29d7e,x,1.5,.61,g);packs.push(p);w.box(.33,.035,.58,0x4c4638,x,1.56,.61,g);}
 for(const x of [-.2,.2]){const rein=w.box(.015,.025,1.02,0x3e392e,x,1.98,-.65,g);rein.rotation.x=.24;}
 let rider=null;if(riderKey){rider=makeActor(riderKey);rider.position.set(0,1.18,.15);g.add(rider);}
 g.userData={legs,knees,head,tail,packs,rider};return g;
}
function poseHorse(g,t,speed,voice){const u=g.userData,stride=Math.min(1,speed/5);u.legs.forEach((a,i)=>{a.rotation.x=Math.sin(t*(speed>6?11:7)+(i===0||i===3?0:Math.PI))*.45*stride;u.knees[i].rotation.x=Math.max(0,-Math.sin(t*7+i*Math.PI))*.5*stride;});u.head.rotation.x=.15+Math.sin(t*(speed>0?7:1.3))*.04;u.tail.rotation.z=Math.sin(t*2)*.06;if(u.rider){poseActor(u.rider,{pose:'row',time:t,speaking:voice==='ROWAN'});const a=u.rider.userData;a.body.rotation.x=.12+stride*.08;a.legs.forEach((l,i)=>{l.rotation.x=.35;l.rotation.z=(i?1:-1)*.6;a.knees[i].rotation.x=-.5;});a.arms.forEach((l,i)=>{l.rotation.x=.9;a.elbows[i].rotation.x=.75;});a.root.position.y=-.34+Math.sin(t*7)*.025*stride;}}
function woods(w,long){const n=long?96:46;for(let i=0;i<n;i++){const x=(i%2?-1:1)*(39+i%4*1.6),z=28-Math.floor(i/2)*(long?5.6:4),h=6+i%4;w.cyl(.2,h,0x665944,x,h/2,z);w.mesh(new T.ConeGeometry(2.6,5.7,8),0x727b5b,x,h,z);}}
export function buildChase(w,level){
 const mounted=level==='danrelay',v=w.chaseVisual={squad:[],army:[],lastSquad:[],labels:[],horse:null,rider:null,prisoners:[],lastHorse:null};
 for(const k of ['ROWAN','MARA','WARD','ASA','RUNNER'])w.actor(k,0,0);
 w.scene.background=new T.Color(mounted?0x9dadaf:0xb6b3a1);w.scene.fog=new T.FogExp2(mounted?0xb2b9b0:0xc2bda6,mounted?.006:.008);w.sun.intensity=2.1;
 w.box(102,.2,mounted?290:130,w.mat(0x989c7b,{map:w.groundTexture}),0,-.15,mounted?-104:-20);woods(w,mounted);
 for(const [x,z,width,depth,h] of CHASE_BLOCKS[level]){if(h>3)w.house(x,z,width,depth,h,0x7e816c);else w.box(width,h,depth,w.mat(0x837354,{map:w.woodTexture}),x,h/2,z);}
 if(!mounted){
  table(w,-4,20);for(let i=0;i<6;i++){const a=w.soldier();a.visible=false;v.squad.push(a);}
  for(let i=0;i<18;i++){const a=w.soldier(true);a.position.set((i%9-4)*3.5,0,-69-Math.floor(i/9)*3);a.rotation.y=Math.PI;v.army.push(a);}
  v.labels.push(w.label('FORWARD LINE',0,1.5,-35,2.7),w.label('CONTINENTAL LINE',0,1.5,5,2.8),w.label('MILITIA FLANK',-19,1.5,-11,2.6));
  for(let i=0;i<3;i++){const a=w.soldier(true);a.position.set(7+i*1.5,0,-43);a.userData.gun.visible=false;a.userData.arms.forEach(l=>l.rotation.x=2.3);a.visible=false;v.prisoners.push(a);}
 }else{
  // A fictional bridge over a flooded tributary. The later Dan crossing uses boats.
  w.box(86,.02,18,w.mat(0x668c99,{roughness:.28,metalness:.1}),0,-.2,-137);w.box(6,.15,23,0x8f8066,-22,.01,-137);for(const x of [-24.8,-19.2])w.box(.13,1.15,23,0x77644b,x,.575,-137);
  w.box(86,.03,28,w.mat(0x698b97,{roughness:.27}),0,-.18,-249);w.box(6,.13,10,0x8b7a5a,0,.05,-233);
  for(const [x,z,width,depth] of [[0,9,24,19],[-18,-55,9,24],[-22,-94,8,48],[-18,-178,8,66],[0,-223,20,22]])w.box(width,.02,depth,0xa9a386,x,-.035,z);
  table(w,-4,20);v.horse=horse(w,0x7a5841,'ROWAN');v.rider=horse(w,0x4f4b43,'RUNNER');v.rider.userData.rider.traverse(a=>{if(a.material?.color?.getHex()===0x79724b)a.material.color.setHex(0x933f35);});v.rider.visible=false;v.horse.userData.rider.visible=false;
  v.labels.push(w.label('EXTRA CANVAS',-7,1.7,11,2.4),w.label('FOOD / ORDERS',7,1.7,11,2.3),w.label('DISPATCH',-18,1.5,-54,1.9),w.label('RAISED CROSSING',-22,1.6,-158,2.7),w.label('DAN LANDING',0,1.7,-222,2.5));
  for(const x of [-7,7])w.box(1.8,.5,1.4,0xa8a388,x,.25,10);v.packet=w.box(.55,.025,.38,0xd1c6a9,-18,.1,-55);
  v.boats=[];for(let i=0;i<3;i++){const boat=w.group(-18+i*18,0,-242);w.box(3,.45,6,0x726047,0,.13,0,boat);for(const x of [-1.45,1.45])w.box(.14,.7,6,0x7d684d,x,.4,0,boat);for(let j=0;j<3;j++)w.box(2.7,.12,.55,0x9a8564,0,.4,-1.7+j*1.7,boat);v.boats.push(boat);}
  w.wagon(19,-225);w.lantern(-5,2,-226,false);
 }
}
function squad(v,q,t){q.squad.forEach((a,i)=>{const m=v.squad[i],moving=v.lastSquad[i]&&Math.hypot(a.x-v.lastSquad[i].x,a.z-v.lastSquad[i].z)>.001;m.visible=true;m.position.set(a.x,0,a.z);m.rotation.y=a.yaw;m.userData.legs.forEach((l,j)=>l.rotation.x=moving?Math.sin(t*7+i+j*Math.PI)*.28:0);m.userData.flash.visible=q.volley>4.8;});v.lastSquad=q.squad.map(a=>({...a}));}
export function renderChase(w,s,input,voice){
 const v=w.chaseVisual,q=s.chase,p=s.player,t=s.time,act=(k,x,z,pose='listen')=>w.setActor(k,x,z,face(x,z,p.x,p.z),pose,t,voice===k);v.labels.forEach(a=>a.visible=true);
 if(s.level==='cowpens'){
  if(s.stage===0)act('WARD',-4,20,'paper');if(q.formed){squad(v,q,t);const a=q.squad[0];act('WARD',a.x-1,a.z,'walk');act('ASA',a.x+10,a.z,'point');}
  v.army.forEach((a,i)=>{a.visible=!q.surrender;a.position.z=q.armyZ-9-Math.floor(i/9)*3;a.userData.legs.forEach((l,j)=>l.rotation.x=Math.sin(t*6+i+j*Math.PI)*.2);a.userData.flash.visible=t%9<.1&&i%5===0;});return;
 }
 if(!q.mounted){act('WARD',-4,20,'paper');act('MARA',3,17,'give');act('RUNNER',-5,21,'paper');}
 v.packet.visible=!q.packet;v.horse.visible=true;v.horse.position.set(q.horseX,q.hoofY,q.horseZ);v.horse.rotation.y=q.horseYaw;v.horse.userData.packs.forEach(a=>a.visible=q.load==='heavy');v.horse.userData.rider.visible=q.mounted;poseHorse(v.horse,t,q.speed,voice);
 v.rider.visible=q.pursuit&&!q.delivered;if(v.rider.visible){v.rider.position.set(q.riderX,0,q.riderZ);v.rider.rotation.y=v.lastHorse?face(v.lastHorse.x,v.lastHorse.z,q.riderX,q.riderZ):0;poseHorse(v.rider,t,5.3);v.lastHorse={x:q.riderX,z:q.riderZ};}
 if(s.stage>=4){act('RUNNER',3,-225,'paper');act('MARA',8,-224,'reach');}
}
export function chaseCamera(w,s){if(!chaseMounted(s))return;const p=s.player,c=w.camera,back=5.2,up=3.6;c.position.set(p.x+Math.sin(p.yaw)*back,p.y+up+Math.sin(p.pitch)*2,p.z+Math.cos(p.yaw)*back);c.lookAt(p.x-Math.sin(p.yaw)*4,p.y+1.75+Math.sin(p.pitch)*5,p.z-Math.cos(p.yaw)*4);c.fov=70+Math.min(6,s.chase.speed*.65);c.updateProjectionMatrix();}
export function filmChase(w,key,beat,t,elapsed,speaking){
 const v=w.chaseVisual,spec=CHASE_SCENES[key],voice=speaking?CHASE_LINES.find(l=>l.id===spec.lines[beat])?.speaker:null,act=(k,x,z,tx,tz,pose='listen')=>w.setActor(k,x,z,face(x,z,tx,tz),pose,t,voice===k);v.labels.forEach(a=>a.visible=false);
 if(key==='chaseIntro'){
  act('ROWAN',0,23,-3,23,'paper');act('WARD',-3,23,0,23,'give');act('ASA',3,23,0,23,'point');
  v.squad.forEach((a,i)=>{a.visible=true;a.position.set((i-2.5)*1.6,0,-36);a.userData.gun.visible=true;});v.army.forEach((a,i)=>{a.visible=true;a.position.z=-66-Math.floor(i/9)*3+Math.min(3,elapsed*.12);});if(beat===5){act('ROWAN',0,-34,0,-66,'point');act('WARD',4,-34,0,-66);act('ASA',-5,-34,0,-66);}return;
 }
 if(key==='chaseVictory'){
  v.army.forEach(a=>a.visible=false);v.squad.forEach((a,i)=>{a.visible=true;a.position.set(-12+i*1.8,0,-47);a.userData.gun.rotation.x=-.6;});v.prisoners.forEach(a=>a.visible=true);
  act('ROWAN',0,-46,-3,-46,'paper');act('WARD',-3,-46,0,-46);act('RUNNER',-5,-46,0,-46,'paper');act('ASA',3,-46,0,-46,'point');act('MARA',7,-42,7,-43,'kneel');return;
 }
 v.rider.visible=false;v.packet.visible=key==='chaseRoad';v.horse.userData.rider.visible=false;v.horse.position.set(key==='chaseEnding'?-7:0,0,key==='chaseEnding'?-223:0);v.horse.rotation.y=key==='chaseEnding'?Math.PI/2:0;poseHorse(v.horse,t,0);
 const z=key==='chaseEnding'?-221:23;act('ROWAN',0,z,3,z,'paper');act('WARD',-3,z,0,z);act('MARA',3,z,0,z,'reach');act('RUNNER',-5,z,0,z,'paper');
 if(key==='chaseRoad'&&beat===5){v.horse.userData.rider.visible=true;poseHorse(v.horse,t,0,voice);w.cast.ROWAN.visible=false;}
 if(key==='chaseEnding'){v.boats.forEach((a,i)=>{a.position.z=-242-Math.min(8,elapsed*.25);a.position.x=-18+i*18+Math.sin(elapsed*.25+i)*.6;});if(beat===6)act('WARD',-3,z,-7,-223,'reach');}
}
