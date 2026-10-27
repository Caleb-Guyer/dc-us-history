import * as T from './three.module.js';
import {makeActor,poseActor} from './c5-actors.mjs';
import {RUN_PACKETS,RUN_OBSTACLES,RUN_LENGTH,HARBOR_DOCKS,HARBOR_STORMS,runObstacleLane} from './c10-sim.mjs?v=6.1.0';

const v=(x,y,z)=>new T.Vector3(x,y,z);
const random=n=>{const x=Math.sin(n*97.173+13.7)*41593.231;return x-Math.floor(x);};
const port=p=>v((p.x-500)/25,0,(p.y-325)/25);
const colors=[0xe1bb6a,0x73c3c0,0xd39ec1];
const hex=color=>'#'+new T.Color(color).getHexString();
function noShadow(mesh){mesh.castShadow=false;return mesh;}
function boxes(parent,material,items){
 const batch=new T.InstancedMesh(new T.BoxGeometry(1,1,1),material,items.length),matrix=new T.Matrix4(),rotation=new T.Quaternion();
 items.forEach(([a,b,c,x,y,z],i)=>{matrix.compose(v(x,y,z),rotation,v(a,b,c));batch.setMatrixAt(i,matrix);});
 batch.castShadow=false;batch.receiveShadow=true;batch.computeBoundingSphere();parent.add(batch);return batch;
}
function batchWagonBoards(parent){
 const groups=new Map();
 for(const mesh of parent.children){
  if(!mesh.isMesh||mesh.geometry.type!=='BoxGeometry'||Array.isArray(mesh.material))continue;
  const m=mesh.material,key=[m.type,m.color.getHex(),m.map?.uuid||'',m.roughness,m.metalness,m.side].join(':');
  if(!groups.has(key))groups.set(key,[]);groups.get(key).push(mesh);
 }
 for(const group of groups.values()){
  if(group.length<2)continue;
  const batch=new T.InstancedMesh(new T.BoxGeometry(1,1,1),group[0].material,group.length),matrix=new T.Matrix4(),scale=v();
  group.forEach((mesh,i)=>{const p=mesh.geometry.parameters;scale.set(p.width*mesh.scale.x,p.height*mesh.scale.y,p.depth*mesh.scale.z);matrix.compose(mesh.position,mesh.quaternion,scale);batch.setMatrixAt(i,matrix);parent.remove(mesh);mesh.geometry.dispose();});
  batch.castShadow=true;batch.receiveShadow=true;batch.computeBoundingSphere();parent.add(batch);
 }
}
function line(w,points,color,parent=w.scene,opacity=1){const g=new T.BufferGeometry().setFromPoints(points.map(p=>v(...p)));const m=new T.LineBasicMaterial({color,transparent:opacity<1,opacity});const obj=new T.Line(g,m);parent.add(obj);return obj;}
function streetTexture(){const c=document.createElement('canvas');c.width=256;c.height=512;const a=c.getContext('2d');a.fillStyle='#514d48';a.fillRect(0,0,256,512);for(let y=0;y<32;y++)for(let x=-1;x<9;x++){const px=x*34+(y%2)*17,py=y*17;a.fillStyle=['#8c8270','#a2947c','#7a786b','#b5a082'][Math.floor(random(x+y*37)*4)];a.fillRect(px+1,py+1,31,14);a.fillStyle='rgba(247,225,184,.18)';a.fillRect(px+2,py+2,29,2);}const tex=new T.CanvasTexture(c);tex.wrapS=tex.wrapT=T.RepeatWrapping;tex.repeat.set(3,16);tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=4;return tex;}
function pennant(w,x,y,z,width,color,parent=w.scene){const g=w.group(x,y,z,parent),shape=new T.Shape();shape.moveTo(0,0);shape.lineTo(width,0);shape.lineTo(width*.65,-width*.7);shape.closePath();const cloth=w.mesh(new T.ShapeGeometry(shape),w.mat(color,{side:T.DoubleSide}),0,0,0,g);cloth.castShadow=false;return g;}

