import {CAMPAIGNS,GAME_VERSION} from './t911-games-data.mjs?v=7.2.0';
import {createRun,stepRun,chooseGate,gate,summary} from './t911-games-sim.mjs?v=7.2.0';
import {CampaignWorld} from './t911-games-3d.mjs?v=7.2.0';
import {directorShot} from './t911-games-director.mjs?v=7.2.0';
import {mapControls,actionLabel,secondaryLabel,controlHint} from './t911-games-controls.mjs?v=7.2.0';
import {GAME_KEY,emptyRecord,cleanRecord,completeMission,availableMission,gameProgress} from './t911-games-store.mjs?v=7.2.0';
import {CampaignAudio} from './t911-games-audio.mjs?v=7.2.0';
import {BY_ID} from './t911-data.mjs?v=7.2.0';

const chapter=Number(document.body.dataset.chapter),campaign=CAMPAIGNS[chapter],app=document.querySelector('#game-app');
const params=new URLSearchParams(location.search),preview=params.get('preview')==='1',forcedMute=params.get('muted')==='1';
const key=preview?GAME_KEY.replace('-v1','-preview-v1'):GAME_KEY;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(action,label,cls='primary',extra='')=>`<button type="button" class="${cls}" data-action="${action}" ${extra}>${label}</button>`;
const route=file=>{const q=new URLSearchParams({v:GAME_VERSION});for(const k of ['muted','preview'])if(params.get(k)==='1')q.set(k,'1');return `${file}?${q}`;};
let stored=true,record=emptyRecord(),sound=false;
try{record=cleanRecord(JSON.parse(localStorage.getItem(key)||'null'));sound=!forcedMute&&localStorage.getItem('dc-short-campaign-sound')==='on';}catch{stored=false;}
const audio=new CampaignAudio({muted:!sound});
let view='menu',index=0,run=null,canvas=null,world=null,worldCanvas=null,worldMission=null,scene=null,beatIndex=0,beatTime=0,cinemaEnd=null,scenePhase='opening',cinemaPaused=false,cinemaClock=0,gateFeedback=null;
let timerId=null,renderPrevious=0,measuredFrames=0,measuredSeconds=0,previous=0,clock=0,lastHud=-1,oldScore=0,oldHits=0,debriefIndex=0,debriefRows=[],debriefOrder=[],debriefSelected=null;
const keys=new Set(),touch=new Set();
document.querySelector('#hub-link').href=route('test911.html');
document.title=`${campaign.title} · Chapter ${chapter}`;
function save(){try{localStorage.setItem(key,JSON.stringify(record));stored=true;}catch{stored=false;}}
function soundLabel(){const b=document.querySelector('#sound');b.textContent=sound?'Sound on':'Sound off';b.setAttribute('aria-pressed',String(sound));}
soundLabel();
function clearInput(){keys.clear();touch.clear();document.querySelectorAll('.touch-controls .pressed').forEach(b=>b.classList.remove('pressed'));}
const mission=()=>campaign.missions[index];
const warning=()=>!stored?'<p class="storage-warning" role="status">This browser cannot save. Keep this tab open to retain this session.</p>':preview?'<p class="small">Muted preview · separate campaign record.</p>':'';
function show(next){
 clearInput();view=next;audio.quiet();app.className=view==='cinema'?'cinema':'';document.body.dataset.view=view;document.body.dataset.mission=mission()?.id||'';document.body.dataset.version=GAME_VERSION;
 app.innerHTML=({menu,cinema,briefing,play,gate:gateView,paused,won:wonView,lost:lostView,debrief,finish}[view]||menu)();
 attachWorld();lastHud=-1;
 app.querySelector('h1')?.focus({preventScroll:true});window.scrollTo(0,0);
 if(view==='cinema'&&!cinemaPaused)speakBeat();
}
function attachWorld(){
 const placeholder=app.querySelector('canvas');canvas=null;if(!placeholder)return;
 try{
  if(world&&worldMission===mission().id){worldCanvas.setAttribute('aria-label',placeholder.getAttribute('aria-label')||'3D historical scene');placeholder.replaceWith(worldCanvas);canvas=worldCanvas;}
  else{world?.dispose();world=null;canvas=placeholder;worldCanvas=canvas;worldMission=mission().id;world=new CampaignWorld(canvas,{chapter,mission:mission()});canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();if(view==='play')show('paused');},{once:true});}
  document.body.dataset.renderer='webgl';world.resize();
 }catch(error){world?.dispose();world=null;document.body.dataset.renderer='unavailable';placeholder.parentElement.innerHTML=`<div class="renderer-message" role="alert"><h2>3D could not start in this browser.</h2><p>Try reopening this page with hardware acceleration enabled, or continue with the chapter review.</p><a href="${route('test911.html')}">Open test review</a></div>`;}
}
function resize(){world?.resize();}
window.addEventListener('resize',resize);
function sceneCanvas(label='Historical scene'){return `<div class="stage"><canvas role="img" aria-label="${esc(label)}"></canvas></div>`;}
function top(){const m=mission();return `<div class="game-top"><div><p class="eyebrow">Chapter ${chapter} / Mission ${index+1} of 3</p><h1 tabindex="-1">${esc(m.title)}</h1><span class="location">${esc(m.place)} · ${esc(m.year)}</span></div>${button('menu','Campaign','small-button')}</div>`;}
function menu(){const p=gameProgress(record,chapter),next=campaign.missions.findIndex(m=>!record.chapters[chapter].completed.includes(m.id));return `${warning()}<section class="menu-hero"><div><p class="eyebrow">Chapter ${chapter} / Short 3D campaign</p><h1 tabindex="-1">${esc(campaign.title)}</h1><p class="lead">${esc(campaign.tagline)}</p><div class="menu-meta"><span>3D action · 3 missions · ${esc(campaign.duration)}</span><span>${p.completed}/3 complete</span><span>6-question final recall</span></div><div class="actions">${button('continue',p.completed===0?'Begin campaign':next<0?'Play again':'Continue campaign')}${p.completed===3?button('recall','Final recall','secondary'):''}</div></div><canvas role="img" aria-label="${chapter===9?'A 3D industrial town, mill and canal':'A 3D western landscape and expedition'}"></canvas></section><section class="mission-list" aria-label="Campaign missions">${campaign.missions.map((m,i)=>{const done=record.chapters[chapter].completed.includes(m.id),available=availableMission(record,chapter,i);return `<article class="mission-item"><span class="mission-num">0${i+1}</span><div><h3>${esc(m.title)}</h3><p>${esc(m.place)} · ${esc(m.year)} · ${esc(m.role)}</p></div>${button('mission',done?'Replay mission':available?'Play mission':'Complete the previous mission','secondary',`data-index="${i}" ${available?'':'disabled'}`)}</article>`;}).join('')}</section><details class="campaign-notes"><summary>About these historical scenes</summary><p>${esc(campaign.description)}</p><p>Movement, hazards and delivery tasks are arcade representations. Scene dialogue is invented. The campaign highlights core connections; use the review hub for the complete test question bank.</p>${campaign.sourceNotes.map(x=>`<p>${esc(x)}</p>`).join('')}</details><a class="game-back" href="${route('test911.html')}">← Back to Chapters 9–11 review</a>`;}
function startMission(i){if(!availableMission(record,chapter,i))return;index=i;run=createRun(mission(),{seed:Math.floor(Date.now()%0xffffffff)});oldScore=0;oldHits=0;startCinema(mission().opening,'briefing');}
function startCinema(beats,after){scene=beats;beatIndex=0;beatTime=0;cinemaEnd=after;scenePhase=after==='briefing'?'opening':'ending';cinemaPaused=false;cinemaClock=0;show('cinema');}
function speakBeat(){const b=scene[beatIndex];audio.speak(b.text);}
function cinema(){const b=scene[beatIndex];return `${top()}<div class="film-progress" aria-label="Shot ${beatIndex+1} of ${scene.length}">${scene.map((_,i)=>`<i class="${i<=beatIndex?'done':''}"></i>`).join('')}</div><div class="cinema-layout">${sceneCanvas(`${mission().place}: ${b.shot} cinematic shot`)}<div class="film-caption" aria-live="polite"><span class="speaker">${esc(b.speaker)}</span><p>${esc(b.text)}</p></div></div><div class="film-controls">${button('next-shot','Next shot','secondary')}${button('cinema-pause',cinemaPaused?'Resume scene':'Pause scene','small-button')}${button('skip','Skip scene','text-button')}<small>Animated scenes · Space to advance</small></div>`;}
function advanceBeat(){beatIndex++;beatTime=0;if(beatIndex>=scene.length){show(cinemaEnd);return;}show('cinema');}
function briefing(){const m=mission(),extra=secondaryLabel(m.mode);return `${top()}<div class="briefing-layout">${sceneCanvas(m.place)}<section class="briefing"><p class="eyebrow">Your objective</p><h2>${esc(m.goal)}</h2><p class="role">${esc(m.role)}</p><div class="controls-card"><strong>${esc(controlHint(m.mode))}</strong><p>A/D or ←/→: steer · W/S or ↑/↓: forward/back<br>Space / E: ${actionLabel(m.mode)}${extra?' · Shift / C: '+extra:''} · P / Esc: pause</p><p>Collect ${m.target} objectives across two ${m.mode==='factory'?'stations':'paths'}. Both historical decisions pause the clock.</p></div>${button('launch','Start mission')}<p class="small">Touch buttons work too. Each short mission has its own retry.</p></section></div>`;}
function play(){const m=mission(),action=actionLabel(m.mode),extra=secondaryLabel(m.mode);return `${top()}<div class="objective"><span>${esc(m.goal)}</span><button class="small-button" data-action="pause">Pause</button></div><div class="hud" aria-label="Mission status"><div>Condition <b id="health">100</b><span class="health-track"><i id="health-bar" style="width:100%"></i></span></div><div>Objective <b id="collected">0/${m.target}</b><span class="paths" id="paths">0/2 ${m.mode==='factory'?'stations':'paths'}</span></div><div class="time"><b id="remaining">${m.duration}</b>s</div></div><div class="meter"><i id="progress"></i></div>${sceneCanvas(`3D ${m.place}; gold objectives and red hazards`)}<p class="sr-only" id="accessible-status" aria-live="off"></p><div class="play-controls"><p><span id="style-readout">Score 0 · chain 0</span><br>A/D steer · W/S forward/back · Space/E ${action.toLowerCase()}${extra?' · Shift/C '+extra.toLowerCase():''} · P pause</p><div class="touch-controls" aria-label="Movement controls"><button data-hold="left" aria-label="Move left">←</button><button data-hold="up" aria-label="Move forward">↑</button><button data-hold="down" class="down" aria-label="Move back">↓</button><button data-hold="right" aria-label="Move right">→</button><button data-hold="action" class="action-key" aria-label="${action}">${action.toUpperCase()}</button>${extra?`<button data-hold="secondary" class="secondary-key" aria-label="${extra}">${extra.toUpperCase()}</button>`:''}</div></div>`;}
function gateView(){const g=gate(run);return `${top()}<div class="gate-layout"><section class="gate-panel"><p class="eyebrow">Decision ${run.gateIndex+1} / 2 · Clock paused</p><h1 tabindex="-1">${esc(g.prompt)}</h1>${g.choices.map((x,i)=>`<button class="choice ${gateFeedback!==null?(i===g.answer?'correct':i===gateFeedback?'wrong':''):''}" data-action="gate-answer" data-option="${i}" ${gateFeedback===null?'':'disabled'}><b>${i+1}</b>${esc(x)}</button>`).join('')}${gateFeedback===null?'<p class="small">A correct call restores condition and earns a bonus. A miss gets a correction, then the mission continues.</p>':`<div class="feedback" role="status">${gateFeedback===g.answer?'Good call.':'Correct the report.'} ${esc(g.why)}</div><div class="actions">${button('gate-continue','Back to the action')}</div>`}</section>${sceneCanvas('The mission waits for your decision')}</div>`;}
function paused(){return `${top()}<section class="pause-panel"><p class="eyebrow">Mission paused</p><h1 tabindex="-1">Catch your breath.</h1><p>Completed missions are saved. This attempt stays here until you leave the page.</p><div class="actions">${button('resume','Resume mission')}${button('retry','Restart mission','secondary')}${button('menu','Campaign menu','secondary')}</div></section>`;}
function wonView(){const s=summary(run);return `${top()}<section class="result-panel"><p class="eyebrow">Checkpoint saved</p><h1 tabindex="-1">${index===2?'The story is yours to remember.':'Objective complete.'}</h1><div class="result-stats"><div><b>${s.score}</b><span>score</span></div><div><b>${s.collected}</b><span>objectives</span></div><div><b>${s.decisionsCorrect}/2</b><span>historical decisions</span></div></div><div class="lesson-card"><p class="eyebrow">Carry this forward</p><p>${esc(mission().lesson)}</p></div><div class="actions">${button('next-mission',index===2?'Final recall · 6 questions':'Next mission →')}${button('retry','Replay mission','secondary')}${button('menu','Campaign menu','text-button')}</div></section>`;}
function lostView(){return `${top()}<section class="result-panel"><p class="eyebrow">Try this mission again</p><h1 tabindex="-1">One more run.</h1><p>${esc(run.reason)}</p><div class="controls-card"><strong>${mission().mode==='factory'?'Stay near the amber work area. Hold Work and steer left or right between stations.':controlHint(mission().mode)}</strong><p>Decisions pause the clock. Previous completed missions are safe.</p></div><div class="actions">${button('retry','Retry this mission')}${button('menu','Campaign menu','secondary')}</div></section>`;}
function launch(){if(!run)run=createRun(mission());oldScore=run.score;oldHits=run.hits;show('play');}
function nextMission(){if(index<2)startMission(index+1);else startDebrief();}
function startDebrief(){debriefIndex=0;debriefRows=[];prepareQuestion();show('debrief');}
function prepareQuestion(){debriefSelected=null;debriefOrder=[0,1,2,3];for(let i=3;i>0;i--){const j=Math.floor(Math.random()*(i+1));[debriefOrder[i],debriefOrder[j]]=[debriefOrder[j],debriefOrder[i]];}}
function debrief(){const q=BY_ID.get(campaign.debrief[debriefIndex]);document.body.dataset.question=q.id;return `<section class="debrief-panel"><p class="eyebrow">Chapter ${chapter} / Final recall</p><p class="debrief-progress">Question ${debriefIndex+1} of 6 · your campaign record</p><h1 tabindex="-1">${esc(q.prompt)}</h1>${debriefOrder.map((i,n)=>`<button class="choice ${debriefSelected!==null?(i===q.answer?'correct':i===debriefSelected?'wrong':''):''}" data-action="recall-answer" data-option="${i}" ${debriefSelected===null?'':'disabled'}><b>${n+1}</b>${esc(q.choices[i])}</button>`).join('')}${debriefSelected!==null?`<div class="feedback" role="status">${debriefSelected===q.answer?'Correct.':'Remember this.'} ${esc(q.why)}</div><p class="small">${esc(q.source)}</p><div class="actions">${button('recall-next',debriefIndex===5?'See your campaign record':'Next question →')}</div>`:'<p class="small">Choose an answer to get the explanation. These six questions have their own campaign record; they do not mark the review hub’s question bank complete.</p>'}</section>`;}
function finish(){const score=debriefRows.filter(x=>x.correct).length,p=gameProgress(record,chapter);return `<section class="result-panel"><p class="eyebrow">Chapter ${chapter} / Campaign complete</p><h1 tabindex="-1">${esc(campaign.title)}</h1><p class="lead">Three short missions. A few big connections.</p><div class="result-stats"><div><b>${p.completed}/3</b><span>missions complete</span></div><div><b>${score}/6</b><span>this final recall</span></div></div>${campaign.missions.map(m=>`<div class="lesson-card"><p class="eyebrow">${esc(m.title)}</p><p>${esc(m.lesson)}</p></div>`).join('')}<p class="small">The full test covers more than this campaign. Use the key-term cards and chapter practice to cover the remaining topics.</p><div class="actions"><a class="primary" href="${route('test911.html')}">Return to test review</a>${button('recall','Try final recall again','secondary')}${button('menu','Campaign menu','text-button')}</div><div class="finish-links"><a href="${route(chapter===9?'chapter11.html':'chapter9.html')}">Play Chapter ${chapter===9?11:9} →</a><a href="TEST911-GAMES.md" target="_blank" rel="noopener">Historical scenes & controls</a></div></section>`;}
function handle(action,el){audio.unlock();switch(action){
 case 'continue':{const n=campaign.missions.findIndex(m=>!record.chapters[chapter].completed.includes(m.id));startMission(n<0?0:n);break;}
 case 'mission':startMission(Number(el.dataset.index));break;
 case 'menu':show('menu');break;
 case 'next-shot':advanceBeat();break;
 case 'cinema-pause':cinemaPaused=!cinemaPaused;show('cinema');break;
 case 'skip':show(cinemaEnd);break;
 case 'launch':launch();break;
 case 'pause':if(view==='play')show('paused');break;
 case 'resume':show('play');break;
 case 'retry':startMission(index);break;
 case 'gate-answer':if(gateFeedback===null){gateFeedback=Number(el.dataset.option);const correct=gateFeedback===gate(run).answer;show('gate');audio.cue(correct?'correct':'hit');}break;
 case 'gate-continue':if(gateFeedback!==null){chooseGate(run,gateFeedback);gateFeedback=null;show('play');}break;
 case 'next-mission':nextMission();break;
 case 'recall':startDebrief();break;
 case 'recall-answer':if(debriefSelected===null){const q=BY_ID.get(campaign.debrief[debriefIndex]);debriefSelected=Number(el.dataset.option);const correct=debriefSelected===q.answer;debriefRows.push({id:q.id,correct});record.chapters[chapter].recall[q.id]=correct;save();show('debrief');audio.cue(correct?'correct':'hit');}break;
 case 'recall-next':if(debriefSelected!==null){debriefIndex++;if(debriefIndex>=6)show('finish');else{prepareQuestion();show('debrief');}}break;
 }}
