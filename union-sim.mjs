import {POLICIES} from './short-games-data.mjs';
export const MIN={large:60,small:60,order:60,liberty:55};
export function createUnion(){return {phase:'draft',turn:0,large:42,small:38,order:20,liberty:48,used:[],history:[],ratified:[],message:'Two sizes of state. One country. Keep the coalition together.',failed:false};}
export function ready(s){return s.used.includes('house')&&s.used.includes('senate')&&s.used.includes('checks')&&Object.entries(MIN).every(([k,v])=>s[k]>=v);}
export function enact(s,id){const p=POLICIES.find(x=>x.id===id);if(s.phase!=='draft'||s.failed||s.turn>=8||!p||(!p.repeat&&s.used.includes(id)))return s;
 const n={...s,turn:s.turn+1,used:[...s.used,id],history:[...s.history,id],message:p.detail};for(const [key,d]of Object.entries(p.effect))n[key]=Math.max(0,Math.min(100,n[key]+d));
 if(n.turn>=8&&!ready(n))n.failed=true;return n;}
export function acceptDraft(s){return ready(s)?{...s,phase:'record',message:'The coalition can hold. The historical Constitution also protects slavery.'}:s;}
export function ratify(s,id){if(s.phase!=='ratify'||!['papers','amend','conventions'].includes(id)||s.ratified.includes(id))return s;const ids=[...s.ratified,id];return {...s,ratified:ids,phase:ids.length===3?'won':'ratify'};}
export function beginRatification(s){return s.phase==='record'?{...s,phase:'ratify'}:s;}