function streetBuilding(w,side,index){
 const variant=Math.round(index),width=8.8+random(index)*1.4,height=6.4+random(index+20)*2.8,depth=7.2;
 const g=w.group(side*(11.8+random(index+9)*.5),0,-index*11.5);
 g.rotation.y=side<0?-Math.PI/2:Math.PI/2;
 const facade=w.mat(variant%5===0?0xdfd1ae:0xd9be9e,{map:variant%5===0?null:w.brick}),stone=w.mat(0xd2c7af),glass=w.mat(0x678d91,{roughness:.32,metalness:.22}),wood=w.mat(0x705039);
 w.box(width,height,depth,facade,0,height/2,0,g);
 w.box(width+.35,.28,depth+.25,0x65564a,0,height+.04,0,g);
 w.box(width+.45,.13,.55,stone,0,height-.18,-depth/2-.15,g);
 w.box(width,.45,.14,stone,0,.35,-depth/2-.08,g);
 w.box(1.15,2.15,.12,wood,-width*.27,1.1,-depth/2-.09,g);
 w.box(1.35,.18,.6,stone,-width*.27,.12,-depth/2-.32,g);
 const frames=[],panes=[];
 for(let floor=0;floor<2;floor++)for(const column of [-1,0,1]){
  const x=column*width*.27,y=3.2+floor*2.3;
  if(y+.9>height)continue;
  frames.push([1.05,1.55,.09,x,y,-depth/2-.10],[.045,1.40,.13,x,y,-depth/2-.23],[.90,.045,.13,x,y,-depth/2-.23],[1.18,.11,.3,x,y-.82,-depth/2-.18]);
  panes.push([.86,1.36,.10,x,y,-depth/2-.16]);
 }
 boxes(g,stone,frames);boxes(g,glass,panes);
 const canopy=w.box(width*.60,.10,1.25,w.mat(variant%2?0x8b4f43:0x42675c),width*.15,2.7,-depth/2-.58,g);canopy.rotation.x=.12;
 w.box(width*.61,.25,.1,variant%2?0x7c433c:0x36584e,width*.15,2.53,-depth/2-1.17,g);
 w.box(.55,1.4,.55,0x786456,width*.30,height+.72,.8,g);
 if(variant%4===0){const sign=w.label(variant%8===0?'EVENING PRESS':'BOOKS & PRINTING',0,2.05,-depth/2-.18,'#efe3bf',3.2);g.add(sign);}
 return g;
}

function wagon(w,x){
 const g=w.group(x,0,0),oak=w.mat(0xad8657,{map:w.wood}),wheels=[],legs=[];
 w.box(1.55,.32,2.15,oak,0,.65,0,g);
 for(const side of [-1,1]){
  w.box(.10,.62,2.25,oak,side*.77,1.02,0,g);
  for(const z of [-.76,.76]){
   const wheel=w.cyl(.47,.13,0x4e4131,side*.86,.46,z,g);wheel.rotation.z=Math.PI/2;
   wheels.push(wheel);for(let i=0;i<6;i++){const spoke=w.box(.055,.055,.79,0xaa8957,side*.94,.46,z,g);spoke.rotation.x=i*Math.PI/3;}
   const hub=w.cyl(.11,.18,0xc0a16b,side*.88,.46,z,g);hub.rotation.z=Math.PI/2;
  }
 }
 w.box(1.5,.56,.10,oak,0,.99,1.06,g);w.box(1.5,.56,.10,oak,0,.99,-1.06,g);
 w.box(.68,.53,.7,0x827559,-.3,1.05,.24,g);w.box(.65,.46,.7,0xb1a17c,.36,1.01,-.38,g);
 for(const x of [-.50,.50])w.box(.07,.08,1.5,0x755333,x,.64,-1.75,g);
 const horse=w.group(0,0,-2.6,g),chest=w.mesh(new T.SphereGeometry(.43,12,8),0x79604b,0,1.0,0,horse);chest.scale.set(.65,1,1.55);
 const neck=w.box(.30,.74,.35,0x79604b,0,1.39,-.45,horse);neck.rotation.x=-.32;
 const head=w.box(.32,.38,.62,0x79604b,0,1.79,-.62,horse);head.rotation.x=-.15;
 for(const side of [-1,1])for(const z of [-.40,.40]){const leg=w.box(.10,.72,.10,0x5c4b3a,side*.21,.40,z,horse);leg.rotation.x=z*.12;legs.push(leg);w.box(.13,.12,.18,0x2f302b,side*.21,.06,z-.025,horse);}
 for(const side of [-1,1]){const ear=w.mesh(new T.ConeGeometry(.07,.22,5),0x65503e,side*.10,2.05,-.52,horse);ear.rotation.x=-.15;}
 w.box(.32,.12,.53,0x423c32,0,1.05,.05,horse);
 line(w,[[-.22,1.7,-3.15],[-.55,.92,-.65]],0x3b342b,g);line(w,[[.22,1.7,-3.15],[.55,.92,-.65]],0x3b342b,g);
 g.userData.wheels=wheels;g.userData.legs=legs;g.userData.horse=horse;batchWagonBoards(g);
 return g;
}

function houseFacade(w){
 const g=w.group(0,0,-100),stone=w.mat(0xd5cbb3),trim=w.mat(0xece1c7);
 w.box(17,7,8,stone,0,3.5,0,g);
 for(const side of [-1,1]){w.box(7,5.4,6.7,stone,side*10.7,2.7,0,g);w.box(7.4,.25,7.2,trim,side*10.7,5.5,0,g);}
 w.box(18,.4,9,trim,0,7.05,0,g);
 for(const x of [-6,-3,0,3,6]){w.cyl(.25,6.3,trim,x,3.5,4.9,g);w.cyl(.42,.18,trim,x,.44,4.9,g);w.cyl(.40,.18,trim,x,6.64,4.9,g);}
 for(const x of [-4.5,0,4.5])w.box(1.2,2.9,.08,0x444a42,x,1.7,4.05,g);
 const triangle=new T.Shape();triangle.moveTo(-8.7,0);triangle.lineTo(8.7,0);triangle.lineTo(0,2.3);triangle.closePath();
 w.mesh(new T.ExtrudeGeometry(triangle,{depth:.5,bevelEnabled:false}),trim,0,6.9,4.65,g);
 for(let i=0;i<3;i++)w.box(17.8-i*.35,.25,3-i*.5,trim,0,.13+i*.25,5.7-i*.25,g);
 const plaque=w.label('THE HOUSE OF REPRESENTATIVES',0,4.4,5.01,'#eaddbd',6.5);g.add(plaque);
 return g;
}

