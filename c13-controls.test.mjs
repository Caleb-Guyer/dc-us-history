import test from 'node:test';
import assert from 'node:assert/strict';
import {GameInput,keyboardAction} from './c13-controls.mjs';

test('aliases continue moving until every held key for the action is released',()=>{
 const input=new GameInput();input.press('up','key:KeyW');input.press('up','key:ArrowUp');
 input.release('key:KeyW');assert.equal(input.keys.up,true);
 input.release('key:ArrowUp');assert.equal(input.keys.up,false);
 input.press('dash','key:ShiftLeft');input.press('dash','key:ShiftRight');input.release('key:ShiftLeft');assert.equal(input.keys.dash,true);
});
test('touch cancellation releases its own source while retaining keyboard and another finger',()=>{
 const input=new GameInput();input.press('left','key:KeyA');input.press('left','pointer:12');input.press('action','pointer:13');
 input.release('pointer:12');assert.equal(input.keys.left,true);assert.equal(input.keys.action,true);
 input.release('key:KeyA');assert.equal(input.keys.left,false);assert.equal(input.keys.action,true);
 input.release('pointer:13');assert.equal(input.keys.action,false);
});
test('repeated keys do not accumulate holds and blur clears every action',()=>{
 const input=new GameInput();for(let i=0;i<25;i++)input.press('action','key:Space');input.release('key:Space');assert.equal(input.keys.action,false);
 input.press('down','key:KeyS');input.press('dash','pointer:9');input.clear();assert(Object.values(input.keys).every(v=>v===false));assert.equal(input.sources.size,0);
 assert.equal(input.press('invalid','key:KeyQ'),false);
});
test('physical key codes keep movement and releases stable when Shift changes key text',()=>{
 assert.equal(keyboardAction({code:'KeyW',key:'W'}),'up');assert.equal(keyboardAction({code:'KeyC',key:'C'}),'dash');
 assert.equal(keyboardAction({code:'Space',key:' '}),'action');assert.equal(keyboardAction({code:'ArrowDown',key:'ArrowDown'}),'down');
 assert.equal(keyboardAction({key:'e'}),'action');assert.equal(keyboardAction({code:'KeyQ',key:'q'}),undefined);
});
