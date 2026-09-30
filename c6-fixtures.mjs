// Localhost-only entry points for rendering and input checks. The app gates these.
import {fresh} from './c6-sim.mjs?v=4.4.0-published';
import {interactHill} from './c6-hill.mjs?v=4.4.0-published';
export function fixtureState(level,phase,difficulty){
 const s=fresh(level,difficulty);
 if(level==='tidewater'&&['reeds','contact','chase','exit'].includes(phase)){s.stage={reeds:1,contact:2,chase:3,exit:4}[phase];Object.assign(s.promise,{aboard:true,pursuit:s.stage>=3,boom:s.stage>=4,chaserX:23,chaserZ:-75});const g=[[-23,-58],[23,-94],[23,-129],[0,-161]][s.stage-1];s.player.x=g[0];s.player.z=g[1];}
 if(level==='moorescreek'&&phase==='rescue'){s.stage=2;s.promise.bridge=true;s.player.x=1;s.player.z=-27;}
 if(level==='breeds'&&['assault','withdrawal','break','extraction'].includes(phase)){
  s.player.x=-12;interactHill(s);interactHill(s);interactHill(s);s.player.x=0;s.player.z=3;
  if(phase!=='assault'){s.stage=7;Object.assign(s.hill,{phase:3,retreat:true,gunCrew:false,gunHit:true,teamAmmo:0});s.enemies.forEach((e,i)=>{e.z=-9-i%2*3;});}
  if(phase==='withdrawal'){s.player.x=-7;s.player.z=8;}
  if(phase==='extraction'){s.stage=12;s.player.z=49;Object.assign(s.hill,{rescues:2,wardCalled:true,wardProgress:1});}
  s.events=[];
 }
 return s;
}
