import * as T from './three.module.js';
import {makeActor,poseActor} from './c5-actors.mjs';
import {RUN_PACKETS,RUN_OBSTACLES,RUN_LENGTH,HARBOR_DOCKS,HARBOR_STORMS} from './c10-sim.mjs?v=6.0.0';

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
 const g=w.group(x,0,0),oak=w.mat(0xad8657,{map:w.wood});
 w.box(1.55,.32,2.15,oak,0,.65,0,g);
 for(const side of [-1,1]){
  w.box(.10,.62,2.25,oak,side*.77,1.02,0,g);
  for(const z of [-.76,.76]){
   const wheel=w.cyl(.47,.13,0x4e4131,side*.86,.46,z,g);wheel.rotation.z=Math.PI/2;
   const hub=w.cyl(.11,.18,0xc0a16b,side*.88,.46,z,g);hub.rotation.z=Math.PI/2;
  }
 }
 w.box(1.5,.56,.10,oak,0,.99,1.06,g);w.box(1.5,.56,.10,oak,0,.99,-1.06,g);
 w.box(.68,.53,.7,0x827559,-.3,1.05,.24,g);w.box(.65,.46,.7,0xb1a17c,.36,1.01,-.38,g);
 for(const x of [-.50,.50])w.box(.07,.08,1.5,0x755333,x,.64,-1.75,g);
 const horse=w.group(0,0,-2.6,g),chest=w.mesh(new T.SphereGeometry(.43,12,8),0x79604b,0,1.0,0,horse);chest.scale.set(.65,1,1.55);
 const neck=w.box(.30,.74,.35,0x79604b,0,1.39,-.45,horse);neck.rotation.x=-.32;
 const head=w.box(.32,.38,.62,0x79604b,0,1.79,-.62,horse);head.rotation.x=-.15;
 for(const side of [-1,1])for(const z of [-.40,.40]){const leg=w.box(.10,.72,.10,0x5c4b3a,side*.21,.40,z,horse);leg.rotation.x=z*.12;w.box(.13,.12,.18,0x2f302b,side*.21,.06,z-.025,horse);}
 for(const side of [-1,1]){const ear=w.mesh(new T.ConeGeometry(.07,.22,5),0x65503e,side*.10,2.05,-.52,horse);ear.rotation.x=-.15;}
 w.box(.32,.12,.53,0x423c32,0,1.05,.05,horse);
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
 w.scene.background.set(0xd0c1a6);w.scene.fog.color.set(0xd0c1a6);w.scene.fog.density=.0105;
 w.sun.color.set(0xffd3a0);w.sun.intensity=3.3;w.sun.position.set(-19,27,-12);w.renderer.toneMappingExposure=1.35;
 const road=noShadow(w.box(13.8,.16,170,w.mat(0xd8b58b,{map:w.ground}),0,-.11,-62));
 const sidewalks=[];for(const side of [-1,1])sidewalks.push(noShadow(w.box(1.75,.18,170,0xb6af9a,side*7.7,-.01,-62)));
 const blocks=[];for(let i=0;i<11;i++)for(const side of [-1,1])blocks.push({g:streetBuilding(w,side,i+side*.11),base:-i*11.5});
 const lamps=[];for(let i=0;i<12;i++){const side=i%2?-1:1,g=w.group(side*7.5,0,-i*12);w.cyl(.065,3.7,0x454c46,0,1.85,0,g);w.box(.34,.48,.34,0x554b36,0,3.65,0,g);w.box(.23,.32,.25,w.mat(0xd9c294,{emissive:0xb99c5c,emissiveIntensity:.15}),0,3.65,-.01,g);lamps.push({g,base:-i*12});}
 const hazards=RUN_OBSTACLES.map(o=>{const g=o.type==='wagon'?wagon(w,o.lane*2.8):w.crate(o.lane*2.8,0);if(o.type==='crate'){const stripe=w.box(.60,.075,.045,0xe2cc96,0,.58,.405,g);stripe.rotation.z=.28;}return {o,g};});
 const packets=RUN_PACKETS.map(p=>{
  const g=w.group(p.lane*2.8,1.20,0),paper=w.box(.62,.82,.045,w.mat(0xffe7a5,{emissive:0xb58b27,emissiveIntensity:.35}),0,0,0,g);paper.rotation.z=-.07;
  w.box(.36,.035,.01,0x887650,0,.20,.029,g);w.box(.36,.025,.01,0x887650,0,.10,.029,g);w.box(.32,.025,.01,0x887650,0,0,.029,g);
  const seal=w.cyl(.085,.02,0x9d4f3e,.13,-.24,.04,g);seal.rotation.x=Math.PI/2;
  const ring=w.mesh(new T.TorusGeometry(.68,.035,6,36),w.mat(0xf2c970,{emissive:0xd2a442,emissiveIntensity:.7}),0,0,0,g);
  const label=w.label(`${p.label.toUpperCase()} · ${p.votes}`,0,1.06,0,'#ffe7ac',4.3);g.add(label);
  return {p,g,ring,label};
 });
 w.player=makeActor('ELIZA');w.player.position.set(0,0,3);w.scene.add(w.player);
 const playerRing=noShadow(w.mesh(new T.TorusGeometry(.49,.025,5,30),new T.MeshBasicMaterial({color:0xf4dc9a,transparent:true,opacity:.5}),0,.025,3));playerRing.rotation.x=Math.PI/2;
 const hall=houseFacade(w);
 w.street={road,sidewalks,blocks,lamps,hazards,packets,hall,playerRing};w.camera.position.set(0,4.2,13.5);w.camera.lookAt(0,1,-12);
 return w;
}

