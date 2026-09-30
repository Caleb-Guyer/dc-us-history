// Fictional crew jobs within Knox's winter transport and the Dorchester operation.
const goal=(x,z,label,verb,time=.8)=>({x,z,label,verb,time});
export const SNOW_SPEC={title:'Lift the Horizon',place:'JANUARY 1776 · THE WINTER GUN ROAD',spawn:[0,24],bounds:[-22,22,-114,31],music:'winter',mode:'HEAVY TRANSPORT',intro:'liftIntro',after:'liftArrival',description:'The marked gun is back. Rope, ice, and gravity decide whether it reaches Boston.',goals:[
 goal(0,18,'Check the fitting you marked at Ticonderoga','Inspect the repaired fitting'),
 goal(-11,-8,'Take timbers for the cracked crossing','Take the bracing timbers'),
 goal(-3,-18,'Brace the crossing before bringing the gun','Lay the crossing braces',1.3),
 goal(0,14,'Take the hauling line','Hitch the hauling rope'),
 goal(-3,-38,'Pull the sledge across the ice','Pull with WASD · Space brakes',0),
 goal(-5,-37,'Free the ballast chest','Lift the shifted chest'),
 goal(-1,-37,'Move its weight to the other runner','Clamp the chest down',1.1),
 goal(-3,-42,'Retake the line','Hitch the hauling rope'),
 goal(4,-101,'Bring the gun through the final bend','WASD pull · Space brakes',0),
 goal(7,-105,'Give Ward the delivery tally','Hand over the tally'),
]};
export const RIDGE_SPEC={title:'Dorchester Heights',place:'NIGHT OF MARCH 4–5, 1776 · ABOVE BOSTON',spawn:[0,29],bounds:[-22,22,-47,34],music:'winter',mode:'ASCENT & EMPLACEMENT',intro:'heightsIntro',after:'liftEvacuation',description:'Raise the gun above the harbor. Give the British a reason to leave.',goals:[
 goal(0,20,'Hitch the gun carriage for the last climb','Take the hauling line'),
 goal(-3,-2,'Bring the carriage to the broken shelf','WASD pull · Space brakes',0),
 goal(-11,-3,'Take the spare road brace','Take the brace'),
 goal(-3,-11,'Shore up the washed-out road','Brace the road',1.3),
 goal(-3,-6,'Retake the line for the final climb','Hitch the hauling rope'),
 goal(2,-32,'Pull the gun onto the emplacement','WASD pull · Space brakes',0),
 goal(2,-32,'Anchor the gun facing the harbor','Set the wheel chocks',1.3),
 goal(18,-34,'Look down over the British supply ships','Sight the shipping route',.9),
 goal(9,-35,'Join Mara at the signal lantern','Signal that the gun is ready'),
]};
export const BOSTON_SPEC={title:'The Open Street',place:'BOSTON · MARCH 17, 1776 · AFTER THE EVACUATION',spawn:[0,26],bounds:[-19,19,-42,32],music:'home',mode:'HOMECOMING',intro:'liftEvacuation',after:'liftHome',description:'Walk a street the occupation closed. Find what survived at the old press.',goals:[
 goal(0,14,'Open the abandoned street barrier','Lift the street bar'),
 goal(-5,-10,'Return to the old press doorway','Open the press shutters'),
 goal(-5,-12,'Take the pamphlet Mara kept for you','Take Common Sense'),
]};
export const SNOW_BLOCKS=[[-16,-9,4,9,3],[16,-50,4,10,2.8],[-15,-94,5,8,3]];
export const RIDGE_BLOCKS=[[-15,-21,4,7,3],[15,-26,4,8,3]];
export const BOSTON_BLOCKS=[[-12,-4,9,20,7],[12,-16,9,25,8],[-12,-31,9,13,6],[12,20,9,13,6]];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
export const liftHauling=s=>!!s.lift?.attached;
export const groundHeight=(level,z)=>level==='dorchester'?clamp((24-z)*.13,0,7.5):0;
export function roadCenter(level,z){if(level==='snowpass')return z>-18?0:z>-47?-3:z>-77?-3+(z+47)*-.24:4.2;if(level==='dorchester')return z>2?0:z>-15?-3:2;return 0;}
export const freshLift=level=>({x:0,z:level==='snowpass'?18:24,vx:0,vz:0,yaw:0,attached:false,braced:false,balanced:false,anchored:false,barrier:false,shutters:false,ballast:false,strain:0,speed:0,slides:0,warned:false,brake:false,settled:0,haulTime:0,travel:0});
function emit(s,type,data={}){s.events.push({type,...data});}
function say(s,id){emit(s,'voice',{id});}
function advance(s){s.stage++;s.hold=0;if(s.stage>=({snowpass:SNOW_SPEC,dorchester:RIDGE_SPEC,bostonreturn:BOSTON_SPEC}[s.level].goals.length)){s.finished=true;emit(s,'finish');}else emit(s,'checkpoint');}
export function liftGoal(s){const h=s.lift,g=({snowpass:SNOW_SPEC,dorchester:RIDGE_SPEC,bostonreturn:BOSTON_SPEC}[s.level]).goals[s.stage];if(!g)return null;
 if(s.level==='snowpass'&&[3,7].includes(s.stage)||s.level==='dorchester'&&[0,4].includes(s.stage))return {...g,x:h.x,z:h.z-4};
 if(s.level==='snowpass'&&[5,6].includes(s.stage))return {...g,x:h.x+(s.stage===5?-2:2),z:h.z};
 if(s.level==='dorchester'&&s.stage===6)return {...g,x:h.x,z:h.z};return g;
}
export function liftCanUse(s){if(liftHauling(s))return false;const h=s.lift;
 if(s.level==='snowpass'&&s.stage===5)return s.player.x<h.x-.9;
 if(s.level==='snowpass'&&s.stage===6)return s.player.x>h.x+.9;
 if(s.level==='dorchester'&&s.stage===7){const yaw=Math.atan2(-84,70);return Math.abs(Math.atan2(Math.sin(s.player.yaw-yaw),Math.cos(s.player.yaw-yaw)))<.6&&s.player.pitch<.25;}
 return true;
}
export function interactLift(s){const h=s.lift,st=s.stage;
 if(s.level==='snowpass'){
  if(st===0)say(s,'lift.fitting');if(st===1){s.carrying=true;say(s,'lift.timber');}if(st===2){h.braced=true;s.carrying=false;say(s,'lift.braced');}
  if(st===3||st===7){h.attached=true;h.strain=0;say(s,st===3?'lift.pull':'lift.again');}
  if(st===5){h.ballast=true;s.carrying=true;say(s,'lift.weight');}if(st===6){h.balanced=true;h.ballast=false;s.carrying=false;say(s,'lift.balance');}
 }else if(s.level==='dorchester'){
  if(st===0||st===4){h.attached=true;h.strain=0;say(s,'heights.pull');}if(st===2){s.carrying=true;say(s,'heights.brace');}if(st===3){h.braced=true;s.carrying=false;say(s,'heights.ready');}
  if(st===6){h.anchored=true;say(s,'heights.chocks');}if(st===7)say(s,'heights.ships');
 }else {if(st===0){h.barrier=true;say(s,'home.street');}if(st===1){h.shutters=true;say(s,'home.press');}if(st===2)say(s,'home.pamphlet');}
 advance(s);
}
// The load follows the taut rope, with its own momentum. Walking away without a line
// cannot move it or complete a hauling checkpoint. Braking dissipates lateral slip.
export function updateLift(s,input,dt,{collide}){
 const h=s.lift,p=s.player;h.brake=!!input.jump;const moving=input.forward||input.back||input.left||input.right;
 if(!h.attached){h.speed=0;h.vx=h.vz=0;return;}
 h.haulTime+=dt;
 const dx=p.x-h.x,dz=p.z-h.z,d=Math.hypot(dx,dz)||1,taut=Math.max(0,d-4.1),grade=s.level==='dorchester'?.56:1;
 const ice=s.level==='snowpass'&&((h.z<-23&&h.z>-44)||(h.z<-66&&h.z>-88));
 const acceleration=h.brake?0:taut*3.6*grade;
 h.vx+=dx/d*acceleration*dt;h.vz+=dz/d*acceleration*dt;
 if(ice&&!h.brake&&h.speed>.25)h.vx+=Math.sin(s.time*.75+1)*dt*(h.balanced?.8:1.7);
 // A carriage on the hill wants to roll back. Crew catch it if the rope slackens.
 if(s.level==='dorchester'&&!h.brake)h.vz+=.38*dt;
 const drag=h.brake?11:ice?1.1:2.3;h.vx*=Math.exp(-drag*dt);h.vz*=Math.exp(-drag*dt);
 let speed=Math.hypot(h.vx,h.vz),limit=s.level==='dorchester'?2.35:3.5;if(speed>limit){h.vx*=limit/speed;h.vz*=limit/speed;}
 if(!moving&&!h.brake){h.vx*=Math.exp(-3.5*dt);h.vz*=Math.exp(-3.5*dt);}
 // Solid load collision uses the load's own radius, independent of a player jump.
 const oldX=h.x,oldZ=h.z,nx=h.x+h.vx*dt,nz=h.z+h.vz*dt;
 if(!collide(s,nx,h.z,1.1,0))h.x=nx;else h.vx=0;
 if(!collide(s,h.x,nz,1.1,0))h.z=nz;else h.vz=0;
 // The unbraced shelf is an actual obstruction, never a decorative objective.
 const stop=s.level==='snowpass'?-19:-9;if(!h.braced&&h.z<stop){h.z=stop;h.vz=0;}
 h.travel+=Math.hypot(h.x-oldX,h.z-oldZ);
 const off=Math.abs(h.x-roadCenter(s.level,h.z)),edge=s.level==='snowpass'?7:6;
 h.strain=clamp(h.strain+(off>edge-2?(off-edge+2)*.32:-.55)*dt,0,1);
 if(h.strain>.48&&!h.warned){h.warned=true;say(s,'lift.edge');}if(h.strain<.2)h.warned=false;
 if(h.strain>=1){h.slides++;h.x=roadCenter(s.level,h.z);h.z=Math.min(h.z+3,24);h.vx=h.vz=0;h.strain=0;h.attached=true;p.x=h.x;p.z=h.z-4.1;emit(s,'loadSlip');say(s,'lift.catch');emit(s,'checkpoint');}
 // A taut line limits separation. No teleport across the map to tow the load.
 const nd=dist(p,h);if(nd>5.7){p.x=h.x+(p.x-h.x)/nd*5.7;p.z=h.z+(p.z-h.z)/nd*5.7;}
 h.speed=Math.hypot(h.vx,h.vz);if(h.speed>.05)h.yaw=Math.atan2(-h.vx,-h.vz);
 const destination=(s.level==='snowpass'?{4:-38,8:-101}:{1:-2,5:-32})[s.stage];
 if(destination!==undefined&&h.z<=destination&&Math.abs(h.x-roadCenter(s.level,h.z))<3.8){h.settled+=dt;
  if(h.settled>.35){h.attached=false;h.vx=h.vz=h.speed=0;h.settled=0;say(s,s.level==='snowpass'?(s.stage===4?'lift.crossed':'lift.delivered'):(s.stage===1?'heights.shelf':'heights.top'));advance(s);}
 }else h.settled=0;
}
export function liftContext(s){const h=s.lift;if(h.attached)return h.strain>.48?'The load is sliding toward the edge. Brake, then pull toward the road.':h.brake?'BRAKE SET · release Space to pull':s.level==='dorchester'?'Pull uphill. Space holds the carriage while you rest.':'WASD pulls the load · Space brakes on the ice';
 if(s.level==='snowpass'&&s.stage===6)return 'The chest must move across the sledge, not down the road.';
 if(s.level==='dorchester'&&s.stage===7)return 'Turn toward the ships below the right side of the ridge.';
 return s.carrying?'Carrying the road brace.':s.level==='bostonreturn'?'For the first time in months, this street is open.':'';
}
