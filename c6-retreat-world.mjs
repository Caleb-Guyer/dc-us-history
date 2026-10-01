import * as T from './three.module.js';
import {RETREAT_BLOCKS,retreatBoating,retreatDefending} from './c6-retreat.mjs?v=4.11.0-published';
import {RETREAT_SCENES,RETREAT_LINES} from './c6-retreat-story.mjs?v=4.11.0-published';
const face=(x,z,tx,tz)=>Math.atan2(-(tx-x),-(tz-z));
const smooth=t=>(t=Math.max(0,Math.min(1,t)))*t*(3-2*t);
function ship(w,x,z,scale=1,prison=false){const g=w.group(x,-.55,z);g.scale.setScalar(scale);w.box(7,2,24,0x394343,0,.1,0,g);w.box(6.7,.2,22,0x7a7057,0,1.2,0,g);for(const side of [-1,1]){w.box(.3,1.2,21,0x53594d,side*3.3,1.65,0,g);for(let i=0;i<8;i++)w.box(.4,.6,.65,0x161f20,side*3.5,.8,-9+i*2.5,g);}for(const zz of [-6,2,8]){w.cyl(.13,18,0x6a6957,0,10,zz,g);for(const yy of [8,13]){const spar=w.cyl(.11,9,0x6a6957,0,yy,zz,g);spar.rotation.z=Math.PI/2;const sail=w.mesh(new T.PlaneGeometry(8,4),w.mat(prison?0x757b74:0xc7c6ad,{side:T.DoubleSide}),0,yy-2,zz,g);sail.rotation.y=.18;}}return g;}
function boat(w){const g=w.group(0,0,10);w.box(2.8,.24,6.4,0x4c4d3c,0,0,0,g);w.box(2.6,.09,6.2,0x9c8b65,0,.18,0,g);for(const x of [-1.45,1.45]){w.box(.12,.58,6.7,0x6e6449,x,.38,0,g);for(const z of [-1.6,0,1.7])w.box(2.8,.12,.5,0xb4a27b,0,.55,z,g);const bow=w.box(.13,.56,2,0x6e6449,x*.51,.36,-3.9,g);bow.rotation.y=x<0?-.74:.74;}
 const oars=[];for(const side of [-1,1]){const pivot=new T.Group();pivot.position.set(side*1.4,.61,1.5);g.add(pivot);const shaft=w.cyl(.043,3.4,0xbaa47a,side*1.4,0,0,pivot);shaft.rotation.z=Math.PI/2;w.box(.62,.07,.36,0x9c825b,side*2.9,-.06,0,pivot);oars.push(pivot);}g.userData.oars=oars;return g;}
