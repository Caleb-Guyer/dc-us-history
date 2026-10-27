import * as T from './three.module.js';
import {makeActor,poseActor} from './c5-actors.mjs';

// Original, staged scenes. The camera follows an action rather than orbiting a
// static game board; every spoken line has its own blocking and visual inserts.
const V=(x,y,z)=>new T.Vector3(x,y,z),mix=(a,b,t)=>a+(b-a)*t;
const ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const rnd=i=>{const n=Math.sin(i*81.37+19.2)*9147.71;return n-Math.floor(n);};
function print(w,title,body,width=4,height=2){
 const c=document.createElement('canvas');c.width=1024;c.height=512;const a=c.getContext('2d');
 a.fillStyle='#e6d3ab';a.fillRect(0,0,1024,512);a.strokeStyle='#5d4833';a.lineWidth=4;a.strokeRect(22,22,980,468);a.fillStyle='#2c302c';a.textAlign='center';
 a.font='bold 66px Georgia';let y=113,line='';for(const word of title.split(' ')){if(a.measureText(line+word).width>910){a.fillText(line,512,y);y+=76;line='';}line+=word+' ';}a.fillText(line,512,y);a.fillRect(60,y+30,904,4);a.font='34px Georgia';y+=95;line='';for(const word of body.split(' ')){if(a.measureText(line+word).width>900){a.fillText(line,512,y);y+=46;line='';}line+=word+' ';}a.fillText(line,512,y);
 const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;const p=w.mesh(new T.PlaneGeometry(width,height),w.mat(0xffffff,{map,side:T.DoubleSide}),0,0,0);p.castShadow=false;return p;
}
function person(w,key,x,z,heading=Math.PI){const a=makeActor(key);a.position.set(x,0,z);a.rotation.y=heading;w.scene.add(a);return a;}
function table(w,x,z,width=4){const oak=w.mat(0x735239,{map:w.wood});w.box(width,.16,2,oak,x,1.15,z);for(const a of [-1,1])for(const b of [-1,1])w.box(.13,1.15,.13,oak,x+a*(width*.42),.57,z+b*.76);}
function candle(w,x,y,z){w.cyl(.06,.30,0xd3b878,x,y,z);const flame=w.mesh(new T.SphereGeometry(.055,7,6),w.mat(0xffcc6b,{emissive:0xffa02a,emissiveIntensity:3}),x,y+.19,z);flame.scale.y=2;const l=new T.PointLight(0xffa951,10,8,2);l.position.set(x,y+.3,z);w.scene.add(l);return flame;}
function architecture(w,{outside=false,blue=false,water=false}={}){
 w.scene.background.set(outside?0x89949a:blue?0x29343a:0x493c33);w.scene.fog.color.copy(w.scene.background);w.scene.fog.density=outside?.014:.005;
 w.renderer.toneMappingExposure=1.05;w.sun.intensity=2.5;w.sun.color.set(blue?0xa7c9dc:0xffd5a0);w.sun.position.set(-7,12,7);
 const rim=new T.DirectionalLight(0xb2d6df,2.1);rim.position.set(4,6,-8);w.scene.add(rim);
 if(!water)w.box(90,.2,80,w.mat(outside?0x938873:0x88715a,{map:outside?w.ground:w.wood}),0,-.15,-12);
 if(outside)return;
 w.box(28,8,.3,w.mat(0x877b65,{map:w.brick}),0,4,-8);
 for(const x of [-12,12])w.box(.3,8,24,0x5c594e,x,4,0);
 for(const x of [-9,-4.5,4.5,9]){w.box(2.3,4.3,.12,0xd4c4a0,x,4.5,-7.75);w.box(2,4,.16,w.mat(0x9bacad,{emissive:0x52676b,emissiveIntensity:.3}),x,4.5,-7.60);w.box(.09,4,.2,0xddd2b8,x,4.5,-7.44);w.box(2.1,.08,.2,0xddd2b8,x,4.5,-7.44);}
 for(const x of [-8,8]){w.box(.35,6,.45,0x4a4339,x,3,-5);w.box(.6,.18,.7,0xc0ad87,x,5.8,-5);}
 for(let i=0;i<10;i++)w.box(24,.07,.035,0x5e4b36,0,.015,-7+i*1.55);
}
function carriage(w,x,z){const g=w.group(x,0,z);w.box(2.6,.3,4.2,0x5e4733,0,.7,0,g);w.box(2.4,1.5,2.5,w.mat(0x7b513a,{map:w.wood}),0,1.5,.1,g);for(const side of [-1,1])for(const zz of [-1.25,1.25]){const wheel=w.cyl(.67,.16,0x40382d,side*1.43,.67,zz,g);wheel.rotation.z=Math.PI/2;for(let j=0;j<5;j++){const spoke=w.box(.07,1.16,.06,0xb69865,side*1.52,.67,zz,g);spoke.rotation.x=j*Math.PI/5;}}return g;}
function loosePaper(w,count=18){const g=w.group(),items=[];for(let i=0;i<count;i++){const p=w.box(.22+rnd(i)*.25,.012,.34,0xdcc6a0,0,0,0,g);p.castShadow=false;items.push(p);}return {g,items};}
function crowd(w,number=18,z=-7){const a=[];for(let i=0;i<number;i++){const c=w.actor(-10+(i%10)*2.1,z-Math.floor(i/10)*2.1,{coat:[0x495f67,0x76634d,0x72554c,0x516550][i%4],military:false});c.rotation.y=Math.PI;a.push(c);}return a;}
function boat(w,x,z){const g=w.group(x,0,z),hull=w.mat(0x5b3829,{map:w.wood});w.box(3.2,.7,7,hull,0,.55,0,g);for(const side of [-1,1]){const end=w.box(2.6,.65,1,hull,0,.62,side*3.6,g);end.rotation.x=side*.25;w.box(.18,.55,6.9,0xad8754,side*1.5,1,0,g);}w.box(2.7,.08,6.5,0x9c7e54,0,.96,0,g);w.cyl(.08,7,0x62462f,0,4,0,g);w.box(5.3,.10,.12,0x805b38,0,6.7,0,g);const sail=w.mesh(new T.PlaneGeometry(4.9,4.5,8,8),w.mat(0xd7c8a2,{side:T.DoubleSide}),0,4.5,.08,g);for(let i=0;i<4;i++)w.box(.85,.7,.8,0x997245,-.6+i%2*1.2,1.35,-1.6+Math.floor(i/2)*1.2,g);const flag=w.box(.9,.42,.03,0xb65e49,.48,7.1,0,g);return {g,sail,flag};}

