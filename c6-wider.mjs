// Fictional local operations; dates and strategic outcomes are in the story module.
const g=(x,z,label,verb,time=1.2)=>({x,z,label,verb,time});
export const WIDER_LEVELS={
 monmouth:{title:'The Line We Learned',place:'MONMOUTH · JUNE 28, 1778 · ROWAN VALE',spawn:[0,25],bounds:[-34,34,-72,34],music:'drill',mode:'RALLY / FORMATION COMBAT',intro:'widerIntro',after:'widerLine',description:'Rally a small section, turn together and hold a local lane with the drill learned at Valley Forge. Leave with the army; the British continue to New York.',goals:[g(-5,18,'Take Ward’s local rally order','Take the rally order'),g(0,10,'Gather Asa’s scattered section','Call the section together'),g(-18,-10,'Bring the column to the western rally flags','Wait for the whole column'),g(-18,-10,'Turn and form toward the eastern field','Face east and give the line command'),g(0,-30,'Keep the lane with your section','Direct a covering volley',0),g(-10,-43,'Bring the spare cartridges to Asa','Pass the cartridges'),g(0,-58,'Leave the field with the section','Wait for the section and rejoin Ward')]},
 openwater:{title:'The Wider War',place:'ATLANTIC COASTAL PASSAGE · AUGUST 1778 · ISAIAH MERCER',spawn:[0,22],bounds:[-46,46,-195,30],music:'ocean',mode:'CONVOY NAVIGATION / INTERCEPTION / RESCUE',intro:'widerSea',after:'widerLanding',description:'Lead a small supply boat through shoals. Choose fleet cover or a fog passage, pick up a survivor and bring the actual following vessel to the landing.',goals:[g(-4,18,'Take the covered powder and supply manifest','Secure the powder manifest'),g(0,10,'Take the small boat’s steering oar','Take the tiller'),g(24,-32,'Choose the blue fleet flag or the western gray fog flag','Confirm the fleet passage'),g(20,-97,'Recover a survivor from the intercepted boat','Take the rescue rope',1.5),g(0,-132,'Lose the pursuing cutter in fleet cover or fog','Break the interception',0),g(0,-175,'Bring your boat and the supply vessel to the landing','Take the landing rope',1.5)]},
 coastfire:{title:'A Light Behind Us',place:'NORWALK SHORE · JULY 12, 1779 · ISAIAH MERCER',spawn:[0,25],bounds:[-33,33,-65,44],music:'coastfire',mode:'FIRE RESCUE / WATER / FAMILY ESCORT',intro:'widerCoast',after:'widerEnding',description:'Meet people displaced by the Connecticut raids, carry a wounded man, cool a burning passage and bring a family to the small departure boat.',goals:[g(0,20,'Take the coastal relief order','Take Nathan’s order'),g(-18,5,'Find Lydia and the Danbury survivors','Ask which shelter needs help'),g(-20,-22,'Help the wounded man out of the exposed shelter','Support him'),g(-5,20,'Bring him to Anne at the covered landing','Lower him onto the blanket'),g(18,-12,'Find the boat from Fairfield','Ask where the missing family went'),g(12,-25,'Fill a bucket at the shore well','Fill the bucket',1.8),g(18,-35,'Cool the burning timber at the family passage','Douse the timber',1.8),g(18,-35,'Brace the cooled beam to reopen the passage','Brace and lift the beam',2.5),g(18,-45,'Reach the family beyond the burned store','Bring the family together'),g(0,22,'Guide the family down the cleared shore lane','Wait for both people at the landing'),g(0,29,'Launch the small departure boat','Leave the burning shore')]},
};
export const WIDER_BLOCKS={
 monmouth:[[-26,16,8,10,5],[25,12,8,10,5],[-8,0,11,1,1.2],[9,-13,11,1,1.2],[-26,-32,8,11,5],[24,-41,8,12,5],[-9,-51,10,1,1.1]],
 openwater:[[0,-38,13,12,.8],[-34,-72,13,15,.8],[33,-100,13,18,.8],[0,-123,12,14,.8]],
 coastfire:[[-27,13,8,10,5],[26,16,8,10,5],[-8,-12,13,12,5],[-26,-36,8,10,5],[25,-30,9,10,5],[-8,-41,12,11,5],[1,-30,12,1,1.3],[12,-37,1,9,1.2],[20,-57,9,7,5]],
};
const dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z),angle=a=>Math.atan2(Math.sin(a),Math.cos(a)),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),emit=(s,type,data={})=>s.events.push({type,...data}),say=(s,id)=>emit(s,'voice',{id});
export function freshWider(){return {order:false,rallied:false,turned:false,formation:'column',formationYaw:0,squad:[],lastX:0,lastZ:10,lineClock:0,volley:0,ammoPassed:false,trainedBefore:false,manifest:false,aboard:false,moored:true,boatX:0,boatZ:10,boatYaw:0,vx:0,vz:0,speed:0,travel:0,impacts:0,bump:0,hull:100,route:'',convoyX:10,convoyZ:14,convoyYaw:0,convoyLeg:0,convoyDelivered:false,survivorX:20,survivorZ:-97,rescued:false,intercepted:false,cutterX:31,cutterZ:-75,cutterYaw:0,cutterFlash:0,shotClock:8,pursuit:1,coverTime:0,defensiveShots:0,lastShot:0,orderRead:false,danbury:false,fairfield:false,patient:false,holdingBucket:false,doused:false,beam:false,escort:false,escorted:false,familyX:18,familyZ:-45,familyLeg:0,fire:0,fireClock:0};}
export function validWider(q,b){return !!q&&['order','rallied','turned','ammoPassed','trainedBefore','manifest','aboard','moored','convoyDelivered','rescued','intercepted','orderRead','danbury','fairfield','patient','holdingBucket','doused','beam','escort','escorted'].every(k=>typeof q[k]==='boolean')&&['formationYaw','lastX','lastZ','lineClock','volley','boatX','boatZ','boatYaw','vx','vz','speed','travel','impacts','bump','hull','convoyX','convoyZ','convoyYaw','convoyLeg','survivorX','survivorZ','cutterX','cutterZ','cutterYaw','cutterFlash','shotClock','pursuit','coverTime','defensiveShots','lastShot','familyX','familyZ','familyLeg','fire','fireClock'].every(k=>Number.isFinite(q[k]))&&['lineClock','volley','travel','bump','shotClock','fireClock'].every(k=>q[k]>=0&&q[k]<1000000)&&['','fleet','fog'].includes(q.route)&&['column','line'].includes(q.formation)&&q.speed>=0&&q.speed<=6.51&&q.hull>=1&&q.hull<=100&&q.pursuit>=0&&q.pursuit<=1&&q.fire>=0&&q.fire<=1&&q.coverTime>=0&&q.coverTime<=8.1&&q.travel>=0&&q.travel<10000&&Number.isInteger(q.impacts)&&q.impacts>=0&&q.impacts<10000&&Number.isInteger(q.convoyLeg)&&q.convoyLeg>=0&&q.convoyLeg<=5&&Number.isInteger(q.familyLeg)&&q.familyLeg>=0&&q.familyLeg<=4&&Number.isInteger(q.defensiveShots)&&q.defensiveShots>=0&&q.defensiveShots<=20&&Number.isInteger(q.lastShot)&&q.lastShot>=0&&[['boatX','boatZ'],['convoyX','convoyZ'],['familyX','familyZ']].every(([x,z])=>q[x]>=b[0]&&q[x]<=b[1]&&q[z]>=b[2]&&q[z]<=b[3])&&Array.isArray(q.squad)&&[0,6].includes(q.squad.length)&&q.squad.every(a=>['x','z','yaw'].every(k=>Number.isFinite(a[k]))&&a.x>=b[0]&&a.x<=b[1]&&a.z>=b[2]&&a.z<=b[3]);}
export const widerBoating=s=>s.level==='openwater'&&s.wider?.aboard;
export const widerEscorting=s=>s.level==='coastfire'&&s.wider?.escort&&!s.wider.escorted;
export const widerFighting=s=>s.level==='monmouth'&&s.stage===4;
export const widerOperating=s=>widerFighting(s)||s.level==='openwater'&&s.stage===4;
export function widerGoal(s){const q=s.wider,g=WIDER_LEVELS[s.level].goals[s.stage];if(s.level==='openwater'&&s.stage===3)return {...g,x:q.survivorX,z:q.survivorZ};return g;}
export function widerNear(s){if(s.level==='openwater'&&s.stage===2)return dist(s.player,{x:24,z:-32})<5||dist(s.player,{x:-24,z:-32})<5;return !!widerGoal(s)&&dist(s.player,widerGoal(s))<(widerBoating(s)?5:2.5);}
export function widerCanUse(s){const q=s.wider;if(widerOperating(s))return false;if(s.level==='monmouth'&&s.stage>=2){if(q.squad.some(a=>dist(a,s.player)>11))return false;if(s.stage===3&&Math.abs(angle(s.player.yaw+Math.PI/2))>.35)return false;}
 if(widerBoating(s)){if(q.speed>1.25)return false;if(s.stage===5&&(dist({x:q.convoyX,z:q.convoyZ},{x:0,z:-171})>7||q.convoyLeg<5))return false;}if(s.level==='coastfire'&&s.stage===9)return q.escort&&dist({x:q.familyX,z:q.familyZ},{x:0,z:20})<3&&dist({x:q.familyX-.8,z:q.familyZ+.7},{x:0,z:20})<3;return true;}
