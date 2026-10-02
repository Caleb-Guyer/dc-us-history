// Localhost-only entry points for rendering and input checks. The app gates these.
import {fresh} from './c6-sim.mjs?v=4.17.0-published';
import {interactHill} from './c6-hill.mjs?v=4.17.0-published';
export function fixtureState(level,phase,difficulty){
 const s=fresh(level,difficulty);
 if(level==='capesrun'&&phase==='boat'){s.stage=2;Object.assign(s.sea,{order:true,sealed:true,pilotsLoaded:true,mounted:true});s.player.z=9;}
 if(level==='capesrun'&&phase==='rope'){s.stage=3;Object.assign(s.sea,{order:true,sealed:true,pilotsLoaded:true,mounted:true,lee:4,boatX:-25,boatZ:-114});s.player.x=-25;s.player.z=-114;}

 if(level==='guilfordfield'&&phase==='hit'){s.stage=4;Object.assign(s.price,{order:true,reserve:true,line:36,wardShot:true});s.player.x=-19;s.player.z=-27;}
 if(level==='guilfordexit'&&phase==='crew'){s.stage=4;Object.assign(s.price,{careRoll:true,stranger:true,strangerSafe:true,crew:Array.from({length:3},(_,i)=>({x:(i-1)*2,z:-24,yaw:0}))});s.player.z=-24;}
 if(level==='priceprovision'&&phase==='cart'){s.stage=3;Object.assign(s.price,{paper:true,merchant:true,agreement:'work'});s.player.x=-12;s.player.z=-3;}

 if(level==='cowpens'&&phase==='volley'){s.stage=2;Object.assign(s.chase,{order:true,formed:true,armyZ:-51,squad:Array.from({length:6},(_,i)=>({x:(i-2.5)*1.6,z:-34,yaw:0}))});s.player.z=-36;s.armed=true;s.enemies=Array.from({length:10},(_,i)=>({id:i,x:(i%5-2)*4,z:-51-Math.floor(i/5)*3,hp:1,yaw:Math.PI,cooldown:10,dead:0,fired:0,moving:false,route:[0,5]}));}
 if(level==='danrelay'&&phase==='ride'){s.stage=3;Object.assign(s.chase,{order:true,load:'light',mounted:true});s.player.z=0;}
 if(level==='danrelay'&&phase==='packet'){s.stage=3;Object.assign(s.chase,{order:true,load:'heavy',mounted:true,horseX:-18,horseZ:-55});s.player.x=-18;s.player.z=-55;}
 if(level==='danrelay'&&phase==='jump'){s.stage=4;Object.assign(s.chase,{order:true,load:'light',mounted:true,packet:true,horseX:-16,horseZ:-102,speed:5});s.player.x=-16;s.player.z=-102;}

 if(level==='countrystandoff'&&phase==='route'){s.stage=4;Object.assign(s.inland,{window:true,doused:true,claim:true,torch:false});s.player.x=5;s.player.z=-29;}
 if(level==='countrystandoff'&&phase==='water'){s.stage=2;Object.assign(s.inland,{window:true,bucket:true,fire:.4});s.player.z=-8;}
 if(level==='oathroad'&&phase==='oath'){s.stage=2;Object.assign(s.inland,{parole:true});s.player.x=8;s.player.z=0;}
 if(level==='camdenfall'&&phase==='retreat'){s.stage=2;Object.assign(s.inland,{packet:true,cartridges:true});s.player.z=-32;s.armed=true;}
 if(level==='charlestonlast'&&phase==='axe'){s.stage=2;Object.assign(s.south,{list:true,axe:true});s.player.x=19;s.player.z=-8;}
 if(level==='charlestonharbor'&&phase==='tiller'){s.stage=2;Object.assign(s.south,{message:true,aboard:true,moored:false});s.player.z=10;}
 if(level==='charlestonring'&&phase==='cart'){s.stage=6;Object.assign(s.south,{patients:2,cartReady:true});s.player.x=14;s.player.z=-33;s.player.yaw=Math.PI;}
 if(level==='charlestondock'&&phase==='line'){s.stage=5;Object.assign(s.south,{packet:true,georgia:true,parley:true,proposal:true,powder:true});s.player.z=-29;s.armed=true;}
 if(level==='openwater'&&phase==='tiller'){s.stage=2;s.wider.manifest=s.wider.aboard=true;s.wider.moored=false;s.armed=true;s.ammo=6;s.player.z=10;}
 if(level==='openwater'&&phase==='cover'){s.stage=4;Object.assign(s.wider,{manifest:true,aboard:true,moored:false,route:'fleet',rescued:true,intercepted:true,boatX:23,boatZ:-140,convoyX:18,convoyZ:-136,convoyLeg:3,cutterX:33,cutterZ:-118});s.player.x=23;s.player.z=-140;s.armed=true;s.ammo=6;}
 if(level==='coastfire'&&phase==='bucket'){s.stage=6;Object.assign(s.wider,{orderRead:true,danbury:true,fairfield:true,patient:true,holdingBucket:true});s.player.x=18;s.player.z=-34;}
 if(level==='monmouth'&&phase==='line'){s.stage=4;Object.assign(s.wider,{order:true,rallied:true,turned:true,formation:'line',squad:Array.from({length:6},(_,i)=>({x:(i-2.5)*1.8,z:-27,yaw:0}))});s.player.z=-30;s.armed=true;s.ammo=12;}
 if(level==='thawroad'&&phase==='haul'){s.stage=3;Object.assign(s.winter,{order:true,cover:true,hauled:true});s.player.x=14;s.player.z=18;}
 if(level==='campline'&&phase==='wash'){s.stage=3;Object.assign(s.winter,{job:'cloth',atWash:true,holding:'linen'});s.player.x=14;s.player.z=-19;}
 if(level==='campline'&&phase==='patient'){s.stage=2;s.winter.job='care';s.player.x=-18;s.player.z=-28;}
 if(level==='drill'&&phase==='range'){s.stage=6;s.armed=true;s.ammo=8;s.winter.squad=Array.from({length:6},(_,i)=>({x:(i-2.5)*2,z:-34,yaw:0}));s.winter.formation='line';s.player.x=0;s.player.z=-37;}
 if(level==='albanywoods'&&phase==='axe'){s.stage=7;Object.assign(s.albany,{north:true,west:true,south:true,parley:true,dispatch:true,axe:true,beat:.48});s.player.x=-6;s.player.z=-22;}
 if(level==='albanywoods'&&phase==='parley'){s.stage=5;s.player.x=-22;s.player.z=-13;}
 if(level==='bemis'&&phase==='flank'){s.stage=1;s.armed=true;s.player.x=-23;s.player.z=-10;}
 if(level==='hudsonwatch'&&phase==='courier'){s.stage=3;Object.assign(s.albany,{firstSignal:true,dispatch:true});s.armed=true;s.player.x=-22;s.player.z=-32;}
 if(level==='saratogaring'&&phase==='flag'){s.stage=4;Object.assign(s.albany,{north:true,west:true,south:true,barrier:true});s.player.x=-1;s.player.z=-44;}
 if(level==='brandywine'&&phase==='courier'){s.stage=3;s.philadelphia.flank=true;s.player.x=-21;s.player.z=-8;}
 if(level==='recordshall'&&phase==='map'){s.stage=3;s.philadelphia.journals=true;s.player.x=7;s.player.z=-4;s.player.pitch=-.14;}
 if(level==='congressroad'&&phase==='choice'){s.stage=1;s.philadelphia.bridgeBroken=true;s.philadelphia.collapse=1;s.player.x=0;s.player.z=-38;}
 if(level==='congressroad'&&phase==='wagon'){s.stage=2;Object.assign(s.philadelphia,{bridgeBroken:true,collapse:1,route:'wagon',gate:true,crewStarted:true});s.player.x=2;s.player.z=18;}
 if(level==='congressroad'&&phase==='gate'){s.stage=1;Object.assign(s.philadelphia,{bridgeBroken:true,collapse:1});s.player.x=23;s.player.z=-32;}
 if(level==='congressroad'&&phase==='foot'){s.stage=2;Object.assign(s.philadelphia,{bridgeBroken:true,collapse:1,route:'foot',holding:'journals',gate:true,crewStarted:true});s.carrying=true;s.player.x=-22;s.player.z=-44;s.player.pitch=-.12;}
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
