import test from 'node:test';
import assert from 'node:assert/strict';
import {GAMES} from './c13-games-data.mjs';
import {CINEMATIC_TRACKS,directorShot} from './c13-games-director.mjs';

test('every short authored scene has a matching camera track and readable compact speech',()=>{
 const names=new Set();
 for(const game of GAMES){assert.equal(game.opening.length,3);assert.equal(game.ending.length,2);for(const phase of ['opening','ending']){
  assert.equal(CINEMATIC_TRACKS[game.id][phase].length,game[phase].length);
  for(const [index,beat] of game[phase].entries()){const shot=directorShot(game,{phase,beatIndex:index});assert.equal(shot.name,beat.shotId);assert(!names.has(shot.name));names.add(shot.name);assert(beat.speaker);assert(beat.text.split(/\s+/).length<=20);assert(beat.seconds>=4&&beat.seconds<=5);}
 }}
 assert.equal(names.size,15);
});
test('camera curves remain finite and bounded above floors through normal and portrait framing',()=>{
 for(const game of GAMES)for(const phase of ['opening','ending'])for(const [index] of game[phase].entries())for(const portrait of [false,true])for(const progress of [-1,0,.2,.5,.8,1,2,NaN]){
  const shot=directorShot(game,{phase,beatIndex:index,progress,portrait});
  for(const field of ['position','target','heroPosition','otherPosition'])assert(shot[field].length===3&&shot[field].every(Number.isFinite));
  assert(shot.position[1]>=1.3);assert(shot.position[1]<10);assert(shot.target[1]>.5);assert(shot.fov>=30&&shot.fov<=65);
  assert(Number.isFinite(shot.heroYaw)&&Number.isFinite(shot.otherYaw));assert(shot.focusDistance>.5&&shot.focusDistance<30);
  if(game.mode==='convention'){assert(Math.abs(shot.position[0])<6);assert(shot.position[2]>-8,'camera stays in front of back wall');}
 }
});
test('key contrasts are explicit without extending the games or changing real outcomes',()=>{
 const all=GAMES.flatMap(g=>[...g.opening,...g.ending,...g.gates]).map(x=>`${x.title||''} ${x.text||''} ${x.prompt||''} ${x.choices?.join(' ')||''} ${x.why||''}`).join(' ');
 for(const term of ['Second Great Awakening','millennialism','transcendentalism','pietistic','Shakers','Mormons','temperance','teetotalism','phrenology','colonization','abolitionists','moral suasion','immediatism','Seneca Falls'])assert(all.toLowerCase().includes(term.toLowerCase()),term);
 assert.match(all,/the vote remains unwon/);assert.match(all,/skull-reading claims were false/);
 for(const game of GAMES){assert.equal(game.duration,40);assert.equal(game.gates.length,2);assert(game.gates.every(g=>g.answer>=0&&g.answer<g.choices.length));assert(game.opening.concat(game.ending).reduce((n,b)=>n+b.seconds,0)<=25);}
});

test('the courier leaves the printshop through its front and receives on the pavement',()=>{
 const first=directorShot('c13-press',{beatIndex:0,progress:.5});assert(first.heroPosition[0]<-9);assert(first.position[0]<-8);
 const doorway=directorShot('c13-press',{beatIndex:2,progress:.48});assert(doorway.heroPosition[2]>4.2);assert(Math.abs(doorway.heroPosition[0]+12)<.01);
 const outside=directorShot('c13-press',{beatIndex:2,progress:1});assert.equal(outside.heroPosition[0],0);assert(outside.heroPosition[2]>2);
 const receiving=directorShot('c13-press',{phase:'ending',beatIndex:0,progress:.5});assert(receiving.heroPosition[0]<-8);assert(receiving.otherPosition[0]<-7);
});
