// Short local-service mission. Historical battle outcome is fixed; time and scale are condensed.
export const W=1000,H=650;
export const DEPOT={x:500,y:465};
export const POSTS=[{x:240,y:280},{x:740,y:275},{x:765,y:435},{x:245,y:445}];
export const SHELTERS=[{x:320,y:390,r:48},{x:635,y:365,r:48},{x:495,y:520,r:55}];
export const GUN={x:500,y:245};
export const FLAG={x:500,y:340};
export function createFort({assist=false}={}){return {phase:'supply',elapsed:0,phaseTime:0,player:{x:500,y:465,health:100,carry:false},delivered:0,shells:[],blasts:[],shot:null,barge:0,repelled:0,gunCooldown:0,flag:0,assist,failed:false,completed:false,nextShell:1.6,seed:1814,invulnerable:0,score:0};}
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function random(s){s.seed=(s.seed*1664525+1013904223)>>>0;return s.seed/4294967296;}
export function near(s,target,r=55){return dist(s.player,target)<=r;}
export function sheltered(s){return SHELTERS.some(a=>near(s,a,a.r));}
export function interact(s){
 if(s.failed||s.completed)return {s,event:null};
 if(s.phase==='supply'){
  if(!s.player.carry&&near(s,DEPOT)){s.player.carry=true;return {s,event:'pickup'};}
  if(s.player.carry&&near(s,POSTS[s.delivered])){s.player.carry=false;s.delivered++;s.score+=100;if(s.delivered===4){s.phase='transition';s.phaseTime=0;}return {s,event:'deliver'};}
 }
 if(s.phase==='flag'&&near(s,FLAG)){s.flag=Math.min(1,s.flag+.22);if(s.flag>=1){s.completed=true;s.phase='won';s.score+=250;}return {s,event:s.completed?'finish':'flag'};}
 return {s,event:null};
}
export function fire(s,aim){if(s.phase!=='battery'||s.failed||s.gunCooldown>0||!near(s,GUN,70))return {s,event:null};s.gunCooldown=s.assist?1.1:1.5;
 const target={x:180+s.barge*165,y:113+Math.sin(s.phaseTime*.5+s.barge)*18};const hit=dist(aim,target)<(s.assist?85:60);s.shot={x:target.x,y:target.y,hit,life:.5};if(hit){s.repelled++;s.barge=(s.barge+1)%5;s.score+=150;if(s.repelled>=4){s.phase='lastwatch';s.phaseTime=0;}}return {s,event:hit?'barge-hit':'miss'};}
export function targetBarge(s){return {x:180+s.barge*165,y:113+Math.sin(s.phaseTime*.5+s.barge)*18};}
export function advance(s,dt,input={}){
 dt=Math.max(0,Math.min(.05,dt));if(!dt||s.failed||s.completed||s.phase==='transition')return {s,events:[]};
 const events=[];s.elapsed+=dt;s.phaseTime+=dt;s.gunCooldown=Math.max(0,s.gunCooldown-dt);s.invulnerable=Math.max(0,s.invulnerable-dt);
 let mx=Number(input.x)||0,my=Number(input.y)||0;const norm=Math.hypot(mx,my)||1;const speed=s.assist?215:185;
 if(norm>0){s.player.x=Math.max(165,Math.min(835,s.player.x+mx/norm*speed*dt));s.player.y=Math.max(220,Math.min(550,s.player.y+my/norm*speed*dt));}
 const safe=sheltered(s)||input.crouch;if(safe)s.player.health=Math.min(100,s.player.health+dt*(s.assist?12:8));
 s.nextShell-=dt;
 if(s.nextShell<=0&&['supply','battery','lastwatch'].includes(s.phase)){
  const follow=random(s)<.57;const p=s.player;
  const x=follow?Math.max(170,Math.min(830,p.x+(random(s)-.5)*130)):180+random(s)*640;
  const y=follow?Math.max(225,Math.min(545,p.y+(random(s)-.5)*110)):235+random(s)*295;
  s.shells.push({x,y,t:s.assist?2.9:2.3,max:s.assist?2.9:2.3,r:s.assist?47:59});s.nextShell=s.phase==='lastwatch'?(s.assist?2.8:2):s.assist?2.2:1.55;
 }
 for(const a of s.shells){a.t-=dt;if(a.t<=0){s.blasts.push({...a,life:.65});events.push('burst');if(!s.invulnerable&&dist(s.player,a)<a.r){s.player.health-=s.assist?11:safe?12:24;s.invulnerable=.7;events.push('hit');}}}
 s.shells=s.shells.filter(a=>a.t>0);for(const b of s.blasts)b.life-=dt;s.blasts=s.blasts.filter(b=>b.life>0);if(s.shot){s.shot.life-=dt;if(s.shot.life<=0)s.shot=null;}
 if(s.player.health<=0){s.player.health=0;s.failed=true;events.push('fail');}
 if(s.phase==='lastwatch'&&s.phaseTime>=24){s.phase='flag';s.phaseTime=0;s.shells=[];events.push('dawn');}
 if(s.phase==='flag'&&near(s,FLAG)&&input.interact){s.flag=Math.min(1,s.flag+dt*.4);if(s.flag>=1){s.completed=true;s.phase='won';s.score+=250;events.push('finish');}}
 return {s,events};
}
export function beginBattery(s){if(s.phase==='transition'){s.phase='battery';s.phaseTime=0;s.player.x=500;s.player.y=350;s.shells=[];s.invulnerable=1;}return s;}
export function restartCheckpoint(s){const n=createFort({assist:s.assist});if(s.delivered===4){n.delivered=4;n.phase=s.repelled>=4?'lastwatch':'battery';n.player.x=500;n.player.y=350;n.repelled=s.repelled>=4?4:0;n.score=s.score;}return n;}
