import {LEVELS} from './c6-data.mjs';
export const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export const angle=x=>Math.atan2(Math.sin(x),Math.cos(x));
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
export const BLOCKS={
 release:[[-7,-5,7,12,6],[7,-5,7,12,6],[0,-10,7,3,6],[-15,5,2,28,3],[15,0,2,25,3]],
 night:[[-12,-24,8,9,6],[14,-59,7,10,6],[-12,-71,6,8,5],[-4,-35,14,.6,1.15],[9,-44,14,.6,1.1],[-10,-85,15,.6,1.15],[7,-91,12,.6,1.1]],
 lexington:[[-18,-5,7,12,7],[17,-20,10,14,9],[4,-25,11,6,7],[-6,1,13,.7,1.1],[-15,-12,.6,10,1.2],[9,9,10,.6,1.2]],
 concord:[[0,2,15,.9,1.12],[-12,0,4,1,1.12],[12,-9,7,1,1.12],[-19,4,7,10,6],[20,-20,6,8,5]],
};
function enemy(id,x,z,route,patrol=false){return {id,x,z,startX:x,startZ:z,hp:1,yaw:0,patrol,route,alert:0,cooldown:2+id*.53,dead:0,fired:0,moving:false};}
export function fresh(level,difficulty='normal'){
 const spec=LEVELS[level];if(!spec)throw new Error('Unknown level');
 return {level,difficulty,stage:0,time:0,player:{x:spec.spawn[0],z:spec.spawn[1],y:0,vy:0,yaw:0,pitch:0,health:100,stamina:100},
  hold:0,carrying:false,armed:false,loaded:true,ammo:18,reload:0,shot:0,hit:0,defense:0,wave:0,alert:0,wagonHealth:100,
  enemies:level==='night'?[enemy(0,-2,-39,[-9,5,-39],true),enemy(1,2,-80,[-8,9,-80],true),enemy(2,2,-100,[-7,9,-100],true)]:[],
  ward:{x:0,z:2,yaw:0},failed:false,finished:false,events:[],seed:1775,patrolWarned:false,spotted:false,reloadHint:false};
}
export function snapshot(s){const v=JSON.parse(JSON.stringify(s));delete v.events;return v;}
export function restore(raw,difficulty='normal'){
 if(!raw||!LEVELS[raw.level])return null;
 if(!Number.isInteger(raw.stage)||raw.stage<0||raw.stage>=LEVELS[raw.level].goals.length)return null;
 const s=fresh(raw.level,difficulty),p=raw.player,b=LEVELS[raw.level].bounds;
 if(!p||!['x','z','yaw','pitch','health'].every(k=>Number.isFinite(p[k]))||p.x<b[0]||p.x>b[1]||p.z<b[2]||p.z>b[3])return null;
 if(!Array.isArray(raw.enemies)||raw.enemies.length>20||raw.enemies.some(e=>!['x','z','hp','yaw','cooldown'].every(k=>Number.isFinite(e[k]))))return null;
 for(const k of ['time','hold','ammo','reload','shot','hit','defense','wave','alert','seed','wagonHealth'])if(!Number.isFinite(raw[k]))return null;
 Object.assign(s,raw,{difficulty,events:[],failed:false,finished:false,hold:0});
 s.player={...s.player,health:clamp(p.health,1,100),stamina:clamp(Number(p.stamina)||0,0,100),y:0,vy:0};
 s.ammo=clamp(s.ammo,0,30);s.reload=clamp(s.reload,0,4.2);return s;
}
export function collide(s,x,z,r=.3){const b=LEVELS[s.level].bounds;if(x<b[0]+r||x>b[1]-r||z<b[2]+r||z>b[3]-r)return true;
 return BLOCKS[s.level].some(([bx,bz,w,d,h])=>s.player.y<h&&Math.abs(x-bx)<w/2+r&&Math.abs(z-bz)<d/2+r);}