export function createCinema(w,kind){
 const s={kind,hero:null,other:null,extras:[],papers:loosePaper(w,kind==='rally'?32:16),cards:[],lastId:null};
 architecture(w,{outside:['street','harbor','rally'].includes(kind),blue:kind==='record',water:kind==='harbor'});
 if(kind==='street'){
  for(const x of [-12,12])for(let i=0;i<5;i++){const b=w.group(x,0,-i*12);w.box(9,7+i%2*2,9,w.mat(i%2?0x87725b:0xa39376,{map:w.brick}),0,3.5,0,b);for(const xx of [-2,0,2])w.box(1,1.8,.1,0x718889,xx,4.7,4.56,b);w.box(9.4,.25,9.5,0x4d514a,0,7+i%2*2,0,b);}
  w.box(16,6,8,0xc3bba2,0,3,-20);for(const x of [-6,-3,0,3,6])w.cyl(.32,6.7,0xe2d5b4,x,3.3,-15.6);for(let i=0;i<6;i++)w.box(18-i*.5,.22,4+i*.6,0xbfb498,0,.11+i*.22,-13.5-i*.3);
  const sign=print(w,'HOUSE OF REPRESENTATIVES','FEBRUARY 1825',8,2.2);sign.position.set(0,6.9,-15.3);
  s.hero=person(w,'ELIZA',-.8,.9);s.other=person(w,'CLERK',-2.7,1.1,Math.PI*.7);table(w,2.6,1.7,3.4);
  s.tally=print(w,'NO MAJORITY','JACKSON 99 · ADAMS 84 / CRAWFORD 41 · CLAY 37 / 131 NEEDED',5,2.5);s.tally.position.set(2.7,2.8,1.3);s.tally.rotation.y=-.12;
  s.carriage=carriage(w,5,-6);s.extras=crowd(w,12,-9);
 }else if(kind==='press'){
  s.hero=person(w,'ELIZA',-1.2,1.2);s.other=person(w,'CLERK',2.4,.5,Math.PI*1.1);table(w,2.5,1.5);
  const g=w.group(-3,0,0),oak=w.mat(0x765030,{map:w.wood});for(const x of [-1,1])w.box(.25,3.8,.45,oak,x,1.9,0,g);w.box(2.5,.35,2.4,oak,0,1,0,g);w.box(2.7,.3,.7,oak,0,3.6,0,g);w.cyl(.11,1.7,0x403c33,0,2.7,0,g);s.platen=w.box(1.8,.18,1.8,0x4c4235,0,1.8,0,g);s.lever=w.box(3,.10,.10,0xa58a58,.8,3.1,0,g);
  for(let i=0;i<4;i++){const p=print(w,['JACKSON WINS','THE VOTER ROLLS','LOYALTY & OFFICE','THE KITCHEN CABINET'][i],['1828','EXPANSION FOR WHITE MEN','THE SPOILS SYSTEM','INFORMAL ADVISERS'][i],3.8,2.1);p.position.set(-7+i*4.7,3.3,-7.7);s.cards.push(p);}
  s.headline=print(w,'THE PEOPLE’S PRESS','JACKSON · 1828 / MORE VOTERS. WHO IS LEFT OUT?',3.3,1.7);s.headline.position.set(2.3,1.27,1.5);s.headline.rotation.x=-Math.PI/2;s.flame=candle(w,4,1.4,1);
 }else if(kind==='harbor'){
  w.scene.background.set(0x536d79);w.scene.fog.color.set(0x536d79);w.scene.fog.density=.017;w.sun.color.set(0xffc38e);w.sun.position.set(-16,9,4);
  w.box(90,.10,90,w.mat(0x315a69,{metalness:.4,roughness:.32}),0,.10,-15);w.box(9,.55,17,w.mat(0x88704e,{map:w.wood}),-6,.3,5);for(let i=0;i<9;i++)w.box(8.9,.03,.05,0x4a4335,-6,.6,-2+i*1.7);for(const x of [-9,-3])for(const z of [-2,4,10])w.cyl(.13,1.8,0x5c4630,x,.9,z);
  // The distant working waterfront gives the sea a real horizon. Keep it
  // behind the sailing channels, with the foreground pier separate from land.
  w.box(66,1.3,13,0x65716b,-2,.25,-39);
  for(let i=0;i<10;i++){
   const x=-29+i*6,h=4+(i%3)*1.35,g=w.group(x,0,-36-(i%2)*2),brick=w.mat(i%2?0x816e5f:0x9a8268,{map:w.brick});
   w.box(5.1,h,7,brick,0,h/2,0,g);w.box(5.5,.22,7.5,0x4e5754,0,h+.12,0,g);w.box(.4,1.7,.5,0x63564a,1.6,h+.8,1,g);
   for(const xx of [-1.4,0,1.4])for(let floor=0;floor<2;floor++)w.box(.7,1.1,.07,w.mat(0xb5b99a,{emissive:0x8f794d,emissiveIntensity:.35}),xx,1.9+floor*2,-3.55,g);
   w.box(1.3,1.9,.1,0x403d35,0,1,-3.56,g);w.box(5.6,.2,4.8,0x766b53,0,.5,-5.7,g);
  }
  w.cyl(.5,9,0xc6bda2,-14,8,-39);const steeple=w.mesh(new T.ConeGeometry(1.4,5,4),0x435651,-14,14,-39);steeple.rotation.y=Math.PI/4;
  w.box(14,6,8,w.mat(0x85705d,{map:w.brick}),-8,3,18);s.hero=person(w,'ELIZA',-4.7,2.2);s.other=person(w,'CLERK',-7,1.2,Math.PI*.65);s.boat=boat(w,1,-3);s.farBoat=boat(w,13,-20);s.farBoat.g.scale.setScalar(.7);
  s.bill=print(w,'A UNION ON THE EDGE','1833 / FORCE BILL + COMPROMISE TARIFF',4.3,2.2);s.bill.position.set(-6,2.6,-2.3);
  for(let i=0;i<32;i++){const p=w.box(1+rnd(i)*2,.01,.04,0x7a979d,-18+rnd(i+8)*48,.17,-35+rnd(i+14)*44);p.castShadow=false;s.cards.push(p);}
  s.flame=candle(w,-4,1.7,4);
 }else if(kind==='bank'){
  s.hero=person(w,'ELIZA',-.4,1.5);s.other=person(w,'CLERK',-3,1.4,Math.PI*.75);table(w,1.5,1.2,4.5);
  w.box(6,4.6,1.2,w.mat(0x384c50,{metalness:.5}),0,2.3,-6.7);const disk=w.cyl(1.7,.16,w.mat(0x78918e,{metalness:.7,roughness:.3}),0,2.4,-6);disk.rotation.x=Math.PI/2;for(let i=0;i<8;i++){const p=w.box(.07,2.6,.1,0x9da88e,0,2.4,-5.85);p.rotation.z=i*Math.PI/4;}
  s.veto=print(w,'VETO','BANK RECHARTER / 1832',3,1.8);s.veto.position.set(1.4,1.28,1.2);s.veto.rotation.x=-Math.PI/2;
  s.specie=print(w,'SPECIE CIRCULAR','1836 / GOLD OR SILVER FOR PUBLIC LAND',4.6,2.3);s.specie.position.set(6.4,2.8,-5.7);s.specie.rotation.y=-.3;
  for(let i=0;i<3;i++){const p=print(w,['SECOND BANK','STATE BANKS','LAND OFFICE'][i],['RECHARTER VETOED 1832','DEPOSITS MOVED 1833','SPECIE RULE 1836'][i],3.5,1.8);p.position.set(-7+i*7,5.8,-7.6);s.cards.push(p);}
  s.coins=[];for(let i=0;i<20;i++){const c=w.cyl(.14,.04,w.mat(i%3?0xc8a457:0xbac5c2,{metalness:.7,roughness:.3}),.1+i%5*.34,1.29+Math.floor(i/5)*.05,1.4);s.coins.push(c);}s.flame=candle(w,3,1.4,.4);
 }else if(kind==='record'){
  s.hero=person(w,'ELIZA',-.4,1.4);s.other=person(w,'CREEK',-2.6,.2,Math.PI*.65);table(w,1.4,1.4,5.3);
  for(let i=0;i<3;i++){const p=print(w,['REMOVAL ACT','CHEROKEE NATION','WORCESTER'][i],['1830 · JACKSON','1831 · JURISDICTION','1832 · SOVEREIGNTY'][i],1.5,1.1);p.position.set(-.4+i*1.8,1.28,1.1);p.rotation.x=-Math.PI/2;s.cards.push(p);}
  const sign=print(w,'NEW ECHOTA','THE CHEROKEE RECORD',5.6,2);sign.position.set(0,5.5,-7.7);
  s.chair=w.group(1.6,0,-.8);w.box(1,.16,1,0x59422f,0,.62,0,s.chair);w.box(1,1.6,.13,0x59422f,0,1.3,.45,s.chair);for(const x of [-.4,.4])for(const z of [-.4,.4])w.box(.12,.6,.12,0x59422f,x,.3,z,s.chair);
  for(const x of [-9,9]){w.box(3.4,3,.8,0x514839,x,1.5,-5.7);for(let i=0;i<12;i++)w.box(.19,.8,.45,[0x75614f,0x475f5a,0x6c4d3f][i%3],x-1.3+(i%6)*.42,.75+Math.floor(i/6)*1.3,-5.25);}
  // An open rear gallery frames the departure beyond the working desks.
  // The road and cool doorway appear only in the later historical record.
  s.departureSet=w.group();s.departureSet.visible=false;
  w.box(26,.05,4.5,w.mat(0x807e70,{map:w.ground}),0,.035,-4.5,s.departureSet);
  w.box(20,5,.06,w.mat(0x839393,{emissive:0x344b54,emissiveIntensity:.25}),0,2.5,-7.65,s.departureSet);
  for(const x of [-10,10]){w.box(.4,5.4,.6,0x514d41,x,2.7,-6.8,s.departureSet);w.box(.7,.15,.8,0x8c836e,x,5.35,-6.8,s.departureSet);}w.box(20.7,.35,.7,0x514d41,0,5.2,-6.8,s.departureSet);
  for(const x of [-8,-3,4,8]){w.cyl(.06,3.5,0x667670,x,1.8,-7.3,s.departureSet);const crown=w.mesh(new T.SphereGeometry(1.1,7,5),0x73827b,x,3.5,-7.3,s.departureSet);crown.scale.y=1.4;}
  s.family=[];for(let i=0;i<5;i++){const p=person(w,i%2?'REFUGEMOTHER':'REFUGEFATHER',7+i*.55,-3-i*.5,Math.PI/2);p.visible=false;if(i===4)p.scale.setScalar(.65);s.family.push(p);}s.flame=candle(w,3.6,1.45,1.3);
 }else{
  w.scene.background.set(0xb5b39a);w.scene.fog.color.set(0xb5b39a);w.sun.color.set(0xffd897);w.sun.position.set(-8,12,4);w.box(13,.7,6,w.mat(0x856343,{map:w.wood}),0,.35,-7);
  const title=print(w,'TIPPECANOE AND TYLER TOO','1840 / WHIG CAMPAIGN',9,2.6);title.position.set(0,4.5,-9);s.cards.push(title);
  for(const x of [-7,7]){w.cyl(.08,7,0x69543c,x,3.5,-7);for(let i=0;i<7;i++)w.box(1.5,.12,.025,i%2?0xebe1bd:0x9c4e41,x+.7,5.5+i*.14,-7);w.box(.65,.6,.04,0x3b596a,x+.3,6.14,-6.98);}
  s.hero=person(w,'ELIZA',-.6,1);s.other=person(w,'RUNNER',2.3,.2,Math.PI*.9);s.extras=crowd(w,24,-11);s.carriage=carriage(w,6,-3);
  const cabin=w.group(6,1.8,-3);for(let i=0;i<6;i++)w.box(2.5,.18,1.8,i%2?0x9c7246:0x705136,0,i*.18,0,cabin);const roof=w.box(3,.18,2.4,0x5b5140,0,1.3,0,cabin);roof.rotation.z=.1;
  for(let i=0;i<15;i++){const p=w.mesh(new T.ConeGeometry(.17,.45,3),w.mat(i%2?0x9f5145:0xe9d8ae,{side:T.DoubleSide}),-9+i*1.25,5.3-Math.sin(i/14*Math.PI)*1.4,-4);p.rotation.z=Math.PI;s.cards.push(p);}
  s.sign=print(w,'HARRISON · TYLER','WHIGS / 1840',1.3,.75);s.sign.position.set(-.6,1.8,1.3);
 }
 // A small bounded particle field gives depth without per-frame allocations.
 const light=new T.PointLight(0xffdcad,14,13,2);light.position.set(0,4,6);w.scene.add(light);
 function animate(id,p,dt,time){
  const leaving=id==='record-out';s.hero.visible=!(leaving&&p>.28);s.other.visible=!(leaving&&p>.28);
  let heroPose='paper',otherPose='listen';
  if(kind==='street'){const moving=id==='opening'&&p<.37||id==='count-in'&&p>.62;heroPose=moving?'run':id==='count-out'?'read':'give';s.hero.position.x=id==='opening'?mix(-4.8,-.8,ease(p/.4)):id==='count-in'?mix(-.8,2,ease((p-.62)/.38)):-.8;s.hero.position.z=id==='count-in'?mix(.9,-3,ease((p-.62)/.38)):.9;s.hero.rotation.y=moving?(id==='opening'?Math.PI/2:0):Math.PI;otherPose=p<.5?'point':'read';s.carriage.position.z=-7+Math.sin(time*.4)*3;}
  if(kind==='press'){heroPose=p<.6?'work':'give';otherPose=p<.5?'read':'point';s.platen.position.y=1.8-Math.max(0,Math.sin(time*3.6))*.42;s.lever.rotation.y=Math.sin(time*1.8)*.6;s.hero.position.x=-1.2+Math.sin(time*.5)*.05;}
  if(kind==='harbor'){heroPose=id==='harbor-out'?'read':'point';otherPose='point';s.boat.g.position.set(1+Math.sin(time*.35)*.2,Math.sin(time*1.1)*.10,mix(-8,-2,ease(p)));s.boat.g.rotation.z=Math.sin(time*1.2)*.025;s.boat.flag.rotation.y=Math.sin(time*4)*.3;s.boat.sail.scale.z=1;s.farBoat.g.position.x=13-p*8;s.farBoat.g.position.y=Math.sin(time*.8)*.12;s.cards.forEach((c,i)=>{c.position.y=.17+Math.sin(time*1.4+i)*.018;c.scale.x=1+Math.sin(time+i)*.12;});}
  if(kind==='bank'){heroPose=p<.5?'give':'read';otherPose='work';s.coins.forEach((c,i)=>{c.position.x=.1+i%5*.34+Math.sin(time*2+i)*.01+(id==='bank-out'?ease(p)*2:0);c.rotation.z=Math.sin(time*1.5+i)*.04;});}
  if(kind==='record'){heroPose='read';otherPose='paper';s.departureSet.visible=leaving&&p>.25&&p<.68;s.family.forEach((a,i)=>{a.visible=leaving&&p>.25&&p<.68;a.position.x=mix(7,-7,ease((p-.25)/.75))+i*.55;a.position.z=-3-i*.5;a.rotation.y=Math.PI/2;poseActor(a,{time:time+i*.3,pose:'walk',mood:'sad',speed:.55});});if(leaving){w.sun.intensity=1.6;w.sun.color.set(0xa8b8ba);w.renderer.toneMappingExposure=.84;}}
  if(kind==='rally'){heroPose=id==='rally-in'&&p<.32?'run':'point';s.hero.position.x=id==='rally-in'?mix(-4,-.6,ease(p/.35)):-.6;s.carriage.position.x=6-Math.sin(time*.3)*2;s.carriage.rotation.y=-Math.PI/2;s.sign.position.copy(s.hero.position).add(V(.1,1.7,.3));s.sign.rotation.z=Math.sin(time*2)*.04;otherPose='point';}
  poseActor(s.hero,{time,voiceTime:time,speaking:id==='opening'||id.startsWith('press')||id.startsWith('record')||id==='rally-out'||id==='final',pose:heroPose,mood:leaving?'sad':id==='harbor-in'?'tense':'steady'});poseActor(s.other,{time:time+.6,voiceTime:time,speaking:['count-in','press-out','harbor-in','rally-in'].includes(id),pose:otherPose,mood:leaving?'sad':'steady'});
  s.extras.forEach((a,i)=>{w.animateActor(a,time+i*.31,kind==='street'&&i%3===0);a.rotation.z=kind==='rally'?Math.sin(time*2+i)*.025:0;});
  s.papers.g.visible=kind!=='record'||!leaving;s.papers.items.forEach((a,i)=>{const speed=kind==='rally'?1.3:.4,ph=(time*speed+i*.71)%8;a.position.set(-6+((i*1.31+time*.33)%12),kind==='rally'?5-ph*.55:.4+(ph*.44)%4,-4+(i%5)*1.5);a.rotation.set(time*.7+i,time*.5+i,Math.sin(time+i)*.8);});
  if(s.flame)s.flame.scale.y=1.8+Math.sin(time*12)*.2;
 }
 // Each entry is [camera start, camera end, look start, look end, duration weight].
 const shots={
  opening:[[[4,2.6,7],[2.8,2.2,5.6],[-1,1.2,0],[-.9,1.3,.8],.37],[[-2.7,1.7,3.2],[-2.4,1.65,2.7],[-.8,1.3,.9],[-.8,1.35,.9],.35],[[4,3.6,8],[2.8,2.9,6],[0,1,-2],[0,1.3,-3],.28]],
  'count-in':[[[-4,2.2,4],[-3.4,2,3],[-1.5,1.3,1],[-1.6,1.4,1],.4],[[5.5,3.1,5],[4.6,3,4.3],[2.7,2.8,1.3],[2.7,2.8,1.3],.3],[[2,2.5,5],[0,3,2],[0,1.5,-7],[0,2,-12],.3]],
  'count-out':[[[5.5,3.4,5],[4.2,3.1,4.5],[2.7,2.8,1.3],[2.7,2.8,1.3],.43],[[4,3.1,-6],[2,3.4,-7],[0,3,-16],[0,3.3,-16],.28],[[-2.5,1.8,3.1],[-2.2,1.7,2.7],[-.8,1.4,.9],[-.8,1.4,.9],.29]],
  'press-in':[[[-5.3,3.3,4.4],[-4.6,2.7,3.6],[-2.9,2,0],[-2.8,1.8,0],.37],[[-2.5,1.8,3.5],[-2.1,1.7,2.9],[-1.2,1.3,1.2],[-1.2,1.4,1.2],.34],[[5.2,3.8,5],[4.1,3.1,3.9],[2.3,1.3,1.5],[2.3,1.3,1.5],.29]],
  'press-out':[[[5,2.3,4],[4.2,2.1,3.3],[2.4,1.4,.5],[2.4,1.4,.5],.4],[[-6,3.4,-2],[-5.4,3,-3.5],[-4,3,-7.7],[-4,3,-7.7],.28],[[-2.2,1.75,3],[-1.7,1.7,2.7],[-1.2,1.4,1.2],[-1.2,1.4,1.2],.32]],
  'harbor-in':[[[9,6.4,9],[5,4.5,6],[0,2,-4],[0,2,-3],.33],[[-3,2.2,5.7],[-3.7,1.9,4.6],[-6.1,1.4,1.5],[-6.1,1.4,1.5],.34],[[4,2.2,3],[3.2,1.8,2],[1,1,-2],[1,1.3,-2],.33]],
  'harbor-out':[[[-3,3.5,2],[-3.8,3.1,1],[-6,2.6,-2.3],[-6,2.6,-2.3],.4],[[-2,1.9,5],[-2.5,1.75,4.1],[-4.7,1.4,2.2],[-4.7,1.4,2.2],.26],[[6,4.5,10],[8,5.2,12],[-2,1.3,-3],[-1,1,-4],.34]],
  'bank-in':[[[5,3.9,7],[3.7,3.2,5.2],[.7,1.4,0],[.7,1.4,0],.32],[[3,3.6,3.7],[2.5,3,3],[1.4,1.25,1.2],[1.4,1.25,1.2],.36],[[-2.1,1.9,3.6],[-1.7,1.75,3],[-.4,1.4,1.5],[-.4,1.4,1.5],.32]],
  'bank-out':[[[5.3,3.3,-1],[5,3.1,-2.5],[6.4,2.8,-5.7],[6.4,2.8,-5.7],.37],[[3.7,2.8,4.2],[3.2,2.5,3.7],[2,1.2,1.2],[2,1.2,1.2],.33],[[-2,1.85,3.6],[-1.6,1.75,3],[-.4,1.4,1.5],[-.4,1.4,1.5],.3]],
  'record-in':[[[4.5,3.6,6],[3.6,3,5],[0,1.3,1],[0,1.3,1],.31],[[-4.3,1.9,2.3],[-4,1.75,1.9],[-2.6,1.4,.2],[-2.6,1.4,.2],.32],[[2.9,3.4,3.6],[2.4,3,3.1],[1.4,1.25,1.1],[1.4,1.25,1.1],.37]],
  'record-out':[[[2.9,3.4,3.9],[2.1,2.8,3.2],[1.4,1.25,1.1],[1.4,1.25,1.1],.28],[[7,2.2,5],[4,2,4.2],[2,1,-2],[0,1,-2.5],.4],[[3.7,1.9,3.4],[3.1,1.7,2.6],[1.6,1,-.8],[1.6,1,-.8],.32]],
  'rally-in':[[[5,3.3,8],[3.7,2.8,6.2],[0,1.7,-3],[0,1.7,-3],.32],[[-2.6,1.9,3.4],[-2,1.8,2.8],[-.6,1.4,1],[-.6,1.4,1],.35],[[7.6,3.2,2],[6,2.7,1],[5,1.8,-3],[4.5,1.8,-3],.33]],
  'rally-out':[[[3.8,2.7,5.5],[2.9,2.3,4.4],[0,1.5,-2],[0,1.5,-3],.32],[[-2.4,1.8,3.1],[-2,1.7,2.7],[-.6,1.4,1],[-.6,1.4,1],.42],[[3.8,4.1,7],[4.7,5,9],[0,1.2,-6],[0,1,-7],.26]],
  final:[[[-2.4,1.8,3.2],[-1.9,1.75,2.7],[-.6,1.4,1],[-.6,1.4,1],.6],[[3.7,3.5,6.5],[5.2,4.5,9],[0,1.5,-5],[0,1.4,-6],.4]]
 };
 const labels={opening:['The returns arrive','Eliza Reed','The assignment'],'count-in':['Before we print','Four candidates','To the House'],'count-out':['99 is not 131','February 1825','An allegation, not proof'],'press-in':['The press starts','Set the type','A new electorate'],'press-out':['Party loyalty','The voter rolls','Who is still excluded?'],'harbor-in':['Cargo under pressure','The federal claim','Keep the port moving'],'harbor-out':['Force and compromise','The settlement','The harbor opens'],'bank-in':['The Bank War','The veto','Follow the deposits'],'bank-out':['The land-payment rule','Credit contracts','1837: the panic'],'record-in':['Return to New Echota','Legal resistance','Three distinct records'],'record-out':['Rights on paper','Forced migration, 1838–39','The empty chair'],'rally-in':['The spectacle','Carry the message','Watch the floats'],'rally-out':['Harrison wins','The majority question','Whose rights endure?'],final:['Keep the record','Your turn']};
 return (id,progress,dt)=>{
  const p=Math.max(0,Math.min(.999999,Number(progress)||0));if(s.lastId!==id){s.lastId=id;s.time=0;}s.time+=Math.max(0,Math.min(.1,dt||0));
  animate(id,p,dt,s.time);const sequence=shots[id]||shots.final;let total=0,q=sequence[0],local=0;for(const entry of sequence){q=entry;if(p<total+q[4]){local=(p-total)/q[4];break;}total+=q[4];}const f=ease(local),a=q[0],b=q[1],c=q[2],d=q[3];
  const portrait=w.camera.aspect<1,wide=portrait?1.35:1;const target=V(mix(c[0],d[0],f),mix(c[1],d[1],f),mix(c[2],d[2],f));w.camera.position.set(mix(a[0],b[0],f),mix(a[1],b[1],f),mix(a[2],b[2],f));
  if(id==='record-out'&&p>=.28&&p<.68){
   // Track the group itself throughout this shot. A fixed room target let the
   // family leave the frame before the empty-chair insert had begun.
   const center=mix(7,-7,ease((p-.25)/.75))+1.1;target.set(center,1.05,-4);w.camera.position.set(center-1.4,2.6,portrait?3.1:.9);
  }
  if(portrait)w.camera.position.sub(target).multiplyScalar(wide).add(target);w.camera.fov=portrait?62:43;w.camera.updateProjectionMatrix();w.camera.lookAt(target);
  const shot=sequence.indexOf(q)+1;w.cinemaShot={id,shot,index:shot,total:sequence.length,label:labels[id]?.[shot-1]||'The historical record'};w.effectsTick(dt||0);w.render();return w.cinemaShot;
 };
}
