import * as T from './three.module.js';
import {HILL_BLOCKS,hillDefending} from './c6-hill.mjs?v=4.12.0-published';
const mix=(a,b,t)=>a+(b-a)*t, face=(x,z,tx,tz)=>Math.atan2(-(tx-x),-(tz-z));
const rand=n=>{const v=Math.sin(n*127.1+31.7)*43758.5453;return v-Math.floor(v);};
export function buildRunner(w,x,z){const a=w.actor('ROWAN',x,z);delete w.cast.ROWAN;w.cast.RUNNER=a;a.traverse(o=>{if(o.isMesh&&o.material?.color&&[0x315663,0x345958].includes(o.material.color.getHex())){o.material=o.material.clone();o.material.color.setHex(0x79724b);}});return a;}
function cannon(w,x,z){const g=w.group(x,0,z);w.box(1.25,.35,2.2,0x62503c,0,.6,.2,g);for(const side of [-1,1]){const wheel=w.mesh(new T.TorusGeometry(.66,.075,6,16),0x3b342c,side*.88,.7,.25,g);wheel.rotation.y=Math.PI/2;for(let j=0;j<5;j++){const spoke=w.box(.07,1.2,.055,0x89704b,side*.88,.7,.25,g);spoke.rotation.x=j*Math.PI/5;}}const barrel=w.mesh(new T.CylinderGeometry(.17,.25,2.5,14),w.mat(0x3f4844,{metalness:.5}),0,1.03,-.65,g);barrel.rotation.x=Math.PI/2+.08;w.mesh(new T.CircleGeometry(.145,14),0x151e1b,0,1.13,-1.90,g).rotation.y=Math.PI;return g;}
function prone(w,x,z){const a=w.soldier();a.position.set(x,.19,z);a.rotation.set(0,.4,1.5);a.userData.gun.visible=false;return a;}
export function buildHill(w){
 const h=w.hill={crew:[],wounded:[],blankets:[],columns:[],filmRed:[],gunCrew:[],smokeBeat:null};
 w.scene.background=new T.Color(0xacb6b2);w.scene.fog=new T.FogExp2(0xb4b9a6,.0065);w.sun.intensity=2.35;
 // The plateau is flat for legible cover; its perimeter falls toward the harbor.
 const dirt=w.mat(0x9b8b61,{map:w.groundTexture}),wood=w.mat(0x81704e,{map:w.woodTexture});
 for(const [x,z,bw,bd,bh] of HILL_BLOCKS){
  const geo=new T.BoxGeometry(bw,bh,bd,Math.ceil(bw),1,Math.ceil(bd)),v=geo.attributes.position;
  for(let i=0;i<v.count;i++){if(v.getY(i)>0){v.setX(i,v.getX(i)*.91);v.setZ(i,v.getZ(i)*.67);v.setY(i,v.getY(i)-rand(i)*.075);}}geo.computeVertexNormals();w.mesh(geo,dirt,x,bh/2,z);
  const long=bw>bd,n=Math.ceil(Math.max(bw,bd)/.7);for(let i=0;i<n;i++){const along=(i+.5)/n-.5,xx=x+(long?along*bw:0),zz=z+(!long?along*bd:0);w.mesh(new T.DodecahedronGeometry(.29,0),[0x9d8e64,0x92825d,0x897b59][i%3],xx,bh-.05,zz).scale.set(1.4,.55,1.1);if(i%5===0){const timber=w.box(.14,bh,.14,wood,xx,bh*.45,zz+(long?bd*.46:0));timber.rotation.x=.14;}}
 }
 for(const side of [-1,1]){const geo=new T.PlaneGeometry(82,130,6,10),v=geo.attributes.position;for(let i=0;i<v.count;i++){const x=v.getX(i);v.setZ(i,-(x+41)/82*14+Math.sin(v.getY(i)*.035)*Math.max(0,x)/41);}geo.rotateX(-Math.PI/2);if(side<0)geo.rotateY(Math.PI);w.mesh(geo,w.mat(0x899173,{map:w.groundTexture,side:T.DoubleSide}),side*69,-.05,-8);}
 // Small instanced tufts and broken rails give the open field scale without obscuring targets.
 const tufts=new T.InstancedMesh(new T.ConeGeometry(.12,.4,3),w.mat(0x8a8b61),380),matrix=new T.Matrix4();for(let i=0;i<380;i++){const x=(rand(i+30)-.5)*54,z=-3-rand(i+50)*53;matrix.compose(new T.Vector3(x,.15,z),new T.Quaternion().setFromEuler(new T.Euler(0,i,0)),new T.Vector3(1,.5+rand(i),1));tufts.setMatrixAt(i,matrix);}w.scene.add(tufts);
 w.box(150,.5,65,w.mat(0x848665,{map:w.groundTexture}),0,-6,-89).rotation.x=.13;
 const water=w.mesh(new T.PlaneGeometry(300,360),w.mat(0x708b8d,{metalness:.3,roughness:.3}),134,-9,-25);water.rotation.x=-Math.PI/2;
 for(let i=0;i<3;i++){const g=w.group(92+i*24,-8.5,-72+i*33);const hull=w.mesh(new T.SphereGeometry(1,12,7),0x3d4842,0,0,0,g);hull.scale.set(3,2,11);for(const z of [-4,3]){w.cyl(.14,13,0x786e55,0,7,z,g);w.box(8,.12,.12,0x857d64,0,10,z,g);w.mesh(new T.PlaneGeometry(7,4),w.mat(0xc2b9a0,{side:T.DoubleSide}),0,7.8,z,g);}w.box(.5,.8,.5,0xa1834d,0,13.7,-4,g);}
 // Distant Charlestown, kept beyond the playable terrain.
 for(let i=0;i<14;i++){const x=-49-(i%4)*8,z=-28-Math.floor(i/4)*11;const g=w.group(x,-7,z);w.box(5,4+(i%3),6,0x747366,0,2,0,g);const roof=w.mesh(new T.ConeGeometry(4.6,2.3,4),0x51594e,0,4.7+(i%3),0,g);roof.rotation.y=Math.PI/4;}
 for(let i=0;i<11;i++){const sprite=new T.Sprite(new T.SpriteMaterial({map:w.smokeTexture,color:0x5b6057,opacity:.6,depthWrite:false}));sprite.position.set(-48-i%3*7,2+i*2.4,-35-i%4*8);sprite.scale.set(14+i*.9,16+i,1);w.scene.add(sprite);h.columns.push(sprite);}
 h.braces=[];for(let i=0;i<5;i++){const b=w.box(.16,1.35,.15,wood,-10+i, .58,1.0);b.rotation.x=.45;h.braces.push(b);}
 h.flank=w.group(17.5,0,1.9);for(let i=0;i<5;i++){const b=w.box(.16,1.4,.16,wood,i*.55-1.1,.7,0,h.flank);b.rotation.z=.12;}w.box(3,.16,.15,wood,0,.45,0,h.flank);w.box(3,.16,.15,wood,0,1.05,0,h.flank);
 h.posts=[];for(const x of [-12,12]){const p=w.group(x,0,9);w.box(1.5,.65,.85,wood,0,.325,0,p);w.box(1.65,.08,.96,0x9d8a5c,0,.69,0,p);w.label('CARTRIDGES',x,.9,9.48,1.15);h.posts.push(p);}
 h.reserve=w.group(-8,0,3);w.box(.85,.45,.55,wood,0,.23,0,h.reserve);for(const x of [-.3,.3])w.box(.055,.49,.58,0x393c2e,x,.23,0,h.reserve);
 h.cannon=cannon(w,-11,2);h.gunCrew=[w.soldier(),w.soldier()];h.gunCrew.forEach((a,i)=>{a.position.set(-12.4+i*2.7,0,2.2);a.userData.gun.visible=false;});
 w.flag(-18,5,0xbdba9c);w.flag(18,-9,0xa05045);
 for(let i=0;i<8;i++){const a=w.soldier();a.position.set(-17+i*4.5,0,1.6);h.crew.push(a);}
 h.wounded=[prone(w,-7,8),prone(w,17,16)];h.carried=w.soldier();h.carried.userData.gun.visible=false;h.carried.visible=false;
 for(let i=0;i<2;i++){w.box(2.8,.045,1.2,0xa8a18a,3+i*3,.035,43);h.blankets.push(prone(w,3+i*3,43));}
 for(let i=0;i<5;i++){const red=w.soldier(true);red.visible=false;red.position.set(-8+i*4,0,-4-i%2*2);red.rotation.y=Math.PI;h.filmRed.push(red);}
 w.box(1.5,.5,1,wood,-2,.25,45);w.box(.8,.18,.8,0xb6ad92,-2,.61,45);
 h.dispatch=w.label('PHILADELPHIA | 15 JUNE 1775',-.3,1.22,15.2,1.05);h.dispatch.rotation.x=-.8;
 h.warning=w.mesh(new T.RingGeometry(3,3.18,48),new T.MeshBasicMaterial({color:0xe0a064,transparent:true,opacity:.5,side:T.DoubleSide,depthWrite:false}),0,.08,0);h.warning.rotation.x=-Math.PI/2;h.warning.visible=false;
 buildRunner(w,2,14);w.actor('ROWAN',-1,16);w.actor('WARD',-3,13);w.actor('MARA',1,43);w.wagonObject=null;
}
function militia(w,t,active,flash=0,retreat=false){w.hill.crew.forEach((a,i)=>{a.visible=!retreat||i<3;a.position.y=0;a.rotation.y=0;const cycle=(t+i*.73)%10,reloading=active&&cycle>1&&cycle<5;a.userData.arms.forEach(arm=>arm.rotation.x=reloading?.5+Math.sin(t*4)*.25:active?1.05:.2);a.userData.gun.rotation.x=reloading?-1.18:active?0:-.25;a.userData.flash.visible=flash>0&&i%2===0;});}
function landscape(w,t){w.hill.columns.forEach((a,i)=>{a.position.x=-48-i%3*7+Math.sin(t*.08+i)*2;a.material.opacity=.46+Math.sin(t*.2+i)*.08;});}
export function renderHill(w,s,input,voice){const h=s.hill,v=w.hill,t=s.time,p=s.player;landscape(w,t);v.dispatch.visible=false;v.filmRed.forEach(a=>a.visible=false);militia(w,t,hillDefending(s),h.crewFlash,h.retreat);
 v.braces.forEach(a=>a.visible=h.braced);v.flank.rotation.z=h.flank?0:1.1;v.reserve.visible=!h.reserveUsed;if(s.stage===1){v.reserve.position.set(p.x-Math.sin(p.yaw)*.65,.65,p.z-Math.cos(p.yaw)*.65);v.reserve.rotation.y=p.yaw;}else if(h.reserve){v.reserve.position.set(h.reserve==='left'?-12:12,.73,9);v.reserve.rotation.y=0;}
 v.gunCrew.forEach(a=>a.visible=h.gunCrew);v.cannon.rotation.z=h.gunCrew?0:.13;v.warning.visible=h.shellIn>0;v.warning.position.set(h.shellX,.08,h.shellZ);v.warning.material.opacity=.3+Math.sin(t*12)*.2;
 v.wounded[0].visible=s.stage===7;v.wounded[1].visible=s.stage>=7&&s.stage<10;v.blankets.forEach((a,i)=>a.visible=h.rescues>i);
 v.carried.visible=s.carrying&&s.stage>7;if(v.carried.visible){v.carried.position.set(p.x+Math.cos(p.yaw)*.68,0,p.z-Math.sin(p.yaw)*.68+.3);v.carried.rotation.set(0,p.yaw,.16);v.carried.userData.legs.forEach((a,i)=>a.rotation.x=Math.sin(t*5+i*Math.PI)*.12);}
 const wz=h.wardCalled?mix(5,47,h.wardProgress):h.retreat?5:3,wx=h.wardCalled?0:-3;w.setActor('WARD',wx,wz,h.wardCalled?Math.PI:0,h.wardCalled&&h.wardProgress<1?'run':hillDefending(s)?'brace':'listen',t,voice==='WARD');
 w.setActor('RUNNER',h.retreat?-1:16,h.retreat?42:5,h.retreat?Math.PI:0,h.retreat?'kneel':'brace',t,voice==='RUNNER');w.setActor('MARA',1,43,face(1,43,4,43),h.rescues?'tend':'point',t,voice==='MARA');
}
export function filmHill(w,key,beat,time,elapsed,speaking){const h=w.hill;landscape(w,elapsed);h.warning.visible=false;h.reserve.visible=true;h.carried.visible=false;h.wounded.forEach(a=>a.visible=false);h.filmRed.forEach(a=>a.visible=key!=='hillIntro');w.enemies.forEach(a=>a.visible=false);h.blankets.forEach(a=>a.visible=key==='hillEnding');h.dispatch.visible=key==='hillIntro'&&beat<3;h.gunCrew.forEach(a=>a.visible=key==='hillIntro');militia(w,elapsed,key==='hillBreak',0,key==='hillEnding');
 if(key==='hillIntro'){
  w.setActor('RUNNER',0,14,Math.PI,'paper',time,speaking&&beat===0);w.setActor('ROWAN',-1,16,.15,'listen',time,speaking&&(beat===1||beat===4));w.setActor('WARD',-3,13,face(-3,13,-1,16),beat===5?'point':'listen',time,speaking&&[2,5,7].includes(beat));w.setActor('MARA',2,16,face(2,16,-1,16),beat===3?'point':'listen',time,speaking&&(beat===3||beat===6));
 }else if(key==='hillBreak'){
  if(h.smokeBeat!==beat){h.smokeBeat=beat;if(beat===0){w.smoke(-11,2,4);w.smoke(-8,1,3);}if(beat===2)w.smoke(0,0,2);}
  const duck=beat>=2,rowan=w.setActor('ROWAN',-.2,3,0,duck?'kneel':'listen',time,speaking&&[0,3,5].includes(beat)),ward=w.setActor('WARD',-1.1,2.6,-Math.PI/2,beat===2?'reach':duck?'kneel':'brace',time,speaking&&[2,4].includes(beat));
  if(beat===2){const p=Math.min(1,time/.7);rowan.userData.root.position.y=-.47*p;rowan.position.z=3+.25*p;ward.userData.root.position.y=-.40*p;ward.position.z=2.6+.3*p;ward.userData.head.rotation.z=.12*p;}
  w.setActor('RUNNER',3,5,face(3,5,0,3),'point',time,speaking&&beat===1);h.cannon.rotation.z=.13;
  h.filmRed.forEach((a,i)=>{a.position.z=-5-i%2*2+Math.min(2,elapsed*.045);a.userData.arms.forEach(arm=>arm.rotation.x=1.05);});
 }else{
  h.crew.forEach(a=>a.visible=false);w.setActor('MARA',2,42,face(2,42,3,43),'tend',time,speaking&&[0,5].includes(beat));w.setActor('ROWAN',3.5,44,0,'kneel',time,speaking&&[1,3,6].includes(beat));w.setActor('WARD',.2,42,face(.2,42,3.5,44),'listen',time,speaking&&[2,4].includes(beat));w.setActor('RUNNER',6.4,42,Math.PI,'kneel',time);h.filmRed.forEach((a,i)=>a.position.set(-8+i*4,0,2));
 }
}