export function blocked(level,a,b){
 for(const [x,z,w,d,h] of BLOCKS[level]||[]){let lo=0,hi=1;
  for(const [start,end,min,max] of [[a.x,b.x,x-w/2,x+w/2],[a.z,b.z,z-d/2,z+d/2]]){const delta=end-start;
   if(Math.abs(delta)<1e-8){if(start<min||start>max){lo=2;break;}}else{let u=(min-start)/delta,v=(max-start)/delta;if(u>v)[u,v]=[v,u];lo=Math.max(lo,u);hi=Math.min(hi,v);}}
  if(lo<=hi&&lo>=0&&lo<=1&&Math.min((a.y??1.5)+((b.y??1.5)-(a.y??1.5))*lo,(a.y??1.5)+((b.y??1.5)-(a.y??1.5))*hi)<h)return true;
 }return false;
}
function random(s){s.seed=(Math.imul(1664525,s.seed)+1013904223)>>>0;return s.seed/4294967296;}
export function currentGoal(s){return LEVELS[s.level].goals[s.stage];}
export function goalNear(s){const g=currentGoal(s);return g&&distance(s.player,g)<2.5;}
function emit(s,type,data={}){s.events.push({type,...data});}
function next(s){s.stage++;s.hold=0;if(s.stage>=LEVELS[s.level].goals.length){s.finished=true;emit(s,'finish');}else emit(s,'checkpoint');}
function interact(s){
 if(s.level==='release'){if(s.stage===0){emit(s,'voice',{id:'help'});s.carrying=true;}next(s);}
 else if(s.level==='night'){if(s.stage===0){emit(s,'voice',{id:'farm.0'});emit(s,'voice',{id:'farm.1'});}if(s.stage===1){emit(s,'bell');emit(s,'voice',{id:'bell.0'});emit(s,'voice',{id:'bell.1'});}next(s);}
 else if(s.level==='lexington'){s.carrying=s.stage===0||s.stage===2;emit(s,'voice',{id:'rescue.'+Math.min(s.stage,3)});next(s);}
 else if(s.level==='concord'){if(s.stage===0){s.armed=true;emit(s,'voice',{id:'armed'});spawnWave(s);next(s);}else if(s.stage===2)next(s);}
}
function spawnWave(s){const wave=s.wave++;for(let i=0;i<3;i++)s.enemies.push(enemy(wave*3+i,(i-1)*8,-35-wave*2,[i%2?14:-13,18]));emit(s,'wave',{wave:s.wave});}
function fire(s,input){
 if(!s.armed||s.reload>0||s.shot>0)return;
 if(!s.loaded){if(!s.reloadHint){s.reloadHint=true;emit(s,'voice',{id:'reload'});}return;}
 s.loaded=false;s.shot=.26;emit(s,'shot',{x:s.player.x,z:s.player.z});
 const p=s.player,eye={x:p.x,z:p.z,y:p.y+(input.crouch?1.02:1.7)};
 const candidates=s.enemies.filter(e=>e.hp>0).map(e=>{const d=distance(p,e),bearing=Math.atan2(-(e.x-p.x),-(e.z-p.z));return {e,d,delta:Math.abs(angle(bearing-p.yaw)),vertical:Math.abs(Math.atan2(1.15-eye.y,d)-p.pitch)};}).filter(t=>t.d<65&&t.delta<(input.aim?.047:.027)+(s.difficulty==='story'?.027:0)+.28/t.d&&t.vertical<.55/t.d+.04&&!blocked(s.level,eye,{...t.e,y:1.15})).sort((a,b)=>a.d-b.d);
 if(candidates.length){candidates[0].e.hp=0;s.hit=.22;emit(s,'hit');}
 p.pitch=clamp(p.pitch+.022,-.95,.85);
}
export function tick(s,input,dt){
 s.events=[];if(s.failed||s.finished)return s.events;dt=clamp(dt,0,.05);s.time+=dt;s.shot=Math.max(0,s.shot-dt);s.hit=Math.max(0,s.hit-dt);
 const p=s.player;const moveX=(input.right?1:0)-(input.left?1:0),moveZ=(input.forward?1:0)-(input.back?1:0),moving=!!(moveX||moveZ),run=input.sprint&&p.stamina>1&&!s.carrying&&!input.crouch;
 p.yaw=angle(p.yaw+((input.lookLeft?1:0)-(input.lookRight?1:0))*dt*1.65);p.pitch=clamp(p.pitch+((input.lookUp?1:0)-(input.lookDown?1:0))*dt,-.9,.85);
 const pace=s.carrying?(s.level==='release'?2.1:2.3):input.crouch?2.15:run?7.1:4.2,normal=Math.hypot(moveX,moveZ)||1;
 const dx=(Math.cos(p.yaw)*moveX-Math.sin(p.yaw)*moveZ)*pace*dt/normal,dz=(-Math.sin(p.yaw)*moveX-Math.cos(p.yaw)*moveZ)*pace*dt/normal;
 if(!collide(s,p.x+dx,p.z))p.x+=dx;if(!collide(s,p.x,p.z+dz))p.z+=dz;
 p.stamina=clamp(p.stamina+(run&&moving?-22:16)*dt,0,100);
 if(input.jump&&!s.carrying&&p.y===0){p.vy=4.2;}p.vy-=12*dt;p.y=Math.max(0,p.y+p.vy*dt);if(p.y===0)p.vy=0;
 if(s.reload>0){s.reload=Math.max(0,s.reload-dt);if(s.reload===0){s.loaded=true;s.ammo--;emit(s,'loaded');}}
 if(input.reload&&s.armed&&!s.loaded&&s.reload===0&&s.ammo>0){s.reload=4.2;emit(s,'reload');}
 if(input.fire)fire(s,input);
 if(s.level==='release'&&s.carrying){s.ward.x=p.x+Math.cos(p.yaw)*.72;s.ward.z=p.z-Math.sin(p.yaw)*.72;s.ward.yaw=p.yaw;}
 if(s.level==='concord'&&s.stage===1){
  const pressure=s.enemies.filter(e=>e.hp>0&&e.z> -9&&!e.retreat).length;
  if(distance(p,{x:0,z:4})<19)s.defense+=dt*(pressure>=3?.2:1);
  s.wagonHealth=Math.max(0,s.wagonHealth-Math.max(0,pressure-2)*dt*(s.difficulty==='story'?.65:1.4));
  if(s.wagonHealth===0){s.failed=true;emit(s,'fail');return s.events;}
  if(s.defense>17&&s.wave===1){spawnWave(s);emit(s,'voice',{id:'wave.1'});}if(s.defense>34&&s.wave===2){spawnWave(s);emit(s,'voice',{id:'wave.2'});}
  if(s.defense>=52){emit(s,'voice',{id:'clear'});s.enemies.forEach(e=>e.retreat=true);s.stage=2;emit(s,'checkpoint');}
 }
 let maxAlert=0;
 for(const e of s.enemies){e.fired=Math.max(0,e.fired-dt);if(e.hp<=0){e.dead+=dt;continue;}const d=distance(p,e);e.moving=false;
  if(e.patrol){const oldX=e.x;e.x=e.route[0]+(e.route[1]-e.route[0])*(.5+.5*Math.sin(s.time*.27+e.id*1.7));e.yaw=e.x>oldX?-Math.PI/2:Math.PI/2;e.moving=true;
   const toward=Math.atan2(-(p.x-e.x),-(p.z-e.z)),visible=d<(input.crouch?8:13)&&Math.abs(angle(toward-e.yaw))<.95&&!blocked(s.level,{...e,y:1.5},{...p,y:input.crouch?1.0:1.7});
   e.alert=clamp(e.alert+(visible?(input.sprint?1.3:.65):-.5)*dt,0,1);maxAlert=Math.max(maxAlert,e.alert);
   if(d<18&&!s.patrolWarned){s.patrolWarned=true;emit(s,'voice',{id:'patrol'});}
   if(e.alert>.9){if(!s.spotted){s.spotted=true;emit(s,'voice',{id:'spotted'});}e.yaw=toward;}
  }else{const tx=e.retreat?(e.id%2?25:-25):e.route[0],tz=e.retreat?24:e.route[1];const len=Math.hypot(tx-e.x,tz-e.z);if(len>1.3){e.x+=(tx-e.x)/len*dt*(e.retreat?3:1.3);e.z+=(tz-e.z)/len*dt*(e.retreat?3:1.3);e.moving=true;}e.yaw=Math.atan2(-(p.x-e.x),-(p.z-e.z));}
  e.cooldown-=dt;
  if(e.cooldown<=0&&(!e.patrol||e.alert>.9)&&!e.retreat&&d<55){e.cooldown=4.8+random(s)*3.4;e.fired=.2;emit(s,'enemyShot',{x:e.x,z:e.z});
   if(!blocked(s.level,{...e,y:1.4},{...p,y:input.crouch?1.02:1.65})&&random(s)<(s.difficulty==='story'?.14:.36)){p.health=Math.max(0,p.health-(s.difficulty==='story'?10:17));emit(s,'hurt');}
  }
 }
 s.alert=maxAlert;if(!s.enemies.some(e=>e.hp>0&&(!e.patrol||e.alert>.5)))p.health=Math.min(100,p.health+dt*3);
 if(p.health<=0){s.failed=true;emit(s,'fail');return s.events;}
 if(!(s.level==='concord'&&s.stage===1)){if(input.interact&&goalNear(s)){s.hold+=dt;if(s.hold>=currentGoal(s).time)interact(s);}else s.hold=Math.max(0,s.hold-dt*3);}
 return s.events;
}