document.addEventListener('click',event=>{const el=event.target.closest('[data-action]');if(el&&!el.disabled)handle(el.dataset.action,el);});
document.querySelector('#sound').addEventListener('click',()=>{sound=!sound;audio.setMuted(!sound);soundLabel();if(!preview)try{localStorage.setItem('dc-short-campaign-sound',sound?'on':'off');}catch{}if(sound&&view==='cinema'&&!cinemaPaused)speakBeat();});
const keyMap={ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right',ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',' ':'action',e:'action',Shift:'secondary',c:'secondary'};
document.addEventListener('keydown',e=>{
 const code=e.key.length===1?e.key.toLowerCase():e.key;
 if(e.target.closest('input,select,textarea'))return;
 if((code==='p'||code==='Escape')&&['play','paused'].includes(view)){e.preventDefault();if(!e.repeat)show(view==='play'?'paused':'play');return;}
 if(view==='play'&&keyMap[code]){e.preventDefault();keys.add(keyMap[code]);return;}
 if(['gate','debrief'].includes(view)&&/^[1-4]$/.test(code)){e.preventDefault();if(!e.repeat){const choices=[...app.querySelectorAll('.choice:not(:disabled)')];choices[Number(code)-1]?.click();}return;}
 if(e.target.closest('button,a'))return;
 if(view==='cinema'&&code===' '){e.preventDefault();if(!e.repeat)advanceBeat();}
});
document.addEventListener('keyup',e=>{const code=e.key.length===1?e.key.toLowerCase():e.key;if(keyMap[code])keys.delete(keyMap[code]);});
app.addEventListener('pointerdown',e=>{const b=e.target.closest('[data-hold]');if(!b)return;e.preventDefault();audio.unlock();b.setPointerCapture(e.pointerId);touch.add(b.dataset.hold);b.classList.add('pressed');});
function releasePointer(e){const b=e.target.closest('[data-hold]');if(b){touch.delete(b.dataset.hold);b.classList.remove('pressed');}}
app.addEventListener('pointerup',releasePointer);app.addEventListener('pointercancel',releasePointer);app.addEventListener('lostpointercapture',releasePointer);
window.addEventListener('blur',()=>{clearInput();if(view==='play')show('paused');});
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInput();audio.quiet();if(view==='play')show('paused');}});
window.addEventListener('pagehide',()=>{clearInterval(timerId);timerId=null;audio.quiet();world?.dispose();world=null;worldCanvas=null;canvas=null;});
window.addEventListener('pageshow',e=>{if(e.persisted){show(view);startTimer();}});
window.addEventListener('storage',e=>{if(e.key===key){try{record=cleanRecord(JSON.parse(e.newValue));if(view==='menu')show('menu');}catch{}}});
function hud(){if(view!=='play')return;document.querySelector('#health').textContent=Math.round(run.health);document.querySelector('#health-bar').style.width=`${run.health}%`;document.querySelector('#collected').textContent=`${run.collected}/${mission().target}`;document.querySelector('#paths').textContent=`${run.paths}/2 ${mission().mode==='factory'?'stations':'paths'}`;document.querySelector('#remaining').textContent=Math.ceil(mission().duration-run.time);const actionButton=document.querySelector('[data-hold=action]'),cooldown=mission().mode==='factory'?0:run.actionCooldown;actionButton.textContent=actionLabel(mission().mode).toUpperCase()+(cooldown>.03?' '+cooldown.toFixed(1):'');actionButton.classList.toggle('charging',cooldown>.03);actionButton.setAttribute('aria-description',cooldown>.03?'Recharging '+cooldown.toFixed(1)+' seconds':'Ready');document.querySelector('#style-readout').textContent=`Score ${run.score} · chain ${run.combo}${run.style?.perfects?' · perfect '+run.style.perfects:''}${run.style?.vaults?' · vaults '+run.style.vaults:''}`;document.querySelector('#progress').style.width=`${run.progress*100}%`;document.querySelector('#accessible-status').textContent=`${run.collected} of ${mission().target} objectives across ${run.paths} paths, condition ${Math.round(run.health)}, ${Math.ceil(mission().duration-run.time)} seconds remaining.`;document.body.dataset.condition=String(Math.round(run.health));document.body.dataset.objectives=String(run.collected);document.body.dataset.progress=run.progress.toFixed(2);document.body.dataset.paths=String(run.paths);}
function tick(ms){const elapsed=previous?Math.max(0,(ms-previous)/1000):0,dt=Math.min(elapsed,.25);previous=ms;clock+=dt;
 if(view==='play'){
  const logical=Object.fromEntries(['left','right','up','down','action','secondary'].map(k=>[k,keys.has(k)||touch.has(k)]));if(world)stepRun(run,mapControls(logical,mission().mode),dt);
  if(run.hits>oldHits){audio.cue('hit');oldHits=run.hits;}else if(run.score>oldScore)audio.cue('collect');oldScore=run.score;
  if(run.status==='gate'){gateFeedback=null;show('gate');}
  else if(run.status==='won'){record=completeMission(record,chapter,mission().id,summary(run));save();startCinema(mission().ending,'won');audio.cue('win');}
  else if(run.status==='lost')show('lost');
  if(clock-lastHud>.1){hud();lastHud=clock;}
 }else if(view==='cinema'&&!cinemaPaused&&!document.hidden){beatTime+=dt;cinemaClock+=dt;if(beatTime>=scene[beatIndex].duration)advanceBeat();}
 if(['play','cinema'].includes(view)&&!(view==='cinema'&&cinemaPaused)&&!document.hidden)audio.update(clock,{chapter,intense:view==='play'});
}
// A background browser can reduce drawing to one frame per second while
// timers and keyboard input remain active. Keep gameplay independent of that.
function startTimer(){if(timerId===null){previous=0;timerId=setInterval(()=>tick(performance.now()),16);}}
function renderFrame(ms){
 const elapsed=renderPrevious?Math.max(0,(ms-renderPrevious)/1000):0;renderPrevious=ms;measuredFrames++;measuredSeconds+=elapsed;
 if(measuredSeconds>=1){document.body.dataset.fps=(measuredFrames/measuredSeconds).toFixed(1);document.body.dataset.drawCalls=String(world?.performance?.calls||0);document.body.dataset.renderMs=String(Math.round(world?.performance?.cpuMs||0));document.body.dataset.triangles=String(world?.performance?.triangles||0);measuredFrames=0;measuredSeconds=0;}
 if(canvas&&world){const b=view==='cinema'?scene[beatIndex]:null,progress=b?beatTime/b.duration:0;world.update(run,Math.min(elapsed,.25),view==='cinema'?cinemaClock:clock,{view,cinema:['cinema','menu','briefing'].includes(view),beat:b,beatProgress:progress,shot:b?directorShot(mission(),{beatIndex,phase:scenePhase,progress,time:clock}):null});}
 requestAnimationFrame(renderFrame);
}
show('menu');startTimer();requestAnimationFrame(renderFrame);
