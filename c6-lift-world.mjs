import * as T from './three.module.js';
import {groundHeight,roadCenter} from './c6-lift.mjs?v=4.15.0-published';
const face=(x,z,tx,tz)=>Math.atan2(-(tx-x),-(tz-z));
const rand=n=>{const q=Math.sin(n*127.1+18.9)*43758.5453;return q-Math.floor(q);};
function terrain(w,level){const geo=new T.PlaneGeometry(120,170,24,85);geo.rotateX(-Math.PI/2);const v=geo.attributes.position;
 for(let i=0;i<v.count;i++){const x=v.getX(i),z=v.getZ(i)-42,top=groundHeight(level,z),fall=level==='dorchester'?Math.max(0,Math.min(1,(Math.abs(x)-22)/24)):0,y=top-(top+2.4)*fall;v.setXYZ(i,x,y-.12+(Math.abs(x)>24?Math.sin(x*.3+z*.17)*.3:0),z);}geo.computeVertexNormals();w.mesh(geo,w.mat(level==='snowpass'?0xd5dee0:0x93968c,{...(level==='snowpass'?{bumpMap:w.groundTexture,bumpScale:.12}:{map:w.groundTexture}),side:T.DoubleSide}));
 const road=new T.BufferGeometry(),p=[],uv=[];for(let z=30;z>=-115;z-=1){const x=roadCenter(level,z),x2=roadCenter(level,z-1),y=groundHeight(level,z)-.06,y2=groundHeight(level,z-1)-.06;for(const point of [[x-7,y,z],[x+7,y,z],[x2-7,y2,z-1],[x+7,y,z],[x2+7,y2,z-1],[x2-7,y2,z-1]]){p.push(...point);uv.push(point[0]/7,point[2]/24);}}road.setAttribute('position',new T.Float32BufferAttribute(p,3));road.setAttribute('uv',new T.Float32BufferAttribute(uv,2));road.computeVertexNormals();w.mesh(road,w.mat(level==='snowpass'?0xb8c4c9:0x857b65,{...(level==='snowpass'?{bumpMap:w.groundTexture,bumpScale:.08}:{map:w.groundTexture}),side:T.DoubleSide}));
 if(level==='snowpass')for(const z of [-31,-76]){const ice=w.mesh(new T.PlaneGeometry(14,16,6,6),w.mat(0x9cb7c2,{metalness:.4,roughness:.24,transparent:true,opacity:.8}),roadCenter(level,z),-.04,z);ice.rotation.x=-Math.PI/2;}
}
function forest(w){const n=150,trunks=new T.InstancedMesh(new T.CylinderGeometry(.08,.2,7,6),w.mat(0x57605e),n),crowns=new T.InstancedMesh(new T.ConeGeometry(2.4,7,7),w.mat(0x425c61),n),snow=new T.InstancedMesh(new T.ConeGeometry(1.95,5.2,7),w.mat(0xc4d3d8),n),m=new T.Matrix4(),q=new T.Quaternion();
 for(let i=0;i<n;i++){const x=(i%2?-1:1)*(17+rand(i)*30),z=31-rand(i+20)*150,k=.6+rand(i+75);m.compose(new T.Vector3(x,k*3,z),q,new T.Vector3(k,k,k));trunks.setMatrixAt(i,m);m.compose(new T.Vector3(x,k*6,z),q,new T.Vector3(k,k,k));crowns.setMatrixAt(i,m);m.compose(new T.Vector3(x,k*7.7,z),q,new T.Vector3(k,k,k));snow.setMatrixAt(i,m);}trunks.castShadow=crowns.castShadow=true;w.scene.add(trunks,crowns,snow);
}
function gun(w,sledge){const g=w.group();w.box(1.45,.26,3.4,0x695b45,0,.53,.2,g);for(const x of [-.75,.75]){w.box(.2,.36,3.8,0x5b4b36,x,.28,.2,g);w.box(.12,.12,3.8,0x899399,x,.07,.2,g);}
 const barrel=w.mesh(new T.CylinderGeometry(.2,.3,2.85,16),w.mat(0x3e4949,{metalness:.65,roughness:.5}),0,.93,-.22,g);barrel.rotation.x=Math.PI/2;w.mesh(new T.CircleGeometry(.17,16),0x10191b,0,.93,-1.65,g).rotation.y=Math.PI;
 for(const z of [-.8,.4]){const band=w.mesh(new T.TorusGeometry(.295,.035,6,16),0x989078,0,.94,z,g);g.userData.band=band;}
 w.box(.35,.1,.2,0xb89e60,.72,.78,.4,g);w.box(.38,.08,.12,0x404b49,.72,.84,.4,g);
 g.userData.wheels=[];if(!sledge)for(const x of [-1,1]){const a=new T.Group();a.position.set(x,.65,.4);g.add(a);const wheel=w.mesh(new T.TorusGeometry(.67,.09,6,20),0x353930,0,0,0,a);wheel.rotation.y=Math.PI/2;for(let j=0;j<6;j++){const spoke=w.box(.07,1.25,.055,0x887355,0,0,0,a);spoke.rotation.x=j*Math.PI/6;}g.userData.wheels.push(a);}
 const chest=new T.Group();chest.position.set(-.47,.8,1.05);g.add(chest);w.box(.7,.46,.65,0x857557,0,0,0,chest);for(const x of [-.28,.28])w.box(.05,.49,.69,0x3d4740,x,0,0,chest);g.userData.chest=chest;return g;
}
function rope(w){return w.mesh(new T.CylinderGeometry(.027,.027,1,6),0xb9a886);}
function setRope(a,from,to){const direction=new T.Vector3().subVectors(to,from);a.position.copy(from).add(to).multiplyScalar(.5);a.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),direction.clone().normalize());a.scale.set(1,direction.length(),1);}
function ship(w,x,z,scale=1){const g=w.group(x,-1.5,z);g.scale.setScalar(scale);const hull=w.mesh(new T.SphereGeometry(1,12,8),0x444843,0,.45,0,g);hull.scale.set(2.8,2,9);w.box(4.8,.2,14,0x887c60,0,1.35,0,g);for(const zz of [-4,2.7]){w.cyl(.11,12,0x766b50,0,7,zz,g);w.box(7,.11,.12,0x82775e,0,10,zz,g);w.mesh(new T.PlaneGeometry(6.5,4.6),w.mat(0xc4c1b1,{side:T.DoubleSide}),0,7.7,zz,g);}return g;}
function brace(w,x,z,level){const g=w.group(x,groundHeight(level,z),z);for(const a of [-2,-1,0,1,2])w.box(.3,.16,6,0x88785c,a*.8,.04,0,g);return g;}
export function buildLift(w,level){const v=w.liftVisual={ropes:[rope(w),rope(w)],ships:[],crew:[],posts:[]};w.scene.background=new T.Color(level==='snowpass'?0x819cae:level==='dorchester'?0x425469:0xb3bec1);w.scene.fog=new T.FogExp2(level==='snowpass'?0xb5c7d1:level==='dorchester'?0x889ca9:0xb9c4c0,level==='snowpass'?.009:.0035);w.sun.intensity=level==='dorchester'?1.5:2.3;w.sun.color.setHex(level==='dorchester'?0xd0dce8:0xffedd0);
 if(level==='snowpass')w.scene.children.filter(a=>a.isHemisphereLight).forEach(a=>{a.color.setHex(0xd2e7f0);a.groundColor.setHex(0x7a8b98);a.intensity=1.6;});
 if(level!=='bostonreturn'){
  terrain(w,level);v.gun=gun(w,level==='snowpass');v.gun.position.set(0,0,level==='snowpass'?18:24);
  v.roadBrace=brace(w,-3,level==='snowpass'?-18:-11,level);v.roadBrace.visible=false;v.timbers=w.group(-11,groundHeight(level,level==='snowpass'?-8:-3),level==='snowpass'?-8:-3);for(let j=0;j<4;j++){const b=w.box(.35,.16,2.8,0x9c8769,0,.15+j*.18,0,v.timbers);b.rotation.y=.25;}
  for(let z=20;z>=-105;z-=12){const x=roadCenter(level,z),y=groundHeight(level,z);for(const sign of [-1,1]){w.cyl(.065,1.4,0x7d7867,x+sign*6,y+.7,z);const light=w.lantern(x+sign*6,y+1.3,z,false);v.posts.push(light);}}
  w.actor('ROWAN',0,level==='snowpass'?21:28);w.actor('WARD',-2,level==='snowpass'?19:24);w.actor('MARA',3,level==='snowpass'?19:24);
  for(let i=0;i<4;i++){const a=w.soldier();a.userData.gun.visible=false;a.position.set((i%2?-1:1)*2.7,0,(level==='snowpass'?18:24)+3+i*.6);v.crew.push(a);}
  v.carried=w.box(.75,.45,.65,0x8f7c5a,0,0,0);v.carried.visible=false;
  if(level==='snowpass'){
   forest(w);const stream=w.mesh(new T.PlaneGeometry(90,7),w.mat(0x627f90,{metalness:.4,roughness:.3}),0,-.2,-18);stream.rotation.x=-Math.PI/2;
   for(const x of [-5,5])w.box(.25,.4,7,0x7b7060,x,.14,-18);w.box(9,.16,2,0x706951,-3,-.06,-18);
   const n=260,geo=new T.BufferGeometry(),a=[];for(let i=0;i<n;i++)a.push((rand(i)-.5)*52,rand(i+29)*14,30-rand(i+77)*143);geo.setAttribute('position',new T.Float32BufferAttribute(a,3));v.snow=new T.Points(geo,new T.PointsMaterial({color:0xf1f6f7,size:.085,transparent:true,opacity:.7,depthWrite:false}));w.scene.add(v.snow);
   w.box(4,.5,3,0x746d56,9,.25,-106);w.lantern(9,1.8,-105);w.label('BOSTON ROAD',8,2,-109,2.7);
  }else{
   const water=w.mesh(new T.PlaneGeometry(290,240),w.mat(0x566e7d,{metalness:.5,roughness:.34}),91,-2,-73);water.rotation.x=-Math.PI/2;
   w.box(44,.5,57,0x72796c,60,-1.35,-39);
   for(let i=0;i<6;i++)v.ships.push(ship(w,65+(i%3)*23,-61-Math.floor(i/3)*37,.85+i%2*.15));
   for(let i=0;i<19;i++){const x=39+(i%5)*9,z=-20-Math.floor(i/5)*12;const b=w.group(x,-1,z);w.box(5,3+i%3,6,[0x657273,0x777b72,0x747065][i%3],0,1.5+i%3*.5,0,b);w.mesh(new T.ConeGeometry(4.2,2,4),0x485754,0,4+i%3,z*0,b).rotation.y=Math.PI/4;}
   for(let x=-18;x<=18;x+=4){w.box(3.8,1.4,2.4,0x696e59,x,8,-42);const fascine=w.cyl(.35,3.5,0x817858,x,8.9,-41.5);fascine.rotation.z=Math.PI/2;}
   for(const x of [-12,12]){w.box(4,.55,3.1,0x77735e,x,6.8,-26);w.lantern(x,8,-26,false);}w.lantern(9,9,-35);
   v.chocks=[];for(const x of [-1,1]){const c=w.box(.4,.3,.35,0x957e56,x,7.7,-31.4);c.visible=false;v.chocks.push(c);}
  }
 }else{
  w.box(80,.2,120,w.mat(0xadb19a,{map:w.groundTexture}),0,-.13,-5);w.box(13,.035,95,w.mat(0x9f987f,{map:w.groundTexture}),0,-.02,-8);
  for(const [x,z,bw,bd,h] of [[-12,-4,9,20,7],[12,-16,9,25,8],[-12,-31,9,13,6],[12,20,9,13,6]])w.house(x,z,bw,bd,h,x<0?0x798179:0x8e8575);
  v.bar=w.group(0,0,14);w.box(13,.19,.23,0x71634c,0,1.05,0,v.bar);for(const x of [-6.8,6.8])w.box(.25,1.7,.3,0x605a45,x,.85,14);
  w.label('VALE · PRINTING',-7.25,3.2,-11,3.5,Math.PI/2);v.shutter=w.group(-7.45,0,-11);w.box(.18,2.4,2.6,0x514d3a,0,1.6,0,v.shutter);w.box(1.8,.15,1.5,0x776244,-5,1,-12);for(const x of [-5.7,-4.3])for(const z of [-12.5,-11.5])w.box(.09,1,.09,0x605139,x,.5,z);
  v.pamphlet=w.label('COMMON SENSE|1776',-5,1.1,-12,.8);v.pamphlet.rotation.x=-Math.PI/2;
  w.actor('ROWAN',-4,-11);w.actor('MARA',-1,-12);w.actor('WARD',-5,-9);
  for(let i=0;i<8;i++){const a=w.soldier();a.userData.gun.visible=false;a.position.set((i%2?-1:1)*4,0,24-i*7);v.crew.push(a);}
 }
 v.ropes.forEach(a=>a.visible=false);
}
function actor(w,key,x,z,yaw,pose,time,speaking){const a=w.setActor(key,x,z,yaw,pose,time,speaking);a.position.y=groundHeight(w.level,z);return a;}
function snow(v,t){if(v.snow){v.snow.position.y=-(t*.65)%7;v.snow.position.x=Math.sin(t*.18)*1.8;}}
export function renderLift(w,s,input,voice){const v=w.liftVisual,h=s.lift,p=s.player,t=s.time;snow(v,t);
 if(s.level==='bostonreturn'){v.bar.rotation.z=h.barrier?1.5:0;v.shutter.rotation.y=h.shutters?1.4:0;v.pamphlet.visible=s.stage<3;actor(w,'MARA',-1,-12,-Math.PI/2,'listen',t,voice==='MARA');actor(w,'WARD',-5,-9,.4,'listen',t,voice==='WARD');return;}
 const y=groundHeight(s.level,h.z);v.gun.position.set(h.x,y,h.z);v.gun.rotation.set(s.level==='dorchester'?.13:0,h.anchored?-.85:h.yaw,Math.sin(t*8)*Math.min(.035,h.speed*.015));v.gun.userData.wheels.forEach(a=>a.rotation.x=-h.travel/.67);v.gun.userData.chest.position.x=h.balanced?.4:-.47;v.gun.userData.chest.visible=!h.ballast;
 v.roadBrace.visible=h.braced;v.timbers.visible=!(s.carrying||h.braced);v.carried.visible=s.carrying;v.carried.position.set(p.x+Math.cos(p.yaw)*.35,groundHeight(s.level,p.z)+1.02,p.z-Math.cos(p.yaw)*.55);
 const moving=h.speed>.12;actor(w,'WARD',h.x-1.5,h.z+1,h.yaw,moving?'walk':'brace',t,voice==='WARD');actor(w,'MARA',h.x+1.6,h.z+.7,h.yaw,moving?'walk':'brace',t,voice==='MARA');
 if(h.attached){actor(w,'ROWAN',p.x,p.z,p.yaw,moving?'brace':'listen',t,voice==='ROWAN');v.ropes.forEach((a,i)=>{a.visible=true;setRope(a,new T.Vector3(h.x+(i?1:-1)*.62,y+.62,h.z-1.5),new T.Vector3(p.x+(i?1:-1)*.23,groundHeight(s.level,p.z)+.95,p.z+.15));});}else v.ropes.forEach(a=>a.visible=false);
 v.crew.forEach((a,i)=>{a.position.set(h.x+(i%2?-1:1)*2.7,groundHeight(s.level,h.z+3+i*.6),h.z+3+i*.6);a.rotation.y=h.yaw;a.userData.legs.forEach((l,j)=>l.rotation.x=moving?Math.sin(t*5+j*Math.PI+i)*.25:0);});
 if(v.chocks)v.chocks.forEach((a,i)=>{a.visible=h.anchored;a.position.set(h.x+(i?1:-1),y+.2,h.z+.5);});
}
export function liftCamera(w,s,reduced){const p=s.player,y=groundHeight(s.level,p.z);if(s.lift.attached){w.camera.position.set(p.x+Math.sin(p.yaw)*9+Math.cos(p.yaw)*2.2,y+4.8+(reduced?0:Math.sin(s.time*3)*s.lift.speed*.008),p.z+Math.cos(p.yaw)*9-Math.sin(p.yaw)*2.2);w.camera.rotation.set(p.pitch-.38,p.yaw,0);w.camera.fov=72;}else w.camera.position.y+=y;w.camera.updateProjectionMatrix();}
export function filmLift(w,key,beat,time,elapsed,speaking){const v=w.liftVisual;snow(v,elapsed);const speaker=({liftIntro:['ROWAN','WARD','MARA','ROWAN','WARD','MARA'],liftArrival:['WARD','ROWAN','WARD','MARA'],heightsIntro:['MARA','ROWAN','WARD','MARA','WARD','ROWAN'],liftEvacuation:['MARA','WARD','ROWAN','MARA','WARD','ROWAN'],liftHome:['ROWAN','MARA','WARD','ROWAN','MARA']}[key])[beat];
 const a=(name,x,z,yaw,pose='listen')=>actor(w,name,x,z,yaw,pose,time,speaking&&speaker===name);
 v.ropes.forEach(a=>a.visible=false);
 if(key==='liftIntro'){v.gun.position.set(0,0,18);a('ROWAN',0,21,0,beat===0?'kneel':'listen');a('WARD',-2,19,-Math.PI/2,beat===1?'reach':'listen');a('MARA',3,19,Math.PI/2,beat===5?'point':'listen');}
 else if(key==='liftArrival'){v.roadBrace.visible=true;v.gun.position.set(4,0,-101);const ward=a('WARD',7,-105,Math.PI,'paper');ward.userData.hands[1].rotation.z+=Math.sin(time*20)*.035;a('ROWAN',4,-102,-.8,'listen');a('MARA',9,-104,1,'listen');}
 else if(key==='heightsIntro'){v.gun.position.set(0,0,24);a('MARA',3,24,Math.PI/2,'kneel');a('WARD',-2,24,-Math.PI/2,beat===4?'point':'listen');a('ROWAN',0,28,0,'listen');}
 else if(key==='liftEvacuation'){v.gun.position.set(2,7.3,-32);v.gun.rotation.y=-.85;v.roadBrace.visible=true;v.chocks.forEach(a=>a.visible=true);a('MARA',9,-35,Math.PI/2,beat===0?'point':'listen');a('WARD',5,-34,-.6,'listen');a('ROWAN',2,-35,-.85,'listen');v.ships.forEach((s,i)=>{s.position.z=-61-Math.floor(i/3)*37-elapsed*.18;s.position.x=65+(i%3)*23+elapsed*.04;});}
 else {v.bar.rotation.z=1.5;v.shutter.rotation.y=1.4;a('ROWAN',-4,-11,.5,beat===0?'read':'listen');a('MARA',-1,-12,Math.PI/2,'listen');a('WARD',-5,-9,-.2,'listen');}
}