export function buildStreet(w){
 w.scene.background.set(0x8e9b9d);w.scene.fog.color.set(0xb7aca0);w.scene.fog.density=.011;
 w.sun.color.set(0xffc685);w.sun.intensity=3.8;w.sun.position.set(-25,17,-24);w.renderer.toneMappingExposure=1.20;
 const road=noShadow(w.box(13.8,.16,170,w.mat(0xb6a78d,{map:streetTexture(),roughness:.91}),0,-.11,-62));
 const sidewalks=[];for(const side of [-1,1])sidewalks.push(noShadow(w.box(1.75,.18,170,0xb6af9a,side*7.7,-.01,-62)));
 const blocks=[];for(let i=0;i<11;i++)for(const side of [-1,1])blocks.push({g:streetBuilding(w,side,i+side*.11),base:-i*11.5});
 const lamps=[];for(let i=0;i<12;i++){const side=i%2?-1:1,g=w.group(side*7.5,0,-i*12);w.cyl(.065,3.7,0x454c46,0,1.85,0,g);w.box(.34,.48,.34,0x554b36,0,3.65,0,g);w.box(.23,.32,.25,w.mat(0xd9c294,{emissive:0xb99c5c,emissiveIntensity:.15}),0,3.65,-.01,g);lamps.push({g,base:-i*12});}
 const hazards=RUN_OBSTACLES.map(o=>{const g=o.type==='wagon'?wagon(w,o.lane*2.8):w.crate(o.lane*2.8,0);if(o.type==='crate'){const stripe=w.box(.60,.075,.045,0xe2cc96,0,.58,.405,g);stripe.rotation.z=.28;}const warning=noShadow(w.mesh(new T.PlaneGeometry(o.type==='wagon'?1.9:1.2,3),new T.MeshBasicMaterial({color:0xd39b5e,transparent:true,opacity:.20,side:T.DoubleSide,depthWrite:false}),0,.012,0,g));warning.rotation.x=-Math.PI/2;warning.position.z=1.8;return {o,g,warning};});
 const packets=RUN_PACKETS.map(p=>{
  const g=w.group(p.lane*2.8,1.20,0),paper=w.box(.62,.82,.045,w.mat(0xffe7a5,{emissive:0xb58b27,emissiveIntensity:.35}),0,0,0,g);paper.rotation.z=-.07;
  w.box(.36,.035,.01,0x887650,0,.20,.029,g);w.box(.36,.025,.01,0x887650,0,.10,.029,g);w.box(.32,.025,.01,0x887650,0,0,.029,g);
  const seal=w.cyl(.085,.02,0x9d4f3e,.13,-.24,.04,g);seal.rotation.x=Math.PI/2;
  const ring=w.mesh(new T.TorusGeometry(.68,.035,6,36),w.mat(0xf2c970,{emissive:0xd2a442,emissiveIntensity:1.5}),0,0,0,g);
  const beam=noShadow(w.mesh(new T.CylinderGeometry(.03,.44,3,12,1,true),new T.MeshBasicMaterial({color:0xfad88c,transparent:true,opacity:.09,depthWrite:false,side:T.DoubleSide}),0,.4,0,g));
  const arrows=[];for(let i=0;i<3;i++){const arrow=noShadow(w.mesh(new T.ConeGeometry(.15,.30,3),new T.MeshBasicMaterial({color:0xffd785,transparent:true,opacity:.7}),0,-1.12,1.8+i*1.4,g));arrow.rotation.x=-Math.PI/2;arrows.push(arrow);}
  const label=w.label(`${p.label.toUpperCase()} · ${p.votes}`,0,1.06,0,'#ffe7ac',4.3);g.add(label);
  return {p,g,ring,label,beam,arrows};
 });
 w.player=makeActor('ELIZA');w.player.position.set(0,0,3);w.scene.add(w.player);
 const playerRing=noShadow(w.mesh(new T.TorusGeometry(.49,.025,5,30),new T.MeshBasicMaterial({color:0xf4dc9a,transparent:true,opacity:.5}),0,.025,3));playerRing.rotation.x=Math.PI/2;
 const hall=houseFacade(w);
 // Sidewalk motion makes the city feel occupied without adding invisible road collisions.
 const traffic=[];for(let i=0;i<4;i++){const g=wagon(w,(i%2?-1:1)*5.5);g.scale.setScalar(.78);traffic.push({g,seed:i,base:-20-i*32});}
 const bystanders=[];for(let i=0;i<10;i++){const side=i%2?-1:1,a=w.actor(side*7.65,-i*14,{military:false,coat:[0x5a6f68,0x94795c,0x6c697a][i%3]});bystanders.push({a,side,base:-i*14});}
 const flags=[];for(let i=0;i<7;i++){const z=-i*19-6;line(w,[[-8,5.8,z],[0,5.1,z],[8,5.8,z]],0x5c5349);for(let j=0;j<7;j++)flags.push(pennant(w,-6+j*2,5.5-Math.sin(j/6*Math.PI)*.35,z,.8,j%2?0x657c79:0xbd8255));}
 const dust=new T.InstancedMesh(new T.PlaneGeometry(.3,.3),new T.MeshBasicMaterial({color:0xe8c69c,transparent:true,opacity:.22,depthWrite:false,side:T.DoubleSide}),40);dust.castShadow=false;w.scene.add(dust);
 const debris=new T.InstancedMesh(new T.PlaneGeometry(.24,.33),w.mat(0xe1cfaa,{side:T.DoubleSide}),18);debris.castShadow=false;w.scene.add(debris);
 const streaks=new T.InstancedMesh(new T.BoxGeometry(.018,.018,1),new T.MeshBasicMaterial({color:0xf5d8a3,transparent:true,opacity:0,depthWrite:false}),18);streaks.castShadow=false;w.scene.add(streaks);
 const sky=w.group(0,0,-110);for(let i=0;i<13;i++){const side=i%2?-1:1;noShadow(w.box(3+random(i)*6,8+random(i+2)*10,5,0x748180,side*(12+random(i+4)*20),4+random(i+2)*5,-random(i+9)*22,sky));}
 w.street={road,sidewalks,blocks,lamps,hazards,packets,hall,playerRing,traffic,bystanders,flags,dust,debris,streaks,sky,matrix:new T.Matrix4(),q:new T.Quaternion(),p:v(),scale:v(),euler:new T.Euler(),shake:0,previousJump:0,lastHits:0};w.camera.position.set(0,3.1,11.2);w.camera.lookAt(0,1,-11);
 return w;
}

