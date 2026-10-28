import {TERMS} from './c10-terms.mjs?v=6.2.0';
import {shuffle} from './c10-rules.mjs?v=6.2.0';
const ids=TERMS.map(t=>t.id),valid=new Set(ids);
const unique=a=>Array.isArray(a)?[...new Set(a.filter(id=>valid.has(id)))]:[];
export const freshCards=()=>({version:1,recalled:[],again:[],active:null,last:null});
export function cleanCards(raw){
 const s=freshCards();if(raw?.version!==1)return s;
 s.recalled=unique(raw.recalled);s.again=unique(raw.again).filter(id=>!s.recalled.includes(id));
 const r=raw.active;
 if(r&&Array.isArray(r.deck)&&r.deck.length&&r.deck.length<=16&&new Set(r.deck).size===r.deck.length&&r.deck.every(id=>valid.has(id))&&Number.isInteger(r.index)&&r.index>=0&&r.index<r.deck.length&&Array.isArray(r.ratings)&&r.ratings.length===r.index&&r.ratings.every(v=>typeof v==='boolean'))s.active={deck:[...r.deck],index:r.index,revealed:r.revealed===true,ratings:[...r.ratings]};
 const l=raw.last;if(l&&Number.isInteger(l.total)&&l.total>0&&l.total<=16&&Number.isInteger(l.recalled)&&l.recalled>=0&&l.recalled<=l.total)s.last={total:l.total,recalled:l.recalled};
 return s;
}
export function startCards(s,{review=false,seed=Date.now()}={}){const deck=shuffle(review?s.again:ids,seed);if(!deck.length)return false;s.active={deck,index:0,revealed:false,ratings:[]};return true;}
export function revealCard(s){if(!s.active||s.active.revealed)return false;s.active.revealed=true;return true;}
export function rateCard(s,recalled){const r=s.active;if(!r?.revealed||typeof recalled!=='boolean')return false;const id=r.deck[r.index];s.recalled=s.recalled.filter(x=>x!==id);s.again=s.again.filter(x=>x!==id);(recalled?s.recalled:s.again).push(id);r.ratings.push(recalled);r.index++;r.revealed=false;if(r.index===r.deck.length){s.last={total:r.deck.length,recalled:r.ratings.filter(Boolean).length};s.active=null;}return true;}
