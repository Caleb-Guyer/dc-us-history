import * as T from './three.module.js';
import {PHILADELPHIA_BLOCKS,philadelphiaDefending} from './c6-philadelphia.mjs?v=4.15.0-published';
import {PHILADELPHIA_LINES,PHILADELPHIA_SCENES} from './c6-philadelphia-story.mjs?v=4.15.0-published';
const face=(x,z,tx,tz)=>Math.atan2(-(tx-x),-(tz-z)),smooth=t=>(t=Math.max(0,Math.min(1,t)))*t*(3-2*t);
function actor(w,key,x,z,tx,tz,pose,t,voice){return w.setActor(key,x,z,face(x,z,tx,tz),pose,t,key===voice);}
function table(w,x,z,width=8,depth=3){w.box(width,.16,depth,0x716249,x,1.04,z);for(const dx of [-width/2+.2,width/2-.2])for(const dz of [-depth/2+.2,depth/2-.2])w.box(.13,1,.13,0x514c3a,x+dx,.5,z+dz);}
function journal(w,x,y,z,parent=w.scene){const g=new T.Group();g.position.set(x,y,z);parent.add(g);w.box(.8,.13,1.1,0x645742,0,0,0,g);w.box(.73,.085,1.04,0xcfc1a1,0,.025,0,g);for(const zz of [-.3,.3])w.box(.84,.02,.06,0x383d32,0,.081,zz,g);return g;}
function mapTexture(){const c=document.createElement('canvas');c.width=1024;c.height=1024;const x=c.getContext('2d');x.fillStyle='#c4b797';x.fillRect(0,0,1024,1024);x.strokeStyle='#8b7758';x.lineWidth=4;for(let i=0;i<11;i++){x.beginPath();x.moveTo(55+i*75,80);x.bezierCurveTo(60+i*80,400,600,500,1000,580+i*18);x.stroke();}x.strokeStyle='#596e75';x.lineWidth=18;x.beginPath();x.moveTo(730,170);x.bezierCurveTo(760,400,640,530,690,870);x.stroke();x.fillStyle='#373d35';x.font='bold 44px Georgia';x.fillText('ALBANY',630,320);x.font='31px Georgia';x.fillText('MONTREAL',610,95);x.fillText('OSWEGO',180,360);x.fillText('NEW YORK',630,925);x.fillText('PHILADELPHIA',90,850);x.fillText('HUDSON',750,570);x.font='bold 27px Georgia';x.fillText('GERMAIN / NORTH · 1777',55,980);x.setLineDash([16,12]);x.strokeStyle='#943f35';x.lineWidth=7;for(const [sx,sz] of [[705,125],[310,370],[690,850]]){x.beginPath();x.moveTo(sx,sz);x.lineTo(680,345);x.stroke();}x.setLineDash([]);const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;return texture;}
function narrowBridge(w,x,width,v){const g=w.group(x,0,-55);for(let i=0;i<20;i++)w.box(width,.14,.76,0x8e7b58,0,.04,8-i*.8,g);for(const dx of [-width/2+.12,width/2-.12]){w.box(.18,.2,17,0x4d503e,dx,-.12,0,g);for(const zz of [-7.5,-3.5,.5,4.5,7.5])w.cyl(.07,1.35,0x71674c,dx,.55,zz,g);w.box(.07,.08,17,0x837652,dx,1.12,0,g);}v.bridges.push(g);return g;}
function bandage(w){const a=w.cast.CLERK;w.box(.25,.09,.12,0xddd2b9,.22,1.46,-.14,a);const sling=w.box(.36,.18,.13,0xc4b9a0,.14,1.12,-.27,a);sling.rotation.z=-.2;}
export function buildPhiladelphia(w,level){const v=w.philadelphiaVisual={level,others:[],wagons:[],bridges:[],planks:[],guards:[],door:null,carry:null,load:[],mapMarker:null};for(const key of ['ROWAN','WARD','MARA','ISAIAH','RUNNER','CLERK'])w.actor(key,0,0);bandage(w);
 const hall=level==='recordshall';w.scene.background=new T.Color(hall?0x152c3b:0x829ba7);w.scene.fog=new T.FogExp2(hall?0x364650:0xb4b8a2,hall?.012:.007);w.sun.intensity=hall?.55:2;w.sun.color.setHex(hall?0xa2bcd3:0xe2d5ad);
 const ground=w.mat(hall?0x8c856d:0xa6ab80,{map:w.groundTexture});if(level==='congressroad'){w.box(95,.2,76,ground,0,-.15,-8);w.box(95,.2,52,ground,0,-.15,-90);w.box(8,.025,76,0xada080,0,-.035,-8);w.box(8,.025,52,0xada080,0,-.035,-90);}else{w.box(hall?36:95,.2,hall?47:158,ground,0,-.15,hall?3:-35);if(!hall)w.box(8,.025,138,0xada080,0,-.035,-35);}
 for(const [x,z,width,depth,height] of PHILADELPHIA_BLOCKS[level]){if(level==='recordshall'){if(height>3)w.box(width,height,depth,w.mat(0x929585,{map:w.stoneTexture}),x,height/2,z);else table(w,x,z,width,depth);}else if(height>3)w.house(x,z,width,depth,height,0x748173);else{w.box(width,height,depth,w.mat(0x969986,{map:w.stoneTexture}),x,height/2,z);w.box(width+.05,.10,depth+.08,0xb4af97,x,height+.04,z);}}
 v.wagon=w.wagon(level==='brandywine'?6:0,level==='brandywine'?27:18);v.blanket=w.box(2,.04,2.7,0xa7a187,6,.03,27);v.blanket.visible=level==='brandywine';
 for(let i=0;i<3;i++)v.load.push(journal(w,.3,1.22+i*.15,.2,v.wagon));v.case=w.box(1.8,.55,1.1,0x6e614c,0,1.26,1,v.wagon);v.case.visible=level!=='brandywine';
 v.carry=new T.Group();w.camera.add(v.carry);v.carry.position.set(0,-.62,-1.08);v.carry.scale.setScalar(.65);v.carry.rotation.x=.10;for(let i=0;i<3;i++)journal(w,0,i*.14,0,v.carry);v.carry.visible=false;
 if(level==='brandywine'){
  w.trees(80,'brandywine');w.flag(-16,-8,0xb9bea1);for(let i=0;i<13;i++){const a=w.soldier();a.position.set(-28+i%3*2,0,-24+Math.floor(i/3)*3);v.others.push(a);}
  for(let i=0;i<2;i++){const a=w.wagon(-16-i*7,8);a.rotation.y=-Math.PI/2;v.wagons.push(a);}w.label('WITHDRAWAL LANE',-16,2.6,1,3.1);return;
 }
 if(hall){
  v.binding=journal(w,-5,1.08,10);
  for(const x of [-14.3,14.3])for(const z of [-11,-3,5]){w.box(.12,2,1.2,0x2a3836,x,3,z);w.box(.14,.08,1.3,0x5d695c,x,3,z);w.box(.14,2,.07,0x5d695c,x,3,z);}
  w.box(30,.06,29,w.mat(0x85765a,{map:w.woodTexture}),0,-.015,-1);w.box(32,.4,3,0x77776a,0,5.8,11);for(const x of [-14,14])w.box(.45,6,.45,0x797b6d,x,3,11);
  for(const [x,z] of [[-8,2],[8,2],[-9,-10]])for(let i=0;i<4;i++)journal(w,x+(i-1.5)*1.2,1.2+i%2*.08,z);
  const map=w.mesh(new T.PlaneGeometry(5.5,4.8),w.mat(0xffffff,{map:mapTexture()}),7,1.14,-8);map.rotation.x=-Math.PI/2;v.map=map;v.mapMarker=w.cyl(.09,.22,0x963e35,7.2,1.26,-8.5);v.northMarker=w.cyl(.08,.20,0x536d75,8.2,1.25,-9.1);
  for(const x of [-12,0,12])w.lantern(x,2.2,4);w.lantern(5,2,-7);w.box(4,.08,3.5,0x96947a,0,2.35,18);for(const x of [-1.7,1.7])w.cyl(.05,2.5,0x5b5541,x,1.1,18);return;
 }
 // The river has two usable crossings after the central timber gives way.
 w.box(94,.28,16,w.mat(0x466c70,{roughness:.35,metalness:.32}),0,-.36,-55);for(const z of [-46.8,-63.2])w.box(94,.15,.45,0x6d816c,0,-.1,z);narrowBridge(w,23,9.2,v);narrowBridge(w,-22,4.2,v);
 const center=w.group(0,0,-55);v.centerBridge=center;for(let i=0;i<21;i++){const plank=w.box(8.8,.15,.76,0x938362,0,.05,8-i*.8,center);plank.userData.z=plank.position.z;v.planks.push(plank);}for(const dx of [-3.8,3.8])w.box(.2,.22,17,0x585c46,dx,-.15,0,center);
 v.gate=w.group(18.5,0,-35);w.box(9,.95,.14,0x857457,4.5,.55,0,v.gate);for(const x of [19,27])w.cyl(.1,1.7,0x575641,x,.8,-35);w.label('CART DETOUR',23,2.7,-32,3.3);w.label('FOOTBRIDGE',-22,2.5,-34,3);w.label('WESTERN ROAD',0,3,-93,3);
 // Keep trunks on the outer banks, clear of the river and every usable crossing.
 for(let i=0;i<32;i++){const z=23-i*4.1;if(z<-45&&z>-65)continue;const x=(i%2?-1:1)*(35+i%5*1.5),height=6+i%4;w.cyl(.19,height,0x615c46,x,height/2,z);w.mesh(new T.ConeGeometry(2.3,5.8,9),0x60785a,x,height-1,z);w.mesh(new T.ConeGeometry(1.6,4.6,9),0x748864,x,height+1,z);}
 w.box(5.4,5,.35,w.mat(0x918f81,{map:w.stoneTexture}),32,2.5,18);v.door=w.group(30.6,0,18.25);w.box(2.8,3.8,.16,0x594b38,1.4,1.9,0,v.door);w.label('PHILADELPHIA',32,4.4,18.45,3.5);for(const x of [29,35]){const g=w.soldier(true);g.position.set(x,0,20);g.rotation.y=Math.PI;v.guards.push(g);g.visible=false;}
}
function cart(w,q){const v=w.philadelphiaVisual;v.wagon.position.set(q.wagonX,0,q.wagonZ);v.wagon.rotation.y=q.wagonYaw;v.wagon.userData.wheels.forEach(a=>a.rotation.x=-q.wagonTravel/0.65);v.case.visible=true;v.load.forEach(a=>a.visible=q.route!=='foot'||q.holding!== 'journals'&&!q.recordsSecured);v.gate.rotation.y=q.gate?-1.6:0;v.planks.forEach((a,i)=>{const fall=q.bridgeBroken?smooth(q.collapse)*Math.sin((i+1)*1.7):0;a.position.y=.05-Math.abs(fall)*1.8;a.rotation.x=fall*.65;a.rotation.z=fall*.25;});}
export function renderPhiladelphia(w,s,input,voice){const v=w.philadelphiaVisual,q=s.philadelphia,p=s.player,t=s.time,act=(key,x,z,pose='listen')=>actor(w,key,x,z,p.x,p.z,pose,t,voice);v.carry.visible=s.level==='recordshall'&&q.holding==='journals'||s.level==='congressroad'&&q.route==='foot'&&q.holding==='journals';
 if(s.level==='brandywine'){
  act('WARD',-4,24,'brace');act('MARA',7,27,q.rescued?'tend':'listen');act('ISAIAH',10,29);act('RUNNER',-12,11,'point');
  if(s.carrying){actor(w,'CLERK',p.x+Math.cos(p.yaw)*.95-Math.sin(p.yaw)*.9,p.z-Math.sin(p.yaw)*.95-Math.cos(p.yaw)*.9,p.x-Math.sin(p.yaw)*3,p.z-Math.cos(p.yaw)*3,input.forward||input.back||input.left||input.right?'walk':'listen',t,voice).rotation.z=.12;}
  else if(q.rescued)act('CLERK',6,27,'kneel').position.y=-.4;else if(s.stage>=3)act('CLERK',-21,-10,'kneel').position.y=-.4;
  v.others.forEach((a,i)=>{a.position.z=-24+Math.floor(i/3)*3+Math.min(55,(s.stage>=2?q.clock:t)*1.25);a.userData.legs.forEach((leg,j)=>leg.rotation.x=Math.sin(t*7+j*Math.PI+i)*.28);});v.wagons.forEach((a,i)=>{a.position.z=8+Math.min(24,q.clock*.6+i*2);a.userData.wheels.forEach(wheel=>wheel.rotation.x=-q.clock*.5);});return;
 }
 if(s.level==='recordshall'){
  v.binding.visible=s.stage===0;act('CLERK',-6,10,'paper');act('WARD',-5,12,'paper');act('MARA',3,18,'work');act('ISAIAH',4,22);act('RUNNER',-3,21);v.load.forEach(a=>a.visible=q.journals);v.mapMarker.position.set(q.marked?5:7.2,1.26,q.marked?-6.2:-8.5);return;
 }
 cart(w,q);act('WARD',-3,-89,'point');act('ISAIAH',-3,-73,'listen');act('RUNNER',4,-87,'paper');const moving=q.crewStarted&&q.crewStep<5,point={x:q.crewX-Math.sin(q.crewYaw)*4,z:q.crewZ-Math.cos(q.crewYaw)*4};actor(w,'MARA',q.crewX,q.crewZ,point.x,point.z,moving?'walk':'listen',t,voice);actor(w,'CLERK',q.crewX+1,q.crewZ+1,point.x,point.z,moving?'walk':'listen',t,voice);v.guards.forEach(g=>g.visible=false);
}
export function filmPhiladelphia(w,key,beat,time,elapsed,speaking){const v=w.philadelphiaVisual,scene=PHILADELPHIA_SCENES[key],voice=speaking?PHILADELPHIA_LINES.find(l=>l.id===scene.lines[beat])?.speaker:null,act=(key,x,z,tx,tz,pose='listen')=>actor(w,key,x,z,tx,tz,pose,time,voice);v.carry.visible=false;
 if(key==='philadelphiaIntro'){
  act('RUNNER',4,22,0,23,'point');act('ROWAN',0,23,-3,22);act('WARD',-3,22,0,23,'point');act('MARA',5,27,0,23,'reach');act('ISAIAH',9,29,5,27,'work');v.wagons.forEach((a,i)=>a.position.z=8+smooth(elapsed/35)*20+i*2);v.others.forEach((a,i)=>{a.position.z=-15+i%5*4+Math.min(32,elapsed*1.25);a.userData.legs.forEach((l,j)=>l.rotation.x=Math.sin(elapsed*7+j*Math.PI+i)*.28);});
 }else if(key==='philadelphiaWounded'){
  act('ROWAN',0,27,-3,26);act('WARD',-3,26,0,27);act('CLERK',6,27,0,27,'kneel').position.y=-.4;act('MARA',7,27,6,27,'tend');act('ISAIAH',9,29,7,27);act('RUNNER',-5,29,0,27);v.others.forEach(a=>a.visible=false);v.wagons.forEach(a=>a.visible=false);
 }else if(key==='philadelphiaRecords'){
  v.binding.visible=beat<3;const pull=beat<2?smooth(time/4):1;act('CLERK',-6,10,-4,10,'reach');act('MARA',-4,10,-6,10,'reach');act('ROWAN',-1,8,beat>=2?2:-6,beat>=2?8:10,'paper');act('WARD',2,8,-1,8,'paper');act('ISAIAH',4,19,0,18,'work');act('RUNNER',-3,19,0,18,'work');v.load.forEach(a=>a.visible=false);w.cast.CLERK.userData.arms?.forEach(a=>a.rotation.x+=pull*.05);
 }else if(key==='philadelphiaExit'){
  v.binding.visible=false;act('ROWAN',0,21,-4,21);act('WARD',-4,21,0,21);act('MARA',4,21,0,21,'reach');act('CLERK',6,22,0,21,'paper');act('ISAIAH',3,24,0,18,'work');act('RUNNER',-3,23,0,18);v.load.forEach(a=>a.visible=true);
 }else{
  v.guards.forEach(a=>a.visible=beat===0);v.door.rotation.y=-1.5*(1-smooth(elapsed/6));v.planks.forEach(a=>a.visible=true);v.gate.rotation.y=-1.6;v.wagon.visible=false;
  act('RUNNER',4,-87,0,-87,'paper');act('ROWAN',0,-87,3,-87,beat===3?'reach':'listen');act('CLERK',-4,-86,0,-87,'paper');const m=act('MARA',3,-87,0,-87,beat===3?'reach':'listen');if(beat===3)m.position.x=3-smooth(time/4)*1.15;act('WARD',-3,-89,0,-87,'point');act('ISAIAH',6,-89,0,-87);
 }
}
