// Fictional waterway and relief journey. Historical outcomes are not player choices.
export const TIDE_SPEC={title:'A King’s Promise',place:'VIRGINIA WATERWAYS · NOVEMBER 1775',spawn:[0,28],bounds:[-32,32,-169,37],music:'tide',mode:'COASTAL STEALTH / ESCAPE',description:'Take Isaiah’s oars. Find Jonas. Slip the lanterns and break the interception.',intro:'promiseIntro',after:'promiseEnd',goals:[
 {x:-23,z:-23,label:'Find Jonas at the abandoned landing',verb:'Bring the boat alongside',time:.8},
 {x:-23,z:-58,label:'Hide your wake in the reeds',verb:'Wait in the reeds · C quiet strokes',time:2},
 {x:23,z:-94,label:'Reach the royal tender',verb:'Let Jonas speak to the intermediary',time:.8},
 {x:23,z:-129,label:'Break through the mooring boom',verb:'Have Jonas cut the boom rope',time:1.6},
 {x:0,z:-161,label:'Outrun the interception · reach the sheltered inlet',verb:'Pull into the sheltered inlet',time:.5}
]};
export const CREEK_SPEC={title:'The Other Bank',place:'MOORES CREEK · NORTH CAROLINA · FEBRUARY 27, 1776',spawn:[9,23],bounds:[-24,24,-38,30],music:'home',mode:'AFTERMATH / RESCUE',description:'Cross the broken bridge after the battle. Bring a wounded Loyalist back.',intro:'creekIntro',after:'creekEnd',goals:[
 {x:-8,z:16,label:'Get permission to cross the line',verb:'Show the Mecklenburg dispatch',time:.7},
 {x:0,z:-2,label:'Replace the missing boards',verb:'Lay the loose boards across the gap',time:1.8},
 {x:1,z:-27,label:'Find the wounded man on the other bank',verb:'Help the wounded Loyalist',time:1},
 {x:9,z:18,label:'Bring him back across the bridge',verb:'Lower him onto the blanket',time:1},
 {x:18,z:24,label:'Return to the coastal relief boat',verb:'Cast off',time:.7}
]};
export const TIDE_BLOCKS=[[-6,1,13,18,2.4],[10,-39,20,18,2.2],[-12,-79,22,19,2.6],[7,-116,18,15,2.2]];
export const CREEK_BLOCKS=[[-14,-10,23,13,4],[14,-10,23,13,4],[-13,9,13,1.2,1.1],[12,7,15,1.2,1.1]];
export const REEDS=[{x:-23,z:-58,r:8},{x:25,z:-61,r:7},{x:-25,z:-106,r:7}];
export const PATROLS=[{x:15,z:-15,span:9},{x:-3,z:-60,span:9},{x:18,z:-100,span:5}];
export const freshPromise=()=>({vx:0,vz:0,yaw:0,exposure:0,spotted:false,aboard:false,boom:false,hidden:false,pursuit:false,chaserX:22,chaserZ:-103,shotClock:0,warning:0,targetX:0,targetZ:0,bridge:false,rescued:false,quiet:false,speed:0});
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),angle=v=>Math.atan2(Math.sin(v),Math.cos(v));
const emit=(s,type,data={})=>s.events.push({type,...data}),say=(s,id)=>emit(s,'voice',{id});
export function patrolAt(i,time){const a=PATROLS[i];return {x:a.x+Math.sin(time*.19+i*2)*a.span,z:a.z,yaw:Math.sin(time*.27+i)*1.1+Math.PI};}
export function inReeds(p){return REEDS.some(r=>Math.hypot(p.x-r.x,p.z-r.z)<r.r);}
export function moveBoat(s,input,dt,collide){const p=s.player,h=s.promise,ax=(input.right?1:0)-(input.left?1:0),az=(input.forward?1:0)-(input.back?1:0),moving=!!(ax||az),fast=input.sprint&&p.stamina>2&&!input.crouch;
 const speed=input.crouch?2.7:fast?11:6.8,n=Math.hypot(ax,az)||1,k=1-Math.exp(-dt*(moving?3:6));
 h.vx+=((Math.cos(p.yaw)*ax-Math.sin(p.yaw)*az)*speed/n-h.vx)*k;h.vz+=((-Math.sin(p.yaw)*ax-Math.cos(p.yaw)*az)*speed/n-h.vz)*k;
 // Axis sliding keeps a glancing contact recoverable; no health drain from scenery.
 if(!collide(s,p.x+h.vx*dt,p.z,.8,0))p.x+=h.vx*dt;else h.vx=0;
 if(!collide(s,p.x,p.z+h.vz*dt,.8,0))p.z+=h.vz*dt;else h.vz=0;
 h.speed=Math.hypot(h.vx,h.vz);if(h.speed>.2)h.yaw=angle(h.yaw+angle(Math.atan2(-h.vx,-h.vz)-h.yaw)*Math.min(1,dt*5));
 h.quiet=!!input.crouch;h.hidden=inReeds(p)&&h.speed<3.3;p.y=0;p.vy=0;p.stamina=clamp(p.stamina+(moving&&fast?-16:20)*dt,0,100);
}
export function promiseCanUse(s,input){return s.level!=='tidewater'||s.stage!==1||input.crouch&&s.promise.hidden&&s.promise.exposure<.15;}
export function interactPromise(s){const h=s.promise;
 if(s.level==='tidewater'){
  if(s.stage===0){h.aboard=true;h.vx=h.vz=0;}
  if(s.stage===1)say(s,'promise.reeds');
  if(s.stage===2){h.pursuit=true;h.chaserX=23;h.chaserZ=-72;h.vx=h.vz=0;}
  if(s.stage===3){h.boom=true;say(s,'promise.cut');}
 }else{
  if(s.stage===0){say(s,'creek.orders');say(s,'creek.authority');}
  if(s.stage===1){h.bridge=true;say(s,'creek.boards');}
  if(s.stage===2){s.carrying=true;say(s,'creek.lift');}
  if(s.stage===3){h.rescued=true;s.carrying=false;say(s,'creek.safe');}
 }
 s.stage++;s.hold=0;
 if(s.stage>=(s.level==='tidewater'?TIDE_SPEC:CREEK_SPEC).goals.length){s.finished=true;emit(s,'finish');}
 else{emit(s,'checkpoint');if(s.level==='tidewater'&&s.stage===1)emit(s,'promiseScene',{key:'promiseJoin'});if(s.level==='tidewater'&&s.stage===3)emit(s,'promiseScene',{key:'promiseContact'});}
}
export function updatePromise(s,input,dt,{blocked,collide}){const h=s.promise,p=s.player;if(s.level!=='tidewater')return;
 let seen=false;
 if(!h.hidden&&s.stage<3){for(let i=0;i<PATROLS.length;i++){const a=patrolAt(i,s.time),d=Math.hypot(p.x-a.x,p.z-a.z),bearing=Math.atan2(-(p.x-a.x),-(p.z-a.z));if(d<22&&Math.abs(angle(bearing-a.yaw))<.66&&!blocked('tidewater',{...a,y:1.3},{...p,y:1.2}))seen=true;}}
 h.exposure=clamp(h.exposure+(seen?(input.sprint?.46:.24):-.42)*dt,0,1);s.alert=h.exposure;
 if(h.exposure>.85&&!h.spotted){h.spotted=true;say(s,'promise.spotted');}
 if(h.exposure===0)h.spotted=false;
 // Telegraph each shot at a fixed position. Moving or using reed cover avoids it.
 const danger=h.pursuit||h.exposure>.85;
 if(h.pursuit){const d=Math.hypot(p.x-h.chaserX,p.z-h.chaserZ),speed=h.boom?6.6:4.7;if(d>8){const nx=h.chaserX+(p.x-h.chaserX)/d*speed*dt,nz=h.chaserZ+(p.z-h.chaserZ)/d*speed*dt;if(!collide(s,nx,h.chaserZ,.8,0))h.chaserX=nx;if(!collide(s,h.chaserX,nz,.8,0))h.chaserZ=nz;}}
 if(danger&&!h.hidden){h.shotClock+=dt;if(h.shotClock>5.5&&h.warning===0){h.shotClock=0;h.warning=1.8;h.targetX=p.x;h.targetZ=p.z;emit(s,'waterWarning');}}
 if(h.warning>0){h.warning=Math.max(0,h.warning-dt);if(h.warning===0){emit(s,'waterShot',{x:h.targetX,z:h.targetZ});if(!h.hidden&&Math.hypot(p.x-h.targetX,p.z-h.targetZ)<3.5){p.health=Math.max(0,p.health-(s.difficulty==='story'?10:23));s.lastDamage=s.time;emit(s,'hurt');}}}
 if(h.pursuit&&Math.hypot(p.x-h.chaserX,p.z-h.chaserZ)<10&&!h.hidden){p.health=Math.max(0,p.health-dt*(s.difficulty==='story'?2:5));s.lastDamage=s.time;}
}
export function promiseContext(s){const h=s.promise;
 if(s.level==='moorescreek')return s.carrying?'The crossing is narrow. Keep him on your shoulder.':s.stage===1?'The battle is over. Make a way back for the wounded.':'';
 if(h.warning>0)return 'Musket aimed at your wake · change direction';
 if(h.hidden)return 'HIDDEN IN REEDS · C toggles quiet strokes';
 if(h.pursuit)return h.boom?'SHIFT · hard strokes · make the inlet':'The skiff is closing. Jonas can cut the rope ahead.';
 return s.time<22?'WASD row · mouse / arrows look · Shift hard strokes · C quiet strokes':s.stage===1?'Slow down inside the reeds. Let the lanterns pass.':'';
}
