// A fictional neighborhood reprint shop, not John Dunlap's official first printing.
const goal=(x,z,label,verb,time=.8)=>({x,z,label,verb,time});
export const PRINT_SPEC={title:'A Country on Paper',place:'PHILADELPHIA · JULY 1776 · A NEIGHBORHOOD REPRINT SHOP',spawn:[0,14],bounds:[-9,9,-22,18],music:'press',mode:'PRINT RUN',intro:'paperIntro',after:'paperPrinted',description:'Choose who speaks for the shop. Set the form, recover a windblown proof, and work the hand press.',goals:[
 goal(0,8,'Cast the deciding ballot for the shop’s representative','Vote at one of the two ballot trays'),
 goal(0,1,'Choose where the scarce paper goes','Take a stack from one of the paper trays'),
 goal(-5,4,'Bring the reserve into the shared pool','Open the paper pool to the whole run'),
 goal(-6,-6,'Lift the heading and authorship type','Take the heading block'),
 goal(0,-9,'Seat the heading in the form','Seat the heading block'),
 goal(6,-6,'Lift the grievances type','Take the grievances block'),
 goal(0,-9,'Seat the grievances in the form','Seat the grievances block'),
 goal(-6,-13,'Lift the rights and consent type','Take the rights block'),
 goal(0,-9,'Seat the rights in the form','Seat the rights block'),
 goal(2,-17,'Catch the proof before it reaches the rain','Recover the loose proof',.35),
 goal(-5,-18,'Dry and mend the damaged proof','Lay out the proof',1.1),
 goal(0,-9,'Work the hand press','Take the press handles'),
 goal(0,-9,'Print three clean sheets for the run','Feed · slide · press · return',0),
 goal(5,-17,'Collect the neighborhood and diplomatic packets','Tie the finished packets',1.1),
]};
export const DISPATCH_SPEC={title:'Words Beyond the Door',place:'PHILADELPHIA · JULY 1776 · AFTER THE REPRINT RUN',spawn:[0,24],bounds:[-24,24,-71,30],music:'press',mode:'STREET DISPATCH',intro:'paperPrinted',after:'paperDeparture',description:'Choose a delivery order through a working city. Save the packets from rain and put the words in people’s hands.',goals:[
 goal(0,17,'Choose the first delivery at the route board','Take a route marker'),
 goal(-15,-7,'Deliver to the neighborhood workers','Hand over the local copies'),
 goal(15,-39,'Deliver the France packet to Isaiah','Hand over the France packet'),
 goal(15,-39,'Deliver the Spain packet to Isaiah','Hand over the Spain packet'),
 goal(0,-61,'Join the departing northern courier','Send the last copies north'),
]};
export const PRINT_BLOCKS=[[-9.4,-2,.7,40,4],[9.4,-2,.7,40,4],[0,-22.4,19,.7,4],[0,18.4,19,.7,4],[0,-11,3.1,2.7,2.5],[-6.7,-7.2,2.8,1.2,1.05],[6.7,-7.2,2.8,1.2,1.05],[-6.7,-14.2,2.8,1.2,1.05],[-5,-19,3.4,1,1.05],[5,-18,3.4,1,1.05]];
export const DISPATCH_BLOCKS=[[-13,20,12,14,7],[13,9,12,12,8],[-13,-24,12,17,8],[12,-17,10,12,7],[-13,-50,12,14,7],[0,-29,7,6,2.1]];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
export const paperOperating=s=>!!s.paper?.atPress;
export function freshPaper(){return {representative:'',allocation:'',shared:false,cooperation:1,type:0,block:0,proofX:2,proofZ:-17,proofCaught:false,proofMended:false,atPress:false,phase:'feed',carriage:0,beat:0,stroke:0,ink:1,sheets:0,spoiled:0,stock:8,quality:0,pressHeld:false,useHeld:false,route:'',delivered:[],rain:0,wetness:0,sheltered:false,damaged:false,recovered:false,warning:false,travel:0};}
function emit(s,type,data={}){s.events.push({type,...data});}
function say(s,id){emit(s,'voice',{id});}
function next(s){s.stage++;s.hold=0;if(s.stage>=({printshop:PRINT_SPEC,dispatch:DISPATCH_SPEC}[s.level].goals.length)){s.finished=true;emit(s,'finish');}else emit(s,'checkpoint');}
const deliveryPoints={local:{x:-15,z:-7,label:'Deliver to the neighborhood workers',verb:'Hand over the local copies',time:.9},france:{x:15,z:-39,label:'Deliver the France packet to Isaiah',verb:'Hand over the France packet',time:.9},spain:{x:15,z:-39,label:'Deliver the Spain packet to Isaiah',verb:'Hand over the Spain packet',time:.9}};
export function paperGoal(s){const q=s.paper,g=({printshop:PRINT_SPEC,dispatch:DISPATCH_SPEC}[s.level]).goals[s.stage];if(!g)return null;
 if(s.level==='printshop'&&s.stage===2&&q.shared)return {...g,label:'Confirm the common supply tally',verb:'Confirm the common tally'};
 if(s.level==='printshop'&&s.stage===9)return {...g,x:q.proofX,z:q.proofZ};
 if(s.level==='dispatch'&&s.stage>=1&&s.stage<=3){if((q.damaged||q.wetness>=1)&&!q.recovered)return {x:5,z:-4,label:'Save the damp packets at the covered rack',verb:'Dry and retie the packets',time:1.4};const order=q.route==='harbor'?['france','spain','local']:['local','france','spain'];return deliveryPoints[order[s.stage-1]];}
 return g;
}
export function paperCanUse(s){const q=s.paper,p=s.player;
 if(q.atPress)return false;
 if(s.level==='printshop'&&[0,1].includes(s.stage))return Math.abs(p.x)>1.8&&Math.abs(p.x)<7&&Math.abs(p.z-(s.stage===0?8:1))<2.4;
 if(s.level==='dispatch'&&s.stage===0)return Math.abs(p.x)>1.5&&Math.abs(p.z-17)<2.5;
 return true;
}
export function paperNear(s){const g=paperGoal(s);if(!g)return false;if(s.level==='printshop'&&[0,1].includes(s.stage)||s.level==='dispatch'&&s.stage===0)return paperCanUse(s);return dist(s.player,g)<2.5;}
export function interactPaper(s){const q=s.paper,st=s.stage;
 if(s.level==='printshop'){
  if(st===12){resumePaperPress(s);return;}
  if(st===0){q.representative=s.player.x<0?'mara':'hart';say(s,q.representative==='mara'?'paper.vote.mara':'paper.vote.hart');say(s,'paper.vote.meaning');}
  if(st===1){q.allocation=s.player.x<0?'common':'reserve';q.shared=q.allocation==='common';q.cooperation=q.shared?1:0;q.stock=q.shared?8:2;s.carrying=true;say(s,q.shared?'paper.pool':'paper.reserve');}
  if(st===2){q.shared=true;q.cooperation=1;q.stock=8;s.carrying=false;say(s,q.allocation==='reserve'?'paper.repair':'paper.tally');}
  if([3,5,7].includes(st)){q.block=(st-1)/2;s.carrying=true;say(s,st===3?'paper.heading':st===5?'paper.grievance':'paper.rights');}
  if([4,6,8].includes(st)){q.type++;q.block=0;s.carrying=false;emit(s,'wood');if(st===4)say(s,'paper.authors');if(st===6)say(s,'paper.king');if(st===8){say(s,'paper.consent');emit(s,'paperGust');}}
  if(st===9){q.proofCaught=true;s.carrying=true;say(s,'paper.caught');}
  if(st===10){q.proofMended=true;s.carrying=false;say(s,'paper.change');}
  if(st===11){q.atPress=true;q.useHeld=true;s.player.x=0;s.player.z=-8.2;s.player.yaw=0;say(s,'paper.handles');}
  if(st===13){say(s,'paper.packets');s.carrying=true;}
  next(s);
 }else{
  if(st===0){q.route=s.player.x<0?'neighbors':'harbor';say(s,q.route==='neighbors'?'dispatch.neighbors':'dispatch.harbor');next(s);return;}
  if((q.damaged||q.wetness>=1)&&!q.recovered){q.recovered=true;q.damaged=false;q.wetness=.12;say(s,'dispatch.dry');emit(s,'checkpoint');s.hold=0;return;}
  if(st<=3){const order=q.route==='harbor'?['france','spain','local']:['local','france','spain'],id=order[st-1];q.delivered.push(id);say(s,'dispatch.'+id);if(id==='local')say(s,'dispatch.common');}
  if(st===4)say(s,'dispatch.north');next(s);
 }
}
// E feeds/releases a sheet; A/D move the actual carriage; Space makes one stroke.
// Poor timing produces a damaged sheet to recycle, never a lethal fail state.
export function updatePaper(s,input,dt){const q=s.paper,p=s.player;
 if(s.level==='dispatch'){
  const moving=input.forward||input.back||input.left||input.right;q.travel+=moving?dt:0;
  if(q.wetness>=1)q.damaged=true;
  q.rain=clamp((q.travel-5)/13,0,1);q.sheltered=Math.abs(p.x-5)<4&&Math.abs(p.z+4)<4||Math.abs(p.x)>18||input.crouch;
  if(q.route&&s.stage>=1&&s.stage<=3&&!q.recovered)q.wetness=clamp(q.wetness+(q.sheltered?-.065:q.rain*.015)*dt,0,1);
  if(q.wetness>=1)q.damaged=true;if(q.wetness>.52&&!q.warning){q.warning=true;say(s,'dispatch.rain');}
  return;
 }
 if(s.stage===9&&!q.proofCaught){q.proofX=clamp(q.proofX+dt*.5,2,7.1);q.proofZ=-17+Math.sin(s.time*2)*.35;}
 q.stroke=Math.max(0,q.stroke-dt*2.4);
 if(!q.atPress)return;
 const use=!!input.interact,tapUse=!!input.useTap||use&&!q.useHeld,press=!!input.jump,tapPress=(input.press||press&&!q.pressHeld);q.useHeld=use;q.pressHeld=press;
 if(input.back||input.forward){q.atPress=false;say(s,'paper.stepaway');emit(s,'checkpoint');return;}
 q.beat=(q.beat+dt*.52)%1;
 if(q.phase==='feed'&&tapUse){q.phase='in';q.ink=1;q.stock--;emit(s,'paperAction');}
 if(q.phase==='in'){q.carriage=clamp(q.carriage+((input.right?1:0)-(input.left?1:0))*dt*.9+((input.rightTap||0)-(input.leftTap||0))*.2,0,1);if(q.carriage>=.99){q.carriage=1;q.phase='stroke';}}
 if(q.phase==='stroke'&&tapPress){q.stroke=1;const good=q.beat>=(s.difficulty==='story'?.2:.32)&&q.beat<=(s.difficulty==='story'?.9:.77);q.quality=good?1:.2;q.phase='out';if(!good){q.spoiled++;say(s,'paper.spoiled');}emit(s,'pressStroke');}
 if(q.phase==='out'){q.carriage=clamp(q.carriage+((input.right?1:0)-(input.left?1:0))*dt*.9+((input.rightTap||0)-(input.leftTap||0))*.2,0,1);if(q.carriage<=.01){q.carriage=0;q.phase='take';}}
 if(q.phase==='take'&&tapUse){if(q.quality>.5){q.sheets++;say(s,'paper.clean.'+Math.min(3,q.sheets));}else q.stock++;q.phase='feed';q.quality=0;emit(s,'checkpoint');if(q.sheets>=3){q.atPress=false;say(s,'paper.run');next(s);}}
}
export function paperContext(s){const q=s.paper;
 if(s.level==='dispatch')return (q.damaged||q.wetness>=1)&&!q.recovered?'The covered rack can save the damp sheets.':q.warning&&!q.recovered?'Rain is reaching the packets. C covers them; walls and the rack shelter them.':q.route?'Your route changes who receives the first copies.':'Left marker: neighborhood first · right marker: harbor first';
 if(s.stage===0)return 'Left tray: Mara, shared supplies · right tray: Hart, a reserved stock. Four votes are tied; yours decides.';
 if(s.stage===1)return 'Left stack: the common run · right stack: reserve for one paying order.';
 if(s.stage===2)return q.cooperation===0?'The other hands stopped working. Carry the reserve to the common pool.':'The whole run has paper. Confirm the tally with Mara.';
 if(q.atPress)return {feed:'E: feed and ink a sheet',in:'D: slide the carriage under the platen',stroke:'Space: press while the indicator is inside the pale band',out:'A: draw the carriage back',take:'E: lift the sheet off the form'}[q.phase];
 if(s.stage===12)return 'E at the handles resumes the press. W / S steps away.';
 return s.carrying?'Carry it back to the form.':s.stage===9?'The loose proof is moving toward the open window.':'';
}
export function resumePaperPress(s){s.paper.atPress=true;s.paper.useHeld=true;s.player.x=0;s.player.z=-8.2;s.player.yaw=0;s.hold=0;emit(s,'checkpoint');}
