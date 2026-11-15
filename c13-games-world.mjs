import * as T from './three.module.js';
import {createPerson,animatePerson} from './c13-people.mjs?v=8.5.0';
import {MATERIAL_ASSETS} from './c13-material-assets.mjs?v=8.5.0';
import {CinematicFX} from './c13-cinema-fx.mjs?v=8.5.0';

const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const rand=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453123;return v-Math.floor(v);};
const lerp=(a,b,t)=>a+(b-a)*t;

// Local geometry and bundled photographed surfaces, with procedural fallbacks.
// The quiet scene is also the mission-select background.
export class ReformWorld {
 constructor(canvas,game){
  this.canvas=canvas;this.game=game;this.mode=game.mode;this.geometries=new Map();this.materials=new Map();this.textures=[];this.entityViews=new Map();this.entityPools=new Map();this.actorBatches=[];this.actors=[];this.dynamic=[];this.wheels=[];this.gameMarks=[];this.fx=[];this.clock=0;this.lastTime=null;this.disposed=false;
  this.performance={calls:0,triangles:0,cpuMs:0,quality:'pbr'};this.assetState={pending:0,loaded:0,failed:0,total:0};this.ready=new Promise(resolve=>this.resolveAssets=resolve);this.quality=game.visualQuality||((globalThis.innerWidth||1280)<700?'balanced':'detailed');this.surfaceMaps={};this.travelElements=[];this.travelBatches=[];
  this.scene=new T.Scene();
  const sky=this.mode==='assembly'?0x9aa6a5:this.mode==='press'?0xa4aaa4:0x787b70;
  this.scene.background=new T.Color(sky);this.scene.fog=new T.Fog(sky,48,120);
  this.renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
  this.renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio||1,1.35));this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=this.mode==='convention'?1.08:1.02;
  this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFSoftShadowMap;
  this.camera=new T.PerspectiveCamera(51,1,.1,170);
  this.scene.add(new T.HemisphereLight(this.mode==='convention'?0xc6c8bc:0xc9d6dc,0x403c31,this.mode==='convention'?.25:.34));
  this.sun=new T.DirectionalLight(this.mode==='press'?0xffddb0:0xffe0af,this.mode==='convention'?2.0:2.8);this.sun.position.set(-11,10,7);this.sun.target.position.set(0,0,-3);this.sun.castShadow=true;this.sun.shadow.mapSize.set(1536,1536);Object.assign(this.sun.shadow.camera,{left:-12,right:12,top:11,bottom:-11,near:1,far:60});this.sun.shadow.bias=-.00015;this.sun.shadow.normalBias=.018;this.sun.shadow.radius=2.4;this.scene.add(this.sun,this.sun.target);
  const fill=new T.DirectionalLight(0xb8cbd8,.14);fill.position.set(12,8,3);this.scene.add(fill);
  this.makeEnvironmentLight();this.makeSky();
  this.land=this.group();this.cast=this.group();this.entityRoot=this.group();this.film=this.group();this.film.userData.dynamic=true;this.entityRoot.userData.dynamic=true;
  this.tex={wood:this.surface('wood'),brick:this.surface('brick'),stone:this.surface('stone'),plaster:this.surface('plaster'),shadow:this.softTexture(),glow:this.softTexture(true)};
  if(this.mode==='assembly')this.workshop();else if(this.mode==='press')this.street();else this.hall();
  this.hero=this.actor(0,1,{coat:0x466a66,dress:true,skin:0x9e684b,bonnet:true,hero:true},this.cast);
  this.other=this.actor(3,-2,{coat:0x785b47,skin:0xc18d66,hat:false,dress:this.mode==='convention',bonnet:this.mode==='convention',shadowCaster:true},this.cast);
  this.other.userData.carry.visible=this.mode==='press';
  this.makeCraftTools();this.makeDust();
  if(this.mode==='convention'){const pool=[];for(let i=0;i<2;i++){const a=this.entityView({kind:'attendee'});a.visible=false;this.entityRoot.remove(a);pool.push(a);}this.entityPools.set('attendee',pool);}
  this.batchStatic(this.land);this.batchStatic(this.film);this.batchStatic(this.cast);
  this.batchTravel();this.batchActors();
  this.cinematicFX=new CinematicFX(this.renderer);this.loadSurfaceAssets();this.setQuality(this.quality,true);
 }
 group(x=0,y=0,z=0,parent=this.land||this.scene){const g=new T.Group();g.position.set(x,y,z);parent.add(g);return g;}
 geo(kind,args){const key=kind+args.join(',');if(!this.geometries.has(key)){const types={box:T.BoxGeometry,cyl:T.CylinderGeometry,sphere:T.SphereGeometry,plane:T.PlaneGeometry,torus:T.TorusGeometry,cone:T.ConeGeometry,ring:T.RingGeometry};this.geometries.set(key,new types[kind](...args));}return this.geometries.get(key);}
 softBox(w,h,d,color,x=0,y=0,z=0,parent=this.land,extra={}){const radius=Math.min(.024,h*.22,d*.15,w*.12),key='softbox:'+w+','+h+','+d;let geo=this.geometries.get(key);if(!geo){const a=w/2-radius,b=h/2-radius,shape=new T.Shape();shape.moveTo(-a,-b);shape.lineTo(a,-b);shape.lineTo(a,b);shape.lineTo(-a,b);shape.closePath();geo=new T.ExtrudeGeometry(shape,{depth:Math.max(.01,d-radius*2),bevelEnabled:true,bevelThickness:radius,bevelSize:radius,bevelSegments:2,steps:1,curveSegments:1});geo.translate(0,0,-d/2+radius);const uv=geo.attributes.uv,size=extra.map?.userData?.surfaceKind?MATERIAL_ASSETS[extra.map.userData.surfaceKind]?.physicalSize||2:1;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)/size,uv.getY(i)/size);this.geometries.set(key,geo);}const mesh=new T.Mesh(geo,this.mat(color,extra));mesh.position.set(x,y,z);mesh.receiveShadow=true;parent.add(mesh);return mesh;}
 makeSky(){const geo=new T.SphereGeometry(125,32,18),mat=new T.ShaderMaterial({side:T.BackSide,depthWrite:false,uniforms:{top:{value:new T.Color(0x718d9e)},horizon:{value:new T.Color(0xd0c9b6)},ground:{value:new T.Color(0x858776)}},vertexShader:'varying vec3 direction; void main(){ direction=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',fragmentShader:'uniform vec3 top,horizon,ground; varying vec3 direction; void main(){ float y=normalize(direction).y; vec3 sky=mix(horizon,top,smoothstep(0.0,0.75,y)); sky=mix(ground,sky,smoothstep(-0.12,0.05,y)); gl_FragColor=vec4(sky,1.0);\n #include <tonemapping_fragment>\n #include <colorspace_fragment>\n }'});this.geometries.set('sky',geo);this.materials.set('sky',mat);const dome=new T.Mesh(geo,mat);dome.renderOrder=-20;dome.frustumCulled=false;this.scene.add(dome);}
 mat(color,extra={}){const serial={};for(const [k,v] of Object.entries(extra))serial[k]=v?.isTexture?v.uuid:v?.isVector2?[v.x,v.y]:v;const key=`${color}|${JSON.stringify(serial)}`;if(!this.materials.has(key)){const kind=extra.map?.userData?.surfaceKind,options={color,roughness:.78,metalness:0,envMapIntensity:.26,...extra};if(kind){options.color=new T.Color(color).lerp(new T.Color(0xffffff),kind==='brick'?.62:.54);options.roughness=kind==='stone'?.72:kind==='wood'?.83:.94;options.bumpMap=extra.map;options.bumpScale=kind==='stone'?.07:.025;}const material=new T.MeshStandardMaterial(options);material.userData.surfaceKind=kind;if(kind&&this.surfaceMaps[kind])this.applySurface(material,this.surfaceMaps[kind]);this.materials.set(key,material);}return this.materials.get(key);}
 makeEnvironmentLight(){const cv=document.createElement('canvas');cv.width=256;cv.height=128;const g=cv.getContext('2d'),gradient=g.createLinearGradient(0,0,0,128);gradient.addColorStop(0,'#738b96');gradient.addColorStop(.48,'#aeb3a5');gradient.addColorStop(.62,'#746c58');gradient.addColorStop(1,'#40392e');g.fillStyle=gradient;g.fillRect(0,0,256,128);g.fillStyle='#fff1d2';g.fillRect(150,30,16,14);const texture=new T.CanvasTexture(cv);texture.mapping=T.EquirectangularReflectionMapping;texture.colorSpace=T.SRGBColorSpace;const pmrem=new T.PMREMGenerator(this.renderer);this.environmentTarget=pmrem.fromEquirectangular(texture);this.scene.environment=this.environmentTarget.texture;pmrem.dispose();texture.dispose();}
 applySurface(material,maps){if(maps.albedo){material.map=maps.albedo;material.bumpMap=null;}if(maps.normal){material.normalMap=maps.normal;material.normalScale=new T.Vector2(MATERIAL_ASSETS[material.userData.surfaceKind]?.normalScale??.35,MATERIAL_ASSETS[material.userData.surfaceKind]?.normalScale??.35);}if(maps.roughness)material.roughnessMap=maps.roughness;material.needsUpdate=true;}
 loadSurfaceAssets(){const loader=new T.TextureLoader();for(const [kind,asset] of Object.entries(MATERIAL_ASSETS)){const maps=this.surfaceMaps[kind]||{};this.surfaceMaps[kind]=maps;for(const slot of ['albedo','normal','roughness']){if(!asset[slot])continue;this.assetState.pending++;this.assetState.total++;loader.load(new URL(asset[slot],import.meta.url).href,texture=>{if(this.disposed){texture.dispose();return;}texture.colorSpace=slot==='albedo'?T.SRGBColorSpace:T.NoColorSpace;texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.repeat.set(1,1);texture.anisotropy=Math.min(4,this.renderer.capabilities.getMaxAnisotropy());texture.userData.surfaceKind=kind;this.textures.push(texture);maps[slot]=texture;this.assetState.loaded++;this.assetState.pending--;for(const material of this.materials.values())if(material.userData?.surfaceKind===kind)this.applySurface(material,maps);if(!this.assetState.pending)this.resolveAssets?.({...this.assetState});},undefined,()=>{if(this.disposed)return;this.assetState.failed++;this.assetState.pending--;if(!this.assetState.pending)this.resolveAssets?.({...this.assetState});});}}}
 mesh(kind,args,color,x=0,y=0,z=0,parent=this.land,extra={}){const material=color?.isMaterial?color:this.mat(color,extra),surface=material.userData?.surfaceKind;let geometry=this.geo(kind,args);if(kind==='box'&&surface){const size=MATERIAL_ASSETS[surface]?.physicalSize||2,key='worldUV:'+surface+':'+args.join(',');if(!this.geometries.has(key)){const clone=geometry.clone(),uv=clone.attributes.uv,[w,h,d]=args,faces=[[d,h],[d,h],[w,d],[w,d],[w,h],[w,h]];for(let i=0;i<uv.count;i++){const [a,b]=faces[Math.floor(i/4)];uv.setXY(i,uv.getX(i)*a/size,uv.getY(i)*b/size);}this.geometries.set(key,clone);}geometry=this.geometries.get(key);}const m=new T.Mesh(geometry,material);m.position.set(x,y,z);m.receiveShadow=true;parent.add(m);return m;}
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
  const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(kind==='brick'?2:kind==='stone'?5:2,kind==='wood'?3:kind==='stone'?10:2);t.anisotropy=2;t.userData.surfaceKind=kind;this.textures.push(t);return t;
 }
 softTexture(glow=false){const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d'),r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,glow?'#fff0c8ff':'#000000bb');r.addColorStop(.4,glow?'#ffe5a966':'#00000077');r.addColorStop(1,'#00000000');g.fillStyle=r;g.fillRect(0,0,64,64);const t=new T.CanvasTexture(c);this.textures.push(t);return t;}
 contact(x,z,w=1.2,d=.7,parent=this.land,opacity=.35){const m=this.mesh('plane',[w,d],0x1e221d,x,.018,z,parent,{map:this.tex.shadow,transparent:true,opacity,depthWrite:false});m.rotation.x=-Math.PI/2;return m;}
 printSurface(lines,{width=512,height=640,ink='#242b28',paper='#d9c8a4',border=true}={}){const c=document.createElement('canvas');c.width=width;c.height=height;const g=c.getContext('2d');g.fillStyle=paper;g.fillRect(0,0,width,height);for(let i=0;i<900;i++){g.fillStyle=i%2?'#fff8db0b':'#47331b0b';g.fillRect(rand(i+5)*width,rand(i+67)*height,rand(i+73)*4+1,1);}g.fillStyle=ink;g.strokeStyle=ink;if(border){g.lineWidth=3;g.strokeRect(16,16,width-32,height-32);g.lineWidth=1;g.strokeRect(23,23,width-46,height-46);}let yy=height*.14;for(let i=0;i<lines.length;i++){const line=lines[i];g.font=`${i===0?'bold ':''}${i===0?width*.085:width*.047}px Georgia`;g.textAlign='center';g.fillText(line,width/2,yy,width*.86);yy+=i===0?height*.11:height*.072;}g.fillStyle=ink;for(let col=0;col<2;col++)for(let j=0;j<11;j++){g.globalAlpha=.4+rand(j+col)*.3;g.fillRect(width*(.09+col*.45),height*.61+j*height*.022,width*.36*(.55+rand(j)*.45),1.6);}g.globalAlpha=1;const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;this.textures.push(t);return t;}
 placard(lines,x,y,z,w=2,h=2.4,parent=this.land,{rotate=0,paper='#d9c8a4',border=true}={}){const g=this.group(x,y,z,parent);g.rotation.y=rotate;this.box(w+.08,h+.08,.07,0x66523c,0,0,-.055,g);this.mesh('plane',[w,h],0xffffff,0,0,0,g,{map:this.printSurface(lines,{paper,border}),side:T.DoubleSide});if(this.mode==='press'&&parent===this.land){if(x<0&&z>-10)g.userData.printshopOccluder=true;this.batchStatic(g);this.registerTravel(g,z,96);}return g;}
 sheet(x,y,z,w=.55,h=.74,parent=this.land,headline='PETITION'){const g=this.group(x,y,z,parent);const m=this.mesh('plane',[w,h],0xffffff,0,0,0,g,{map:this.printSurface([headline,'Equal rights',''],{width:256,height:320,border:false}),side:T.DoubleSide});m.rotation.x=-Math.PI/2;return g;}
 barrel(x,z,scale=1,parent=this.land){const g=this.group(x,0,z,parent);g.scale.setScalar(scale);this.mesh('cyl',[.44,.36,1.05,12],0x7d603c,0,.55,0,g);for(const y of [.19,.85])this.mesh('torus',[.39,.037,6,14],0x424641,0,y,0,g).rotation.x=Math.PI/2;this.cyl(.34,.04,0x9c7d53,0,1.09,0,g);this.contact(0,0,.95,.8,g,.35);if(this.mode==='press'&&parent===this.land){if(x<0&&z>-10)g.userData.printshopOccluder=true;this.batchStatic(g);this.registerTravel(g,z,96);}return g;}
 crate(x,y,z,w=1,parent=this.land){const g=this.group(x,y,z,parent);this.box(w,w*.7,w*.8,0x8e7049,0,w*.35,0,g,{map:this.tex.wood});for(const a of [-1,1]){this.box(.07,w*.7,w*.83,0x5d4b32,a*w*.42,w*.35,0,g);this.box(w,.075,w*.83,0x5d4b32,0,w*(a<0?.08:.62),0,g);}this.beam([-w*.43,.08,w*.42],[w*.43,w*.62,w*.42],.06,0x594936,g);if(this.mode==='press'&&parent===this.land){if(x<0&&z>-10)g.userData.printshopOccluder=true;this.batchStatic(g);this.registerTravel(g,z,96);}return g;}
 table(x,z,{width=2.4,depth=1.2,height=1.05,color=0x947149}={},parent=this.land){const g=this.group(x,0,z,parent);this.softBox(width,.15,depth,color,0,height,0,g,{map:this.tex.wood});for(const xx of [-width*.4,width*.4])for(const zz of [-depth*.36,depth*.36])this.box(.13,height,.13,0x624c32,xx,height*.48,zz,g);this.box(width*.78,.12,.12,0x705335,0,.28,0,g);this.contact(0,0,width,depth,g,.3);return g;}
 chair(x,z,rotation=0,parent=this.land){const g=this.group(x,0,z,parent);g.rotation.y=rotation;this.box(.65,.12,.64,0x806443,0,.56,0,g);for(const a of [-1,1]){this.box(.07,1.28,.08,0x5f4a34,a*.27,.67,-.26,g);this.box(.07,.52,.08,0x5f4a34,a*.27,.25,.25,g);}for(const y of [.86,1.12])this.box(.6,.12,.065,0x846642,0,y,-.27,g);this.contact(0,0,.8,.65,g,.27);return g;}
 tree(x,z,scale=1){const g=this.group(x,0,z);g.scale.setScalar(scale);this.mesh('cyl',[.12,.32,5.6,14],0x675d47,0,2.6,0,g);for(let i=0;i<9;i++){const a=i*2.399,yy=2.6+i*.29,r=1.4+rand(i+12)*.8;this.beam([0,yy,0],[Math.sin(a)*r,yy+1.1,Math.cos(a)*r],.075,0x6a604a,g);}if(!this.leafTexture){const cv=document.createElement('canvas');cv.width=cv.height=256;const c=cv.getContext('2d');for(let i=0;i<110;i++){const a=rand(i+5)*Math.PI*2,r=Math.sqrt(rand(i+8))*112,xx=128+Math.cos(a)*r,yy=128+Math.sin(a)*r;c.save();c.translate(xx,yy);c.rotate(a);c.fillStyle=['#53644b','#71815b','#7c895b','#657550'][i%4];c.beginPath();c.ellipse(0,0,4+rand(i+9)*8,2+rand(i+22)*4,0,0,Math.PI*2);c.fill();c.restore();}this.leafTexture=new T.CanvasTexture(cv);this.leafTexture.colorSpace=T.SRGBColorSpace;this.textures.push(this.leafTexture);}const leaf=this.mat(0xb7bf9a,{map:this.leafTexture,alphaTest:.4,side:T.DoubleSide,roughness:.96});for(let i=0;i<44;i++){const a=i*2.399,rr=Math.sqrt(rand(i+12))*2.4,leafCard=this.mesh('plane',[2.3,2.3],leaf,Math.sin(a)*rr,4.7+rand(i+5)*2.1,Math.cos(a)*rr,g);leafCard.rotation.set((rand(i+7)-.5)*2,rand(i)*6,(rand(i+44)-.5)*1.4);}return g;}
 roof(w,d,rise,parent){const key='roof:'+w+','+d+','+rise;let geometry=this.geometries.get(key);if(!geometry){const x=w/2,z=d/2,positions=[-x,0,-z,x,0,-z,-x,rise,0,x,rise,0,-x,0,z,x,0,z],indices=[0,2,1,1,2,3,2,4,3,3,4,5,0,4,2,1,3,5];geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setIndex(indices);const flat=geometry.toNonIndexed();geometry.dispose();geometry=flat;geometry.computeVertexNormals();this.geometries.set(key,geometry);}const mesh=new T.Mesh(geometry,this.mat(0x3b4542,{roughness:.96}));mesh.receiveShadow=true;parent.add(mesh);return mesh;}
 building(x,z,w=8,h=10,d=9,color=0x95745d,turn=0,parent=this.land){
  const g=this.group(x,0,z,parent),style=(Math.round(-z/16)+(x>0?1:0))%3;g.rotation.y=turn;
  const mass=this.box(w,h,d,color,0,h/2,0,g,{map:this.tex.brick});mass.castShadow=true;
  this.box(w+.22,.28,d+.2,0x827d6b,0,.18,0,g);this.box(w+.3,.18,d+.3,0x6e6c5a,0,h-.15,0,g);this.box(w+.55,.18,d+.55,0x8f8a75,0,h+.02,0,g);
  const roof=this.roof(w+.9,d+1.0,style===1?1.9:1.45,g);roof.position.y=h+.08;
  for(const y of [3.4,h-1.25])this.box(w+.1,.095,d+.12,0x9a947e,0,y,0,g);
  const columns=style===1?[-w*.28,w*.28]:[-w*.32,0,w*.32];
  for(const xx of columns)for(let yy=2.25;yy<h-1;yy+=2.6){
   if(yy<3.0&&Math.abs(xx)<.5)continue;
   const trim=style===2?0x797e6b:0xaaa18a;this.box(1.17,1.85,.15,0x343d36,xx,yy,d/2+.03,g);this.box(.92,1.57,.07,0x26352e,xx,yy,d/2+.12,g,{roughness:.34,metalness:.08,envMapIntensity:.6});
   for(const side of [-1,1])this.box(.09,1.88,.23,trim,xx+side*.55,yy,d/2+.19,g);
   this.box(.055,1.65,.18,trim,xx,yy,d/2+.23,g);this.box(1.1,.065,.21,trim,xx,yy,d/2+.24,g);this.box(1.32,.13,.34,0x938b77,xx,yy-.94,d/2+.12,g);this.box(1.25,.12,.29,0xaca18a,xx,yy+.96,d/2+.11,g);
   if(style===1&&yy>3)for(const side of [-1,1]){const shutter=this.group(xx+side*.95,yy,d/2+.2,g);shutter.rotation.y=side*.12;this.box(.54,1.83,.065,0x3e5146,0,0,0,shutter);for(const y of [-.65,0,.65])this.box(.52,.055,.09,0x66725e,0,y,.02,shutter);}
  }
  this.box(1.75,2.72,.19,0x282c25,0,1.36,d/2+.13,g);this.softBox(1.48,2.48,.12,style===2?0x684e38:0x3b5043,0,1.27,d/2+.27,g,{roughness:.82});for(const xx of [-.38,.38])for(const yy of [.64,1.55])this.box(.47,.58,.03,style===2?0x785b40:0x4f6050,xx,yy,d/2+.35,g);this.sphere(.034,0x95815b,.51,1.16,d/2+.39,g);
  this.softBox(2.15,.16,.85,0x9b998b,0,.04,d/2+.38,g);this.box(1.9,.16,.46,0x797b6c,0,2.8,d/2+.27,g);
  if(style===0){for(const side of [-1,1]){const hood=this.box(2.5,.12,.9,0x526354,side*3.1,3.12,d/2+.39,g);hood.rotation.x=-.11;for(const xx of [-.98,.98])this.beam([side*3.1+xx,2.5,d/2+.12],[side*3.1+xx,3.08,d/2+.75],.055,0x4b5849,g);}}
  this.box(.85,1.7,.75,0x6e6551,w*.25,h+.9,0,g,{map:this.tex.brick});this.box(1.0,.16,.9,0x4b5145,w*.25,h+1.8,0,g);
  if(Math.abs(x)>3&&this.mode==='press'&&parent===this.land){g.userData.dynamic=true;this.batchStatic(g);this.travelElements.push({group:g,z,span:96});}return g;
 }

 lantern(x,z,parent=this.land){const g=this.group(x,0,z,parent);this.cyl(.06,3.5,0x343d39,0,1.75,0,g);this.box(.62,.07,.48,0x333c37,0,3.65,0,g);this.box(.4,.62,.35,0xd4b67b,0,3.25,0,g);for(const a of [-1,1])this.box(.04,.65,.39,0x303a34,a*.23,3.25,0,g);if(this.mode==='press'&&parent===this.land){if(x<0&&z>-8)g.userData.printshopOccluder=true;this.batchStatic(g);this.registerTravel(g,z,144);}return g;}
 actor(x,z,options={},parent=this.cast){return createPerson(this,x,z,options,parent);}
 animateActor(actor,time,options={}){animatePerson(actor,time,options);}
 workshopBoundary(){
  const wall=(w,h,d,x,y,z)=>{const mesh=this.box(w,h,d,0xaaa48e,x,y,z,this.land,{map:this.tex.plaster});mesh.castShadow=true;return mesh;};
  wall(17,1.8,.30,0,.9,-7.8);wall(17,1.6,.30,0,5.0,-7.8);for(const [x,w] of [[-7.63,1.74],[0,8.8],[7.63,1.74]])wall(w,2.4,.30,x,3.0,-7.8);
  this.box(17,1.2,.34,0x675940,0,.60,-7.61,this.land,{map:this.tex.wood});
  const glazing={transparent:true,opacity:.17,roughness:.22,metalness:0,envMapIntensity:.9,side:T.DoubleSide,depthWrite:false};
  for(const x of [-5.6,5.6]){this.mesh('plane',[2.12,2.4],0xa7b2aa,x,3.0,-7.79,this.land,glazing);for(const dx of [-1.10,0,1.10])this.box(.075,2.57,.18,0x6f654c,x+dx,3.0,-7.58);for(const y of [1.77,3.0,4.23])this.box(2.26,.075,.20,0x6f654c,x,y,-7.57);this.box(2.35,.12,.45,0x847454,x,1.74,-7.48);}
  for(const side of [-1,1]){
   wall(.24,1.8,18.2,side*8.5,.9,1.0);wall(.24,1.8,18.2,side*8.5,4.9,1.0);for(const [z,d] of [[-6.45,3.1],[0,4.2],[7.45,5.1]])wall(.24,2.2,d,side*8.5,2.9,z);
   this.box(.30,1.2,18.2,0x675940,side*8.47,.6,1.0,this.land,{map:this.tex.wood});for(const z of [-3.5,3.5]){const glass=this.mesh('plane',[2.8,2.2],0xa7b2aa,side*8.49,2.9,z,this.land,glazing);glass.rotation.y=side*Math.PI/2;for(const dz of [-1.43,0,1.43])this.box(.18,2.35,.075,0x6f654c,side*8.36,2.9,z+dz);for(const y of [1.77,2.9,4.04])this.box(.20,.075,2.93,0x6f654c,side*8.35,y,z);}
  }
  wall(17,2.4,.26,0,4.6,10.1);for(const side of [-1,1])wall(7.2,3.4,.26,side*4.9,1.7,10.1);for(const x of [-1.28,1.28])this.box(.15,3.5,.32,0x62553d,x,1.75,9.97);this.box(2.7,.16,.32,0x62553d,0,3.5,9.97);
  const ceiling=this.box(17.1,.16,18.2,0x5a543f,0,5.82,1.0,this.land,{map:this.tex.wood});ceiling.castShadow=false;
 }
 bowl(x,y,z,parent){const key='hollow-work-bowl';let geo=this.geometries.get(key);if(!geo){const profile=[[0,0],[.10,0],[.19,.04],[.24,.14],[.24,.18],[.215,.18],[.212,.145],[.17,.07],[.08,.035],[0,.035]].map(([r,h])=>new T.Vector2(r,h));geo=new T.LatheGeometry(profile,24);this.geometries.set(key,geo);}const bowl=new T.Mesh(geo,this.mat(0x735e43,{roughness:.95,side:T.DoubleSide}));bowl.position.set(x,y,z);bowl.receiveShadow=true;parent.add(bowl);return bowl;}
 workshop(){
  this.box(60,.3,40,0x6d775c,0,-.22,-28);for(let i=0;i<8;i++)this.tree((i%2?-1:1)*(12+rand(i)*9),-7-i*4,.8+rand(i+4)*.7);
  this.box(17,.25,18.2,0x92714d,0,-.125,1.0,this.land,{map:this.tex.wood});
  this.workshopBoundary();
  for(const x of [-7.9,-4,4,7.9]){this.box(.25,5.9,.28,0x66543a,x,2.9,-7.4);if(Math.abs(x)>7)this.box(.23,5.5,.23,0x675339,x,2.7,4.7);}this.box(17,.28,.3,0x6c5639,0,5.5,4.7);this.box(17,.3,3,0x454d3c,0,5.8,-6.5);for(const x of [-8,-4,0,4,8])this.box(.18,.18,12,0x675239,x,5.5,-1);

  this.box(2.1,3.2,.23,0x6e6752,0,1.6,-7.45,this.land,{map:this.tex.wood});this.box(.09,3.15,.27,0x453d2d,0,1.6,-7.26);this.box(2.2,.1,.28,0x49442f,0,3.2,-7.26);
  this.benchProps=[];for(const [lane,x] of [-4,0,4].entries()){
   const bench=this.table(x,-1,{width:2.55,depth:1.35,height:1.03,color:lane===2?0x715b41:0x886e4b});
   const iron={metalness:.68,roughness:.58};
   if(lane===0){for(const side of [-1,1])this.softBox(.88,.085,.13,0xb49260,0,1.1475,side*.23,bench,{map:this.tex.wood});for(const xx of [-.37,.37])this.softBox(.13,.085,.45,0x97774b,xx,1.1475,0,bench,{map:this.tex.wood});this.box(.16,.27,.22,0x343d39,-1.06,1.04,.43,bench,iron);this.cyl(.035,.42,0x444d48,-1.06,1.01,.56,bench).rotation.z=Math.PI/2;for(const xx of [-.58,.5])this.cyl(.018,.018,0x403d32,xx,1.12,.44,bench,8);}
   else if(lane===1){this.bowl(0,1.105,-.04,bench);this.cyl(.19,.34,0x666d5c,-.79,1.28,-.16,bench,18);this.mesh('torus',[.12,.032,8,16],0x666d5c,-.99,1.30,-.16,bench).rotation.y=Math.PI/2;for(let i=0;i<3;i++){const loaf=this.sphere(.14,0xb38c50,.65+i*.15,1.17,.05+i*.1,bench);loaf.scale.set(1,.5,.7);}this.softBox(.60,.025,.49,0xbaa67e,.67,1.12,.06,bench,{roughness:1});}
   else{for(let i=0;i<3;i++){const book=this.group(-.55,1.134+i*.075,-.12,bench);book.rotation.y=(i-1)*.045;this.softBox(.50,.055,.37,0xbca983,0,0,0,book);this.box(.54,.012,.40,i%2?0x4b6159:0x6c4d39,0,.035,0,book);}this.box(.6,.028,.45,0xd0c09c,.25,1.12,.07,bench);for(let i=0;i<3;i++)this.box(.012,.002,.42,0x635543,.08+i*.1,1.137,.07,bench);this.mesh('cyl',[.105,.105,.50,18],0x9b9684,.86,1.210,-.2,bench).rotation.z=Math.PI/2;}
   const tool=this.group(.84,1.13,.30,bench);tool.userData.dynamic=true;tool.userData.base={y:1.13,z:.30};this.box(.045,.42,.045,0x755937,0,0,0,tool).rotation.z=Math.PI/2;if(lane===0)this.softBox(.12,.10,.24,0x4b5148,-.20,0,0,tool,iron);else if(lane===1){const spoon=this.sphere(.06,0xa18c65,-.20,0,0,tool);spoon.scale.set(1,.2,.65);}else this.box(.13,.025,.025,0x6c736a,-.25,0,0,tool,iron);this.benchProps.push(tool);
  }

  for(const x of [-7,7]){this.barrel(x,-4,.9);this.crate(x,0,2,1.1);}for(let i=0;i<5;i++)this.box(1.2,.15,.4,0x897047,-7.1,.075+i*.15,-1.5,this.land,{map:this.tex.wood});
  this.placard(['BROOK FARM','Labor and learning'],2.6,2.9,-7.28,1.45,.76,this.land,{border:false,paper:'#a99570'});
  this.ambient=[this.actor(-6,-3,{coat:0x877253,dress:false,skin:0xc4936b},this.cast),this.actor(6,-3,{coat:0x687767,dress:true,bonnet:true,skin:0xc99a74},this.cast)];
  this.filmBench=null;this.sheet(-.44,1.107,-.95,.42,.54,this.film,'COOPERATION');this.workshopDetails();
 }
 pressModel(x,z,parent=this.land){
  const g=this.group(x,0,z,parent);g.userData.dynamic=true;const timber={map:this.tex.wood};
  for(const side of [-1,1]){const post=this.box(.23,2.8,.27,0x735c3e,side*1.05,1.4,0,g,timber);post.castShadow=true;this.box(.23,.16,1.65,0x735c3e,side*1.05,.08,0,g,timber).castShadow=true;}
  this.box(2.55,.26,.70,0x735c3e,0,2.65,0,g,timber).castShadow=true;this.softBox(2.2,.19,1.55,0x665338,0,.96,.2,g,timber).castShadow=true;this.box(1.6,.075,1.2,0x343d35,0,1.10,.23,g);
  const screw=this.group(0,1.98,0,g);screw.userData.dynamic=true;this.cyl(.095,1.3,0x515a4d,0,0,0,screw);for(let i=0;i<11;i++)this.mesh('torus',[.108,.021,4,9],0x7a8069,0,-.54+i*.10,0,screw).rotation.x=Math.PI/2;
  const platen=this.box(1.65,.14,1.22,0x343d35,0,1.40,.22,g);const handle=this.group(0,1.45,.08,g);handle.userData.dynamic=true;platen.userData.dynamic=true;this.beam([0,0,0],[1.6,0,.5],.055,0x444f42,handle);this.sphere(.09,0x705a3b,1.6,0,.5,handle);const paper=this.sheet(0,1.140,.35,1.02,.76,g,'THE LIBERATOR');
  this.wheels.push({screw,platen,handle,paper});this.batchStatic(screw);this.batchStatic(handle);this.batchStatic(g);if(this.mode==='press'&&parent===this.land)this.registerTravel(g,z,96);return g;
 }
 printshop(){
  this.film.position.x=-12;const shop=this.group(0,0,0,this.film),plaster={map:this.tex.plaster},wood={map:this.tex.wood};
  this.box(25.55,.12,10.0,0x918c7b,-11.225,-.06,5.5,this.film,{map:this.tex.stone});
  this.building(-9.5,-3.5,10.6,6.2,8,0x91806a,0,this.film);this.building(-20.1,-3.5,10.6,7.5,8,0x827966,0,this.film);
  this.box(8.4,.12,8.0,0x7e6849,0,-.06,-3.5,shop,wood);this.box(8.4,3.7,.24,0xb1a78e,0,1.85,-7.5,shop,plaster);this.box(8.4,.95,.28,0x65573e,0,.475,-7.34,shop,wood);
  for(const side of [-1,1]){this.box(.22,3.7,6.1,0xaaa28a,side*4.2,1.85,-4.45,shop,plaster);this.box(.26,.95,6.1,0x65573e,side*4.16,.475,-4.45,shop,wood);this.box(.22,1.0,1.8,0xaaa28a,side*4.2,3.2,-.5,shop,plaster);for(const z of [-1.4,.4])this.box(.13,3.7,.13,0x67573c,side*4.15,1.85,z,shop,wood);}
  for(const side of [-1,1]){this.box(2.4,.9,.18,0x67573e,side*3.0,.45,.4,shop,wood);this.box(2.4,.34,.18,0xaaa28a,side*3.0,3.53,.4,shop,plaster);for(const x of [side*1.8,side*3.0,side*4.2])this.box(.09,2.55,.13,0x67573c,x,2.13,.37,shop,wood);this.box(2.4,.07,.13,0x67573c,side*3.0,2.12,.37,shop,wood);const glass=this.mesh('plane',[2.25,2.45],0x9faeaa,side*3.0,2.13,.42,shop,{transparent:true,opacity:.1,roughness:.28,side:T.DoubleSide,depthWrite:false});}
  for(const x of [-1.8,1.8])this.box(.16,3.7,.23,0x5c4e35,x,1.85,.4,shop,wood);this.box(8.6,.24,.38,0x5c4e35,0,3.7,.4,shop,wood);this.box(8.6,.14,8.1,0x514e3c,0,3.87,-3.5,shop,wood);
  for(const x of [-2.7,0,2.7])this.box(.12,.17,7.8,0x67573c,x,3.69,-3.5,shop,wood);
  const rack=this.group(-3.15,0,-6.6,shop);for(const y of [.55,1.12,1.69,2.26])this.box(1.55,.08,.48,0x796044,0,y,0,rack,wood);for(const x of [-.77,.77])this.box(.09,2.55,.12,0x5f4e36,x,1.27,0,rack,wood);for(let i=0;i<4;i++)this.box(.55,.10,.35,0xaaa58b,0,.66+i*.57,0,rack);
  this.placard(['PRINTING','Books & tracts'],3.8,2.8,-.35,.74,.92,shop,{rotate:Math.PI/2,border:false,paper:'#a99a79'});
 }

 street(){
  this.box(80,.3,135,0x88816e,0,-.27,-44,this.land,{map:this.tex.stone});this.box(16,.17,110,0xada38a,0,-.085,-32,this.land,{map:this.tex.stone});
  for(const side of [-1,1]){this.box(2.5,.12,106,0x969481,side*9.2,-.06,-32,this.land,{map:this.tex.stone});let cursor=7.8;const widths=side<0?[15.5,16,15,16.5,16,16.5]:[16.5,14.5,17,15.5,16,16];for(let i=0;i<6;i++){const width=widths[i],center=cursor-width*.5,depth=[8,8.6,7.8][(i+(side>0?1:0))%3],building=this.building(side*(10+depth*.5),center,width,[9.4,11.8,10.2,12.5,8.8,11.0][i],depth,[0x8f6b53,0x7e806b,0x8b7059,0x9c8d71][(i+(side>0?2:0))%4],side<0?Math.PI/2:-Math.PI/2);if(side<0&&i===0)building.userData.printshopOccluder=true;cursor-=width+.08;this.lantern(side*8,-4-i*24);}}

  this.building(0,-99,31,15,9,0x877964,0);this.placard(['BOOKS & TRACTS','Printed here'], -9.85,3.3,-7,2.6,1.5,this.land,{rotate:Math.PI/2});
  this.placard(['THE LIBERATOR','1831','Immediate emancipation'], -9.79,1.8,-2,1.1,1.5,this.land,{rotate:Math.PI/2});this.placard(['NORTH STAR','Frederick Douglass','1847'],9.79,2.2,-10,1.15,1.6,this.land,{rotate:-Math.PI/2});
  for(let i=0;i<5;i++){this.barrel((i%2?1:-1)*10.1,-4-i*13,.7+rand(i)*.3);this.crate((i%2?-1:1)*10.1,0,-12-i*14,.85);}
  const awning=this.group(-9,0,-14);this.box(2.3,.14,6.6,0x596c5b,0,3.4,0,awning).rotation.z=-.16;for(const z of [-3,3])this.cyl(.045,3.4,0x424b3f,1,1.7,z,awning);this.batchStatic(awning);this.registerTravel(awning,-14,96);
  this.ambient=[];for(let i=0;i<4;i++)this.ambient.push(this.actor((i%2?1:-1)*8.6,-6-i*9,{coat:[0x626e61,0x7a6550,0x697a7a][i%3],skin:i%2?0xaf7652:0xc69c7d,dress:i%3===0,hat:i%3!==0},this.cast));
  this.filmPress=this.pressModel(0,-3,this.film);const t=this.table(3,-2.7,{width:1.7,depth:1.1},this.film);for(let i=0;i<4;i++)this.sheet(3+rand(i)*.2,1.15+i*.03,-2.7+rand(i+2)*.25,.6,.8,this.film,'TESTIMONY');this.contact(0,-3,3.2,2.2,this.film,.5);this.printshop();this.streetDetails();
 }
 hall(){
  this.box(29,.3,35,0x98876b,0,-.24,-5);this.box(18,.2,21,0xa88b60,0,-.1,-1,this.land,{map:this.tex.wood});
  this.box(18,7,.35,0xb6aa8a,0,3.5,-11.4,this.land,{map:this.tex.plaster});this.box(18,1.7,.42,0x6c5c43,0,.85,-11.15,this.land,{map:this.tex.wood});
  for(const side of [-1,1]){const wall=this.group(side*9,0,-1);this.box(.3,7,21,0xb2a58a,0,3.5,0,wall,{map:this.tex.plaster});this.box(.42,1.7,21,0x6c5c43,-side*.04,.85,0,wall,{map:this.tex.wood});for(let z=-8;z<8;z+=4.4){this.box(.39,3.8,2.0,0x5a5c48,-side*.05,4.05,z,wall);this.box(.43,3.5,1.73,0xc3d0b0,-side*.09,4.05,z,wall);this.box(.49,3.5,.07,0x6b6a52,-side*.1,4.05,z,wall);this.box(.49,.08,1.8,0x6b6a52,-side*.1,4.05,z,wall);this.box(.7,.12,2.25,0x827052,-side*.1,2.1,z,wall);}for(let z=-10;z<10;z+=3.4)this.box(.47,1.8,.07,0x514933,-side*.05,.9,z,wall);}
  for(let z=-10;z<7;z+=4.3){this.box(18,.25,.25,0x65553d,0,6.85,z);this.beam([-9,6.75,z],[-5,5.8,z],.15,0x65553d);this.beam([9,6.75,z],[5,5.8,z],.15,0x65553d);}
  this.box(13,.45,3.7,0x746044,0,.17,-8.1,this.land,{map:this.tex.wood});this.table(0,-8,{width:4.8,depth:1.2,height:1.1});this.chair(-1.2,-9.2,Math.PI);this.chair(1.2,-9.2,Math.PI);
  this.placard(['WOMAN’S RIGHTS','CONVENTION','SENECA FALLS','1848'],0,4.3,-11.1,3.6,2.25,this.land,{paper:'#d7c39b'});
  for(const x of [-4,4])for(const z of [-4,0,3])this.chair(x,z,0);this.table(-4,3,{width:1.8,depth:1.05});this.table(4,3,{width:1.8,depth:1.05});this.chair(-5.8,-8,.25);this.chair(5.8,-8,-.25);
  this.hallChanges=[];const changed=n=>{const g=this.group();g.userData.dynamic=true;g.userData.after=n;this.hallChanges.push(g);return g;};
  this.delegates=[this.actor(-4,-4,{coat:0x536c69,dress:true,skin:0xa46c4c,bonnet:true}),this.actor(4,-4,{coat:0x7c6c51,hat:true,skin:0xc28e67})];this.delegates.forEach((a,i)=>a.userData.after=i+1);
  let g=changed(3);for(let i=0;i<3;i++){this.box(.52,.006,.66,0xbeb297,-4+(i-1)*.025,1.128+i*.006,3+(i-1)*.015,g);this.sheet(-4+(i-1)*.025,1.132+i*.006,3+(i-1)*.015,.52,.66,g,'SENTIMENTS');};
  this.pageStack=g;g=changed(4);this.sheet(4.1,1.127,3,.54,.70,g,'RESOLUTIONS');this.cyl(.07,.16,0x343f38,3.55,1.22,3.2,g);this.beam([3.55,1.24,3.2],[3.7,1.75,3.3],.022,0xe4d8b8,g);this.mesh('cyl',[.12,.2,.4,10],0xa6b5a6,4.55,1.3,3.1,g);
  this.hallDesk=this.group();this.hallDesk.userData.dynamic=true;this.table(0,-5.7,{width:1.65,depth:.78,height:1.0,color:0x685439},this.hallDesk);this.batchStatic(this.hallDesk);
  g=changed(5);this.sheet(0,1.077,-5.7,1.2,.66,g,'DECLARATION OF SENTIMENTS');

  g=changed(6);this.sheet(0,1.177,-8,1.2,.9,g,'DECLARATION');for(const x of [-2,2])this.chair(x,-7.1,Math.PI,g);
  this.rope=this.group();this.rope.userData.dynamic=true;for(const x of [-1.2,1.2]){this.cyl(.055,.82,0x65593e,x,.41,4,this.rope);this.sphere(.085,0x8b784f,x,.87,4,this.rope);}this.ropeGate=this.group(-1.2,0,4,this.rope);this.ropeGate.userData.dynamic=true;this.beam([0,.80,0],[2.4,.80,0],.035,0x8f7950,this.ropeGate);

  this.filmDeclaration=this.table(0,-6,{width:2.6,depth:1.3,height:.97},this.film);this.sheet(0,1.047,-6,1.5,1.1,this.film,'DECLARATION OF SENTIMENTS');this.cyl(.06,.12,0x343e35,.95,1.1,-6.2,this.film);this.beam([.95,1.13,-6.2],[1.15,1.72,-6.1],.019,0xe3d5ad,this.film);this.hallDetails();
 }
 workshopDetails(){
  for(const x of [-4,0,4]){const edge=this.box(2.58,.045,.055,0xc4a170,x,1.1,-.31);edge.castShadow=true;}for(let i=0;i<2;i++){const chip=this.box(.14,.012,.025,0x9f8055,-4.25+i*.30,.009,-.55+i*.14);chip.rotation.y=i*.7;}

  for(let i=0;i<7;i++){const x=-2.1+i*.34;this.box(.14,.72,.12,0x77674e,x,2.75,-7.20);this.box(.055,.42,.035,0x70776f,x,2.26,-7.15,this.land,{roughness:.32,metalness:.65});}
  this.box(3.0,.12,.23,0x726046,-1,3.2,-7.2);
  for(const x of [-5.6,5.6]){const light=this.mesh('plane',[1.7,4.4],0xffe6b8,x-.6,.012,-4.5,this.land,{transparent:true,opacity:.09,depthWrite:false});light.rotation.x=-Math.PI/2;light.rotation.z=-.32;}
  this.clothRoll=this.mesh('cyl',[.18,.18,1.0,22],0x96937f,-6.8,.95,2.1);this.clothRoll.rotation.z=Math.PI/2;

  const shelf=this.group(-6.9,0,-6.2);for(const x of [-.8,.8])this.box(.10,2.55,.13,0x5a4a33,x,1.3,0,shelf);for(const y of [.45,1.2,1.95,2.55])this.softBox(1.8,.10,.56,0x7f6845,0,y,0,shelf,{map:this.tex.wood});
  for(let i=0;i<7;i++){const book=this.softBox(.13,.4+(i%3)*.05,.28,[0x735a40,0x4d6257,0x8c7857][i%3],-.65+i*.19,1.45+(i%3)*.025,-.02,shelf);book.rotation.z=(i%3-1)*.06;}
  this.mesh('torus',[.20,.035,6,18],0x8c7b53,.43,.535,.04,shelf).rotation.x=Math.PI/2;this.mesh('torus',[.22,.035,6,18],0x8c7b53,.43,.605,.04,shelf).rotation.x=Math.PI/2;
  const stove=this.group(6.8,0,-5.7);this.softBox(.92,1.04,.78,0x343c36,0,.72,0,stove,{metalness:.62,roughness:.82});for(const x of [-.32,.32])for(const z of [-.24,.24])this.box(.09,.25,.09,0x30362f,x,.13,z,stove);this.softBox(.58,.43,.065,0x454a3e,0,.77,.43,stove,{metalness:.45,roughness:.9});this.cyl(.10,2.55,0x343c36,.25,2.42,-.16,stove,14);this.mesh('torus',[.21,.025,8,20],0x4c5247,-.10,1.25,0,stove).rotation.x=Math.PI/2;
  this.contact(6.8,-5.7,1.5,1.2,this.land,.5);this.contact(-6.9,-6.2,2.0,.8,this.land,.46);

  for(const g of this.land.children)if(g.isGroup&&Math.abs(g.position.z+1)<.1)g.traverse(o=>{if(!o.isMesh)return;o.geometry.computeBoundingBox();const size=o.geometry.boundingBox.getSize(new T.Vector3());o.castShadow=(size.x>2&&size.z>1)||(size.y>.7&&size.x<.2&&size.z<.2);});
  for(const o of this.land.children){const p=o.geometry?.parameters;if(o.isMesh&&p&&((p.height>4&&p.width<.4)||(p.width>14&&p.height<.4&&p.depth<.4)))o.castShadow=true;}
 }
 streetDetails(){
  for(let i=0;i<7;i++){const shape=new T.Shape();for(let j=0;j<18;j++){const a=j/18*Math.PI*2,rr=.7+rand(i*43+j)*.4,x=Math.cos(a)*rr,z=Math.sin(a)*rr*.43;if(j===0)shape.moveTo(x,z);else shape.lineTo(x,z);}shape.closePath();const geo=new T.ShapeGeometry(shape);this.geometries.set('puddle:'+i,geo);const puddle=new T.Mesh(geo,this.mat(0x4f5e62,{roughness:.12,metalness:.18,transparent:true,opacity:.52,envMapIntensity:1.2,depthWrite:false}));puddle.position.set((rand(i+3)-.5)*11,.014,-7-i*12);puddle.rotation.x=-Math.PI/2;this.land.add(puddle);this.registerTravel(puddle,puddle.position.z,96);}
  for(let i=0;i<4;i++){const curb=this.box(.14,.17,18,0x6b716c,(i%2?1:-1)*7.9,-.085,-5-i*24,this.land,{roughness:.72});this.registerTravel(curb,curb.position.z,96);}
  for(const side of [-1,1]){const light=new T.PointLight(0xffc886,2.2,8,2);light.position.set(side*7.8,3.1,-4);this.scene.add(light);}
  for(const a of this.ambient)a.userData.streetZ=a.position.z;
 }
 hallDetails(){
  for(const side of [-1,1])for(let z=-8;z<7;z+=4.4){for(const y of [.34,1.57])this.box(.50,.065,4.25,0x8a7557,side*8.95,y,z,this.land,{map:this.tex.wood});const bracket=this.group(side*8.5,0,z+1.1);this.box(.08,.6,.11,0x4c4a3c,0,2.4,0,bracket,{metalness:.65,roughness:.4});this.beam([0,2.2,0],[-side*.3,2.2,0],.045,0x5a5848,bracket);this.cyl(.055,.27,0xd8c69c,-side*.3,2.38,0,bracket);const flame=this.mesh('sphere',[.045,8,6],0xffddb0,-side*.3,2.56,0,bracket,{emissive:0xffb95e,emissiveIntensity:3,roughness:.5});flame.scale.set(.65,1.8,.65);}
  for(const side of [-1,1]){const light=new T.PointLight(0xffcf93,3.5,13,2);light.position.set(side*6,3.4,-3);this.scene.add(light);}
  for(const x of [-4,4])for(const z of [-4,0,3])this.contact(x,z,.7,.9,this.land,.18);
  for(const side of [-1,1]){const rack=this.group(side*7.7,0,5.5);this.cyl(.045,1.75,0x5d5139,0,.86,0,rack);for(let i=0;i<3;i++){const a=i*Math.PI*2/3;this.beam([0,.15,0],[Math.sin(a)*.32,.03,Math.cos(a)*.32],.045,0x5d5139,rack);this.beam([0,1.5,0],[Math.sin(a)*.24,1.67,Math.cos(a)*.24],.028,0x5d5139,rack);}}
  for(const side of [-1,1]){this.softBox(.44,.07,.32,0x4f5c4e,side*.9,1.23,-8.05);this.cyl(.045,.12,0x303e36,side*1.7,1.27,-8.12,this.land,12);this.beam([side*1.7,1.29,-8.12],[side*1.85,1.55,-8.04],.012,0xd6c7a4);}
  this.box(12.6,.07,.12,0xb29a70,0,.43,-6.23);
 }
 registerTravel(group,z,span=96){group.userData.dynamic=true;this.travelElements.push({group,z,span});return group;}
 wrapTravel(z,distance,span){let next=z+distance;while(next>18)next-=span;while(next<18-span)next+=span;return next;}
 updateTravel(run){if(this.mode!=='press')return;const distance=(run?.time||0)*7;this.travelDistance=distance;for(const item of this.travelElements)item.group.position.z=this.wrapTravel(item.z,distance,item.span);const offset=-distance/2;for(const texture of Object.values(this.surfaceMaps.stone||{}))if(texture?.isTexture)texture.offset.y=offset;if(!this.surfaceMaps.stone?.albedo)this.tex.stone.offset.y=offset;}
 makeCraftTools(){if(this.mode!=='assembly')return;this.craftTools=[];const hand=this.hero.userData.hands?.[1];if(!hand)return;for(let lane=0;lane<3;lane++){const g=this.group(0,-.08,.02,hand);g.userData.dynamic=true;g.visible=false;this.cyl(.018,.27,0x80633f,0,-.08,0,g,12);if(lane===0)this.softBox(.21,.09,.11,0x6b6e61,0,-.22,0,g,{metalness:.5,roughness:.65});else if(lane===1){const spoon=this.sphere(.055,0x9b8055,0,-.22,0,g);spoon.scale.set(.65,1,.25);}else this.cyl(.008,.15,0x777c70,0,-.24,0,g,8);g.traverse(o=>{if(o.isMesh)o.castShadow=true;});this.craftTools.push(g);}}
 makeDust(){const count=28,positions=new Float32Array(count*3);for(let i=0;i<count;i++){positions[i*3]=(rand(i)-.5)*30;positions[i*3+1]=rand(i+100)*7;positions[i*3+2]=-rand(i+200)*55+8;}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(positions,3));this.geometries.set('dust',geo);const mat=new T.PointsMaterial({color:this.mode==='press'?0xd4bb94:0xe4d1a1,map:this.tex.glow,size:.025,transparent:true,opacity:.09,depthWrite:false});this.materials.set('dust',mat);this.dust=new T.Points(geo,mat);this.scene.add(this.dust);this.dustBase=positions.slice();}
 batchStatic(parent){
  parent.updateMatrixWorld(true);const lists=new Map();parent.traverse(o=>{if(!o.isMesh||o.isSkinnedMesh||Array.isArray(o.material)||o.morphTargetInfluences)return;let p=o;while(p&&p!==parent){if(p.userData.dynamic)return;p=p.parent;}const key=o.material.uuid+'|'+o.castShadow+'|'+o.receiveShadow,rows=lists.get(key)||[];rows.push(o);lists.set(key,rows);});
  const inverse=parent.matrixWorld.clone().invert(),point=new T.Vector3(),normal=new T.Vector3(),local=new T.Matrix4(),instance=new T.Matrix4(),normalMatrix=new T.Matrix3();
  for(const rows of lists.values()){
   if(rows.length<2)continue;const positions=[],normals=[],uvs=[],indices=[];
   for(const node of rows){for(let instanceId=0;instanceId<(node.isInstancedMesh?node.count:1);instanceId++){
    local.copy(inverse).multiply(node.matrixWorld);if(node.isInstancedMesh){node.getMatrixAt(instanceId,instance);local.multiply(instance);}normalMatrix.getNormalMatrix(local);
    const geometry=node.geometry,position=geometry.attributes.position,n=geometry.attributes.normal,uv=geometry.attributes.uv,offset=positions.length/3;
    for(let i=0;i<position.count;i++){point.fromBufferAttribute(position,i).applyMatrix4(local);positions.push(point.x,point.y,point.z);if(n)normal.fromBufferAttribute(n,i).applyNormalMatrix(normalMatrix);else normal.set(0,1,0);normals.push(normal.x,normal.y,normal.z);uvs.push(uv?uv.getX(i):0,uv?uv.getY(i):0);}
    const index=geometry.index;for(let i=0;i<(index?index.count:position.count);i++)indices.push(offset+(index?index.getX(i):i));
   }node.parent.remove(node);if(node.isInstancedMesh)node.dispose();}
   const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('normal',new T.Float32BufferAttribute(normals,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));geometry.setIndex(indices);geometry.computeBoundingSphere();this.geometries.set('static-merge:'+this.geometries.size,geometry);
   const mesh=new T.Mesh(geometry,rows[0].material);mesh.castShadow=rows[0].castShadow;mesh.receiveShadow=rows[0].receiveShadow;parent.add(mesh);
  }
 }

 batchTravel(){
  this.scene.updateMatrixWorld(true);const groups=new Map();this.travelUniform={value:0};this.printshopUniform={value:1};
  for(const item of this.travelElements)item.group.traverse(node=>{if(!node.isMesh||node.isSkinnedMesh||Array.isArray(node.material))return;let p=node;while(p&&p!==item.group){if(p.userData.dynamic)return;p=p.parent;}const key=node.material.uuid+'|'+node.castShadow+'|'+node.receiveShadow,list=groups.get(key)||[];list.push({node,item});groups.set(key,list);});
  const inject=shader=>{shader.uniforms.c13TravelDistance=this.travelUniform;shader.uniforms.c13PrintshopVisible=this.printshopUniform;shader.vertexShader='attribute vec3 c13Travel; uniform float c13TravelDistance; uniform float c13PrintshopVisible;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n float c13Wrapped=mod(c13Travel.x+c13TravelDistance-(18.0-c13Travel.y),c13Travel.y)+(18.0-c13Travel.y); transformed.z+=c13Wrapped-c13Travel.x; transformed.y-=c13Travel.z*c13PrintshopVisible*1000.0;');};
  const depth=new T.MeshDepthMaterial({depthPacking:T.RGBADepthPacking});depth.onBeforeCompile=inject;depth.customProgramCacheKey=()=> 'c13-travel-depth-8.4';this.materials.set('travel-depth',depth);
  const point=new T.Vector3(),normal=new T.Vector3(),normalMatrix=new T.Matrix3(),local=new T.Matrix4(),instance=new T.Matrix4();
  for(const nodes of groups.values()){
   const positions=[],normals=[],uvs=[],travel=[],indices=[];
   for(const {node,item} of nodes){for(let instanceId=0;instanceId<(node.isInstancedMesh?node.count:1);instanceId++){
    local.copy(node.matrixWorld);if(node.isInstancedMesh){node.getMatrixAt(instanceId,instance);local.multiply(instance);}normalMatrix.getNormalMatrix(local);
    const geo=node.geometry,p=geo.attributes.position,n=geo.attributes.normal,uv=geo.attributes.uv,offset=positions.length/3;
    for(let i=0;i<p.count;i++){point.fromBufferAttribute(p,i).applyMatrix4(local);positions.push(point.x,point.y,point.z);if(n)normal.fromBufferAttribute(n,i).applyNormalMatrix(normalMatrix);else normal.set(0,1,0);normals.push(normal.x,normal.y,normal.z);uvs.push(uv?uv.getX(i):0,uv?uv.getY(i):0);travel.push(item.z,item.span,item.group.userData.printshopOccluder?1:0);}
    const index=geo.index;for(let i=0;i<(index?index.count:p.count);i++)indices.push(offset+(index?index.getX(i):i));
   }node.visible=false;}
   const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('normal',new T.Float32BufferAttribute(normals,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));geometry.setAttribute('c13Travel',new T.Float32BufferAttribute(travel,3));geometry.setIndex(indices);this.geometries.set('street-merge:'+this.geometries.size,geometry);
   const first=nodes[0].node,material=first.material.clone();material.onBeforeCompile=inject;material.customProgramCacheKey=()=> 'c13-travel-8.4';this.materials.set('travel:'+material.uuid,material);
   const mesh=new T.Mesh(geometry,material);mesh.frustumCulled=false;mesh.castShadow=first.castShadow;mesh.receiveShadow=first.receiveShadow;mesh.customDepthMaterial=depth;this.scene.add(mesh);this.travelBatches.push({mesh});
  }
  this.syncTravel();
 }
 syncTravel(){if(this.travelUniform)this.travelUniform.value=this.travelDistance||0;if(this.printshopUniform)this.printshopUniform.value=this.film.visible?1:0;}

 batchActors(){this.scene.updateMatrixWorld(true);const groups=new Map();for(const actor of this.actors)actor.traverse(o=>{if(!o.isMesh||o.isSkinnedMesh||Array.isArray(o.material)||o.morphTargetInfluences||o.userData.noInstance)return;const key=o.geometry.uuid+'|'+o.material.uuid+'|'+o.castShadow,rows=groups.get(key)||[];rows.push(o);groups.set(key,rows);});for(const rows of groups.values())if(rows.length>=2){const mesh=new T.InstancedMesh(rows[0].geometry,rows[0].material,rows.length);mesh.frustumCulled=false;mesh.castShadow=rows[0].castShadow;mesh.receiveShadow=true;this.scene.add(mesh);rows.forEach(o=>o.visible=false);this.actorBatches.push({mesh,rows});}}
 syncActors(){this.scene.updateMatrixWorld(true);const hidden=new T.Matrix4().makeScale(0,0,0);for(const b of this.actorBatches){let any=false;b.rows.forEach((node,i)=>{let p=node.parent,visible=true;while(p&&p!==this.scene){if(!p.visible){visible=false;break;}p=p.parent;}if(visible)any=true;b.mesh.setMatrixAt(i,visible?node.matrixWorld:hidden);});b.mesh.visible=any;b.mesh.instanceMatrix.needsUpdate=true;}}
 entityView(e){let pool=this.entityPools.get(e.kind);if(!pool){pool=[];this.entityPools.set(e.kind,pool);}if(pool.length)return pool.pop();const g=this.group(0,0,0,this.entityRoot);g.userData.dynamic=true;g.userData.kind=e.kind;
  if(e.kind==='work'){
   const chalk={roughness:1,transparent:true,opacity:.84,depthWrite:false};const halo=this.mesh('torus',[.18,.007,4,28],0xc0ae7b,0,1.113,.32,g,chalk),ring=this.mesh('torus',[.18,.009,4,28],0x7f927b,0,1.115,.32,g,chalk);halo.rotation.x=ring.rotation.x=-Math.PI/2;halo.userData.dynamic=ring.userData.dynamic=true;g.userData.ring=ring;g.userData.halo=halo;
  }
  else if(e.kind==='pamphlet'){
   this.crate(0,0,0,.68,g);for(let i=0;i<3;i++)this.softBox(.49,.014,.57,0xbeb59c,0,.487+i*.014,0,g,{roughness:1});this.box(.012,.048,.585,0x6e6246,0,.510,0,g);this.box(.505,.048,.012,0x6e6246,0,.510,0,g);
   if(!this.pickupPaper)this.pickupPaper=this.printSurface(['ABOLITION','TESTIMONY • PETITION'],{width:256,height:320,border:false,paper:'#c6bea5',ink:'#2a3028'});const paper=this.mesh('plane',[.445,.525],0xffffff,0,.524,0,g,{map:this.pickupPaper,roughness:1});paper.rotation.x=-Math.PI/2;this.contact(0,0,.82,.76,g,.42);
  }
  else if(e.kind==='cart'){
   this.box(2.25,.16,1.6,0x79603f,0,.68,0,g,{map:this.tex.wood}).castShadow=true;for(const side of [-1,1]){this.box(.10,.55,1.6,0x685339,side*1.06,.98,0,g,{map:this.tex.wood});this.box(2.25,.55,.10,0x685339,0,.98,side*.74,g,{map:this.tex.wood});this.beam([side*.7,.75,.65],[side*.7,.40,2.6],.065,0x685339,g);}
   const wheels=[];for(const side of [-1,1]){const wheel=this.group(side*1.20,.42,0,g);wheel.userData.dynamic=true;const rim=this.mesh('torus',[.43,.060,6,16],0x3d443a,0,0,0,wheel,{metalness:.55,roughness:.8});rim.rotation.y=Math.PI/2;for(let j=0;j<6;j++){const a=j*Math.PI/6;this.beam([0,-Math.cos(a)*.38,-Math.sin(a)*.38],[0,Math.cos(a)*.38,Math.sin(a)*.38],.032,0x695a3e,wheel);}const hub=this.cyl(.070,.17,0x3d443a,0,0,0,wheel,12);hub.rotation.z=Math.PI/2;this.batchStatic(wheel);wheels.push(wheel);}this.beam([-1.2,.42,0],[1.2,.42,0],.075,0x3d443a,g);g.userData.wheels=wheels;this.crate(-.4,.78,0,.70,g);this.contact(0,0,2.5,1.7,g,.45);
  }

  else if(e.kind==='attendee'||e.kind==='crate'){const a=this.actor(0,0,{coat:0x8b785a,skin:0xba8864,hat:true},g);a.userData.carry.visible=true;g.userData.actor=a;}
  else{for(const side of [-1,1])for(const end of [-1,1]){this.box(.16,.004,.016,0xb4a47b,side*.46,.008,end*.49,g,{roughness:1});this.box(.016,.004,.16,0xb4a47b,side*.53,.008,end*.42,g,{roughness:1});}const card=this.softBox(.36,.025,.46,0xbeb193,0,.014,0,g);card.rotation.y=-.14;for(let i=0;i<4;i++)this.box(.23-i*.025,.003,.012,0x4a4c3f,0,.029,-.12+i*.065,g);}
  this.batchStatic(g);

  return g;
 }
 showEffects(r,t,reduced){const effects=r?.effects||[];for(let i=0;i<Math.min(effects.length,12);i++){const e=effects[i];let g=this.fx[i];if(!g){g=this.group(0,0,0,this.entityRoot);g.userData.parts=[];for(let j=0;j<5;j++){const p=this.box(.055,.055,.15,j%2?0xe2c78d:0xd4e0be,0,0,0,g);g.userData.parts.push(p);}this.fx.push(g);}g.visible=!reduced;g.position.set(e.x||0,.6,e.z||0);g.userData.parts.forEach((p,j)=>{const a=j*2.4+(e.seed||0),life=clamp(e.life,0,1.1);p.position.set(Math.sin(a)*(1-life)*1.4,.3+Math.sin((1-life)*Math.PI)*.8,Math.cos(a)*(1-life)*1.4);p.rotation.set(t*3+j,t*2+j,0);});}for(let i=Math.min(effects.length,12);i<this.fx.length;i++)this.fx[i].visible=false;}
 update(run,time,{view='menu',shot=null,progress=0,paused=false,director=null,reducedMotion=false,quality=this.quality}={}){
  if(this.disposed)return;if(quality!==this.quality)this.setQuality(quality);const started=performance.now(),dt=Math.min(.25,Math.max(0,time-(this.lastTime??time)));this.lastTime=time;if(!paused)this.clock+=dt;const t=this.clock,active=['play','pause','gate','result'].includes(view),cinema=view==='cinema',menu=view==='menu',p=run?.player||{x:0,z:2,jump:0};
  this.film.visible=cinema||menu;if(menu)this.other.position.set(this.mode==='press'?-9:this.mode==='assembly'?4:3,0,-2);
  this.hero.position.set(active?p.x:this.mode==='press'?-10:2,0,active?p.z:1);this.other.visible=cinema||menu;let facing=this.mode==='press'?Math.PI:0;if(cinema&&director){facing=director.heroYaw??0;this.other.rotation.y=director.otherYaw??0;}else if(active){if(this.mode==='assembly')facing=p.pose==='work'?Math.PI:Math.hypot(p.vx||0,p.vz||0)>.1?Math.atan2(p.vx,p.vz):this.hero.rotation.y;else if(this.mode==='convention')facing=Math.hypot(p.vx||0,p.vz||0)>.1?Math.atan2(p.vx,p.vz):this.hero.rotation.y;}this.hero.rotation.y=cinema?facing:this.hero.rotation.y+Math.atan2(Math.sin(facing-this.hero.rotation.y),Math.cos(facing-this.hero.rotation.y))*Math.min(1,dt*12);
  if(cinema&&director){if(director.heroPosition)this.hero.position.fromArray(director.heroPosition);if(director.otherPosition)this.other.position.fromArray(director.otherPosition);}
  const velocity=Math.hypot(p.vx||0,p.vz||0),pose=cinema?director?.heroPose:p.pose,moving=active&&view==='play'&&(velocity>.1||this.mode==='press'),sprint=velocity>7||(p.dashTime||p.burst||0)>0;
  this.animateActor(this.hero,t,{moving:moving||pose==='run',sprint,work:pose==='work'||(this.mode==='assembly'&&(p.actionTime||0)>0),read:pose==='read',prepare:pose==='prepare'||(this.mode==='convention'&&((p.actionTime||0)>0||(p.prepareProgress||0)>0)),jump:active?p.jump||0:0,speaking:pose==='speak',point:pose==='point',lean:p.lean||0,carry:(this.mode==='press'&&(moving||pose==='carry'))||(active&&p.carry==='pages')});
  this.animateActor(this.other,t+1,{speaking:director?.otherPose==='speak',read:director?.otherPose==='read',point:director?.otherPose==='point',work:director?.otherPose==='work',carry:this.mode==='press'});
  for(let i=0;i<(this.ambient?.length||0);i++){const a=this.ambient[i];a.rotation.y=this.mode==='assembly'?(i?-.6:.6):(i%2?Math.PI/2:-Math.PI/2);if(this.mode==='press')a.position.z=this.wrapTravel(a.userData.streetZ??a.position.z,(active?run?.time||0:0)*7,108);this.animateActor(a,t+i,{read:(this.mode==='assembly'&&i===0)||(this.mode==='press'&&i%2===0)});}
  if(this.benchProps){const working=pose==='work'||(active&&(p.actionTime||0)>0),lane=Math.min(2,Math.max(0,Math.round((this.hero.position.x+4)/4)));for(let i=0;i<this.benchProps.length;i++){const tool=this.benchProps[i];tool.visible=!(working&&lane===i);tool.rotation.x=0;}for(let i=0;i<(this.craftTools?.length||0);i++)this.craftTools[i].visible=working&&lane===i;}
  for(const w of this.wheels){const stroke=cinema&&director?.focus==='press'?(1-Math.cos(t*2.2))*.5:0;w.handle.rotation.y=stroke*.28;w.screw.rotation.y=stroke*.9;w.screw.position.y=1.98-stroke*.10;w.platen.position.y=1.43-stroke*.22;}
  if(this.delegates){for(let i=0;i<this.delegates.length;i++){const a=this.delegates[i];a.visible=cinema&&director?.focus!=='declaration'||(run?.collected||0)>=i+1;this.animateActor(a,t+i,{read:true});}for(const g of this.hallChanges)g.visible=g===this.pageStack?(run?.collected||0)<3:(run?.collected||0)>=g.userData.after;this.hallDesk.visible=active;this.rope.visible=active&&(run?.collected||0)<6;this.ropeGate.rotation.y=(run?.collected===5?(p.prepareProgress||0):0)*-1.25;}
  this.updateTravel(active?run:null);this.syncTravel();
  const seen=new Set();for(const e of active?run?.entities||[]:[]){seen.add(e.id);let g=this.entityViews.get(e.id);if(!g){g=this.entityView(e);g.visible=true;this.entityRoot.add(g);this.entityViews.set(e.id,g);}g.position.set(e.x,0,e.z);g.visible=true;if(e.kind==='work'){const perfect=e.perfectAt??1.3,scale=Math.max(.35,1.9-(e.age||0)*.69);g.userData.ring.scale.setScalar(scale);g.userData.ring.material=this.mat(Math.abs((e.age||0)-perfect)<(e.perfectWindow??.3)?0xbca264:0x7c9178,{roughness:1,transparent:true,opacity:.85,depthWrite:false});g.userData.halo.visible=true;}if(g.userData.wheels)for(const w of g.userData.wheels)w.rotation.x=t*6;if(g.userData.actor){g.rotation.y=(Number.isFinite(e.vx)?e.vx:Math.cos((run?.time||0)*.7+(e.lane||0)*Math.PI))>=0?Math.PI/2:-Math.PI/2;this.animateActor(g.userData.actor,t,{moving:view==='play',carry:true});}if(g.userData.warn)g.userData.warn.visible=(e.dangerPhase||0)>.25;if(g.userData.arrow)g.userData.arrow.position.y=1.7+Math.sin(t*3)*.07;}
  for(const [id,g] of this.entityViews)if(!seen.has(id)){g.visible=false;this.entityRoot.remove(g);this.entityViews.delete(id);this.entityPools.get(g.userData.kind).push(g);}
  this.showEffects(['play','pause','gate'].includes(view)?run:null,t,reducedMotion);this.dust.visible=!reducedMotion;const data=this.dust.geometry.attributes.position.array;for(let i=0;i<data.length;i+=3){data[i]=this.dustBase[i]+Math.sin(t*.13+i)*.35;data[i+1]=(this.dustBase[i+1]+t*.04)%7;}this.dust.geometry.attributes.position.needsUpdate=true;
  const pos=V(),target=V(),portrait=this.camera.aspect<.8;
  if(cinema&&director){pos.fromArray(director.position);target.fromArray(director.target);this.camera.fov=director.fov||50;}
  else if(menu){if(this.mode==='assembly'){pos.set(6.6,2.55,7.5);target.set(.0,1.35,-2.0);this.camera.fov=portrait?62:53;}else if(this.mode==='press'){pos.set(-5.2,2.65,6.0);target.set(-11.6,1.35,-2.1);this.camera.fov=portrait?65:53;}else{pos.set(2,5,portrait?17:13);target.set(0,1.45,-5);this.camera.fov=portrait?62:48;}}
  else if(cinema){if(shot?.view==='close'){pos.set(2.5,2.1,6);target.set(0,1.05,1);}else{pos.set(0,4.7,13);target.set(0,1.5,-3);}this.camera.fov=portrait?62:50;}
  else if(this.mode==='convention'){pos.set(portrait?0:p.x*.05,portrait?17:13.8,portrait?21:14);target.set(0,.55,-1.6);this.camera.fov=portrait?65:54;}
  else if(this.mode==='assembly'){const follow=portrait?.95:.45;pos.set(p.x*follow,5.30,9.15);target.set(p.x*(portrait?.90:.30),1.1,-1.4);this.camera.fov=portrait?75:68;}
  else{const sway=!reducedMotion&&view==='play'?Math.sin(t*7.8)*.025:0;pos.set(p.x*.62+sway,portrait?4.9:3.65,p.z+(portrait?15.5:8.8));target.set(p.x*.57,1.0,p.z-(portrait?11:10.5));this.camera.fov=portrait?69:56;}
  if(!paused)this.speedFov=lerp(this.speedFov||0,!reducedMotion&&view==='play'&&sprint?3.4:0,Math.min(1,dt*9));if(!cinema&&!menu)this.camera.fov+=this.speedFov||0;
  this.camera.position.copy(pos);this.camera.lookAt(target);this.camera.updateProjectionMatrix();this.syncActors();this.cinematicFX.render(this.scene,this.camera,{cinema,focusDistance:director?.focusDistance||pos.distanceTo(target),quality:this.quality});this.performance={calls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,cpuMs:performance.now()-started,quality:this.quality,assets:{...this.assetState}};document.body.dataset.materials=String(this.assetState.loaded)+'/'+this.assetState.total;document.body.dataset.materialErrors=String(this.assetState.failed);
 }
 setQuality(quality,force=false){if(this.disposed)return;quality=quality==='balanced'?'balanced':'detailed';if(!force&&quality===this.quality)return;this.quality=quality;this.renderer.setPixelRatio(quality==='balanced'?1:Math.min(globalThis.devicePixelRatio||1,1.5));const resolution=quality==='balanced'?1024:2048;this.sun.shadow.mapSize.set(resolution,resolution);this.sun.shadow.map?.dispose();this.sun.shadow.map=null;this.renderer.shadowMap.needsUpdate=true;this.resize();}
 resize(){if(this.disposed)return;const r=this.canvas.getBoundingClientRect();this.renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);this.camera.aspect=Math.max(1,r.width)/Math.max(1,r.height);this.camera.updateProjectionMatrix();const ratio=this.renderer.getPixelRatio();this.cinematicFX?.resize(r.width*ratio,r.height*ratio);}
 dispose(){if(this.disposed)return;this.disposed=true;this.sun.shadow.dispose();const skeletons=new Set();this.scene.traverse(o=>{if(o.isInstancedMesh)o.dispose();if(o.isSkinnedMesh&&o.skeleton)skeletons.add(o.skeleton);});for(const actor of this.actors)actor.traverse(o=>{if(o.isSkinnedMesh&&o.skeleton)skeletons.add(o.skeleton);});for(const skeleton of skeletons)skeleton.dispose();for(const g of this.geometries.values())g.dispose();for(const m of this.materials.values())m.dispose();for(const t of this.textures)t.dispose();this.environmentTarget?.dispose();this.cinematicFX?.dispose();this.resolveAssets?.({...this.assetState,disposed:true});this.scene.traverse(o=>{if(o.isSprite)o.material.dispose();});this.renderer.dispose();}
 }
