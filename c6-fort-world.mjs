import * as T from './three.module.js';
const mix=(a,b,t)=>a+(b-a)*t,clamp=t=>Math.max(0,Math.min(1,t));
const v=(x,y,z)=>new T.Vector3(x,y,z);

function boat(w,x,z){
 const g=w.group(x,-.15,z);w.box(1.9,.18,5.4,0x655c43,0,.3,0,g);
 for(const sign of [-1,1]){const side=w.box(.16,.65,5.4,w.mat(0x76684b,{map:w.woodTexture}),sign*.94,.55,0,g);side.rotation.z=-sign*.17;const end=w.box(1.85,.5,.17,0x6c6148,0,.55,sign*2.66,g);end.rotation.x=sign*.18;}
 for(const zz of [-1.5,0,1.5])w.box(1.8,.1,.35,0x9a8964,0,.73,zz,g);
 for(const sign of [-1,1]){const oar=w.box(.07,.075,3.6,0x837352,sign*1.8,.84,.1,g);oar.rotation.y=sign*.8;}
 return g;
}
function cannon(w,x,z,mounted=false){
 const g=w.group(x,0,z),metal=w.mat(0x303e3e,{metalness:.78,roughness:.49});
 const tube=w.mesh(new T.CylinderGeometry(.29,.40,3.3,20,1,false),metal,0,mounted?1.08:.66,-.3,g);tube.rotation.x=-Math.PI/2;
 // Deep dark bore is visible from the muzzle, with separate reinforcing rings.
 const bore=w.mesh(new T.CircleGeometry(.267,20),w.mat(0x0c1717),0,mounted?1.08:.66,-1.90,g);bore.rotation.y=Math.PI;
 for(const zz of [-1.85,-1.2,.3,1.25]){const ring=w.mesh(new T.TorusGeometry(zz<0?.3:.39,.045,8,24),metal,0,mounted?1.08:.66,zz,g);}
 w.sphere(.17,metal,0,mounted?1.08:.66,1.58,g);w.box(1.55,.25,2.5,0x7e6747,0,.25,0,g);
 g.userData.rollers=[];for(const zz of [-.85,.85]){const roller=w.cyl(.18,1.7,0x887452,0,.19,zz,g);roller.rotation.z=Math.PI/2;g.userData.rollers.push(roller);}
 if(mounted)for(const xx of [-.9,.9])for(const zz of [-.85,.85]){const wheel=w.mesh(new T.TorusGeometry(.49,.10,7,16),0x504a37,xx,.52,zz,g);wheel.rotation.y=Math.PI/2;}
 return g;
}
export function buildFort(w){
 w.fort={};const f=w.fort;
 // A clean court, low bastions, lake frontage, and open passage distinguish this set.
 w.box(53,.05,40,w.mat(0x7f8373,{map:w.groundTexture}),0,-.02,-26);
 const sky=new T.Mesh(new T.SphereGeometry(170,28,16),new T.ShaderMaterial({side:T.BackSide,depthWrite:false,uniforms:{top:{value:new T.Color(0x172d48)},bottom:{value:new T.Color(0xe2ad7a)}},vertexShader:'varying vec3 p;void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec3 p;uniform vec3 top;uniform vec3 bottom;void main(){float h=clamp(normalize(p).y*2.,0.,1.);gl_FragColor=vec4(mix(bottom,top,pow(h,.6)),1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}'}));w.scene.add(sky);
 const waterMaterial=new T.ShaderMaterial({uniforms:{clock:{value:0}},vertexShader:'varying vec3 p;void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec3 p;uniform float clock;void main(){float waves=sin(p.x*.55+clock*.6)*sin(p.y*1.2-clock*.35);float shine=pow(max(0.,sin(p.x*.19+p.y*.08+clock*.1)),18.)*.13;gl_FragColor=vec4(vec3(.16,.28,.34)+waves*.018+shine,1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}'});
 f.water=w.mesh(new T.PlaneGeometry(220,160,1,1),waterMaterial,0,-.04,109);f.water.rotation.x=-Math.PI/2;f.water.castShadow=false;
 w.box(3,.14,9,w.mat(0x70664f,{map:w.woodTexture}),0,.04,29);for(const x of [-1.45,1.45])for(const z of [25,28,31])w.cyl(.09,.8,0x544e3d,x,.1,z);
 f.boat=boat(w,3.5,30.5);boat(w,-6,32);w.lantern(3.5,.9,29.5);
 const mountainMaterial=w.mat(0x425663);for(let i=0;i<15;i++){const a=i/15*Math.PI*2;w.sphere(1,mountainMaterial,Math.cos(a)*107,-3,Math.sin(a)*115-25,undefined,[20,9+(i%4)*3,23]);}
 const stone=w.mat(0x919b91,{map:w.stoneTexture});
 for(const [x,z] of [[-25,-5],[25,-5],[-25,-46],[25,-46]]){const b=w.mesh(new T.CylinderGeometry(4.6,5.5,4.8,4),stone,x,2.2,z);b.rotation.y=Math.PI/4;w.box(5,.3,5,0x939a89,x,4.5,z);}
 // Weathered parapets, not medieval crenellations.
 for(const x of [-16,16]){w.box(24,.25,2.3,0x999f91,x,4.7,-5);w.box(24,.45,.5,stone,x,4.95,-4.35);}
 for(const x of [-27,27])w.box(2.3,.25,40,0x999f91,x,4.7,-26);
 w.box(54,.25,2.3,0x999f91,0,4.7,-47);
 for(const x of [-17,17]){const z=x<0?-28:-33,d=x<0?28:18;w.box(13.4,.22,d+.4,0x434f4b,x,6.12,z);for(let zz=z-d/2+3;zz<z+d/2;zz+=4){const side=x<0?x+6.53:x-6.53;w.box(.10,1.2,.75,0x242f2e,side,3.2,zz);w.box(.14,.06,.8,0xada28a,side,3.2,zz);}}
 // Store doorway opens onto the accessible court.
 w.box(.10,2.5,1.8,0x2b322b,10.47,1.25,-23.5);w.label('ORDNANCE',10.3,3.0,-23.5,2,-Math.PI/2);
 f.storeDoor=w.group(10.37,0,-24.3);w.box(.14,2.4,1.6,0x685b41,0,1.2,.8,f.storeDoor);
 f.latch=w.group(1.7,0,-10.4);w.box(.14,1.9,.14,0x594e37,0,.95,0,f.latch);w.box(1.3,.13,.14,0x76654a,-.5,1.3,0,f.latch);
 for(const [x,z] of [[-8,3],[4,-12],[9,-26],[-7,-38]]){w.lantern(x,2.2,z);w.box(.09,2.65,.09,0x504b39,x+.25,1.325,z);w.box(.4,.08,.08,0x504b39,x+.1,2.65,z);}
 for(let i=0;i<8;i++){const x=12+i%2*.72,z=-20+Math.floor(i/2)*.7;w.cyl(.31,.84,0x766248,x,.42,z);for(const y of [.12,.69])w.cyl(.322,.06,0x3f4b44,x,y,z);}
 f.gun=cannon(w,-3,-37);f.tag=w.label('SOUND BARREL|NEW CARRIAGE',-2.35,1.05,-35.55,.9);f.tag.visible=false;
 // A broken old iron fitting provides the future visual callback.
 w.box(.23,.08,.42,0x977952,-.45,.78,.9,f.gun);
 cannon(w,-7,-40);cannon(w,5,-40);cannon(w,20,-10,true).rotation.y=-Math.PI/2;cannon(w,-20,-10,true).rotation.y=Math.PI/2;
 f.rope=w.mesh(new T.CylinderGeometry(.018,.018,1,6),0xb4a77e,0,-10,0);f.rope.visible=false;
 f.coil=w.mesh(new T.TorusGeometry(.34,.06,8,24),0xb4a77e,-3,.10,-32);f.coil.rotation.x=Math.PI/2;
 const runner=w.actor('ROWAN',-4,25,0);delete w.cast.ROWAN;w.cast.RUNNER=runner;const crewCloths=new Set();runner.traverse(o=>{if(o.material?.color)crewCloths.add(o.material);});for(const mat of crewCloths){if(mat.color.getHex()===0x315663)mat.color.set(0x687248);else if(mat.color.getHex()===new T.Color(0x315663).multiplyScalar(.64).getHex())mat.color.set(new T.Color(0x687248).multiplyScalar(.64));} // Existing tailored rig, separate younger crew member.
 w.actor('ROWAN',0,27,0);w.actor('WARD',-8,5,Math.PI*.7);w.actor('ISAIAH',3.5,30.5,0);
 f.sentry=w.soldier(true);f.sentry.position.set(0,0,-8);f.lantern=w.lantern(0,0,0,false);f.sentry.add(f.lantern);f.lantern.position.set(-.35,1.3,-.2);
 f.cone=w.mesh(new T.ConeGeometry(4.5,13,24,1,true),new T.MeshBasicMaterial({color:0xf8d29a,transparent:true,opacity:.055,side:T.DoubleSide,depthWrite:false}),0,.7,-6.5,f.sentry);f.cone.rotation.x=-Math.PI/2;
 f.raiders=[];for(let i=0;i<9;i++){const a=w.soldier();a.position.set((i%3-1)*1.1,0,14+Math.floor(i/3)*2);f.raiders.push(a);}
 f.prisoners=[];for(let i=0;i<5;i++){const a=w.soldier(true);a.position.set(19+i%2*1.2,0,-14-Math.floor(i/2)*2);a.userData.gun.visible=false;a.visible=false;f.prisoners.push(a);}
 f.flag=w.group(23,0,-40);w.cyl(.055,7,0x6a6048,0,3.5,0,f.flag);const cloth=w.box(2.7,1.5,.02,0x804b43,1.35,6,0,f.flag);w.box(.28,1.5,.04,0xe2d7b9,1.35,6,-.02,f.flag);w.box(2.7,.23,.04,0xe2d7b9,1.35,6,-.02,f.flag);f.flagCloth=cloth;
 const matrix=new T.Matrix4(),q=new T.Quaternion();
 const trees=new T.InstancedMesh(new T.ConeGeometry(2.5,9,7),w.mat(0x364e46),65);
 for(let i=0;i<65;i++){const x=(i%2?1:-1)*(36+(i*17%39)),z=-65+(i*19%85);matrix.compose(v(x,3.5,z),q,v(1,1+(i%4)*.13,1));trees.setMatrixAt(i,matrix);}w.scene.add(trees);
 const grass=new T.InstancedMesh(new T.ConeGeometry(.10,.35,3),w.mat(0x637957),650);
 for(let i=0;i<650;i++){const x=Math.sin(i*131.3)*26,z=3+(i*17.13%23);matrix.compose(v(x,Math.abs(x)<4?-2:.1,z),q,v(1,1+(i%3)*.2,1));grass.setMatrixAt(i,matrix);}w.scene.add(grass);
 const rubble=new T.InstancedMesh(new T.DodecahedronGeometry(.32,0),w.mat(0x919587),70);
 for(let i=0;i<70;i++){const x=(i%2?1:-1)*(5+(i*7%20)),z=i<35?-3+(i%5)*.19:-44+(i%6)*.26;matrix.compose(v(x,.11,z),q,v(1,.5,1));rubble.setMatrixAt(i,matrix);}w.scene.add(rubble);
}
function rope(w,from,to){const delta=to.clone().sub(from);w.fort.rope.position.copy(from).addScaledVector(delta,.5);w.fort.rope.scale.y=delta.length();w.fort.rope.quaternion.setFromUnitVectors(v(0,1,0),delta.normalize());w.fort.rope.visible=true;}
function troops(w,captured,t,progress=1){const f=w.fort;f.sentry.visible=!captured;f.prisoners.forEach(a=>a.visible=captured);
 f.raiders.forEach((a,i)=>{const target=-14-Math.floor(i/3)*2;a.position.z=captured?mix(9+Math.floor(i/3)*2,target,clamp(progress+i*.025)):14+Math.floor(i/3)*2;a.userData.legs.forEach((leg,j)=>leg.rotation.x=captured&&progress<1?Math.sin(t*9+j*Math.PI)*.5:0);a.userData.gun.rotation.x=captured?-.45:0;});
}
export function renderFort(w,s,input,voice){const f=s.fort,t=s.time,p=s.player,a=w.fort;
 w.sun.intensity=f.captured?2.3:1.5;w.sun.color.set(0xffd4a6);a.water.material.uniforms.clock.value=t;a.boat.rotation.z=Math.sin(t*.6)*.018;
 a.sentry.position.x=f.sentryX;a.sentry.rotation.y=Math.PI+f.look;a.cone.material.opacity=.04+f.seen*.06;
 troops(w,f.captured,t,f.crew);a.latch.rotation.z=f.captured?-.7:0;a.storeDoor.rotation.y=f.secured?-1.5:0;a.tag.visible=f.tagged;a.coil.visible=!f.rope&&s.stage<6;
 a.gun.position.z=-37+f.haul*5;a.gun.userData.rollers.forEach(r=>r.rotation.x=-f.haul*15);a.rope.visible=false;
 if(f.rope)rope(w,v(-3,.7,a.gun.position.z+1.55),v(p.x-.18,1.1,p.z-.3));
 w.setActor('WARD',f.captured?(s.stage>=4?-5:-7):-8,f.captured?(s.stage>=4?-33:-15):5,f.captured?-.65:Math.PI*.8,s.stage===6?'work':f.signal?'point':'kneel',t,voice==='WARD');
 w.setActor('ISAIAH',3.5,30.5,0,'row',t,voice==='ISAIAH');
 w.setActor('RUNNER',f.captured?8:f.alarm&&!f.rescued?-5:-6,f.captured?-23:f.alarm&&!f.rescued?4:7,f.captured?-Math.PI/2:0,f.alarm&&!f.rescued?'kneel':'listen',t,voice==='RUNNER');
 if(s.stage===7)w.setActor('WARD',3,-30,-Math.PI*.65,'paper',t,voice==='WARD');
}
export function filmFort(w,key,beat,time,elapsed,speaking){const a=w.fort,captured=key!=='northIntro';w.sun.intensity=key==='northEnding'?2.8:captured?2.3:1.5;w.sun.color.set(0xffd4a6);a.water.material.uniforms.clock.value=elapsed;troops(w,captured,elapsed,key==='fortCapture'?clamp(elapsed/8):1);a.rope.visible=false;a.coil.visible=key==='northIntro';a.tag.visible=key==='northEnding';a.storeDoor.rotation.y=key==='northEnding'?-1.5:0;
 a.gun.position.z=key==='northEnding'?-32:-37;
 if(key==='northIntro'){
  a.boat.rotation.z=Math.sin(elapsed*.6)*.018;
  w.setActor('ISAIAH',3.5,30.5,.6,'row',elapsed,speaking&&[0,4,7].includes(beat));
  w.setActor('ROWAN',0,27,.983,'listen',time,speaking&&[1,5].includes(beat));
  w.setActor('WARD',-1.5,26,-2.159,beat===2?'point':'listen',time,speaking&&[2,6].includes(beat));
  w.setActor('RUNNER',-2.5,24,-2.447,beat===3?'point':'listen',time,speaking&&beat===3);
 }else if(key==='fortCapture'){
  w.setActor('RUNNER',5,-19,2.356,beat===0?'point':'listen',time,speaking&&[0,4].includes(beat));
  w.setActor('WARD',2,-16,-.464,'listen',time,speaking&&[1,3].includes(beat));
  w.setActor('ROWAN',3,-18,Math.PI*.85,beat===2?'point':'listen',time,speaking&&beat===2);
 }else{
  w.setActor('WARD',-5,-30,-Math.PI*.5,beat===0?'reach':beat===2?'work':'listen',time,speaking&&[0,2,5,7].includes(beat));
  w.setActor('ROWAN',-1,-30,Math.PI*.5,beat<3?'work':beat>=4?'paper':'listen',time,speaking&&[1,4,6].includes(beat));
  w.setActor('RUNNER',1,-33,2.55,'paper',time,speaking&&beat===3);
 }
}

