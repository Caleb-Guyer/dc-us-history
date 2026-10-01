// Fictional crew operations within the dated northern campaign of 1777.
const goal=(x,z,label,verb,time=1.2)=>({x,z,label,verb,time});
export const ALBANY_LEVELS={
 albanywoods:{title:'Three Roads to Albany',place:'NORTHERN NEW YORK · OCTOBER 2, 1777 · ROWAN VALE',spawn:[0,22],bounds:[-34,34,-65,30],music:'records',mode:'ROUTE DENIAL / PROTECTED PARLEY',intro:'albanyIntro',after:'albanyWest',description:'Read the three routes on the field map, meet a Mohawk messenger under safe passage, and close a military road while keeping a civilian passage open.',goals:[goal(-4,16,'Bring the intercepted plan to Ward','Spread the Albany plan'),goal(-7,16,'Set the northern route on the map','Place Burgoyne’s marker'),goal(-4,16,'Set the western route on the map','Place St. Leger’s marker'),goal(-1,16,'Set the southern route on the map','Place Clinton’s marker'),goal(-16,-8,'Take the western dispatch from Nathan','Read the August report'),goal(-22,-15,'Meet Jacob under safe passage','Lower your hands and listen'),goal(-6,-22,'Take the axe at the marked tree','Take the axe'),goal(-6,-22,'Fell the marked tree across the military road','Strike on the pale timing band',0),goal(-19,-26,'Open the separate civilian passage','Lift the passage rope'),goal(0,-55,'Rejoin the militia corridor','Give Ward the route report')]},
 bemis:{title:'Into the Open Flank',place:'BEMIS HEIGHTS · OCTOBER 7, 1777 · ROWAN VALE',spawn:[0,24],bounds:[-34,34,-65,31],music:'winterbattle',mode:'WOODLAND FLANK / ASSAULT',intro:'albanyBattle',after:'albanyRiver',description:'Find a way around a local British fieldwork, signal the supporting militia and advance with them.',goals:[goal(-5,17,'Take cartridges for the assault','Take the cartridges'),goal(-23,-12,'Get the supporting section around the fieldwork','Raise the flank signal'),goal(-12,-22,'Advance with the militia through the local passage','Order the section forward',0),goal(7,-39,'Secure the abandoned dispatch pouch','Take the northern papers'),goal(0,-55,'Leave the local fieldwork with Ward','Rejoin the section')]},
 hudsonwatch:{title:'Too Far to Reach Them',place:'HUDSON HIGHLANDS · OCTOBER 8, 1777 · ISAIAH MERCER',spawn:[0,23],bounds:[-34,34,-68,30],music:'river',mode:'RIVER WATCH / SIGNAL / EXTRACTION',intro:'albanyRiver',after:'albanyRingIntro',description:'Watch Clinton’s southern force, carry a report between two signal posts and get a trapped courier off the exposed river road.',goals:[goal(-4,17,'Take the field glass at the river watch','Look downriver'),goal(12,-5,'Signal the northern post from the high bank','Send the first signal'),goal(-17,-18,'Bring the report to the western relay','Pass the southern dispatch'),goal(-22,-34,'Reach the courier behind the broken cart','Support the trapped courier'),goal(-13,-9,'Bring the courier into the covered relay','Lower him behind the wall'),goal(4,-45,'Send the second relay before the patrol closes in','Send the report north'),goal(0,-58,'Leave the river watch by the inland road','Rejoin the inland party')]},
 saratogaring:{title:'No Road Left to Join',place:'SARATOGA · OCTOBER 12, 1777 · ROWAN VALE',spawn:[0,23],bounds:[-34,34,-70,30],music:'albany',mode:'CONVERGING ENCIRCLEMENT',intro:'albanyRingIntro',after:'albanySurrender',description:'Carry the western and southern reports to the northern militia, close a local military exit and hold your section’s place in the surrounding line.',goals:[goal(-4,17,'Give the militia the missing-armies reports','Read the western and southern reports'),goal(-21,-9,'Mark the northern road for the surrounding militia','Raise the northern signal'),goal(18,-19,'Drop the barrier across the military exit','Release the blocking timber'),goal(11,-22,'Stay with the closing section','Keep the passage closed',0),goal(0,-46,'Carry the surrender request back under a white flag','Take the ceasefire packet'),goal(0,-60,'Bring the sealed report to the crew','Deliver the negotiation papers')]},
};
export const ALBANY_BLOCKS={
 albanywoods:[[-5,12,11,6,1.08],[9,2,9,9,5],[-12,-19,1,18,1.1],[15,-28,1,26,1.2],[-20,-40,10,1,1.1],[8,-48,12,1,1.1]],
 bemis:[[-4,-9,18,1,1.2],[7,-20,1,24,1.2],[-25,-26,1,13,1.1],[4,-31,16,1,1.1],[23,6,8,9,5],[-20,9,8,9,5]],
 hudsonwatch:[[-5,9,12,1,1.2],[-15,-10,10,1,1.2],[19,-19,1,27,1.2],[-7,-32,13,1,1.2],[8,-43,1,13,1.2]],
 saratogaring:[[-5,6,14,1,1.2],[3,-13,13,1,1.2],[23,-14,1,16,1.2],[-18,-28,15,1,1.2],[-4,-42,1,15,1.2],[14,-49,12,1,1.2]],
};
const d=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z),emit=(s,type,data={})=>s.events.push({type,...data}),say=(s,id)=>emit(s,'voice',{id});
export function freshAlbany(){return {north:false,west:false,south:false,parley:false,passage:false,axe:false,cuts:0,beat:0,axeFlash:0,pressHeld:false,fallen:false,fall:0,clock:0,volley:0,ally:0,line:100,flank:false,dispatch:false,rescued:false,firstSignal:false,secondSignal:false,barrier:false,ceasefire:false};}
export function validAlbany(q){return !!q&&['north','west','south','parley','passage','axe','pressHeld','fallen','flank','dispatch','rescued','firstSignal','secondSignal','barrier','ceasefire'].every(k=>typeof q[k]==='boolean')&&['cuts','beat','axeFlash','fall','clock','volley','ally','line'].every(k=>Number.isFinite(q[k]))&&Number.isInteger(q.cuts)&&q.cuts>=0&&q.cuts<=3&&q.beat>=0&&q.beat<1&&q.fall>=0&&q.fall<=1&&q.clock>=0&&q.clock<1000&&q.line>=0&&q.line<=100&&q.axeFlash>=0&&q.axeFlash<=.45&&q.volley>=0&&q.volley<=7&&q.ally>=0&&q.ally<=8;}
export const albanyOperating=s=>s.level==='albanywoods'&&s.stage===7;
export const albanyFighting=s=>s.level==='bemis'&&s.stage===2||s.level==='saratogaring'&&s.stage===3;
export const albanyCanUse=s=>!albanyOperating(s)&&!albanyFighting(s);
export const albanyGoal=s=>ALBANY_LEVELS[s.level].goals[s.stage];
function next(s){s.stage++;s.hold=0;emit(s,'checkpoint');if(s.stage>=ALBANY_LEVELS[s.level].goals.length){s.finished=true;emit(s,'finish');}}
function spawn(s,n,side=0){s.enemies=Array.from({length:n},(_,i)=>({id:i,x:side?25-i%3*3:(i%3-1)*6,z:side?-30-Math.floor(i/3)*4:-49-Math.floor(i/3)*3,hp:1,yaw:Math.PI,cooldown:4+i*.75,dead:0,fired:0,moving:false,retreat:false}));}
export function interactAlbany(s){const q=s.albany,st=s.stage;
 if(s.level==='albanywoods'){
  if(st===0)say(s,'albany.map');
  if(st===1){q.north=true;say(s,'albany.north');}
  if(st===2){q.west=true;say(s,'albany.west');}
  if(st===3){q.south=true;say(s,'albany.south');}
  if(st===4){q.dispatch=true;say(s,'albany.westreport');}
  if(st===5){q.parley=true;next(s);emit(s,'albanyScene',{key:'albanyParley'});return;}
  if(st===6){q.axe=true;q.beat=0;say(s,'albany.axe');}
  if(st===8){q.passage=true;emit(s,'wood');say(s,'albany.passage');}
  if(st===9)say(s,'albany.westclear');
 }else if(s.level==='bemis'){
  if(st===0){s.armed=true;s.ammo=18;say(s,'bemis.cartridges');}
  if(st===1){q.flank=true;q.clock=0;spawn(s,9);say(s,'bemis.signal');}
  if(st===3){q.dispatch=true;say(s,'bemis.papers');}
  if(st===4)say(s,'bemis.clear');
 }else if(s.level==='hudsonwatch'){
  if(st===0)say(s,'hudson.glass');
  if(st===1){q.firstSignal=true;say(s,'hudson.first');}
  if(st===2){q.dispatch=true;spawn(s,5,1);s.armed=true;s.ammo=12;say(s,'hudson.report');}
  if(st===3){s.carrying=true;s.armed=false;say(s,'hudson.courier');}
  if(st===4){s.carrying=false;q.rescued=true;s.armed=true;s.player.health=Math.min(100,s.player.health+40);say(s,'hudson.shelter');}
  if(st===5){q.secondSignal=true;s.enemies.forEach(e=>e.retreat=true);say(s,'hudson.second');}
  if(st===6)say(s,'hudson.clear');
 }else{
  if(st===0){q.west=q.south=true;s.armed=true;s.ammo=18;say(s,'ring.reports');}
  if(st===1){q.north=true;say(s,'ring.north');}
  if(st===2){q.barrier=true;spawn(s,7,1);emit(s,'wood');say(s,'ring.barrier');}
  if(st===4){q.ceasefire=true;s.armed=false;s.enemies.forEach(e=>e.retreat=true);say(s,'ring.flag');}
  if(st===5){q.dispatch=true;say(s,'ring.packet');}
 }next(s);
}
export function updateAlbany(s,input,dt,{blocked,collide}){const q=s.albany,p=s.player;q.axeFlash=Math.max(0,q.axeFlash-dt);q.volley=Math.max(0,q.volley-dt);if(q.fallen)q.fall=Math.min(1,q.fall+dt*.7);
 if(albanyOperating(s)){
  const near=d(p,{x:-6,z:-22})<2.5;q.beat=(q.beat+dt*.45)%1;
  const stroke=input.press!==undefined?!!input.press:!!input.jump&&!q.pressHeld;q.pressHeld=!!input.jump;
  if(stroke&&near){q.axeFlash=.45;emit(s,'axeStroke');const width=s.difficulty==='story'?.24:.17;if(Math.abs(q.beat-.5)<=width){q.cuts++;emit(s,'checkpoint');if(q.cuts===3){q.axe=false;q.fallen=true;emit(s,'treeFall');say(s,'albany.fall');next(s);}}else say(s,'albany.miss');}
  return;
 }
 if(albanyFighting(s)){
  const target=s.level==='bemis'?{x:-12,z:-22}:{x:11,z:-22},near=d(p,target)<16;q.clock+=near?dt:0;q.ally+=near?dt:0;
  if(input.interact&&near&&q.volley===0){q.volley=7;const e=s.enemies.find(e=>e.hp>0);if(e){e.hp=0;e.dead=0;emit(s,'albanyVolley');}emit(s,'orderUsed');}
  if(q.ally>=8){q.ally=0;const e=s.enemies.find(e=>e.hp>0);if(e){e.hp=0;e.dead=0;emit(s,'albanyVolley');}}
  const pressure=s.enemies.filter(e=>e.hp>0&&e.z>-32).length;q.line=Math.max(0,Math.min(100,q.line+(near?1.3:-2)*dt-pressure*dt*.4));
  if(q.clock>=(s.level==='bemis'?40:36)&&s.enemies.every(e=>e.hp<=0)){say(s,s.level==='bemis'?'bemis.break':'ring.closed');next(s);}
  if(q.line===0){s.failed=true;emit(s,'fail');}
 }
 const active=albanyFighting(s)||s.level==='hudsonwatch'&&s.stage>=3&&s.stage<=5;
 for(const e of s.enemies){e.fired=Math.max(0,e.fired-dt);if(e.hp<=0){e.dead+=dt;continue;}if(!active||e.retreat){e.retreat=true;e.moving=false;continue;}
  const tx=s.level==='hudsonwatch'?23:e.x,tz=s.level==='hudsonwatch'?-22:-30,delta=Math.hypot(tx-e.x,tz-e.z);e.moving=delta>.4;if(e.moving){const step=Math.min(delta,dt*.7),nx=e.x+(tx-e.x)/delta*step,nz=e.z+(tz-e.z)/delta*step;if(!collide(s,nx,nz,.25,0)){e.x=nx;e.z=nz;}}
  e.yaw=Math.atan2(-(p.x-e.x),-(p.z-e.z));e.cooldown-=dt;e.aiming=e.cooldown<1.4;
  if(e.cooldown<=0&&d(p,e)<42&&!blocked(s.level,{...e,y:1.4},{...p,y:input.crouch?1.02:1.7})){e.cooldown=7+e.id%3;e.fired=.2;emit(s,'enemyShot',{x:e.x,z:e.z});if((e.id+Math.floor(s.time))%5===0){p.health=Math.max(0,p.health-(s.difficulty==='story'?4:8));s.lastDamage=s.time;emit(s,'hurt');}}
 }
}
export function albanyContext(s){const q=s.albany;
 if(albanyOperating(s))return 'Space / STRIKE when the marker enters the pale band · '+q.cuts+' / 3 cuts. Move away to rest; return to continue.';
 if(albanyFighting(s))return d(s.player,s.level==='bemis'?{x:-12,z:-22}:{x:11,z:-22})>=16?'Return to your section. The line needs your signal.':q.volley?'Reload behind timber while the section prepares its next volley.':'E directs the section · F fires · R reloads · C crouches';
 if(s.level==='albanywoods')return s.stage<4?'Three origins. One meeting point. Keep the routes separate on Ward’s map.':q.parley?'The military road can close. The separate passage is for people traveling home.':'The western report is from August. This meeting is in October; it does not replay the siege.';
 if(s.level==='hudsonwatch')return s.carrying?'The courier is leaning on you. The covered relay is behind the wall.':q.dispatch?'Clinton’s soldiers are moving north. Burgoyne needs help far beyond this watch.':'You are Isaiah at the southern river. Rowan’s section is hundreds of miles farther north.';
 return q.ceasefire?'The white flag carries terms. Keep your weapon lowered.':'Militia surround Burgoyne’s army. Your crew closes one small passage.';
}
