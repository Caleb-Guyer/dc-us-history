import * as T from './three.module.js';

const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const rand=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453123;return v-Math.floor(v);};
const lerp=(a,b,t)=>a+(b-a)*t;

// Local geometry and hand-drawn procedural surfaces. Nothing is downloaded at
// runtime; the quiet scene is also the mission-select background.
export class ReformWorld {
 constructor(canvas,game){
  this.canvas=canvas;this.game=game;this.mode=game.mode;this.geometries=new Map();this.materials=new Map();this.textures=[];this.entityViews=new Map();this.entityPools=new Map();this.actorBatches=[];this.actors=[];this.dynamic=[];this.wheels=[];this.gameMarks=[];this.fx=[];this.clock=0;this.lastTime=null;this.disposed=false;
  this.performance={calls:0,triangles:0,cpuMs:0,quality:'balanced'};
  this.scene=new T.Scene();
  const sky=this.mode==='assembly'?0xb5c1b5:this.mode==='press'?0x7f969f:0xbeb19b;
  this.scene.background=new T.Color(sky);this.scene.fog=new T.Fog(sky,36,105);
  this.renderer=new T.WebGLRenderer({canvas,antialias:false,alpha:false,powerPreference:'high-performance'});
  this.renderer.setPixelRatio(1);this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.08;this.renderer.shadowMap.enabled=false;
  this.camera=new T.PerspectiveCamera(51,1,.1,170);
  this.scene.add(new T.HemisphereLight(this.mode==='convention'?0xf6dbac:0xdce4dc,0x3b3a32,.95));
  const sun=new T.DirectionalLight(this.mode==='press'?0xffcd8e:0xffdfaa,1.8);sun.position.set(-11,17,13);this.scene.add(sun);
  const fill=new T.DirectionalLight(0xa9cad7,.45);fill.position.set(12,8,-10);this.scene.add(fill);
  this.land=this.group();this.cast=this.group();this.entityRoot=this.group();this.film=this.group();this.film.userData.dynamic=true;this.entityRoot.userData.dynamic=true;
  this.tex={wood:this.surface('wood'),brick:this.surface('brick'),stone:this.surface('stone'),plaster:this.surface('plaster'),shadow:this.softTexture(),glow:this.softTexture(true)};
  if(this.mode==='assembly')this.workshop();else if(this.mode==='press')this.street();else this.hall();
  this.hero=this.actor(0,1,{coat:0x466a66,dress:true,skin:0x9e684b,bonnet:true,hero:true},this.cast);
  this.other=this.actor(3,-2,{coat:0x8b6852,skin:0xc18d66,hat:false},this.cast);
  this.other.userData.carry.visible=this.mode==='press';
  this.makeDust();
  if(this.mode==='convention'){const pool=[];for(let i=0;i<2;i++){const a=this.entityView({kind:'attendee'});a.visible=false;this.entityRoot.remove(a);pool.push(a);}this.entityPools.set('attendee',pool);}
  this.batchStatic(this.land);this.batchStatic(this.film);this.batchStatic(this.cast);
  this.batchActors();
  this.resize();
 }
 group(x=0,y=0,z=0,parent=this.land||this.scene){const g=new T.Group();g.position.set(x,y,z);parent.add(g);return g;}
 geo(kind,args){const key=kind+args.join(',');if(!this.geometries.has(key)){const types={box:T.BoxGeometry,cyl:T.CylinderGeometry,sphere:T.SphereGeometry,plane:T.PlaneGeometry,torus:T.TorusGeometry,cone:T.ConeGeometry,ring:T.RingGeometry};this.geometries.set(key,new types[kind](...args));}return this.geometries.get(key);}
 mat(color,extra={}){const key=`${color}|${JSON.stringify({...extra,map:extra.map?.uuid})}`;if(!this.materials.has(key))this.materials.set(key,new T.MeshLambertMaterial({color,...extra}));return this.materials.get(key);}
 mesh(kind,args,color,x=0,y=0,z=0,parent=this.land,extra={}){const m=new T.Mesh(this.geo(kind,args),color?.isMaterial?color:this.mat(color,extra));m.position.set(x,y,z);parent.add(m);return m;}
 box(w,h,d,color,x=0,y=0,z=0,parent=this.land,extra={}){return this.mesh('box',[w,h,d],color,x,y,z,parent,extra);}
 cyl(r,h,color,x=0,y=0,z=0,parent=this.land,segments=12){return this.mesh('cyl',[r,r,h,segments],color,x,y,z,parent);}
 sphere(r,color,x=0,y=0,z=0,parent=this.land){return this.mesh('sphere',[r,12,9],color,x,y,z,parent);}
 beam(from,to,width,color,parent=this.land){const a=V(...from),b=V(...to),d=b.clone().sub(a);const m=this.box(width,d.length(),width,color,0,0,0,parent);m.position.copy(a.add(b).multiplyScalar(.5));m.quaternion.setFromUnitVectors(V(0,1,0),d.normalize());return m;}
 surface(kind){
  const c=document.createElement('canvas');c.width=c.height=512;const g=c.getContext('2d');
  if(kind==='wood'){
   g.fillStyle='#a7875f';g.fillRect(0,0,512,512);
   for(let y=0;y<512;y+=64){g.fillStyle=`hsl(${30+rand(y)*7} 26% ${43+rand(y+1)*15}%)`;g.fillRect(0,y,512,64);g.fillStyle='#493c2a';g.fillRect(0,y,512,2);for(let j=0;j<75;j++){const yy=y+rand(y+j+17)*62;g.strokeStyle=`rgba(55,38,21,${.05+rand(j)*.17})`;g.beginPath();g.moveTo(rand(j+2)*512,yy);g.bezierCurveTo(190,yy-1,280,yy+1,512,yy);g.stroke();}for(const x of [12,495]){g.fillStyle='#4c4231';g.fillRect(x,y+8,3,3);g.fillRect(x,y+52,3,3);}}
  }else if(kind==='brick'){
   g.fillStyle='#d0b59a';g.fillRect(0,0,512,512);
   for(let y=0;y<512;y+=32)for(let x=-64;x<512;x+=64){const xx=x+(y/32%2)*32;g.fillStyle=`hsl(${12+rand(x+y)*11} 28% ${33+rand(x-y+8)*18}%)`;g.fillRect(xx+2,y+2,60,28);g.fillStyle='#ffffff0b';g.fillRect(xx+3,y+3,58,2);}
  }else if(kind==='stone'){
   g.fillStyle='#5d625a';g.fillRect(0,0,512,512);for(let y=0;y<512;y+=35)for(let x=-45;x<512;x+=61){const xx=x+(y/35%2)*30;g.fillStyle=`hsl(${34+rand(x+y)*20} 8% ${37+rand(x-y)*14}%)`;g.beginPath();g.roundRect(xx+2,y+2,57,31,6);g.fill();g.fillStyle='#ffffff09';g.fillRect(xx+8,y+4,43,2);}
  }else{g.fillStyle='#c4b99b';g.fillRect(0,0,512,512);}
  for(let i=0;i<2400;i++){g.fillStyle=i%2?'#ffffff0c':'#100d0710';g.fillRect(rand(i+20)*512,rand(i+421)*512,1+rand(i)*4,1+rand(i+33)*2);}
  const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(kind==='brick'?2:kind==='stone'?5:2,kind==='wood'?3:kind==='stone'?10:2);t.anisotropy=2;this.textures.push(t);return t;
 }
 softTexture(glow=false){const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d'),r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,glow?'#fff0c8ff':'#000000bb');r.addColorStop(.4,glow?'#ffe5a966':'#00000077');r.addColorStop(1,'#00000000');g.fillStyle=r;g.fillRect(0,0,64,64);const t=new T.CanvasTexture(c);this.textures.push(t);return t;}
 contact(x,z,w=1.2,d=.7,parent=this.land,opacity=.35){const m=this.mesh('plane',[w,d],0x1e221d,x,.018,z,parent,{map:this.tex.shadow,transparent:true,opacity,depthWrite:false});m.rotation.x=-Math.PI/2;return m;}
 printSurface(lines,{width=512,height=640,ink='#242b28',paper='#d9c8a4',border=true}={}){const c=document.createElement('canvas');c.width=width;c.height=height;const g=c.getContext('2d');g.fillStyle=paper;g.fillRect(0,0,width,height);for(let i=0;i<900;i++){g.fillStyle=i%2?'#fff8db0b':'#47331b0b';g.fillRect(rand(i+5)*width,rand(i+67)*height,rand(i+73)*4+1,1);}g.fillStyle=ink;g.strokeStyle=ink;if(border){g.lineWidth=3;g.strokeRect(16,16,width-32,height-32);g.lineWidth=1;g.strokeRect(23,23,width-46,height-46);}let yy=height*.14;for(let i=0;i<lines.length;i++){const line=lines[i];g.font=`${i===0?'bold ':''}${i===0?width*.085:width*.047}px Georgia`;g.textAlign='center';g.fillText(line,width/2,yy,width*.86);yy+=i===0?height*.11:height*.072;}g.fillStyle=ink;for(let col=0;col<2;col++)for(let j=0;j<11;j++){g.globalAlpha=.4+rand(j+col)*.3;g.fillRect(width*(.09+col*.45),height*.61+j*height*.022,width*.36*(.55+rand(j)*.45),1.6);}g.globalAlpha=1;const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;this.textures.push(t);return t;}
 placard(lines,x,y,z,w=2,h=2.4,parent=this.land,{rotate=0,paper='#d9c8a4',border=true}={}){const g=this.group(x,y,z,parent);g.rotation.y=rotate;this.box(w+.08,h+.08,.07,0x66523c,0,0,-.055,g);this.mesh('plane',[w,h],0xffffff,0,0,0,g,{map:this.printSurface(lines,{paper,border}),side:T.DoubleSide});return g;}
 sheet(x,y,z,w=.55,h=.74,parent=this.land,headline='PETITION'){const g=this.group(x,y,z,parent);const m=this.mesh('plane',[w,h],0xffffff,0,0,0,g,{map:this.printSurface([headline,'Equal rights',''],{width:256,height:320,border:false}),side:T.DoubleSide});m.rotation.x=-Math.PI/2;return g;}
 barrel(x,z,scale=1,parent=this.land){const g=this.group(x,0,z,parent);g.scale.setScalar(scale);this.mesh('cyl',[.44,.36,1.05,12],0x7d603c,0,.55,0,g);for(const y of [.19,.85])this.mesh('torus',[.39,.037,6,14],0x424641,0,y,0,g).rotation.x=Math.PI/2;this.cyl(.34,.04,0x9c7d53,0,1.09,0,g);this.contact(0,0,.95,.8,g,.35);return g;}
 crate(x,y,z,w=1,parent=this.land){const g=this.group(x,y,z,parent);this.box(w,w*.7,w*.8,0x8e7049,0,w*.35,0,g,{map:this.tex.wood});for(const a of [-1,1]){this.box(.07,w*.7,w*.83,0x5d4b32,a*w*.42,w*.35,0,g);this.box(w,.075,w*.83,0x5d4b32,0,w*(a<0?.08:.62),0,g);}this.beam([-w*.43,.08,w*.42],[w*.43,w*.62,w*.42],.06,0x594936,g);return g;}
 table(x,z,{width=2.4,depth=1.2,height=1.05,color=0x947149}={},parent=this.land){const g=this.group(x,0,z,parent);this.box(width,.15,depth,color,0,height,0,g,{map:this.tex.wood});for(const xx of [-width*.4,width*.4])for(const zz of [-depth*.36,depth*.36])this.box(.13,height,.13,0x624c32,xx,height*.48,zz,g);this.box(width*.78,.12,.12,0x705335,0,.28,0,g);this.contact(0,0,width,depth,g,.3);return g;}
 chair(x,z,rotation=0,parent=this.land){const g=this.group(x,0,z,parent);g.rotation.y=rotation;this.box(.65,.12,.64,0x806443,0,.56,0,g);for(const a of [-1,1]){this.box(.07,1.28,.08,0x5f4a34,a*.27,.67,-.26,g);this.box(.07,.52,.08,0x5f4a34,a*.27,.25,.25,g);}for(const y of [.86,1.12])this.box(.6,.12,.065,0x846642,0,y,-.27,g);this.contact(0,0,.8,.65,g,.27);return g;}
 tree(x,z,scale=1){const g=this.group(x,0,z);g.scale.setScalar(scale);this.mesh('cyl',[.18,.42,5.4,8],0x706149,0,2.2,0,g);this.beam([0,2,0],[1.4,4.4,.3],.18,0x706149,g);for(let i=0;i<5;i++){const a=i*2.4;const s=this.sphere(1.8+i%2*.4,[0x657c5d,0x72866b,0x819171][i%3],Math.sin(a)*1.2,4.5+rand(i)*1.3,Math.cos(a)*1.3,g);s.scale.y=.85;}return g;}
 building(x,z,w=8,h=10,d=9,color=0x95745d,turn=0){const g=this.group(x,0,z);g.rotation.y=turn;this.box(w,h,d,color,0,h/2,0,g,{map:this.tex.brick});this.box(w+.35,.22,d+.35,0x46504a,0,h+.05,0,g);for(const y of [.5,h-1.3])this.box(w+.12,.15,d+.12,0xb8aa8d,0,y,0,g);for(let xx=-w*.32;xx<w*.42;xx+=w*.32)for(let yy=2.3;yy<h-1;yy+=2.6){this.box(1.03,1.65,.16,0xd7ccac,xx,yy,d/2+.04,g);this.box(.82,1.44,.17,0x6c8990,xx,yy,d/2+.13,g);this.box(.06,1.45,.2,0xcac1a1,xx,yy,d/2+.24,g);this.box(.84,.06,.2,0xcac1a1,xx,yy,d/2+.24,g);this.box(1.22,.11,.32,0x8b8e79,xx,yy-.89,d/2+.1,g);}this.box(1.5,2.5,.19,0x46564e,0,1.25,d/2+.2,g);this.box(.95,.08,.15,0xa89263,0,1.5,d/2+.31,g);this.sphere(.055,0xc8ad71,.5,1.1,d/2+.32,g);this.box(2.2,.18,.9,0xaaa18c,0,.08,d/2+.35,g);this.box(.9,1.8,.8,0x6a5141,w*.25,h+.8,0,g,{map:this.tex.brick});return g;}
 lantern(x,z,parent=this.land){const g=this.group(x,0,z,parent);this.cyl(.06,3.5,0x343d39,0,1.75,0,g);this.box(.62,.07,.48,0x333c37,0,3.65,0,g);this.box(.4,.62,.35,0xd4b67b,0,3.25,0,g);for(const a of [-1,1])this.box(.04,.65,.39,0x303a34,a*.23,3.25,0,g);const glow=new T.Sprite(new T.SpriteMaterial({map:this.tex.glow,color:0xffc47e,transparent:true,opacity:.28,depthWrite:false}));glow.position.set(0,3.3,.03);glow.scale.set(2.4,2.4,1);g.add(glow);this.dynamic.push(glow);return g;}
 actor(x,z,{coat=0x6c776b,skin=0xb98863,dress=false,hat=false,bonnet=false,hero=false}={},parent=this.cast){
  const g=this.group(x,0,z,parent);g.userData.dynamic=true;const root=this.group(0,0,0,g),body=this.group(0,1.03,0,root),cloth=this.mat(coat),linen=this.mat(0xd8ccb0),hair=this.mat(0x43362b),flesh=this.mat(skin);
  const contact=this.contact(0,0,1.2,.75,g,.48);contact.userData.dynamic=true;
  this.mesh('cyl',[.24,.30,.68,10],cloth,0,.06,0,body).scale.z=.68;this.box(.14,.52,.025,linen,0,.07,.19,body);this.box(.45,.07,.34,0x584733,0,-.23,0,body);for(let i=0;i<4;i++)this.sphere(.022,0xbba169,.13,.25-i*.13,.20,body);
  const head=this.group(0,.61,0,body);this.sphere(.205,flesh,0,0,0,head).scale.set(.85,1.12,.85);this.sphere(.211,hair,0,.09,-.03,head).scale.set(.86,.75,.86);this.box(.18,.08,.12,flesh,0,.02,.16,head);
  for(const a of [-1,1]){this.sphere(.031,0xe3d9c5,a*.066,.037,.171,head);this.sphere(.015,0x28372f,a*.066,.035,.196,head);this.box(.06,.014,.013,0x493a2b,a*.065,.082,.177,head);this.sphere(.045,flesh,a*.176,-.012,0,head);}
  this.sphere(.034,flesh,0,-.008,.199,head).scale.set(.75,1.15,.8);this.box(.065,.011,.012,0x73503c,0,-.085,.182,head);this.cyl(.085,.12,flesh,0,-.20,0,head);
  if(hat){this.cyl(.31,.037,0x3e4940,0,.23,0,head);this.mesh('cyl',[.15,.19,.19,10],0x3b453e,0,.34,0,head);this.cyl(.193,.035,0x867659,0,.275,0,head);}if(bonnet){this.sphere(.25,0xd6c3a0,0,.075,-.04,head).scale.set(1,.94,.75);this.mesh('torus',[.22,.045,6,18],0xe1d0ae,0,.02,.04,head);this.box(.045,.35,.035,0x8b7564,-.16,-.16,.09,head).rotation.z=.22;this.box(.045,.35,.035,0x8b7564,.16,-.16,.09,head).rotation.z=-.22;}
  const arms=[],legs=[];for(const side of [-1,1]){const arm=this.group(side*.31,.3,0,body);this.mesh('cyl',[.065,.085,.40,8],cloth,0,-.19,0,arm);const fore=this.group(0,-.38,0,arm);this.mesh('cyl',[.055,.065,.28,8],cloth,0,-.12,0,fore);this.sphere(.067,flesh,0,-.29,0,fore);arms.push(arm);const leg=this.group(side*.13,.85,0,root);this.box(.155,.62,.17,0x494d40,0,-.31,0,leg);this.box(.19,.16,.32,0x453d31,0,-.66,.05,leg);legs.push(leg);}
  if(dress){this.mesh('cyl',[.24,.48,.8,14],cloth,0,.45,0,root).scale.z=.8;this.box(.33,.63,.03,linen,0,.52,.33,root);for(const side of [-1,1])this.box(.055,.45,.03,linen,side*.13,.98,.21,root).rotation.z=side*.14;}
  const carry=this.group(0,-.08,.35,body);this.box(.47,.1,.54,0xd7c29a,0,0,0,carry);this.box(.025,.12,.57,0x7d5d3f,0,0,0,carry);carry.visible=false;
  g.userData={dynamic:true,root,body,head,arms,legs,carry,contact,hero};this.actors.push(g);return g;
 }
 animateActor(a,t,{moving=false,sprint=false,work=false,read=false,prepare=false,jump=0,speaking=false,lean=0,carry=false}={}){const u=a.userData;if(!u.root)return;u.root.position.y=jump+(moving?Math.abs(Math.sin(t*11))*.06:Math.sin(t*1.7)*.009);u.body.rotation.x=work?.18:moving?(sprint?.21:.09):0;u.body.rotation.z=lean*.08;u.head.rotation.y=speaking?Math.sin(t*1.6)*.06:Math.sin(t*.7)*.025;u.head.rotation.x=read?.17:0;const speed=sprint?13:9;for(let i=0;i<2;i++){u.legs[i].rotation.x=moving?Math.sin(t*speed+i*Math.PI)*(sprint?.75:.5):0;u.arms[i].rotation.x=work?-.8+Math.sin(t*8+i)*.22:prepare?-.7:read||carry?-.82:moving?-Math.sin(t*speed+i*Math.PI)*.55:Math.sin(t*1.6+i)*.025;u.arms[i].rotation.z=(i===0?1:-1)*.10;}u.carry.visible=carry||read;}
 workshop(){
  this.box(75,.3,85,0x8e9976,0,-.22,-22);for(let i=0;i<12;i++)this.tree((i%2?-1:1)*(12+rand(i)*9),-7-i*4,.8+rand(i+4)*.7);
  this.box(17,.25,14,0xab8860,0,-.02,-1,this.land,{map:this.tex.wood});
  this.box(17,5.3,.35,0xb2a489,0,2.55,-7.8,this.land,{map:this.tex.plaster});this.box(17,1.4,.4,0x695b42,0,.7,-7.55,this.land,{map:this.tex.wood});
  for(const x of [-7.9,-4,4,7.9]){this.box(.25,5.9,.28,0x66543a,x,2.9,-7.4);this.box(.23,5.5,.23,0x675339,x,2.7,4.7);}this.box(17,.28,.3,0x6c5639,0,5.5,4.7);this.box(17,.3,3,0x454d3c,0,5.8,-6.5);for(const x of [-8,-4,0,4,8])this.box(.18,.18,12,0x675239,x,5.5,-1);
  for(const x of [-5.6,5.6]){this.box(2.1,2.4,.2,0x514f3c,x,3.2,-7.52);this.box(1.8,2.15,.22,0xb1c3b2,x,3.2,-7.4);for(const a of [-.4,.4])this.box(.06,2.15,.25,0x73684e,x+a,3.2,-7.25);this.box(1.8,.06,.25,0x73684e,x,3.2,-7.25);this.box(2.35,.14,.55,0x8b7451,x,1.91,-7.4);}
  this.box(2.1,3.2,.23,0x6e6752,0,1.6,-7.45,this.land,{map:this.tex.wood});this.box(.09,3.15,.27,0x453d2d,0,1.6,-7.26);this.box(2.2,.1,.28,0x49442f,0,3.2,-7.26);
  this.benchProps=[];for(const x of [-4,0,4]){const bench=this.table(x,-1,{width:2.55,depth:1.35,height:1.03});this.box(1.1,.16,.6,0xc29c65,0,1.22,0,bench,{map:this.tex.wood});for(let i=0;i<3;i++)this.box(.8,.05,.15,0xbd935a,-.15,1.34+i*.045,.1,bench);this.box(.17,.3,.24,0x424942,-.95,1.18,.2,bench);this.box(.42,.06,.07,0x535548,-.95,1.36,.2,bench);this.beam([.7,1.16,.3],[1,1.16,-.25],.07,0x6a5738,bench);this.box(.3,.12,.13,0x566055,1.0,1.18,-.25,bench);const tool=this.group(0,0,0,bench);tool.userData.dynamic=true;this.box(.08,.72,.08,0x7d5b36,.65,1.65,.17,tool).rotation.z=.5;this.box(.4,.15,.16,0x48514a,.5,1.9,.17,tool).rotation.z=.5;this.benchProps.push(tool);}
  for(const x of [-7,7]){this.barrel(x,-4,.9);this.crate(x,0,2,1.1);}for(let i=0;i<5;i++)this.box(1.2,.15,.4,0x897047,-7.1,.18+i*.16,-1.5,this.land,{map:this.tex.wood});
  this.placard(['WORKSHOP','Shared work','Shared goods'],2.6,3.45,-7.28,1.45,1.8);this.placard(['BROOK FARM','Labor and learning'],7.82,2.8,-4,1.3,1.5,this.land,{rotate:-Math.PI/2});
  this.ambient=[this.actor(-6,-3,{coat:0x877253,dress:false,skin:0xc4936b},this.cast),this.actor(6,-3,{coat:0x687767,dress:true,bonnet:true,skin:0xc99a74},this.cast)];
  this.filmBench=this.table(0,-3,{width:2.4,depth:1.3},this.film);this.sheet(-.4,1.15,-3,.6,.75,this.film,'COOPERATION');this.box(.7,.14,.48,0xb19465,.45,1.21,-3,this.film);
 }
 pressModel(x,z,parent=this.land){
  const g=this.group(x,0,z,parent);g.userData.dynamic=true;for(const a of [-1,1]){this.box(.25,3.3,.3,0x594833,a*1.05,1.65,0,g);this.box(.25,.18,1.8,0x594833,a*1.05,.15,0,g);}this.box(2.55,.3,.8,0x655037,0,3.15,0,g);this.box(2.2,.24,1.6,0x5c4c34,0,.96,.2,g);this.box(1.6,.08,1.2,0x3a433c,0,1.14,.23,g);const screw=this.group(0,2.14,0,g);this.cyl(.11,1.7,0x5a6256,0,0,0,screw);for(let i=0;i<15;i++)this.mesh('torus',[.125,.025,4,9],0x8b8d76,0,-.7+i*.10,0,screw).rotation.x=Math.PI/2;const platen=this.box(1.65,.16,1.22,0x39423c,0,1.47,.22,g);const handle=this.group(0,2.08,.08,g);this.beam([0,0,0],[1.6,0,.5],.065,0x4a554b,handle);this.sphere(.13,0x80633c,1.6,0,.5,handle);const paper=this.sheet(0,1.2,.35,1.12,.86,g,'THE LIBERATOR');this.wheels.push({screw,platen,handle,paper});return g;
 }
 street(){
  this.box(80,.3,135,0x717e72,0,-.27,-44);this.box(16,.17,110,0xada38a,0,-.04,-32,this.land,{map:this.tex.stone});
  for(const side of [-1,1]){this.box(2.5,.25,106,0xa7a38d,side*9.2,.02,-32,this.land,{map:this.tex.stone});for(let i=0;i<6;i++){this.building(side*14,-i*16,10,9+(i%3)*1.7,8,[0x9c7259,0x91977d,0x8d7263,0xb5a28a][(i+(side>0?2:0))%4],side<0?Math.PI/2:-Math.PI/2);this.lantern(side*8,-4-i*24);}}
  this.building(0,-99,31,15,9,0x877964,0);this.placard(['BOOKS & TRACTS','Printed here'], -9.85,3.3,-7,2.6,1.5,this.land,{rotate:Math.PI/2});
  this.placard(['THE LIBERATOR','1831','Immediate emancipation'], -9.79,1.8,-2,1.1,1.5,this.land,{rotate:Math.PI/2});this.placard(['NORTH STAR','Frederick Douglass','1847'],9.79,2.2,-10,1.15,1.6,this.land,{rotate:-Math.PI/2});
  for(let i=0;i<5;i++){this.barrel((i%2?1:-1)*10.1,-4-i*13,.7+rand(i)*.3);this.crate((i%2?-1:1)*10.1,0,-12-i*14,.85);}
  const awning=this.group(-9,0,-14);this.box(2.3,.14,6.6,0x596c5b,0,3.4,0,awning).rotation.z=-.16;for(const z of [-3,3])this.cyl(.045,3.4,0x424b3f,1,1.7,z,awning);this.pressModel(-9.25,-4,this.land);
  this.ambient=[];for(let i=0;i<6;i++)this.ambient.push(this.actor((i%2?1:-1)*8.6,-6-i*9,{coat:[0x626e61,0x7a6550,0x697a7a][i%3],skin:i%2?0xaf7652:0xc69c7d,dress:i%3===0,hat:i%3!==0},this.cast));
  this.filmPress=this.pressModel(0,-3,this.film);const t=this.table(3,-2.7,{width:1.7,depth:1.1},this.film);for(let i=0;i<4;i++)this.sheet(3+rand(i)*.2,1.15+i*.03,-2.7+rand(i+2)*.25,.6,.8,this.film,'TESTIMONY');this.contact(0,-3,3.2,2.2,this.film,.5);
 }
 hall(){
  this.box(29,.3,35,0x98876b,0,-.24,-5);this.box(18,.2,21,0xa88b60,0,-.02,-1,this.land,{map:this.tex.wood});
  this.box(18,7,.35,0xb6aa8a,0,3.5,-11.4,this.land,{map:this.tex.plaster});this.box(18,1.7,.42,0x6c5c43,0,.85,-11.15,this.land,{map:this.tex.wood});
  for(const side of [-1,1]){const wall=this.group(side*9,0,-1);this.box(.3,7,21,0xb2a58a,0,3.5,0,wall,{map:this.tex.plaster});this.box(.42,1.7,21,0x6c5c43,-side*.04,.85,0,wall,{map:this.tex.wood});for(let z=-8;z<8;z+=4.4){this.box(.39,3.8,2.0,0x5a5c48,-side*.05,4.05,z,wall);this.box(.43,3.5,1.73,0xc3d0b0,-side*.09,4.05,z,wall);this.box(.49,3.5,.07,0x6b6a52,-side*.1,4.05,z,wall);this.box(.49,.08,1.8,0x6b6a52,-side*.1,4.05,z,wall);this.box(.7,.12,2.25,0x827052,-side*.1,2.1,z,wall);}for(let z=-10;z<10;z+=3.4)this.box(.47,1.8,.07,0x514933,-side*.05,.9,z,wall);}
  for(let z=-10;z<7;z+=4.3){this.box(18,.25,.25,0x65553d,0,6.85,z);this.beam([-9,6.75,z],[-5,5.8,z],.15,0x65553d);this.beam([9,6.75,z],[5,5.8,z],.15,0x65553d);}
  this.box(13,.45,3.7,0x746044,0,.17,-8.1,this.land,{map:this.tex.wood});this.table(0,-8,{width:4.8,depth:1.2,height:1.1});this.chair(-1.2,-9.2,Math.PI);this.chair(1.2,-9.2,Math.PI);
  this.placard(['WOMAN’S RIGHTS','CONVENTION','SENECA FALLS','1848'],0,4.3,-11.1,3.6,2.25,this.land,{paper:'#d7c39b'});
  for(const x of [-4,4])for(const z of [-4,0,3])this.chair(x,z,0);this.table(-4,3,{width:1.8,depth:1.05});this.table(4,3,{width:1.8,depth:1.05});this.chair(-5.8,-8,.25);this.chair(5.8,-8,-.25);
  this.hallChanges=[];const changed=n=>{const g=this.group();g.userData.dynamic=true;g.userData.after=n;this.hallChanges.push(g);return g;};
  this.delegates=[this.actor(-4,-4,{coat:0x536c69,dress:true,skin:0xa46c4c,bonnet:true}),this.actor(4,-4,{coat:0x7c6c51,hat:true,skin:0xc28e67})];this.delegates.forEach((a,i)=>a.userData.after=i+1);
  let g=changed(3);for(let i=0;i<3;i++)this.sheet(-4+(i-1)*.35,1.17+i*.03,3+(i-1)*.1,.6,.8,g,'SENTIMENTS');
  g=changed(4);this.sheet(4.1,1.17,3,.7,.8,g,'RESOLUTIONS');this.cyl(.07,.16,0x343f38,3.55,1.22,3.2,g);this.beam([3.55,1.24,3.2],[3.7,1.75,3.3],.022,0xe4d8b8,g);this.mesh('cyl',[.12,.2,.4,10],0xa6b5a6,4.55,1.3,3.1,g);
  g=changed(5);this.placard(['DECLARATION','OF SENTIMENTS','All men and women','are created equal'],0,1.2,-5.5,1.3,1.6,g,{paper:'#d8c8a5'});this.box(.09,1.8,.1,0x6b563c,0,.6,-5.6,g);
  g=changed(6);this.sheet(0,1.23,-8,1.2,.9,g,'DECLARATION');for(const x of [-2,2])this.chair(x,-7.1,Math.PI,g);
  this.rope=this.group();this.rope.userData.dynamic=true;for(const x of [-1.2,1.2]){this.cyl(.07,.9,0x7d6d4d,x,.45,4,this.rope);this.sphere(.12,0xa79061,x,.95,4,this.rope);}this.beam([-1.2,.9,4],[1.2,.9,4],.05,0xab8c5b,this.rope);
  this.filmDeclaration=this.table(0,-6,{width:2.6,depth:1.3,height:.97},this.film);this.sheet(0,1.07,-6,1.5,1.1,this.film,'DECLARATION OF SENTIMENTS');this.cyl(.06,.12,0x343e35,.95,1.1,-6.2,this.film);this.beam([.95,1.13,-6.2],[1.15,1.72,-6.1],.019,0xe3d5ad,this.film);
 }
 makeDust(){const count=60,positions=new Float32Array(count*3);for(let i=0;i<count;i++){positions[i*3]=(rand(i)-.5)*30;positions[i*3+1]=rand(i+100)*7;positions[i*3+2]=-rand(i+200)*55+8;}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(positions,3));this.geometries.set('dust',geo);const mat=new T.PointsMaterial({color:this.mode==='press'?0xd4bb94:0xe4d1a1,map:this.tex.glow,size:.10,transparent:true,opacity:.3,depthWrite:false});this.materials.set('dust',mat);this.dust=new T.Points(geo,mat);this.scene.add(this.dust);this.dustBase=positions.slice();}
 batchStatic(parent){parent.updateMatrixWorld(true);const lists=new Map();parent.traverse(o=>{if(!o.isMesh||Array.isArray(o.material))return;let p=o;while(p&&p!==parent){if(p.userData.dynamic)return;p=p.parent;}const key=o.geometry.uuid+'|'+o.material.uuid;const rows=lists.get(key)||[];rows.push(o);lists.set(key,rows);});for(const rows of lists.values())if(rows.length>=3){const batch=new T.InstancedMesh(rows[0].geometry,rows[0].material,rows.length),inv=parent.matrixWorld.clone().invert();batch.frustumCulled=false;rows.forEach((m,i)=>{batch.setMatrixAt(i,inv.clone().multiply(m.matrixWorld));m.parent.remove(m);});batch.instanceMatrix.needsUpdate=true;parent.add(batch);}}
 batchActors(){this.scene.updateMatrixWorld(true);const groups=new Map();for(const actor of this.actors)actor.traverse(o=>{if(!o.isMesh||Array.isArray(o.material))return;const key=o.geometry.uuid+'|'+o.material.uuid,rows=groups.get(key)||[];rows.push(o);groups.set(key,rows);});for(const rows of groups.values())if(rows.length>=2){const mesh=new T.InstancedMesh(rows[0].geometry,rows[0].material,rows.length);mesh.frustumCulled=false;this.scene.add(mesh);rows.forEach(o=>o.visible=false);this.actorBatches.push({mesh,rows});}}
 syncActors(){this.scene.updateMatrixWorld(true);const hidden=new T.Matrix4().makeScale(0,0,0);for(const b of this.actorBatches){b.rows.forEach((node,i)=>{let p=node.parent,visible=true;while(p&&p!==this.scene){if(!p.visible){visible=false;break;}p=p.parent;}b.mesh.setMatrixAt(i,visible?node.matrixWorld:hidden);});b.mesh.instanceMatrix.needsUpdate=true;}}
 entityView(e){let pool=this.entityPools.get(e.kind);if(!pool){pool=[];this.entityPools.set(e.kind,pool);}if(pool.length)return pool.pop();const g=this.group(0,0,0,this.entityRoot);g.userData.dynamic=true;g.userData.kind=e.kind;
  if(e.kind==='work'){this.box(.9,.13,.6,0xc6a167,0,1.25,0,g);this.box(.65,.06,.3,0x8b704c,0,1.36,0,g);const halo=this.mesh('torus',[.65,.045,6,30],0xffce71,0,2.1,.15,g);const ring=this.mesh('torus',[.65,.055,6,30],0x9cbbaa,0,2.1,.15,g);g.userData.ring=ring;g.userData.halo=halo;}
  else if(e.kind==='pamphlet'){for(let i=0;i<3;i++)this.box(.85,.08,1.1,0xe0c69c,0,.85+i*.08,0,g);this.box(.05,.3,1.15,0x805a3b,0,.95,0,g);const ring=this.mesh('torus',[.73,.045,6,28],0xf0c16d,0,.15,0,g);ring.rotation.x=Math.PI/2;g.userData.ring=ring;this.contact(0,0,1.1,.85,g,.4);}
  else if(e.kind==='cart'){this.box(2.25,.17,1.6,0x8a6946,0,.68,0,g,{map:this.tex.wood});for(const a of [-1,1]){this.box(.1,.6,1.6,0x795c3d,a*1.06,1,0,g);this.box(2.25,.6,.1,0x795c3d,0,1,a*.74,g);this.beam([a*.7,.75,.65],[a*.7,.4,2.6],.07,0x6b5338,g);}const wheels=[];for(const x of [-1.2,1.2])for(const z of [-.55,.55]){const w=this.mesh('torus',[.43,.085,6,14],0x4c4b37,x,.42,z,g);w.rotation.y=Math.PI/2;wheels.push(w);for(let j=0;j<5;j++){const a=j*Math.PI/5;this.beam([x,.42-Math.cos(a)*.38,z-Math.sin(a)*.38],[x,.42+Math.cos(a)*.38,z+Math.sin(a)*.38],.035,0x5d553b,g);}}g.userData.wheels=wheels;this.crate(-.4,.78,0,.7,g);this.contact(0,0,2.6,1.8,g,.5);const warn=this.mesh('ring',[.78,.85,24],0xffd39a,0,.035,1.6,g,{transparent:true,opacity:.7,side:T.DoubleSide});warn.rotation.x=-Math.PI/2;g.userData.warn=warn;}
  else if(e.kind==='attendee'||e.kind==='crate'){const a=this.actor(0,0,{coat:0x8b785a,skin:0xba8864,hat:true},g);a.userData.carry.visible=true;g.userData.actor=a;const warn=this.mesh('ring',[.6,.66,22],0xdcb779,0,.035,0,g,{transparent:true,opacity:.7,side:T.DoubleSide});warn.rotation.x=-Math.PI/2;g.userData.warn=warn;}
  else{const ring=this.mesh('ring',[.57,.65,36],0xe9c476,0,.04,0,g,{transparent:true,opacity:.85,side:T.DoubleSide});ring.rotation.x=-Math.PI/2;g.userData.ring=ring;const top=this.mesh('cone',[.16,.4,4],0xf0cb7a,0,1.8,0,g);g.userData.arrow=top;}
  return g;
 }
 showEffects(r,t,reduced){const effects=r?.effects||[];for(let i=0;i<Math.min(effects.length,12);i++){const e=effects[i];let g=this.fx[i];if(!g){g=this.group(0,0,0,this.entityRoot);g.userData.parts=[];for(let j=0;j<5;j++){const p=this.box(.055,.055,.15,j%2?0xe2c78d:0xd4e0be,0,0,0,g);g.userData.parts.push(p);}this.fx.push(g);}g.visible=!reduced;g.position.set(e.x||0,.6,e.z||0);g.userData.parts.forEach((p,j)=>{const a=j*2.4+(e.seed||0),life=clamp(e.life,0,1.1);p.position.set(Math.sin(a)*(1-life)*1.4,.3+Math.sin((1-life)*Math.PI)*.8,Math.cos(a)*(1-life)*1.4);p.rotation.set(t*3+j,t*2+j,0);});}for(let i=Math.min(effects.length,12);i<this.fx.length;i++)this.fx[i].visible=false;}
 update(run,time,{view='menu',shot=null,progress=0,paused=false,director=null,reducedMotion=false}={}){
  if(this.disposed)return;const started=performance.now(),dt=Math.min(.25,Math.max(0,time-(this.lastTime??time)));this.lastTime=time;if(!paused)this.clock+=dt;const t=this.clock,active=['play','pause','gate','result'].includes(view),cinema=view==='cinema',menu=view==='menu',p=run?.player||{x:0,z:2,jump:0};
  this.film.visible=cinema||menu;
  this.hero.position.set(active?p.x:2,0,active?p.z:1);this.hero.rotation.y=this.mode==='press'&&active?Math.PI:0;this.other.visible=cinema||menu;
  if(cinema&&director){if(director.heroPosition)this.hero.position.fromArray(director.heroPosition);if(director.otherPosition)this.other.position.fromArray(director.otherPosition);}
  const velocity=Math.hypot(p.vx||0,p.vz||0),pose=cinema?director?.heroPose:p.pose,moving=active&&view==='play'&&velocity>.1,sprint=velocity>7||(p.dashTime||p.burst||0)>0;
  this.animateActor(this.hero,t,{moving:moving||pose==='run',sprint,work:pose==='work'||(this.mode==='assembly'&&(p.actionTime||0)>0),read:pose==='read',prepare:pose==='prepare'||(this.mode==='convention'&&(p.actionTime||0)>0),jump:active?p.jump||0:0,speaking:pose==='speak',lean:p.lean||0,carry:this.mode==='press'&&(moving||pose==='carry')});
  this.animateActor(this.other,t+1,{speaking:director?.otherPose==='speak',read:director?.otherPose==='read',work:director?.otherPose==='work',carry:this.mode==='press'});
  for(let i=0;i<(this.ambient?.length||0);i++){const a=this.ambient[i];a.rotation.y=this.mode==='assembly'?(i?-.6:.6):(i%2?Math.PI/2:-Math.PI/2);this.animateActor(a,t+i,{work:this.mode==='assembly',read:this.mode==='press'&&i%2===0});}
  if(this.benchProps)for(let i=0;i<this.benchProps.length;i++)this.benchProps[i].rotation.x=(p.actionTime||0)>0&&Math.abs(p.x-[-4,0,4][i])<1.6?Math.sin(t*18)*.06:0;
  for(const w of this.wheels){w.handle.rotation.y=Math.sin(t*.8)*.22;w.screw.rotation.y=Math.sin(t*.8)*.6;w.platen.position.y=1.47+Math.sin(t*.8)*.05;}
  if(this.delegates){for(let i=0;i<this.delegates.length;i++){const a=this.delegates[i];a.visible=cinema&&director?.focus!=='declaration'||(run?.collected||0)>=i+1;this.animateActor(a,t+i,{read:true});}for(const g of this.hallChanges)g.visible=(run?.collected||0)>=g.userData.after;this.rope.visible=active&&(run?.collected||0)<6;}
  const seen=new Set();for(const e of active?run?.entities||[]:[]){seen.add(e.id);let g=this.entityViews.get(e.id);if(!g){g=this.entityView(e);g.visible=true;this.entityRoot.add(g);this.entityViews.set(e.id,g);}g.position.set(e.x,0,e.z);g.visible=true;if(e.kind==='work'){const perfect=e.perfectAt??1.3,scale=Math.max(.35,1.9-(e.age||0)*.69);g.userData.ring.scale.setScalar(scale);g.userData.ring.material=this.mat(Math.abs((e.age||0)-perfect)<(e.perfectWindow??.3)?0xffd278:0x9bbdae);g.userData.halo.visible=true;}if(e.kind==='pamphlet')g.position.y=Math.sin(t*2.5+e.id)*.1;if(g.userData.wheels)for(const w of g.userData.wheels)w.rotation.z=t*6;if(g.userData.actor){g.rotation.y=(Number.isFinite(e.vx)?e.vx:Math.cos((run?.time||0)*.7+(e.lane||0)*Math.PI))>=0?Math.PI/2:-Math.PI/2;this.animateActor(g.userData.actor,t,{moving:view==='play',carry:true});}if(g.userData.warn)g.userData.warn.visible=(e.dangerPhase||0)>.25;if(g.userData.arrow)g.userData.arrow.position.y=1.7+Math.sin(t*3)*.07;}
  for(const [id,g] of this.entityViews)if(!seen.has(id)){g.visible=false;this.entityRoot.remove(g);this.entityViews.delete(id);this.entityPools.get(g.userData.kind).push(g);}
  this.showEffects(['play','pause','gate'].includes(view)?run:null,t,reducedMotion);this.dust.visible=!reducedMotion;const data=this.dust.geometry.attributes.position.array;for(let i=0;i<data.length;i+=3){data[i]=this.dustBase[i]+Math.sin(t*.13+i)*.35;data[i+1]=(this.dustBase[i+1]+t*.04)%7;}this.dust.geometry.attributes.position.needsUpdate=true;
  const pos=V(),target=V(),portrait=this.camera.aspect<.8;
  if(cinema&&director){pos.fromArray(director.position);target.fromArray(director.target);this.camera.fov=director.fov||50;}
  else if(menu){pos.set(this.mode==='convention'?2:7,this.mode==='convention'?5:4.2,portrait?17:13);target.set(0,1.45,this.mode==='convention'?-5:-2.1);this.camera.fov=portrait?62:48;}
  else if(cinema){if(shot?.view==='close'){pos.set(2.5,2.1,6);target.set(0,1.05,1);}else{pos.set(0,4.7,13);target.set(0,1.5,-3);}this.camera.fov=portrait?62:50;}
  else if(this.mode==='convention'){pos.set(0,17,portrait?21:16);target.set(0,.4,-1.9);this.camera.fov=portrait?65:53;}
  else if(this.mode==='assembly'){pos.set(p.x*.12,6.2,portrait?16.5:12);target.set(p.x*.12,1.1,-1.5);this.camera.fov=portrait?63:52;}
  else{pos.set(p.x*.35,5.8,p.z+(portrait?17:12));target.set(p.x*.48,1,p.z-12);this.camera.fov=portrait?64:53;}
  if(!paused)this.speedFov=lerp(this.speedFov||0,!reducedMotion&&view==='play'&&sprint?3.4:0,Math.min(1,dt*9));if(!cinema&&!menu)this.camera.fov+=this.speedFov||0;
  this.camera.position.copy(pos);this.camera.lookAt(target);this.camera.updateProjectionMatrix();this.syncActors();this.renderer.render(this.scene,this.camera);this.performance={calls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,cpuMs:performance.now()-started,quality:'balanced'};
 }
 resize(){if(this.disposed)return;const r=this.canvas.getBoundingClientRect();this.renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);this.camera.aspect=Math.max(1,r.width)/Math.max(1,r.height);this.camera.updateProjectionMatrix();}
 dispose(){if(this.disposed)return;this.disposed=true;for(const g of this.geometries.values())g.dispose();for(const m of this.materials.values())m.dispose();for(const t of this.textures)t.dispose();this.scene.traverse(o=>{if(o.isSprite)o.material.dispose();});this.renderer.dispose();}
 }
