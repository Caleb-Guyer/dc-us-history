import {CAMPAIGNS} from './t911-games-data.mjs?v=7.1.0';
export const GAME_KEY='dc-test911-games-v1';
const nonnegative=x=>Number.isFinite(x)?Math.max(0,Math.round(x)):0;
const ids={9:['c9-factory','c9-canal','c9-courier'],11:['c11-river','c11-dispatch','c11-press']};
export const emptyRecord=()=>({version:1,chapters:{9:{completed:[],best:{},recall:{}},11:{completed:[],best:{},recall:{}}}});
export function cleanRecord(raw){
 const out=emptyRecord();
 for(const chapter of [9,11]){
  const x=raw?.chapters?.[chapter];if(!x||typeof x!=='object')continue;
  const c=out.chapters[chapter];
  c.completed=ids[chapter].filter(id=>Array.isArray(x.completed)&&x.completed.includes(id));
  for(const id of c.completed){const b=x.best?.[id];if(b&&Number.isFinite(b.score))c.best[id]={score:nonnegative(b.score),hits:nonnegative(b.hits),seconds:nonnegative(b.seconds)};}
  for(const [id,v] of Object.entries(x.recall||{}))if(CAMPAIGNS[chapter].debrief.includes(id)&&typeof v==='boolean')c.recall[id]=v;
 }
 return out;
}
export function completeMission(raw,chapter,id,result){
 const out=cleanRecord(raw),c=out.chapters[chapter];
 if(!c||!ids[chapter].includes(id)||!result?.won)return out;
 if(!c.completed.includes(id))c.completed.push(id);
 if(!c.best[id]||nonnegative(result.score)>c.best[id].score)c.best[id]={score:nonnegative(result.score),hits:nonnegative(result.hits),seconds:nonnegative(result.seconds)};
 return out;
}
export function availableMission(raw,chapter,index){const c=cleanRecord(raw).chapters[chapter];return !!c&&Number.isInteger(index)&&index>=0&&index<3&&(index===0||ids[chapter].slice(0,index).every(id=>c.completed.includes(id)));}
export function gameProgress(raw,chapter){const c=cleanRecord(raw).chapters[chapter];return c?{completed:c.completed.length,total:3,recall:Object.values(c.recall).filter(Boolean).length}: {completed:0,total:3,recall:0};}
