// Local camp work and a small practice detachment; historical events are in the story module.
const g=(x,z,label,verb,time=1.2)=>({x,z,label,verb,time});
export const WINTER_LEVELS={
 thawroad:{title:'The Winter Line',place:'VALLEY FORGE SUPPLY ROAD · FEBRUARY 15, 1778 · MARA REED',spawn:[0,23],bounds:[-33,33,-70,30],music:'winterline',mode:'SUPPLY SURVIVAL / THAWING CROSSING',intro:'winterIntro',after:'winterShelter',description:'Cover a flour load, pull it through a road changed by thaw and bring it under shelter. A raised western crossing remains open.',goals:[g(-4,17,'Take the camp’s flour order from Nathan','Take the supply order'),g(-12,9,'Bring dry cloth for the flour load','Take the covering cloth'),g(14,18,'Cover and hitch the waiting flour sledge','Cover the flour and take the rope'),g(0,-54,'Bring the sledge under the store roof','Pull the covered load',0),g(0,-54,'Unhitch the flour at the store','Set the load under shelter'),g(-10,-61,'Rejoin the camp workers','Bring the flour receipt to Anne')]},
 campline:{title:'Keep the Fire Going',place:'VALLEY FORGE · FEBRUARY 16, 1778 · MARA REED',spawn:[0,23],bounds:[-33,33,-66,30],music:'winterline',mode:'COOPERATIVE CARE / WORK / NEGOTIATION',intro:'winterShelter',after:'winterCare',description:'Divide nursing and laundry work with Anne, move a sick man to shelter, prepare dry linen, and settle a local supply dispute.',goals:[g(0,16,'Read the section’s work board','Read the work board'),g(-14,7,'Choose your work with Anne, or take Nathan’s laundry assignment','Take the nursing route'),g(-18,-30,'Reach the sick man in the exposed shelter','Help him stand'),g(-18,4,'Bring him into the covered care area','Lower him onto the cot'),g(14,-19,'Collect the cleaned linen from Anne','Take the cleaned linen'),g(14,-4,'Hang the linen beside the covered hearth','Hang the dry linen'),g(-14,5,'Check that both workers are finished','Confirm the care and linen'),g(15,14,'Offer the quartermaster’s Continental notes','Offer the paper money'),g(19,10,'Arrange a witnessed receipt or barter repair work at the bench','Write a supply receipt'),g(-4,-42,'Bring the agreed supplies to the care area','Set down the blanket and provisions'),g(0,-49,'Take Nathan’s dated dispatch to Ward','Read Washington’s camp dispatch')]},
 drill:{title:'One Command, Many Hands',place:'VALLEY FORGE PRACTICE DETACHMENT · MARCH 1778 · ROWAN VALE',spawn:[0,23],bounds:[-33,33,-70,30],music:'drill',mode:'FORMATION MOVEMENT / PRACTICE RANGE',intro:'winterDrill',after:'winterAlliance',description:'Lead a small detachment through column movement, a turn and a line formation, practice at wooden targets, then teach another group.',goals:[g(-4,17,'Take the translated drill orders','Read the orderly book'),g(0,10,'Assemble the practice detachment','Call the column together'),g(0,-10,'Lead the column through the blue flags','Hold for the whole column'),g(18,-10,'Turn toward the eastern flag with the column','Face the eastern flag and halt'),g(18,-10,'Form the detachment into a line','Give the line command'),g(0,-37,'Lead the line to the practice range','Ready the practice cartridges'),g(0,-37,'Hit the three wooden practice targets','Fire and reload',0),g(-18,-45,'Pass the lesson to the waiting recruits','Teach the next section')]},
};
export const WINTER_BLOCKS={
 thawroad:[[23,11,7,9,5],[-24,10,7,10,5],[-15,0,16,1,1.1],[16,-10,1,15,1.2],[-8,-38,14,1,1.2],[23,-23,25,2,2.7],[22,-49,9,10,5]],
 campline:[[-27,18,8,10,5],[25,14,7,9,5],[-27,-15,8,10,5],[25,-38,8,11,5],[-5,-12,11,1,1.2],[13,-23,7,2,1.1],[-5,13,10,2,1.1],[14,-21,1.7,1.7,.75],[19,9,2,1,.85],[12,9,2,1,.85]],
 drill:[[-27,14,8,9,5],[27,14,8,9,5],[-27,-15,7,9,5],[27,-35,7,10,5],[-7,13,6,2,1.1],[ -4,16,1.3,.9,1.0]],
};
const dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z),angle=a=>Math.atan2(Math.sin(a),Math.cos(a)),emit=(s,type,o={})=>s.events.push({type,...o}),say=(s,id)=>emit(s,'voice',{id});
export function freshWinter(){return {order:false,cover:false,hauled:false,sledX:14,sledZ:20,sledYaw:0,travel:0,brake:false,clock:0,thaw:0,thawCalled:false,wetness:0,flourSecured:false,job:'',care:false,cloth:false,holding:'',clean:0,lastStroke:'',washHeld:false,atWash:false,washFlash:0,helperX:-18,helperZ:-30,helperClock:0,helperDone:false,settlement:'',supplied:false,dispatch:false,formation:'column',formationYaw:0,lastX:0,lastZ:12,squad:[],targets:[false,false,false],lastShot:0,trained:false};}
export function validWinter(q,b){return !!q&&['order','cover','hauled','brake','thawCalled','flourSecured','care','cloth','washHeld','atWash','helperDone','supplied','dispatch','trained'].every(k=>typeof q[k]==='boolean')&&['sledX','sledZ','sledYaw','travel','clock','thaw','wetness','clean','washFlash','helperX','helperZ','helperClock','formationYaw','lastX','lastZ','lastShot'].every(k=>Number.isFinite(q[k]))&&q.sledX>=b[0]&&q.sledX<=b[1]&&q.sledZ>=b[2]&&q.sledZ<=b[3]&&q.travel>=0&&q.travel<10000&&q.clock>=0&&q.clock<10000&&q.thaw>=0&&q.thaw<=1&&q.wetness>=0&&q.wetness<=1&&Number.isInteger(q.clean)&&q.clean>=0&&q.clean<=6&&q.washFlash>=0&&q.washFlash<=.35&&q.helperClock>=0&&q.helperClock<10000&&q.helperX>=b[0]&&q.helperX<=b[1]&&q.helperZ>=b[2]&&q.helperZ<=b[3]&&Number.isInteger(q.lastShot)&&q.lastShot>=0&&['','care','cloth'].includes(q.job)&&['','linen','supplies'].includes(q.holding)&&['','a','d'].includes(q.lastStroke)&&['','receipt','repair'].includes(q.settlement)&&['column','line'].includes(q.formation)&&Array.isArray(q.targets)&&q.targets.length===3&&q.targets.every(v=>typeof v==='boolean')&&Array.isArray(q.squad)&&[0,6].includes(q.squad.length)&&q.squad.every(a=>['x','z','yaw'].every(k=>Number.isFinite(a[k]))&&a.x>=b[0]&&a.x<=b[1]&&a.z>=b[2]&&a.z<=b[3]);}
export const winterHauling=s=>s.level==='thawroad'&&s.stage===3;
export const winterWashing=s=>s.level==='campline'&&s.winter.job==='cloth'&&s.stage===3&&s.winter.atWash;
export const winterRange=s=>s.level==='drill'&&s.stage===6;
export const winterOperating=s=>winterHauling(s)||winterWashing(s)||winterRange(s);
export function winterGoal(s){const q=s.winter,base=WINTER_LEVELS[s.level].goals[s.stage];if(s.level==='campline'&&q.job==='cloth')return s.stage===2?g(12,-16,'Take the used linen to the wash station','Take the used linen'):s.stage===3?g(14,-19,'Wash the linen with alternating strokes','A / D alternate scrubbing',0):s.stage===4?g(14,-19,'Lift the cleaned linen from the wash station','Lift the clean linen'):base;return base;}
export function winterNear(s){const q=s.winter;if(s.level==='campline'&&s.stage===1)return dist(s.player,{x:-14,z:7})<2.5||dist(s.player,{x:12,z:8})<2.5;if(s.level==='campline'&&s.stage===8)return dist(s.player,{x:19,z:10})<2.5||dist(s.player,{x:12,z:10})<2.5;return !!winterGoal(s)&&dist(s.player,winterGoal(s))<2.5;}
export function winterCanUse(s){const q=s.winter;if(winterOperating(s)||s.level==='campline'&&s.stage===3&&q.job==='cloth')return false;if(s.level==='campline'&&s.stage===4&&q.job==='care')return q.helperDone;if(s.level==='campline'&&s.stage===6)return q.care&&q.cloth&&q.helperDone;if(s.level==='drill'&&s.stage>=2&&s.stage<=5){if(q.squad.some(a=>dist(a,s.player)>11))return false;if(s.stage===3&&Math.abs(angle(s.player.yaw+Math.PI/2))>.35)return false;}return true;}
function next(s){s.stage++;s.hold=0;emit(s,'checkpoint');if(s.stage>=WINTER_LEVELS[s.level].goals.length){s.finished=true;emit(s,'finish');}}
export function winterWaterBlocked(q,x,z,r=.3,anchor=null){const inside=p=>Math.abs(p.x)<12+r&&p.z<-19+r&&p.z>-27-r;if(q.thaw<.55||!inside({x,z}))return false;return !(anchor&&inside(anchor));}
export function interactWinter(s){const q=s.winter,st=s.stage;
 if(s.level==='thawroad'){
  if(st===0){q.order=true;say(s,'winter.order');}
  if(st===1){q.cover=true;say(s,'winter.cover');}
  if(st===2){q.hauled=true;q.brake=false;say(s,'winter.hitch');}
  if(st===4){q.hauled=false;q.flourSecured=true;say(s,'winter.flour');}
  if(st===5)say(s,'winter.receipt');
 }else if(s.level==='campline'){
  if(st===0)say(s,'camp.board');
  if(st===1){q.job=dist(s.player,{x:-14,z:7})<2.5?'care':'cloth';q.helperX=q.job==='cloth'?-18:14;q.helperZ=q.job==='cloth'?-30:-19;say(s,q.job==='care'?'camp.choosecare':'camp.choosecloth');}
  if(st===2){if(q.job==='care'){s.carrying=true;s.armed=false;say(s,'camp.support');}else{q.holding='linen';say(s,'camp.linen');}}
  if(st===3&&q.job==='care'){s.carrying=false;q.care=true;say(s,'camp.shelter');}
  if(st===4){q.holding='linen';say(s,'camp.clean');}
  if(st===5){q.holding='';q.cloth=true;say(s,'camp.hang');}
  if(st===6)say(s,'camp.together');
  if(st===7)say(s,'camp.notes');
  if(st===8){q.settlement=dist(s.player,{x:19,z:10})<2.5?'receipt':'repair';q.holding='supplies';say(s,q.settlement==='receipt'?'camp.receipt':'camp.repair');}
  if(st===9){q.holding='';q.supplied=true;say(s,'camp.supplied');}
  if(st===10){q.dispatch=true;say(s,'camp.dispatch');}
 }else{
  if(st===0)say(s,'drill.orders');
  if(st===1){q.squad=Array.from({length:6},(_,i)=>({x:(i%2-.5)*1.5,z:15+Math.floor(i/2)*1.5,yaw:0}));q.lastX=s.player.x;q.lastZ=s.player.z;say(s,'drill.column');}
  if(st===2)say(s,'drill.halt');
  if(st===3){q.formationYaw=-Math.PI/2;say(s,'drill.turn');}
  if(st===4){q.formation='line';say(s,'drill.line');}
  if(st===5){s.armed=true;s.ammo=8;q.lastShot=s.shotsFired;say(s,'drill.range');}
  if(st===7){q.trained=true;s.armed=false;say(s,'drill.teach');}
 }next(s);
}
export function updateWinter(s,input,dt,{collide,blocked}){const q=s.winter,p=s.player;q.washFlash=Math.max(0,q.washFlash-dt);
 if(winterHauling(s)){
  q.clock+=dt;q.thaw=Math.min(1,q.clock/40);if(q.thaw>=.55&&!q.thawCalled){q.thawCalled=true;say(s,'winter.thaw');emit(s,'checkpoint');}
  if(input.useTap&&dist(p,{x:q.sledX,z:q.sledZ})<5){q.brake=!q.brake;emit(s,'wood');emit(s,'checkpoint');}
  const dx=p.x-q.sledX,dz=p.z-q.sledZ,d=Math.hypot(dx,dz);if(!q.brake&&!input.jump&&d>2&&d<8){const pace=Math.min(d-2,dt*1.95),nx=q.sledX+dx/d*pace,nz=q.sledZ+dz/d*pace,ox=q.sledX,oz=q.sledZ,b=WINTER_LEVELS.thawroad.bounds,clear=(x,z)=>x>=b[0]+.65&&x<=b[1]-.65&&z>=b[2]+.65&&z<=b[3]-.65&&!winterWaterBlocked(q,x,z,.65,{x:ox,z:oz})&&!WINTER_BLOCKS.thawroad.some(([bx,bz,w,d])=>Math.abs(x-bx)<w/2+.65&&Math.abs(z-bz)<d/2+.65);
   if(clear(nx,nz)){q.sledX=nx;q.sledZ=nz;}else{if(clear(nx,oz))q.sledX=nx;if(clear(q.sledX,nz))q.sledZ=nz;}q.sledYaw=Math.atan2(-dx,-dz);q.travel+=Math.hypot(q.sledX-ox,q.sledZ-oz);
  }
  if(q.thaw>=.55&&Math.abs(q.sledX)<12&&q.sledZ<-19&&q.sledZ>-27)q.wetness=Math.min(1,q.wetness+dt*.008);
  if(dist(qTarget(q),{x:0,z:-54})<3&&dist(p,{x:0,z:-54})<3){q.brake=true;say(s,'winter.roof');next(s);}return;
 }
 if(s.level==='campline'&&q.job&&!q.helperDone){
  if(q.job==='care'){q.helperClock+=dt;if(q.helperClock>=28){q.helperDone=true;say(s,'camp.helpercloth');emit(s,'checkpoint');}}
  else{const d=dist({x:q.helperX,z:q.helperZ},{x:-18,z:4});if(d>.15){const step=Math.min(d,dt*.95),nx=q.helperX+(-18-q.helperX)/d*step,nz=q.helperZ+(4-q.helperZ)/d*step;if(!collide(s,nx,nz,.3,0)){q.helperX=nx;q.helperZ=nz;}}else{q.helperDone=q.care=true;say(s,'camp.helpercare');emit(s,'checkpoint');}}
 }
 if(s.level==='campline'&&q.job==='cloth'&&s.stage===3){
  if(q.atWash&&(input.forward||input.back)){q.atWash=false;emit(s,'checkpoint');}
  if(!q.atWash&&input.interact&&dist(p,{x:14,z:-19})<2.8){q.atWash=true;emit(s,'checkpoint');}
  if(!q.atWash)return;
  const near=dist(p,{x:14,z:-19})<2.8,hasTaps=input.leftTap!==undefined||input.rightTap!==undefined;
  const stroke=input.washStroke!==undefined?input.washStroke:input.leftTap?'a':input.rightTap?'d':!hasTaps&&!q.washHeld&&input.left?'a':!hasTaps&&!q.washHeld&&input.right?'d':'';q.washHeld=!!(input.left||input.right);
  if(near&&stroke&&stroke!==q.lastStroke){q.lastStroke=stroke;q.clean++;q.washFlash=.35;emit(s,'washStroke');emit(s,'checkpoint');if(q.clean===6){say(s,'camp.washed');next(s);}}return;
 }
 if(s.level==='drill'&&q.squad.length){
  const dx=p.x-q.lastX,dz=p.z-q.lastZ;if(Math.hypot(dx,dz)>.02)q.formationYaw=Math.atan2(-dx,-dz);q.lastX=p.x;q.lastZ=p.z;
  for(let i=0;i<q.squad.length;i++){const a=q.squad[i],side=q.formation==='line'?(i-2.5)*2:(i%2-.5)*1.5,behind=q.formation==='line'?3:3+Math.floor(i/2)*1.5,tx=p.x+Math.cos(q.formationYaw)*side+Math.sin(q.formationYaw)*behind,tz=p.z-Math.sin(q.formationYaw)*side+Math.cos(q.formationYaw)*behind,d=Math.hypot(tx-a.x,tz-a.z);
   if(d>.15){const step=Math.min(d,dt*3.15),nx=a.x+(tx-a.x)/d*step,nz=a.z+(tz-a.z)/d*step;if(!collide(s,nx,nz,.25,0)){a.x=nx;a.z=nz;}else{if(!collide(s,nx,a.z,.25,0))a.x=nx;if(!collide(s,a.x,nz,.25,0))a.z=nz;}}a.yaw=q.formationYaw;
  }
  if(winterRange(s)&&s.shotsFired>q.lastShot){q.lastShot=s.shotsFired;for(let i=0;i<3;i++){if(q.targets[i])continue;const x=(i-1)*7,z=-56,d=Math.hypot(x-p.x,z-p.z),yaw=Math.atan2(-(x-p.x),-(z-p.z)),pitch=Math.atan2(1.5-(1.65+p.y),d),width=s.difficulty==='story'?.1:.065;if(d<35&&Math.abs(angle(yaw-p.yaw))<width&&Math.abs(pitch-p.pitch)<.1&&!blocked(s.level,{...p,y:1.65+p.y},{x,z,y:1.5})){q.targets[i]=true;s.hit=.25;emit(s,'targetHit',{x,z});emit(s,'checkpoint');break;}}}
  if(winterRange(s)&&q.targets.every(Boolean)){s.armed=false;say(s,'drill.targets');next(s);}
 }
}
const qTarget=q=>({x:q.sledX,z:q.sledZ});
export function winterContext(s){const q=s.winter;
 if(winterHauling(s))return q.brake?'E near the load releases the brake.':q.thaw>=.55?'The ford is flooding. The raised crossing is west. Space holds the load; E sets its brake.':'WASD pulls the covered sledge. Space steadies it; E near it sets the brake.';
 if(s.level==='campline'&&q.job==='cloth'&&s.stage===3&&!q.atWash)return 'E near the wash station begins scrubbing. Anne is bringing the sick man into shelter.';
 if(winterWashing(s))return 'A / D, alternating strokes · '+q.clean+' / 6. W / S steps away. E at the station resumes.';
 if(s.level==='campline'){if(s.stage===1)return 'Anne’s post: take the nursing route. Nathan’s post: take the laundry route. Your partner does the other work.';if(s.stage===4&&!winterCanUse(s))return 'Anne is still cleaning and mending. Wait for her call at the wash station.';if(s.stage===6&&!winterCanUse(s))return 'Your partner is still working. The care and linen both need to be ready.';if(s.stage===8)return 'Receipt desk: witnessed credit. Repair bench: barter work and linen. Neither ends the currency crisis.';return s.carrying?'Support his weight. The covered cot is up the western lane.':'Anne works beside you. The rest of the camp still needs food, clothing and care.';}
 if(s.level==='drill')return winterRange(s)?'F / click fires · R reloads. Three wooden targets; keep the range clear.':s.stage===3?'Face the eastern flag with mouse / arrows, then E to halt the column.':!winterCanUse(s)?'Wait for the whole detachment to catch up.':'Move together. E gives the next command when the section is close.';
 return 'Food, clothing, ammunition, tents and equipment are short. Bring this one load through.';
}