export function updateStreet(w,s,dt){
 const a=w.street,t=s.elapsed||0,d=s.distance||0;
 a.road.position.z=-62+(d%11.5);for(const sidewalk of a.sidewalks)sidewalk.position.z=-62+(d%11.5);
 for(const {g,base}of a.blocks)g.position.z=((base+d+15)%126.5+126.5)%126.5-111.5;
 for(const {g,base}of a.lamps)g.position.z=((base+d+15)%144+144)%144-129;
 for(const {o,g}of a.hazards){g.position.z=3-(o.at-d);g.visible=o.at-d<86&&o.at-d>-8;}
 for(const {p,g,ring,label}of a.packets){const ahead=p.at-d;g.position.z=3-ahead;g.position.y=1.25+Math.sin(t*3.3)*.12;g.visible=!s.collected.includes(p.id)&&ahead<82&&ahead>-4;ring.rotation.y=t*.8;label.visible=ahead<32;}
 a.hall.position.z=-16-(RUN_LENGTH-d);
 w.player.position.set(s.x||0,s.jump||0,3);w.player.rotation.z=-((s.lane||0)*2.8-(s.x||0))*.04;
 poseActor(w.player,{time:t,pose:'run',speed:s.dash>0?1.55:1.2,mood:'tense'});
 w.player.visible=!(s.invulnerable>0&&Math.sin(t*35)<-.65);
 a.playerRing.position.x=s.x||0;a.playerRing.material.opacity=s.dash>0?.85:.35;
 w.camera.position.x+=((s.x||0)*.5-w.camera.position.x)*Math.min(1,Math.max(0,dt)*5);
 w.camera.fov=(w.camera.aspect<.8?70:48)+(s.dash>0?7:0);w.camera.updateProjectionMatrix();w.camera.lookAt(w.camera.position.x*.3,1,-12);
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
 const routeGeometry=new T.BufferGeometry();routeGeometry.setAttribute('position',new T.BufferAttribute(new Float32Array(81*3),3));routeGeometry.setDrawRange(0,0);
 const route=new T.Line(routeGeometry,new T.LineBasicMaterial({color,transparent:true,opacity:.7}));route.frustumCulled=false;w.scene.add(route);
 g.userData={boatId:boat.id,label,selection,sail,pilot,wake,route};
 return g;
}

