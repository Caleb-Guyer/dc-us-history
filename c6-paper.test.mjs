import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,tick,snapshot,restore,currentGoal,goalNear,distance,collide} from './c6-sim.mjs';
import {continueProgress,SCENES,LINES} from './c6-data.mjs';
import {paperOperating,paperCanUse} from './c6-paper.mjs';
import {paperCamera} from './c6-paper-world.mjs';
import {applyLook} from './c6-controls.mjs';
import * as T from './three.module.js';
const step=(s,i={},sec=1)=>{const events=[];for(let n=0;n<sec*40;n++)events.push(...tick(s,i,.025));return events;};
function walk(s,x,z){
 const start={x:Math.round(s.player.x),z:Math.round(s.player.z)},queue=[start],parent=new Map([[start.x+','+start.z,null]]);let end=null;
 for(let j=0;j<queue.length;j++){const p=queue[j];if(Math.hypot(p.x-x,p.z-z)<.75){end=p;break;}for(const [dx,dz] of [[0,-1],[0,1],[-1,0],[1,0]]){const a={x:p.x+dx,z:p.z+dz},key=a.x+','+a.z;if(parent.has(key)||collide(s,a.x,a.z,.35,0))continue;parent.set(key,p);queue.push(a);}}
 assert.ok(end,'traversable route to '+x+','+z);const route=[];while(end){route.unshift(end);end=parent.get(end.x+','+end.z);}for(const p of route){let n=0;while(distance(s.player,p)>.16&&n++<100){s.player.yaw=Math.atan2(-(p.x-s.player.x),-(p.z-s.player.z));tick(s,{forward:true},.025);assert.equal(collide(s,s.player.x,s.player.z,.29,0),false);}assert.ok(n<100,'walking waypoint');}
}
function use(s,x,z){let g=currentGoal(s);walk(s,x??g.x,z??g.z);if(x===undefined&&s.level==='printshop'&&s.stage===9){while(!goalNear(s)){g=currentGoal(s);walk(s,g.x,g.z);}}const st=s.stage,recovered=s.paper.recovered;let n=0;while(s.stage===st&&s.paper.recovered===recovered&&!paperOperating(s)&&n++<75)tick(s,{interact:true},.025);step(s,{},.1);assert.ok(s.stage!==st||s.paper.recovered||paperOperating(s),'interaction makes progress at stage '+st);}
function prepared(reserve=false){const s=fresh('printshop');use(s,reserve?3:-3,8);use(s,reserve?5:-5,1);use(s);for(let i=0;i<6;i++)use(s);use(s);use(s);use(s);assert.equal(s.stage,12);assert.equal(paperOperating(s),true);return s;}
function sheet(s,good=true){tick(s,{interact:true,useTap:true},.025);assert.equal(s.paper.phase,'in');step(s,{right:true},1.2);assert.equal(s.paper.phase,'stroke');let n=0;while((good?!(s.paper.beat>.38&&s.paper.beat<.65):s.paper.beat>.13)&&n++<100)tick(s,{},.025);tick(s,{jump:true,press:true},.025);assert.equal(s.paper.phase,'out');step(s,{left:true},1.2);assert.equal(s.paper.phase,'take');tick(s,{interact:true,useTap:true},.025);step(s,{},.1);}
test('the print run works through actual walks, carried type, recovery, and three timed sheets',()=>{
 let s=prepared();assert.equal(s.paper.type,3);assert.equal(s.paper.proofCaught,true);assert.equal(s.paper.proofMended,true);assert.equal(s.carrying,false);sheet(s);s=restore(snapshot(s));assert.equal(s.paper.sheets,1);assert.equal(s.paper.atPress,true);sheet(s);sheet(s);assert.equal(s.stage,13);assert.equal(s.paper.atPress,false);use(s);assert.equal(s.finished,true);assert.equal(s.shotsFired,0);
});
test('a private allocation stops cooperation and is physically brought back into the pool',()=>{
 const s=fresh('printshop');use(s,3,8);assert.equal(s.paper.representative,'hart');use(s,5,1);assert.equal(s.paper.cooperation,0);assert.equal(s.paper.stock,2);assert.equal(s.carrying,true);step(s,{interact:true},2);assert.equal(s.stage,2);use(s);assert.equal(s.paper.cooperation,1);assert.equal(s.paper.shared,true);assert.equal(s.paper.stock,8);assert.equal(s.carrying,false);
});
test('a ballot cannot be cast from the center between the two physical trays',()=>{const s=fresh('printshop');walk(s,0,8);assert.equal(paperCanUse(s),false);assert.equal(goalNear(s),false);step(s,{interact:true},3);assert.equal(s.stage,0);use(s,-3,8);assert.equal(s.paper.representative,'mara');});
test('press work needs feeding, carriage travel and a new stroke; walking and holding Space cannot auto-print',()=>{
 const s=prepared();const p={...s.player};step(s,{jump:true},8);assert.equal(s.paper.sheets,0);assert.equal(s.player.y,0);assert.equal(s.paper.phase,'feed');tick(s,{interact:true,useTap:true},.025);step(s,{right:true,jump:true},2);assert.equal(s.paper.phase,'stroke');assert.equal(s.paper.sheets,0);assert.equal(s.player.x,p.x);assert.equal(s.player.z,p.z);assert.equal(s.player.y,0);
});
test('a bad stroke wastes no permanent supply and a paused press can be resumed',()=>{const s=prepared();sheet(s,false);assert.equal(s.paper.spoiled,1);assert.equal(s.paper.sheets,0);assert.equal(s.paper.stock,8);tick(s,{back:true},.025);assert.equal(s.paper.atPress,false);const raw=snapshot(s),r=restore(raw);assert.equal(r.paper.spoiled,1);use(r);assert.equal(r.paper.atPress,true);sheet(r);assert.equal(r.paper.sheets,1);});
test('distinct carriage taps buffered between frames are retained without moving the player',()=>{const s=prepared();tick(s,{useTap:true},.025);const p={...s.player};tick(s,{rightTap:5},.025);assert.equal(s.paper.phase,'stroke');assert.equal(s.player.x,p.x);assert.equal(s.player.z,p.z);s.paper.beat=.5;tick(s,{press:true},.025);tick(s,{leftTap:5},.025);assert.equal(s.paper.phase,'take');tick(s,{useTap:true},.025);assert.equal(s.paper.sheets,1);});
test('both delivery orders reach all three recipients without colliding with the city',()=>{
 for(const first of ['neighbors','harbor']){const s=fresh('dispatch');use(s,first==='neighbors'?-3:3,17);assert.equal(s.paper.route,first);for(let i=0;i<3;i++){const g=currentGoal(s);walk(s,0,s.player.z);if(g.z===-39){walk(s,0,-39);walk(s,15,-39);}else{walk(s,0,-7);walk(s,-15,-7);}use(s);}
 walk(s,0,-39);walk(s,0,-61);use(s);assert.equal(s.finished,true);assert.deepEqual([...s.paper.delivered].sort(),['france','local','spain']);}
});
test('rain-damaged packets divert to a required covered recovery before recipients accept them',()=>{const s=fresh('dispatch');use(s,3,17);s.paper.wetness=1;s.paper.rain=1;assert.equal(currentGoal(s).verb,'Dry and retie the packets');walk(s,5,-4);use(s);assert.equal(s.stage,1);assert.equal(s.paper.recovered,true);assert.ok(s.paper.wetness<.2);assert.equal(currentGoal(s).verb,'Hand over the France packet');});
test('corrupt shop saves and duplicate diplomatic deliveries are rejected',()=>{const raw=snapshot(prepared());for(const patch of [{phase:'auto'},{carriage:2},{stock:-1},{atPress:'yes'},{proofX:Infinity},{wetness:5},{delivered:['france','france']}]){const bad=structuredClone(raw);Object.assign(bad.paper,patch);assert.equal(restore(bad),null);}assert.equal(restore(raw).paper.type,3);});
test('the press camera keeps look up and down consistent with the campaign controls',()=>{const s=prepared(),w={camera:new T.PerspectiveCamera()},direction=()=>{paperCamera(w,s);return w.camera.getWorldDirection(new T.Vector3());};const start=direction();applyLook(s.player,0,-100,1);assert.ok(direction().y>start.y);applyLook(s.player,0,200,1);assert.ok(direction().y<start.y);});
test('Boston saves advance into Philadelphia and replay boundaries retain separate endings',()=>{
 const old={complete:true,seen:['liftHome'],prefs:{muted:true},checkpoint:null,scene:null};const next=continueProgress(old);assert.equal(next.scene,'paperIntro');assert.equal(next.complete,false);assert.equal(next.prefs.muted,true);const done={...old,seen:['liftHome','paperCoda']};assert.equal(continueProgress(done),done);assert.equal(SCENES.liftHome.after,'paperIntro');assert.equal(SCENES.paperPrinted.after,'dispatch');assert.equal(SCENES.paperDeparture.after,'paperThomas');assert.equal(SCENES.paperThomas.after,'paperCoda');assert.equal(SCENES.paperCoda.after,'complete');
 const text=LINES.filter(l=>l.id.startsWith('paper.')||l.id.startsWith('dispatch.')).map(l=>l.text).join(' ');for(const term of ['republicanism','popular sovereignty','Jefferson','Adams','George the Third','consent of the governed','alter or abolish','France','Spain','thirteen colonies'])assert.ok(text.includes(term));
});

