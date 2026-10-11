// Fictional courier errands inside a fixed historical setting. No invented battle.
export const ROAD_LENGTH=330;
export const DISPATCHES=[
 {d:74,lane:-1,id:'house',label:'Population in the House'},
 {d:166,lane:1,id:'senate',label:'Equal states in the Senate'},
 {d:264,lane:0,id:'checks',label:'Make power check power'}
];
export const OBSTACLES=[
 {d:30,lane:0,type:'crate'},{d:53,lane:1,type:'cart'},
 {d:103,lane:-1,type:'crate'},{d:121,lane:0,type:'cart'},
 {d:146,lane:-1,type:'crate'},{d:194,lane:1,type:'crate'},
 {d:213,lane:-1,type:'cart'},{d:237,lane:1,type:'crate'},
 {d:287,lane:0,type:'crate'},{d:307,lane:-1,type:'cart'}
];
export function createCourier(){return {d:0,x:0,lane:0,time:0,jump:0,jumpTime:0,dash:0,dashCooldown:0,health:3,invulnerable:0,collected:[],passed:[],hits:0,finished:false,message:'Three dispatches. One waiting convention.'};}
export function steer(s,dir){if(s.finished)return;s.lane=Math.max(-1,Math.min(1,s.lane+Math.sign(dir)));}
export function leap(s){if(!s.finished&&s.jumpTime<=0)s.jumpTime=.85;}
export function dash(s){if(!s.finished&&s.dashCooldown<=0){s.dash=.55;s.dashCooldown=2.6;}}
export function retryCourier(s){const next=DISPATCHES.find(p=>!s.collected.includes(p.id));s.d=Math.max(0,(next?.d||ROAD_LENGTH)-24);s.health=3;s.invulnerable=1.5;s.x=s.lane*2.8;s.passed=OBSTACLES.filter(o=>o.d<s.d-3).map(o=>o.d);s.message='Back on your feet. Bring the dispatches to the hall.';return s;}
export function advanceCourier(s,dt,{sprint=false}={}){
 dt=Math.max(0,Math.min(.05,dt));if(s.finished||!dt)return [];
 const events=[];s.time+=dt;s.dashCooldown=Math.max(0,s.dashCooldown-dt);s.dash=Math.max(0,s.dash-dt);s.invulnerable=Math.max(0,s.invulnerable-dt);
 s.jumpTime=Math.max(0,s.jumpTime-dt);s.jump=s.jumpTime?Math.sin((1-s.jumpTime/.85)*Math.PI)*1.7:0;
 s.x+=(s.lane*2.8-s.x)*Math.min(1,dt*12);
 const old=s.d;s.d+=dt*(s.dash>0?23:sprint?12.5:10);
 for(const o of OBSTACLES){if(s.passed.includes(o.d)||s.d<o.d-1)continue;s.passed.push(o.d);
  if(old<o.d+2&&Math.abs(s.x-o.lane*2.8)<1.2&&(o.type==='cart'||s.jump<.9)&&s.invulnerable<=0){s.health--;s.hits++;s.invulnerable=1.2;s.message=o.type==='cart'?'Dodge the wagons. A / D changes lanes.':'Leap low crates with Space.';events.push('hit');if(s.health<=0){retryCourier(s);events.push('retry');break;}}
 }
 for(const p of DISPATCHES){if(!s.collected.includes(p.id)&&Math.abs(s.d-p.d)<2.8&&Math.abs(s.x-p.lane*2.8)<1.3){s.collected.push(p.id);s.message=p.label;events.push(p.id);}}
 if(s.d>=ROAD_LENGTH){if(s.collected.length===3){s.finished=true;s.message='The dispatches are in. Take your seat.';events.push('finish');}else{retryCourier(s);s.message='One dispatch is still in the street. Follow its gold marker.';events.push('retry');}}
 return events;
}
