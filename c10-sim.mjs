// Short fictional errands within fixed historical events. These simulations do
// not change an election, create a battle in the tariff crisis, or erase votes.
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const number=v=>Number.isFinite(v)?v:0;
const seconds=dt=>clamp(number(dt),0,.05);
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const controls=input=>input&&typeof input==='object'?input:{};

export const RUN_LENGTH=265;
export const RUN_LANE_WIDTH=2.8;
export const RUN_PACKETS=[
 {id:'jackson',at:55,lane:-1,votes:99,label:'Jackson'},
 {id:'adams',at:110,lane:1,votes:84,label:'Adams'},
 {id:'crawford',at:165,lane:0,votes:41,label:'Crawford'},
 {id:'clay',at:220,lane:-1,votes:37,label:'Clay'}
];
export const RUN_OBSTACLES=[
 {at:25,lane:0,type:'crate'},{at:39,lane:1,type:'wagon'},
 {at:80,lane:-1,type:'crate'},{at:96,lane:0,type:'wagon'},
 {at:132,lane:1,type:'crate'},{at:150,lane:-1,type:'wagon'},
 {at:192,lane:0,type:'crate'},{at:210,lane:1,type:'wagon'},
 {at:244,lane:-1,type:'crate'}
];
// Crossing wagons sweep across part of the road. The motion follows distance,
// rather than wall time, so a paused game cannot change an approaching gap.
export function runObstacleLane(o,s){
 if(o.type!=='wagon'||![96,210].includes(o.at))return o.lane;
 return clamp(o.lane+(o.lane===1?-1:1)*(.5+Math.sin((s.distance-o.at)*.11)*.5),-1,1);
}
export function createRun(){return {type:'run',distance:0,x:0,lane:0,jump:0,jumpTime:0,dash:0,dashCooldown:0,collected:[],health:3,elapsed:0,done:false,flash:'Four returns. A majority requires 131 electoral votes.',passed:[],invulnerable:0,hits:0,retries:0,style:0,combo:0,bestCombo:0,nearMisses:0,focus:0,clears:0};}
function runStyle(s,points){s.combo++;s.bestCombo=Math.max(s.bestCombo,s.combo);s.style+=points*Math.min(4,s.combo);s.focus=.45;s.dashCooldown=Math.max(0,s.dashCooldown-.5);}
function rewindRun(s){
 const missing=RUN_PACKETS.find(p=>!s.collected.includes(p.id));
 s.distance=missing?Math.max(0,missing.at-20):RUN_LENGTH-24;
 s.health=3;s.invulnerable=1.4;s.jump=s.jumpTime=s.dash=0;s.retries++;s.combo=0;
 s.passed=RUN_OBSTACLES.filter(o=>o.at<s.distance-2).map(o=>o.at);
 s.flash=missing?`Find the ${missing.label} return. Its votes cannot be left out.`:'Back on your feet. The returns are still safe.';
}
export function stepRun(s,dt,input={}){
 dt=seconds(dt);if(s.done||!dt)return [];
 input=controls(input);const events=[];
 s.elapsed+=dt;s.invulnerable=Math.max(0,s.invulnerable-dt);s.dashCooldown=Math.max(0,s.dashCooldown-dt);s.focus=Math.max(0,s.focus-dt);
 if(number(input.laneDelta))s.lane=clamp(s.lane+Math.sign(input.laneDelta),-1,1);
 if(input.jump&&s.jumpTime<=0){s.jumpTime=.85;events.push('jump');}
 if(input.dash&&s.dashCooldown<=0){s.dash=.48;s.dashCooldown=2.5;events.push('dash');}
 s.jumpTime=Math.max(0,s.jumpTime-dt);s.jump=s.jumpTime?Math.sin((1-s.jumpTime/.85)*Math.PI)*1.7:0;
 s.dash=Math.max(0,s.dash-dt);
 s.x+=(s.lane*RUN_LANE_WIDTH-s.x)*Math.min(1,dt*12);
 const before=s.distance;s.distance+=dt*(s.dash>0?23:input.sprint?13:11);
 for(const o of RUN_OBSTACLES){
  if(s.passed.includes(o.at)||s.distance<o.at-.8)continue;
  s.passed.push(o.at);
  const gap=Math.abs(s.x-runObstacleLane(o,s)*RUN_LANE_WIDTH),contact=before<o.at+2&&gap<1.15;
  if(contact&&(o.type==='wagon'||s.jump<.85)&&s.invulnerable<=0){
   s.health--;s.hits++;s.combo=0;s.invulnerable=1.1;s.flash=o.type==='wagon'?'Wagon crossing. Change lanes.':'Low crate. Leap with Space.';events.push('hit');
   if(s.health<=0){rewindRun(s);events.push('retry');return events;}
  }else if(contact&&o.type==='crate'&&s.jump>=.85){s.clears++;runStyle(s,25);s.flash='Clean vault. Dash recharges faster.';events.push('clear');}
  else if(!contact&&gap>=1.15&&gap<2.15&&s.invulnerable<=0){s.nearMisses++;runStyle(s,15);s.flash='Close pass. Keep the delivery chain moving.';events.push('near-miss');}
 }
 for(const p of RUN_PACKETS){
  if(!s.collected.includes(p.id)&&Math.abs(s.distance-p.at)<2.5&&Math.abs(s.x-p.lane*RUN_LANE_WIDTH)<1.25){s.collected.push(p.id);runStyle(s,50);s.flash=`${p.label}: ${p.votes} electoral votes.`;events.push(p.id);}
 }
 if(s.distance>=RUN_LENGTH){
  if(RUN_PACKETS.every(p=>s.collected.includes(p.id))){s.distance=RUN_LENGTH;s.done=true;s.flash='99 + 84 + 41 + 37 = 261. No candidate reaches 131. The House decides.';events.push('finish');}
  else{rewindRun(s);events.push('retry');}
 }
 return events;
}

