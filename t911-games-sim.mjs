// Browser-independent arcade model. Coordinates use a 1000 × 560 stage.
const MODES=new Set(['factory','canal','courier','river','dispatch','press']);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const finite=(v,fallback=0)=>Number.isFinite(v)?v:fallback;
const pickup={factory:'spool',canal:'crate',courier:'petition',river:'chart',dispatch:'dispatch',press:'newspaper'};
const hazard={factory:'gear',canal:'log',courier:'cart',river:'rock',dispatch:'volley',press:'cart'};
const lanes=[140,280,420];
function random(s){s.seed=(Math.imul(s.seed,1664525)+1013904223)>>>0;return s.seed/4294967296;}
function effect(s,kind,x=s.player.x,y=s.player.y,label=''){s.effects.push({id:++s.effectId,kind,x,y,life:.8,label});}
function hit(s,amount=20){if(s.invulnerable>0||s.player.dash>0)return false;s.health=clamp(s.health-amount,0,100);s.hits++;s.combo=0;s.invulnerable=1.25;effect(s,'hit');if(s.health===0){s.status='lost';s.reason='You ran out of health. Retry this short mission.';}return true;}
function collect(s,e,{perfect=false}={}){e.done=true;s.collected++;s.combo++;const lane=Number.isInteger(e.lane)?e.lane:clamp(Math.round((e.y-140)/140),0,2);if(!s.visitedPickupLanes.includes(lane))s.visitedPickupLanes.push(lane);s.paths=s.visitedPickupLanes.length;const points=100+Math.min(s.combo,10)*10+(perfect?75:0);s.score+=points;if(perfect)s.style.perfects++;effect(s,perfect?'perfect':'collect',e.x,e.y,perfect?`Perfect +${points}`:`+${points}`);}
export function createRun(mission,{seed=1}={}){
 const m={...mission,mode:MODES.has(mission?.mode)?mission.mode:'courier',target:clamp(Math.floor(finite(mission?.target,7)),1,100),duration:clamp(finite(mission?.duration,36),18,120),decisions:(mission?.decisions||[]).map(x=>({...x,choices:[...x.choices]})).sort((a,b)=>a.at-b.at)};
 return {mission:m,seed:(finite(seed,1)>>>0)||1,time:0,status:'playing',health:100,score:0,combo:0,progress:0,player:{x:230,y:280,lane:1,dash:0,duck:false,jump:0,jumpTime:0,boost:0,lean:0},entities:[],effects:[],gateIndex:0,decisions:[],collected:0,visitedPickupLanes:[],paths:0,hits:0,reason:'',actionCount:0,style:{perfects:0,nearMisses:0,vaults:0,boosts:0},invulnerable:1,actionCooldown:0,dashCooldown:0,jumpCooldown:0,boostCooldown:0,stun:0,spawnClock:0,hazardClock:0,spawnId:0,effectId:0,spawnCount:0,actionHeld:false,dashHeld:false,workX:230,workRadius:100};
}
function spawn(s,isHazard=false){
 const n=isHazard?s.spawnCount+1:s.spawnCount++,lane=n%3;
 // Pickups rotate predictably between the three paths; hazards never fill all paths.
 const kind=(isHazard?hazard:pickup)[s.mission.mode],r=isHazard?28:25;
 const y=lanes[isHazard?(lane+1)%3:lane];
 s.entities.push({id:++s.spawnId,kind,x:isHazard?1100:1000,y,r,lane:isHazard?(lane+1)%3:lane,vx:-(s.mission.mode==='factory'?205:225+random(s)*25),pickup:!isHazard,telegraph:isHazard?(kind==='volley'?1.1:.55):0,dangerPhase:0,done:false});
}
export function gate(s){return s.status==='gate'?(s.mission.decisions[s.gateIndex]||null):null;}
export function chooseGate(s,index){
 const g=gate(s);if(!g||!Number.isInteger(index)||index<0||index>=g.choices.length)return s;
 const correct=index===g.answer;s.decisions.push({index:s.gateIndex,option:index,correct});s.gateIndex++;s.status='playing';s.invulnerable=Math.max(s.invulnerable,1.5);
 if(correct){s.score+=150;s.health=clamp(s.health+10,0,100);effect(s,'decision',s.player.x,s.player.y,'Route secured');}else{s.stun=.45;effect(s,'decision',s.player.x,s.player.y,'Course corrected');}
 return s;
}
function tick(s,input,dt){
 s.time+=dt;s.progress=clamp(s.time/s.mission.duration,0,1);s.invulnerable=Math.max(0,s.invulnerable-dt);s.actionCooldown=Math.max(0,s.actionCooldown-dt);s.dashCooldown=Math.max(0,s.dashCooldown-dt);s.jumpCooldown=Math.max(0,s.jumpCooldown-dt);s.boostCooldown=Math.max(0,s.boostCooldown-dt);s.stun=Math.max(0,s.stun-dt);s.player.dash=Math.max(0,s.player.dash-dt);s.player.boost=Math.max(0,s.player.boost-dt);s.player.jumpTime=Math.max(0,s.player.jumpTime-dt);s.player.jump=s.player.jumpTime>0?Math.sin((1-s.player.jumpTime/.78)*Math.PI)*1.9:0;
 const mode=s.mission.mode,foot=mode==='courier'||mode==='press',boat=mode==='canal'||mode==='river';
 const active=Boolean(input.action||input.jump&&foot),pressed=active&&!s.actionHeld;s.actionHeld=active;
 const dashActive=Boolean(input.dash),dashPressed=dashActive&&!s.dashHeld;s.dashHeld=dashActive;
 if(active&&s.mission.mode==='factory'&&s.actionCooldown===0){
  s.actionCooldown=.28;s.actionCount++;
  const near=s.entities.filter(e=>!e.done&&Math.abs(e.x-s.player.x)<s.workRadius&&Math.abs(e.y-s.player.y)<65).sort((a,b)=>Math.abs(a.x-s.player.x)-Math.abs(b.x-s.player.x))[0];
  if(near){if(near.pickup)collect(s,near,{perfect:Math.abs(near.x-s.player.x)<33&&Math.abs(near.y-s.player.y)<35});else{near.done=true;hit(s,15);}}else effect(s,'work',s.player.x,s.player.y);
 }else if(pressed&&boat&&s.boostCooldown===0){s.actionCount++;s.style.boosts++;s.player.boost=.8;s.boostCooldown=1.7;s.actionCooldown=1.7;effect(s,'boost',s.player.x,s.player.y,'Current burst');
 }else if(pressed&&foot&&s.jumpCooldown===0){s.actionCount++;s.player.jumpTime=.78;s.jumpCooldown=1.05;s.actionCooldown=1.05;effect(s,'jump');
 }else if(pressed&&mode==='dispatch'&&s.dashCooldown===0){s.actionCount++;s.player.dash=.65;s.dashCooldown=1.8;s.actionCooldown=1.8;effect(s,'dash');}
 if(dashPressed&&foot&&s.dashCooldown===0){s.player.dash=.42;s.dashCooldown=2;effect(s,'dash');}
 s.player.duck=Boolean(input.duck)&&mode==='dispatch';
 const dx=Number(Boolean(input.right))-Number(Boolean(input.left)),dy=Number(Boolean(input.down))-Number(Boolean(input.up));
 const diagonal=dx&&dy?Math.SQRT1_2:1,speed=s.stun>0?0:s.player.dash>0?455:s.player.boost>0?385:285;
 s.player.lean+=(dy*.24-s.player.lean)*Math.min(1,dt*10);
 s.player.x=clamp(s.player.x+dx*speed*diagonal*dt,65,s.mission.mode==='factory'?400:850);s.player.y=clamp(s.player.y+dy*speed*diagonal*dt,95,470);s.player.lane=Math.round((s.player.y-140)/140);
 s.spawnClock+=dt;s.hazardClock+=dt;
 if(s.spawnClock>=1.12){s.spawnClock-=1.12;spawn(s);}
 if(s.hazardClock>=2.05){s.hazardClock-=2.05;spawn(s,true);}
 for(const e of s.entities){
  if(e.done)continue;const before=e.x;e.x+=e.vx*dt*(s.player.boost>0?1.18:1);e.telegraph=Math.max(0,e.telegraph-dt);e.dangerPhase=e.pickup?0:clamp(1-Math.abs(e.x-s.player.x)/300,0,1);
  const close=Math.abs(e.x-s.player.x)<e.r+26&&Math.abs(e.y-s.player.y)<e.r+26;
  if(close&&s.mission.mode!=='factory'){
   if(e.pickup)collect(s,e);
   else if(e.telegraph===0){e.done=true;if(e.kind==='cart'&&foot&&s.player.jump>.65){s.style.vaults++;s.score+=180;effect(s,'vault',s.player.x,s.player.y,'Clean vault +180');}else if(e.kind==='volley'&&s.player.duck){s.score+=60;effect(s,'cover',s.player.x,s.player.y,'In cover +60');}else hit(s);}
  }
  if(!e.pickup&&!e.nearAwarded&&before>=s.player.x&&e.x<s.player.x){const miss=Math.abs(e.y-s.player.y);if(miss>e.r+26&&miss<e.r+100){e.nearAwarded=true;s.style.nearMisses++;s.score+=50;effect(s,'near-miss',e.x,e.y,'Close pass +50');}}
  // Factory items must be processed, rather than collected just by touching them.
  if(e.x<-70){e.done=true;if(e.pickup&&s.mission.mode==='factory'){s.combo=0;effect(s,'miss',80,e.y);}}
 }
 s.entities=s.entities.filter(e=>!e.done&&e.x>-100);
 for(const e of s.effects)e.life-=dt;s.effects=s.effects.filter(e=>e.life>0);
 if(s.status!=='playing')return;
 const g=s.mission.decisions[s.gateIndex];if(g&&s.progress>=clamp(finite(g.at,.5),0,1)){s.status='gate';s.actionHeld=false;return;}
 const ready=s.collected>=s.mission.target&&s.paths>=2;
 if(s.progress>=.82&&ready&&s.gateIndex>=s.mission.decisions.length){s.status='won';s.reason='Objective complete.';s.score+=Math.round(s.health*2);effect(s,'finish');return;}
 if(s.progress>=1){s.status=ready?'won':'lost';s.reason=s.status==='won'?'Objective complete.':s.collected<s.mission.target?`Collected ${s.collected}/${s.mission.target}. Retry and follow the gold objectives.`:`Objectives collected, but only ${s.paths}/2 ${s.mission.mode==='factory'?'stations':'paths'} reached. Steer left or right and collect gold from a second path.`;if(s.status==='won')s.score+=Math.round(s.health*2);}
}
export function stepRun(s,input={},dt=0){
 if(s.status!=='playing')return s;
 let remaining=clamp(finite(dt),0,.25);
 // Small fixed upper slices prevent fast frames skipping collision windows.
 while(remaining>1e-9&&s.status==='playing'){const slice=Math.min(remaining,1/120);tick(s,input,slice);remaining-=slice;}
 return s;
}
export function summary(s){return {won:s.status==='won',score:s.score,collected:s.collected,paths:s.paths,hits:s.hits,decisionsCorrect:s.decisions.filter(x=>x.correct).length,decisionsTotal:s.decisions.length,seconds:Math.round(s.time*10)/10,style:{...s.style}};}