export function updateStreet(w,s,dt){
 const a=w.street,t=s.elapsed||0,d=s.distance||0;
 a.road.position.z=-62+(d%11.5);for(const sidewalk of a.sidewalks)sidewalk.position.z=-62+(d%11.5);
 for(const {g,base}of a.blocks)g.position.z=((base+d+15)%126.5+126.5)%126.5-111.5;
 for(const {g,base}of a.lamps)g.position.z=((base+d+15)%144+144)%144-129;
 for(const {o,g,warning}of a.hazards){g.position.z=3-(o.at-d);g.position.x=runObstacleLane(o,s)*2.8;g.visible=o.at-d<86&&o.at-d>-8;warning.material.opacity=.14+Math.sin(t*7)*.04;if(o.type==='wagon'){g.rotation.y=Math.sin(t*2+o.at)*.025;g.userData.legs.forEach((leg,i)=>leg.rotation.x=Math.sin(t*9+i*2)*.35);g.userData.horse.position.y=Math.sin(t*9)*.025;}}
 for(const {p,g,ring,label,beam,arrows}of a.packets){const ahead=p.at-d;g.position.z=3-ahead;g.position.y=1.25+Math.sin(t*3.3)*.12;g.visible=!s.collected.includes(p.id)&&ahead<82&&ahead>-4;ring.rotation.y=t*.8;beam.material.opacity=.08+Math.sin(t*4)*.025;label.visible=ahead<28;for(let i=0;i<arrows.length;i++)arrows[i].material.opacity=.30+.4*(.5+.5*Math.sin(t*5-i));}
 a.hall.position.z=-16-(RUN_LENGTH-d);
 w.player.position.set(s.x||0,s.jump||0,3);w.player.rotation.z=-((s.lane||0)*2.8-(s.x||0))*.04;
 poseActor(w.player,{time:t,pose:'run',speed:s.dash>0?1.55:1.2,mood:'tense'});
 w.player.visible=!(s.invulnerable>0&&Math.sin(t*35)<-.65);
 a.playerRing.position.x=s.x||0;a.playerRing.material.opacity=s.dash>0?.85:.35;
 for(const item of a.traffic){const {g,seed,base}=item;g.position.z=((base+d*.65+t*(seed%2?1.8:-1.4)+20)%150+150)%150-130;g.rotation.y=seed%2?Math.PI:0;g.userData.legs.forEach((leg,i)=>leg.rotation.x=Math.sin(t*6+seed+i*2)*.45);g.userData.horse.position.y=Math.sin(t*8+seed)*.02;}
 for(const {a:actor,side,base}of a.bystanders){actor.position.z=((base+d+t*1.4*side+10)%145+145)%145-135;w.animateActor(actor,t,true);actor.rotation.y=side>0?Math.PI:0;}
 for(let i=0;i<a.flags.length;i++){const flag=a.flags[i];flag.rotation.y=Math.sin(t*2+i)*.16;flag.position.z=-Math.floor(i/7)*19-6+(d%19);}
 for(let i=0;i<40;i++){const phase=(t*(s.dash>0?1.9:1.05)+i*.173)%1,x=(s.x||0)+(random(i)-.5)*1.8,yy=.1+phase*.55,z=3+phase*5;a.euler.set(-.4+random(i+22),t*.5+i,0);a.q.setFromEuler(a.euler);a.p.set(x,yy,z);a.scale.setScalar(.4+phase*1.4);a.matrix.compose(a.p,a.q,a.scale);a.dust.setMatrixAt(i,a.matrix);}a.dust.instanceMatrix.needsUpdate=true;a.dust.visible=d>0&&(s.jump||0)<.1;
 for(let i=0;i<18;i++){const phase=(t*.22+i*.31)%1;a.p.set((random(i+89)-.5)*12,.25+Math.sin(t*2+i)*.5+random(i+71)*1.5,12-phase*62);a.euler.set(t+i,t*.6+i,i);a.q.setFromEuler(a.euler);a.scale.setScalar(.5+random(i+20));a.matrix.compose(a.p,a.q,a.scale);a.debris.setMatrixAt(i,a.matrix);a.p.set((i%2?-1:1)*(4.8+random(i)*3),.7+random(i+3)*3,12-((t*35+i*7)%50));a.q.identity();a.scale.set(1,1,2+random(i+5)*5);a.matrix.compose(a.p,a.q,a.scale);a.streaks.setMatrixAt(i,a.matrix);}a.debris.instanceMatrix.needsUpdate=true;a.streaks.instanceMatrix.needsUpdate=true;a.streaks.material.opacity+=( (s.dash>0?.48:0)-a.streaks.material.opacity)*Math.min(1,dt*12);
 if((s.hits||0)>a.lastHits)a.shake=.20;if(a.previousJump>.15&&(s.jump||0)===0)a.shake=Math.max(a.shake,.07);a.lastHits=s.hits||0;a.previousJump=s.jump||0;a.shake=Math.max(0,a.shake-dt*.65);
 w.camera.position.x+=((s.x||0)*.5-w.camera.position.x)*Math.min(1,Math.max(0,dt)*5);
 w.camera.position.x+=Math.sin(t*93)*a.shake;w.camera.position.y=3.1+Math.sin(t*16)*.025+(s.jump||0)*.20+Math.cos(t*81)*a.shake;w.camera.position.z+=( (s.dash>0?12.2:11.2)-w.camera.position.z)*Math.min(1,dt*4);
 const targetFov=(w.camera.aspect<.8?73:51)+(s.dash>0?11:0);w.camera.fov+=(targetFov-w.camera.fov)*Math.min(1,Math.max(.1,dt*7));w.camera.updateProjectionMatrix();w.camera.lookAt(w.camera.position.x*.3,1.05,-11);
}