export const HARBOR_DOCKS=[{x:180,y:500,label:'West wharf'},{x:500,y:500,label:'Center wharf'},{x:820,y:500,label:'East wharf'}];
export const HARBOR_STORMS=[{x:340,y:270,r:55},{x:690,y:300,r:60}];
const HARBOR_STARTS=[100,500,900];
const CARGO=['Imported cloth','Iron tools','Manufactured goods'];
function freeStart(s,preferred,exclude=null){
 const positions=[preferred,...HARBOR_STARTS,300,700,55,945];
 return positions.find(x=>!s.boats.some(b=>b!==exclude&&Math.hypot(b.x-x,b.y-55)<65))??preferred;
}
function spawnBoat(s){
 const i=s.spawned++,x=freeStart(s,HARBOR_STARTS[i%3]);
 s.boats.push({id:`boat-${i+1}`,x,y:55,dock:[2,0,1][i%3],route:[],cargo:CARGO[i%3],radius:18,heading:Math.PI/2,speed:46,cooldown:1,wrongDock:false,boost:0});
}
export function createHarbor(){const s={type:'harbor',elapsed:0,boats:[],selected:null,delivered:0,misses:0,done:false,flash:'Chart a safe route, then hold Space to catch the wind on your selected ship.',spawned:0,wind:0,boostCooldown:0,boosts:0,cleanChain:0,style:0};for(let i=0;i<3;i++)spawnBoat(s);return s;}
export function setBoatRoute(s,id,points){
 const boat=s.boats.find(b=>b.id===id);
 if(s.done||!boat||!Array.isArray(points)||points.some(p=>!p||!Number.isFinite(p.x)||!Number.isFinite(p.y)))return false;
 // A drawn line can contain many pointer samples; retain its last destination.
 const chosen=points.length>80?points.filter((_,i)=>i%Math.ceil(points.length/79)===0).concat(points.slice(-1)):points;
 boat.route=chosen.map(p=>({x:clamp(p.x,45,955),y:clamp(p.y,40,555)}));boat.wrongDock=false;s.selected=id;
 s.flash=`${boat.cargo} → ${HARBOR_DOCKS[boat.dock].label}. Keep clear of shoals and other ships.`;return true;
}
function setbackBoat(s,boat,message,events){
 boat.x=freeStart(s,HARBOR_STARTS[(Number(boat.id.split('-')[1])-1)%3],boat);boat.y=55;boat.route=[];boat.cooldown=2;boat.wrongDock=false;boat.boost=0;
 s.misses++;s.cleanChain=0;s.flash=message;events.push('setback');
}
export function stepHarbor(s,dt,input={}){
 dt=seconds(dt);if(s.done||!dt)return [];
 input=controls(input);const events=[],arrivals=[];s.elapsed+=dt;s.wind=Math.sin(s.elapsed*.65);s.boostCooldown=Math.max(0,s.boostCooldown-dt);
 const selected=s.boats.find(b=>b.id===s.selected);
 if(input.boost&&s.boostCooldown<=0&&selected?.route.length){selected.boost=2;s.boostCooldown=3.2;s.boosts++;s.flash=`Full sail: ${selected.cargo}. Watch the crossing traffic.`;events.push('boost');}
 for(const boat of s.boats){
  boat.cooldown=Math.max(0,boat.cooldown-dt);
  boat.boost=Math.max(0,boat.boost-dt);
  // The wind changes passage speed, never blows a carefully drawn route into a
  // shoal. Boosting makes the same route much faster but demands traffic timing.
  const exposed=boat.y>210&&boat.y<410,windSpeed=exposed?1-Math.max(0,s.wind)*.18:1;
  let travel=boat.speed*dt*windSpeed*(boat.boost>0?2.8:1);
  while(boat.route.length&&travel>0){const target=boat.route[0],dx=target.x-boat.x,dy=target.y-boat.y,d=Math.hypot(dx,dy),step=Math.min(d,travel);if(d>0){boat.x+=dx/d*step;boat.y+=dy/d*step;boat.heading=Math.atan2(dy,dx);}travel-=step;if(d<=step+.001)boat.route.shift();else break;}
  boat.x=clamp(boat.x,45,955);boat.y=clamp(boat.y,40,555);
  if(!boat.cooldown&&HARBOR_STORMS.some(p=>distance(boat,p)<p.r+boat.radius)){setbackBoat(s,boat,'Shallow water. The cargo is safe; chart another route from the harbor entrance.',events);continue;}
  const dock=HARBOR_DOCKS[boat.dock];
  if(distance(boat,dock)<25){arrivals.push(boat);continue;}
  if(!boat.route.length&&!boat.wrongDock&&HARBOR_DOCKS.some((p,i)=>i!==boat.dock&&distance(boat,p)<27)){boat.wrongDock=true;s.flash=`That cargo belongs at ${dock.label}. Select the ship and reroute it.`;events.push('wrong-dock');}
 }
 for(let i=0;i<s.boats.length;i++)for(let j=i+1;j<s.boats.length;j++){
  const a=s.boats[i],b=s.boats[j];if(arrivals.includes(a)||arrivals.includes(b)||a.cooldown||b.cooldown)continue;
  if(distance(a,b)<a.radius+b.radius){setbackBoat(s,a,'Ships too close. Both crews return safely to the entrance. Separate their routes.',events);setbackBoat(s,b,s.flash,events);}
 }
 if(arrivals.length){
  for(const boat of arrivals){boat.x=HARBOR_DOCKS[boat.dock].x;boat.y=HARBOR_DOCKS[boat.dock].y;s.delivered++;s.cleanChain++;s.style+=100*Math.min(3,s.cleanChain);events.push('delivery');if(s.selected===boat.id)s.selected=null;}
  s.boats=s.boats.filter(b=>!arrivals.includes(b));s.flash=`${s.delivered}/6 cargoes landed. Customs work continues while the tariff dispute grows.`;
  while(s.spawned<6&&s.boats.length<3)spawnBoat(s);
 }
 if(s.delivered>=6){s.done=true;s.flash='Harbor traffic is secure. Force was authorized; a tariff compromise defused the crisis.';events.push('finish');}
 return events;
}

