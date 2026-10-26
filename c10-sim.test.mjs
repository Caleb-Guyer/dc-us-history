import test from 'node:test';
import assert from 'node:assert/strict';
import {createRun,stepRun,RUN_LENGTH,RUN_PACKETS,RUN_OBSTACLES,createHarbor,setBoatRoute,stepHarbor,HARBOR_DOCKS,createRally,stepRally,interactRally,RALLY_PROPS} from './c10-sim.mjs';

test('A real courier route collects every electoral return and preserves the fixed 1824 tally',()=>{
 const s=createRun();let sawFinish=false;
 for(let i=0;i<900&&!s.done;i++){
  const packet=RUN_PACKETS.find(p=>!s.collected.includes(p.id));
  const obstacle=RUN_OBSTACLES.find(o=>o.at>s.distance&&o.at-s.distance<5.4&&o.lane===s.lane);
  let laneDelta=0;
  if(packet&&s.distance>packet.at-22&&s.lane!==packet.lane)laneDelta=Math.sign(packet.lane-s.lane);
  const events=stepRun(s,.05,{laneDelta,jump:obstacle?.type==='crate'});sawFinish||=events.includes('finish');
 }
 assert.equal(s.done,true);assert.equal(sawFinish,true);assert.equal(s.distance,RUN_LENGTH);
 assert.equal(s.collected.length,4);assert.equal(new Set(s.collected).size,4);
 assert.equal(RUN_PACKETS.reduce((n,p)=>n+p.votes,0),261);assert.equal(Math.max(...RUN_PACKETS.map(p=>p.votes)),99);
 assert.ok(s.elapsed<35,'the runner remains a compact opening');
 const elapsed=s.elapsed;assert.deepEqual(stepRun(s,.05,{laneDelta:1,dash:true}),[]);assert.equal(s.elapsed,elapsed);
});

test('A missing return rewinds to its approach rather than finishing or erasing earlier work',()=>{
 const s=createRun();s.distance=RUN_LENGTH-1;s.collected=['jackson','adams','crawford'];
 for(let i=0;i<3;i++)stepRun(s,.05);
 assert.equal(s.done,false);assert.ok(s.distance<220);assert.equal(s.health,3);assert.deepEqual(s.collected,['jackson','adams','crawford']);
 assert.ok(s.flash.includes('Clay'));assert.equal(s.retries,1);
});

test('Jump clears a low crate; a wagon needs a different lane; dash and recovery are bounded',()=>{
 const jump=createRun();jump.distance=19;
 stepRun(jump,.05,{jump:true});for(let i=0;i<13;i++)stepRun(jump,.05);
 assert.equal(jump.health,3);
 const wagon=createRun();wagon.distance=35;wagon.lane=1;wagon.x=2.8;
 stepRun(wagon,.05,{jump:true});for(let i=0;i<10;i++)stepRun(wagon,.05);
 assert.equal(wagon.health,2);
 const dash=createRun();stepRun(dash,.05,{dash:true});const cd=dash.dashCooldown;stepRun(dash,.05,{dash:true});assert.ok(dash.dashCooldown<cd);assert.ok(dash.distance>1);
 for(let i=0;i<8;i++)stepRun(dash,.05,{laneDelta:-1});assert.equal(dash.lane,-1);assert.ok(dash.x>=-2.8);
 const retry=createRun();retry.distance=23;retry.health=1;retry.collected=['jackson'];stepRun(retry,.05);stepRun(retry,.05);stepRun(retry,.05);
 assert.equal(retry.health,3);assert.deepEqual(retry.collected,['jackson']);assert.equal(retry.retries,1);assert.equal(retry.done,false);
});

test('Three simultaneously managed harbor lanes land all six cargoes through actual routes',()=>{
 const s=createHarbor(),charted=new Set();let sawFinish=false;
 for(let frame=0;frame<1600&&!s.done;frame++){
  for(const boat of s.boats){if(charted.has(boat.id))continue;const n=Number(boat.id.split('-')[1])-1,cruiseY=[110,160,210][n%3],dock=HARBOR_DOCKS[boat.dock];
   assert.ok(setBoatRoute(s,boat.id,[{x:boat.x,y:cruiseY},{x:dock.x,y:cruiseY},dock]));charted.add(boat.id);
  }
  sawFinish||=stepHarbor(s,.05).includes('finish');
 }
 assert.equal(s.done,true);assert.equal(sawFinish,true);assert.equal(s.delivered,6);assert.equal(s.spawned,6);assert.equal(s.boats.length,0);
 assert.equal(s.misses,0,'a careful three-channel plan stays clear of shoals and traffic');assert.ok(s.elapsed<65);
 assert.equal(setBoatRoute(s,'boat-1',[HARBOR_DOCKS[0]]),false);
});

test('Harbor cargo cannot be delivered remotely or to a different wharf',()=>{
 const s=createHarbor();for(let i=0;i<100;i++)stepHarbor(s,.05);assert.equal(s.delivered,0);
 const boat=s.boats[0],wrong=HARBOR_DOCKS[0];setBoatRoute(s,boat.id,[{x:100,y:110},{x:180,y:110},wrong]);
 for(let i=0;i<400;i++)stepHarbor(s,.05);assert.equal(s.delivered,0);assert.equal(boat.wrongDock,true);assert.equal(s.done,false);
 assert.ok(distance(boat,wrong)<3);
});
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);