function removeBoat(w,g){
 w.scene.remove(g,g.userData.route);g.userData.label.material.map.dispose();g.userData.route.geometry.dispose();g.userData.route.material.dispose();
 g.traverse(o=>{o.geometry?.dispose();if(o.material)for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();});
}

export function buildHarbor(w){
 w.scene.background.set(0xacc3c5);w.scene.fog.color.set(0xacc3c5);w.scene.fog.density=.006;
 w.sun.color.set(0xffe6b7);w.sun.intensity=3.3;w.sun.position.set(-18,30,-12);w.renderer.toneMappingExposure=1.42;
 const water=noShadow(w.box(54,.15,42,w.mat(0x628e9a,{metalness:.23,roughness:.48}),0,-.31,-1));
 const shore=w.box(56,.65,11,w.mat(0xc3bca2,{map:w.ground}),0,-.24,15.0);
 const waveGeometry=new T.PlaneGeometry(.75,.035),waveMaterial=new T.MeshBasicMaterial({color:0xc9ded9,transparent:true,opacity:.3,side:T.DoubleSide});
 const waves=new T.InstancedMesh(waveGeometry,waveMaterial,95);waves.castShadow=false;waves.receiveShadow=false;w.scene.add(waves);
 const matrix=new T.Matrix4(),rotation=new T.Quaternion().setFromEuler(new T.Euler(-Math.PI/2,0,0));
 for(let i=0;i<95;i++){matrix.compose(v(random(i)*44-22,-.20,random(i+43)*28-15),rotation,v(.6+random(i+18)*1.4,1,1));waves.setMatrixAt(i,matrix);}
 const marks=[];
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
  w.cyl(.055,2.25,0x514b3b,q.x+3.0,1.30,q.z+.25);const flag=w.box(.75,.43,.035,color,q.x+3.40,2.15,q.z+.25);flag.rotation.y=.22;
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
 w.boats=new Map();w.harbor={water,shore,waves,waveMatrix:matrix,waveRotation:rotation,marks,shoals};
 w.camera.position.set(0,30,25);w.camera.lookAt(0,0,0);
 return w;
}

export function updateHarbor(w,s,dt){
 const h=w.harbor,t=s.elapsed||0;
 for(let i=0;i<95;i++){h.waveMatrix.compose(v(random(i)*44-22+Math.sin(t*.6+i)*.14,-.20,((random(i+43)*28+t*.38+15)%28)-15),h.waveRotation,v(.6+random(i+18)*1.4,1,1));h.waves.setMatrixAt(i,h.waveMatrix);}h.waves.instanceMatrix.needsUpdate=true;
 for(const mark of h.marks)mark.scale.setScalar(1+Math.sin(t*2.6)*.035);
 const live=new Set(s.boats.map(b=>b.id));
 for(const [id,g]of w.boats){if(!live.has(id)){removeBoat(w,g);w.boats.delete(id);}}
 for(const boat of s.boats){
  let g=w.boats.get(boat.id);if(!g){g=makeBoat(w,boat);w.boats.set(boat.id,g);}
  const q=port(boat);g.position.set(q.x,Math.sin(t*2.1+Number(boat.id.split('-')[1]))*.035,q.z);g.rotation.y=-boat.heading-Math.PI/2;g.rotation.z=Math.sin(t*1.7+q.x)*.018;
  g.userData.selection.visible=s.selected===boat.id;g.userData.selection.scale.setScalar(1+Math.sin(t*5)*.06);
  g.userData.sail.rotation.y=.13+Math.sin(t*1.3)*.055;g.userData.wake.visible=boat.route.length>0;
  w.animateActor(g.userData.pilot,t,false);g.userData.pilot.position.y=.03;
  const route=g.userData.route,positions=route.geometry.attributes.position,count=Math.min(80,boat.route.length);
  positions.setXYZ(0,q.x,-.12,q.z);for(let i=0;i<count;i++){const p=port(boat.route[i]);positions.setXYZ(i+1,p.x,-.12,p.z);}positions.needsUpdate=true;route.geometry.setDrawRange(0,count?count+1:0);route.material.opacity=s.selected===boat.id?.9:.45;
 }
}
