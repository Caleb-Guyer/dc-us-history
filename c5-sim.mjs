import {CHAPTER5} from './c5-data.mjs';
export const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export const dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
export const angleDelta=(a,b)=>Math.atan2(Math.sin(a-b),Math.cos(a-b));
export function wallsFor(m){
 if(m.theme==='ship')return [{x:0,z:8,w:3,d:3,h:1.5},{x:0,z:-11,w:3,d:3,h:1.4},{x:-6,z:-22,w:4,d:3,h:1.1},{x:6,z:17,w:3,d:3,h:1.2}];
 if(m.theme==='forest')return [{x:-3,z:19,w:7,d:3,h:1.15},{x:5,z:9,w:3,d:5,h:1.3},{x:-3,z:-4,w:6,d:3,h:1.15},{x:5,z:-19,w:6,d:3,h:1.3},{x:-18,z:-9,w:3,d:6,h:2}];
 return [{x:-23,z:21,w:8,d:14,h:8},{x:23,z:18,w:8,d:17,h:9},{x:-23,z:-3,w:8,d:17,h:7},{x:23,z:-9,w:8,d:14,h:8},{x:-23,z:-28,w:8,d:13,h:10},{x:23,z:-32,w:8,d:12,h:9},{x:0,z:13,w:5,d:3,h:1.15},{x:-8,z:-2,w:4,d:3,h:1.25},{x:7,z:-13,w:5,d:3,h:1.2},{x:-1,z:-25,w:4,d:2,h:1.2}];
}
export function blocked(x,z,walls,r=.48,jump=0,bound=27){return Math.abs(x)>bound||z>36||z< -41||walls.some(w=>jump<w.h&&Math.abs(x-w.x)<w.w/2+r&&Math.abs(z-w.z)<w.d/2+r);}
export function move(p,dx,dz,s,r=.48){const bound=s.mission.theme==='ship'?10.4:27;if(!blocked(p.x+dx,p.z,s.walls,r,p.y||0,bound))p.x+=dx;if(!blocked(p.x,p.z+dz,s.walls,r,p.y||0,bound))p.z+=dz;}
export function lineClear(a,b,walls){
 const d=dist(a,b);for(let i=1;i<Math.ceil(d/.35);i++){const f=i/Math.ceil(d/.35),x=a.x+(b.x-a.x)*f,z=a.z+(b.z-a.z)*f;if(walls.some(w=>Math.abs(x-w.x)<w.w/2&&Math.abs(z-w.z)<w.d/2))return false;}return true;
}
export function freshMission(index,difficulty='normal',checkpoint=null){
 const mission=CHAPTER5[index],s={index,mission,difficulty,time:0,stage:0,done:false,failed:false,events:[],walls:wallsFor(mission),player:{x:mission.start[0],z:mission.start[1],y:0,vy:0,yaw:0,pitch:0,hp:100,stamina:100},enemies:(mission.enemies||[]).map(([x,z],i)=>({x,z,sx:x,sz:z,angle:Math.PI*(i%2),hp:2,alert:0,cool:1+i,aim:0,dead:0,phase:i*1.7})),hold:0,carrying:false,noise:0,noiseAt:{x:0,z:0},cool:0,reload:0,round:1,shot:0,hurt:0,lastHurt:-10,kills:0,checkpoint:null,noticed:false};
 if(checkpoint&&checkpoint.index===index&&Number.isInteger(checkpoint.stage)&&checkpoint.stage>=0&&checkpoint.stage<Math.max(1,mission.goals.length)){
  s.stage=checkpoint.stage;s.carrying=!!checkpoint.carrying;s.player.x=clamp(Number(checkpoint.x)||0,-25,25);s.player.z=clamp(Number(checkpoint.z)||0,-40,35);s.kills=checkpoint.kills||0;
  s.enemies.forEach((e,i)=>{if(checkpoint.defeated?.includes(i))e.hp=0;});
 }
 s.trail=[];s.escort={x:s.player.x+3,z:s.player.z+3,y:0,yaw:0,moving:false};return s;
}
export function snapshot(s){return {index:s.index,stage:s.stage,x:s.player.x,z:s.player.z,carrying:s.carrying,kills:s.kills,defeated:s.enemies.flatMap((e,i)=>e.hp<=0?[i]:[])};}
export function primary(s){
 if(s.done||s.failed||s.cool>0)return null;
 const p=s.player,m=s.mission;
 if(!m.armed){if(m.mode==='rescue')return null;s.noise=4.5;s.noiseAt={x:p.x-Math.sin(p.yaw)*10,z:p.z-Math.cos(p.yaw)*10};s.cool=3;s.shot=.25;return 'stone';}
 if(s.round<=0||s.reload>0)return null;s.round=0;s.reload=1.65;s.shot=.2;s.cool=.3;
 let target=null,near=45;
 for(const e of s.enemies){if(e.hp<=0)continue;const d=dist(p,e),a=Math.atan2(-(e.x-p.x),-(e.z-p.z));if(Math.abs(angleDelta(a,p.yaw))<Math.max(.055,.72/d)&&Math.abs(p.pitch)<.22&&d<near&&lineClear(p,e,s.walls)){target=e;near=d;}}
 if(target){target.hp--;target.alert=1;if(target.hp<=0)s.kills++;return 'hit';}return 'shot';
}
export function nearGoal(s){const g=s.mission.goals[s.stage];return g&&dist(s.player,g)<2.8&&lineClear(s.player,g,s.walls);}
export function tickField(s,input,dt){
 if(s.done||s.failed)return;dt=clamp(dt,0,.05);s.time+=dt;const p=s.player,m=s.mission;
 for(const key of ['cool','noise','shot','hurt'])s[key]=Math.max(0,s[key]-dt);
 if(s.reload>0){s.reload=Math.max(0,s.reload-dt);if(s.reload===0)s.round=1;}
 p.yaw+=(input.turn||0)*dt*1.9;
 let forward=(input.forward?1:0)-(input.back?1:0),side=(input.right?1:0)-(input.left?1:0),len=Math.hypot(forward,side)||1;
 const sprint=input.sprint&&p.stamina>1&&!s.carrying&&(forward||side),speed=(s.carrying?3.6:input.crouch?3.1:sprint?9.2:5.9);
 p.stamina=clamp(p.stamina+(sprint?-23:15)*dt,0,100);
 move(p,(-Math.sin(p.yaw)*forward+Math.cos(p.yaw)*side)/len*speed*dt,(-Math.cos(p.yaw)*forward-Math.sin(p.yaw)*side)/len*speed*dt,s);
 if(input.jump&&p.y===0&&!s.carrying)p.vy=7.7;
 if(p.y>0||p.vy>0){p.vy-=18*dt;p.y=Math.max(0,p.y+p.vy*dt);if(!p.y)p.vy=0;}
 // Ward follows the route the player actually cleared, including vaults.
 if(m.id==='line'){s.trail.push({x:p.x,z:p.z,y:p.y,yaw:p.yaw,time:s.time});while(s.trail.length>1&&s.trail[1].time<s.time-1.5)s.trail.shift();const target=s.trail[0],gap=dist(s.escort,p),travel=Math.min(dist(s.escort,target),Math.max(0,gap-3),dt*6),length=dist(s.escort,target)||1;s.escort.x+=(target.x-s.escort.x)/length*travel;s.escort.z+=(target.z-s.escort.z)/length*travel;s.escort.moving=travel>.001;if(s.escort.moving){s.escort.y=target.y;s.escort.yaw=target.yaw;}}
 for(const [i,e]of s.enemies.entries()){
  if(e.hp<=0){e.dead+=dt;continue;}e.cool-=dt;
  const d=dist(p,e),los=d<28&&lineClear(p,e,s.walls),facing=Math.atan2(-(p.x-e.x),-(p.z-e.z));
  const sees=los&&(m.armed?d<24:d<2.6||Math.abs(angleDelta(facing,e.angle))<.66&&d<(input.crouch?6:input.sprint?16:11));
  e.alert=clamp(e.alert+dt*(sees?1.3:-.55),0,1);
  const target=e.alert>.48?p:s.noise>0&&dist(e,s.noiseAt)<18?s.noiseAt:{x:e.sx+Math.sin(s.time*.3+e.phase)*3,z:e.sz+Math.cos(s.time*.3+e.phase)*3};
  const td=dist(e,target);if(td>1.5&&(e.alert<.8||d>(m.armed?9:2.3))){const speed=e.alert>.5?3.3:1.25;move(e,(target.x-e.x)/td*speed*dt,(target.z-e.z)/td*speed*dt,s,.4);e.angle=Math.atan2(-(target.x-e.x),-(target.z-e.z));}
  if(e.alert>.85&&los&&e.cool<=0){
   e.aim+=dt;
   if(e.aim>(m.armed?1.0:.55)){
    if(m.armed||d<3){p.hp-=s.difficulty==='story'?7:m.armed?14:18;s.hurt=.55;s.lastHurt=s.time;s.events.push({type:'hurt'});}
    e.cool=m.armed?2.8:1.2;e.aim=0;
   }
  }else e.aim=Math.max(0,e.aim-dt);
 }
 // Civilian rescue: crowds are moving obstacles, not targets to shoot.
 if(m.mode==='rescue')for(let i=0;i<5;i++){
  const crowd={x:Math.sin(s.time*.56+i*1.7)*17,z:19-i*8};
  if(dist(p,crowd)<1.7&&s.hurt<=0){p.hp-=s.difficulty==='story'?5:11;s.hurt=1;s.lastHurt=s.time;s.events.push({type:'hurt'});}
 }
 if(s.time-s.lastHurt>4.5)p.hp=Math.min(100,p.hp+dt*11);
 if(input.fire){const result=primary(s);if(result)s.events.push({type:result});}
 const g=m.goals[s.stage];s.hold=nearGoal(s)&&input.interact?s.hold+dt:Math.max(0,s.hold-dt*2);
 if(g&&s.hold>=g.hold){
  const old=s.stage;s.hold=0;s.stage++;if(g.kind==='rescue')s.carrying=true;if(g.kind==='shelter')s.carrying=false;
  s.events.push({type:'goal',stage:old,terms:g.terms});p.hp=Math.min(100,p.hp+20);
  if(s.stage>=m.goals.length)s.done=true;else{s.checkpoint=snapshot(s);s.events.push({type:'checkpoint'});}
 }
 if(p.hp<=0){p.hp=0;s.failed=true;}
}
export const STATIONS=[{x:100,z:130,label:'FLAX',type:0},{x:800,z:140,label:'SPIN',type:1},{x:790,z:490,label:'WEAVE',type:2},{x:110,z:490,label:'DELIVER',type:3}];
export function freshBoard(index,difficulty='normal',checkpoint=null){
 const m=CHAPTER5[index],s={index,mission:m,difficulty,time:0,player:{x:450,z:315,angle:0},hp:100,delivered:0,carrying:0,hold:0,cool:0,dash:0,hurt:0,events:[],done:false,failed:false,score:0,checkpoint:null};
 if(m.mode==='workshop'){s.timeLeft=difficulty==='story'?220:160;s.player.x=120;s.player.z=290;}
 else{s.player={x:450,z:540,angle:0};s.cargo=0;s.supplies=[{x:130,z:430},{x:790,z:375},{x:170,z:205},{x:720,z:110}].map(p=>({...p,taken:false}));s.enemies=[{x:300,z:310},{x:680,z:245},{x:470,z:140}];s.timeLeft=210;}
 if(checkpoint?.index===index&&Number.isInteger(checkpoint.delivered)&&checkpoint.delivered>=0&&checkpoint.delivered<4){s.delivered=checkpoint.delivered;s.score=checkpoint.score||0;if(s.supplies)s.supplies.forEach((p,i)=>p.taken=i<s.delivered);}
 return s;
}
export function boardSnapshot(s){return {index:s.index,delivered:s.delivered,score:s.score};}
export function tickBoard(s,input,dt){
 if(s.done||s.failed)return;dt=clamp(dt,0,.05);s.time+=dt;s.timeLeft-=dt;s.cool=Math.max(0,s.cool-dt);s.hurt=Math.max(0,s.hurt-dt);s.dash=Math.max(0,s.dash-dt);
 const p=s.player,m=s.mission;let x=(input.right?1:0)-(input.left?1:0),z=(input.back?1:0)-(input.forward?1:0);const len=Math.hypot(x,z)||1;
 if(input.jump&&s.cool===0&&m.mode==='workshop'){s.dash=.2;s.cool=1.7;s.events.push({type:'dash'});}
 const speed=m.mode==='workshop'?(s.dash>0?660:210):input.sprint?145:input.crouch?62:102;
 p.x=clamp(p.x+x/len*speed*dt,40,860);p.z=clamp(p.z+z/len*speed*dt,60,555);if(x||z)p.angle=Math.atan2(x,-z);
 if(m.mode==='workshop'){
  for(let i=0;i<3;i++){
   const h={x:340+i*100,z:310+Math.sin(s.time*.8+i*2)*170};
   if(dist(p,h)<34&&s.hurt<=0&&s.dash<=0){s.hurt=1.4;s.timeLeft-=3;s.events.push({type:'hurt'});p.x=clamp(p.x-35,40,860);}
  }
  const station=STATIONS[s.carrying],near=dist(p,station)<72;
  s.hold=near&&input.interact?s.hold+dt:0;
  if(s.hold>(s.carrying===0?.18:s.carrying===3?.35:1.05)){
   s.hold=0;s.carrying++;
   if(s.carrying===4){s.carrying=0;const stage=s.delivered++;s.score+=100;s.timeLeft+=8;s.events.push({type:'goal',stage,terms:m.workshopLines[stage][2]});s.checkpoint=boardSnapshot(s);s.events.push({type:'checkpoint'});}
   else s.events.push({type:'collect'});
  }
 }else{
  for(let i=0;i<s.enemies.length;i++){
   const e=s.enemies[i],ex=e.x+Math.sin(s.time*.35+i)*70,ez=e.z+Math.cos(s.time*.3+i)*28,a=Math.sin(s.time*.45+i)*1.4;
   const d=Math.hypot(p.x-ex,p.z-ez),f=Math.atan2(p.x-ex,-(p.z-ez));
   if((d<35||d<160&&Math.abs(angleDelta(f,a))<.43&&!input.crouch)&&s.hurt<=0){s.hp-=s.difficulty==='story'?7:14;s.hurt=1.1;s.events.push({type:'hurt'});}
  }
  const next=s.supplies.find(p=>!p.taken);
  if(next&&dist(p,next)<42){next.taken=true;s.cargo++;s.events.push({type:'collect'});}
  if(s.cargo&&dist(p,{x:450,z:540})<58){const stage=s.delivered++;s.cargo--;s.score+=100;s.hp=Math.min(100,s.hp+22);s.events.push({type:'goal',stage,terms:m.boatLines[stage][2]});s.checkpoint=boardSnapshot(s);s.events.push({type:'checkpoint'});}
 }
 if(s.delivered===4)s.done=true;if(s.timeLeft<=0||s.hp<=0)s.failed=true;
}
