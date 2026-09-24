import * as T from './three.module.js';
import {makeActor,poseActor,tendWound,disposeTree} from './c5-actors.mjs?v=3.2';
import {CINEMATICS,editorialShot,blocking,smooth,mix} from './c5-cinema-plan.mjs?v=3.2';

const v=a=>new T.Vector3(...a);
export class CinemaDirector{
 constructor(renderer,textures){this.renderer=renderer;this.textures=textures;this.key=null;this.scene=null;this.camera=new T.PerspectiveCamera(42,1,.07,180);this.buildPost();}
 mat(c,extra={}){return new T.MeshStandardMaterial({color:c,roughness:.84,...extra});}
 mesh(geo,mat,pos,parent=this.scene){const m=new T.Mesh(geo,mat);m.position.set(...pos);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 box(w,h,d,c,x,y,z,p=this.scene){return this.mesh(new T.BoxGeometry(w,h,d),typeof c==='number'?this.mat(c):c,[x,y,z],p);}
 cyl(a,b,h,c,x,y,z,p=this.scene,n=16){return this.mesh(new T.CylinderGeometry(a,b,h,n),typeof c==='number'?this.mat(c):c,[x,y,z],p);}
 sphere(r,c,x,y,z,p=this.scene,scale=[1,1,1]){const m=this.mesh(new T.SphereGeometry(r,16,12),typeof c==='number'?this.mat(c):c,[x,y,z],p);m.scale.set(...scale);return m;}
 group(x=0,y=0,z=0){const g=new T.Group();g.position.set(x,y,z);this.scene.add(g);return g;}
 label(text,x,y,z,w=2.2,ink='#594531',paper='#c9ba91',rotate=0){
  const c=document.createElement('canvas');c.width=768;c.height=384;const ctx=c.getContext('2d');ctx.fillStyle=paper;ctx.fillRect(0,0,768,384);ctx.strokeStyle=ink;ctx.globalAlpha=.6;ctx.strokeRect(18,18,732,348);ctx.globalAlpha=1;ctx.fillStyle=ink;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 46px Georgia';text.split('|').forEach((s,i,a)=>ctx.fillText(s,384,170+(i-(a.length-1)/2)*56,690));
  ctx.globalAlpha=.35;for(let i=0;i<8;i++)ctx.fillRect(90,275+i*8,588-(i%3)*25,2);
  const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;const m=this.mesh(new T.PlaneGeometry(w,w*.5),this.mat(0xffffff,{map:tex,side:T.DoubleSide}),[x,y,z]);m.rotation.x=rotate;return m;
 }
 table(x=0,z=1.7,w=2.2){this.box(w,.13,1.1,this.wood,x,.88,z);for(const dx of [-w/2+.12,w/2-.12])for(const dz of [-.4,.4])this.box(.1,.88,.1,0x473a2e,x+dx,.43,z+dz);}
 letter(x,y,z,seal=true){const text=this.spec.theme==='fire'?'SUFFOLK RESOLVES|SEPTEMBER 1774':this.spec.theme==='dawn'?'THE ASSOCIATION|PHILADELPHIA · 1774':this.spec.theme==='print'?'CARGO SEIZED|VICE-ADMIRALTY COURT':'TO THE COMMITTEES|OF CORRESPONDENCE';const p=this.label(text,x,y,z,.62,'#554735','#d8c49a',-Math.PI/2);if(seal)this.cyl(.048,.048,.015,0x993c30,x+.15,y+.013,z+.035);return p;}
 crate(x,z,w=.9){const g=this.group(x,0,z);this.box(w,w*.8,w,this.wood,0,w*.4,0,g);for(const d of [-1,1])this.box(w+.02,.065,w+.02,0x393f36,0,w*(d<0?.15:.66),0,g);return g;}
 lantern(x,y,z,blue=false){
  const g=this.group(x,y,z),glow=this.mat(blue?0x7bd0ef:0xf5bf6e,{emissive:blue?0x5498c1:0xffa842,emissiveIntensity:2.8});this.box(.21,.32,.21,glow,0,0,0,g);this.box(.31,.04,.31,0x253230,0,-.18,0,g);this.box(.30,.06,.30,0x253230,0,.2,0,g);for(const a of [-1,1])for(const b of [-1,1])this.box(.025,.38,.025,0x2a3230,a*.11,0,b*.11,g);const light=new T.PointLight(blue?0x8cdcf1:0xffba65,13,10,2);light.position.set(x,y,z);this.scene.add(light);this.practicals.push(light);return g;
 }
 window(x,y,z,day=false){this.box(1.9,2.4,.12,0x332e26,x,y,z);this.box(1.64,2.12,.13,this.mat(day?0xb9ced5:0xd3a05c,{emissive:day?0x84b4ce:0xefad51,emissiveIntensity:day?1.6:.8}),x,y,z+.03);for(const dx of [-.82,0,.82])this.box(.065,2.17,.18,0x473e30,x+dx,y,z+.1);this.box(1.73,.06,.18,0x473e30,x,y,z+.1);}
 room(theme){
  this.box(15,.2,17,this.wood,0,-.14,-1);this.box(15,4.8,.24,this.mat(theme==='workshop'?0x747a68:0x536567,{map:this.textures.wood}),0,2.3,-4.3);
  for(const x of [-6.2,6.2])this.box(.25,4.8,12,0x3d443c,x,2.3,.5);
  for(let x=-6;x<=6;x+=3)this.box(.17,4.7,.3,0x353e33,x,2.3,-4.05);
  for(let z=-3.7;z<4;z+=2.5)this.box(12.5,.2,.18,0x37392f,0,4.4,z);
  this.window(-4,2.1,-4.1,theme!=='print');this.window(3.7,2.1,-4.1,theme!=='print');
  this.box(1.5,2.85,.15,0x34372f,1.3,1.4,-4.05);this.sphere(.04,0xb99960,1.85,1.4,-3.94);
  this.lantern(-2.6,2.9,-1.8);this.lantern(4.3,2.8,-2.5);
  this.table(0,2.05);this.letter(-.1,.955,2.0);this.details.dispatch=[-.1,1.05,2];this.details.notice=[-.1,1.05,2];
  for(let i=0;i<4;i++)this.box(.50,.06,.75,0xb9a77e,-.65+i*.07,.99+i*.06,2.2);
  for(let i=0;i<4;i++){const b=this.box(.19,.48,.60,this.mat([0x6c5541,0x7c6449,0x4e645e][i%3]),-4.9+i*.23,.89,-2.8);b.rotation.z=(i%2?.06:-.04);}
  this.box(2.1,.1,.8,0x514738,-4.5,.6,-2.8);
 }
 press(x=-2.8,z=-1.4){
  const g=this.group(x,0,z);for(const a of [-.65,.65])this.box(.16,2.2,.18,0x48382a,a,1.1,0,g);this.box(1.8,.16,.55,this.wood,0,.88,.12,g);this.box(1.6,.17,.26,0x5f4931,0,2.1,0,g);this.cyl(.064,.064,1.2,0x8d7951,0,1.55,0,g);this.box(1.1,.12,.75,0x5a4b38,0,1.02,0,g);this.box(.85,.014,.58,0xd4c49f,0,.973,.30,g);this.pressLever=this.box(1.6,.055,.07,0x997b51,.6,1.62,0,g);this.details.press=[x,1.3,z+.1];return g;
 }
 loom(){
  const x=-1.55,z=-1.30,g=this.group(x,0,z);for(const a of [-.7,.7])this.box(.12,2.1,.14,0x715334,a,1.02,0,g);for(const y of [.27,1.78])this.box(1.7,.12,.14,0x876542,0,y,0,g);
  this.box(1.22,.71,.035,this.mat(0xb5aa86,{map:this.textures.wood}),0,.78,0,g);for(let i=0;i<27;i++)this.box(.012,1.53,.012,0xdbce9f,-.61+i*.047,1.02,-.07,g);
  this.shuttle=this.box(.74,.05,.065,0x4b3527,0,1.23,-.13,g);this.details.loom=[x,1.27,z];this.details.cloth=[.75,1.02,2.15];
  for(let i=0;i<3;i++)this.box(.67,.10,.58,[0xc0b18e,0x819486,0xb2a37c][i],.67,1.01+i*.1,2.17);
  const wheel=this.group(-3.6,.73,.2);const torus=this.mesh(new T.TorusGeometry(.50,.035,8,40),this.mat(0x8a673f),[0,0,0],wheel);for(let i=0;i<8;i++){const spoke=this.box(.015,1,.028,0x745637,0,0,0,wheel);spoke.rotation.z=i*Math.PI/4;}this.wheel=wheel;this.cyl(.045,.08,.8,0x745437,-3.6,.4,.2);this.box(1,.1,.5,0x675138,-3.6,.1,.2);
 }
 building(x,z,w=5,h=7){
  this.box(w,h,4,this.mat(x<0?0x665246:0x4d6162,{map:this.textures.wood}),x,h/2,z);
  for(let y=1.9;y<h;y+=2.35)for(let dx=-w/2+1;dx<w/2;dx+=2.3){this.box(.83,1.35,.1,0x293331,x+dx,y,z+2.07);this.box(.65,1.12,.12,this.mat(0xdfaf62,{emissive:0xd5964a,emissiveIntensity:.65}),x+dx,y,z+2.13);this.box(.04,1.18,.15,0x45453a,x+dx,y,z+2.2);}
  const roof=this.mesh(new T.ConeGeometry(w*.76,2.1,4),this.mat(0x273634),[x,h+1,z]);roof.rotation.y=Math.PI/4;roof.scale.z=4/w;
 }
 street(theme){
  this.box(40,.18,75,this.mat(theme==='snow'?0xb4c3c8:0x536362,{map:theme==='snow'?this.textures.snow:this.textures.stone,roughness:theme==='snow'?.85:.43}),0,-.14,-9);
  for(let i=0;i<7;i++)for(const side of [-1,1])this.building(side*(7.5+(i%2)*1.2),-5-i*8,5.5,6.6+(i%3));
  for(const x of [-5.8,5.8]){this.cyl(.04,.08,3.1,0x293734,x,1.5,-2.7);this.lantern(x,2.9,-2.7,theme==='snow'&&x<0);}
  this.label(theme==='snow'?'KING STREET':'VALE | PRINT & PAPER',-6.8,3.3,-1.85,3,'#dec596','#273a3b');
 }
 fire(){
  this.street('fire');this.press(-3.6,-2.1);this.table(-.1,2.05);this.letter(-.15,.96,2.02);this.details.dispatch=[-.15,1.04,2.02];this.details.notice=this.details.dispatch;
  this.box(8,.17,.28,0x302c26,-1.1,.38,-3.5).rotation.z=.09;
  for(const x of [-4.4,-3.0,-6.2]){for(let i=0;i<4;i++){
   const mat=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,uniforms:{time:{value:0},seed:{value:i+x}},vertexShader:'varying vec2 uv0;void main(){uv0=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:`varying vec2 uv0;uniform float time,seed;void main(){float y=uv0.y;float bend=sin(y*7.0-time*3.0+seed)*.08*y+sin(y*17.0-time*5.0)*.025;float x=abs(uv0.x-.5+bend);float width=(1.0-y)*.39;float a=smoothstep(width,width*.30,x)*smoothstep(0.0,.15,y)*(1.0-smoothstep(.70,1.0,y));float pulse=.82+.18*sin(time*9.0+y*19.0+seed);vec3 c=mix(vec3(2.7,.38,.025),vec3(4.3,2.3,.44),pow(1.0-y,2.0));gl_FragColor=vec4(c,a*pulse*.80);}`});
   const flame=this.mesh(new T.PlaneGeometry(1.8,4.5),mat,[x+Math.sin(i*2)*.6,2.0+i*.18,-3.3+Math.cos(i)*.55]);flame.castShadow=false;this.flames.push(flame);
  }const l=new T.PointLight(0xff8935,48,20,2);l.position.set(x,2,-3.2);this.scene.add(l);this.practicals.push(l);}
  this.box(.25,4.5,.3,0x4e4938,4.65,2.2,-4);this.box(.25,4.5,.3,0x4e4938,-4.65,2.2,-4);this.box(9.6,.3,.3,0x4e4938,0,4.3,-4);
 }
 forest(){
  this.box(65,.15,95,this.mat(0x637053,{map:this.textures.earth}),0,-.12,-15);this.box(6,.01,90,this.mat(0x95886e,{map:this.textures.earth}),0,-.035,-10);
  for(let i=0;i<65;i++){const side=i%2?-1:1,x=side*(4.7+(i*3.17)%21),z=7-(i*7.13)%66,h=8+i%5;this.cyl(.17,.31,h,0x544c3d,x,h/2,z);for(let j=0;j<3;j++)this.mesh(new T.ConeGeometry(2.9-j*.52,4.8,9),this.mat(i%2?0x2e493b:0x3d5842),[x,h-1+j*1.6,z]);}
  this.box(.17,2.6,.17,0x645037,3.9,1.2,-2.5);this.label('PROCLAMATION|1763',3.9,1.83,-2.4,1.6);this.details.boundary=[3.9,1.7,-2.4];
  this.box(18,.018,.25,0xbdab7c,0,0,-2.5);this.crate(.4,1.5,.75);this.box(.62,.29,.44,0x5f5740,.4,.72,1.5);this.box(.15,.22,.01,0xe1d3b4,.4,.74,1.725);this.details.bag=[.4,.78,1.5];
  for(let i=0;i<14;i++)this.sphere(.8,this.mat(0x859080),Math.sin(i*4)*8,.15,-i*3, this.scene,[1.4,.5,.8]);
 }
 ship(){
  this.water();this.box(10,.45,27,this.wood,0,-.15,-4);for(const x of [-5,5]){this.box(.16,.14,27,0x736346,x,1.1,-4);for(let z=-16;z<9;z+=1.35)this.box(.12,1.2,.12,0x5c533f,x,.56,z);}
  for(const z of [-5,-13]){this.cyl(.14,.21,14,0x80603d,0,7,z);this.box(9,.14,.14,0x7e694d,0,10,z);this.box(8,4,.025,this.mat(0x98a39b,{side:T.DoubleSide}),0,7,z);}
  for(const x of [-4.8,4.8]){const rope=this.cyl(.012,.012,12,0x958976,x,5.3,-3.1);rope.rotation.z=x>0?-.39:.39;}
  this.crate(0,1.65,1.0);this.label('EAST INDIA|COMPANY',0,.5,2.16,.75,'#312d21','#b2a27d');this.details.tea=[0,.72,1.65];
  for(const p of [[-3,-2],[3,-4],[-2.8,-7]])this.crate(...p,1.05);this.lantern(2.9,1.8,2.1);this.details.lantern=[2.9,1.8,2.1];this.distantShips();
 }
 water(){
  const geo=new T.PlaneGeometry(150,160,55,55);geo.rotateX(-Math.PI/2);this.waterMesh=this.mesh(geo,this.mat(0x193f4a,{metalness:.50,roughness:.28}),[0,-.35,-25]);
 }
 distantShips(){for(const [x,z]of[[-14,-17],[13,-30],[-6,-41]]){this.box(5,1.8,15,0x263f43,x,.1,z);for(const dz of [-4,4]){this.cyl(.09,.15,15,0x374644,x,7.2,z+dz);this.box(6,.11,.09,0x59655c,x,11,z+dz);this.box(5.5,4,.018,this.mat(0x728784,{side:T.DoubleSide}),x,8.4,z+dz);}}}
 harbor(){
  this.water();this.distantShips();this.boat=this.group(0,.0,0);const outline=[[0,-3.4],[-1.45,-2.25],[-1.45,2.2],[0,3.3],[1.45,2.2],[1.45,-2.25]],shape=new T.Shape();outline.forEach(([x,z],i)=>i?shape.lineTo(x,z):shape.moveTo(x,z));shape.closePath();const hull=new T.ExtrudeGeometry(shape,{depth:.18,bevelEnabled:false});hull.rotateX(Math.PI/2);this.mesh(hull,this.wood,[0,0,0],this.boat);outline.forEach((a,i)=>{const b=outline[(i+1)%outline.length],dx=b[0]-a[0],dz=b[1]-a[1];const side=this.box(.12,.57,Math.hypot(dx,dz),this.wood,(a[0]+b[0])/2,.24,(a[1]+b[1])/2,this.boat);side.rotation.y=Math.atan2(dx,dz);});for(const z of [-1.3,1.1])this.box(2.9,.09,.38,0x8a7250,0,.48,z,this.boat);
  this.oars=[];for(const side of [-1,1]){const oar=new T.Group();oar.position.set(side*1.4,.73,.9);this.boat.add(oar);this.box(2.5,.04,.06,0xa08a60,side*.6,0,0,oar);this.box(.55,.08,.25,0x8e7650,side*1.8,0,0,oar);this.oars.push(oar);}
  this.lantern(1.12,.70,2.4);this.letter(.4,.55,1.1);this.details.dispatch=[.4,.59,1.1];this.details.blockade=[-1,4,-23];
  for(let i=0;i<10;i++)this.building(-23+i*5,-43,4.3,5+i%3);this.label('BOSTON',0,3.2,-37,4,'#acbdb3','#243941');
 }
 snow(){
  this.street('snow');this.lantern(-3.8,1.9,2.2,true);this.crate(-2.6,2,1);this.label('FIVE NAMES|5 MARCH 1770',-2.6,.83,2,.65,'#514638','#cfc2a4',-Math.PI/2);this.details.notice=[-2.6,.87,2];
  // Isaiah is the foreground casualty. Background people do not reuse his
  // distinctive coat and face, which would imply he is also running away.
  for(let i=0;i<6;i++){const g=makeActor('BYSTANDER');g.position.set(-4+i*1.6,0,-7-(i%3));g.rotation.y=Math.PI;this.scene.add(g);this.crowd.push(g);}
  const smokeGeo=new T.BufferGeometry(),smokePoints=new Float32Array(32*3);
  for(let i=0;i<32;i++){smokePoints[i*3]=Math.sin(i*13)*4;smokePoints[i*3+1]=1.2+(i%5)*.16;smokePoints[i*3+2]=-7+Math.cos(i*7);}
  smokeGeo.setAttribute('position',new T.BufferAttribute(smokePoints,3));
  const puff=document.createElement('canvas');puff.width=puff.height=64;const ctx=puff.getContext('2d'),gradient=ctx.createRadialGradient(32,32,0,32,32,32);gradient.addColorStop(0,'#ffffff');gradient.addColorStop(1,'#ffffff00');ctx.fillStyle=gradient;ctx.fillRect(0,0,64,64);
  this.powder=new T.Points(smokeGeo,new T.PointsMaterial({color:0x9faeb6,map:new T.CanvasTexture(puff),size:1.4,transparent:true,opacity:0,depthWrite:false}));this.scene.add(this.powder);
  this.flashLight=new T.PointLight(0xffdb9d,0,24);this.flashLight.position.set(0,2,-6);this.scene.add(this.flashLight);
 }
 setup(key){
  if(this.scene)disposeTree(this.scene,Object.values(this.textures));this.key=key;this.spec=CINEMATICS[key]||CINEMATICS.prologue;this.scene=new T.Scene();this.scene.fog=new T.FogExp2(this.spec.theme==='forest'?0x6c8375:this.spec.theme==='dawn'?0x506b6b:0x132b36,.025);this.scene.background=new T.Color(this.scene.fog.color);
  this.actors=new Map();this.extras=[];this.crowd=[];this.practicals=[];this.flames=[];this.details={};this.boat=this.oars=this.waterMesh=this.wheel=this.shuttle=this.pressLever=this.flashLight=this.powder=null;
  this.wood=this.mat(0x806a4c,{map:this.textures.wood});
  const day=['forest','workshop','dawn'].includes(this.spec.theme);this.scene.add(new T.HemisphereLight(day?0xc5d4db:0x93bed5,0x293028,day?1.8:1.2));
  const keyLight=new T.DirectionalLight(day?0xffd49c:0xa9c9ec,day?3.0:1.8);keyLight.position.set(-5,9,6);keyLight.castShadow=true;keyLight.shadow.mapSize.set(1024,1024);Object.assign(keyLight.shadow.camera,{left:-9,right:9,top:9,bottom:-9,near:1,far:35});keyLight.shadow.bias=-.0005;keyLight.shadow.normalBias=.035;this.scene.add(keyLight);
  const rim=new T.DirectionalLight(day?0xffdfac:0x6db9e7,day?2:2.4);rim.position.set(5,6,-4);this.scene.add(rim);
  const fill=new T.PointLight(0xffd5ac,24,19,2);fill.position.set(0,3,5);this.scene.add(fill);
  const theme=this.spec.theme;if(theme==='forest')this.forest();else if(theme==='print'||theme==='workshop'||theme==='dawn'){this.room(theme);if(theme==='print')this.press();if(theme==='workshop')this.loom();}else if(theme==='snow')this.snow();else if(theme==='ship')this.ship();else if(theme==='harbor')this.harbor();else this.fire();
  for(const person of Object.keys(this.spec.cast)){if(this.spec.hide?.includes(person))continue;const g=makeActor(person);this.actors.set(person,g);this.scene.add(g);}
  const count=theme==='snow'?210:theme==='fire'?170:90,points=new Float32Array(count*3);for(let i=0;i<count;i++){points[i*3]=Math.sin(i*53)*12;points[i*3+1]=(i*1.73)%9;points[i*3+2]=Math.cos(i*37)*18;}
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(points,3));this.particles=new T.Points(geo,new T.PointsMaterial({color:theme==='fire'?0xffc47a:0xd9e1d8,size:theme==='snow'?.047:.025,transparent:true,opacity:theme==='fire'?.7:.45,depthWrite:false}));this.scene.add(this.particles);
 }
 buildPost(){
  this.target=new T.WebGLRenderTarget(1,1,{type:T.HalfFloatType,minFilter:T.LinearFilter,magFilter:T.LinearFilter});this.target.depthTexture=new T.DepthTexture(1,1,T.UnsignedIntType);
  this.postScene=new T.Scene();this.postCamera=new T.OrthographicCamera(-1,1,1,-1,0,1);
  this.post=new T.ShaderMaterial({depthTest:false,depthWrite:false,toneMapped:false,uniforms:{colorMap:{value:this.target.texture},depthMap:{value:this.target.depthTexture},resolution:{value:new T.Vector2(1,1)},focus:{value:4},time:{value:0},reduced:{value:0},fade:{value:1}},
   vertexShader:'varying vec2 uv0; void main(){uv0=uv;gl_Position=vec4(position.xy,0.0,1.0);}',
   fragmentShader:`precision highp float; varying vec2 uv0; uniform sampler2D colorMap; uniform sampler2D depthMap; uniform vec2 resolution; uniform float focus,time,reduced,fade;
   float distanceAt(vec2 p){float d=texture2D(depthMap,p).r;return .07*180.0/(180.0-d*(180.0-.07));}
   vec3 film(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.0,1.0);}
   void main(){vec3 c=texture2D(colorMap,uv0).rgb;float dep=distanceAt(uv0);float blur=clamp(abs(dep-focus)/max(1.0,dep)*3.8,0.0,2.3);vec2 px=1.0/resolution;
    vec3 sum=c*2.0;vec3 glow=vec3(0.0);for(int i=0;i<8;i++){float a=float(i)*.785398;vec2 dir=vec2(cos(a),sin(a));vec3 s=texture2D(colorMap,uv0+dir*px*blur).rgb;sum+=s;vec3 b=texture2D(colorMap,uv0+dir*px*4.0).rgb;glow+=max(vec3(0.0),b-1.05);}
    c=mix(c,sum/10.0,.72)+glow*.019;c=film(c*1.12);c=pow(c,vec3(1.0/2.2));float vign=1.0-.16*pow(length((uv0-.5)*vec2(1.0,.8))*1.5,2.0);c*=vign;
    float grain=fract(sin(dot(uv0*resolution+time,vec2(12.9898,78.233)))*43758.5453)-.5;c+=grain*.008*(1.0-reduced);gl_FragColor=vec4(c*fade,1.0);}`});
  this.postScene.add(new T.Mesh(new T.PlaneGeometry(2,2),this.post));
 }
 framing(shot,frame){
  const get=key=>this.actors.get(key)?.position.clone()||new T.Vector3(0,0,0),subject=get(shot.subject),listener=get(shot.listener),p=frame.reduced?0:shot.progress,s=shot.side||1;let eye,look,fov=38;
  if(shot.kind==='detail'){const d=this.details[shot.subject]||[0,1,1.7];look=v(d);eye=look.clone().add(v(shot.subject==='blockade'?[5,1.5,11]:[.55-mix(0,.25,p),.57,1.25]));fov=shot.subject==='blockade'?39:36;}
  else if(shot.kind==='impact'){look=v([1.65,1.04,-.85]);eye=v([1.65,2.0,4.2]);fov=37;}
  else if(shot.kind==='wounded'){
   look=this.actors.get(shot.subject).userData.head.getWorldPosition(new T.Vector3()).add(v([0,-.08,0]));
   eye=look.clone().add(v([-.36,.20,mix(2.10,1.95,p)]));fov=36;
  }
  else if(shot.kind==='rescue'){look=v([1.4,.83,-.45]);eye=v([s>0?1.15:.25,2.65,mix(4.7,4.35,p)]);fov=42;}
  else if(shot.kind==='recovery'){look=v([1.4,.80,-.45]);eye=v([mix(1.1,1.5,p),mix(2.6,3.5,p),mix(4.5,6.5,p)]);fov=42;}
  else if(shot.kind==='close'){look=subject.clone().add(v([s*.03,1.58,0]));eye=subject.clone().add(v([s*mix(.70,.46,p),1.68,mix(2.85,2.55,p)]));fov=30;}
  else if(shot.kind==='over'){look=subject.clone().add(v([0,1.52,0]));eye=listener.clone().add(v([s*.62,1.76,1.23]));if(eye.distanceTo(look)<1.7)eye.z+=1;fov=43;}
  else if(shot.kind==='two'){look=subject.clone().lerp(listener,.5).add(v([0,1.17,0]));eye=look.clone().add(v([s*mix(1.5,.9,p),.65,5.2]));fov=38;}
  else if(shot.kind==='low'){look=subject.clone().add(v([0,shot.subject==='MARA'?.8:1.30,0]));eye=subject.clone().add(v([s*1.9,.8,3.2]));fov=39;}
  else if(shot.kind==='track'){look=subject.clone().add(v([-.7,1.25,0]));eye=look.clone().add(v([mix(4.2,3.1,p),.6,5]));fov=41;}
  else if(shot.kind==='depart'){look=v([0,1.1,-.6]);eye=v([mix(3,5.8,p),mix(2.2,4.9,p),mix(6,10.5,p)]);fov=44;}
  else {look=v([0,1.1,-.8]);eye=v([mix(4.8,3.1,p),mix(2.7,2.25,p),mix(8.1,6.8,p)]);fov=46;}
  if(this.spec.theme==='harbor'&&shot.kind!=='detail'){look.y-=.18;eye.y-=.1;}
  const aspect=innerWidth/innerHeight;if(aspect<1.45){
   if(shot.kind==='over'&&aspect<.8){look=subject.clone().add(v([0,1.52,0]));eye=subject.clone().add(v([s*.5,1.72,3.5]));fov=34;}
   else{const d=eye.clone().sub(look),limit=shot.kind==='close'?1.35:1.9;eye.copy(look).add(d.multiplyScalar(Math.min(limit,Math.sqrt(1.55/aspect))));}
  }
  if(!frame.reduced){const impact=shot.kind==='impact'?Math.max(0,1-(frame.lineTime||0)/.45)*.075:0,shake=impact+(this.spec.theme==='fire'?.012:this.spec.theme==='snow'?.009:.003);eye.x+=Math.sin(frame.time*39)*shake;eye.y+=Math.sin(frame.time*27)*shake;}
  return {eye,look,fov};
 }
 render(frame,dt=0){
  const renderStarted=performance.now();
  if(frame.key!==this.key)this.setup(frame.key);const spec=this.spec,t=frame.time||0;this.camera.aspect=innerWidth/innerHeight;
  for(const [key,g]of this.actors){const a=blocking(frame.key,key,t,frame.beat,frame.lineTime);if(!a){g.visible=false;continue;}g.visible=true;g.position.set(a.x,a.y,a.z);g.rotation.set(0,a.yaw,0);
   const other=this.actors.get(frame.speaker),gaze=other&&other!==g?Math.max(-.35,Math.min(.35,(other.position.x-g.position.x)*.10)):0;
   poseActor(g,{time:t,pose:a.pose,mood:a.mood,gaze,progress:a.progress,injury:a.injury,bandaged:a.bandaged,speaking:frame.speaking&&key===frame.speaker,voiceTime:frame.lineTime||0});
  }
  if((frame.key==='kingstreet.in'&&(frame.beat>2||frame.beat===2&&frame.lineTime>1.1))||frame.key==='kingstreet.out')tendWound(this.actors.get('MARA'),this.actors.get('ISAIAH'));
  this.crowd.forEach((g,i)=>{const fleeing=frame.key==='kingstreet.in'&&frame.beat>0,scatter=fleeing?Math.min(15,Math.max(0,t-5)*1.6):frame.key==='kingstreet.out'?12:0;g.position.x=-4+i*1.6+Math.sin(t*.75+i)*.35+(i%2?1:-1)*scatter*.6;g.position.z=-9-(i%3)-scatter;g.rotation.y=fleeing?(i%2?-.5:.5):Math.PI;poseActor(g,{time:t+i,pose:fleeing?'run':'listen'});});
  if(this.flashLight)this.flashLight.intensity=!frame.reduced&&frame.key==='kingstreet.in'&&frame.beat===1?Math.max(0,1-(frame.lineTime||0)/.25)*70:0;
  if(this.powder){const shotAge=frame.beat===1?frame.lineTime||0:frame.beat>1?4:0;this.powder.material.opacity=frame.key==='kingstreet.in'&&frame.beat>0?.14*Math.min(1,shotAge*3)*Math.max(0,1-shotAge/9):0;this.powder.position.y=Math.min(1.6,shotAge*.18);this.powder.scale.setScalar(1+Math.min(6,shotAge)*.035);}
  if(this.boat){this.boat.position.y=Math.sin(t*.9)*.035;this.boat.rotation.z=Math.sin(t*.7)*.013;this.oars.forEach((o,i)=>{o.rotation.y=Math.sin(t*1.7)*.18*(i?1:-1);o.rotation.z=Math.sin(t*1.7+1)*.13*(i?1:-1);});}
  if(this.waterMesh){const a=this.waterMesh.geometry.attributes.position;for(let i=0;i<a.count;i++)a.setY(i,Math.sin(a.getX(i)*.33+t*.8)*.052+Math.cos(a.getZ(i)*.4+t*.65)*.04);a.needsUpdate=true;}
  if(this.wheel)this.wheel.rotation.z=t*1.6;if(this.shuttle)this.shuttle.position.x=Math.sin(t*3)*.28;if(this.pressLever)this.pressLever.rotation.y=Math.sin(t*.7)*.25;
  this.flames.forEach((f,i)=>{f.material.uniforms.time.value=t;f.rotation.y=Math.atan2(this.camera.position.x-f.position.x,this.camera.position.z-f.position.z);});this.practicals.forEach((l,i)=>{l.intensity=(spec.theme==='fire'&&i>1?48:13)*(1+Math.sin(t*7+i)*.07);});
  const particles=this.particles.geometry.attributes.position.array;for(let i=0;i<particles.length;i+=3){particles[i+1]+=dt*(spec.theme==='fire'?.7:spec.theme==='snow'?-.55:.045);if(particles[i+1]>9)particles[i+1]=0;if(particles[i+1]<0)particles[i+1]=9;}this.particles.geometry.attributes.position.needsUpdate=true;
  const shot=editorialShot(frame.key,frame.beat||0,frame.lineTime||0,frame.duration||5);if(shot.kind==='detail')for(const g of this.actors.values())g.visible=false;
  const camera=this.framing(shot,frame);this.camera.position.copy(camera.eye);this.camera.lookAt(camera.look);this.camera.fov=camera.fov;this.camera.updateProjectionMatrix();
  const ratio=Math.min(devicePixelRatio||1,1.25),w=Math.floor(innerWidth*ratio),h=Math.floor(innerHeight*ratio);if(this.target.width!==w||this.target.height!==h)this.target.setSize(w,h);
  this.post.uniforms.resolution.value.set(w,h);this.post.uniforms.focus.value=camera.eye.distanceTo(camera.look);this.post.uniforms.time.value=t;this.post.uniforms.reduced.value=frame.reduced?1:0;this.post.uniforms.fade.value=smooth(t/.75);
  this.renderer.setRenderTarget(this.target);this.renderer.render(this.scene,this.camera);this.renderer.setRenderTarget(null);this.renderer.render(this.postScene,this.postCamera);
  return {shot:shot.kind,part:shot.part,renderMs:performance.now()-renderStarted};
 }
 dispose(){if(this.scene)disposeTree(this.scene,Object.values(this.textures));this.scene=null;this.target.dispose();this.target.depthTexture?.dispose();disposeTree(this.postScene);}
}
