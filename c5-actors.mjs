import * as T from './three.module.js';
import {CAST} from './c5-data.mjs';

// Articulated, close-up cast. The inexpensive field models remain separate.
const cloth=(color,extra={})=>new T.MeshStandardMaterial({color,roughness:.92,...extra});
const skinMat=color=>cloth(color,{roughness:.68});
function mesh(parent,geometry,material,x=0,y=0,z=0){const m=new T.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function ball(p,r,mat,x,y,z,s=[1,1,1]){const m=mesh(p,new T.SphereGeometry(r,20,14),mat,x,y,z);m.scale.set(...s);return m;}
function box(p,w,h,d,mat,x,y,z){return mesh(p,new T.BoxGeometry(w,h,d),mat,x,y,z);}
function taper(p,a,b,h,mat,x,y,z){return mesh(p,new T.CylinderGeometry(a,b,h,16),mat,x,y,z);}
function joint(p,x,y,z){const g=new T.Group();g.position.set(x,y,z);p.add(g);return g;}
function patch(p,points,mat){const shape=new T.Shape();points.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();const m=mesh(p,new T.ShapeGeometry(shape),mat);m.position.z=-.168;m.rotation.y=Math.PI;return m;}

export function makeActor(key){
 const spec=CAST[key]||CAST.WARD,g=new T.Group(),root=joint(g,0,0,0),body=joint(root,0,1.04,0);
 const skin=skinMat(key==='ISAIAH'?0x895b40:key==='WARD'?0xc6a184:0xd4ab8b),coat=cloth(spec.color),darkCoat=cloth(new T.Color(spec.color).multiplyScalar(.64)),linen=cloth(0xd5cbb4),leather=cloth(0x493e31),hair=cloth(key==='WARD'?0x787671:key==='MARA'?0x493225:0x352e27),brass=cloth(0xc4a16d,{metalness:.48,roughness:.44});
 const torso=taper(body,.25,.30,.61,coat,0,.15,0);torso.scale.z=.56;
 const waist=taper(body,.25,.31,.30,coat,0,-.25,.02);waist.scale.z=.59;
 const tails=[];for(const side of [-1,1]){const tail=joint(body,side*.16,-.17,.05);const m=box(tail,.25,.51,.05,darkCoat,0,-.23,.10);m.rotation.x=-.13;tails.push(tail);}
 box(body,.22,.49,.038,linen,0,.17,-.155);
 patch(body,[[-.07,.48],[-.27,.42],[-.16,.07],[-.065,.20]],darkCoat);patch(body,[[.07,.48],[.27,.42],[.16,.07],[.065,.20]],darkCoat);
 for(let i=0;i<5;i++)for(const side of [-1,1])ball(body,.015,brass,side*.12,.30-i*.09,-.184,[1,1,.45]);
 box(body,.53,.052,.33,leather,0,-.09,0);box(body,.064,.067,.02,brass,0,-.09,-.18);
 for(const side of [-1,1]){const pocket=box(body,.15,.07,.023,darkCoat,side*.2,-.16,-.14);pocket.rotation.z=side*.15;}
 const legs=[],knees=[],arms=[],elbows=[],hands=[];
 for(const side of [-1,1]){
  const leg=joint(root,side*.13,.84,0),knee=joint(leg,0,-.38,0);legs.push(leg);knees.push(knee);
  const thigh=taper(leg,.105,.082,.37,cloth(0x958a72),0,-.18,0);thigh.scale.z=.85;
  taper(knee,.074,.061,.29,linen,0,-.15,0);taper(knee,.080,.074,.19,leather,0,-.30,0);
  ball(knee,.10,leather,0,-.38,-.07,[.85,.61,1.65]);box(knee,.155,.035,.24,cloth(0x252b29),0,-.43,-.055);
  const arm=joint(body,side*.285,.39,0),elbow=joint(arm,0,-.28,0),hand=joint(elbow,0,-.29,0);arms.push(arm);elbows.push(elbow);hands.push(hand);
  ball(arm,.102,coat,0,-.035,0,[1,1.15,.90]);taper(arm,.088,.068,.28,coat,0,-.14,0);
  taper(elbow,.065,.055,.25,coat,0,-.12,0);taper(elbow,.071,.071,.08,darkCoat,0,-.235,0);taper(elbow,.056,.052,.035,linen,0,-.29,0);
  ball(hand,.067,skin,0,-.038,0,[.8,1,.40]);
  for(let f=0;f<4;f++)ball(hand,.016,skin,-.035+f*.023,-.104+(f===3?.008:0),-.003,[.66,2.1,.77]);
  const thumb=ball(hand,.024,skin,side*.055,-.048,-.018,[.6,1.5,.75]);thumb.rotation.z=side*.4;
 }
 const neck=joint(body,0,.52,0);taper(neck,.075,.086,.14,skin,0,.01,0);
 const head=joint(neck,0,.15,0),face=ball(head,.185,skin,0,.012,0,[.80,1.16,.91]);
 for(const side of [-1,1])ball(head,.027,skin,side*.149,.013,.009,[.57,1,.74]);
 // Eyes sit on the surface, below shaped brows; eyelids blink independently.
 const lids=[],brows=[],eyes=[];
 for(const side of [-1,1]){
  const eye=joint(head,side*.057,.051,-.153);eyes.push(eye);
  ball(eye,.025,cloth(0xe2d9c7),0,0,0,[1,.49,.35]);ball(eye,.011,cloth(key==='ROWAN'?0x506d69:0x453b2a),0,0,-.008,[1,1,.32]);ball(eye,.006,cloth(0x172326),0,0,-.012,[.75,1,.3]);ball(eye,.0026,cloth(0xf5ede0),-.003,.003,-.015);
  lids.push(ball(eye,.026,skin,0,.015,-.001,[1,.16,.45]));
  const brow=ball(head,.036,hair,side*.057,.088,-.137,[1,.20,.28]);brow.rotation.z=side*.07;brows.push(brow);
 }
 const nose=taper(head,.012,.024,.085,skin,0,.011,-.158);nose.rotation.x=-.23;ball(head,.020,skin,0,-.022,-.180,[1,.63,1]);
 const mouth=joint(head,0,-.072,-.163);ball(mouth,.029,cloth(0x593c32),0,0,0,[1,.17,.24]);
 const lowerLip=ball(mouth,.030,skin,0,-.007,.001,[1,.11,.24]);
 // A layered hairline avoids the old helmet-shaped single cap.
 ball(head,.187,hair,0,.112,.029,[.90,.70,.91]);
 for(let i=0;i<8;i++){const a=-1.4+i*.40;const lock=ball(head,.061,hair,Math.sin(a)*.113,.125+Math.cos(a)*.018,-.090+Math.abs(Math.sin(a))*.05,[.78,.52,1]);lock.rotation.z=.35-i*.05;}
 if(key==='ISAIAH'||key==='WARD'){const beard=mesh(head,new T.SphereGeometry(.185,20,10,0,Math.PI*2,2.07,Math.PI-2.07),hair,0,.015,0);beard.scale.set(.81,1.17,.95);}
 if(key==='MARA'){ball(head,.09,hair,0,.08,.19,[.9,.85,.7]);for(const side of [-1,1])ball(head,.042,hair,side*.137,.005,.065,[.55,1.6,.7]);}
 if(key==='WARD'){
  for(const side of [-1,1])box(head,.045,.004,.004,cloth(0x8e7763),side*.081,.019,-.14).rotation.z=side*.2;
  const brim=taper(head,.26,.28,.024,leather,0,.21,.017);brim.scale.z=.86;taper(head,.14,.18,.10,leather,0,.26,.02);
 }
 if(key==='THOMAS'){
  const hat=mesh(head,new T.CylinderGeometry(.24,.30,.07,3),cloth(0x28302d),0,.22,0);hat.rotation.y=Math.PI/2;taper(head,.13,.16,.11,leather,0,.28,.02);
 }
 const scarf=[];
 if(key==='ROWAN'){
  const red=cloth(0x934638);const wrap=taper(body,.112,.127,.1,red,0,.51,0);wrap.scale.z=.85;
  const tail=joint(body,.075,.49,-.10);box(tail,.075,.41,.025,red,0,-.20,0);tail.rotation.z=-.20;scarf.push(tail);
 }
 if(key==='MARA'){
  const dress=taper(root,.24,.48,.88,coat,0,.52,0);dress.scale.z=.76;
  const shawl=cloth(0x376275);for(const side of [-1,1]){const p=box(body,.28,.34,.055,shawl,side*.17,.36,.03);p.rotation.z=side*.43;}
  const apron=taper(root,.20,.32,.62,linen,0,.56,-.08);apron.scale.z=.32;
 }
 const strap=box(body,.048,.84,.025,cloth(0x9e8460),.015,.10,-.19);strap.rotation.z=-.47;
 const satchel=joint(body,.28,-.18,.01);box(satchel,.26,.28,.13,leather,0,0,0);box(satchel,.27,.09,.02,darkCoat,0,.07,-.076);ball(satchel,.017,brass,0,.023,-.092,[1,1,.4]);
 const paper=joint(hands[1],0,-.04,-.10);box(paper,.22,.009,.31,cloth(0xdecba0),0,0,0);const seal=taper(paper,.020,.020,.006,cloth(0x914335),.05,.010,0);paper.visible=false;
 const wound=ball(arms[0],.058,cloth(0x692f2e),-.022,-.061,-.085,[.90,1.2,.19]);wound.visible=false;
 const bandage=taper(arms[0],.109,.100,.15,linen,0,-.055,0);bandage.visible=false;
 const dressing=box(hands[0],.14,.035,.13,linen,0,-.06,-.015);dressing.visible=false;
 g.userData={key,root,body,legs,knees,arms,elbows,hands,head,eyes,lids,brows,mouth,lowerLip,tails,scarf,paper,wound,bandage,dressing};return g;
}

export function poseActor(g,{time=0,speaking=false,voiceTime=0,progress=0,pose='listen',mood='steady',gaze=0,speed=1,injury=false,bandaged=false}={}){
 const u=g.userData,t=time*speed,walk=pose==='walk'||pose==='run',stride=pose==='run'?1.5:1,breathe=Math.sin(t*1.65)*.007;
 u.root.rotation.set(0,0,0);u.root.position.y=walk?Math.abs(Math.sin(t*5))* .025*stride:0;u.body.rotation.set(0,0,Math.sin(t*.63)*.012);u.body.position.y=1.04+breathe;
 u.wound.visible=injury&&!bandaged;u.bandage.visible=bandaged;u.dressing.visible=pose==='tend';
 u.legs.forEach((p,i)=>{p.rotation.set(walk?Math.sin(t*5+i*Math.PI)*.36*stride:0,0,0);u.knees[i].rotation.x=walk?Math.max(0,-Math.sin(t*5+i*Math.PI))*.55:0;});
 u.arms.forEach((p,i)=>{p.rotation.set(walk?-Math.sin(t*5+i*Math.PI)*.26*stride:.04,0,(i?1:-1)*.08);u.elbows[i].rotation.set(-.08,0,0);u.hands[i].rotation.set(0,0,0);});
 const speech=speaking?(Math.sin(voiceTime*16)*.5+.5)*(.35+.65*Math.abs(Math.sin(voiceTime*6.7))):0;
 u.head.rotation.set(speaking?Math.sin(voiceTime*2.1)*.035:Math.sin(t*.7)*.018,gaze+(speaking?Math.sin(voiceTime*.8)*.025:0),mood==='sad'?-.065:0);
 u.mouth.scale.y=1+speech*3.1;u.lowerLip.position.y=-.007-speech*.007;
 const blink=((t+(u.key.charCodeAt(0)%4)*.73)%4.7);u.lids.forEach(l=>{l.scale.y=blink>4.51?1.04:.16;l.position.y=blink>4.51?0:.015;});
 u.brows.forEach((b,i)=>b.rotation.z=(i?1:-1)*(mood==='tense'?.22:mood==='sad'?-.24:.065)+(speaking?Math.sin(voiceTime*.6)*.04:0));
 u.tails.forEach((p,i)=>p.rotation.x=walk?Math.sin(t*5+i)*.08:.02*Math.sin(t*.8+i));u.scarf.forEach(p=>p.rotation.x=.10+Math.sin(t*2)*.065);
 u.paper.visible=['paper','give','read'].includes(pose);
 if(pose==='paper'||pose==='read'){u.arms[1].rotation.x=-.65;u.elbows[1].rotation.x=-.85;u.hands[1].rotation.x=-.40;u.paper.rotation.x=.45;if(pose==='read')u.head.rotation.x=.18;}
 if(pose==='give'){u.arms[1].rotation.x=-1.03;u.elbows[1].rotation.x=-.45;u.paper.rotation.x=.4;}
 if(pose==='point'){u.arms[1].rotation.set(-1.18,.12,.2);u.elbows[1].rotation.x=-.25;}
 if(pose==='work'){u.body.rotation.x=.12;u.arms.forEach((p,i)=>{p.rotation.x=-.78-Math.sin(t*3+i)*.14;u.elbows[i].rotation.x=-.64;});u.head.rotation.x=.16;}
 if(pose==='row'){u.root.position.y=-.34;u.legs.forEach(p=>p.rotation.x=-1.3);u.knees.forEach(p=>p.rotation.x=1.2);u.body.rotation.x=.12+Math.sin(t*1.7)*.14;u.arms.forEach((p,i)=>{p.rotation.x=-.98+Math.sin(t*1.7)*.23;u.elbows[i].rotation.x=-.55;});}
 if(pose==='kneel'){u.root.position.y=-.47;u.body.rotation.x=.24;u.legs[0].rotation.x=-1.5;u.knees[0].rotation.x=1.5;u.legs[1].rotation.x=.45;u.knees[1].rotation.x=1.65;u.arms.forEach((p,i)=>{p.rotation.x=-.8;u.elbows[i].rotation.x=-.35;});u.head.rotation.x=.2;}
 if(pose==='brace'){u.body.rotation.x=.18;u.arms[0].rotation.x=-1.8;u.elbows[0].rotation.x=-.8;u.head.rotation.x=.10;}
 if(pose==='reach'){u.arms[1].rotation.x=-1.3;u.elbows[1].rotation.x=-.25;u.body.rotation.y=-.14;}
 if(pose==='hit'||pose==='recover'){
  const p=pose==='recover'?1:Math.max(0,Math.min(1,progress)),jolt=Math.sin(Math.min(1,p*3)*Math.PI)*.24;
  // Shoulder recoil, knees fold, then weight settles into the snow. The free
  // hand braces against the ground; the other holds the wounded shoulder.
  u.root.position.y=-.64*p*p;u.body.rotation.set(-jolt+.12*p,0,.17*p);u.body.position.y=1.04+breathe*(1+p);
  u.legs[0].rotation.x=-1.62*p;u.knees[0].rotation.x=.35*p;
  u.legs[1].rotation.x=-1.50*p;u.legs[1].rotation.z=-.27*p;u.knees[1].rotation.x=.25*p;
  u.arms[0].rotation.set(.25*p,0,-.22*p);u.elbows[0].rotation.x=-.09;
  u.arms[1].rotation.set(-.70*p,0,-.96*p);u.elbows[1].rotation.set(-1.85*p,0,-.3*p);
  u.head.rotation.x=(pose==='recover'?.05:.20)*p;u.head.rotation.z=-.11*p;
  if(!speaking&&pose==='hit'){u.mouth.scale.y=1.4;u.lids.forEach(l=>l.scale.y=.45);}
 }
 if(pose==='tend'){
  u.root.position.y=-.46;u.body.rotation.x=.34;u.head.rotation.x=.26;
  u.legs[0].rotation.x=-1.5;u.knees[0].rotation.x=1.5;u.legs[1].rotation.x=.45;u.knees[1].rotation.x=1.65;
  u.arms[0].rotation.set(-1.28,0,-.12);u.elbows[0].rotation.x=-.12;
  u.arms[1].rotation.set(-1.14,0,.08);u.elbows[1].rotation.x=-.25;
 }
 if(speaking&&['listen','paper','read'].includes(pose)){u.arms[0].rotation.x=-.23-Math.sin(voiceTime*1.3)*.13;u.elbows[0].rotation.x=-.5-Math.sin(voiceTime*1.3)*.25;u.hands[0].rotation.z=-.20;}
 // The rig faces local -Z. Positive shoulder pitch brings a hand forward;
 // inverse knee pitch folds the heel back, and negative head pitch looks down.
 for(const part of [u.body,u.head,...u.arms,...u.elbows,...u.hands,...u.legs,...u.knees])part.rotation.x*=-1;
 if(u.paper.visible)u.paper.rotation.x*=-1;
 if(pose==='hit'||pose==='recover'){
  const p=pose==='recover'?1:Math.max(0,Math.min(1,progress));
  reachHand(g,1,new T.Vector3(.285,-.18,0).lerp(new T.Vector3(-.25,.35,-.14),p));
 }
}

// Two articulated bones keep the hand on the shoulder instead of waving beside
// the face. Targets are expressed in the torso's local coordinate system.
function reachHand(g,index,target){
 const {arms,elbows}=g.userData,arm=arms[index],elbow=elbows[index],down=new T.Vector3(0,-1,0);
 const delta=target.clone().sub(arm.position),distance=Math.min(.569,Math.max(.015,delta.length())),direction=delta.normalize();
 const along=(.28*.28-.29*.29+distance*distance)/(2*distance),height=Math.sqrt(Math.max(0,.28*.28-along*along));
 const bend=new T.Vector3(0,-1,-.55).addScaledVector(direction,-new T.Vector3(0,-1,-.55).dot(direction)).normalize();
 const upper=direction.clone().multiplyScalar(along).addScaledVector(bend,height);
 arm.quaternion.setFromUnitVectors(down,upper.clone().normalize());
 const lower=direction.multiplyScalar(distance).sub(upper).applyQuaternion(arm.quaternion.clone().invert()).normalize();
 elbow.quaternion.setFromUnitVectors(down,lower);
}
export function tendWound(caregiver,patient){
 patient.updateWorldMatrix(true,true);caregiver.updateWorldMatrix(true,true);
 const target=patient.userData.wound.getWorldPosition(new T.Vector3());
 for(const i of [0,1]){const local=caregiver.userData.body.worldToLocal(target.clone().add(new T.Vector3(i?.035:-.025,i?.035:0,.055)));reachHand(caregiver,i,local);}
}

export function disposeTree(root,sharedTextures=[]){const geometries=new Set(),materials=new Set(),textures=new Set();root.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));});for(const m of materials){for(const k of ['map','alphaMap','normalMap'])if(m[k]&&!sharedTextures.includes(m[k]))textures.add(m[k]);m.dispose();}geometries.forEach(g=>g.dispose());textures.forEach(t=>t.dispose());root.clear();}
