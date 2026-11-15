import {cleanState,freshState} from './c13-state.mjs?v=8.4.0';

// A failed write makes this tab's live record authoritative until a retry works.
// Back/forward restores and other tabs must not erase that unsaved work.
export class StudyRecord{
 constructor(storage,key){
  this.storage=storage??null;
  this.key=key;
  this.state=freshState();
  this.dirty=false;
  this.refresh();
 }
 save(state){
  this.state=state;
  this.dirty=true;
  try{
   if(typeof this.storage?.setItem!=='function')return false;
   this.storage.setItem(this.key,JSON.stringify(cleanState(state)));
   this.dirty=false;
   return true;
  }catch{return false;}
 }
 refresh(){
  if(this.dirty)return false;
  try{
   if(typeof this.storage?.getItem!=='function')return false;
   return this.acceptStorageValue(this.storage.getItem(this.key));
  }catch{return false;}
 }
 acceptStorageValue(raw){
  if(this.dirty)return false;
  if(raw!==null&&typeof raw!=='string')return false;
  try{
   const next=raw===null?freshState():cleanState(JSON.parse(raw));
   this.state=next;
   return true;
  }catch{return false;}
 }
}
