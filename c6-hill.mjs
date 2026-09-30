// A fictional section of the June 17 defense. Winning means bringing people out.
export const HILL_SPEC={title:'Hold Until Empty',place:'JUNE 17, 1775 · BREED’S HILL',spawn:[0,23],bounds:[-28,28,-58,53],music:'ridge',mode:'SIEGE / WITHDRAWAL',description:'Build the line. Face three assaults. Bring the wounded off the hill.',intro:'hillIntro',after:'hillEnding',goals:[
 {x:-8,z:3,label:'Reinforce the front breastwork',verb:'Brace the earthwork',time:1.7},
 {x:-12,z:9,label:'Place the reserve at either ammunition post',verb:'Place reserve cartridges',time:1},
 {x:0,z:4,label:'Take your place beside Ward',verb:'Take the musket',time:.7},
 {x:0,z:4,label:'First assault · hold the front line',verb:'Direct a volley',time:0},
 {x:18,z:3,label:'Repair the broken right flank',verb:'Raise the fallen timbers',time:2},
 {x:9,z:4,label:'Second assault · protect the flank',verb:'Direct a volley',time:0},
 {x:0,z:4,label:'Third assault · make the last cartridges count',verb:'Direct a volley',time:0},
 {x:-7,z:8,label:'Get the wounded behind the ridge',verb:'Help the man by the gun',time:1},
 {x:2,z:43,label:'Bring him to Mara behind the ridge',verb:'Lower him onto the blanket',time:.8},
 {x:17,z:16,label:'Reach the man by the broken fence',verb:'Help him to his feet',time:1},
 {x:2,z:43,label:'Get the second man behind the ridge',verb:'Help Mara lay him down',time:.8},
 {x:0,z:29,label:'Signal Ward to withdraw',verb:'Call Ward back',time:.7},
 {x:0,z:49,label:'Leave the hill with the crew',verb:'Leave by the rear lane',time:.6},
]};
// A traversable plateau, with earthworks and two open side passages.
export const HILL_BLOCKS=[[-5,0,28,1.25,1.12],[17,0,8,1.25,1.12],[-20,9,1.3,18,1.28],[21,9,1.3,18,1.28],[-12,20,15,1.25,1.5],[12,20,15,1.25,1.5],[-9,35,10,1.4,1.6],[12,35,10,1.4,1.6],[9,13,3,1,1.05]];
export const freshHill=()=>({braced:false,reserve:'',reserveUsed:false,flank:false,phase:0,clock:0,line:100,teamAmmo:64,volley:0,volleyCooldown:0,allyClock:0,crewFlash:0,retreat:false,gunCrew:true,rescues:0,wardCalled:false,wardProgress:0,shellIn:0,shellX:0,shellZ:0,shellClock:0,gunHit:false,signalCount:0});
export const hillDefending=s=>s.level==='breeds'&&[3,5,6].includes(s.stage);
const dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const emit=(s,type,data={})=>s.events.push({type,...data}),say=(s,id)=>emit(s,'voice',{id});
const reservePoint=h=>({x:h.reserve==='right'?12:-12,z:9});
export function hillGoal(s){if(s.stage===1)return {...HILL_SPEC.goals[1],x:s.player.x>0?12:-12};if(s.stage===12&&s.hill.wardProgress<.85)return {...HILL_SPEC.goals[12],verb:'Wait for Ward to reach the ridge'};return HILL_SPEC.goals[s.stage];}
export function hillSupply(s){return hillDefending(s)&&!s.hill.reserveUsed&&dist(s.player,reservePoint(s.hill))<2.5;}
export function hillCanVolley(s){return hillDefending(s)&&s.player.z>-1&&s.player.z<13&&Math.abs(s.player.x)<20&&s.hill.volleyCooldown<=0&&s.hill.teamAmmo>=8&&s.enemies.some(e=>e.hp>0&&e.z>-31);}
function advance(s){s.stage++;s.hold=0;if(s.stage>=HILL_SPEC.goals.length){s.finished=true;emit(s,'finish');}else emit(s,'checkpoint');}
function wave(s,number){const h=s.hill;h.phase=number;h.clock=0;h.allyClock=0;h.line=Math.max(65,h.line);s.wave=number;
 s.enemies=Array.from({length:number===1?6:number===2?8:10},(_,i)=>({id:i,x:(i%5-2)*7+(number===2?3:0),z:-46-Math.floor(i/5)*5,hp:1,yaw:Math.PI,route:[i%2?17:-17,7],patrol:false,cooldown:5+i*.35,dead:0,fired:0,moving:false}));
}
export function interactHill(s){const h=s.hill;
 if(s.stage===12&&h.wardProgress<.85)return;
 if(s.stage===0){h.braced=true;s.carrying=true;say(s,'hill.braced');}
 if(s.stage===1){h.reserve=s.player.x>0?'right':'left';s.carrying=false;say(s,h.reserve==='right'?'hill.right':'hill.left');}
 if(s.stage===2){s.armed=true;s.ammo=9;s.loaded=true;wave(s,1);say(s,'hill.first');}
 if(s.stage===4){h.flank=true;wave(s,2);say(s,'hill.second');}
 if(s.stage===7||s.stage===9){s.carrying=true;s.armed=false;say(s,s.stage===7?'hill.lift':'hill.other');}
 if(s.stage===8||s.stage===10){s.carrying=false;s.armed=true;h.rescues++;s.player.health=Math.min(100,s.player.health+30);say(s,s.stage===8?'hill.mara':'hill.safe');emit(s,'rescue');}
 if(s.stage===11){h.wardCalled=true;say(s,'hill.signal');}
 advance(s);
}
function hurt(s,n){s.player.health=Math.max(0,s.player.health-n);s.lastDamage=s.time;emit(s,'hurt');}
function alliedVolley(s,count){const h=s.hill,targets=s.enemies.filter(e=>e.hp>0&&e.z>-31).sort((a,b)=>b.z-a.z);
 targets.slice(0,count).forEach(e=>{e.hp=0;e.dead=0;});h.crewFlash=.22;emit(s,'hillVolley');
}
export function updateHill(s,input,dt,{blocked,collide}){const h=s.hill,p=s.player,defending=hillDefending(s);
 h.crewFlash=Math.max(0,h.crewFlash-dt);h.volleyCooldown=Math.max(0,h.volleyCooldown-dt);
 if(input.interact&&hillSupply(s)){h.reserveUsed=true;s.ammo=Math.min(30,s.ammo+6);h.teamAmmo+=12;p.health=Math.min(100,p.health+20);say(s,'hill.reserve');emit(s,'resupply');}
 else if(input.interact&&hillCanVolley(s)){h.teamAmmo-=8;h.volleyCooldown=9;h.signalCount++;alliedVolley(s,2);emit(s,'volleyOrder');}
 if(defending){
  const atLine=p.z<17&&p.z>-6&&Math.abs(p.x)<23;
  if(atLine)h.clock+=dt;
  h.allyClock+=dt;h.shellClock+=dt;
  if(h.allyClock>=10&&h.teamAmmo>=3){h.allyClock=0;h.teamAmmo-=3;alliedVolley(s,1);}
  if(h.phase===3)h.teamAmmo=Math.max(0,h.teamAmmo-dt*2.7);
  const pressure=s.enemies.filter(e=>e.hp>0&&e.z>-6).length;
  h.line=clamp(h.line-(pressure*2.3+(atLine?0:3))*dt,0,100);
  if(h.line===0){s.failed=true;emit(s,'fail');return;}
  if(h.shellClock>13&&h.shellIn<=0){h.shellClock=0;h.shellIn=3;h.shellX=p.x<0?-8:9;h.shellZ=4;emit(s,'shellWarning');}
  if(h.shellIn>0){h.shellIn=Math.max(0,h.shellIn-dt);if(h.shellIn===0){emit(s,'shell',{x:h.shellX,z:h.shellZ});if(dist(p,{x:h.shellX,z:h.shellZ})<3.2)hurt(s,s.difficulty==='story'?12:26);}}
  if(h.phase===3&&h.clock>9&&!h.gunHit){h.gunHit=true;h.gunCrew=false;emit(s,'shell',{x:-11,z:1});say(s,'hill.gun');}
  const standing=s.enemies.filter(e=>e.hp>0).length;
  if(h.phase<3&&h.clock>=16&&standing<=1){
   s.enemies.forEach(e=>e.retreat=true);
   if(h.phase===1){s.stage=4;say(s,'hill.flank');}
   else{s.stage=6;wave(s,3);say(s,'hill.third');}
   h.shellIn=0;s.hold=0;emit(s,'checkpoint');
  }
  if(h.phase===3&&h.clock>18&&h.teamAmmo<=0){h.retreat=true;h.shellIn=0;s.stage=7;s.hold=0;emit(s,'checkpoint');emit(s,'hillBreak');}
 }
 for(const e of s.enemies){e.fired=Math.max(0,e.fired-dt);if(e.hp<=0){e.dead+=dt;continue;}e.moving=false;
  const toward=Math.atan2(-(p.x-e.x),-(p.z-e.z));e.yaw=toward;
  if(e.retreat){e.z-=dt*3;e.moving=true;continue;}
  const stop=h.retreat?17:8,speed=h.phase===3?1.55:1.10;
  if(e.z<stop){const dx=e.z>-7?(e.x<0?-1:1)*dt*speed:0,dz=dt*speed;
   if(!collide(s,e.x,e.z+dz,.25,0)){e.z+=dz;e.moving=true;}
   else if(!collide(s,e.x+dx,e.z,.25,0)){e.x+=dx;e.moving=true;}
  }
  e.cooldown-=dt;e.aiming=e.cooldown<1.3;
  const eye={...p,y:input.crouch?1.02:1.7},open=!blocked('breeds',{...e,y:1.45},eye);
  if(e.cooldown<=0&&e.z>-30&&p.z<30&&open){e.cooldown=5.7+(e.id%3)*.65;e.fired=.2;emit(s,'enemyShot',{x:e.x,z:e.z});
   // Deterministic pressure: warning pose, then a shot. Real cover stops it.
   if((e.id+Math.floor(s.time))%3===0)hurt(s,s.difficulty==='story'?5:10);
  }
 }
 if(h.wardCalled)h.wardProgress=Math.min(1,h.wardProgress+dt*.12);
 if(s.stage>=7&&s.time-s.lastDamage>5&&p.z>28)p.health=Math.min(100,p.health+dt*5);
}
export function hillContext(s){const h=s.hill;
 if(s.stage===1)return 'Left post: close to the main line · right post: close to the flank';
 if(s.stage>=7)return s.carrying?'Keep moving. Mara is beyond the rear earthworks.':s.stage===12?(h.wardProgress<.85?'Keep the rear lane open. Ward is coming.':'Ward is here. Leave together.'):'The hill is lost. The people are not.';
 if(hillDefending(s)){
  if(s.player.z>=17||s.player.z<=-6)return 'Return to the earthworks. Your section needs you.';
  if(h.shellIn>0)return 'Incoming cannon shot · move away from the marked ground';
  if(h.phase===3)return h.teamAmmo<10?'The line is running out of cartridges.':'Third assault. Keep a route open behind you.';
  if(s.enemies.every(e=>e.hp<=0||e.z<-31))return 'Hold your fire until they close. Save your cartridges.';
  return h.volleyCooldown>0?'The militia are reloading. Use the earthwork.':'E directs a volley · crouch while reloading';
 }
 return s.stage===4?'They are regrouping. Close the opening before they return.':'';
}