function body(w,x,z){const a=w.soldier();a.userData.gun.visible=false;a.position.set(x,.24,z);a.rotation.z=1.45;w.box(.15,.11,.18,0xe0d8ba,.28,1.25,0,a);w.box(.08,.06,.19,0x715746,.28,1.24,-.015,a);return a;}
function tree(w,x,z,tone=0x667d4b){w.cyl(.18,5,0x6b6451,x,2.3,z);w.sphere(2.4,tone,x,6,z,undefined,[1,1.2,1]);w.sphere(1.9,tone,x+1.7,5.6,z+.5);}
function earth(w,x,z,width){w.box(width,.95,1.2,w.mat(0x7c7d65,{map:w.groundTexture}),x,.42,z);for(let i=0;i<width;i+=1.3){w.box(1.3,.3,1.25,0x969680,x-width/2+i+.6,.94,z);}}
function cast(w){for(const key of ['ROWAN','MARA','WARD','ISAIAH','THOMAS','RUNNER'])w.actor(key,0,0);}
export function buildRetreat(w,level){const v=w.retreatVisual={level,boat:null,oars:[],wounded:[],crowd:[],army:[],beam:null,door:null,signal:null,wagon:null};cast(w);
 if(level==='eastriver'){
  w.night=true;w.scene.background=new T.Color(0x142b3b);w.scene.fog=new T.FogExp2(0x334956,.008);w.sun.intensity=.7;w.sun.color.setHex(0xb7cfe5);
  const water=w.mesh(new T.PlaneGeometry(220,230,35,35),w.mat(0x385464,{metalness:.48,roughness:.35}),0,-.4,-45);water.rotation.x=-Math.PI/2;v.water=water;
  for(const z of [17,-106]){w.box(80,1.6,15,0x515c54,0,-.85,z);w.box(12,.18,12,0x897c60,0,.05,z>0?11:-101);for(let x=-6;x<6;x+=.6)w.box(.035,.012,12,0x4d554b,x,.153,z>0?11:-101);for(const x of [-5,5]){w.cyl(.12,2.4,0x6b6954,x,.2,z>0?10:-99);w.lantern(x,1.8,z>0?12:-103,z>0);}}
  for(const [x,z,a,b] of RETREAT_BLOCKS.eastriver){w.box(a,b*.18,b,0x615f4b,x,.02,z);w.box(a,.06,b,0x84785b,x,.15,z);for(let i=0;i<a;i+=.65)w.box(.05,.03,b,0x414b44,x-a/2+i,.2,z);const broken=w.box(a*.8,.2,.2,0xb2a37f,x,.45,z);broken.rotation.y=.32;}
  for(let i=0;i<7;i++)ship(w,(i%2?-1:1)*(50+i*8),-12-i*17,.75+i*.055,i>4);
  v.boat=boat(w);v.wounded=[body(w,2,14),body(w,-1,14)];v.litters=[];for(const x of [-1,2])v.litters.push(w.box(.85,.06,2.3,0xb4a183,x,.23,14));
  for(let i=0;i<6;i++){const a=w.soldier();a.userData.gun.visible=false;a.position.set(i%2?-5:5,0,20+Math.floor(i/2)*1.1);v.crowd.push(a);}
  for(let i=0;i<6;i++)w.house(-27+i*11,-119,6,8,4,0x58655f);
  return;
 }
 if(level==='cityrefuge'){
  w.box(72,.2,110,w.mat(0x919780,{map:w.groundTexture}),0,-.13,-20);w.box(7,.025,96,0x9e967c,0,-.015,-18);
  for(const [x,z,a,b,h] of RETREAT_BLOCKS[level])w.house(x,z,a,b,h,0x69746b);
  w.label('CUSTOMS|REGISTER AND PASSAGE',-13,2.7,7,4);w.box(4,.15,1.7,0x806b4a,-13,.8,9);w.label('RETURNED SEAL',-13,.89,9,1.2).rotation.x=-Math.PI/2;
  v.wagon=w.wagon(13,-11);w.box(1.3,.8,1.3,0x9b8b6b,14,.5,-12);w.label('NORTH GATE',-13,3,-26,3.4);
  v.door=w.group(-1.1,0,-44.8);w.box(2.2,2.5,.12,0x594f3e,1.1,1.25,0,v.door);w.label('NEIGHBORHOOD SHELTER',0,3.3,-44.6,4.5);
  v.daughter=w.soldier();v.daughter.userData.gun.visible=false;v.daughter.scale.setScalar(.86);v.daughter.position.set(-13,0,-24);
  for(let i=0;i<5;i++){const a=w.soldier();a.userData.gun.visible=false;a.position.set(10+i*.9,0,-9+i%2);v.crowd.push(a);}w.lantern(-14,2,8);w.lantern(3,2,-42);
  ship(w,70,-50,.9,true);return;
 }
 const plains=level==='whiteplains',harlem=level==='harlem';w.scene.background=new T.Color(plains?0x9eafb6:0xa5bbc2);w.scene.fog=new T.FogExp2(plains?0xa3afa6:0xaebaa6,.0055);
 w.box(80,.2,140,w.mat(plains?0x969378:0x839371,{map:w.groundTexture}),0,-.15,0);w.box(6,.025,135,0xa39a7d,0,-.04,2);
 for(const [x,z,a,b,h] of RETREAT_BLOCKS[level]){if(h>3)w.house(x,z,a,b,h);else if(b<a)earth(w,x,z,a);else{w.box(a,h,b,0x82785f,x,h/2,z);}}
 for(let i=0;i<22;i++){tree(w,(i%2?-1:1)*(28+i%5*3),29-i*4,plains?0x8e8455:0x6b7e4d);}
 for(let i=0;i<9;i++){const a=w.soldier();a.position.set(-18+i*4,0,7+(i%2)*4);a.rotation.y=0;v.crowd.push(a);}
 // The distant army is scenery, deliberately beyond the local fight's scope.
 for(let i=0;i<32;i++){const a=w.soldier(true);a.position.set(-39+i%8*10,0,-65-Math.floor(i/8)*8);a.scale.setScalar(.8);a.rotation.y=Math.PI;v.army.push(a);}
 v.haze=[];for(let i=0;i<9;i++){const a=new T.Sprite(new T.SpriteMaterial({map:w.smokeTexture,color:0xd9d2bc,opacity:.38,depthWrite:false}));a.position.set(-30+i*8,3+i%3,-24-i%2*15);a.scale.set(15,7,1);w.scene.add(a);v.haze.push(a);}
 v.wounded=[body(w,-19,12),body(w,19,5)];w.box(3,.1,3,0xada488,2,.06,53);v.wagon=w.wagon(plains?-17:8,plains?26:54);
 if(plains){v.beam=w.box(5,.22,.35,0x73644d,-17,.62,26);v.beam.rotation.y=.45;}
 if(harlem){v.signal=w.mesh(new T.PlaneGeometry(1,1.2),w.mat(0xd2c9a3,{side:T.DoubleSide}),-21,2,-10);v.signal.visible=false;w.cyl(.045,3,0x655d47,-21,1.5,-10);}
 if(!plains&&!harlem){w.box(3,.1,1.8,0x77684d,0,.72,17);for(let i=0;i<11;i++)ship(w,70+i%3*18,-52-Math.floor(i/3)*35,.7+i%3*.15);const water=w.mesh(new T.PlaneGeometry(145,210),w.mat(0x5c7a82,{metalness:.3,roughness:.45}),99,-.6,-73);water.rotation.x=-Math.PI/2;}
 w.flag(-24,24,0xb4ad8f);w.label(harlem?'WOODED FLANK':plains?'REAR WAGON ROAD':'BROOKLYN WORKS',harlem?-21:0,2.8,harlem?-13:57,3.8);
}
function act(w,key,x,z,tx,tz,pose,t,voice){return w.setActor(key,x,z,face(x,z,tx,tz),pose,t,voice===key);}
function decorateBattle(v,t,withdraw=false){v.haze?.forEach((a,i)=>{a.position.x=-30+i*8+Math.sin(t*.14+i)*3;a.material.opacity=.3+Math.sin(t*.2+i)*.06;});v.crowd.forEach((a,i)=>{a.visible=true;a.userData.flash.visible=!withdraw&&Math.sin(t*1.4+i*1.1)>.992;a.userData.arms.forEach(b=>b.rotation.x=withdraw?.3:1.02);if(withdraw){a.position.z=33+i*2;a.rotation.y=Math.PI;a.userData.legs.forEach((l,j)=>l.rotation.x=Math.sin(t*8+i+j*Math.PI)*.3);}});v.army.forEach((a,i)=>{a.userData.flash.visible=Math.sin(t*.9+i)>.995;});}
function boatRender(w,q,t,voice){const v=w.retreatVisual,g=v.boat;g.position.set(q.boatX,.06+Math.sin(t*1.1)*.045,q.boatZ);g.rotation.set(Math.sin(t*.8)*.012,q.boatYaw,q.balance*.1);g.userData.oars.forEach((a,i)=>a.rotation.y=q.lastOar===(i===0?'left':'right')?Math.sin(q.stroke*Math.PI)*.62:0);
 const pos=(x,z)=>({x:q.boatX+Math.cos(q.boatYaw)*x+Math.sin(q.boatYaw)*z,z:q.boatZ-Math.sin(q.boatYaw)*x+Math.cos(q.boatYaw)*z});
 if(q.aboard){const p=pos(0,2);const a=act(w,'ISAIAH',p.x,p.z,p.x-Math.sin(q.boatYaw),p.z-Math.cos(q.boatYaw),'row',t,voice);a.position.y=.32;
  if(q.cargo===6)for(const [key,x,z] of [['ROWAN',-.8,-1.4],['MARA',.8,-1.4],['WARD',-.8,.4]]){const p=pos(x,z),a=act(w,key,p.x,p.z,p.x-Math.sin(q.boatYaw),p.z-Math.cos(q.boatYaw),'row',t,voice);a.position.y=.21;a.scale.setScalar(.9);a.userData.arms?.forEach(arm=>arm.rotation.x=.1);}
  if(q.crossings>0){for(const [key,x,z] of [['ROWAN',-2,-102],['MARA',4,-104],['WARD',2,-103]])act(w,key,x,z,q.boatX,q.boatZ,key==='MARA'?'tend':'listen',t,voice);}
 }
 v.wounded.forEach((a,i)=>{const carried=q.cargo===8&&q.aboard,p=pos(i?-.7:.7,-1.3);a.visible=q.crossings<2&&(carried||q.crossings===0);a.position.set(carried?p.x:i?-1:2,carried?.55:.24,carried?p.z:14);a.rotation.set(0,carried?q.boatYaw:0,1.45);v.litters[i].visible=!carried&&q.crossings===0;});
 v.crowd.forEach((a,i)=>{a.visible=q.cargo!==8&&q.crossings===0||q.crossings===2;a.position.z=q.crossings===2?-106+Math.floor(i/2):20+Math.floor(i/2)*1.1;});
}
export function renderRetreat(w,s,input,voice){const v=w.retreatVisual,q=s.retreat,p=s.player,t=s.time;
 if(s.level==='eastriver'){boatRender(w,q,t,voice);if(!q.aboard){const z=q.crossings===2?-101:15;act(w,'ROWAN',0,z+2,0,z-5,'listen',t,voice);act(w,'MARA',3,z,0,z-5,'tend',t,voice);act(w,'WARD',-3,z+2,0,z-5,'listen',t,voice);act(w,'ISAIAH',-2,z-4,0,z,'listen',t,voice);}return;}
 if(s.level==='cityrefuge'){
  act(w,'THOMAS',s.stage<2?-13:0,s.stage<2?8:-42,p.x,p.z,'paper',t,voice);act(w,'WARD',3,-62,p.x,p.z,'listen',t,voice);v.door.rotation.y=q.shelter?-1.2:0;
  const a=v.daughter;a.position.set(q.escort?s.ward.x:q.reunited?12:-13,0,q.escort?s.ward.z:q.reunited?-9:-24);a.rotation.y=q.escort?s.ward.yaw:Math.PI;a.userData.legs.forEach((l,i)=>l.rotation.x=q.escort&&input.forward?Math.sin(t*8+i*Math.PI)*.25:0);v.crowd.forEach((a,i)=>{a.position.set(q.shelter?(-2+i):10+i*.9,0,q.shelter?-42:-9+i%2);});return;
 }
 const withdrawing=s.level==='harlem'?s.stage===3:s.stage>=2;decorateBattle(v,t,withdrawing);v.wounded.forEach((a,i)=>a.visible=s.level==='longisland'&&q.rescues<=i&&!s.carrying);
 if(s.level==='longisland'){act(w,'WARD',s.stage<2?-3:0,s.stage<2?9:59,p.x,p.z,s.stage<2?'brace':'listen',t,voice);act(w,'MARA',3,53,p.x,p.z,'tend',t,voice);}
 else if(s.level==='harlem'){v.signal.visible=q.signaled;act(w,'WARD',-5,19,p.x,p.z,'point',t,voice);act(w,'MARA',5,23,p.x,p.z,'listen',t,voice);act(w,'RUNNER',-21,-10,p.x,p.z,'brace',t,voice);}
 else{v.beam.visible=!q.beam;v.wagon.position.set(q.wagonX,0,q.wagonZ);v.wagon.userData.wheels.forEach(a=>a.rotation.x=-q.wagonMoved*2);act(w,'MARA',q.wagonX-2,q.wagonZ,p.x,p.z,s.stage===3?'walk':'listen',t,voice);act(w,'WARD',0,q.wardZ,0,q.wardZ+5,q.wardCalled?'run':'brace',t,voice);}
 // Carried person physically follows at the shoulder, rather than disappearing.
 if(s.carrying){const a=v.wounded[q.rescues];if(a){a.visible=true;a.position.set(p.x+Math.cos(p.yaw)*.6,.03,p.z-Math.sin(p.yaw)*.6);a.rotation.set(0,p.yaw,.25);a.userData.legs.forEach((l,i)=>l.rotation.x=Math.sin(t*6+i*Math.PI)*.13);}}
 if(q.shell>0){if(!v.danger){v.danger=w.mesh(new T.RingGeometry(2.7,2.9,32),new T.MeshBasicMaterial({color:0xe5b271,transparent:true,opacity:.75,side:T.DoubleSide}),q.shellX,.08,q.shellZ);v.danger.rotation.x=-Math.PI/2;}v.danger.visible=true;v.danger.position.set(q.shellX,.08,q.shellZ);}else if(v.danger)v.danger.visible=false;
}
export function retreatCamera(w,s,reduced){if(!retreatBoating(s))return;const q=s.retreat,p=s.player;if(w.cast?.ISAIAH)w.cast.ISAIAH.visible=false;w.camera.position.set(q.boatX+Math.sin(q.boatYaw)*2,2.05+(reduced?0:Math.sin(s.time*.9)*.035),q.boatZ+Math.cos(q.boatYaw)*2);w.camera.rotation.set(p.pitch,p.yaw+q.boatYaw,reduced?0:q.balance*.045);w.camera.fov=70;w.camera.updateProjectionMatrix();}
export function filmRetreat(w,key,beat,time,elapsed,speaking){const v=w.retreatVisual,scene=RETREAT_SCENES[key],id=scene.lines[beat],who=RETREAT_LINES.find(l=>l.id===id)?.speaker;const a=(key,x,z,tx,tz,pose='listen')=>act(w,key,x,z,tx,tz,pose,time,speaking?who:null);
 if(key==='retreatHandoff'){
  boatRender(w,{boatX:0,boatZ:10,boatYaw:0,balance:0,lastOar:'',stroke:0,aboard:false,cargo:6,crossings:0},elapsed,null);
  a('MARA',3,14,2,14,beat===0?'tend':'listen');a('ROWAN',0,15,-2,11,beat>=5?'reach':'listen');a('WARD',4,15,0,10,'paper');const isaiah=a('ISAIAH',-2,11,0,15,beat===4?'brace':beat===6?'row':'listen');if(beat===6){isaiah.position.x=-2+smooth(time/3)*2;isaiah.position.z=11+smooth(time/3)*1.5;}
 }else if(key==='retreatCrossed'){
  boatRender(w,{boatX:0,boatZ:-99,boatYaw:0,balance:0,lastOar:'',stroke:0,aboard:false,cargo:0,crossings:2},elapsed,null);a('ROWAN',0,-101,-2,-101,'reach');a('ISAIAH',-2,-101,0,-101,'paper');a('MARA',4,-103,2,-102,'tend');a('WARD',2,-102,0,-101,'listen');
 }else if(key==='retreatPeace'){a('RUNNER',-13,10,-10,9,'paper');a('ROWAN',-10,9,-15,9,'paper');a('WARD',-15,9,-10,9,'listen');a('MARA',-17,11,-10,9,'listen');v.door.rotation.y=0;
 }else if(key==='retreatCity'){v.door.rotation.y=-1.2;a('THOMAS',0,-42,-3,-43,'reach');a('ROWAN',-3,-43,0,-42,'paper');a('WARD',4,-43,-3,-43,'point');v.daughter.position.set(1,0,-44);v.crowd.forEach((a,i)=>a.position.set(-2+i,0,-45-i%2));
 }else if(key==='retreatIntro'){decorateBattle(v,elapsed,false);a('ROWAN',0,21,-3,18);a('WARD',-3,18,0,21,beat===1?'point':'listen');a('MARA',7,20,0,21,'tend');a('RUNNER',4,18,0,21,'point');}
 else if(key==='retreatHarlem'){decorateBattle(v,elapsed,false);a('ROWAN',0,23,-5,19);a('WARD',-5,19,0,23,'point');a('MARA',5,23,0,23);a('RUNNER',2,24,0,23,'paper');v.signal.visible=false;v.wounded.forEach(a=>a.visible=false);}
 else if(key==='retreatLift'){decorateBattle(v,elapsed,true);v.crowd.forEach((a,i)=>{a.position.z=15+i%3;a.userData.arms.forEach(arm=>arm.rotation.x=.2);});a('WARD',-4,22,0,24,'listen');a('ROWAN',0,24,-4,22,'listen');a('MARA',3,22,0,24,'listen');v.signal.visible=true;v.wounded.forEach(a=>a.visible=false);}
 else if(key==='retreatPlains'){decorateBattle(v,elapsed,false);a('ROWAN',0,20,-3,18);a('WARD',-3,18,0,20,'paper');a('MARA',4,20,-17,26,'point');a('RUNNER',6,19,0,20,'point');v.wagon.position.set(-17,0,26);v.beam.visible=true;v.wounded.forEach(a=>a.visible=false);}
 else{decorateBattle(v,elapsed,true);v.wagon.position.set(-17,0,62);v.beam.visible=false;v.wounded.forEach(a=>a.visible=false);a('ROWAN',0,65,-3,64);a('WARD',-3,64,0,65,'listen');a('MARA',3,64,0,65,'paper');a('ISAIAH',6,64,0,65,'listen');}
}
