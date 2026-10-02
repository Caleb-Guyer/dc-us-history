import {CHASE_LEVELS,CHASE_BLOCKS,freshChase,validChase,chaseGoal,chaseNear,chaseCanUse,chaseMounted,chaseOperating,chaseFollowing,chaseBlocked,moveChaseHorse,interactChase,updateChase} from './c6-chase.mjs?v=4.15.0-published';
import {INLAND_LEVELS,INLAND_BLOCKS,freshInland,validInland,inlandGoal,inlandNear,inlandCanUse,inlandWithdrawing,inlandEscorting,inlandBlocked,interactInland,updateInland} from './c6-inland.mjs?v=4.15.0-published';
import {SOUTH_LEVELS,SOUTH_BLOCKS,freshSouth,validSouth,southGoal,southNear,southCanUse,southOperating,southBoating,southCutting,southEscorting,southWaterBlocked,moveSouthBoat,interactSouth,updateSouth} from './c6-south.mjs?v=4.15.0-published';
import {WIDER_LEVELS,WIDER_BLOCKS,freshWider,validWider,widerGoal,widerNear,widerCanUse,widerOperating,widerBoating,widerEscorting,moveWiderBoat,interactWider,updateWider} from './c6-wider.mjs?v=4.15.0-published';
import {WINTER_LEVELS,WINTER_BLOCKS,freshWinter,validWinter,winterGoal,winterNear,winterCanUse,winterOperating,winterHauling,winterWashing,winterWaterBlocked,interactWinter,updateWinter} from './c6-winter.mjs?v=4.15.0-published';
import {ALBANY_LEVELS,ALBANY_BLOCKS,freshAlbany,validAlbany,albanyOperating,albanyFighting,albanyCanUse,albanyGoal,interactAlbany,updateAlbany} from './c6-albany.mjs?v=4.15.0-published';
import {PHILADELPHIA_LEVELS,PHILADELPHIA_BLOCKS,freshPhiladelphia,validPhiladelphia,philadelphiaGoal,philadelphiaNear,philadelphiaCanUse,philadelphiaDefending,philadelphiaOperating,philadelphiaEscorting,roadWaterBlocked,interactPhiladelphia,updatePhiladelphia} from './c6-philadelphia.mjs?v=4.15.0-published';
import {CROSSING_LEVELS,CROSSING_BLOCKS,freshCrossing,validCrossing,crossingGoal,crossingNear,crossingCanUse,crossingBoating,crossingFighting,moveStormBoat,interactCrossing,updateCrossing} from './c6-crossing.mjs?v=4.15.0-published';
import {TIDE_BLOCKS,CREEK_BLOCKS,freshPromise,moveBoat,updatePromise,interactPromise,promiseCanUse} from './c6-promise.mjs?v=4.15.0-published';
import {HILL_BLOCKS,freshHill,hillGoal,interactHill,updateHill,hillDefending} from './c6-hill.mjs?v=4.15.0-published';
import {FORT_BLOCKS,freshFort,fortGoal,interactFort,updateFort} from './c6-fort.mjs?v=4.15.0-published';
import {LEVELS} from './c6-data.mjs?v=4.15.0-published';
export const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export const angle=x=>Math.atan2(Math.sin(x),Math.cos(x));
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
import {SNOW_BLOCKS,RIDGE_BLOCKS,BOSTON_BLOCKS,freshLift,liftGoal,interactLift,updateLift,liftCanUse,liftHauling} from './c6-lift.mjs?v=4.15.0-published';
import {PRINT_BLOCKS,DISPATCH_BLOCKS,freshPaper,paperGoal,paperNear,paperCanUse,paperOperating,interactPaper,updatePaper} from './c6-paper.mjs?v=4.15.0-published';
import {RETREAT_LEVELS,RETREAT_BLOCKS,freshRetreat,validRetreat,retreatGoal,retreatNear,retreatCanUse,retreatBoating,retreatDefending,moveFerry,interactRetreat,updateRetreat} from './c6-retreat.mjs?v=4.15.0-published';
export const BLOCKS={...CHASE_BLOCKS,...INLAND_BLOCKS,...SOUTH_BLOCKS,...WIDER_BLOCKS,...WINTER_BLOCKS,...ALBANY_BLOCKS,...PHILADELPHIA_BLOCKS,...CROSSING_BLOCKS,...RETREAT_BLOCKS,printshop:PRINT_BLOCKS,dispatch:DISPATCH_BLOCKS,snowpass:SNOW_BLOCKS,dorchester:RIDGE_BLOCKS,bostonreturn:BOSTON_BLOCKS,tidewater:TIDE_BLOCKS,moorescreek:CREEK_BLOCKS,
 ticonderoga:FORT_BLOCKS,
 breeds:HILL_BLOCKS,
 release:[[-7,-5,7,12,6],[7,-5,7,12,6],[0,-10,7,3,6],[-15,5,2,28,3],[15,0,2,25,3]],
 night:[[-12,-24,8,9,6],[14,-59,7,10,6],[-12,-71,6,8,5],[-4,-35,14,.6,1.15],[9,-44,14,.6,1.1],[-10,-85,15,.6,1.15],[7,-91,12,.6,1.1]],
 lexington:[[-18,-5,7,12,7],[17,-20,10,14,9],[4,-25,11,6,7],[-6,1,13,.7,1.1],[-15,-12,.6,10,1.2],[9,9,10,.6,1.2]],
 concord:[[0,2,15,.9,1.12],[-12,0,4,1,1.12],[12,-9,7,1,1.12],[-19,4,7,10,6],[20,-20,6,8,5]],
};
function enemy(id,x,z,route,patrol=false){return {id,x,z,startX:x,startZ:z,hp:1,yaw:0,patrol,route,alert:0,cooldown:2+id*.53,dead:0,fired:0,moving:false};}
export function fresh(level,difficulty='normal'){
 const spec=LEVELS[level];if(!spec)throw new Error('Unknown level');
 return {level,difficulty,stage:0,time:0,player:{x:spec.spawn[0],z:spec.spawn[1],y:0,vy:0,yaw:0,pitch:0,health:100,stamina:100},
  chase:CHASE_LEVELS[level]?freshChase():null,inland:INLAND_LEVELS[level]?freshInland():null,south:SOUTH_LEVELS[level]?freshSouth():null,wider:WIDER_LEVELS[level]?freshWider():null,winter:WINTER_LEVELS[level]?freshWinter():null,albany:ALBANY_LEVELS[level]?freshAlbany():null,philadelphia:PHILADELPHIA_LEVELS[level]?freshPhiladelphia():null,crossing:CROSSING_LEVELS[level]?freshCrossing():null,retreat:RETREAT_LEVELS[level]?freshRetreat(level):null,paper:['printshop','dispatch'].includes(level)?freshPaper():null,lift:['snowpass','dorchester','bostonreturn'].includes(level)?freshLift(level):null,promise:['tidewater','moorescreek'].includes(level)?freshPromise():null,hill:level==='breeds'?freshHill():null,fort:level==='ticonderoga'?freshFort():null,hold:0,carrying:false,armed:false,loaded:true,ammo:18,reload:0,shot:0,hit:0,defense:0,wave:0,alert:0,wagonHealth:100,
  lastDamage:-99,volley:0,volleyWarning:false,suppliesUsed:false,shotsFired:0,kills:0,
  enemies:level==='night'?[enemy(0,-2,-39,[-9,5,-39],true),enemy(1,2,-80,[-8,9,-80],true),enemy(2,2,-100,[-7,9,-100],true)]:[],
  ward:{x:level==='night'?1.5:0,z:level==='night'?21:2,yaw:0},failed:false,finished:false,events:[],seed:1775,patrolWarned:false,spotted:false,reloadHint:false};
}
export function snapshot(s){const v=JSON.parse(JSON.stringify(s));delete v.events;return v;}
export function restore(raw,difficulty='normal'){
 if(!raw||!Object.hasOwn(LEVELS,raw.level))return null;
 if(!Number.isInteger(raw.stage)||raw.stage<0||raw.stage>=LEVELS[raw.level].goals.length)return null;
 const s=fresh(raw.level,difficulty),p=raw.player,b=LEVELS[raw.level].bounds;
 if(!p||!['x','z','yaw','pitch','health'].every(k=>Number.isFinite(p[k]))||p.x<b[0]||p.x>b[1]||p.z<b[2]||p.z>b[3])return null;
 if(!Array.isArray(raw.enemies)||raw.enemies.length>20||raw.enemies.some(e=>!['x','z','hp','yaw','cooldown'].every(k=>Number.isFinite(e[k]))))return null;
 for(const k of ['time','hold','ammo','reload','shot','hit','defense','wave','alert','seed','wagonHealth'])if(!Number.isFinite(raw[k]))return null;
 if(raw.level==='ticonderoga'&&(!raw.fort||!['haul','crew','seen','look','sentryX','sentryZ','captureTime'].every(k=>Number.isFinite(raw.fort[k]))))return null;
 if(raw.level==='breeds'&&(!raw.hill||!['phase','clock','line','teamAmmo','volleyCooldown','allyClock','crewFlash','rescues','wardProgress','shellIn','shellX','shellZ','shellClock','signalCount'].every(k=>Number.isFinite(raw.hill[k]))||raw.hill.line<0||raw.hill.line>100||raw.hill.phase<0||raw.hill.phase>3))return null;
 if(['tidewater','moorescreek'].includes(raw.level)&&(!raw.promise||!['vx','vz','yaw','exposure','chaserX','chaserZ','shotClock','warning','targetX','targetZ','speed'].every(k=>Number.isFinite(raw.promise[k]))||raw.promise.exposure<0||raw.promise.exposure>1))return null;
 if(['snowpass','dorchester','bostonreturn'].includes(raw.level)){const h=raw.lift;if(!h||!['x','z','vx','vz','yaw','strain','speed','slides','settled','haulTime','travel'].every(k=>Number.isFinite(h[k]))||h.x<b[0]||h.x>b[1]||h.z<b[2]||h.z>b[3]||h.strain<0||h.strain>1||h.speed<0||h.speed>3.51||h.slides<0||!['attached','braced','balanced','anchored','barrier','shutters','ballast','warned','brake'].every(k=>typeof h[k]==='boolean'))return null;}
 if(['printshop','dispatch'].includes(raw.level)){const q=raw.paper;if(!q||!['cooperation','type','block','proofX','proofZ','carriage','beat','stroke','ink','sheets','spoiled','stock','quality','rain','wetness','travel'].every(k=>Number.isFinite(q[k]))||q.cooperation<0||q.cooperation>1||q.type<0||q.type>3||q.carriage<0||q.carriage>1||q.sheets<0||q.sheets>3||q.stock<0||q.stock>8||q.wetness<0||q.wetness>1||q.proofX<2||q.proofX>7.1||!['shared','proofCaught','proofMended','atPress','pressHeld','useHeld','sheltered','damaged','recovered','warning'].every(k=>typeof q[k]==='boolean')||!['feed','in','stroke','out','take'].includes(q.phase)||!['','mara','hart'].includes(q.representative)||!['','common','reserve'].includes(q.allocation)||!['','neighbors','harbor'].includes(q.route)||!Array.isArray(q.delivered)||new Set(q.delivered).size!==q.delivered.length||q.delivered.some(k=>!['local','france','spain'].includes(k)))return null;}
 if(CHASE_LEVELS[raw.level]&&!validChase(raw.chase,b))return null;
 if(INLAND_LEVELS[raw.level]&&!validInland(raw.inland,b))return null;
 if(SOUTH_LEVELS[raw.level]&&!validSouth(raw.south,b))return null;
 if(WIDER_LEVELS[raw.level]&&!validWider(raw.wider,b))return null;
 if(WINTER_LEVELS[raw.level]&&!validWinter(raw.winter,b))return null;
 if(ALBANY_LEVELS[raw.level]&&!validAlbany(raw.albany))return null;
 if(PHILADELPHIA_LEVELS[raw.level]&&!validPhiladelphia(raw.philadelphia,b))return null;
 if(CROSSING_LEVELS[raw.level]&&!validCrossing(raw.crossing,b))return null;
 if(RETREAT_LEVELS[raw.level]&&!validRetreat(raw.retreat,b))return null;
 Object.assign(s,raw,{difficulty,events:[],failed:false,finished:false,hold:0});
 s.player={...s.player,health:clamp(p.health,1,100),stamina:clamp(Number(p.stamina)||0,0,100),y:0,vy:0};
 s.lastDamage=Number.isFinite(s.lastDamage)?s.lastDamage:-99;s.shotsFired=Number.isFinite(s.shotsFired)?s.shotsFired:0;s.kills=Number.isFinite(s.kills)?s.kills:0;s.volley=0;s.volleyWarning=false;if(!s.ward||!Number.isFinite(s.ward.x)||!Number.isFinite(s.ward.z))s.ward={x:p.x+.8,z:p.z+1,yaw:p.yaw};s.ammo=clamp(s.ammo,0,30);s.reload=clamp(s.reload,0,4.2);return s;
}
export function collide(s,x,z,r=.3,feet=s.player.y){const b=LEVELS[s.level].bounds;if(x<b[0]+r||x>b[1]-r||z<b[2]+r||z>b[3]-r)return true;
 if(s.chase&&chaseBlocked(s,x,z,r,feet))return true;
 if(s.inland&&inlandBlocked(s,x,z,r))return true;
 if(s.south&&southWaterBlocked(s,x,z,r,feet))return true;
 if(s.level==='openwater'&&!s.wider.aboard&&feet<.5&&!(Math.abs(x)<6&&z>6))return true;
 if(s.level==='coastfire'&&z>31&&feet<.5)return true;
 if(s.level==='coastfire'&&!s.wider.beam&&Math.abs(x-18)<5+r&&Math.abs(z+38)<.3+r)return true;
 if(s.level==='thawroad'&&winterWaterBlocked(s.winter,x,z,r,s.player))return true;
 if(s.level==='hudsonwatch'&&x>30.7-r)return true;
 if(s.level==='albanywoods'&&s.albany.fall>.8&&feet<.6&&Math.abs(x+1)<6+r&&Math.abs(z+24)<.4+r)return true;
 if(s.level==='albanywoods'&&!s.albany.passage&&Math.abs(x+19)<2.6+r&&Math.abs(z+27)<.04+r)return true;
 if(s.level==='saratogaring'&&s.albany.barrier&&feet<.6&&Math.abs(x-18)<4.5+r&&Math.abs(z+22)<.3+r)return true;
 if(s.level==='congressroad'&&roadWaterBlocked(s.philadelphia,x,z,r))return true;
 if(s.level==='congressroad'&&!s.philadelphia.gate&&Math.abs(x-23)<4.5+r&&Math.abs(z+35)<.1+r)return true;
 if(s.level==='delaware'&&feet<.5&&!s.crossing.aboard&&!(Math.abs(x)<5.7&&z>5.5))return true;
 if(s.level==='eastriver'&&feet<.5&&!s.retreat.aboard&&!(Math.abs(x)<5.7&&(z>5.5||z<-94)))return true;
 if(s.level==='bostonreturn'&&!s.lift.barrier&&Math.abs(x)<7&&Math.abs(z-14)<.22+r)return true;
 if(s.level==='moorescreek'&&!s.promise.bridge&&Math.abs(x)<2.8&&z<-3+r&&z>-8-r)return true;
 if(s.level==='tidewater'&&!s.promise.boom&&Math.abs(x-23)<4.1+r&&Math.abs(z+130)<.2+r)return true;
 return BLOCKS[s.level].some(([bx,bz,w,d,h])=>feet<h&&Math.abs(x-bx)<w/2+r&&Math.abs(z-bz)<d/2+r);}
