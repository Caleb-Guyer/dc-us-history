import * as T from './three.module.js';
const rand=n=>{const v=Math.sin(n*127.1+17)*43758.5453;return v-Math.floor(v);};
const vec=(x,y,z)=>new T.Vector3(x,y,z);

export function dressWorld(w,level){
 const night=level==='night',warm=level==='end',scene=w.scene;
 // A painted sky dome gives the horizon depth without downloading skyboxes.
 const sky=new T.Mesh(new T.SphereGeometry(180,32,16),new T.ShaderMaterial({side:T.BackSide,depthWrite:false,
  uniforms:{top:{value:new T.Color(night?0x081b31:warm?0x596c78:0x77909f)},bottom:{value:new T.Color(night?0x63858a:warm?0xe8bc8e:0xe0d6b3)}},
  vertexShader:'varying vec3 v;void main(){v=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
  fragmentShader:'uniform vec3 top;uniform vec3 bottom;varying vec3 v;void main(){float h=clamp(normalize(v).y*2.0,0.0,1.0);gl_FragColor=vec4(mix(bottom,top,pow(h,.65)),1.0);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}'
 }));sky.position.z=-50;scene.add(sky);
 if(night){const positions=[];for(let i=0;i<160;i++){const a=rand(i+4)*Math.PI*2,b=.15+rand(i+78)*1.2;positions.push(Math.cos(a)*Math.cos(b)*155,Math.sin(b)*155,Math.sin(a)*Math.cos(b)*155-50);}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));scene.add(new T.Points(g,new T.PointsMaterial({color:0xdce8dc,size:.25,transparent:true,opacity:.6,fog:false})));}
 const hills=new T.InstancedMesh(new T.SphereGeometry(1,10,6),w.mat(night?0x1e3840:0x687e72),20),matrix=new T.Matrix4(),q=new T.Quaternion();
 for(let i=0;i<20;i++){const a=i/20*Math.PI*2;matrix.compose(vec(Math.cos(a)*90,-4,-50+Math.sin(a)*112),q,vec(18+rand(i)*16,8+rand(i+50)*12,20));hills.setMatrixAt(i,matrix);}scene.add(hills);
 // Sparse, batched ground detail avoids adding hundreds of draw calls.
 const blades=new T.InstancedMesh(new T.ConeGeometry(.07,.45,3),w.mat(night?0x647d62:0x6a7a44),1100);
 const rocks=new T.InstancedMesh(new T.DodecahedronGeometry(.28,0),w.mat(0x92978a),140);
 for(let i=0;i<1100;i++){const x=(rand(i+200)-.5)*70,z=20-rand(i+500)*150,nearRoad=Math.abs(x)<5;
  matrix.compose(vec(x,nearRoad?-2:.05,z),new T.Quaternion().setFromEuler(new T.Euler(0,rand(i)*6.28,.08)),vec(1,rand(i+900)*1.4+.5,1));blades.setMatrixAt(i,matrix);}
 for(let i=0;i<140;i++){const x=(rand(i+77)-.5)*50,z=18-rand(i+199)*135;matrix.compose(vec(x,.02,z),q,vec(.5+rand(i)*1.5,.3,.7));rocks.setMatrixAt(i,matrix);}scene.add(blades,rocks);
 // Two ruts and broken shoulder edges make the route readable in the world.
 if(level!=='release'){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const ctx=canvas.getContext('2d'),pixels=ctx.createImageData(128,128);
  for(let y=0;y<128;y++)for(let x=0;x<128;x++){const i=(y*128+x)*4,center=64+Math.sin(y*.05)*5,edge=Math.max(0,1-Math.abs(x-center)/54);pixels.data[i]=65;pixels.data[i+1]=53;pixels.data[i+2]=36;pixels.data[i+3]=edge*edge*(32+rand(y*128+x)*16);}
  ctx.putImageData(pixels,0,0);const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;texture.wrapT=T.RepeatWrapping;texture.repeat.y=12;
  const material=w.mat(0xffffff,{map:texture,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1});
  for(const x of [-1.05,1.05]){const track=w.mesh(new T.PlaneGeometry(.7,150),material,x,-.012,-50);track.rotation.x=-Math.PI/2;track.castShadow=false;}
 }
 if(!night){for(let i=0;i<9;i++){const cloud=new T.Sprite(new T.SpriteMaterial({map:w.smokeTexture,color:0xf5e5ce,opacity:.45,depthWrite:false,fog:false}));cloud.position.set(-90+i*24,32+rand(i)*15,-85-rand(i+3)*20);cloud.scale.set(48,14,1);scene.add(cloud);}}
 const barrel=(x,z)=>{const g=w.group(x,0,z);w.cyl(.31,.82,0x73604a,0,.41,0,g);for(const y of [.13,.66])w.cyl(.322,.06,0x424b45,0,y,0,g);w.cyl(.295,.035,0x8b775b,0,.83,0,g);};
 const crate=(x,z)=>{w.box(.8,.7,.7,w.mat(0x887453,{map:w.woodTexture}),x,.35,z);for(const dx of [-.32,.32])w.box(.07,.73,.73,0x574d3a,x+dx,.36,z);};
 if(level==='release'){barrel(-12,4);barrel(-12.7,4.6);crate(12,6);crate(12,7);w.box(.8,.07,1.4,0x6f4840,9,1.35,10);}
 if(level==='night'){barrel(-14,-18.5);crate(-14,-17.5);barrel(18.5,-51);w.flag(8,-61,0xaaa887);}
 if(level==='lexington'){barrel(21,14);crate(21,15);w.box(1.4,.055,1.1,0xcebd9b,14,1.23,17);}
 if(level==='concord'){barrel(-13,6);crate(2.1,10.3);w.box(.38,.15,.32,0xc4b996,2,.9,9.1);}
 if(warm){const fire=w.group(-2,0,0);for(let i=0;i<5;i++){const log=w.cyl(.095,.9,0x514032,0,.1,0,fire);log.rotation.set(Math.PI/2,i*1.2,0);}const light=new T.PointLight(0xffa34f,15,11);light.position.y=.6;fire.add(light);const flame=w.mesh(new T.ConeGeometry(.2,.7,8),new T.MeshBasicMaterial({color:0xffbd68,transparent:true,opacity:.8}),0,.48,0,fire);w.campFire={light,flame};}
}
