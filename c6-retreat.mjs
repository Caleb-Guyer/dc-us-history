// Fictional local rescues inside the documented 1776 New York campaign.
const goal=(x,z,label,verb,time=.8)=>({x,z,label,verb,time});
export const RETREAT_LEVELS={
 longisland:{title:'No Ground Left',place:'LONG ISLAND · AUGUST 27, 1776',spawn:[0,23],bounds:[-30,30,-55,66],music:'retreat',mode:'FIGHTING RETREAT',intro:'retreatIntro',after:'retreatHandoff',description:'A flanking army is closing the road. Hold a local passage, then bring two wounded men out.',goals:[
  goal(0,17,'Take Ward’s spare musket','Take the musket'),goal(0,8,'Keep the local passage open','Cover the withdrawal',0),
  goal(-19,12,'Reach the wounded man by the orchard','Support him'),goal(2,53,'Bring him behind the Brooklyn works','Help Mara lower him',1),
  goal(19,5,'Reach the man at the broken fence','Support him'),goal(2,53,'Bring the second man to Mara','Help him onto the litter',1),
  goal(0,61,'Leave the lost field with Ward','Withdraw to the river road') ]},
 eastriver:{title:'Every Quiet Oar',place:'EAST RIVER · NIGHT OF AUGUST 29–30, 1776 · ISAIAH MERCER',spawn:[0,15],bounds:[-29,29,-113,24],music:'river',mode:'ISAIAH · FERRY',intro:'retreatHandoff',after:'retreatCrossed',description:'Take the crew across, return for the last wounded party, and land quietly in Manhattan.',goals:[
  goal(0,10,'Board the loaded ferry','Take the oars'),goal(0,-99,'Row the crew to the Manhattan landing','Tie up on the far bank',1.2),
  goal(0,-99,'Help the crew onto the Manhattan dock','Let the crew disembark',1.1),goal(0,10,'Return for the wounded party','Tie up at Brooklyn',1.2),
  goal(0,10,'Bring the last party aboard','Load the wounded',1.2),goal(0,-99,'Get the wounded to Manhattan','Tie up on the far bank',1.2),
  goal(0,-99,'Help the last party ashore','Secure the ferry',1.1) ]},
 cityrefuge:{title:'The Returned Seal',place:'NEW YORK · SEPTEMBER 11, 1776 · BEFORE THE CITY’S FALL',spawn:[0,24],bounds:[-25,25,-67,30],music:'home',mode:'CIVILIAN PASSAGE',intro:'retreatPeace',after:'retreatCity',description:'Return the failed peace papers, help Thomas’s displaced neighbors, and keep a family together.',goals:[
  goal(-13,8,'Bring the returned peace packet to Thomas','Hand over the sealed reply'),goal(13,-9,'Help the displaced family recover its papers','Take the family’s register'),
  goal(-13,-24,'Find the daughter waiting at the customs gate','Show her the family register'),goal(13,-9,'Bring her back to her family','Reunite the family',1),
  goal(0,-42,'Open the shelter for the displaced neighbors','Unbar the refuge',1.2),goal(0,-61,'Leave the city by the northern road','Join Ward') ]},
 harlem:{title:'A Little Ground Back',place:'HARLEM HEIGHTS · SEPTEMBER 16, 1776',spawn:[0,25],bounds:[-30,30,-55,34],music:'battle',mode:'FLANK / COUNTERATTACK',intro:'retreatHarlem',after:'retreatLift',description:'Get around the pursuing line, signal the militia, and hold a flank with them.',goals:[
  goal(-5,19,'Take the flank assignment','Take the signal cloth'),goal(-21,-10,'Reach the wooded flank and signal the militia','Raise the signal',1),
  goal(-17,-13,'Help the militia push back the pursuit','Direct the flank volley',0),goal(0,22,'Return to Ward after the counterattack','Rejoin the section') ]},
 whiteplains:{title:'Leave a Road Behind',place:'WHITE PLAINS · OCTOBER 28, 1776',spawn:[0,21],bounds:[-30,30,-54,73],music:'retreat',mode:'REARGUARD / EXTRACTION',intro:'retreatPlains',after:'retreatEnding',description:'Howe takes the field again. Clear a trapped wagon, cover its crew, and bring Ward off the line.',goals:[
  goal(0,15,'Take the withdrawal order','Take Ward’s cartridge pouch'),goal(0,7,'Hold the lane while the wagons turn','Cover the lane',0),
  goal(-17,26,'Free the wagon’s jammed axle','Brace and lift the fallen beam',2),goal(-17,26,'Escort the wagon along the rear lane','Stay near the wagon',0),
  goal(0,12,'Call Ward away from the front line','Give the withdrawal signal'),goal(0,66,'Wait for Ward at the rear road','Leave with the crew') ]},
};
export const RETREAT_BLOCKS={
 longisland:[[-10,1,18,1.1,1.08],[16,1,13,1.1,1.1],[-26,18,1.2,23,1.4],[26,17,1.2,26,1.4],[-10,31,13,1,1.2],[12,39,12,1,1.2],[-20,-23,7,12,6],[21,-30,7,13,6]],
 eastriver:[[-17,-19,6,5,.8],[17,-54,7,5,.8],[-13,-75,6,5,.8]],
 cityrefuge:[[-14,22,12,10,7],[13,7,12,12,7],[-14,-7,12,12,7],[13,-33,12,15,7],[-14,-47,12,14,7],[0,-49,6,8,4.5]],
 harlem:[[-6,-2,14,1.1,1.15],[12,3,12,1.1,1.1],[-26,-28,1,18,1.3],[17,-30,5,7,2]],
 whiteplains:[[-11,0,18,1,1.1],[15,0,13,1,1.1],[11,29,12,1,1.3],[-9,43,10,1,1.3],[14,54,9,1,1.4]],
};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z),angle=v=>Math.atan2(Math.sin(v),Math.cos(v));
const emit=(s,type,data={})=>s.events.push({type,...data}),say=(s,id)=>emit(s,'voice',{id});
export function freshRetreat(level){return {clock:0,line:100,rescues:0,flanked:false,signaled:false,wave:0,ally:0,volley:0,shell:0,shellClock:0,shellX:0,shellZ:0,supply:false,escort:false,reunited:false,shelter:false,beam:false,wagonX:-17,wagonZ:26,wagonMoved:0,wardCalled:false,wardZ:12,aboard:false,moored:true,boatX:0,boatZ:10,boatYaw:0,vx:0,vz:0,spin:0,speed:0,lastOar:'',oarClock:0,stroke:0,balance:0,strain:0,crossings:0,groundings:0,cargo:level==='eastriver'?6:0,warning:false,oldStage:0};}
export const retreatDefending=s=>!!s.retreat&&((s.level==='longisland'||s.level==='whiteplains')&&s.stage===1||s.level==='harlem'&&s.stage===2);
export const retreatBoating=s=>s.level==='eastriver'&&s.retreat?.aboard;
export function validRetreat(q,b){return q&&['clock','line','rescues','wave','ally','volley','shell','shellClock','shellX','shellZ','wagonX','wagonZ','wagonMoved','wardZ','boatX','boatZ','boatYaw','vx','vz','spin','speed','oarClock','stroke','balance','strain','crossings','groundings','cargo','oldStage'].every(k=>Number.isFinite(q[k]))&&['flanked','signaled','supply','escort','reunited','shelter','beam','wardCalled','aboard','moored','warning'].every(k=>typeof q[k]==='boolean')&&['','left','right'].includes(q.lastOar)&&q.line>=0&&q.line<=100&&q.rescues>=0&&q.rescues<=2&&q.cargo>=0&&q.cargo<=8&&q.balance>=-1&&q.balance<=1&&q.strain>=0&&q.strain<=1&&q.boatX>=b[0]&&q.boatX<=b[1]&&q.boatZ>=b[2]&&q.boatZ<=b[3]&&q.crossings>=0&&q.crossings<=2&&q.wave>=0&&q.wave<=2;}
export function retreatGoal(s){const q=s.retreat,g=RETREAT_LEVELS[s.level].goals[s.stage];if(!g)return null;
 if(s.level==='whiteplains'&&s.stage===3)return {...g,x:q.wagonX,z:q.wagonZ};
 if(s.level==='whiteplains'&&s.stage===5&&q.wardZ<60)return {...g,verb:'Keep the rear road open for Ward'};
 return g;
}
export function retreatCanUse(s){const q=s.retreat;
 if(retreatDefending(s)||s.level==='whiteplains'&&s.stage===3)return false;
 if(s.level==='whiteplains'&&s.stage===5)return q.wardZ>=60;
 if(s.level==='eastriver'&&[1,3,5].includes(s.stage))return q.speed<1.45&&Math.abs(q.boatX)<4&&Math.abs(q.boatZ-retreatGoal(s).z)<4;
 return true;
}
export function retreatNear(s){const g=retreatGoal(s);return !!g&&dist(s.player,g)<(s.level==='eastriver'&&s.stage>0?4:2.5);}
function next(s){s.stage++;s.hold=0;emit(s,'checkpoint');if(s.stage>=RETREAT_LEVELS[s.level].goals.length){s.finished=true;emit(s,'finish');}}
function foes(s,n=6){s.enemies=Array.from({length:n},(_,i)=>({id:i,x:(i%3-1)*8,z:-35-Math.floor(i/3)*5,hp:1,yaw:Math.PI,route:[(i%3-1)*8,8],patrol:false,cooldown:3+i*.55,dead:0,fired:0,moving:false}));}
export function interactRetreat(s){const q=s.retreat,st=s.stage;
 if(s.level==='longisland'){
  if(st===0){s.armed=true;s.ammo=12;foes(s,9);say(s,'retreat.line');}
  if(st===2||st===4){s.carrying=true;s.armed=false;say(s,st===2?'retreat.first':'retreat.second');}
  if(st===3||st===5){s.carrying=false;s.armed=true;q.rescues++;s.player.health=Math.min(100,s.player.health+30);say(s,st===3?'retreat.safe1':'retreat.safe2');emit(s,'rescue');}
  if(st===6)say(s,'retreat.leave');
 }else if(s.level==='eastriver'){
  if(st===0){q.aboard=true;q.moored=false;q.boatYaw=0;s.player.x=q.boatX;s.player.z=q.boatZ;say(s,'river.oars');}
  if([1,3,5].includes(st)){q.moored=true;q.speed=0;q.vx=q.vz=q.spin=0;emit(s,'wood');say(s,st===3?'river.back':'river.land');}
  if(st===2){q.cargo=0;q.crossings=1;q.moored=false;q.boatYaw=Math.PI;say(s,'river.return');}
  if(st===4){q.cargo=8;q.moored=false;q.boatYaw=0;q.balance=0;say(s,'river.last');}
  if(st===6){q.cargo=0;q.crossings=2;q.aboard=false;say(s,'river.safe');}
 }else if(s.level==='cityrefuge'){
  if(st===0){say(s,'refuge.reply');say(s,'refuge.franklin');}
  if(st===1)say(s,'refuge.family');
  if(st===2){q.escort=true;s.ward.x=-13;s.ward.z=-24;s.ward.path=null;say(s,'refuge.daughter');}
  if(st===3){q.escort=false;q.reunited=true;say(s,'refuge.reunited');}
  if(st===4){q.shelter=true;say(s,'refuge.tenants');}
  if(st===5)say(s,'refuge.road');
 }else if(s.level==='harlem'){
  if(st===0){s.armed=true;s.ammo=14;foes(s,6);say(s,'harlem.flank');}
  if(st===1){q.signaled=true;q.clock=0;q.wave=1;emit(s,'wood');say(s,'harlem.signal');}
  if(st===3)say(s,'harlem.return');
 }else{
  if(st===0){s.armed=true;s.ammo=14;foes(s,8);say(s,'plains.hold');}
  if(st===2){q.beam=true;q.clock=0;emit(s,'wood');say(s,'plains.axle');}
  if(st===4){q.wardCalled=true;say(s,'plains.ward');}
  if(st===5)say(s,'plains.together');
 }
 next(s);
}
function hurt(s,n){s.player.health=Math.max(0,s.player.health-n);s.lastDamage=s.time;emit(s,'hurt');}
export function moveFerry(s,input,dt,collide){const q=s.retreat,p=s.player;if(!q.aboard||q.moored)return;
 q.oarClock=Math.max(0,q.oarClock-dt);q.stroke=Math.max(0,q.stroke-dt*2);q.spin*=Math.exp(-dt*2.1);
 const stroke=side=>{const opposite=q.lastOar&&q.lastOar!==side;const strength=(opposite?2.9:1.8)*(q.cargo===8?.82:1);q.vx-=Math.sin(q.boatYaw)*strength;q.vz-=Math.cos(q.boatYaw)*strength;q.spin+=(side==='left'?-1:1)*.42;q.balance=clamp(q.balance+(side==='left'?-.13:.13),-1,1);q.lastOar=side;q.stroke=1;q.oarClock=.45;emit(s,'oar');};
 // Separate taps and held keys both work. W alternates automatically for touch access.
 if(q.oarClock===0){if(input.left||input.leftTap)stroke('left');else if(input.right||input.rightTap)stroke('right');else if(input.forward)stroke(q.lastOar==='left'?'right':'left');}
 q.boatYaw=angle(q.boatYaw+q.spin*dt);const brake=input.back||input.jump;
 q.vx*=Math.exp(-dt*(brake?3:.35));q.vz*=Math.exp(-dt*(brake?3:.35));const channel=clamp(Math.min(Math.abs(q.boatZ-10),Math.abs(q.boatZ+99))/12,.05,1);q.vx+=dt*(.38+Math.sin(s.time*.19)*.19)*channel;
 const max=(q.cargo===8?5.5:6.4)*(1-q.strain*.3),len=Math.hypot(q.vx,q.vz);if(len>max){q.vx*=max/len;q.vz*=max/len;}
 const nx=q.boatX+q.vx*dt,nz=q.boatZ+q.vz*dt;
 if(collide(s,nx,nz,1.3,0)){q.vx*=-.3;q.vz*=-.3;q.spin*=.4;q.groundings++;q.strain=clamp(q.strain+.12,0,1);if(!q.warning){q.warning=true;say(s,'river.recover');}emit(s,'wood');}else{q.boatX=nx;q.boatZ=nz;}
 q.balance*=Math.exp(-dt*(brake?1.1:.16));q.strain=clamp(q.strain+(Math.abs(q.balance)>.72?.06:brake?-.2:-.035)*dt,0,1);q.speed=Math.hypot(q.vx,q.vz);p.x=q.boatX;p.z=q.boatZ;
 // Recoverable equipment pressure, never an unannounced capsize or a passenger death.
 if(q.strain>.75&&!q.warning){q.warning=true;say(s,'river.balance');}if(q.strain<.2)q.warning=false;
}
export function updateRetreat(s,input,dt,{blocked,collide}){const q=s.retreat,p=s.player;q.volley=Math.max(0,q.volley-dt);
 if(s.level==='eastriver')return;
 if(s.level==='cityrefuge')return;
 if(retreatDefending(s)){
  q.clock+=dt;q.ally+=dt;
  if(s.level==='harlem'){
   const atFlank=p.x<-10&&p.z<2&&p.z>-30;
   if(input.interact&&q.volley===0&&atFlank){q.volley=8;const e=s.enemies.filter(e=>e.hp>0).sort((a,b)=>a.z-b.z)[0];if(e){e.hp=0;e.dead=0;emit(s,'retreatVolley');}emit(s,'orderUsed');}
   if(q.ally>9&&atFlank){q.ally=0;const e=s.enemies.find(e=>e.hp>0);if(e){e.hp=0;e.dead=0;emit(s,'retreatVolley');}}
   if(q.wave===1&&q.clock>22&&s.enemies.every(e=>e.hp<=0)){q.wave=2;foes(s,5);say(s,'harlem.second');emit(s,'checkpoint');}
   if(q.wave===2&&q.clock>40&&s.enemies.every(e=>e.hp<=0)){s.enemies.forEach(e=>e.retreat=true);say(s,'harlem.clear');next(s);}
  }else{
   q.line=clamp(100-q.clock*2.35,0,100);
   // The army's flanking defeat is historical; eliminating local targets cannot reverse it.
   if(q.clock>18&&!q.flanked){q.flanked=true;say(s,s.level==='longisland'?'retreat.flank':'plains.flank');}
   if(q.clock>=39){say(s,s.level==='longisland'?'retreat.withdraw':'plains.withdraw');next(s);}
   if(q.ally>7){q.ally=0;const e=s.enemies.find(e=>e.hp>0);if(e){e.hp=0;e.dead=0;emit(s,'retreatVolley');}if(q.clock<32&&s.enemies.filter(e=>e.hp>0).length<4)foes(s,8);}
  }
 }
 if(s.level==='whiteplains'&&s.stage===3){const near=dist(p,{x:q.wagonX,z:q.wagonZ})<9;if(near){q.wagonZ=Math.min(62,q.wagonZ+dt*1.65);q.wagonMoved+=dt;}if(q.wagonZ>=62){say(s,'plains.wagon');next(s);}}
 if(q.wardCalled)q.wardZ=Math.min(65,q.wardZ+dt*2.1);
 const combat=s.level==='harlem'?s.stage<3:s.stage>0&&s.stage<RETREAT_LEVELS[s.level].goals.length;
 if(combat){q.shellClock+=dt;if(q.shellClock>15&&q.shell===0&&s.level!=='harlem'&&p.z<47){q.shellClock=0;q.shell=3;q.shellX=p.x+(p.x>0?-5:5);q.shellZ=p.z;emit(s,'shellWarning');}
  if(q.shell>0){q.shell=Math.max(0,q.shell-dt);if(q.shell===0){emit(s,'shell',{x:q.shellX,z:q.shellZ});if(dist(p,{x:q.shellX,z:q.shellZ})<3)hurt(s,s.difficulty==='story'?9:20);}}
 }
 for(const e of s.enemies){e.fired=Math.max(0,e.fired-dt);if(e.hp<=0){e.dead+=dt;continue;}e.moving=false;
  const stop=s.level==='harlem'?7:10,step=dt*.85;if(e.z<stop&&!collide(s,e.x,e.z+step,.25,0)){e.z+=step;e.moving=true;}
  e.yaw=Math.atan2(-(p.x-e.x),-(p.z-e.z));e.cooldown-=dt;e.aiming=e.cooldown<1.3&&combat;
  if(combat&&e.cooldown<=0&&p.z<31&&dist(p,e)<52&&!blocked(s.level,{...e,y:1.4},{...p,y:input.crouch?1.02:1.7})){e.cooldown=5.2+(e.id%3)*.6;e.fired=.2;emit(s,'enemyShot',{x:e.x,z:e.z});if((e.id+Math.floor(s.time))%4===0)hurt(s,s.difficulty==='story'?4:8);}
 }
 if(p.z>32&&s.time-s.lastDamage>5)p.health=Math.min(100,p.health+dt*7);
}
export function retreatContext(s){const q=s.retreat;
 if(s.level==='eastriver')return q.moored?'E handles the people and ropes.':q.strain>.7?'Too much weight on one side. S / Space steadies the boat.':'A / D: left / right oar · W: alternating strokes · S / Space: brake · arrows / mouse: look';
 if(s.level==='cityrefuge')return q.escort?'The daughter is following. Take her back to the family.':q.reunited?'The family is together. Their politics did not decide whether you helped.':'';
 if(q.shell>0)return 'Incoming shot · leave the marked ground';
 if(s.level==='harlem'&&s.stage===2)return q.volley>0?'The militia are reloading. Cover the flank.':'E directs a flank volley · F / click fires · R reloads';
 if(retreatDefending(s))return q.flanked?'The army is outflanked. Keep the passage open until the withdrawal order.':'Hold a passage for the people behind you. This field cannot be won by our section.';
 if(s.carrying)return 'Keep the wounded behind cover. Mara is at the rear works.';
 if(s.level==='whiteplains'&&s.stage===3)return 'Stay within nine paces of the wagon. Its crew will follow your cover.';
 if(s.level==='whiteplains'&&s.stage===5)return q.wardZ<60?'Ward is moving down the road. Keep it clear.':'Ward made it. Leave together.';
 return 'The route behind the line is the way out.';
}
