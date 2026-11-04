import test from 'node:test';
import assert from 'node:assert/strict';
import {mapControls,actionLabel,secondaryLabel} from './t911-games-controls.mjs';
import {createRun,stepRun} from './t911-games-sim.mjs';
const position=s=>({x:(s.player.y-280)/28,z:-(s.player.x-230)/20});
test('screen directions stay natural in the third-person 3D coordinate system',()=>{
 for(const mode of ['factory','canal','courier','river','dispatch','press'])for(const direction of ['left','right','up','down']){
  const s=createRun({mode,target:8,duration:36,decisions:[]}),before=position(s);
  stepRun(s,mapControls({[direction]:true},mode),.12);const after=position(s);
  if(direction==='left')assert.ok(after.x<before.x);if(direction==='right')assert.ok(after.x>before.x);
  if(direction==='up')assert.ok(after.z<before.z);if(direction==='down')assert.ok(after.z>before.z);
 }
});
test('right steering does not trigger cover; the explicit secondary control does',()=>{
 const s=mapControls({right:true},'dispatch');assert.equal(s.down,true);assert.equal(s.duck,false);
 assert.equal(mapControls({secondary:true},'dispatch').duck,true);assert.equal(mapControls({secondary:true},'courier').dash,true);
 assert.equal(mapControls({secondary:true},'canal').dash,false);
});
test('primary controls and their on-screen labels match the mission genres',()=>{assert.equal(actionLabel('factory'),'Work');assert.equal(actionLabel('river'),'Boost');assert.equal(actionLabel('press'),'Vault');assert.equal(actionLabel('dispatch'),'Dash');assert.equal(secondaryLabel('dispatch'),'Cover');assert.equal(secondaryLabel('canal'),null);});