function makeBoat(w,boat){
 const color=colors[boat.dock],g=w.group(),hullShape=new T.Shape();
 hullShape.moveTo(-.61,-1.05);hullShape.lineTo(.61,-1.05);hullShape.lineTo(.70,.60);hullShape.lineTo(0,1.55);hullShape.lineTo(-.70,.60);hullShape.closePath();
 const hull=w.mesh(new T.ExtrudeGeometry(hullShape,{depth:.40,bevelEnabled:false}),w.mat(0x9f764c,{map:w.wood}),0,-.43,0,g);hull.rotation.x=-Math.PI/2;
 const deck=w.mesh(new T.ShapeGeometry(hullShape),w.mat(0xc7ab76,{map:w.wood}),0,-.015,0,g);deck.rotation.x=-Math.PI/2;deck.scale.set(.90,.93,1);
 for(const side of [-1,1])w.box(.055,.21,1.65,0x5c4935,side*.56,.08,.10,g);
 w.cyl(.045,2.65,0x5b4934,0,1.28,-.1,g);w.box(1.5,.06,.08,0x6e563b,0,2.30,-.1,g);
 const sailShape=new T.Shape();sailShape.moveTo(0,0);sailShape.lineTo(1.12,0);sailShape.quadraticCurveTo(.91,.85,0,1.86);sailShape.closePath();
 const sail=w.mesh(new T.ShapeGeometry(sailShape),w.mat(0xe8dbc0,{side:T.DoubleSide}),.04,.44,-.08,g);sail.rotation.y=.13;
 const rig=new T.BufferGeometry().setFromPoints([v(-.56,.08,.6),v(0,2.6,-.1),v(.56,.08,.6)]);g.add(new T.Line(rig,new T.LineBasicMaterial({color:0x4c4c40})));
 for(const side of [-1,1]){const crate=w.box(.34,.31,.38,w.mat(color,{map:w.wood}),side*.28,.19,.55,g);w.box(.35,.045,.39,0xddcba5,side*.28,.20,.55,g);crate.castShadow=true;}
 const pilot=w.actor(0,.75,{military:false,coat:0x66776a});pilot.scale.setScalar(.46);pilot.position.y=.0;g.add(pilot);
 const label=w.label(`${boat.id.split('-')[1]} → ${boat.dock+1}`,0,3.20,0,hex(color),2.8);g.add(label);
 const selection=noShadow(w.mesh(new T.TorusGeometry(.95,.045,5,40),new T.MeshBasicMaterial({color:0xffe2a0}),0,-.01,0,g));selection.rotation.x=Math.PI/2;selection.visible=false;
 const wakeGeometry=new T.BufferGeometry().setFromPoints([v(-.65,-.10,1),v(-1.25,-.10,2.5),v(-.82,-.10,2.25),v(0,-.10,3),v(.82,-.10,2.25),v(1.25,-.10,2.5),v(.65,-.10,1)]),wake=new T.Line(wakeGeometry,new T.LineBasicMaterial({color:0xdce4d7,transparent:true,opacity:.42}));g.add(wake);
 const foam=noShadow(w.mesh(new T.RingGeometry(.5,.64,22),new T.MeshBasicMaterial({color:0xd8ede5,transparent:true,opacity:.35,side:T.DoubleSide,depthWrite:false}),0,-.10,1,g));foam.rotation.x=-Math.PI/2;foam.scale.z=2;
 const routeGeometry=new T.BufferGeometry();routeGeometry.setAttribute('position',new T.BufferAttribute(new Float32Array(81*3),3));routeGeometry.setDrawRange(0,0);
 const route=new T.Line(routeGeometry,new T.LineBasicMaterial({color,transparent:true,opacity:.7}));route.frustumCulled=false;w.scene.add(route);
 g.userData={boatId:boat.id,label,selection,sail,pilot,wake,route,foam};
 return g;
}

