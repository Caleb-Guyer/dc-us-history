import {CH9_QUESTIONS,CH9_TERMS,CH9_SECTIONS} from './t911-ch9.mjs?v=7.0.0';
import {QUESTIONS as C10_QUESTIONS,TOPICS as C10_TOPICS} from './c10-questions.mjs?v=6.2.0';
import {TERMS as C10_TERMS} from './c10-terms.mjs?v=6.2.0';
import {CH11_QUESTIONS,CH11_TERMS,CH11_SECTIONS} from './t911-ch11.mjs?v=7.0.0';

export const VERSION='7.0.0';
export const CHAPTERS=[
 {id:9,title:'Industry & a new economy',name:'Industrial Transformation in the North',summary:'Factories, markets, transportation and changing social classes.'},
 {id:10,title:'Jacksonian Democracy',name:'Jacksonian Democracy',summary:'Votes, political parties, tariffs, banks and Native sovereignty.'},
 {id:11,title:'A nation moves west',name:'A Nation on the Move: Westward Expansion',summary:'Exploration, Texas, war with Mexico and the struggle over slavery.'}
];
const sectionMap={politics:'10.1',democracy:'10.2',crisis:'10.3',removal:'10.4',majority:'10.5'};
const c10TermMap=new Map(C10_TERMS.map(t=>[t.questionId,`c10-${t.id}`]));
const ch10Questions=C10_QUESTIONS.map(q=>({id:`t911-${q.id}`,chapter:10,section:sectionMap[q.topic],term:c10TermMap.get(q.id)||null,prompt:q.prompt,choices:[...q.choices],answer:q.answer,why:q.why,source:`Edited chapter 10 · ${sectionMap[q.topic]} · ${(q.source||[]).join(', ')}`}));
const ch10Terms=C10_TERMS.map(t=>({...t,id:`c10-${t.id}`,chapter:10,section:sectionMap[C10_QUESTIONS.find(q=>q.id===t.questionId).topic],questionId:`t911-${t.questionId}`}));
export const SECTIONS=[...CH9_SECTIONS,...C10_TOPICS.map(t=>({id:sectionMap[t.id],chapter:10,title:t.title})),...CH11_SECTIONS];
export const QUESTIONS=[...CH9_QUESTIONS,...ch10Questions,...CH11_QUESTIONS];
export const TERMS=[...CH9_TERMS,...ch10Terms,...CH11_TERMS].map(t=>({...t,section:t.section||QUESTIONS.find(q=>q.id===t.questionId)?.section}));
export const BY_ID=new Map(QUESTIONS.map(q=>[q.id,q]));
export const TERM_BY_ID=new Map(TERMS.map(t=>[t.id,t]));
