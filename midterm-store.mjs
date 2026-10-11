import {clean,fresh,creditGame} from './midterm-state.mjs';
export const PREVIEW=new URLSearchParams(location.search).get('preview')==='1';
export const KEY=PREVIEW?'dc-midterm-preview-v1':'dc-midterm-v1';
export let saved=true;
export function read(){try{return clean(JSON.parse(localStorage.getItem(KEY)||'null'));}catch{saved=false;return fresh();}}
export function write(s){try{localStorage.setItem(KEY,JSON.stringify(s));saved=true;}catch{saved=false;}return s;}
export function gameCredit(chapter){return write(creditGame(read(),chapter));}
export function gameLink(chapter){return `chapter${chapter}.html${location.search}`;}
export function homeLink(){return `index.html${location.search}`;}