function tallShip(w){
 const g=w.group(-22,-.12,-12),hull=w.mesh(new T.SphereGeometry(1,18,10),w.mat(0x374a4d,{map:w.wood}),0,.20,0,g);hull.scale.set(1.6,.75,5.9);w.box(2.5,.20,9.6,0xaf8d61,0,.60,0,g);
 for(const side of [-1,1]){w.box(.13,.35,9.6,0x514636,side*1.2,.84,0,g);for(let i=0;i<8;i++)w.box(.15,.25,.35,0xc8ad76,side*1.3,.25,-3.7+i*1.05,g);}
 const sails=[];for(const [i,z]of [-2.5,.2,2.8].entries()){const height=i===1?10:8.5;w.cyl(.08,height,0x6b5336,0,height/2+.65,z,g);for(let j=0;j<2;j++){const yy=height-j*2.6;w.box(4.3-j*.7,.10,.10,0x695c42,0,yy,z,g);const sail=w.mesh(new T.PlaneGeometry(3.7-j*.7,2.25,8,5),w.mat(0xe4d5b4,{side:T.DoubleSide}),0,yy-1.15,z+.08,g);sail.rotation.y=.18;sails.push(sail);}for(const side of [-1,1])line(w,[[side*1.2,.8,z-1.1],[0,height+.55,z],[side*1.2,.8,z+1.1]],0x625948,g,.75);}
 w.box(.07,.07,3.8,0x6b5336,0,1.1,-6.1,g).rotation.x=-.20;
 const flag=pennant(w,0,10.7,.2,1.35,0xc89c60,g);g.userData={sails,flag};return g;
}

function dockCrane(w,x,z){const g=w.group(x,0,z),oak=w.mat(0x6c5c44,{map:w.wood});w.cyl(.16,5,oak,0,2.5,0,g);const beam=w.box(.20,.22,4.5,oak,0,4.3,-1.4,g);beam.rotation.x=-.15;line(w,[[0,1.5,0],[0,4.65,-3.5],[0,.9,-3.5]],0x49463c,g);const cargo=w.box(.8,.7,.8,w.mat(0x9b835e,{map:w.wood}),0,1.0,-3.5,g);w.box(.83,.09,.83,0xd3bd8b,0,1,-3.5,g);g.userData.cargo=cargo;return g;}

function removeBoat(w,g){
 w.scene.remove(g,g.userData.route);g.userData.label.material.map.dispose();g.userData.route.geometry.dispose();g.userData.route.material.dispose();
 g.traverse(o=>{o.geometry?.dispose();if(o.material)for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();});
}