export function blocked(level,a,b){
 for(const [x,z,w,d,h] of BLOCKS[level]||[]){let lo=0,hi=1;
  for(const [start,end,min,max] of [[a.x,b.x,x-w/2,x+w/2],[a.z,b.z,z-d/2,z+d/2]]){const delta=end-start;
   if(Math.abs(delta)<1e-8){if(start<min||start>max){lo=2;break;}}else{let u=(min-start)/delta,v=(max-start)/delta;if(u>v)[u,v]=[v,u];lo=Math.max(lo,u);hi=Math.min(hi,v);}}
  if(lo<=hi&&lo>=0&&lo<=1&&Math.min((a.y??1.5)+((b.y??1.5)-(a.y??1.5))*lo,(a.y??1.5)+((b.y??1.5)-(a.y??1.5))*hi)<h)return true;
 }return false;
}
function random(s){s.seed=(Math.imul(1664525,s.seed)+1013904223)>>>0;return s.seed/4294967296;}
// Replan only when solid scenery separates Ward from the player's shoulder.
function companionPath(s,a,tx,tz){
 const nearest=(x,z)=>{const options=[];for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){const p={x:Math.round(x)+dx,z:Math.round(z)+dz};if(!collide(s,p.x,p.z,.3,0))options.push(p);}return options.sort((a,b)=>Math.hypot(a.x-x,a.z-z)-Math.hypot(b.x-x,b.z-z))[0];};
 const start=nearest(a.x,a.z),goal=nearest(tx,tz);if(!start||!goal)return [];
 const key=p=>p.x+','+p.z,queue=[start],parents=new Map([[key(start),null]]);let end=null;
 for(let i=0;i<queue.length&&i<10000;i++){const p=queue[i];if(p.x===goal.x&&p.z===goal.z){end=p;break;}
  const steps=[[1,0],[-1,0],[0,1],[0,-1]].map(([x,z])=>({x:p.x+x,z:p.z+z})).sort((a,b)=>distance(a,goal)-distance(b,goal));
  for(const n of steps){const k=key(n);if(parents.has(k)||collide(s,n.x,n.z,.3,0))continue;parents.set(k,p);queue.push(n);}
 }
 const path=[];while(end){path.unshift(end);end=parents.get(key(end));}return path;
}
export function currentGoal(s){return s.chase?chaseGoal(s):s.inland?inlandGoal(s):s.south?southGoal(s):s.wider?widerGoal(s):s.winter?winterGoal(s):s.albany?albanyGoal(s):s.philadelphia?philadelphiaGoal(s):s.crossing?crossingGoal(s):s.retreat?retreatGoal(s):s.paper?paperGoal(s):s.lift?liftGoal(s):s.level==='breeds'?hillGoal(s):s.level==='ticonderoga'?fortGoal(s):LEVELS[s.level].goals[s.stage];}
export function goalNear(s){if(s.chase)return chaseNear(s);if(s.inland)return inlandNear(s);if(s.south)return southNear(s);if(s.wider)return widerNear(s);if(s.winter)return winterNear(s);if(s.philadelphia)return philadelphiaNear(s);if(s.crossing)return crossingNear(s);if(s.retreat)return retreatNear(s);if(s.paper)return paperNear(s);const g=currentGoal(s);return g&&distance(s.player,g)<2.5;}
function emit(s,type,data={}){s.events.push({type,...data});}
function next(s){s.stage++;s.hold=0;if(s.stage>=LEVELS[s.level].goals.length){s.finished=true;emit(s,'finish');}else emit(s,'checkpoint');}
function interact(s){
 if(s.chase)interactChase(s);
 else if(s.inland)interactInland(s);
 else if(s.south)interactSouth(s);
 else if(s.wider)interactWider(s);
 else if(s.winter)interactWinter(s);
 else if(s.albany)interactAlbany(s);
 else if(s.philadelphia)interactPhiladelphia(s);
 else if(s.crossing)interactCrossing(s);
 else if(s.retreat)interactRetreat(s);
 else if(s.paper)interactPaper(s);
 else if(s.lift)interactLift(s);
 else if(s.promise)interactPromise(s);
 else if(s.level==='breeds')interactHill(s);
 else if(s.level==='ticonderoga')interactFort(s);
 else if(s.level==='release'){if(s.stage===0){emit(s,'voice',{id:'help'});s.carrying=true;}next(s);}
 else if(s.level==='night'){if(s.stage===0){emit(s,'voice',{id:'farm.0'});emit(s,'voice',{id:'farm.1'});}if(s.stage===1){emit(s,'bell');emit(s,'voice',{id:'bell.0'});emit(s,'voice',{id:'bell.1'});}next(s);}
 else if(s.level==='lexington'){const stage=s.stage;s.carrying=stage===0||stage===2;if(stage===0){emit(s,'voice',{id:'rescue.0'});emit(s,'voice',{id:'rescue.1'});}else if(stage===1)emit(s,'voice',{id:'rescue.2'});else if(stage===3)emit(s,'voice',{id:'rescue.3'});if(stage===1||stage===3){s.player.health=Math.min(100,s.player.health+35);emit(s,'rescue');}next(s);}
 else if(s.level==='concord'){if(s.stage===0){s.armed=true;emit(s,'voice',{id:'armed'});spawnWave(s);next(s);}else if(s.stage===2)next(s);}
}
function spawnWave(s){const wave=s.wave++;for(let i=0;i<3;i++)s.enemies.push(enemy(wave*3+i,(i-1)*8,-35-wave*2,[i%2?14:-13,18]));emit(s,'wave',{wave:s.wave});}
function fire(s,input){
 if(!s.armed||s.reload>0||s.shot>0)return;
 if(!s.loaded){if(!s.reloadHint){s.reloadHint=true;emit(s,'voice',{id:'reload'});}return;}
 s.loaded=false;s.shot=.26;s.shotsFired++;emit(s,'shot',{x:s.player.x,z:s.player.z});
 const p=s.player,eye={x:p.x,z:p.z,y:p.y+(input.crouch?1.02:1.7)};
 const candidates=s.enemies.filter(e=>e.hp>0&&!e.surrender).map(e=>{const d=distance(p,e),bearing=Math.atan2(-(e.x-p.x),-(e.z-p.z));return {e,d,delta:Math.abs(angle(bearing-p.yaw)),vertical:Math.abs(Math.atan2(1.15-eye.y,d)-p.pitch)};}).filter(t=>t.d<65&&t.delta<(input.aim?.047:.027)+(s.difficulty==='story'?.027:0)+.28/t.d&&t.vertical<.55/t.d+.04&&!blocked(s.level,eye,{...t.e,y:1.15})).sort((a,b)=>a.d-b.d);
 if(candidates.length){candidates[0].e.hp=0;s.kills++;s.hit=.22;emit(s,'hit',{x:candidates[0].e.x,z:candidates[0].e.z});}
 p.pitch=clamp(p.pitch+.022,-.95,.85);
}
export function tick(s,input,dt){
 s.events=[];if(s.failed||s.finished)return s.events;dt=clamp(dt,0,.05);s.time+=dt;s.shot=Math.max(0,s.shot-dt);s.hit=Math.max(0,s.hit-dt);
 const p=s.player;const moveX=(input.right?1:0)-(input.left?1:0),moveZ=(input.forward?1:0)-(input.back?1:0),moving=!!(moveX||moveZ),run=input.sprint&&p.stamina>1&&!s.carrying&&!input.crouch&&!liftHauling(s);
 p.yaw=angle(p.yaw+((input.lookLeft?1:0)-(input.lookRight?1:0))*dt*1.65);p.pitch=clamp(p.pitch+((input.lookUp?1:0)-(input.lookDown?1:0))*dt,-.9,.85);
 const pace=chaseFollowing(s)?2.8:inlandWithdrawing(s)?2.6:inlandEscorting(s)?2.1:southEscorting(s)?(s.level==='charlestonring'?(input.jump?0:1.85):2.1):widerEscorting(s)?2.1:winterWashing(s)?0:winterHauling(s)?(input.jump?0:1.95):philadelphiaEscorting(s)?1.8:paperOperating(s)?0:liftHauling(s)?(input.jump?0:s.level==='dorchester'?2.5:3.25):s.level==='ticonderoga'&&s.fort.rope?1.05:s.carrying?(s.level==='release'?2.1:2.3):input.crouch?2.15:run?7.1:4.2,normal=Math.hypot(moveX,moveZ)||1;
 const dx=(Math.cos(p.yaw)*moveX-Math.sin(p.yaw)*moveZ)*pace*dt/normal,dz=(-Math.sin(p.yaw)*moveX-Math.cos(p.yaw)*moveZ)*pace*dt/normal;
 if(chaseMounted(s))moveChaseHorse(s,input,dt,collide);else if(southBoating(s))moveSouthBoat(s,input,dt,collide);else if(widerBoating(s))moveWiderBoat(s,input,dt,collide);else if(crossingBoating(s))moveStormBoat(s,input,dt,collide);else if(retreatBoating(s))moveFerry(s,input,dt,collide);else if(s.level==='tidewater')moveBoat(s,input,dt,collide);else{if(!collide(s,p.x+dx,p.z))p.x+=dx;if(!collide(s,p.x,p.z+dz))p.z+=dz;}
 if(s.level!=='tidewater')p.stamina=clamp(p.stamina+(run&&moving?-22:16)*dt,0,100);
 if(!chaseMounted(s)){if(input.jump&&!southBoating(s)&&!southEscorting(s)&&!(s.south&&s.level==='charlestonlast'&&s.stage===2)&&!widerBoating(s)&&!winterHauling(s)&&!winterWashing(s)&&!albanyOperating(s)&&!crossingBoating(s)&&!retreatBoating(s)&&!paperOperating(s)&&!liftHauling(s)&&s.level!=='tidewater'&&!s.carrying&&p.y===0){p.vy=4.2;}p.vy-=12*dt;p.y=Math.max(0,p.y+p.vy*dt);if(p.y===0)p.vy=0;}
 if(s.reload>0){s.reload=Math.max(0,s.reload-dt);if(s.reload===0){s.loaded=true;s.ammo--;emit(s,'loaded');}}
 if(input.reload&&s.armed&&!s.loaded&&s.reload===0&&s.ammo>0){s.reload=4.2;emit(s,'reload');}
 if(input.fire)fire(s,input);
 if((s.level==='release'&&s.carrying)||s.level==='night'||s.level==='cityrefuge'&&s.retreat.escort){
  const side=s.carrying?.86:1.25,back=s.carrying?.3:2.3;
  let tx=p.x+Math.cos(p.yaw)*side+Math.sin(p.yaw)*back,tz=p.z-Math.sin(p.yaw)*side+Math.cos(p.yaw)*back;
  if(blocked(s.level,{...s.ward,y:.3},{x:tx,z:tz,y:.3})){
   if(!s.ward.path||s.time>(s.ward.repathAt||0)){s.ward.path=companionPath(s,s.ward,tx,tz);s.ward.repathAt=s.time+1.5;}
   while(s.ward.path.length&&distance(s.ward,s.ward.path[0])<.3)s.ward.path.shift();
   if(s.ward.path.length){tx=s.ward.path[0].x;tz=s.ward.path[0].z;}
  }else s.ward.path=null;
  const d=Math.hypot(tx-s.ward.x,tz-s.ward.z),pace=Math.min(d,(s.carrying?4.2:6)*dt);
  if(d>.05){const dx=(tx-s.ward.x)/d*pace,dz=(tz-s.ward.z)/d*pace;
   if(!collide(s,s.ward.x+dx,s.ward.z,.22,0))s.ward.x+=dx;
   if(!collide(s,s.ward.x,s.ward.z+dz,.22,0))s.ward.z+=dz;
   s.ward.yaw=Math.atan2(-(tx-s.ward.x),-(tz-s.ward.z));
  }
 }
 if(s.level==='lexington'){
  const phase=s.time%9,cycle=Math.floor(s.time/9);s.volleyWarning=phase>6.5;s.volley=Math.max(0,s.volley-dt);
  if(cycle>Math.floor((s.time-dt)/9)){
   s.volley=.5;emit(s,'volley');
   const exposed=p.z<10&&[-7,-2,3,7].some(x=>!blocked('lexington',{x,z:-23,y:1.45},{...p,y:input.crouch?1.02:1.7}));
   if(exposed){p.health=Math.max(0,p.health-(s.difficulty==='story'?7:14));s.lastDamage=s.time;emit(s,'hurt');}
  }
 }
 if(s.level==='concord'&&s.stage===1&&input.interact&&!s.suppliesUsed&&distance(p,{x:2,z:9})<2.5){s.suppliesUsed=true;s.ammo+=6;p.health=Math.min(100,p.health+35);emit(s,'resupply');}

 if(s.level==='concord'&&s.stage===1){
  const pressure=s.enemies.filter(e=>e.hp>0&&e.z> -9&&!e.retreat).length;
  if(distance(p,{x:0,z:4})<19)s.defense+=dt*(pressure>=3?.2:1);
  s.wagonHealth=Math.max(0,s.wagonHealth-Math.max(0,pressure-2)*dt*(s.difficulty==='story'?.65:1.4));
  if(s.wagonHealth===0){s.failed=true;emit(s,'fail');return s.events;}
  if(s.defense>17&&s.wave===1){spawnWave(s);emit(s,'voice',{id:'wave.1'});}if(s.defense>34&&s.wave===2){spawnWave(s);emit(s,'voice',{id:'wave.2'});}
  if(s.defense>=52){emit(s,'voice',{id:'clear'});s.enemies.forEach(e=>e.retreat=true);s.stage=2;emit(s,'checkpoint');}
 }
 let maxAlert=0;
 for(const e of s.level==='breeds'||s.retreat||s.crossing||s.philadelphia||s.albany||s.winter||s.wider||s.south||s.inland||s.chase?[]:s.enemies){e.fired=Math.max(0,e.fired-dt);if(e.hp<=0){e.dead+=dt;continue;}const d=distance(p,e);e.moving=false;
  if(e.patrol){const oldX=e.x;e.x=e.route[0]+(e.route[1]-e.route[0])*(.5+.5*Math.sin(s.time*.27+e.id*1.7));e.yaw=e.x>oldX?-Math.PI/2:Math.PI/2;e.moving=true;
   const toward=Math.atan2(-(p.x-e.x),-(p.z-e.z)),visible=d<(input.crouch?8:13)&&Math.abs(angle(toward-e.yaw))<.95&&!blocked(s.level,{...e,y:1.5},{...p,y:input.crouch?1.0:1.7});
   e.alert=clamp(e.alert+(visible?(input.sprint?1.3:.65):-.5)*dt,0,1);maxAlert=Math.max(maxAlert,e.alert);
   if(d<18&&!s.patrolWarned){s.patrolWarned=true;emit(s,'voice',{id:'patrol'});}
   if(e.alert>.9){if(!s.spotted){s.spotted=true;emit(s,'voice',{id:'spotted'});}e.yaw=toward;}
  }else{const tx=e.retreat?(e.id%2?25:-25):e.route[0],tz=e.retreat?24:e.route[1];const len=Math.hypot(tx-e.x,tz-e.z);if(len>1.3){const speed=e.retreat?3:1.3,dx=(tx-e.x)/len*dt*speed,dz=(tz-e.z)/len*dt*speed;const oldX=e.x,oldZ=e.z;if(!collide(s,e.x+dx,e.z,.24,0))e.x+=dx;if(!collide(s,e.x,e.z+dz,.24,0))e.z+=dz;if(Math.abs(e.z-oldZ)<.001&&Math.abs(dz)>.005){const side=e.x<0?-1:1;if(!collide(s,e.x+side*dt*speed,e.z,.24,0))e.x+=side*dt*speed;}e.moving=Math.hypot(e.x-oldX,e.z-oldZ)>.001;}e.yaw=Math.atan2(-(p.x-e.x),-(p.z-e.z));}
  e.cooldown-=dt;e.aiming=e.cooldown<1.25&&(!e.patrol||e.alert>.9)&&!e.retreat;
  if(e.cooldown<=0&&(!e.patrol||e.alert>.9)&&!e.retreat&&d<55&&!blocked(s.level,{...e,y:1.4},{...p,y:input.crouch?1.02:1.65})){e.cooldown=4.8+random(s)*3.4;e.fired=.2;emit(s,'enemyShot',{x:e.x,z:e.z});
   if(!blocked(s.level,{...e,y:1.4},{...p,y:input.crouch?1.02:1.65})&&random(s)<(s.difficulty==='story'?.14:.36)){p.health=Math.max(0,p.health-(s.difficulty==='story'?10:17));s.lastDamage=s.time;emit(s,'hurt');}
  }
 }
 s.alert=maxAlert;if(s.chase)updateChase(s,input,dt,{blocked,collide});if(s.inland)updateInland(s,input,dt,{blocked,collide});if(s.south)updateSouth(s,input,dt,{blocked,collide});if(s.wider)updateWider(s,input,dt,{blocked,collide});if(s.winter)updateWinter(s,input,dt,{blocked,collide});if(s.albany)updateAlbany(s,input,dt,{blocked,collide});if(s.philadelphia)updatePhiladelphia(s,input,dt,{blocked,collide});if(s.crossing)updateCrossing(s,input,dt,{blocked,collide});if(s.retreat)updateRetreat(s,input,dt,{blocked,collide});if(s.paper)updatePaper(s,input,dt);if(s.lift)updateLift(s,input,dt,{collide});if(s.promise)updatePromise(s,input,dt,{blocked,collide});if(s.level==='breeds')updateHill(s,input,dt,{blocked,collide});if(s.level==='ticonderoga')updateFort(s,input,dt,{blocked});const protectedNow=s.level==='concord'&&s.enemies.filter(e=>e.hp>0&&!e.retreat).every(e=>blocked(s.level,{...e,y:1.4},{...p,y:input.crouch?1.02:1.65}));if((s.level!=='tidewater'||!s.promise.pursuit&&s.alert<.1)&&s.time-s.lastDamage>5&&(protectedNow||s.level!=='lexington'&&!s.enemies.some(e=>e.hp>0&&(!e.patrol||e.alert>.5))))p.health=Math.min(100,p.health+dt*5);
 if(p.health<=0){s.failed=true;emit(s,'fail');return s.events;}
 if(!chaseOperating(s)&&!southOperating(s)&&!widerOperating(s)&&!winterOperating(s)&&!albanyOperating(s)&&!albanyFighting(s)&&!philadelphiaDefending(s)&&!philadelphiaOperating(s)&&!crossingFighting(s)&&!retreatDefending(s)&&!paperOperating(s)&&!s.finished&&!liftHauling(s)&&!hillDefending(s)&&!s.failed&&!(s.level==='concord'&&s.stage===1)&&!(s.level==='ticonderoga'&&s.stage===6)){if(input.interact&&goalNear(s)&&(!s.chase||chaseCanUse(s))&&(!s.inland||inlandCanUse(s))&&(!s.south||southCanUse(s))&&(!s.wider||widerCanUse(s))&&(!s.winter||winterCanUse(s))&&(!s.albany||albanyCanUse(s))&&(!s.philadelphia||philadelphiaCanUse(s))&&(!s.crossing||crossingCanUse(s))&&(!s.retreat||retreatCanUse(s))&&(!s.paper||paperCanUse(s))&&(!s.lift||liftCanUse(s))&&(!s.promise||promiseCanUse(s,input))){s.hold+=dt;if(s.hold>=currentGoal(s).time)interact(s);}else s.hold=Math.max(0,s.hold-dt*3);}
 return s.events;
}





