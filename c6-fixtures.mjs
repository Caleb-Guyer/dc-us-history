// Localhost-only entry points for rendering and input checks. The app gates these.
import {fresh} from './c6-sim.mjs?v=4.3.0-final';
import {interactHill} from './c6-hill.mjs?v=4.3.0-final';
export function fixtureState(level,phase,difficulty){
 const s=fresh(level,difficulty);
 if(level==='breeds'&&['assault','withdrawal','break','extraction'].includes(phase)){
  s.player.x=-12;interactHill(s);interactHill(s);interactHill(s);s.player.x=0;s.player.z=3;
  if(phase!=='assault'){s.stage=7;Object.assign(s.hill,{phase:3,retreat:true,gunCrew:false,gunHit:true,teamAmmo:0});s.enemies.forEach((e,i)=>{e.z=-9-i%2*3;});}
  if(phase==='withdrawal'){s.player.x=-7;s.player.z=8;}
  if(phase==='extraction'){s.stage=12;s.player.z=49;Object.assign(s.hill,{rescues:2,wardCalled:true,wardProgress:1});}
  s.events=[];
 }
 return s;
}
