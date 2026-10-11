import {BANK,FOCUS,MATCHES,TIMELINES} from './midterm-data.mjs';
export const STATE_VERSION=1;
export const BY_ID=new Map(BANK.map(q=>[q.id,q]));
export const TASKS=[...MATCHES.map(x=>x.id),...TIMELINES.map(x=>x.id)];
export function fresh(){return {version:STATE_VERSION,stats:{},drills:[],games:[],exams:[],rounds:0,active:null,last:null};}
export function shuffle(items,rng=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const n=rng(),j=Math.floor((Number.isFinite(n)?Math.max(0,Math.min(.999999999,n)):0)*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const count=n=>Number.isSafeInteger(n)&&n>=0?Math.min(n,1000000):0;
export function clean(raw){
 const s=fresh();if(raw?.version!==STATE_VERSION)return s;
 for(const [id,v] of Object.entries(raw.stats||{}))if(BY_ID.has(id)&&v&&typeof v==='object')s.stats[id]={right:count(v.right),wrong:count(v.wrong),recall:count(v.recall),again:count(v.again),lastCorrect:typeof v.lastCorrect==='boolean'?v.lastCorrect:null,lastRecall:typeof v.lastRecall==='boolean'?v.lastRecall:null};
 s.drills=[...new Set((Array.isArray(raw.drills)?raw.drills:[]).filter(x=>TASKS.includes(x)))];
 s.games=[...new Set((Array.isArray(raw.games)?raw.games:[]).filter(x=>x==='7'||x==='8'))];
 s.exams=(Array.isArray(raw.exams)?raw.exams:[]).filter(x=>x&&Number.isInteger(x.score)&&x.score>=0&&x.score<=40&&typeof x.date==='string').slice(-10);
 s.rounds=count(raw.rounds);s.active=cleanSession(raw.active);
 s.last=cleanSession(raw.last);return s;
}
export function cleanSession(r){
 if(!r||!['quiz','cards','exam'].includes(r.kind)||!Array.isArray(r.deck)||!r.deck.length||r.deck.length>40||!Number.isInteger(r.index)||r.index<0||r.index>r.deck.length||!Array.isArray(r.answers)||r.answers.length>r.deck.length)return null;
 if(r.kind==='exam'&&r.deck.length!==40)return null;
 const ids=new Set();for(const d of r.deck){if(!BY_ID.has(d?.id)||ids.has(d.id)||!Array.isArray(d.order)||d.order.length!==4||new Set(d.order).size!==4||d.order.some(n=>!Number.isInteger(n)||n<0||n>3))return null;ids.add(d.id);}
 if(r.answers.length<r.index||r.answers.length>r.index+1)return null;
 for(let i=0;i<r.answers.length;i++){const a=r.answers[i];if(a?.id!==r.deck[i].id||typeof a.right!=='boolean')return null;if(r.kind!=='cards'&&(!Number.isInteger(a.option)||a.option<0||a.option>3||a.right!==(a.option===0)))return null;}
 return {kind:r.kind,deck:r.deck.map(d=>({id:d.id,order:[...d.order]})),index:r.index,answers:r.answers.map(a=>({...a})),label:typeof r.label==='string'?r.label.slice(0,100):'Practice',revealed:!!r.revealed};
}
export function pool(chapter='focus',terms=false){let qs=chapter==='focus'?FOCUS:chapter==='all'?BANK:BANK.filter(q=>q.c===Number(chapter));return terms?qs.filter(q=>q.k):qs;}
export function missed(s,kind='quiz',chapter='all'){return pool(chapter).filter(q=>kind==='cards'?s.stats[q.id]?.lastRecall===false:s.stats[q.id]?.lastCorrect===false);}
export function makeSession(s,{kind='quiz',chapter='focus',terms=false,review=false,ids=null,count:limit=5,rng=Math.random}={}){
 let qs;if(kind==='exam'){
  qs=[];
  // The first ten are an explicit balanced rehearsal choice; the teacher gave a combined total.
  for(let c=2;c<=6;c++)qs.push(...shuffle(BANK.filter(q=>q.c===c&&q.p&&q.f),rng).slice(0,2));
  for(const c of [7,8]){qs.push(...shuffle(BANK.filter(q=>q.c===c&&q.k),rng).slice(0,3));qs.push(...shuffle(BANK.filter(q=>q.c===c&&q.p&&!q.k),rng).slice(0,12));}
  if(qs.length!==40)throw Error('Incomplete rehearsal coverage');qs=shuffle(qs,rng);
 }else{
  const candidates=ids?BANK.filter(q=>ids.includes(q.id)):review?missed(s,kind,chapter):pool(chapter,terms);if(!candidates.length)return null;
  const need=q=>kind==='cards'?!(s.stats[q.id]?.recall):!(s.stats[q.id]?.right);
  const wrong=q=>kind==='cards'?s.stats[q.id]?.lastRecall===false:s.stats[q.id]?.lastCorrect===false;
  qs=shuffle(candidates,rng).sort((a,b)=>(wrong(b)-wrong(a))||(need(b)-need(a))||(b.p-a.p)).slice(0,Math.min(Math.max(1,Math.min(40,Number.isInteger(limit)?limit:5)),candidates.length));
 }
 return {kind,deck:qs.map(q=>({id:q.id,order:shuffle([0,1,2,3],rng)})),index:0,answers:[],revealed:false,label:kind==='exam'?'Midterm rehearsal':review?'Review missed':terms?'Key terms':chapter==='focus'?'Midterm focus':chapter==='all'?'All chapters':`Chapter ${chapter}`};
}
export function answer(s,displayIndex){
 const r=s.active;if(!r||r.index>=r.deck.length||r.answers.length>r.index)return s;const d=r.deck[r.index];
 if(r.kind==='cards'&&!r.revealed)return s;
 if(!Number.isInteger(displayIndex)||displayIndex<0||displayIndex>(r.kind==='cards'?1:3))return s;
 const option=r.kind==='cards'?null:d.order[displayIndex],right=r.kind==='cards'?displayIndex===1:option===0;
 const old=s.stats[d.id]||{right:0,wrong:0,recall:0,again:0,lastCorrect:null,lastRecall:null};
 const v=r.kind==='cards'?{...old,recall:old.recall+(right?1:0),again:old.again+(right?0:1),lastRecall:right}:{...old,right:old.right+(right?1:0),wrong:old.wrong+(right?0:1),lastCorrect:right};
 return {...s,stats:{...s.stats,[d.id]:v},active:{...r,answers:[...r.answers,{id:d.id,option,right}]}};
}
export function next(s){const r=s.active;if(!r||r.answers.length!==r.index+1)return s;if(r.index+1<r.deck.length)return {...s,active:{...r,index:r.index+1,revealed:false}};
 const done={...r,index:r.deck.length};return {...s,active:null,last:done,rounds:s.rounds+1,exams:r.kind==='exam'?[...s.exams,{score:r.answers.filter(a=>a.right).length,date:new Date().toISOString()}].slice(-10):s.exams};}
export function progress(s){
 const quiz=FOCUS.filter(q=>s.stats[q.id]?.right>0).length,cards=FOCUS.filter(q=>s.stats[q.id]?.recall>0).length;
 const units=[{name:'Focus questions',done:quiz,total:FOCUS.length,weight:60},{name:'Recall cards',done:cards,total:FOCUS.length,weight:20},{name:'Quick challenges',done:s.drills.length,total:TASKS.length,weight:10},{name:'Short games',done:s.games.length,total:2,weight:6},{name:'Exam rehearsal',done:s.exams.length?1:0,total:1,weight:4}];
 const earned=units.reduce((n,u)=>n+u.weight*Math.min(1,u.done/u.total),0),percent=units.every(u=>u.done>=u.total)?100:Math.min(99,Math.floor(earned));
 const right=Object.values(s.stats).reduce((n,v)=>n+v.right,0),wrong=Object.values(s.stats).reduce((n,v)=>n+v.wrong,0);
 return {percent,units,quiz,cards,right,attempted:right+wrong,accuracy:right+wrong?Math.round(right/(right+wrong)*100):null,missed:missed(s).length};
}
export function nextGoal(s){
 if(s.active)return {kind:'resume',title:'Finish your saved round',detail:`${s.active.label} · ${s.active.deck.length-s.active.index} remaining`,label:'Resume round'};
 if(missed(s).length)return {kind:'review',title:'Clear the questions you missed',detail:`${missed(s).length} topics to revisit · one short round`,label:'Review 5 questions'};
 if(s.rounds>=2&&!s.games.includes('7'))return {kind:'game7',title:'Break for the Convention',detail:'Build a workable union with Roger Sherman · about 4 min',label:'Play Chapter 7'};
 const p=progress(s);
 if(s.rounds>=5&&!s.games.includes('8'))return {kind:'game8',title:'Hold through the night',detail:'Fort McHenry · a short action mission · about 4 min',label:'Play Chapter 8'};
 if(s.rounds%3===2&&p.cards<FOCUS.length)return {kind:'cards',title:'Switch to recall for five cards',detail:'Think of the answer before revealing it.',label:'Start 5 cards'};
 if(p.quiz<FOCUS.length)return {kind:'quiz',title:'Take five from the focus list',detail:'Marked notes and the midterm outline come first.',label:'Start 5 questions'};
 if(!s.games.includes('8'))return {kind:'game8',title:'Hold through the night',detail:'Fort McHenry · a short action mission · about 4 min',label:'Play Chapter 8'};
 if(p.cards<FOCUS.length)return {kind:'cards',title:'Recall five without looking',detail:'Say the answer first, then reveal and check yourself.',label:'Start 5 cards'};
 const d=TASKS.find(x=>!s.drills.includes(x));if(d)return {kind:'drill',id:d,title:'Connect the ideas',detail:'A short match or timeline challenge.',label:'Start challenge'};
 if(!s.exams.length)return {kind:'exam',title:'Try the midterm rehearsal',detail:'40 questions · feedback after the finish',label:'Start rehearsal'};
 return {kind:'exam',title:'Keep the knowledge fresh',detail:'Practice route complete. A fresh rehearsal tests your recall.',label:'New rehearsal'};
}
export function creditDrill(s,id){return TASKS.includes(id)?{...s,drills:[...new Set([...s.drills,id])]}:s;}
export function creditGame(s,id){return ['7','8'].includes(String(id))?{...s,games:[...new Set([...s.games,String(id)])]}:s;}
