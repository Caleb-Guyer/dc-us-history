// Fictional crew operations inside the documented Trenton–Princeton campaign.
const goal=(x,z,label,verb,time=1)=>({x,z,label,verb,time});
export const CROSSING_LEVELS={
 delaware:{title:'Across the Black Water',place:'DELAWARE RIVER · NIGHT OF DECEMBER 25–26, 1776 · ISAIAH MERCER',spawn:[0,20],bounds:[-34,34,-144,30],music:'storm',mode:'ISAIAH · STORM CROSSING',intro:'crossingIntro',after:'crossingLanding',description:'Steer a loaded ferry through drifting ice. Recover a loose equipment bundle and land the crew.',goals:[goal(3,15,'Secure the powder under its cover','Tie down the powder cover',1.5),goal(0,10,'Take the ferry’s steering oar','Take the tiller'),goal(-8,-47,'Bring the loose equipment bundle aboard','Recover the floating bundle',1.5),goal(0,-120,'Land the crew on the New Jersey bank','Take the landing rope',1.5)]},
 trenton:{title:'The Town Before Morning',place:'TRENTON · DECEMBER 26, 1776 · ROWAN VALE',spawn:[0,26],bounds:[-30,30,-65,34],music:'winterbattle',mode:'ASSEMBLY / COORDINATED ATTACK',intro:'crossingLanding',after:'crossingTrenton',description:'Dry your lock, assemble the section, signal both lanes, and clear a local passage. Help the prisoners afterward.',goals:[goal(5,20,'Dry the musket lock beneath Mara’s cover','Dry the pan and replace the priming',2),goal(-5,12,'Assemble with Ward before moving','Count the section'),goal(-18,-8,'Carry the signal to the western lane','Raise the cloth'),goal(18,-8,'Wait for Nathan’s answering signal','Confirm the eastern lane'),goal(0,-28,'Help the section open the street','Direct a covering volley',0),goal(0,-45,'Receive the surrender at the orchard gate','Accept the lowered weapons',1.3),goal(-6,-46,'Bring water to the surrendered soldiers','Give the water flask',1.3),goal(0,-59,'Return with the section','Leave the orchard')]},
 princeton:{title:'Another Way Around',place:'PRINCETON · JANUARY 3, 1777 · ROWAN VALE',spawn:[0,27],bounds:[-30,30,-58,42],music:'winterbattle',mode:'FLANK / RESCUE',intro:'crossingPrinceton',after:'crossingEnding',description:'Use the side lane to signal a counterattack, then carry Nathan out of the crossroad.',goals:[goal(0,20,'Join Ward’s section on the morning road','Take the remaining cartridges'),goal(-18,-12,'Find the opening around the farm','Find the side lane'),goal(-17,-25,'Signal from beyond the farm wall','Raise the signal'),goal(-14,-28,'Keep the side passage open with the section','Direct a covering volley',0),goal(-17,-34,'Reach Nathan at the broken fence','Support Nathan'),goal(4,29,'Bring Nathan back to Mara','Lower him onto the blanket',1.4),goal(0,37,'Leave Princeton together','Rejoin the road')]},
};
export const CROSSING_BLOCKS={
 delaware:[],
 trenton:[[-11,21,8,7,6],[16,22,8,7,6],[-9,4,8,9,6],[9,4,8,9,6],[-10,-22,9,11,6],[11,-22,9,11,6],[-22,-37,1,16,1.2],[22,-37,1,16,1.2],[-8,-39,12,1,1.15],[10,-39,9,1,1.15]],
 princeton:[[-5,-5,13,12,6],[16,-10,9,13,6],[-4,-21,13,1,1.15],[15,8,12,1,1.2],[-25,-35,1,20,1.2],[-9,12,10,1,1.1]],
};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z),angle=v=>Math.atan2(Math.sin(v),Math.cos(v));
const emit=(s,type,data={})=>s.events.push({type,...data}),say=(s,id)=>emit(s,'voice',{id});
export function freshCrossing(){return {clock:0,ally:0,volley:0,signalClock:0,west:false,east:false,dried:false,surrendered:false,water:false,rescued:false,covered:false,recovered:false,aboard:false,moored:true,boatX:0,boatZ:10,boatYaw:0,vx:0,vz:0,speed:0,balance:0,wetness:0,impacts:0,bump:0,crateX:-8,crateZ:-47,iceTime:0,warning:false,loose:false};}
export function validCrossing(q,b){return !!q&&['clock','ally','volley','signalClock','boatX','boatZ','boatYaw','vx','vz','speed','balance','wetness','impacts','bump','crateX','crateZ','iceTime'].every(k=>Number.isFinite(q[k]))&&['west','east','dried','surrendered','water','rescued','covered','recovered','aboard','moored','warning','loose'].every(k=>typeof q[k]==='boolean')&&q.boatX>=b[0]&&q.boatX<=b[1]&&q.boatZ>=b[2]&&q.boatZ<=b[3]&&q.speed>=0&&q.speed<=7&&Math.abs(q.balance)<=1&&q.wetness>=0&&q.wetness<=1&&q.impacts>=0&&q.impacts<=10000&&q.crateX>=-20&&q.crateX<=20&&q.crateZ>=-70&&q.crateZ<=-30;}
export const crossingBoating=s=>s.level==='delaware'&&s.crossing?.aboard;
export const crossingFighting=s=>!!s.crossing&&(s.level==='trenton'&&s.stage===4||s.level==='princeton'&&s.stage===3);
export function crossingGoal(s){const q=s.crossing,g=CROSSING_LEVELS[s.level].goals[s.stage];if(s.level==='delaware'&&s.stage===2)return {...g,x:q.crateX,z:q.crateZ};if(s.level==='trenton'&&s.stage===0)return {...g,time:2+q.wetness*2};return g;}
export function crossingNear(s){const g=crossingGoal(s);return !!g&&dist(s.player,g)<(crossingBoating(s)?4:2.5);}
export function crossingCanUse(s){const q=s.crossing;if(crossingFighting(s))return false;if(s.level==='delaware'&&s.stage>=2)return q.speed<1.25&&crossingNear(s);if(s.level==='trenton'&&s.stage===3)return q.signalClock>=6;return true;}
export function iceFloes(t){return Array.from({length:12},(_,i)=>({x:Math.sin(t*.13+i*1.91)*(i%3===0?17:23),z:-23-i*7.2+Math.sin(t*.07+i)*3,r:1.25+i%3*.45}));}
function next(s){s.stage++;s.hold=0;emit(s,'checkpoint');if(s.stage>=CROSSING_LEVELS[s.level].goals.length){s.finished=true;emit(s,'finish');}}
function foes(s,n,offset=-43){s.enemies=Array.from({length:n},(_,i)=>({id:i,x:(i%3-1)*6,z:offset-Math.floor(i/3)*4,hp:1,yaw:Math.PI,cooldown:3+i*.75,dead:0,fired:0,moving:false,surrender:false,route:[0,-20]}));}
export function interactCrossing(s){const q=s.crossing,st=s.stage;
 if(s.level==='delaware'){
  if(st===0){q.covered=true;say(s,'crossing.cover');}
  if(st===1){q.aboard=true;q.moored=false;s.player.x=q.boatX;s.player.z=q.boatZ;say(s,'crossing.tiller');}
  if(st===2){q.recovered=true;q.wetness=clamp(q.wetness-.22,0,1);emit(s,'wood');say(s,'crossing.bundle');}
  if(st===3){q.moored=true;q.vx=q.vz=q.speed=0;say(s,'crossing.rope');}
 }else if(s.level==='trenton'){
  if(st===0){q.dried=true;q.wetness=0;s.armed=true;s.loaded=true;s.ammo=10;say(s,'trenton.dry');}
  if(st===1)say(s,'trenton.count');
  if(st===2){q.west=true;q.signalClock=0;say(s,'trenton.west');}
  if(st===3){q.east=true;q.clock=0;q.ally=0;foes(s,7);say(s,'trenton.east');}
  if(st===5){q.surrendered=true;s.armed=false;s.enemies.forEach(e=>{e.surrender=true;e.fired=0;e.aiming=false;});say(s,'trenton.surrender');say(s,'trenton.hessian');}
  if(st===6){q.water=true;say(s,'trenton.water');say(s,'trenton.mara');}
  if(st===7)say(s,'trenton.leave');
 }else{
  if(st===0){s.armed=true;s.ammo=10;say(s,'princeton.road');}
  if(st===1)say(s,'princeton.lane');
  if(st===2){q.west=true;q.clock=0;q.ally=0;foes(s,8);say(s,'princeton.signal');}
  if(st===4){s.carrying=true;s.armed=false;say(s,'princeton.nathan');}
  if(st===5){s.carrying=false;q.rescued=true;s.armed=true;s.player.health=Math.min(100,s.player.health+40);say(s,'princeton.mara');emit(s,'rescue');}
  if(st===6)say(s,'princeton.leave');
 }next(s);
}
export function moveStormBoat(s,input,dt,collide){const q=s.crossing,p=s.player;if(!q.aboard||q.moored)return;q.iceTime+=dt;q.bump=Math.max(0,q.bump-dt);
 const turn=(input.left?1:0)-(input.right?1:0);q.boatYaw=angle(q.boatYaw+turn*dt*.92);const brake=input.back||input.jump;
 if(input.forward&&!brake){q.vx-=Math.sin(q.boatYaw)*dt*6;q.vz-=Math.cos(q.boatYaw)*dt*6;}
 q.vx*=Math.exp(-dt*(brake?4:.82));q.vz*=Math.exp(-dt*(brake?4:.82));const shore=clamp(Math.min(Math.abs(q.boatZ-10),Math.abs(q.boatZ+120))/15,.03,1);q.vx+=dt*(.85+Math.sin(s.time*.27)*.55)*shore;
 const speed=Math.hypot(q.vx,q.vz);if(speed>6){q.vx*=6/speed;q.vz*=6/speed;}
 const nx=q.boatX+q.vx*dt,nz=q.boatZ+q.vz*dt,ice=iceFloes(q.iceTime).find(f=>Math.hypot(f.x-nx,f.z-nz)<f.r+1.3);
 if(collide(s,nx,nz,1.4,0)||ice){q.vx*=-.28;q.vz*=-.28;if(q.bump===0){q.bump=1.5;q.impacts++;q.wetness=clamp(q.wetness+.12,0,1);q.loose=true;emit(s,'wood');if(!q.warning){q.warning=true;say(s,'crossing.ice');}}}else{q.boatX=nx;q.boatZ=nz;}
 q.balance=clamp(q.balance+turn*dt*.15,-1,1);q.balance*=Math.exp(-dt*(brake?1.6:.4));q.wetness=clamp(q.wetness+(Math.abs(q.balance)>.55?.015:0)*dt,0,1);q.speed=Math.hypot(q.vx,q.vz);p.x=q.boatX;p.z=q.boatZ;
 // The recovery target stays in reach; it cannot drift indefinitely into an unwinnable state.
 q.crateX=-8+Math.sin(q.iceTime*.12)*3;q.crateZ=-47+Math.sin(q.iceTime*.09)*2;
}
function hurt(s,n){s.player.health=Math.max(0,s.player.health-n);s.lastDamage=s.time;emit(s,'hurt');}
export function updateCrossing(s,input,dt,{blocked,collide}){const q=s.crossing,p=s.player;q.signalClock+=q.west?dt:0;q.volley=Math.max(0,q.volley-dt);if(s.level==='delaware')return;
 if(crossingFighting(s)){
  const g=crossingGoal(s),near=dist(p,g)<18;q.ally+=near?dt:0;q.clock+=near?dt:0;
  if(input.interact&&q.volley===0&&near){q.volley=7;emit(s,'orderUsed');const e=s.enemies.find(e=>e.hp>0&&!e.surrender);if(e){e.hp=0;e.dead=0;emit(s,'crossingVolley');}}
  if(q.ally>8){q.ally=0;const e=s.enemies.find(e=>e.hp>0&&!e.surrender);if(e){e.hp=0;e.dead=0;emit(s,'crossingVolley');}}
  if(q.clock>=40&&s.enemies.every(e=>e.hp<=0)){s.enemies.forEach(e=>{e.surrender=true;e.fired=0;});say(s,s.level==='trenton'?'trenton.clear':'princeton.clear');next(s);}
 }
 const fight=crossingFighting(s);for(const e of s.enemies){e.fired=Math.max(0,e.fired-dt);if(e.hp<=0){e.dead+=dt;continue;}if(e.surrender){e.aiming=false;e.moving=false;continue;}
  const target=s.level==='princeton'?-30:-26,step=dt*.75;e.moving=e.z<target;if(e.moving&&!collide(s,e.x,e.z+step,.25,0))e.z+=step;e.yaw=Math.atan2(-(p.x-e.x),-(p.z-e.z));e.cooldown-=dt;e.aiming=fight&&e.cooldown<1.4;
  if(fight&&e.cooldown<=0&&dist(p,e)<45&&!blocked(s.level,{...e,y:1.4},{...p,y:input.crouch?1.02:1.7})){e.cooldown=6+(e.id%3)*.8;e.fired=.2;emit(s,'enemyShot',{x:e.x,z:e.z});if((e.id+Math.floor(s.time))%4===0)hurt(s,s.difficulty==='story'?4:8);}
 }if(!fight&&s.time-s.lastDamage>5)p.health=Math.min(100,p.health+dt*6);
}
export function crossingContext(s){const q=s.crossing;
 if(s.level==='delaware')return q.aboard?q.speed>=1.25&&crossingNear(s)?'Too fast for the rope. S / Space slows and steadies.':'W moves the ferry · A / D tiller · S / Space steady · arrows / mouse look':q.covered?'The crew is loaded. Isaiah takes the tiller.':'Clothing, powder, tents, equipment: every dry bundle matters.';
 if(s.level==='trenton'&&s.stage===3&&q.signalClock<6)return 'Wait for the answering cloth. The section moves together.';
 if(crossingFighting(s))return dist(s.player,crossingGoal(s))>=18?'Return to the passage. The section needs you there.':q.volley>0?'The section is reloading. Keep them covered.':'E directs covering fire · F / click fires · R reloads · C crouches';
 if(q.surrendered)return 'Weapons lowered. The fighting here is over.';
 if(s.carrying)return 'Nathan is leaning on you. Mara has the blanket at the rear.';
 return '';
}
