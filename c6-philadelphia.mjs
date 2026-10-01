// Original local rescues and logistics inside the dated Philadelphia campaign.
const goal=(x,z,label,verb,time=1)=>({x,z,label,verb,time});
export const PHILADELPHIA_LEVELS={
 brandywine:{title:'A City Is Not an Army',place:'BRANDYWINE · SEPTEMBER 11, 1777 · ROWAN VALE',spawn:[0,25],bounds:[-34,34,-70,36],music:'retreat',mode:'COLLAPSING DEFENSE / RESCUE',intro:'philadelphiaIntro',after:'philadelphiaWounded',description:'Keep a local withdrawal lane open after the army is outflanked. Bring a wounded courier back to Mara.',goals:[goal(-6,16,'Take the section’s cartridges','Take the cartridges'),goal(-16,-7,'Bring Ward’s section to the withdrawal lane','Raise the rearward signal'),goal(-14,-8,'Keep the lane open for the withdrawing men','Order covering fire',0),goal(-21,-10,'Reach the courier beside the fence','Support the wounded courier',1.2),goal(6,27,'Bring him to Mara’s wagon','Lower him onto the blanket',1.3),goal(-4,24,'Bring Ward the courier’s dispatch','Give Ward the dispatch'),goal(0,33,'Leave Brandywine with the section','Rejoin the withdrawing army')]},
 recordshall:{title:'The Papers We Carry',place:'PHILADELPHIA · NIGHT OF SEPTEMBER 18–19, 1777 · ROWAN VALE',spawn:[0,15],bounds:[-17,17,-16,25],music:'records',mode:'CONGRESS EVACUATION',intro:'philadelphiaRecords',after:'philadelphiaExit',description:'Pack the Congress journals, inspect an intercepted plan, and load the government’s working papers for departure.',goals:[goal(-6,10,'Find the courier at the packing room','Help Daniel with the bindings'),goal(-7,-2,'Lift the bound Congress journals','Take the bound journals',1.4),goal(0,19,'Put the journals in the covered wagon','Stow the journals',1.2),goal(7,-6,'Inspect the intercepted operational map','Unroll the intercepted plan'),goal(6,-6,'Place Howe’s marker at Philadelphia','Mark Howe’s competing route',1.5),goal(-5,12,'Give Ward the northern dispatch','Pass on the missing-support warning'),goal(0,19,'Seal the records beneath the wagon cover','Tie the weather cover',1.4)]},
 congressroad:{title:'Keep the Government Moving',place:'WESTERN ROAD · SEPTEMBER 19, 1777 · ROWAN VALE',spawn:[0,23],bounds:[-38,38,-106,30],music:'records',mode:'BRANCHING EXTRACTION',intro:'philadelphiaExit',after:'philadelphiaEnding',description:'A damaged crossing blocks the record wagon. Choose the cart detour or carry the journals over the footbridge.',goals:[goal(0,-38,'Inspect the broken cart crossing','Check the broken planks'),goal(23,-32,'Choose a crossing for the records','Open the cart detour'),goal(23,-73,'Get the records beyond the water','Keep the wagon moving',0),goal(0,-87,'Deliver the records to the waiting crew','Account for the records',1.3),goal(0,-99,'Leave the crossing together','Join the western road')]},
};
export const PHILADELPHIA_BLOCKS={
 brandywine:[[-6,5,14,1.1,1.25],[-21,5,1,20,1.25],[7,-10,9,10,6],[23,12,9,12,6],[-25,-27,10,10,6],[-9,-25,13,1,1.2],[11,-31,16,1,1.2]],
 recordshall:[[-15,-2,1,27,6],[15,-2,1,27,6],[0,-15,30,1,6],[-8,2,9,3,1.1],[8,2,9,3,1.1],[7,-8,8,3,1.1],[-9,-10,9,3,1.1]],
 congressroad:[[12,2,9,11,6],[-12,-20,10,10,6],[7,-40,1,9,1.1],[33,-41,1,20,1.2],[-31,-55,1,17,1.2],[12,-79,8,10,6]],
};
export const WAGON_ROUTE=[{x:0,z:18},{x:0,z:-29},{x:23,z:-29},{x:23,z:-90},{x:0,z:-90}];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const emit=(s,type,data={})=>s.events.push({type,...data}),say=(s,id)=>emit(s,'voice',{id});
export function freshPhiladelphia(){return {clock:0,volley:0,ally:0,line:100,flank:false,rescued:false,dispatch:false,journals:false,map:false,marked:false,covered:false,holding:'',bridgeBroken:false,route:'',wagonX:0,wagonZ:18,wagonYaw:0,wagonStep:1,wagonTravel:0,assist:false,crewX:4,crewZ:20,crewYaw:0,crewStep:1,crewStarted:false,gate:false,recordsSecured:false,pressSaved:false,footHold:0,collapse:0,far:false};}
export function validPhiladelphia(q,b){return !!q&&['clock','volley','ally','line','wagonX','wagonZ','wagonYaw','wagonStep','wagonTravel','crewX','crewZ','crewYaw','crewStep','footHold','collapse'].every(k=>Number.isFinite(q[k]))&&['flank','rescued','dispatch','journals','map','marked','covered','bridgeBroken','assist','crewStarted','gate','recordsSecured','pressSaved','far'].every(k=>typeof q[k]==='boolean')&&['','wagon','foot'].includes(q.route)&&['','journals','map'].includes(q.holding)&&q.line>=0&&q.line<=100&&q.wagonX>=b[0]&&q.wagonX<=b[1]&&q.wagonZ>=b[2]&&q.wagonZ<=b[3]&&q.crewX>=b[0]&&q.crewX<=b[1]&&q.crewZ>=b[2]&&q.crewZ<=b[3]&&['wagonStep','crewStep'].every(k=>Number.isInteger(q[k])&&q[k]>=1&&q[k]<=WAGON_ROUTE.length)&&q.wagonTravel>=0&&q.wagonTravel<1000&&q.footHold>=0&&q.footHold<10&&q.collapse>=0&&q.collapse<=1;}
export const philadelphiaDefending=s=>s.level==='brandywine'&&s.stage===2;
export const philadelphiaOperating=s=>s.level==='congressroad'&&s.stage===2;
export const philadelphiaEscorting=s=>philadelphiaOperating(s)&&s.philadelphia.route==='wagon'&&s.philadelphia.assist&&dist(s.player,{x:s.philadelphia.wagonX,z:s.philadelphia.wagonZ})<8;
export function roadWaterBlocked(q,x,z,r=.3){if(z>-47-r||z<-63+r)return false;return !(Math.abs(x-23)<4.6-r||Math.abs(x+22)<2.1-r||!q.bridgeBroken&&Math.abs(x)<4.5-r);}
export function philadelphiaGoal(s){const q=s.philadelphia,g=PHILADELPHIA_LEVELS[s.level].goals[s.stage];if(!g)return g;
 if(s.level==='congressroad'&&s.stage===1){const foot={x:-22,z:-34,label:'Choose the narrow footbridge route',verb:'Choose to carry the essential records',time:1.5};return dist(s.player,foot)<dist(s.player,g)?foot:g;}
 if(philadelphiaOperating(s)){if(q.route==='foot')return q.holding==='journals'?{...g,x:-22,z:-72,label:'Carry the journals across the footbridge',verb:'Secure the records on the far bank',time:1.3}:{...g,x:0,z:18,label:'Return to the wagon for the journals',verb:'Lift the essential records',time:1.3};const cart={x:q.wagonX,z:q.wagonZ};return dist(s.player,cart)>8?{...g,...cart,label:'Return beside the record wagon'}:{...g,...(WAGON_ROUTE[q.wagonStep]||WAGON_ROUTE.at(-1)),label:'Walk beside the wagon and help it forward'};}
 return g;
}
export function philadelphiaNear(s){const g=philadelphiaGoal(s);return !!g&&dist(s.player,g)<2.5;}
export function philadelphiaCanUse(s){if(philadelphiaDefending(s)||philadelphiaOperating(s))return false;const q=s.philadelphia;if(s.level==='congressroad'&&s.stage===3)return q.recordsSecured&&q.crewStep===WAGON_ROUTE.length;return true;}
function next(s){s.stage++;s.hold=0;emit(s,'checkpoint');if(s.stage>=PHILADELPHIA_LEVELS[s.level].goals.length){s.finished=true;emit(s,'finish');}}
function spawn(s,n,flank=false){s.enemies=Array.from({length:n},(_,i)=>({id:i,x:flank?24-i%3*3:(i%3-1)*6,z:flank?-21-Math.floor(i/3)*3:-43-Math.floor(i/3)*4,hp:1,yaw:Math.PI,cooldown:4+i*.65,dead:0,fired:0,moving:false,retreat:false}));}
export function interactPhiladelphia(s){const q=s.philadelphia,st=s.stage;
 if(s.level==='brandywine'){
  if(st===0){s.armed=true;s.ammo=12;say(s,'philadelphia.cartridges');}
  if(st===1){spawn(s,8);q.clock=0;q.ally=0;say(s,'philadelphia.signal');}
  if(st===3){s.carrying=true;s.armed=false;say(s,'philadelphia.courier');}
  if(st===4){s.carrying=false;q.rescued=true;s.player.health=Math.min(100,s.player.health+40);emit(s,'rescue');say(s,'philadelphia.mara');}
  if(st===5){q.dispatch=true;say(s,'philadelphia.dispatch');}
  if(st===6)say(s,'philadelphia.withdraw');
 }else if(s.level==='recordshall'){
  if(st===0)say(s,'records.binding');
  if(st===1){q.holding='journals';say(s,'records.journals');}
  if(st===2){q.holding='';q.journals=true;emit(s,'wood');say(s,'records.stow');}
  if(st===3){q.map=true;q.holding='map';say(s,'records.map');}
  if(st===4){q.marked=true;say(s,'records.howe');}
  if(st===5){q.holding='';q.dispatch=true;say(s,'records.north');}
  if(st===6){q.covered=true;emit(s,'wood');say(s,'records.cover');}
 }else{
  if(st===0){q.bridgeBroken=true;q.collapse=0;emit(s,'bridgeBreak');say(s,'road.bridge');}
  if(st===1){const foot=s.player.x<0;q.route=foot?'foot':'wagon';q.gate=!foot;q.pressSaved=!foot;q.crewStarted=!foot;emit(s,'wood');say(s,foot?'road.foot':'road.wagon');}
  if(st===3){s.carrying=false;q.far=true;say(s,q.route==='wagon'?'road.deliver.wagon':'road.deliver.foot');say(s,'road.pike');}
  if(st===4)say(s,'road.leave');
 }next(s);
}
function hurt(s,n){s.player.health=Math.max(0,s.player.health-n);s.lastDamage=s.time;emit(s,'hurt');}
function updateWagon(s,input,dt,collide){const q=s.philadelphia,p=s.player,point=WAGON_ROUTE[q.wagonStep];if(!point)return;
 const near=dist(p,{x:q.wagonX,z:q.wagonZ})<8;if(input.useTap&&near){q.assist=!q.assist;emit(s,'wood');}const move=near&&(input.useTap===undefined?input.interact:q.assist);
 if(move){const dx=point.x-q.wagonX,dz=point.z-q.wagonZ,d=Math.hypot(dx,dz),pace=Math.min(d,dt*1.8),nx=q.wagonX+dx/(d||1)*pace,nz=q.wagonZ+dz/(d||1)*pace;
  if(!collide(s,nx,nz,1.45,0)){q.wagonX=nx;q.wagonZ=nz;q.wagonTravel+=pace;q.wagonYaw=Math.atan2(-dx,-dz);if(d<=.15){q.wagonX=point.x;q.wagonZ=point.z;q.wagonStep++;emit(s,'checkpoint');}}
 }
 if(q.wagonStep===WAGON_ROUTE.length){q.recordsSecured=true;q.pressSaved=true;say(s,'road.clear.wagon');next(s);}
}
export function updatePhiladelphia(s,input,dt,{blocked,collide}){const q=s.philadelphia,p=s.player;q.volley=Math.max(0,q.volley-dt);if(q.bridgeBroken)q.collapse=Math.min(1,q.collapse+dt*.65);
 if(s.level==='congressroad'&&q.crewStarted){if(q.route==='wagon'){q.crewX=q.wagonX+2;q.crewZ=q.wagonZ+1;q.crewYaw=q.wagonYaw;q.crewStep=q.wagonStep;}else{const point=WAGON_ROUTE[q.crewStep];if(point){const dx=point.x-q.crewX,dz=point.z-q.crewZ,d=Math.hypot(dx,dz),step=Math.min(d,dt*2.8),nx=q.crewX+dx/(d||1)*step,nz=q.crewZ+dz/(d||1)*step;if(!collide(s,nx,nz,.3,0)){q.crewX=nx;q.crewZ=nz;q.crewYaw=Math.atan2(-dx,-dz);if(d<=.12)q.crewStep++;}}}}
 if(philadelphiaOperating(s)){
  if(q.route==='wagon')updateWagon(s,input,dt,collide);
  else{const loaded=q.holding==='journals',near=dist(p,loaded?{x:-22,z:-72}:{x:0,z:18})<2.5;q.footHold=near&&input.interact?q.footHold+dt:Math.max(0,q.footHold-dt*3);if(q.footHold>=1.3){q.footHold=0;emit(s,'wood');if(!loaded){q.holding='journals';s.carrying=true;q.crewStarted=true;q.gate=true;say(s,'road.load');emit(s,'checkpoint');}else{q.recordsSecured=true;q.holding='';s.carrying=false;say(s,'road.clear.foot');next(s);}}}
 }
 if(s.level!=='brandywine')return;
 const defend=philadelphiaDefending(s),near=dist(p,{x:-14,z:-8})<16;
 if(defend){q.clock+=near?dt:0;q.ally+=near?dt:0;
  if(input.interact&&q.volley===0&&near){q.volley=8;emit(s,'orderUsed');const e=s.enemies.find(e=>e.hp>0);if(e){e.hp=0;e.dead=0;emit(s,'philadelphiaVolley');}}
  if(q.ally>=9){q.ally=0;const e=s.enemies.find(e=>e.hp>0);if(e){e.hp=0;e.dead=0;emit(s,'philadelphiaVolley');}}
  const pressure=s.enemies.filter(e=>e.hp>0&&e.z>-22).length;q.line=clamp(q.line+(near?1.5:-2)*dt-pressure*dt*.7,0,100);
  if(q.clock>=30&&!q.flank){q.flank=true;say(s,'philadelphia.flank');emit(s,'flankSignal');}
  if(q.clock>=44&&s.enemies.every(e=>e.hp<=0)){spawn(s,6,true);s.enemies.forEach(e=>e.cooldown+=6);say(s,'philadelphia.break');next(s);}
  if(q.line===0){s.failed=true;emit(s,'fail');}
 }
 const fighting=defend||s.stage===3||s.stage===4;
 for(const e of s.enemies){e.fired=Math.max(0,e.fired-dt);if(e.hp<=0){e.dead+=dt;continue;}if(!fighting){e.retreat=true;e.moving=false;continue;}
  const targetZ=q.flank?-12:-21,step=dt*.7;e.moving=e.z<targetZ;if(e.moving&&!collide(s,e.x,e.z+step,.25,0))e.z+=step;e.yaw=Math.atan2(-(p.x-e.x),-(p.z-e.z));e.cooldown-=dt;e.aiming=e.cooldown<1.4;
  if(e.cooldown<=0&&dist(p,e)<45&&!blocked(s.level,{...e,y:1.4},{...p,y:input.crouch?1.02:1.7})){e.cooldown=7+(e.id%3);e.fired=.2;emit(s,'enemyShot',{x:e.x,z:e.z});if((e.id+Math.floor(s.time))%5===0)hurt(s,s.difficulty==='story'?4:8);}
 }
 if(!fighting&&s.time-s.lastDamage>5)p.health=Math.min(100,p.health+dt*6);
}
export function philadelphiaContext(s){const q=s.philadelphia;
 if(philadelphiaDefending(s))return dist(s.player,{x:-14,z:-8})>=16?'Return to the withdrawal lane. The section needs your signal.':q.volley?'The section is reloading. Keep to the wall.':'E orders covering fire · F / click shoots · R reloads · C crouches';
 if(s.level==='brandywine'&&s.carrying)return 'Daniel is leaning on you. Mara is behind the line with a blanket.';
 if(s.level==='recordshall')return q.holding==='journals'?'Bound journals in your arms. The covered wagon waits outside.':q.holding==='map'?'Howe’s marker belongs at Philadelphia. The northern convergence is missing its support.':'Congress is leaving. Keep its working papers together.';
 if(s.level==='congressroad')return s.stage===1?'East gate: take the loaded wagon around. West footbridge: carry the essential records.':philadelphiaOperating(s)?q.route==='wagon'?q.assist?'Walk beside the wagon. E sets the brake; leaving its side stops it.':'E releases the brake assist. Then walk beside the wagon.':q.holding!=='journals'?'Return to the wagon. Hold E to lift the journals; Mara keeps the remaining load.':q.footHold?'Keep the journals steady while setting them down.':'The narrow footbridge is on the west. Carry the journals over; the printing equipment stays with the wagon.':q.recordsSecured?q.crewStep<WAGON_ROUTE.length?'The records crossed. Mara and Daniel are walking over the wider bridge. Wait for them here.':'The crew has arrived. Account for the records together.':'The central cart crossing is damaged. There are other ways across.';
 return '';
}