function next(s){s.stage++;s.hold=0;emit(s,'checkpoint');if(s.stage>=WIDER_LEVELS[s.level].goals.length){s.finished=true;emit(s,'finish');}}
export function convoyRoute(route){return route==='fog'?[[-24,-24],[-20,-56],[-18,-105],[-18,-148],[0,-171]]:[[24,-24],[20,-56],[18,-105],[18,-148],[0,-171]];}
export function widerShelter(q){return q.route==='fleet'&&dist({x:q.boatX,z:q.boatZ},{x:23,z:-140})<15||q.route==='fog'&&q.boatX<-12&&q.boatZ<-124&&q.boatZ>-156&&q.speed<1.5;}
export function interactWider(s){const q=s.wider,st=s.stage;
 if(s.level==='monmouth'){
  if(st===0){q.order=true;s.armed=true;s.ammo=12;say(s,'monmouth.order');}
  if(st===1){q.rallied=true;q.squad=Array.from({length:6},(_,i)=>({x:(i%2-.5)*1.5,z:14+Math.floor(i/2)*1.5,yaw:0}));q.lastX=s.player.x;q.lastZ=s.player.z;say(s,'monmouth.rally');}
  if(st===2)say(s,'monmouth.column');
  if(st===3){q.turned=true;q.formation='line';q.formationYaw=-Math.PI/2;q.lineClock=0;s.enemies=Array.from({length:8},(_,i)=>({id:i,x:(i%4-1.5)*4,z:-57-Math.floor(i/4)*4,hp:1,yaw:Math.PI,cooldown:4+i*.65,dead:0,fired:0,moving:false,route:[0,-37]}));say(s,'monmouth.line');}
  if(st===5){q.ammoPassed=true;s.ammo+=4;say(s,'monmouth.cartridges');}
  if(st===6)say(s,'monmouth.leave');
 }else if(s.level==='openwater'){
  if(st===0){q.manifest=true;say(s,'wider.manifest');}
  if(st===1){q.aboard=true;q.moored=false;s.armed=true;s.ammo=6;q.lastShot=s.shotsFired;s.player.x=q.boatX;s.player.z=q.boatZ;say(s,'wider.tiller');}
  if(st===2){q.route=dist(s.player,{x:24,z:-32})<5?'fleet':'fog';q.survivorX=q.route==='fleet'?18:-18;q.survivorZ=-97;say(s,q.route==='fleet'?'wider.fleet':'wider.fog');}
  if(st===3){q.rescued=true;say(s,'wider.survivor');}
  if(st===5){q.moored=true;q.vx=q.vz=q.speed=0;q.convoyDelivered=true;s.armed=false;say(s,'wider.rope');}
 }else{
  if(st===0){q.orderRead=true;say(s,'coast.order');}
  if(st===1){q.danbury=true;say(s,'coast.danbury');}
  if(st===2){s.carrying=true;say(s,'coast.support');}
  if(st===3){s.carrying=false;q.patient=true;say(s,'coast.patient');}
  if(st===4){q.fairfield=true;say(s,'coast.fairfield');}
  if(st===5){q.holdingBucket=true;say(s,'coast.bucket');}
  if(st===6){q.holdingBucket=false;q.doused=true;emit(s,'douse',{x:18,z:-38});say(s,'coast.water');}
  if(st===7){q.beam=true;emit(s,'wood');say(s,'coast.beam');}
  if(st===8){q.escort=true;q.familyLeg=0;say(s,'coast.family');}
  if(st===9){q.escorted=true;say(s,'coast.landing');}
  if(st===10)say(s,'coast.launch');
 }next(s);
}
export function moveWiderBoat(s,input,dt,collide){const q=s.wider,p=s.player;if(q.moored)return;q.bump=Math.max(0,q.bump-dt);q.boatYaw=angle(q.boatYaw+(((input.left||input.leftTap)?1:0)-((input.right||input.rightTap)?1:0))*dt*.8);const brake=input.back||input.jump;
 const drive=input.sprint?6:3.6,drag=input.sprint?.92:1.25;if(input.forward&&!brake){q.vx-=Math.sin(q.boatYaw)*dt*drive;q.vz-=Math.cos(q.boatYaw)*dt*drive;}q.vx*=Math.exp(-dt*(brake?4.5:drag));q.vz*=Math.exp(-dt*(brake?4.5:drag));q.vx+=dt*(Math.sin(s.time*.14)*.3)*clamp((-q.boatZ-10)/30,0,1);
 const speed=Math.hypot(q.vx,q.vz);if(speed>6.5){q.vx*=6.5/speed;q.vz*=6.5/speed;}const nx=q.boatX+q.vx*dt,nz=q.boatZ+q.vz*dt;
 if(collide(s,nx,nz,1.35,0)){q.vx*=-.2;q.vz*=-.2;if(q.bump===0){q.bump=1.5;q.impacts++;q.hull=Math.max(1,q.hull-8);emit(s,'wood');say(s,'wider.shoal');emit(s,'checkpoint');}}else{q.travel+=Math.hypot(nx-q.boatX,nz-q.boatZ);q.boatX=nx;q.boatZ=nz;}q.speed=Math.hypot(q.vx,q.vz);p.x=q.boatX;p.z=q.boatZ;
}
function stepTo(s,a,tx,tz,dt,pace,collide){const d=dist(a,{x:tx,z:tz});if(d<.12)return;const step=Math.min(d,dt*pace),nx=a.x+(tx-a.x)/d*step,nz=a.z+(tz-a.z)/d*step;if(!collide(s,nx,nz,.25,0)){a.x=nx;a.z=nz;}else{if(!collide(s,nx,a.z,.25,0))a.x=nx;if(!collide(s,a.x,nz,.25,0))a.z=nz;}a.yaw=Math.atan2(-(tx-a.x),-(tz-a.z));}
export function updateWider(s,input,dt,{collide,blocked}){const q=s.wider,p=s.player;q.volley=Math.max(0,q.volley-dt);q.cutterFlash=Math.max(0,q.cutterFlash-dt);
 if(s.level==='monmouth'){
  const dx=p.x-q.lastX,dz=p.z-q.lastZ;if(Math.hypot(dx,dz)>.02)q.formationYaw=Math.atan2(-dx,-dz);q.lastX=p.x;q.lastZ=p.z;
  for(let i=0;i<q.squad.length;i++){const a=q.squad[i],side=q.formation==='line'?(i-2.5)*1.8:(i%2-.5)*1.5,back=q.formation==='line'?3:3+Math.floor(i/2)*1.5;stepTo(s,a,p.x+Math.cos(q.formationYaw)*side+Math.sin(q.formationYaw)*back,p.z-Math.sin(q.formationYaw)*side+Math.cos(q.formationYaw)*back,dt,3.3,collide);}
  if(widerFighting(s)){const inLine=dist(p,{x:0,z:-30})<13&&q.squad.filter(a=>dist(a,p)<11).length>=4;
   if(inLine){q.lineClock+=dt;const e=s.enemies.find(a=>a.hp>0);if(input.interact&&q.volley===0){q.volley=6;emit(s,'orderUsed');if(e){e.hp=0;emit(s,'widerVolley');}}if(Math.floor(q.lineClock/7)>Math.floor((q.lineClock-dt)/7)&&e){e.hp=0;emit(s,'widerVolley');}}
   for(const e of s.enemies){e.fired=Math.max(0,e.fired-dt);if(e.hp<=0){e.dead+=dt;continue;}if(e.z<-39)stepTo(s,e,e.x,-39,dt,.65,collide);e.yaw=Math.atan2(-(p.x-e.x),-(p.z-e.z));e.cooldown-=dt;e.aiming=e.cooldown<1.3;if(e.cooldown<=0&&dist(p,e)<45&&!blocked(s.level,{...e,y:1.4},{...p,y:input.crouch?1:1.65})){e.cooldown=7+e.id%3;e.fired=.2;emit(s,'enemyShot',{x:e.x,z:e.z});if((e.id+Math.floor(s.time))%4===0){p.health=Math.max(0,p.health-(s.difficulty==='story'?3:7));s.lastDamage=s.time;emit(s,'hurt');}}}
   if(inLine&&q.lineClock>=36&&s.enemies.every(e=>e.hp<=0)){say(s,'monmouth.held');next(s);}
  }return;
 }
 if(s.level==='openwater'&&q.aboard){
  if(!q.route){const a={x:q.convoyX,z:q.convoyZ,yaw:q.convoyYaw},d=dist(a,p);if(d>8&&d<27){const step=Math.min(d-8,dt*2.9),nx=a.x+(p.x-a.x)/d*step,nz=a.z+(p.z-a.z)/d*step;if(!collide(s,nx,nz,1.3,0)){q.convoyX=nx;q.convoyZ=nz;}q.convoyYaw=Math.atan2(-(p.x-a.x),-(p.z-a.z));}}
  if(q.route&&q.convoyLeg<5){const [tx,tz]=convoyRoute(q.route)[q.convoyLeg],a={x:q.convoyX,z:q.convoyZ,yaw:q.convoyYaw};if(dist(a,p)<27){const d=dist(a,{x:tx,z:tz}),step=Math.min(d,dt*2.9),nx=a.x+(tx-a.x)/(d||1)*step,nz=a.z+(tz-a.z)/(d||1)*step;if(!collide(s,nx,nz,1.3,0)){a.x=nx;a.z=nz;}else{if(!collide(s,nx,a.z,1.3,0))a.x=nx;if(!collide(s,a.x,nz,1.3,0))a.z=nz;}a.yaw=Math.atan2(-(tx-a.x),-(tz-a.z));q.convoyX=a.x;q.convoyZ=a.z;q.convoyYaw=a.yaw;if(d<1.1){q.convoyLeg++;emit(s,'checkpoint');}}}
  if(q.route&&!q.rescued)q.survivorZ=-97+Math.sin(s.time*.15)*2;
  if(q.route&&p.z<-65&&!q.intercepted){q.intercepted=true;q.lastShot=s.shotsFired;q.cutterX=clamp(p.x+13,-40,40);q.cutterZ=p.z+19;q.shotClock=8;say(s,'wider.intercept');emit(s,'checkpoint');}
  if(q.intercepted&&q.pursuit>0){const dx=p.x-q.cutterX,dz=p.z-q.cutterZ,d=Math.hypot(dx,dz),step=Math.min(Math.max(0,d-21),dt*3);q.cutterX=clamp(q.cutterX+dx/(d||1)*step,-42,42);q.cutterZ=clamp(q.cutterZ+dz/(d||1)*step,-185,25);q.cutterYaw=Math.atan2(-dx,-dz);
   if(s.shotsFired>q.lastShot){q.lastShot=s.shotsFired;const bearing=Math.atan2(-(q.cutterX-p.x),-(q.cutterZ-p.z)),pitch=Math.atan2(2.2-2.1,Math.max(1,d));if(d<45&&Math.abs(angle(bearing-p.yaw))<.11&&Math.abs(p.pitch-pitch)<.12){q.defensiveShots++;q.pursuit=Math.max(0,q.pursuit-.35);emit(s,'targetHit',{x:q.cutterX,z:q.cutterZ});emit(s,'checkpoint');}}
   if(widerShelter(q)){q.coverTime=Math.min(8,q.coverTime+dt);q.pursuit=Math.max(0,q.pursuit-dt*.22);}else{q.coverTime=Math.max(0,q.coverTime-dt);q.shotClock-=dt;if(q.shotClock<=0){q.shotClock=9;q.cutterFlash=.3;emit(s,'navalShot',{x:q.cutterX,z:q.cutterZ});q.hull=Math.max(1,q.hull-(s.difficulty==='story'?2:4));}}
  }if(s.stage===4&&q.pursuit===0){say(s,'wider.clear');next(s);}return;
 }
 if(s.level==='coastfire'){
  q.fireClock+=dt;q.fire=clamp(q.fireClock/70,0,1);if(!q.doused&&Math.hypot(p.x-18,p.z+38)<3.2){p.health=Math.max(1,p.health-dt*1.5);s.lastDamage=s.time;}
  if(q.escort&&!q.escorted){const way=[[20,-43],[20,-19],[4,-2],[0,20]],a={x:q.familyX,z:q.familyZ,yaw:0},[tx,tz]=way[q.familyLeg]||way[3];if(dist(p,a)<12){stepTo(s,a,tx,tz,dt,2.1,collide);q.familyX=a.x;q.familyZ=a.z;if(dist(a,{x:tx,z:tz})<.7&&q.familyLeg<3){q.familyLeg++;emit(s,'checkpoint');}}}return;
 }
}
export function widerContext(s){const q=s.wider;if(s.level==='monmouth')return widerFighting(s)?'Keep the section in this lane. E directs a volley; F fires and R reloads.':s.stage===3?'Face east with mouse / arrows, then E forms the line.':!widerCanUse(s)?'Wait for the section to catch up before the next command.':'The same column, turn and line you taught at Valley Forge.';
 if(s.level==='openwater'){if(!q.aboard)return 'Powder and supplies must stay covered. Isaiah leads a small local boat.';if(s.stage===2)return 'Blue flag east: fleet cover. Gray flag west: fog passage. Approach slowly, then E confirms.';if(s.stage===3)return 'The survivor drifts by the marked rope. Slow below landing speed, then E.';if(s.stage===4)return q.route==='fleet'?'Bring the boat inside the blue fleet cover at the eastern signal. F / R can discourage the pursuing cutter.':'The fog channel is west of the last shoal. S / Space slows and conceals the boat; F / R can discourage the cutter.';if(s.stage===5&&!widerCanUse(s))return 'The following vessel must reach the landing too. Keep within 27 m so it can follow; approach slowly.';return 'W drives · A / D steer · S / Space steady. Mouse / arrows look independently. Shoal impacts are recoverable.';}
 return s.carrying?'Support his weight. Anne is at the covered shore landing.':s.stage===9?'Move at the family’s pace down the cleared eastern lane. The landing waits for both people.':s.stage===6?'The burning beam is ahead. Bring the water from the well before trying to lift it.':'A small rescue cannot stop the raid. Keep the people together and leave a usable passage.';
}
