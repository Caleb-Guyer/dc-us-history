// Local crew action around the historical capture, not a reconstruction of the fort.
export const FORT_SPEC={title:'The Guns North',place:'MAY 10, 1775 · TICONDEROGA, NEW YORK',spawn:[0,28],bounds:[-29,29,-50,34],music:'night',mode:'INFILTRATION',description:'Read the sentry. Signal the crew. Bring the guns within reach.',after:'northEnding',goals:[
 {x:-8,z:5,label:'Reach Ward beneath the fort wall',verb:'Join Ward',time:.7},
 {x:-6,z:-1,label:'Signal the crew while the sentry looks away',verb:'Give the signal',time:1},
 {x:0,z:-11,label:'Open the passage for Allen and Arnold’s men',verb:'Lift the passage latch',time:1.4},
 {x:7,z:-23,label:'Secure the gun stores',verb:'Secure the store door',time:1.8},
 {x:-3,z:-36,label:'Inspect the cannon with the broken fitting',verb:'Inspect the gun',time:1.2},
 {x:-3,z:-32,label:'Take the hauling rope',verb:'Take the rope',time:.6},
 {x:-3,z:-24,label:'Back up and haul the gun onto the rollers',verb:'Haul together',time:0},
 {x:3,z:-30,label:'Bring the inventory to Ward',verb:'Hand Ward the inventory',time:.8},
]};
export const FORT_BLOCKS=[[-16,-5,24,2,4.7],[16,-5,24,2,4.7],[-27,-26,2,40,4.7],[27,-26,2,40,4.7],[0,-47,54,2,4.7],[-17,-28,13,28,6],[17,-33,13,18,6],[-10,12,5,1,1.15],[7,10,4,1,1.15],[-9,1,4,1,1.15],[7,-17,3,2,1.25]];
export const freshFort=()=>({alarm:false,rescued:false,signal:false,captured:false,secured:false,tagged:false,rope:false,haul:0,crew:0,look:0,sentryX:0,sentryZ:-8,seen:0,captureTime:0});
const range=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const event=(s,type,data={})=>s.events.push({type,...data});
const voice=(s,id)=>event(s,'voice',{id});
function advance(s){s.stage++;s.hold=0;event(s,s.stage===FORT_SPEC.goals.length?'finish':'checkpoint');if(s.stage===FORT_SPEC.goals.length)s.finished=true;}
export function fortGoal(s){
 if(s.fort.alarm&&!s.fort.rescued&&s.stage<3)return {x:-5,z:4,label:'Nathan fell. Pull him behind the wall',verb:'Pull Nathan to safety',time:1.3};
 return FORT_SPEC.goals[s.stage];
}
export function interactFort(s){
 const f=s.fort;
 if(f.alarm&&!f.rescued&&s.stage<3){f.rescued=true;f.signal=true;s.stage=2;s.hold=0;voice(s,'north.rescued');event(s,'checkpoint');return;}
 if(s.stage===0)voice(s,'north.ready');
 if(s.stage===1){if(f.seen>.12){s.hold=0;return;}f.signal=true;voice(s,'north.signal');}
 const capture=s.stage===2;
 if(capture){f.captured=true;f.captureTime=s.time;s.alert=0;}
 if(s.stage===3){f.secured=true;voice(s,'north.stores');}
 if(s.stage===4){f.tagged=true;voice(s,'north.fitting');}
 if(s.stage===5){f.rope=true;voice(s,'north.pull');}
 if(s.stage===6)return;
 advance(s);if(capture)event(s,'fortCapture');
}
export function updateFort(s,input,dt,{blocked}){
 const f=s.fort,p=s.player;
 // One sentry at a small, surprised garrison. Alarm changes the rescue, never starts a massacre.
 if(!f.captured){
  f.sentryX=Math.sin(s.time*.36)*2.4;f.look=Math.sin(s.time*.48)*1.35;
  const bearing=Math.atan2(p.x-f.sentryX,p.z-f.sentryZ),d=range(p,{x:f.sentryX,z:f.sentryZ});
  const visible=d<(input.crouch?10:20)&&(d<2.7||Math.abs(bearing-f.look)<.62)&&!blocked('ticonderoga',{x:f.sentryX,z:f.sentryZ,y:1.6},{...p,y:input.crouch?1.02:1.7});
  f.seen=Math.max(0,Math.min(1,f.seen+(visible?(input.sprint?1.25:.58):-.8)*dt));s.alert=f.seen;
  if(f.seen>=1&&!f.alarm){f.alarm=true;s.hold=0;voice(s,'north.alarm');event(s,'checkpoint');}
 }else{f.seen=0;s.alert=0;f.crew=Math.min(1,f.crew+dt*.13);}
 if(s.stage===6&&f.rope){
  // The player must move backward with the rope, in the narrow hauling lane.
  const along=Math.max(0,Math.min(8,p.z+32)),nearLane=Math.abs(p.x+3)<3&&p.z>=-34&&p.z<=-21;
  if(nearLane&&along>f.haul*8)f.haul=Math.min(along/8,f.haul+dt*.14);
  if(f.haul>=.995){f.haul=1;f.rope=false;voice(s,'north.weight');advance(s);}
 }
}
export function fortContext(s){const f=s.fort;
 if(f.alarm&&!f.rescued&&s.stage<3)return 'Ward is covering the passage. Get Nathan out.';
 if(s.stage===1)return f.seen>.12?'He can see you. Break sight before signaling.':'Watch the lantern. E signals the crew.';
 if(s.stage===6)return 'Hold S to pull backward · stay in line with the rope';
 if(s.stage===3)return 'Allen and Arnold have the fort. Your crew has the stores.';
 if(s.stage===4)return 'The siege at Boston needs these guns.';
 return '';
}
