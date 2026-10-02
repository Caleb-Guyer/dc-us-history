import * as T from './three.module.js';
import {makeActor,poseActor} from './c5-actors.mjs?v=4.17.0-published';
import {INLAND_BLOCKS,inlandWithdrawing,inlandEscorting} from './c6-inland.mjs?v=4.17.0-published';
import {INLAND_SCENES,INLAND_LINES} from './c6-inland-story.mjs?v=4.17.0-published';
const face=(x,z,tx,tz)=>Math.atan2(-(tx-x),-(tz-z));
const actor=(w,k,x,z,tx,tz,pose,t,voice)=>w.setActor(k,x,z,face(x,z,tx,tz),pose,t,voice===k);
function table(w,x,z){w.box(2,.1,1.2,0x887356,x,.9,z);for(const a of [-.85,.85])for(const b of [-.45,.45])w.box(.1,.9,.1,0x615940,x+a,.45,z+b);return w.box(.75,.012,.5,0xd1c5a7,x,.967,z);}
function door(w,x,z,width){const hinge=w.group(x-width/2,0,z);w.box(width,2.6,.12,w.mat(0x75654e,{map:w.woodTexture}),width/2,1.3,0,hinge);w.box(width-.15,.09,.15,0x454539,width/2,1.2,.1,hinge);return hinge;}
function woods(w){for(let i=0;i<64;i++){const x=(i%2?-1:1)*(35+i%5*1.7),z=29-Math.floor(i/2)*3,h=6+i%4;w.cyl(.22,h,0x605740,x,h/2,z);w.mesh(new T.ConeGeometry(3,6,9),0x6b7651,x,h,z);}for(const x of [-31,31])for(const z of [20,-42]){w.cyl(.2,6,0x6d6048,x,3,z);w.sphere(2.3,0x7d8355,x,6,z,undefined,[1,1.4,1]);}}
function animate(v,t){if(v.flames){v.flames.forEach((a,i)=>a.scale.y=.9+Math.sin(t*6+i)*.1);v.fireLight.intensity=v.flames[0].visible?12+Math.sin(t*10)*2:0;}}
export function buildInland(w,level){const v=w.inlandVisual={level,squad:[],line:[],lastSquad:[],signs:[],front:null,rear:null,family:[],lastFamily:null};for(const k of ['ROWAN','MARA','WARD','ASA','RUNNER','THOMAS','CLERK','MERCHANT','TENANT','NEIGHBOR','FATHER','MOTHER','ANNE'])w.actor(k,0,0);const night=level==='countrystandoff';w.scene.background=new T.Color(night?0x2b404a:0x9da99f);w.scene.fog=new T.FogExp2(night?0x435954:0xb5bba4,night?.008:.006);w.sun.intensity=night?.85:2;w.sun.color.setHex(night?0xb5c7d1:0xf0dfbc);w.box(100,.2,115,w.mat(0x929977,{map:w.groundTexture}),0,-.15,-20);w.box(7,.02,96,0xa6a083,0,-.038,-16);woods(w);
 for(const [x,z,width,depth,h] of INLAND_BLOCKS[level]){if(level==='countrystandoff'&&Math.abs(x)<8)w.box(width,h,depth,w.mat(0x8d8068,{map:w.woodTexture}),x,h/2,z);else if(h>3)w.house(x,z,width,depth,h,0x7f8066);else w.box(width,h,depth,w.mat(0x81765b,{map:w.woodTexture}),x,h/2,z);}
 if(level==='camdenfall'){
  table(w,-4,20);w.box(1,.6,1,0x776445,-8,.3,9);for(let i=0;i<4;i++){const a=w.soldier();v.squad.push(a);a.visible=false;}
  for(let i=0;i<12;i++){const a=w.soldier(true);a.position.set((i%6-2.5)*4.3,0,-57-Math.floor(i/6)*4);a.rotation.y=Math.PI;v.line.push(a);}for(const [x,z] of [[-19,-7],[-19,17],[0,25]])v.signs.push(w.label('WITHDRAWAL',x,1.8,z,1.8));
 }else if(level==='oathroad'){
  table(w,-4,19);table(w,-8,0);table(w,8,0);table(w,-4,-34);v.signs.push(w.label('WITNESS OATH',-8,1.7,1,2.4),w.label('REFUSAL / RELEASE',8,1.7,1,2.5));v.gate=door(w,0,-45,6);w.box(11,1.3,.14,0x78664b,-9, .65,-45);w.box(11,1.3,.14,0x78664b,9,.65,-45);w.lantern(0,2.5,-47,false);
 }else if(level==='countrystandoff'){
  // A hollow house allows an actual household to pass through either cleared door.
  w.box(1.6,2.4,.4,w.mat(0x8d8068,{map:w.woodTexture}),-4.2,3.3,-11);w.box(5.2,2,.4,w.mat(0x8d8068,{map:w.woodTexture}),0,3.6,-11);w.box(3,2,.4,w.mat(0x8d8068,{map:w.woodTexture}),5,3.6,-25);
  w.box(14,.14,14,0x897a5c,0,-.03,-18);w.box(14.5,.18,14.5,0x686e58,0,4.6,-18);v.front=door(w,0,-11,5.2);v.rear=door(w,5,-25,3);w.box(12,.11,1.5,0x72664e,0,.03,-9.5);w.box(1.5,1.5,.04,w.mat(0xe6bb79,{emissive:0xe6ba79,emissiveIntensity:.25,transparent:true,opacity:.12}),-4.2,1.35,-10.76);w.box(2.2,.1,1.2,0x796347,-2,.6,-19);
  for(const k of ['FATHER','MOTHER']){const a=makeActor(k);w.scene.add(a);v.family.push(a);}const child=makeActor('MOTHER');child.scale.setScalar(.61);w.scene.add(child);v.family.push(child);
  v.flames=[];for(let i=0;i<4;i++)v.flames.push(w.mesh(new T.ConeGeometry(.22,1.4,7),w.mat(0xffb262,{emissive:0xf6a34a,emissiveIntensity:1.3,transparent:true,opacity:.75}),-.9+i*.6,.9,-9.8));v.fireLight=new T.PointLight(0xffbe73,12,13);v.fireLight.position.set(0,2,-9);w.scene.add(v.fireLight);
  w.cyl(1.2,.8,0x807b67,-18,.4,12);w.cyl(.9,.08,0x719799,-18,.81,12);v.bucket=new T.Group();w.camera.add(v.bucket);v.bucket.position.set(.45,-.58,-1.1);w.cyl(.24,.38,0x716650,0,0,0,v.bucket);w.cyl(.2,.015,0x8ea6a3,0,.2,0,v.bucket);v.bucket.visible=false;
  table(w,-18,-8);v.signs.push(w.label('FENCE CLAIM / WITNESS',-18,1.8,-6.8,2.8),w.label('GARDEN DOOR',5,1.8,-28,2.2,Math.PI));v.torch=new T.Group();w.cast.NEIGHBOR.userData.hands[0].add(v.torch);v.torch.position.set(0,-.05,0);v.torch.rotation.x=-.8;w.cyl(.05,.8,0x72573c,0,0,0,v.torch);v.torchFlame=w.mesh(new T.ConeGeometry(.17,.6,6),w.mat(0xffbe62,{emissive:0xeeab45,emissiveIntensity:1.5}),0,.65,0,v.torch);w.lantern(0,2.6,25,true);
 }else{
  table(w,-4,19);table(w,-5,-38);v.wagon=w.wagon(0,-14);v.cloth=w.group(12,.8,8);for(let i=0;i<4;i++)w.box(.9,.09,.65,0xc5c3b2,0,i*.09,0,v.cloth);w.box(2,.1,1.3,0x887457,12,.74,8);v.carried=new T.Group();w.camera.add(v.carried);v.carried.position.set(.35,-.68,-.95);for(let i=0;i<4;i++)w.box(.55,.08,.55,0xbdbba9,0,i*.06,0,v.carried);v.carried.visible=false;for(const [x,z] of [[-19,-18],[17,-26]])table(w,x,z);w.lantern(-5,2,-39,false);
 }
}
function household(w,v,x,z,yaw,moving,t,voice){for(let i=0;i<3;i++){const a=v.family[i],ox=i===1?.85:i===2?1.25:0,oz=i===2?.7:0;a.visible=true;a.position.set(x+Math.cos(yaw)*ox+Math.sin(yaw)*oz,0,z-Math.sin(yaw)*ox+Math.cos(yaw)*oz);a.rotation.y=yaw;poseActor(a,{time:t,pose:moving?'walk':'listen',speaking:voice===(i===0?'FATHER':i===1?'MOTHER':'')});}}
export function renderInland(w,s,input,voice){const v=w.inlandVisual,q=s.inland,p=s.player,t=s.time,act=(k,x,z,pose='listen')=>actor(w,k,x,z,p.x,p.z,pose,t,voice);v.signs.forEach(a=>a.visible=true);animate(v,t);
 if(s.level==='camdenfall'){
  act('WARD',-4,20,'paper');if(q.squad.length){q.squad.forEach((a,i)=>{const m=v.squad[i],moving=v.lastSquad[i]&&Math.hypot(a.x-v.lastSquad[i].x,a.z-v.lastSquad[i].z)>.001;m.visible=true;m.position.set(a.x,0,a.z);m.rotation.y=a.yaw;m.userData.legs.forEach((l,j)=>l.rotation.x=moving?Math.sin(t*6+i+j*Math.PI)*.25:0);m.userData.flash.visible=q.volley>6.8;});v.lastSquad=q.squad.map(a=>({...a}));}else act('ASA',3,-31,'point');v.line.forEach(a=>a.visible=!q.rallied);return;
 }
 if(s.level==='oathroad'){act('CLERK',-3,1,'paper');act('FATHER',5,10,'paper');act('MOTHER',7,10);act('MERCHANT',-18,-9,'paper');act('TENANT',18,-17);act('THOMAS',-4,-34,'paper');v.gate.rotation.y=q.papers?-1.3:0;return;}
 if(s.level==='countrystandoff'){
  act('THOMAS',-5,-5,'point');act('NEIGHBOR',-3,-8.3,'point');act('WARD',-10,14,'point');v.bucket.visible=q.bucket;v.flames.forEach(a=>{a.visible=!q.doused&&q.window;a.scale.y*=.4+q.fire;});v.torch.visible=q.torch;v.front.rotation.y=q.route==='witness'?-1.4:0;v.rear.rotation.y=q.route==='rear'?1.4:0;
  const moving=v.lastFamily&&Math.hypot(q.familyX-v.lastFamily.x,q.familyZ-v.lastFamily.z)>.001,yaw=moving?face(v.lastFamily.x,v.lastFamily.z,q.familyX,q.familyZ):q.route==='rear'?0:Math.PI;household(w,v,q.familyX,q.familyZ,yaw,moving,t,voice);v.lastFamily={x:q.familyX,z:q.familyZ};if(!q.route){v.family[1].visible=false;act('MOTHER',-4,-13,'reach');}return;
 }
 act('WARD',0,22,'paper');act('MARA',3,22,'reach');act('ANNE',12,8,'reach');act('MOTHER',-19,-18,'paper');act('MERCHANT',17,-26,'paper');v.cloth.visible=!q.cloth;v.carried.visible=q.cloth&&!q.loaded;if(q.loaded)v.cloth.visible=true;if(q.loaded)v.cloth.position.set(.5,1.05,-14);
}
export function filmInland(w,key,beat,t,elapsed,speaking){const v=w.inlandVisual,spec=INLAND_SCENES[key],voice=speaking?INLAND_LINES.find(l=>l.id===spec.lines[beat])?.speaker:null,act=(k,x,z,tx,tz,pose='listen')=>actor(w,k,x,z,tx,tz,pose,t,voice);v.signs.forEach(a=>a.visible=false);animate(v,elapsed);
 if(key==='inlandIntro'){v.line.forEach((a,i)=>{a.position.z=-57-Math.floor(i/6)*4+Math.min(14,elapsed*.7);a.userData.legs.forEach((l,j)=>l.rotation.x=Math.sin(elapsed*6+i+j*Math.PI)*.22);a.userData.flash.visible=elapsed%7<.15&&i%3===0;});act('RUNNER',-5,23,0,23,'paper');act('WARD',-3,23,0,23,'point');act('ASA',-5,23,0,23,'brace');w.cast[beat===0?'ASA':'RUNNER'].visible=false;act('ROWAN',0,23,-3,23);return;}
 const notice=key==='inlandNotice',road=key==='inlandRetreat'||key==='inlandPassage',z=notice?-46:road?25:23;act('ROWAN',0,z,3,z,'paper');act('WARD',-3,z,0,z);act('MARA',3,z,0,z,'reach');act('RUNNER',-5,z,0,z,'paper');act('ASA',-5,z,0,z);w.cast[beat===0&&key==='inlandRetreat'||key==='inlandGreene'?'ASA':'RUNNER'].visible=false;
 if(notice||key==='inlandOath'||key==='inlandPassage'||key==='inlandHouse'){act('THOMAS',-3,z,0,z,'paper');w.cast.WARD.visible=key==='inlandHouse';if(key==='inlandPassage'){act('WARD',-5,z,0,z);w.cast.ASA.visible=false;}}
 if(key==='inlandRetreat'){v.line.forEach(a=>a.visible=false);v.squad.forEach((a,i)=>{a.visible=true;a.position.set(-12+i*1.8,0,21);a.userData.gun.visible=false;});}
 if(key==='inlandOath'){act('FATHER',5,10,7,10,'paper');act('MOTHER',7,10,5,10);}
 if(key==='inlandHouse'){
  v.bucket.visible=false;v.front.rotation.y=0;v.rear.rotation.y=0;v.flames.forEach(a=>a.visible=elapsed>2);v.torch.visible=true;v.torch.rotation.z=beat<2?-.45:0;act('NEIGHBOR',-3,-8.3,0,-11,'point');household(w,v,0,-18,Math.PI,false,t,voice);v.family[1].visible=false;act('MOTHER',-4,-13,-4,-5,'reach');v.torch.rotation.x=beat===0?-1.1:-.8;
 }
 if(key==='inlandPassage'){v.bucket.visible=false;v.flames.forEach(a=>a.visible=false);v.torch.visible=false;household(w,v,6,25,0,false,t,voice);v.front.rotation.y=-1.4;v.rear.rotation.y=1.4;}
 if(key==='inlandSupply'){act('ANNE',12,10,9,13,'reach');v.carried.visible=false;}
 if(key==='inlandEnding'){act('ASA',-5,23,0,23);w.cast.RUNNER.visible=false;v.carried.visible=false;v.cloth.position.set(.5,1.05,-14);}
}
