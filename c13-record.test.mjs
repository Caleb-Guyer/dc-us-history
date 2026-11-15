import test from 'node:test';
import assert from 'node:assert/strict';
import {StudyRecord} from './c13-record.mjs';
import {STORAGE_KEY,PREVIEW_KEY,freshState,startQuiz,currentQuestion,answerQuestion,startCards,revealCard,rateCard,completeGame,progress} from './c13-state.mjs';

function memoryStorage(){const values=new Map();return {values,getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};}

test('blocked storage retains an answered question and refuses a back-forward refresh of unsaved work',()=>{
 let reads=0;
 const record=new StudyRecord({getItem(){reads++;throw Error('blocked');},setItem(){throw Error('blocked');}},STORAGE_KEY);
 const state=record.state;
 startQuiz(state,{mode:'practice',size:5,seed:19});
 const {question}=currentQuestion(state);
 answerQuestion(state,question.answer);
 assert.equal(record.save(state),false);
 assert.equal(record.dirty,true);
 assert.equal(record.state,state);
 assert.equal(record.refresh(),false);
 assert.equal(reads,1,'a restore must not even read stale storage while this tab is dirty');
 assert.equal(currentQuestion(record.state).selected,question.answer);
 assert.equal(progress(record.state).questions.correct,1);
 assert.equal(record.acceptStorageValue(null),false,'a different tab clearing storage cannot discard unsaved work');
 assert.equal(currentQuestion(record.state).selected,question.answer);
});

test('quota failure keeps recalled cards through external changes and preserves the exact in-memory session',()=>{
 const storage=memoryStorage();
 storage.setItem(PREVIEW_KEY,JSON.stringify(freshState()));
 const record=new StudyRecord(storage,PREVIEW_KEY),state=record.state;
 startCards(state,{size:5,seed:31});
 const term=state.cards.active.deck[0];
 revealCard(state);rateCard(state,true);
 storage.setItem=()=>{throw Error('quota exceeded');};
 assert.equal(record.save(state),false);
 assert.equal(record.refresh(),false);
 assert.equal(record.acceptStorageValue(JSON.stringify(freshState())),false);
 assert.deepEqual(record.state.cards.recalled,[term]);
 assert.equal(record.state.cards.active.index,1);
 assert.equal(record.state,state);
});

test('a clean record accepts external updates and a real storage clear without touching other keys',()=>{
 const storage=memoryStorage();
 storage.setItem(STORAGE_KEY,JSON.stringify(freshState()));
 storage.setItem(PREVIEW_KEY,'independent preview');
 const record=new StudyRecord(storage,STORAGE_KEY),external=freshState();
 completeGame(external,'c13-press',420);
 storage.setItem(STORAGE_KEY,JSON.stringify(external));
 assert.equal(record.refresh(),true);
 assert.equal(record.state.games['c13-press'].score,420);
 startQuiz(external,{size:5,seed:8});
 assert.equal(record.acceptStorageValue(JSON.stringify(external)),true);
 assert.deepEqual(record.state.active.deck,external.active.deck);
 assert.equal(record.dirty,false);
 assert.equal(record.acceptStorageValue(null),true);
 assert.deepEqual(record.state,freshState());
 assert.equal(storage.getItem(PREVIEW_KEY),'independent preview');
});

test('retrying a failed save writes the held answer and makes later refreshes safe again',()=>{
 const storage=memoryStorage(),write=storage.setItem;
 const record=new StudyRecord(storage,STORAGE_KEY),state=record.state;
 startQuiz(state,{mode:'exam',seed:51});
 const {question}=currentQuestion(state);
 answerQuestion(state,question.answer);
 storage.setItem=()=>{throw Error('temporary failure');};
 assert.equal(record.save(state),false);
 assert.equal(record.dirty,true);
 storage.setItem=write;
 assert.equal(record.save(record.state),true);
 assert.equal(record.dirty,false);
 assert.equal(JSON.parse(storage.getItem(STORAGE_KEY)).active.answers[0],question.answer);
 assert.equal(record.refresh(),true);
 assert.equal(currentQuestion(record.state).selected,question.answer);
 storage.setItem(STORAGE_KEY,JSON.stringify(freshState()));
 assert.equal(record.refresh(),true);
 assert.equal(record.state.active,null);
});

test('malformed or failed reads retain the last usable record until a valid update arrives',()=>{
 const storage=memoryStorage(),initial=freshState();
 completeGame(initial,'c13-convention',730);
 storage.setItem(STORAGE_KEY,JSON.stringify(initial));
 const record=new StudyRecord(storage,STORAGE_KEY),good=record.state;
 storage.setItem(STORAGE_KEY,'{broken');
 assert.equal(record.refresh(),false);
 assert.equal(record.state,good);
 assert.equal(record.acceptStorageValue(undefined),false);
 assert.equal(record.acceptStorageValue('not JSON'),false);
 assert.equal(record.state.games['c13-convention'].score,730);
 storage.getItem=()=>{throw Error('access changed');};
 assert.equal(record.refresh(),false);
 assert.equal(record.state,good);
 assert.equal(record.dirty,false);
 assert.equal(record.acceptStorageValue(JSON.stringify(initial)),true);
 assert.equal(record.state.games['c13-convention'].score,730);
});

test('an explicitly unavailable storage provider never needs a global fallback to keep the session usable',()=>{
 const record=new StudyRecord(undefined,STORAGE_KEY);
 assert.deepEqual(record.state,freshState());
 assert.equal(record.refresh(),false);
 startCards(record.state,{size:1,seed:5});
 revealCard(record.state);
 assert.equal(record.save(record.state),false);
 assert.equal(record.dirty,true);
 assert.equal(record.state.cards.active.revealed,true);
});
