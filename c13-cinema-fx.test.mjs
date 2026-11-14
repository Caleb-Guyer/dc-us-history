import test from 'node:test';
import assert from 'node:assert/strict';
import {linearDepth,focusBlur} from './c13-cinema-fx.mjs';

test('lens depth reconstructs physical near, middle and far distances',()=>{
 const near=.1,far=170;
 assert(Math.abs(linearDepth(0,near,far)-near)<1e-8);
 assert(Math.abs(linearDepth(1,near,far)-far)<1e-8);
 for(const distance of [.2,1,4,20,100]){
  const projected=(far-near*far/distance)/(far-near);
  assert(Math.abs(linearDepth(projected,near,far)-distance)<1e-8);
 }
});
test('the lens retains a clear subject and bounds background blur',()=>{
 assert.equal(focusBlur(4,4),0);assert.equal(focusBlur(4.7,4),0);
 assert(focusBlur(8,4)>0);assert(focusBlur(12,4)>=focusBlur(8,4));
 for(const distance of [.1,1,10,100,170])assert(focusBlur(distance,4)>=0&&focusBlur(distance,4)<=.006);
});
