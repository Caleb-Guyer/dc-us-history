import test from 'node:test';
import assert from 'node:assert/strict';
globalThis.location={search:''};
globalThis.document={body:{append(){}}};
class AudioStub{constructor(){this.paused=true;this.ended=false;this.src='';this.plays=0;}addEventListener(){}pause(){this.paused=true;}play(){this.paused=false;this.plays++;return Promise.resolve();}}
globalThis.Audio=AudioStub;
const {ShortAudio}=await import('./short-audio.mjs');
test('Two visibility listeners can pause one line without losing its resumption',()=>{const a=new ShortAudio();a.score('union');a.line('union-open');assert.equal(a.speech.plays,1);a.pause();a.pause();assert.ok(a.speech.paused&&a.music.paused);a.resume();assert.equal(a.speech.plays,2);assert.equal(a.music.plays,2);});
test('Skipping a paused scene cancels the old line; silent previews remain silent on resume',()=>{const a=new ShortAudio();a.line('union-open');a.pause();a.stopVoice();a.resume();assert.equal(a.speech.plays,1);a.muted=true;a.pause();a.resume();assert.ok(a.speech.paused&&a.music.paused);a.forced=true;a.toggle();assert.ok(a.muted);});
