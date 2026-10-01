// Localhost-only entry points for rendering and input checks. The app gates these.
import {fresh} from './c6-sim.mjs?v=4.8.0-published';
import {interactHill} from './c6-hill.mjs?v=4.8.0-published';
export function fixtureState(level,phase,difficulty){
 const s=fresh(level,difficulty);
 if(level==='delaware'&&phase==='tiller'){s.stage=2;Object.assign(s.crossing,{covered:true,aboard:true,moored:false});s.player.z=10;}
 if(level==='trenton'&&phase==='signals'){s.stage=2;s.crossing.dried=true;s.armed=true;s.player.x=-18;s.player.z=-6;}
 if(level==='princeton'&&phase==='rescue'){s.stage=4;s.crossing.west=true;s.player.x=-17;s.player.z=-32;}
 if(level==='eastriver'&&phase==='oars'){s.stage=1;s.retreat.aboard=true;s.retreat.moored=false;s.player.z=10;}
 if(level==='longisland'&&phase==='wounded'){s.stage=2;s.retreat.flanked=true;s.player.x=-19;s.player.z=14;}
 if(level==='whiteplains'&&phase==='wagon'){s.stage=3;s.retreat.beam=true;s.player.x=-17;s.player.z=29;}
 if(level==='harlem'&&phase==='flank'){s.stage=1;s.armed=true;s.player.x=-21;s.player.z=-8;} 
 if(level==='printshop'&&['press','proof'].includes(phase)){s.stage=phase==='press'?12:9;Object.assign(s.paper,{representative:'mara',allocation:'common',shared:true,cooperation:1,type:3,proofCaught:phase==='press',proofMended:phase==='press',atPress:phase==='press',phase:'feed'});s.player.x=phase==='press'?0:2;s.player.z=phase==='press'?-8.2:-15.5;}
 if(level==='dispatch'&&['rain','harbor'].includes(phase)){s.stage=1;s.paper.route='harbor';s.player.x=phase==='rain'?5:15;s.player.z=phase==='rain'?-4:-37;s.paper.wetness=phase==='rain'?1:0;s.paper.rain=1;s.paper.warning=true;} 
 if(level==='snowpass'&&['haul','bend'].includes(phase)){s.stage=phase==='haul'?4:8;Object.assign(s.lift,{attached:true,braced:true,balanced:phase==='bend',x:phase==='haul'?0:-3,z:phase==='haul'?18:-50});s.player.x=s.lift.x;s.player.z=s.lift.z-4.2;}
 if(level==='dorchester'&&['climb','sight'].includes(phase)){s.stage=phase==='climb'?5:7;Object.assign(s.lift,{attached:phase==='climb',braced:true,anchored:phase==='sight',x:phase==='climb'?-3:2,z:phase==='climb'?-5:-32});s.player.x=phase==='climb'?-3:18;s.player.z=phase==='climb'?-9.2:-34;s.player.yaw=phase==='climb'?0:-.876;s.player.pitch=phase==='sight'?-.13:0;}
 if(level==='bostonreturn'&&phase==='press'){s.stage=2;Object.assign(s.lift,{barrier:true,shutters:true});s.player.x=-4;s.player.z=-10;s.player.yaw=.4;}
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
