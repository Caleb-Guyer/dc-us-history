import {GAME_BY_ID,HALL_TASKS} from './c13-games-data.mjs';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const points=[[-4,-4],[4,-4],[-4,3],[4,3],[0,-5],[0,4],[-4,0],[4,0]];
export function createRun(id,seed=1){const g=GAME_BY_ID[id];if(!g)throw new Error('Unknown Chapter 13 game');return {id,mode:g.mode,time:0,duration:g.duration,target:g.target,health:100,score:0,collected:0,paths:[],gates:[],gate:null,status:'playing',player:{x:0,z:g.mode==='convention'?3:2,jump:0,jumpTime:0,burst:0},entities:[],spawn:0,nextId:0,seed:seed>>>0,workCooldown:0,actionCooldown:0,previousAction:false,invulnerable:0,feedback:'',feedbackTime:0,perfects:0,vaults:0};}
function random(r){r.seed=(1664525*r.seed+1013904223)>>>0;return r.seed/4294967296;}
function say(r,t){r.feedback=t;r.feedbackTime=1.5;}
function collect(r,e){r.collected++;r.score+=100;if(!r.paths.includes(e.lane))r.paths.push(e.lane);say(r,r.mode==='assembly'?'Task complete':r.mode==='press'?'Pamphlets secured':'Document seal secured');}
export function chooseGate(r,choice){if(r.status!=='gate'||!Number.isInteger(choice))return false;const g=GAME_BY_ID[r.id].gates[r.gate];if(!g||choice<0||choice>=g.choices.length)return false;if(choice!==g.answer){say(r,g.why);return false;}r.gates.push(r.gate);r.gate=null;r.status='playing';r.score+=150;return true;}
export function stepRun(r,dt,input={}){if(r.status!=='playing'||!Number.isFinite(dt)||dt<=0)return r;dt=Math.min(dt,.25);const slices=Math.ceil(dt/(1/120)),h=dt/slices;for(let i=0;i<slices&&r.status==='playing';i++)tick(r,h,input);r.previousAction=!!input.action;return r;}
function tick(r,dt,input){const g=GAME_BY_ID[r.id],p=r.player;r.time+=dt;r.actionCooldown=Math.max(0,r.actionCooldown-dt);r.workCooldown=Math.max(0,r.workCooldown-dt);r.invulnerable=Math.max(0,r.invulnerable-dt);r.feedbackTime=Math.max(0,r.feedbackTime-dt);p.burst=Math.max(0,p.burst-dt);p.jumpTime=Math.max(0,p.jumpTime-dt);p.jump=p.jumpTime>0?Math.sin((.8-p.jumpTime)/.8*Math.PI)*2:0;
 const dx=(input.right?1:0)-(input.left?1:0),dz=(input.down?1:0)-(input.up?1:0),speed=p.burst>0?12:6;
 p.x=clamp(p.x+dx*speed*dt,-5,5);p.z=clamp(p.z+dz*speed*dt,-6,5);
 const actionEdge=input.action&&!r.previousAction;
 if(actionEdge&&r.actionCooldown<=0&&r.mode!=='assembly'){if(r.mode==='press'){p.jumpTime=.8;r.actionCooldown=1.15;}else{const near=r.entities.find(e=>e.kind==='seal'&&Math.hypot(p.x-e.x,p.z-e.z)<1.65);if(!near){p.burst=.35;r.actionCooldown=1.5;r.invulnerable=.35;}}r.previousAction=true;}
 if(r.mode==='assembly'){
  r.spawn-=dt;if(r.spawn<=0){r.spawn=1.45;const lane=r.nextId%3;r.entities.push({id:r.nextId++,kind:'work',x:[-4,0,4][lane],z:-1,lane,age:0});}
  for(const e of r.entities)e.age+=dt;
  if(input.action&&r.workCooldown<=0){r.workCooldown=.22;const e=r.entities.find(e=>Math.abs(p.x-e.x)<1.6&&e.age>=.5&&e.age<=2.1);if(e){collect(r,e);if(Math.abs(e.age-1.35)<.3){r.score+=75;r.perfects++;say(r,'Perfect timing +75');}r.entities=r.entities.filter(x=>x!==e);}}
  r.entities=r.entities.filter(e=>e.age<2.7);
 }else if(r.mode==='press'){
  r.spawn-=dt;if(r.spawn<=0){r.spawn=.95;const lane=r.nextId%3,kind=r.nextId%4===3?'cart':'pamphlet';r.entities.push({id:r.nextId++,kind,x:[-4,0,4][lane],z:-28,lane,age:0});}
  for(const e of r.entities){e.z+=9*dt;e.age+=dt;const near=Math.abs(p.x-e.x)<1.5&&Math.abs(p.z-e.z)<1.1;if(!near)continue;if(e.kind==='pamphlet'){collect(r,e);e.dead=true;}else if(p.jump>.8){r.score+=150;r.vaults++;say(r,'Clean vault +150');e.dead=true;}else if(r.invulnerable<=0){r.health-=15;r.invulnerable=1; e.dead=true;say(r,'Cart hit — find a gap or vault');}}
  r.entities=r.entities.filter(e=>!e.dead&&e.z<10);
 }else{
  if(!r.entities.some(e=>e.kind==='seal')){const k=r.collected%points.length,[x,z]=points[k];r.entities.push({id:r.nextId++,kind:'seal',x,z,lane:x<0?0:x>0?2:1});}
  const e=r.entities.find(e=>e.kind==='seal');if(e&&Math.hypot(p.x-e.x,p.z-e.z)<1.65&&actionEdge){const task=HALL_TASKS[r.collected];collect(r,e);say(r,task+' · ready');r.entities=r.entities.filter(x=>x!==e);}
  r.entities=r.entities.filter(e=>e.kind==='seal');for(let i=0;i<2;i++){const x=Math.sin(r.time*.8+i*Math.PI)*4.5,z=i?1:-2;const e={id:100+i,kind:'crate',x,z,lane:i};r.entities.push(e);if(Math.hypot(p.x-x,p.z-z)<1.15&&r.invulnerable<=0){r.health-=12;r.invulnerable=1;say(r,'Aisle blocked — dash through a gap');}}
 }
 for(let i=0;i<g.gates.length;i++)if(!r.gates.includes(i)&&(r.mode==='convention'?r.collected>=(i+1)*2:r.time>=r.duration*g.gates[i].at)){r.gate=i;r.status='gate';r.previousAction=false;return;}
 if(r.health<=0){r.health=0;r.status='lost';say(r,'Try a safer route.');return;}
 if(r.collected>=r.target&&r.paths.length>=2&&r.gates.length===g.gates.length&&(r.mode==='convention'||r.time>=r.duration*.77)){r.status='won';r.score+=Math.round(r.health*3);return;}
 if(r.time>=r.duration){r.status='lost';say(r,r.paths.length<2?'Use at least two benches or paths.':'Keep collecting the marked objectives.');}
}
export function summary(r){return {id:r.id,won:r.status==='won',score:Math.max(0,Math.round(r.score)),seconds:Math.round(r.time),collected:r.collected,paths:r.paths.length,health:r.health,perfects:r.perfects,vaults:r.vaults};}
