import {createBank,stepBank,routeMoney,nextTransfer} from './c10-rules.mjs?v=6.1.0';

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const DISPATCH_RAILS=['state','land','exchange'];
export const DISPATCH_TIME=4.5;
export function createDispatch(assist=false){return Object.assign(createBank(),{dispatchMode:true,rail:'state',assist,pendingTime:0,style:0,perfect:0,grade:'',launches:0,recycles:0});}
export const dispatchPosition=s=>clamp(s.clock/DISPATCH_TIME,0,1);
export function chooseRail(s,rail){if(s.done||s.pending||!DISPATCH_RAILS.includes(rail))return false;s.rail=rail;return true;}
export function launchDispatch(s){
 if(s.done||s.pending)return null;
 const p=dispatchPosition(s),low=s.assist?.35:.56,high=s.assist?.99:.94;
 if(p<low||p>high){s.combo=0;s.grade=p<low?'EARLY':'LATE';s.message=p<low?'Let the parcel reach the gold dispatch zone, then launch.':'The parcel passed gold. Let it recycle, then launch on the next pass.';return 'early';}
 const result=routeMoney(s,s.rail);s.launches++;
 if(result==='good'){const perfect=Math.abs(p-.75)<.075;s.grade=perfect?'PERFECT DISPATCH':'DISPATCHED';s.perfect+=Number(perfect);s.style+=perfect?200:100;s.pendingTime=0;return perfect?'perfect':'good';}
 s.grade='REROUTE';s.clock=.6;return result;
}
export function stepDispatch(s,dt){
 const delta=clamp(Number(dt)||0,0,.05);if(s.done||!delta)return [];
 if(s.pending){s.pendingTime+=delta;if(s.pendingTime>=2.4){nextTransfer(s);s.pendingTime=0;s.grade='';return [s.done?'finish':'ready'];}return [];}
 stepBank(s,delta);
 if(s.clock>=DISPATCH_TIME){s.clock=.1;s.recycles++;s.combo=0;s.grade='RECYCLED';s.message='The parcel returns to the belt. Choose its destination and launch in gold.';return ['recycle'];}
 return [];
}