export function buildHarbor(w){
 w.scene.background.set(0x96acb4);w.scene.fog.color.set(0xa9bec0);w.scene.fog.density=.006;
 w.sun.color.set(0xffd8a0);w.sun.intensity=3.6;w.sun.position.set(-24,24,-18);w.renderer.toneMappingExposure=1.20;
 const water=noShadow(w.mesh(new T.PlaneGeometry(60,48,36,28),w.mat(0x347586,{metalness:.38,roughness:.29,side:T.DoubleSide}),0,-.27,-1));water.rotation.x=-Math.PI/2;
 const shore=w.box(56,.65,11,w.mat(0xc3bca2,{map:w.ground}),0,-.24,15.0);
 const waveGeometry=new T.PlaneGeometry(.75,.035),waveMaterial=new T.MeshBasicMaterial({color:0xc9ded9,transparent:true,opacity:.3,side:T.DoubleSide});
 const waves=new T.InstancedMesh(waveGeometry,waveMaterial,95);waves.castShadow=false;waves.receiveShadow=false;w.scene.add(waves);
 const matrix=new T.Matrix4(),rotation=new T.Quaternion().setFromEuler(new T.Euler(-Math.PI/2,0,0));
 for(let i=0;i<95;i++){matrix.compose(v(random(i)*44-22,-.20,random(i+43)*28-15),rotation,v(.6+random(i+18)*1.4,1,1));waves.setMatrixAt(i,matrix);}
 const marks=[],flags=[],cranes=[],workers=[];
 HARBOR_DOCKS.forEach((dock,i)=>{
  const q=port(dock),color=colors[i],wood=w.mat(0xc9af83,{map:w.wood});
  w.box(2.8,.32,5.5,wood,q.x+2,.08,q.z+2.25);
  for(const side of [-1,1])for(const z of [-.25,2.3,4.5]){w.cyl(.11,1.2,0x6c5b42,q.x+2+side*1.24,-.25,q.z+z);w.cyl(.15,.10,0xab9163,q.x+2+side*1.24,.40,q.z+z);}
  for(let j=0;j<7;j++)w.box(2.75,.025,.06,0x8d795c,q.x+2,.255,q.z-.25+j*.70);
  const ring=noShadow(w.mesh(new T.TorusGeometry(1.12,.055,5,40),new T.MeshBasicMaterial({color}),q.x,-.13,q.z));ring.rotation.x=Math.PI/2;marks.push(ring);
  const label=w.label(`${i+1} · ${dock.label.toUpperCase()}`,q.x+1.3,1.6,q.z+1.0,hex(color),4.0);
  const warehouse=w.group(q.x+1,0,q.z+7.1);w.box(7.4,3.6,4.3,w.mat(0xc7ac8f,{map:w.brick}),0,1.8,0,warehouse);w.box(7.8,.32,4.7,0x4e6668,0,3.75,0,warehouse);
  w.box(1.6,2.5,.09,0x584b37,0,1.3,-2.20,warehouse);w.box(1.8,.18,.65,0xb3a187,0,.14,-2.5,warehouse);
  for(const x of [-2.7,2.7]){w.box(1.25,1.4,.09,0xe0cdaa,x,2.25,-2.18,warehouse);noShadow(w.box(1.0,1.15,.11,0x66888a,x,2.25,-2.24,warehouse));}
  for(let c=0;c<3;c++)w.crate(q.x+.7+c*.9,q.z+4.1);
  w.cyl(.055,2.25,0x514b3b,q.x+3.0,1.30,q.z+.25);const flag=pennant(w,q.x+3.0,2.4,q.z+.25,.9,color);flags.push(flag);
  cranes.push(dockCrane(w,q.x+4.3,q.z+5.0));for(let k=0;k<2;k++){const actor=w.actor(q.x+1+k*1.5,q.z+2+k,{military:false,coat:k?0x718478:0x947557});workers.push({actor,x:q.x+1+k*1.5,z:q.z+2+k,phase:i+k});}
 });
 const shoals=HARBOR_STORMS.map((p,i)=>{
  const q=port(p),radius=p.r/25,g=w.group(q.x,0,q.z);
  const bank=w.cyl(radius*.90,.13,0xc6b789,0,-.20,0,g);bank.scale.z=.84;
  for(let j=0;j<5;j++){const rock=w.mesh(new T.DodecahedronGeometry(.28+random(j+i*5)*.20,0),0x7d8477,Math.sin(j*2.1)*radius*.65,.02,Math.cos(j*2.1)*radius*.53,g);rock.scale.y=.45;}
  const ring=noShadow(w.mesh(new T.TorusGeometry(radius,.035,5,48),new T.MeshBasicMaterial({color:0xd3a25b,transparent:true,opacity:.72}),0,-.06,0,g));ring.rotation.x=Math.PI/2;
  for(let j=0;j<3;j++){const angle=j*Math.PI*2/3+.3,x=Math.cos(angle)*(radius+.27),z=Math.sin(angle)*(radius+.27);w.cyl(.12,.34,0xae7542,x,.04,z,g);w.cyl(.06,.58,0xc29c5c,x,.35,z,g);w.box(.40,.22,.02,0xe7c17b,x+.19,.56,z,g);}
  const label=w.label('SHOALS',q.x,.85,q.z, '#f5d39a',2.55);
  return {g,ring,label};
 });
 const light=w.lamp(-17,3.5,11.0);light.intensity=3;
 const backdropShip=tallShip(w),lighthouse=w.group(24,0,-8);w.cyl(1.1,7.6,0xc9c4ae,0,3.2,0,lighthouse);w.cyl(1.3,.3,0x475d5b,0,7.1,0,lighthouse);w.cyl(.82,1.1,w.mat(0xe7c780,{emissive:0xdab579,emissiveIntensity:.45}),0,7.7,0,lighthouse);w.mesh(new T.ConeGeometry(1.35,.85,10),0x4b5b58,0,8.55,0,lighthouse);
 const gulls=[];for(let i=0;i<5;i++){const g=w.group(),wingL=w.box(.8,.035,.18,0xe2ddd0,-.35,0,0,g),wingR=w.box(.8,.035,.18,0xe2ddd0,.35,0,0,g);gulls.push({g,wingL,wingR});}
 // Distant waterfront is scenery, outside every navigable route.
 for(let i=0;i<10;i++){const xx=-25+i*5.6,hh=2+random(i)*3;noShadow(w.box(4.8,hh,4,0x798e8e,xx,hh/2,-21));noShadow(w.box(5.1,.3,4.4,0x566b6e,xx,hh+.15,-21));}
 w.boats=new Map();w.harbor={water,shore,waves,waveMatrix:matrix,waveRotation:rotation,marks,shoals,flags,cranes,workers,backdropShip,lighthouse,gulls,frame:0};
 w.camera.position.set(0,30,25);w.camera.lookAt(0,0,0);
 return w;
}

