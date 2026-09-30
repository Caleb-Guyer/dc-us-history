import * as T from './three.module.js';
import {TIDE_BLOCKS,CREEK_BLOCKS,REEDS,PATROLS,patrolAt} from './c6-promise.mjs?v=4.5.0-published2';
import {buildRunner} from './c6-hill-world.mjs?v=4.5.0-published2';
const face=(x,z,tx,tz)=>Math.atan2(-(tx-x),-(tz-z));
const rand=n=>{const v=Math.sin(n*73.13+41.7)*8319.51;return v-Math.floor(v);};
function water(w,width,length,x,z,night){
 const mat=new T.ShaderMaterial({uniforms:{clock:{value:0},dark:{value:new T.Color(night?0x163b46:0x3d676b)},light:{value:new T.Color(night?0x8ca9a3:0xb3c6bd)}},vertexShader:`uniform float clock; varying vec3 point; void main(){vec3 p=position; p.z+=sin(p.x*.7+clock*.8)*.035+cos(p.y*.4-clock*.7)*.035; point=p; gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,fragmentShader:`uniform float clock; uniform vec3 dark;uniform vec3 light;varying vec3 point;void main(){float wave=sin(point.x*.72+point.y*.28+clock)*sin(point.y*2.-clock*.6);float glint=pow(max(0.,wave),14.);float path=exp(-pow((point.x+point.y*.18-8.)/12.,2.));vec3 c=mix(dark,light,.1+glint*(.16+path*.45));gl_FragColor=vec4(c,1.);}`});
 const a=w.mesh(new T.PlaneGeometry(width,length,32,100),mat,x,-.13,z);a.rotation.x=-Math.PI/2;w.promiseWater=mat;return a;
}
function skiff(w,x,z,royal=false){const g=w.group(x,0,z),wood=w.mat(royal?0x4c4036:0x775237,{map:w.woodTexture});
 // Open gunwales, low seats and a pointed bow, rather than a solid block boat.
 w.box(1.42,.15,4.5,wood,0,.04,.1,g);
 for(const sign of [-1,1]){const rail=w.box(.13,.52,4.5,wood,sign*.77,.28,.1,g);rail.rotation.z=sign*.08;const bow=w.box(.12,.46,1.35,wood,sign*.42,.25,-2.6,g);bow.rotation.y=-sign*.55;w.box(.19,.08,4.6,0xb29161,sign*.79,.57,.1,g);}
 w.box(1.55,.5,.14,wood,0,.28,2.32,g);for(const z of [-1.25,.4,1.45])w.box(1.55,.12,.28,0xa17b4c,0,.34,z,g);
 const oars=[];for(const sign of [-1,1]){const pivot=new T.Group();pivot.position.set(sign*.73,.52,.45);g.add(pivot);w.box(2.25,.06,.07,0xb6a27a,sign*.85,0,0,pivot);w.box(.62,.035,.25,0x9b7f55,sign*2,0,0,pivot);pivot.rotation.z=sign*.13;oars.push(pivot);}g.userData.oars=oars;
 if(royal){for(let i=0;i<2;i++){const sailor=w.soldier(royal===true);g.add(sailor);sailor.position.set(0,-.08,i===0?.7:-1);sailor.scale.setScalar(.83);sailor.userData.gun.visible=i===1;sailor.userData.arms.forEach(a=>a.rotation.x=i===0?.7:.4);}const lamp=w.lantern(0,1.35,-1.3);g.add(lamp);w.cyl(.035,1.2,0x403b30,0,.85,-1.3,g);}
 return g;
}
function dock(w,x,z,width=4){const g=w.group(x,0,z);for(let i=0;i<8;i++)w.box(width,.12,.33,w.mat(i%2?0x7e6a4a:0x897455,{map:w.woodTexture}),0,.15,i*.37-1.3,g);for(const xx of [-width/2+.15,width/2-.15])for(const zz of [-1.2,1.3])w.cyl(.12,1.35,0x514f39,xx,.15,zz,g);return g;}
function character(w,key,source,x,z,color){const a=w.actor(source,x,z);delete w.cast[source];w.cast[key]=a;if(color)a.traverse(o=>{if(o.isMesh&&o.material?.color){const hex=o.material.color.getHex();if([0x46584f,0x3d6863,0x315663,0x345958].includes(hex)){o.material=o.material.clone();o.material.color.setHex(color);}}});return a;}
function cypress(w,x,z,height=8){const g=w.group(x,0,z);w.cyl(.20,height,0x444d3d,0,height/2,0,g);for(let i=0;i<4;i++){const a=i*2.1,crown=w.mesh(new T.IcosahedronGeometry(1.8,1),[0x435d4e,0x4c6552,0x3e584a][i%3],Math.cos(a)*1.2,height-2+i*.7,Math.sin(a)*1.1,g);crown.scale.set(1.4,.64,1.1);const branch=w.box(.1,2,.12,0x515644,Math.cos(a)*.6,height-2,Math.sin(a)*.5,g);branch.rotation.z=Math.cos(a)*.65;}return g;}
function wake(w){const points=[[-1.1,.015,.6],[-.65,.015,.24],[0,.015,0],[.65,.015,.24],[1.1,.015,.6]].map(v=>new T.Vector3(...v));const a=new T.Line(new T.BufferGeometry().setFromPoints(points),new T.LineBasicMaterial({color:0xc1d6cb,transparent:true,opacity:.24,depthWrite:false}));w.scene.add(a);return a;}
export function buildPromise(w,level){const tide=level==='tidewater',v=w.promiseVisual={patrols:[],wakes:[],reeds:[],boat:null,bridge:[],water:null};w.wagonObject=null;
 w.scene.background=new T.Color(tide?0x213847:0x8eabad);w.scene.fog=new T.FogExp2(tide?0x2c454c:0x9badac,tide?.009:.014);w.sun.intensity=tide?1.8:2.1;w.scene.add(new T.AmbientLight(tide?0x829cad:0xcbd5c7,tide?.7:.35));
 if(tide){
  water(w,220,360,0,-62,true);
  for(const side of [-1,1]){w.box(50,2,250,w.mat(0x455844,{map:w.groundTexture}),side*60,-.35,-60);for(let i=0;i<26;i++)cypress(w,side*(35+rand(i)*18),35-i*8,6+rand(i+8)*6);}
  for(const [x,z,bw,bd,bh] of TIDE_BLOCKS){const island=w.mesh(new T.BoxGeometry(bw,.85,bd,6,1,6),w.mat(0x677158,{map:w.groundTexture}),x,.22,z);const verts=island.geometry.attributes.position;for(let q=0;q<verts.count;q++){if(verts.getY(q)>0){verts.setX(q,verts.getX(q)*.91);verts.setZ(q,verts.getZ(q)*.91);verts.setY(q,verts.getY(q)+rand(q+x)*.16);}}island.geometry.computeVertexNormals();for(let q=0;q<22;q++){const a=q/22*Math.PI*2,xx=x+Math.cos(a)*bw*.49,zz=z+Math.sin(a)*bd*.49;const rock=w.mesh(new T.DodecahedronGeometry(.7,0),0x6c7565,xx,.1,zz);rock.scale.set(1.7,.7,1.4);}for(let i=0;i<4;i++)cypress(w,x+(rand(i+x)-.5)*(bw-2),z+(rand(i+z)-.5)*(bd-2),6+i);}
  const reeds=new T.InstancedMesh(new T.CylinderGeometry(.025,.055,1.45,4),w.mat(0x7c8562),480),m=new T.Matrix4();for(let i=0;i<480;i++){const r=REEDS[i%3],a=rand(i)*Math.PI*2,d=2+rand(i+9)*r.r;m.compose(new T.Vector3(r.x+Math.cos(a)*d,.45,r.z+Math.sin(a)*d),new T.Quaternion().setFromEuler(new T.Euler(.12,0,Math.sin(i)*.12)),new T.Vector3(1,.6+rand(i+6),1));reeds.setMatrixAt(i,m);}w.scene.add(reeds);
  dock(w,2.5,27);dock(w,-27,-23);dock(w,27,-95,6);dock(w,29,-88,4);w.box(1.4,.12,8,0x7e6a4a,29,.15,-91);dock(w,-3,-162);
  for(const [x,z] of [[3,28],[-28,-22],[28,-94],[-3,-162]])w.lantern(x,1.4,z);
  v.boat=skiff(w,0,28);v.patrols=PATROLS.map(a=>skiff(w,a.x,a.z,true));v.chaser=skiff(w,23,-72,'militia');v.chaser.visible=false;
  v.sectors=v.patrols.map(()=>{const a=w.mesh(new T.CircleGeometry(22,32,Math.PI/2-.66,1.32),new T.MeshBasicMaterial({color:0xe7c78c,opacity:.065,transparent:true,side:T.DoubleSide,depthWrite:false}),0,-.018,0);a.rotation.x=-Math.PI/2;return a;});
  v.boom=w.group(23,0,-130);for(let i=0;i<6;i++){const a=w.cyl(.17,1.3,0x6f6147,(i-2.5)*1.2,.15,0,v.boom);a.rotation.z=Math.PI/2;}w.box(8,.055,.055,0xc0aa7c,0,.43,0,v.boom);
  for(let i=0;i<10;i++)v.wakes.push(wake(w));
  v.warning=w.mesh(new T.RingGeometry(3.3,3.5,48),new T.MeshBasicMaterial({color:0xf0b47c,opacity:.6,transparent:true,side:T.DoubleSide,depthWrite:false}),0,.02,0);v.warning.rotation.x=-Math.PI/2;v.warning.visible=false;
  // Distant tender silhouette with rigging, visible beyond the patrol channel.
  const ship=w.group(54,0,-116);const hull=w.mesh(new T.SphereGeometry(1,16,8),0x302f2a,0,.7,0,ship);hull.scale.set(4,2,14);w.box(6,.15,20,0x60523b,0,1.7,0,ship);for(const z of [-6,5]){w.cyl(.16,17,0x615844,0,9,z,ship);w.box(12,.1,.1,0x9d987b,0,13,z,ship);w.box(10,.1,.1,0x9d987b,0,8,z,ship);w.mesh(new T.PlaneGeometry(9,4.5),w.mat(0x8a9288,{side:T.DoubleSide}),0,10,z,ship);for(const side of [-1,1]){const rope=w.box(.03,18,.03,0x697774,side*1.6,9,z,ship);rope.rotation.z=side*.19;}}
  character(w,'JONAS','ISAIAH',-24,-22,0x806a43);character(w,'AGENT','THOMAS',25,-95);character(w,'CLAIMANT','ROWAN',29,-88);w.actor('ISAIAH',0,27);w.actor('MARA',2,26);
  v.paper=w.label('DUNMORE | 7 NOVEMBER 1775',-24,1,-22, .55);v.paper.rotation.x=-.9;
 }else{
  for(const z of [24,-44])w.box(120,.2,55,w.mat(0x929577,{map:w.groundTexture}),0,-.17,z);water(w,90,13,0,-10,false);
  // Dark water beyond both rails marks an impassable creek; all crossing is on the deck.
  for(const x of [-2.2,2.2]){w.box(.18,.2,17,0x66543e,x,.03,-10);for(let i=0;i<5;i++)w.cyl(.13,1.5,0x575641,x,-.18,-17+i*3.5);}
  for(let i=0;i<40;i++){const z=1-i*.58,a=w.box(4.3,.13,.53,w.mat(0x8c7452,{map:w.woodTexture}),0,.02,z);if(i>=8&&i<=15)v.bridge.push(a);}
  for(const [x,z,bw,bd,bh] of CREEK_BLOCKS.slice(2)){w.box(bw,bh,bd,w.mat(0x8a815d,{map:w.groundTexture}),x,bh/2,z);}
  for(let i=0;i<17;i++)cypress(w,-32+i*4,-45+rand(i)*2,8+rand(i+2)*4);for(let i=0;i<38;i++)cypress(w,(i%2?1:-1)*(17+rand(i)*18),-40+rand(i+60)*74,7+rand(i+90)*7);
  w.box(2,.6,1,0x715d40,-8,.3,16);w.label('MECKLENBURG | RESOLVES | MAY 1775',-8,.66,16,.8).rotation.x=-Math.PI/2;
  w.box(2.7,.05,1.3,0xb5ac90,10,.01,18);v.wounded=w.soldier();v.wounded.userData.gun.visible=false;v.wounded.rotation.z=1.45;v.wounded.position.set(1,.1,-27);
  v.carried=w.soldier();v.carried.userData.gun.visible=false;v.carried.visible=false;v.safe=w.soldier();v.safe.userData.gun.visible=false;v.safe.position.set(10,.1,18);v.safe.rotation.z=1.45;v.safe.visible=false;
  v.boat=skiff(w,18,24);v.boat.rotation.y=1.1;w.box(5,.15,3,0x526d71,18,-.09,24);
  buildRunner(w,7,21);character(w,'MILITIA','WARD',-9,16);w.actor('ISAIAH',9,23);
  for(let i=0;i<4;i++){const a=w.soldier();a.position.set(-10-i*2,0,-27+i);a.userData.gun.rotation.x=-.45;}
  w.lantern(11,.6,18);for(let i=0;i<5;i++){const timber=w.box(3.5,.12,.28,0x8f7756,-3,.12+i*.1,1.5);timber.rotation.y=.1;}for(let i=0;i<9;i++){const fence=w.box(2,.1,.13,0x7a6b50,6+i*.7,.2,-25-i*.35);fence.rotation.z=.2;fence.rotation.y=i*.8;}
 }
}
function animateWater(w,t){w.promiseWater.uniforms.clock.value=t;}
function boatPeople(w,x,z,yaw,t,aboard,speaking,moving){
 const position=(key,offset,pose)=>{const x1=x-Math.sin(yaw)*offset,z1=z-Math.cos(yaw)*offset,a=w.setActor(key,x1,z1,yaw,pose,t,speaking===key);a.position.y=-.04;return a;};
 position('ISAIAH',-.6,moving?'row':'kneel');if(aboard)position('JONAS',1.05,'kneel');
}
export function renderPromise(w,s,input,voice){const v=w.promiseVisual,h=s.promise,p=s.player,t=s.time;animateWater(w,t);
 if(s.level==='tidewater'){
  v.boat.position.set(p.x,Math.sin(t*1.7)*.025,p.z);v.boat.rotation.set(0,h.yaw,Math.sin(t*1.4)*.012);v.boat.userData.oars.forEach((a,i)=>{a.rotation.y=h.speed>.3?Math.sin(t*(h.quiet?1.8:3.4)+i*Math.PI)*.42:0;});
  boatPeople(w,p.x,p.z,h.yaw,t,h.aboard,voice,h.speed>.3);
  if(!h.aboard)w.setActor('JONAS',-26,-23,Math.PI/2,'listen',t,voice==='JONAS');
  w.setActor('AGENT',28,-94,Math.PI/2,'listen',t,voice==='AGENT');v.paper.visible=false;
  v.patrols.forEach((a,i)=>{a.visible=true;const r=patrolAt(i,t);a.position.set(r.x,0,r.z);a.rotation.y=r.yaw;const c=v.sectors[i];c.position.set(r.x,-.018,r.z);c.rotation.z=r.yaw;c.visible=s.stage<3;});
  v.chaser.visible=h.pursuit;v.chaser.position.set(h.chaserX,0,h.chaserZ);v.chaser.rotation.y=face(h.chaserX,h.chaserZ,p.x,p.z);v.boom.rotation.y=h.boom?.9:0;v.boom.position.y=h.boom?-.32:0;
  v.wakes.forEach((a,i)=>{const n=i/10,offset=2+n*10;a.visible=h.speed>.5;a.position.set(p.x+Math.sin(h.yaw)*offset,-.012,p.z+Math.cos(h.yaw)*offset);a.rotation.y=h.yaw;a.scale.set(1+n*2,1,1+n*.7);a.material.opacity=(1-n)*Math.min(.32,h.speed*.04);});
  v.warning.visible=h.warning>0;v.warning.position.set(h.targetX,.025,h.targetZ);v.warning.material.opacity=.3+Math.sin(t*12)*.2;
 }else{
  v.bridge.forEach(a=>a.visible=h.bridge);v.wounded.visible=s.stage<3;v.safe.visible=h.rescued;v.carried.visible=s.carrying;
  if(s.carrying){v.carried.position.set(p.x+Math.cos(p.yaw)*.65,0,p.z-Math.sin(p.yaw)*.65+.2);v.carried.rotation.set(0,p.yaw,.17);v.carried.userData.legs.forEach((a,i)=>a.rotation.x=Math.sin(t*5+i*Math.PI)*.1);}
  w.setActor('RUNNER',7,18,-Math.PI/2,h.rescued?'tend':'listen',t,voice==='RUNNER');w.setActor('MILITIA',-9,16,Math.PI*.6,'paper',t,voice==='MILITIA');
 }
}
export function promiseCamera(w,s,reduced){const p=s.player,h=s.promise,t=s.time;w.camera.position.set(p.x+Math.sin(p.yaw)*6.8,3.9+(reduced?0:Math.sin(t*1.7)*.03),p.z+Math.cos(p.yaw)*6.8);w.camera.rotation.set(p.pitch-.34,p.yaw,0);w.camera.fov=70+Math.min(5,h.speed*.35);w.camera.updateProjectionMatrix();}
export function filmPromise(w,key,beat,time,elapsed,speaking){const v=w.promiseVisual;animateWater(w,elapsed);
 const is=(key==='promiseIntro'?['ISAIAH','MARA','ISAIAH','MARA','ISAIAH','MARA','ISAIAH','MARA']:key==='promiseJoin'?['JONAS','ISAIAH','JONAS','ISAIAH','JONAS','ISAIAH','JONAS','ISAIAH','JONAS']:key==='promiseContact'?['AGENT','JONAS','AGENT','JONAS','AGENT','JONAS','AGENT','CLAIMANT','ISAIAH','JONAS']:key==='promiseEnd'?['JONAS','ISAIAH','JONAS','ISAIAH','JONAS','ISAIAH','JONAS']:[])[beat];
 const actor=(key,x,z,yaw,pose='listen')=>w.setActor(key,x,z,yaw,pose,time,speaking&&is===key);
 if(w.level==='tidewater'){
  v.patrols.forEach(a=>a.visible=false);v.sectors.forEach(a=>a.visible=false);v.chaser.visible=false;v.wakes.forEach(a=>a.visible=false);v.warning.visible=false;v.paper.visible=key==='promiseJoin'&&beat>=3&&beat<=6;
  if(key==='promiseIntro'){v.boat.position.set(0,0,27);actor('ISAIAH',0,27,Math.PI*.5,'row');actor('MARA',2,26,-Math.PI/2,beat===7?'reach':'listen');}
  else if(key==='promiseJoin'){v.boat.position.set(-23,0,-23);v.boat.rotation.y=-.3;actor('ISAIAH',-23,-24,-Math.PI*.75,'kneel');const j=actor('JONAS',-24,-22,.25,beat>=3&&beat<=6?'paper':beat===0?'reach':'listen');if(beat===0)j.position.x=-26+Math.min(2,time*.5);}
  else if(key==='promiseContact'){v.boat.position.set(23,0,-94);v.boat.rotation.y=.2;actor('ISAIAH',23,-94,-.3,beat>=8?'row':'kneel');actor('JONAS',22,-95,-Math.PI/2,beat>=8?'kneel':'listen');actor('AGENT',25,-95,Math.PI/2,beat===6?'point':'listen');if(beat>=7){actor('CLAIMANT',29,-88,.3,'point');v.chaser.visible=true;v.chaser.position.set(27,0,-77-Math.min(6,elapsed*.08));}if(beat>=8)w.cast.JONAS.position.y=-.24;}
  else{v.boat.position.set(0,0,-161);v.boat.rotation.y=-.7;const j=actor('JONAS',-1,-162,-Math.PI*.65,beat===6?'walk':'listen');actor('ISAIAH',1,-160,.4,'kneel');if(beat===6){j.position.x-=Math.min(1.5,time*.25);j.position.z-=Math.min(1,time*.15);}w.cast.JONAS.userData.hands.forEach((a,i)=>a.rotation.z=beat===2?Math.sin(time*15+i)*.04:0);}
 }else{
  v.bridge.forEach(a=>a.visible=key==='creekEnd');v.wounded.visible=key==='creekIntro';v.safe.visible=key==='creekEnd';v.carried.visible=false;
  if(key==='creekIntro'){w.setActor('ISAIAH',9,23,.2,beat===2?'point':'listen',time,speaking&&[0,2,4].includes(beat));w.setActor('RUNNER',7,21,Math.PI*.75,'listen',time,speaking&&[1,3].includes(beat));}
  else{w.setActor('ISAIAH',8,19,-.6,'kneel',time,speaking&&[1,3,5,6].includes(beat));w.setActor('RUNNER',11,17,Math.PI*.75,beat===1?'tend':'kneel',time,speaking&&[0,2,4].includes(beat));}
 }
}