test('A shoal setback recovers the cargo and permits a new route; malformed points do not poison coordinates',()=>{
 const s=createHarbor(),boat=s.boats[0];assert.equal(setBoatRoute(s,boat.id,[{x:NaN,y:5}]),false);assert.deepEqual(boat.route,[]);
 assert.equal(setBoatRoute(s,'missing',[{x:5,y:5}]),false);
 setBoatRoute(s,boat.id,[{x:100,y:270},{x:340,y:270}]);
 for(let i=0;i<300&&!s.misses;i++)stepHarbor(s,.05);
 assert.equal(s.misses,1);assert.equal(s.delivered,0);assert.equal(boat.y,55);assert.equal(boat.cargo,'Imported cloth');assert.equal(boat.route.length,0);
 assert.ok(setBoatRoute(s,boat.id,[{x:100,y:110},{x:820,y:110},HARBOR_DOCKS[2]]));
 for(let i=0;i<600&&!s.delivered;i++)stepHarbor(s,.05);assert.equal(s.delivered,1);
 const other=s.boats[0];setBoatRoute(s,other.id,[{x:-200,y:900}]);assert.deepEqual(other.route,[{x:45,y:555}]);
});

test('A harbor near-collision returns both crews safely while preserving delivered cargoes',()=>{
 const s=createHarbor();s.delivered=2;const [a,b]=s.boats;a.x=500;a.y=180;b.x=525;b.y=180;a.cooldown=b.cooldown=0;
 const cargo=[a.cargo,b.cargo],events=stepHarbor(s,.05);assert.equal(events.filter(e=>e==='setback').length,2);assert.equal(s.misses,2);assert.equal(s.delivered,2);
 assert.equal(a.y,55);assert.equal(b.y,55);assert.deepEqual([a.cargo,b.cargo],cargo);assert.ok(distance(a,b)>=65);assert.equal(s.done,false);
});

test('A placard must be picked up and carried to its own platform, with movement required throughout',()=>{
 const s=createRally();assert.equal(interactRally(s).event,null);assert.equal(s.placed.length,0);
 function walkTo(target){for(let i=0;i<2500&&distance(s.player,target)>18;i++)stepRally(s,.05,{x:target.x-s.player.x,y:target.y-s.player.y,sprint:true});assert.ok(distance(s.player,target)<=18,`walk to ${JSON.stringify(target)}`);}
 const h=RALLY_PROPS[0];walkTo(h);assert.equal(interactRally(s).event,'pickup');assert.equal(s.player.carry,'harrison');
 walkTo(RALLY_PROPS[1].target);assert.equal(interactRally(s).event,null);assert.equal(s.placed.length,0,'the wrong platform cannot accept a placard');
 walkTo(h.target);assert.equal(interactRally(s).event,'place');assert.deepEqual(s.placed,['harrison']);
 const t=RALLY_PROPS[1];walkTo({x:930,y:175});walkTo({x:930,y:440});walkTo(t);assert.equal(interactRally(s).event,'pickup');
 walkTo({x:930,y:440});walkTo({x:930,y:175});walkTo(t.target);assert.equal(interactRally(s).event,'place');
 const v=RALLY_PROPS[2];walkTo({x:65,y:175});walkTo({x:65,y:360});walkTo(v);assert.equal(interactRally(s).event,'pickup');
 walkTo({x:930,y:360});walkTo({x:930,y:175});walkTo(v.target);assert.equal(interactRally(s).event,'finish');
 assert.equal(s.done,true);assert.equal(s.placed.length,3);assert.equal(s.player.carry,null);assert.equal(interactRally(s).event,null);
});

test('Rally directions agree with the screen, diagonal speed is normalized and dash cannot reset its cooldown',()=>{
 const up=createRally(),diagonal=createRally();stepRally(up,.05,{y:-1});stepRally(diagonal,.05,{x:1,y:-1});
 assert.ok(up.player.y<500);assert.equal(up.player.x,500);assert.ok(Math.abs(distance(up.player,{x:500,y:500})-distance(diagonal.player,{x:500,y:500}))<1e-8);
 const dash=createRally();stepRally(dash,.05,{x:1,dash:true});const cd=dash.cooldown,x=dash.player.x;stepRally(dash,.05,{x:1,dash:true});assert.ok(dash.cooldown<cd);assert.ok(dash.player.x-x>20);
 for(let i=0;i<300;i++)stepRally(up,.05,{x:1,y:-1});assert.equal(up.player.x,935);assert.equal(up.player.y,100);
 const elapsed=up.elapsed;stepRally(up,NaN,{x:Infinity});assert.equal(up.elapsed,elapsed);stepRally(up,.05,{x:Infinity,y:NaN});assert.ok(Number.isFinite(up.player.x));assert.ok(Number.isFinite(up.player.y));
});

test('A parade bump preserves placards and already placed work, and separates the player from the float',()=>{
 const s=createRally();s.player.carry='tyler';s.placed=['harrison'];s.player.x=500;s.player.y=295;
 const events=stepRally(s,.05);assert.ok(events.includes('bump'));assert.equal(s.player.carry,'tyler');assert.deepEqual(s.placed,['harrison']);assert.ok(s.bump>0);
 const o=s.obstacles[0];assert.ok(Math.abs(s.player.x-o.x)>=o.w/2+14||Math.abs(s.player.y-o.y)>=o.h/2+14);
});
