import {QUESTIONS,TERMS} from './t911-data.mjs?v=7.0.0';

const CHAPTER_IDS=[9,10,11],byId=new Map(QUESTIONS.map(q=>[q.id,q]));
const termById=new Map(TERMS.map(t=>[t.id,t]));
const chapterOf=q=>Number(q.chapter),sectionOf=q=>String(q.section);
const knownChapters=new Set(CHAPTER_IDS),modeValid=v=>v==='practice'||v==='exam';
const seedNumber=value=>{const n=Number(value);return Number.isFinite(n)?Math.floor(n)>>>0:1;};
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

function random(seed){let x=seedNumber(seed);return ()=>{x=(x+0x6d2b79f5)>>>0;let n=Math.imul(x^(x>>>15),x|1);n^=n+Math.imul(n^(n>>>7),n|61);return ((n^(n>>>14))>>>0)/4294967296;};}
export function shuffle(items,seed=1){const a=[...items],r=random(seed);for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function sizeOf(value,available,otherwise=5){if(value==='all')return available;const n=Number(value??otherwise);return Number.isFinite(n)&&n>0?Math.min(available,Math.floor(n)):0;}
function filtered(items,{chapter='all',section='all',termsOnly=false}={}){
 const c=chapter==='all'?null:Number(chapter),sec=section==='all'?null:String(section);
 return items.filter(q=>(c===null||knownChapters.has(c)&&chapterOf(q)===c)&&(sec===null||sectionOf(q)===sec)&&(!termsOnly||!!q.term));
}
function questionRank(q,stats){const v=stats?.[q.id];return v?.last===false?0:!v?.tried?1:v.right>0?3:2;}
// Round-robin sections ensure a mixed chapter set does not crowd out a small
// section. Within each section, shuffled questions keep unseen work first.
function pickSections(pool,count,seed,rank=()=>0){
 const groups=new Map();for(const q of pool){const key=sectionOf(q);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(q);}
 const keys=shuffle([...groups.keys()],seed),buckets=keys.map((key,i)=>shuffle(groups.get(key),seed+i*7919).sort((a,b)=>rank(a)-rank(b)));
 const out=[];let cursor=0;while(out.length<count&&buckets.some(b=>b.length)){const best=Math.min(...buckets.filter(b=>b.length).map(b=>rank(b[0])));for(let offset=0;offset<buckets.length;offset++){const index=(cursor+offset)%buckets.length,b=buckets[index];if(b.length&&rank(b[0])===best){out.push(b.shift());cursor=(index+1)%buckets.length;break;}}}return out;
}
function pickBalanced(pool,count,seed,rank=()=>0){
 const chapters=shuffle(CHAPTER_IDS.filter(c=>pool.some(q=>chapterOf(q)===c)),seed+97),alloc=new Map(chapters.map(c=>[c,0]));
 let left=count,cursor=0;while(left>0&&chapters.some(c=>alloc.get(c)<pool.filter(q=>chapterOf(q)===c).length)){const c=chapters[cursor%chapters.length];if(alloc.get(c)<pool.filter(q=>chapterOf(q)===c).length){alloc.set(c,alloc.get(c)+1);left--;}cursor++;}
 return chapters.flatMap((c,i)=>pickSections(pool.filter(q=>chapterOf(q)===c),alloc.get(c),seed+i*19937,rank));
}
function examQuestions(seed){
 const extra=CHAPTER_IDS[seedNumber(seed)%3],picked=[];
 for(const c of CHAPTER_IDS){const count=c===extra?14:13,pool=QUESTIONS.filter(q=>chapterOf(q)===c);if(pool.length<count)return [];picked.push(...pickSections(pool,count,seedNumber(seed)+c*911));}
 return shuffle(picked,seedNumber(seed)+401).map(q=>q.id);
}
export function selectQuestions({chapter='all',section='all',size=5,termsOnly=false,review=false,misses=[],mode='practice',seed=Date.now(),stats={}}={}){
 if(!modeValid(mode))return [];
 if(mode==='exam')return examQuestions(seed);
 let pool=filtered(QUESTIONS,{chapter,section,termsOnly});
 if(review){const allowed=new Set(Array.isArray(misses)?misses:[]);pool=pool.filter(q=>allowed.has(q.id));}
 const count=sizeOf(size,pool.length);if(!count)return [];
 return shuffle(pickBalanced(pool,count,seedNumber(seed),q=>questionRank(q,stats)),seedNumber(seed)+1009).map(q=>q.id);
}
function validOption(v){return Number.isInteger(v)&&v>=0&&v<4;}
function uniqueIds(rows){return new Set(rows.map(r=>r?.id)).size===rows.length;}
function validExam(rows){
 if(!Array.isArray(rows)||rows.length!==40||!uniqueIds(rows)||!rows.every(r=>byId.has(r?.id)))return false;
 const counts=CHAPTER_IDS.map(c=>rows.filter(r=>chapterOf(byId.get(r.id))===c).length).sort((a,b)=>a-b);if(counts.join(',')!=='13,13,14')return false;
 return CHAPTER_IDS.every(c=>{const available=QUESTIONS.filter(q=>chapterOf(q)===c),sections=new Set(available.map(sectionOf)),selected=rows.map(r=>byId.get(r.id)).filter(q=>chapterOf(q)===c);return selected.length<sections.size||[...sections].every(section=>selected.some(q=>sectionOf(q)===section));});
}
function validRows(rows){return Array.isArray(rows)&&rows.length>0&&rows.length<=QUESTIONS.length&&uniqueIds(rows)&&rows.every(r=>byId.has(r?.id)&&validOption(r.option));}
function record(rows,mode){const copy=rows.map(r=>({id:r.id,option:r.option}));return {rows:copy,score:copy.filter(r=>r.option===byId.get(r.id).answer).length,mode};}
export function fresh(){return {version:1,stats:{},active:null,last:null,examBest:null};}
export function clean(raw){
 const s=fresh();if(raw?.version!==1)return s;
 for(const [id,v]of Object.entries(raw.stats||{})){if(!byId.has(id)||!v||typeof v!=='object')continue;const tried=clamp(Math.floor(Number(v.tried)||0),0,99999),right=clamp(Math.floor(Number(v.right)||0),0,tried);if(tried)s.stats[id]={tried,right,last:v.last===true};}
 const r=raw.active;
 if(r&&modeValid(r.mode)&&Array.isArray(r.deck)&&r.deck.length&&r.deck.length<=QUESTIONS.length&&uniqueIds(r.deck)&&r.deck.every(d=>byId.has(d?.id)&&Array.isArray(d.order)&&d.order.length===4&&new Set(d.order).size===4&&d.order.every(validOption))&&(r.mode!=='exam'||validExam(r.deck))&&Number.isInteger(r.index)&&r.index>=0&&r.index<r.deck.length&&Array.isArray(r.answers)&&r.answers.length===r.deck.length&&r.answers.every((a,i)=>i<r.index?validOption(a):i===r.index?a===null||validOption(a):a===null))s.active={mode:r.mode,deck:r.deck.map(d=>({id:d.id,order:[...d.order]})),index:r.index,answers:[...r.answers]};
 if(raw.last&&modeValid(raw.last.mode)&&validRows(raw.last.rows)&&(raw.last.mode!=='exam'||validExam(raw.last.rows)))s.last=record(raw.last.rows,raw.last.mode);
 if(raw.examBest?.mode==='exam'&&validRows(raw.examBest.rows)&&validExam(raw.examBest.rows))s.examBest=record(raw.examBest.rows,'exam');
 return s;
}
export function missed(s){return QUESTIONS.filter(q=>s?.stats?.[q.id]?.last===false).map(q=>q.id);}
export function makeRound(s,options={}){const seed=options.seed??Date.now(),selected=selectQuestions({...options,seed,stats:s?.stats||{},misses:options.review?missed(s):options.misses});if(!selected.length)return null;const mode=options.mode==='exam'?'exam':'practice';return {mode,deck:selected.map((id,i)=>({id,order:shuffle([0,1,2,3],seedNumber(seed)+i*1297)})),index:0,answers:selected.map(()=>null)};}
export function startRound(s,options={}){const round=makeRound(s,options);if(!round)return false;s.active=round;return true;}
export function answerQuestion(s,option){const r=s.active;if(!r||!validOption(option)||r.answers[r.index]!==null)return false;const q=byId.get(r.deck[r.index].id);if(!q)return false;r.answers[r.index]=option;const previous=s.stats[q.id]||{tried:0,right:0,last:false},right=option===q.answer;s.stats[q.id]={tried:previous.tried+1,right:previous.right+Number(right),last:right};return true;}
export function nextQuestion(s){const r=s.active;if(!r||r.answers[r.index]===null)return false;if(r.index<r.deck.length-1){r.index++;return true;}const rows=r.deck.map((d,i)=>({id:d.id,option:r.answers[i]}));s.last=record(rows,r.mode);if(r.mode==='exam'&&validExam(rows)&&(!s.examBest||s.last.score>s.examBest.score))s.examBest=record(rows,'exam');s.active=null;return true;}
export function progress(s,cards=null){const stat=id=>s?.stats?.[id],sum=(ids,key)=>ids.reduce((n,id)=>n+(Number(stat(id)?.[key])||0),0),ids=QUESTIONS.map(q=>q.id),tried=sum(ids,'tried'),right=sum(ids,'right');const report=pool=>({total:pool.length,correct:pool.filter(q=>stat(q.id)?.right>0).length,missed:pool.filter(q=>stat(q.id)?.last===false).length});return {...report(QUESTIONS),tried,right,accuracy:tried?Math.round(right/tried*100):null,chapters:CHAPTER_IDS.map(id=>({id,...report(QUESTIONS.filter(q=>chapterOf(q)===id))})),sections:[...new Set(QUESTIONS.map(sectionOf))].map(id=>({id,chapter:chapterOf(QUESTIONS.find(q=>sectionOf(q)===id)),...report(QUESTIONS.filter(q=>sectionOf(q)===id))})),recalled:cards?new Set((cards.recalled||[]).filter(id=>termById.has(id))).size:0,termsTotal:TERMS.length,examScore:s?.examBest?.score??null};}

export function freshCards(){return {version:1,recalled:[],again:[],active:null,last:null};}
const cleanTermIds=list=>Array.isArray(list)?[...new Set(list.filter(id=>termById.has(id)))]:[];
export function cleanCards(raw){
 const s=freshCards();if(raw?.version!==1)return s;s.recalled=cleanTermIds(raw.recalled);s.again=cleanTermIds(raw.again).filter(id=>!s.recalled.includes(id));
 const r=raw.active;if(r&&Array.isArray(r.deck)&&r.deck.length&&r.deck.length<=TERMS.length&&new Set(r.deck).size===r.deck.length&&r.deck.every(id=>termById.has(id))&&Number.isInteger(r.index)&&r.index>=0&&r.index<r.deck.length&&Array.isArray(r.ratings)&&r.ratings.length===r.index&&r.ratings.every(v=>typeof v==='boolean'))s.active={deck:[...r.deck],index:r.index,revealed:r.revealed===true,ratings:[...r.ratings]};
 const l=raw.last;if(l&&Number.isInteger(l.total)&&l.total>0&&l.total<=TERMS.length&&Number.isInteger(l.recalled)&&l.recalled>=0&&l.recalled<=l.total)s.last={total:l.total,recalled:l.recalled};return s;
}
export function startCards(s,{chapter='all',section='all',size=5,review=false,seed=Date.now()}={}){
 const c=chapter==='all'?null:Number(chapter),sec=section==='all'?null:String(section);
 let pool=TERMS.filter(t=>(c===null||Number(t.chapter)===c)&&(sec===null||String(t.section||byId.get(t.questionId)?.section)===sec));if(review)pool=pool.filter(t=>s.again.includes(t.id));const count=sizeOf(size,pool.length);if(!count)return false;
 // Group with the corresponding chapter section while retaining term IDs.
 const enriched=pool.map(t=>({...t,section:t.section||byId.get(t.questionId)?.section||`${t.chapter}.terms`})),rank=t=>s.again.includes(t.id)?0:s.recalled.includes(t.id)?2:1;
 const deck=shuffle(pickBalanced(enriched,count,seedNumber(seed),rank),seedNumber(seed)+2089).map(t=>t.id);s.active={deck,index:0,revealed:false,ratings:[]};return true;
}
export function revealCard(s){if(!s.active||s.active.revealed)return false;s.active.revealed=true;return true;}
export function rateCard(s,recalled){const r=s.active;if(!r?.revealed||typeof recalled!=='boolean')return false;const id=r.deck[r.index];s.recalled=s.recalled.filter(x=>x!==id);s.again=s.again.filter(x=>x!==id);(recalled?s.recalled:s.again).push(id);r.ratings.push(recalled);r.index++;r.revealed=false;if(r.index===r.deck.length){s.last={total:r.deck.length,recalled:r.ratings.filter(Boolean).length};s.active=null;}return true;}
