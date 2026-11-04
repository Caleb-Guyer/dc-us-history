import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyRecord,cleanRecord,completeMission,availableMission,gameProgress} from './t911-games-store.mjs';
test('campaign progress is isolated, validates identifiers and requires a win',()=>{
 let r=emptyRecord();r=completeMission(r,9,'c9-factory',{won:false,score:10});assert.equal(gameProgress(r,9).completed,0);
 r=completeMission(r,9,'c9-factory',{won:true,score:42,hits:1,seconds:30});assert.equal(gameProgress(r,9).completed,1);assert.equal(gameProgress(r,11).completed,0);
 r=completeMission(r,9,'c11-river',{won:true});assert.equal(gameProgress(r,9).completed,1);
 assert.equal(availableMission(r,9,1),true);assert.equal(availableMission(r,9,2),false);assert.equal(availableMission(r,11,1),false);
});
test('replays keep the better score and do not duplicate completion',()=>{let r=emptyRecord();for(const score of [100,20,150])r=completeMission(r,11,'c11-river',{won:true,score,hits:2,seconds:40});assert.equal(r.chapters[11].best['c11-river'].score,150);assert.equal(r.chapters[11].completed.length,1);});
test('malformed records and older hub records cannot grant campaign progress',()=>{assert.deepEqual(cleanRecord({stats:{a:true},chapters:{9:{completed:['bad','c11-river','c9-factory','c9-factory'],best:{'c9-factory':{score:NaN}},recall:{'t911-c11-01':true,'t911-c9-01':true,'t911-c9-03':true}}}}).chapters[9],{completed:['c9-factory'],best:{},recall:{'t911-c9-03':true}});assert.deepEqual(cleanRecord(null),emptyRecord());assert.equal(availableMission(null,9,-1),false);});
test('nonfinite result numbers cannot pollute the persisted record',()=>{const r=completeMission(null,9,'c9-factory',{won:true,score:Infinity,hits:Infinity,seconds:NaN});assert.deepEqual(r.chapters[9].best['c9-factory'],{score:0,hits:0,seconds:0});assert.deepEqual(cleanRecord(JSON.parse(JSON.stringify(r))),r);});