export const RALLY_PROPS=[
 {id:'harrison',x:165,y:455,target:{x:235,y:175},label:'Harrison — Whig'},
 {id:'tyler',x:835,y:440,target:{x:500,y:175},label:'Tyler — Whig running mate'},
 {id:'vanburen',x:500,y:360,target:{x:765,y:175},label:'Van Buren — Democrat'}
];
export const RALLY_OBSTACLES=[
 {id:'cabin-float',x:500,y:295,w:110,h:42,amplitude:310,speed:.45,phase:0},
 {id:'campaign-wagon',x:500,y:405,w:105,h:42,amplitude:285,speed:.56,phase:3.7}
];
// Optional crowd pennants reward a fast route without changing the election or
// forcing a detour on someone who only wants to finish the short assignment.
export const RALLY_CHEERS=[{id:'west-cheer',x:320,y:470},{id:'east-cheer',x:710,y:330},{id:'front-cheer',x:280,y:230},{id:'stage-cheer',x:660,y:205}];
export function rallyObstacles(s){return RALLY_OBSTACLES.map(o=>({...o,x:o.x+Math.sin((s.elapsed+o.phase)*o.speed)*o.amplitude}));}
export function createRally(){const s={type:'rally',player:{x:500,y:500,carry:null},elapsed:0,placed:[],done:false,flash:'Sprint the placards through the parade. Gold pennants refill your dash.',dodge:0,cooldown:0,dodgeX:0,dodgeY:-1,bump:0,obstacles:[],cheers:[],flow:0,style:0,nearMisses:0,dodged:[]};s.obstacles=rallyObstacles(s);return s;}
export function stepRally(s,dt,input={}){
 dt=seconds(dt);if(s.done||!dt)return [];
 input=controls(input);const events=[];s.elapsed+=dt;s.cooldown=Math.max(0,s.cooldown-dt);s.bump=Math.max(0,s.bump-dt);s.dodge=Math.max(0,s.dodge-dt);s.flow=Math.max(0,s.flow-dt);
 let mx=clamp(number(input.x),-1,1),my=clamp(number(input.y),-1,1),length=Math.hypot(mx,my);
 if(input.dash&&!s.cooldown){s.dodge=.25;s.cooldown=1.8;s.dodgeX=length?mx/length:0;s.dodgeY=length?my/length:-1;events.push('dash');}
 if(s.dodge>0){mx=s.dodgeX;my=s.dodgeY;length=1;}
 const speed=s.dodge>0?560:(input.sprint?270:190)*(s.flow>0?1.22:1);
 if(length){s.player.x=clamp(s.player.x+mx/length*speed*dt,65,935);s.player.y=clamp(s.player.y+my/length*speed*dt,100,560);}
 for(const pennant of RALLY_CHEERS)if(!s.cheers.includes(pennant.id)&&distance(s.player,pennant)<=26){s.cheers.push(pennant.id);s.flow=2.4;s.cooldown=0;s.style+=75;s.flash='Crowd pennant! Dash ready. Keep moving.';events.push('cheer');}
 s.obstacles=rallyObstacles(s);
 if(s.dodge>0)for(const o of s.obstacles){if(!s.dodged.includes(o.id)&&Math.abs(s.player.x-o.x)<o.w/2+35&&Math.abs(s.player.y-o.y)<o.h/2+35){s.dodged.push(o.id);s.nearMisses++;s.style+=100;events.push('near-miss');}}
 if(!s.bump&&!s.dodge){for(const o of s.obstacles){const dx=s.player.x-o.x,dy=s.player.y-o.y,rx=o.w/2+14,ry=o.h/2+14;if(Math.abs(dx)<rx&&Math.abs(dy)<ry){
   if(rx-Math.abs(dx)<ry-Math.abs(dy))s.player.x=clamp(o.x+(dx>=0?rx:-rx),65,935);else s.player.y=clamp(o.y+(dy>=0?ry:-ry),100,560);
   s.bump=.8;s.flash='Parade carts crossing. Dash through a gap or go around.';events.push('bump');break;
  }}}
 return events;
}
export function interactRally(s){
 if(s.done)return {s,event:null};
 if(s.player.carry){
  const prop=RALLY_PROPS.find(p=>p.id===s.player.carry);
  if(prop&&distance(s.player,prop.target)<=35&&!s.placed.includes(prop.id)){
   s.placed.push(prop.id);s.player.carry=null;s.style+=150;s.flash=`${prop.label} placard placed. ${s.placed.length}/3 campaign positions prepared.`;
   if(RALLY_PROPS.every(p=>s.placed.includes(p.id))){s.done=true;s.flash='The campaign is ready. Image, slogans and party organization reach a mass electorate.';return {s,event:'finish',id:prop.id};}
   return {s,event:'place',id:prop.id};
  }
  return {s,event:null};
 }
 const prop=RALLY_PROPS.find(p=>!s.placed.includes(p.id)&&distance(s.player,p)<=35);
 if(!prop)return {s,event:null};
 s.player.carry=prop.id;s.flash=`Carry ${prop.label} to the marked platform.`;return {s,event:'pickup',id:prop.id};
}
