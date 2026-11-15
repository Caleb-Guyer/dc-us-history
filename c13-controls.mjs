const ACTIONS=['left','right','up','down','action','dash'];
const CODES={KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right',KeyW:'up',ArrowUp:'up',KeyS:'down',ArrowDown:'down',Space:'action',KeyE:'action',ShiftLeft:'dash',ShiftRight:'dash',KeyC:'dash'};
const KEYS={a:'left',ArrowLeft:'left',d:'right',ArrowRight:'right',w:'up',ArrowUp:'up',s:'down',ArrowDown:'down',' ':'action',e:'action',Shift:'dash',c:'dash'};
export function keyboardAction(event){return CODES[event.code]||KEYS[event.key]||KEYS[event.key?.toLowerCase()];}

// Track each physical source separately. Releasing W must not cancel a still-held
// Up arrow, and a touch release must not cancel a key held for the same action.
export class GameInput{
 constructor(){this.keys=Object.fromEntries(ACTIONS.map(name=>[name,false]));this.sources=new Map();}
 press(action,source){
  if(!ACTIONS.includes(action)||typeof source!=='string'||!source)return false;
  const previous=this.sources.get(source);this.sources.set(source,action);
  if(previous&&previous!==action)this.sync(previous);
  this.keys[action]=true;return true;
 }
 release(source){const action=this.sources.get(source);if(!action)return false;this.sources.delete(source);this.sync(action);return true;}
 sync(action){this.keys[action]=[...this.sources.values()].includes(action);}
 clear(){this.sources.clear();for(const action of ACTIONS)this.keys[action]=false;}
}