export function updateHarbor(w,s,dt){
 const h=w.harbor,t=s.elapsed||0;
 const surface=h.water.geometry.attributes.position;for(let i=0;i<surface.count;i++){const x=surface.getX(i),y=surface.getY(i);surface.setZ(i,Math.sin(x*.55+t*1.5)*.045+Math.sin(y*.9+x*.2-t*1.8)*.035);}surface.needsUpdate=true;if((h.frame++%6)===0)h.water.geometry.computeVertexNormals();
 for(let i=0;i<95;i++){h.waveMatrix.compose(v(random(i)*44-22+Math.sin(t*.6+i)*.14,-.20,((random(i+43)*28+t*.38+15)%28)-15),h.waveRotation,v(.6+random(i+18)*1.4,1,1));h.waves.setMatrixAt(i,h.waveMatrix);}h.waves.instanceMatrix.needsUpdate=true;
 for(const mark of h.marks)mark.scale.setScalar(1+Math.sin(t*2.6)*.035);
 for(let i=0;i<h.flags.length;i++)h.flags[i].rotation.y=Math.sin(t*3+i)*.22+(s.wind||0)*.3;
 for(let i=0;i<h.cranes.length;i++)h.cranes[i].userData.cargo.position.y=1+Math.sin(t*.65+i)*.35;
 for(const {actor,x,z,phase}of h.workers){actor.position.x=x+Math.sin(t*.55+phase)*.8;actor.position.z=z;w.animateActor(actor,t,true);actor.rotation.y=Math.sin(t*.55+phase)>0?Math.PI/2:-Math.PI/2;}
 h.backdropShip.position.y=-.08+Math.sin(t*.7)*.10;h.backdropShip.rotation.z=Math.sin(t*.6)*.015;h.backdropShip.userData.flag.rotation.y=Math.sin(t*3)*.2;
 for(let i=0;i<h.backdropShip.userData.sails.length;i++){const sail=h.backdropShip.userData.sails[i],positions=sail.geometry.attributes.position;for(let j=0;j<positions.count;j++)positions.setZ(j,Math.sin(positions.getX(j)*1.3+t*1.7+i)*.15);positions.needsUpdate=true;}
 for(let i=0;i<h.gulls.length;i++){const {g,wingL,wingR}=h.gulls[i];g.position.set(Math.sin(t*.16+i*1.7)*19,7+Math.sin(t*.6+i)*.5,Math.cos(t*.16+i*1.7)*9-4);g.rotation.y=-t*.16-i*1.7;wingL.rotation.z=Math.sin(t*5+i)*.32;wingR.rotation.z=-Math.sin(t*5+i)*.32;}
 const live=new Set(s.boats.map(b=>b.id));
 for(const [id,g]of w.boats){if(!live.has(id)){removeBoat(w,g);w.boats.delete(id);}}
 for(const boat of s.boats){
  let g=w.boats.get(boat.id);if(!g){g=makeBoat(w,boat);w.boats.set(boat.id,g);}
  const q=port(boat),boost=boat.boost>0;g.position.set(q.x,Math.sin(t*2.1+Number(boat.id.split('-')[1]))*.05,q.z);g.rotation.y=-boat.heading-Math.PI/2;g.rotation.z=Math.sin(t*1.7+q.x)*.025+(boost?.065:0);
  g.userData.selection.visible=s.selected===boat.id;g.userData.selection.scale.setScalar(1+Math.sin(t*5)*.06);
  g.userData.sail.rotation.y=.13+Math.sin(t*1.3)*.09+(s.wind||0)*.15;g.userData.wake.visible=boat.route.length>0;g.userData.wake.scale.z=boost?1.7:1;g.userData.wake.material.opacity=boost?.9:.5;g.userData.foam.visible=boat.route.length>0;g.userData.foam.scale.set(1+Math.sin(t*7)*.12,(boost?1.9:1.1)+Math.sin(t*6)*.2,1);
  w.animateActor(g.userData.pilot,t,false);g.userData.pilot.position.y=.03;
  const route=g.userData.route,positions=route.geometry.attributes.position,count=Math.min(80,boat.route.length);
  positions.setXYZ(0,q.x,-.12,q.z);for(let i=0;i<count;i++){const p=port(boat.route[i]);positions.setXYZ(i+1,p.x,-.12,p.z);}positions.needsUpdate=true;route.geometry.setDrawRange(0,count?count+1:0);route.material.opacity=s.selected===boat.id?.9:.45;
 }
}
