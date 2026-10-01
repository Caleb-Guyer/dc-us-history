import * as T from './three.module.js';
import {PRINT_BLOCKS,DISPATCH_BLOCKS} from './c6-paper.mjs?v=4.8.0-published';
const face=(x,z,tx,tz)=>Math.atan2(-(tx-x),-(tz-z));
function table(w,x,z,width=2.6,depth=1.2){const g=w.group(x,0,z);w.box(width,.14,depth,0x7c5c3e,0,1,0,g);for(const xx of [-width*.4,width*.4])for(const zz of [-depth*.35,depth*.35])w.box(.12,1,.12,0x564b3c,xx,.5,zz,g);return g;}
function page(w,text,x,y,z,width=.75){const a=w.label(text,x,y,z,width);a.rotation.x=-Math.PI/2;return a;}
function declaration(w,x,y,z,width=1.25){
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=1400;const c=canvas.getContext('2d');c.fillStyle='#dfcfad';c.fillRect(0,0,1024,1400);c.fillStyle='#393d33';c.textAlign='center';c.font='42px Georgia';c.fillText('IN CONGRESS, JULY 4, 1776',512,112);c.font='bold 78px Georgia';c.fillText('DECLARATION',512,225);c.font='45px Georgia';c.fillText('OF',512,292);c.font='bold 62px Georgia';const word='INDEPENDENCE',space=69,start=512-(word.length-1)*space/2;for(let i=0;i<word.length;i++){c.save();c.translate(start+i*space,382+(i===5?7:0));if(i===5)c.rotate(.045);c.fillText(word[i],0,0);c.restore();}
 c.font='36px Georgia';c.fillText('Life · Liberty · Pursuit of Happiness',512,480);for(let j=0;j<28;j++){c.fillRect(90,550+j*24,750-(j%4)*28,4);if(j%8===7)c.fillRect(90,556+j*24,615,2);}c.font='italic 30px Georgia';c.fillText('Consent of the governed',512,1300);
 const tex=new T.CanvasTexture(canvas);tex.colorSpace=T.SRGBColorSpace;const a=w.mesh(new T.PlaneGeometry(width,width*1.367),w.mat(0xffffff,{map:tex}),x,y,z);a.rotation.x=-Math.PI/2;return a;
}
function typeBlock(w,x,z,text){const g=w.group(x,1.16,z);w.box(1.7,.15,.7,0x454d49,0,0,0,g);for(let j=0;j<13;j++)w.box(.09,.06,.6,0x9c9f90,-.74+j*.12,.11,0,g);const a=page(w,text,x,1.3,z,1.6);g.attach(a);g.userData.caption=a;return g;}
function press(w){const g=w.group(0,0,-11);w.box(2.7,.3,2.2,0x615039,0,.6,0,g);for(const x of [-1.3,1.3]){w.box(.26,3.7,.32,0x554630,x,1.85,0,g);w.box(.6,.18,.9,0x4d4432,x,.1,0,g);}
 w.box(3.2,.36,.6,0x6d5839,0,3.35,0,g);w.box(2.7,.14,1.8,0x968362,0,.86,0,g);
 const screw=w.cyl(.12,1.6,0x79786b,0,2.55,0,g);for(let j=0;j<11;j++){const ring=w.mesh(new T.TorusGeometry(.13,.035,5,14),0xaaa78c,0,1.9+j*.13,0,g);ring.rotation.x=Math.PI/2;}
 const platen=w.box(2.15,.23,1.65,0x534d40,0,1.8,0,g);const handle=w.group();g.add(handle);handle.position.set(0,2.1,0);w.box(2.9,.09,.1,0x4f4b3b,0,0,0,handle);for(const x of [-1.45,1.45])w.sphere(.11,0x665840,x,0,0,handle);
 const carriage=new T.Group();g.add(carriage);carriage.position.set(0,1,1.7);w.box(2.05,.13,1.6,0x3f4c4e,0,0,0,carriage);for(let j=0;j<17;j++)w.box(1.65,.05,.045,0x93968d,0,.1,-.67+j*.08,carriage);
 const sheet=w.box(1.8,.012,1.4,0xe6d5b3,0,.16,0,carriage);const text=new T.Group();carriage.add(text);for(let j=0;j<16;j++)w.box(1.47-(j%3)*.06,.007,.025,0x3e4037,0,.171,-.6+j*.074,text);w.box(1.5,.008,.09,0x313b35,0,.172,-.62,text);
 for(const x of [-1.05,1.05])w.box(.08,.08,3.5,0x8b785a,x,.89,.6,g);
 g.userData={platen,handle,carriage,sheet,text,screw};return g;
}
export function buildPaper(w,level){const v=w.paperVisual={workers:[],types:[],rain:null};w.scene.fog=new T.FogExp2(0xa8a492,level==='dispatch'?.004:.0001);w.scene.background=new T.Color(level==='dispatch'?0x9aadae:0x655d4e);w.sun.color.setHex(0xffe4bc);w.sun.intensity=2.4;
 if(level==='thomasdesk'){
  w.box(15,.2,15,0x6d624f,0,-.13,0);w.box(15,5,.3,0x777769,0,2.5,-5);w.box(.3,5,15,0x686a61,-5,2.5,0);w.box(2,2,.1,0x293b41,2,2.9,-4.8);w.box(.04,2,.12,0xa49a83,2,2.9,-4.7);table(w,0,-1,2.7,1.6);v.declaration=declaration(w,0,1.12,-1,1.05);v.letter=page(w,'ROWAN',.75,1.13,-.8,.6);w.cyl(.14,.17,0x282f2c,-.9,1.18,-1.3);w.lantern(-1.1,1.35,-1.4);w.actor('THOMAS',0,-2,Math.PI);return;
 }
 if(level==='printshop'){
  w.box(20,.22,42,w.mat(0x8c7559,{map:w.woodTexture}),0,-.14,-2);for(const x of [-9.5,9.5])w.box(.65,5.5,41,w.mat(0x9b8e76,{map:w.stoneTexture}),x,2.75,-2);for(const z of [-22.5,18.5])w.box(20,5.5,.6,0x8c816c,0,2.75,z);
  for(let z=14;z>=-18;z-=8){w.box(19,.3,.4,0x4c4837,0,5.25,z);for(const x of [-9.13,9.13]){w.box(.07,2,2.4,w.mat(0xf4dfac,{emissive:0xffd693,emissiveIntensity:.28}),x,2.7,z);w.box(.1,2.2,.06,0x5b5341,x,2.7,z);w.box(.1,.06,2.5,0x5b5341,x,2.7,z);}}
  for(const x of [-3,3]){table(w,x,9,2.1,.9);w.box(.9,.16,.7,0x5d513b,x,1.14,9);page(w,x<0?'MARA|COMMON POOL':'HART|RESERVE STOCK',x,1.3,9,1.7);}
  for(const x of [-5,5]){table(w,x,2);for(let j=0;j<7;j++)w.box(1.65,.035,.85,0xd7c3a3,x,1.1+j*.037,2);page(w,x<0?'COMMON RUN':'PRIVATE RESERVE',x,1.42,2,1.7);}
  table(w,-5,5,2.6,.7);page(w,'SUPPLY TALLY',-5,1.13,5,1.8);
  for(const [x,z,label] of [[-6.7,-7.2,'HEADING'],[6.7,-7.2,'GRIEVANCES'],[-6.7,-14.2,'RIGHTS · CONSENT']]){table(w,x,z,2.8);v.types.push(typeBlock(w,x,z,label));}
  v.press=press(w);for(let i=0;i<3;i++){const a=w.box(1.5,.1,.4,0xa6a48d,0,1.19,-11.65+i*.6);v.types.push(a);a.visible=false;}
  table(w,-5,-19,3.4,1);table(w,5,-18,3.4,1);v.proof=page(w,'RIGHTS|CONSENT',2,.04,-17,1.1);v.mended=page(w,'DECLARATION',-5,1.12,-19,1.2);v.mended.visible=false;
  v.packets=[];for(let i=0;i<3;i++){const p=page(w,['NEIGHBORHOOD','FRANCE','SPAIN'][i],3.9+i*1.05,1.13,-18,.9);v.packets.push(p);}
  v.oldPamphlet=page(w,'COMMON SENSE|JANUARY 1776',-6.4,1.15,5,.9);
  w.label('NEIGHBORHOOD REPRINTS|PHILADELPHIA · JULY 1776',0,3.6,-22.12,6);
  for(const key of ['ROWAN','MARA','WARD'])w.actor(key,0,8);for(let i=0;i<4;i++){const a=w.soldier();a.userData.gun.visible=false;a.position.set(i%2?-7:7,0,13-Math.floor(i/2)*17);v.workers.push(a);}
  v.carried=w.box(1.7,.12,.7,0x848980,0,0,0);v.carried.visible=false;return;
 }
 w.box(120,.2,170,w.mat(0x9d9c84,{map:w.groundTexture}),0,-.15,-20);w.box(14,.035,110,w.mat(0xa1957a,{map:w.stoneTexture}),0,-.025,-20);
 for(const [x,z,b,d,h] of DISPATCH_BLOCKS){if(h>3)w.house(x,z,b,d,h,x<0?0x938779:0x827e6c);else{w.box(b,h,d,0x786f59,x,h/2,z);w.box(b+.6,.25,d+.6,0x514d3d,x,h+.1,z);}}
 table(w,0,18,7.5,1.1);for(const x of [-3,3])page(w,x<0?'NEIGHBORHOOD FIRST':'HARBOR FIRST',x,1.13,18,2.8);
 table(w,5,-4,3.6,2);w.box(4.6,.15,4.6,0x555b50,5,3.2,-4);for(const x of [3,7])for(const z of [-6,-2])w.box(.12,3.2,.12,0x6e6048,x,1.6,z);w.label('COVERED RACK',5,2.4,-1.95,3.3);
 table(w,-16,-8,3.5,1);w.label('COPIES FOR THE NEIGHBORHOOD',-15,2.8,-9,4);w.label('NORTHERN ROAD',0,2.4,-66,4);
 w.box(25,.3,12,0x82755b,22,.03,-39);for(let x=11;x<35;x+=1.2)w.box(.04,.015,11,0x4e5149,x,.195,-39);const water=w.mesh(new T.PlaneGeometry(140,160),w.mat(0x536d75,{metalness:.3,roughness:.4}),81,-.6,-48);water.rotation.x=-Math.PI/2;
 const boat=w.group(30,-.3,-39);w.box(3,.7,7,0x4e574d,0,.1,0,boat);w.box(2.5,.08,6,0x9d8a67,0,.4,0,boat);w.cyl(.08,7,0x777762,0,3.5,0,boat);w.mesh(new T.PlaneGeometry(3.7,4),w.mat(0xd6d0b9,{side:T.DoubleSide}),0,4,-.1,boat);v.boat=boat;
 for(const key of ['ROWAN','MARA','WARD','ISAIAH','RUNNER'])w.actor(key,0,0);for(let i=0;i<7;i++){const a=w.soldier();a.userData.gun.visible=false;a.position.set(i%2?-19:20,0,20-i*11);v.workers.push(a);}
 const a=[];for(let i=0;i<360;i++)a.push(Math.sin(i*17)*24,((i*7.7)%16),25-((i*11.9)%92));const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(a,3));v.rain=new T.Points(geo,new T.PointsMaterial({color:0xdae9e8,size:.045,transparent:true,opacity:.45,depthWrite:false}));w.scene.add(v.rain);
}
function actor(w,key,x,z,yaw,pose,t,speaking){return w.setActor(key,x,z,yaw,pose,t,speaking);}
function machine(v,q,t){const a=v.press.userData;a.carriage.position.z=1.7-q.carriage*1.7;a.platen.position.y=1.8-q.stroke*.51;a.handle.rotation.y=q.stroke*1.1;a.sheet.visible=q.phase!=='feed';a.text.visible=q.phase==='take'&&q.quality>.5;v.types.forEach((a,i)=>{a.visible=i<3?q.type<=i&&q.block!==i+1:q.type>i-3;});v.proof.visible=!q.proofCaught;v.proof.position.set(q.proofX,.05,q.proofZ);v.proof.rotation.y=Math.sin(t*2)*.16;v.mended.visible=q.proofMended;v.packets.forEach(a=>a.visible=q.sheets>=3);}
export function renderPaper(w,s,input,voice){const v=w.paperVisual,q=s.paper,p=s.player,t=s.time;
 if(s.level==='printshop'){
  machine(v,q,t);actor(w,'MARA',-3,s.stage<3?7:-7,face(-3,-7,0,-9),'paper',t,voice==='MARA');actor(w,'WARD',3,s.stage<3?6:-7,face(3,-7,0,-9),'listen',t,voice==='WARD');if(q.atPress)actor(w,'ROWAN',1.15,-8.8,.2,q.phase==='stroke'?'brace':'work',t,voice==='ROWAN');
  v.carried.visible=s.carrying;v.carried.position.set(p.x+Math.cos(p.yaw)*.35,1.1,p.z-Math.cos(p.yaw)*.5);v.carried.rotation.y=p.yaw;
  v.workers.forEach((a,i)=>{const active=q.cooperation>0;a.userData.arms.forEach((arm,j)=>arm.rotation.x=active?.38+Math.sin(t*3+i+j)*.13:0);a.rotation.y=i%2?Math.PI/2:-Math.PI/2;});
 }else{
  v.rain.visible=q.rain>.1;v.rain.position.y=-(t*7)%8;v.rain.material.opacity=q.rain*.45;actor(w,'MARA',-15,-7,Math.PI,'paper',t,voice==='MARA');actor(w,'WARD',-12,-8,Math.PI*.8,'listen',t,voice==='WARD');actor(w,'ISAIAH',15,-39,Math.PI,'listen',t,voice==='ISAIAH');actor(w,'RUNNER',2,-62,Math.PI,'paper',t,voice==='RUNNER');v.boat.position.y=-.3+Math.sin(t*.8)*.03;
 }
}
export function paperCamera(w,s){if(!s.paper.atPress)return;const p=s.player;w.camera.position.set(0,2.35,-6.7);w.camera.rotation.set(-.23+p.pitch*.45,p.yaw*.35,0);w.camera.fov=66;w.camera.updateProjectionMatrix();}
export function filmPaper(w,key,beat,time,elapsed,speaking){const v=w.paperVisual,who={paperIntro:['ROWAN','MARA','WARD','ROWAN','MARA','WARD','MARA','ROWAN'],paperPrinted:['ROWAN','MARA','WARD','ROWAN','MARA','WARD'],paperDeparture:['ISAIAH','ROWAN','ISAIAH','MARA','WARD','ISAIAH'],paperThomas:Array(7).fill('THOMAS'),paperCoda:['RUNNER','ROWAN','MARA','WARD','ROWAN']}[key][beat];const a=(key,x,z,yaw,pose='listen')=>actor(w,key,x,z,yaw,pose,time,speaking&&who===key);
 if(key==='paperIntro'){a('ROWAN',0,9,0,'listen');a('MARA',-3,7,-1.1,'paper');a('WARD',3,6,1,'listen');v.proof.visible=false;v.packets.forEach(a=>a.visible=false);v.types.forEach((a,i)=>a.visible=i<3);}
 else if(key==='paperPrinted'){a('ROWAN',0,-5,0,'work');a('MARA',-3,-7,-1.1,'paper');a('WARD',3,-7,1,'listen');v.proof.visible=false;v.mended.visible=true;v.packets.forEach(a=>a.visible=true);v.types.forEach((a,i)=>a.visible=i>=3);v.press.userData.carriage.position.z=1.7;v.press.userData.sheet.visible=true;v.press.userData.text.visible=true;}
 else if(key==='paperDeparture'){v.rain.visible=false;a('ISAIAH',15,-39,face(15,-39,12,-38),beat===0?'paper':'listen');a('ROWAN',12,-38,face(12,-38,15,-39),'listen');a('MARA',10,-38,face(10,-38,15,-39),'listen');a('WARD',8,-37,face(8,-37,15,-39),'listen');v.boat.position.y=-.3+Math.sin(elapsed*.8)*.04;}
 else if(key==='paperThomas'){a('THOMAS',0,-2,Math.PI,beat<5?'read':'paper');v.declaration.rotation.y=beat>=5?.13:0;v.letter.visible=beat>=4;}
 else {v.rain.visible=false;a('RUNNER',2,-62,Math.PI,'paper');a('ROWAN',0,-60,0,'listen');a('MARA',-3,-61,-1.1,'listen');a('WARD',3,-60,1,'paper');}
}



