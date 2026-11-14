import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from './three.module.js';
import {createPerson,animatePerson,sculptedHeadGeometry,fittedHeadCover,PERSON_PROPORTIONS} from './c13-people.mjs';

function world(){const scene=new T.Scene();return {cast:scene,actors:[],geometries:new Map(),materials:new Map(),textures:[],contact(x,z,w,d,parent){const g=new T.Group();parent.add(g);return g;}};}
function finiteGeometry(g){for(const name of ['position','normal'])assert([...g.attributes[name].array].every(Number.isFinite),name+' must stay finite');}

test('the embedded sculpt is head-and-neck geometry with finite normals and a realistic face scale',()=>{const g=sculptedHeadGeometry();assert.equal(g.attributes.position.count,4328);assert.equal(g.index.count/3,8608);finiteGeometry(g);const b=g.boundingBox;assert(b.max.x-b.min.x>.17&&b.max.x-b.min.x<.20);assert(b.max.y-b.min.y>.27&&b.max.y-b.min.y<.31);assert(b.min.y>-.17&&b.max.y<.15);assert.equal(g.morphAttributes.position.length,1);assert(g.index.array.every(i=>i<g.attributes.position.count));});

test('clothed figures have adult proportions, connected joints and no invalid garment vertices',()=>{for(const dress of [false,true]){const w=world(),a=createPerson(w,0,0,{dress,hero:true,bonnet:dress},w.cast);assert.equal(w.actors[0],a);assert.equal(a.userData.elbows.length,2);assert.equal(a.userData.knees.length,2);assert.equal(a.userData.hands[0].userData.fingers.length,4);a.updateMatrixWorld(true);const b=new T.Box3().setFromObject(a);assert(b.max.y>1.77&&b.max.y<1.85);assert(b.min.y>-.02);assert(b.max.x-b.min.x<.75);assert(PERSON_PROPORTIONS.height/PERSON_PROPORTIONS.headHeight>7);a.traverse(o=>{if(o.isMesh)finiteGeometry(o.geometry);});}});

test('walk, vault, work and speech move anatomical joints while retaining finite transforms',()=>{const w=world(),a=createPerson(w,0,0,{dress:true,hero:true},w.cast);animatePerson(a,1,{moving:true,sprint:true});assert.notEqual(a.userData.knees[0].rotation.x,a.userData.knees[1].rotation.x);animatePerson(a,2,{jump:1.2,moving:true});assert(a.userData.root.position.y>=1.2);assert(a.userData.knees.every(k=>k.rotation.x>1));animatePerson(a,3,{carry:true});assert(a.userData.carry.visible);assert(a.userData.elbows.every(k=>k.rotation.x<-.9));animatePerson(a,4,{work:true,speaking:true});assert(!a.userData.carry.visible);assert(a.userData.headSurface.morphTargetInfluences[0]>=0);a.traverse(o=>assert([...o.position.toArray(),...o.rotation.toArray().slice(0,3)].every(Number.isFinite)));});

test('adult face variants preserve scale and put restrained color on the sculpted lips and lids',()=>{
 const heads=[0,1,2,3].map(sculptedHeadGeometry),base=heads[0].attributes.position;
 for(const g of heads){finiteGeometry(g);const p=g.attributes.position,c=g.attributes.color;assert.equal(c.count,p.count);assert([...c.array].every(v=>Number.isFinite(v)&&v>.74&&v<1.04));assert(g.boundingBox.max.x-g.boundingBox.min.x>.17);assert(g.boundingBox.max.x-g.boundingBox.min.x<.21);let lips=0,forehead=0,nl=0,nf=0;for(let i=0;i<p.count;i++){if(Math.abs(p.getX(i))<.025&&p.getZ(i)>.07){if(p.getY(i)>-.066&&p.getY(i)<-.050){lips+=c.getX(i)/c.getY(i);nl++;}if(p.getY(i)>.045&&p.getY(i)<.075){forehead+=c.getX(i)/c.getY(i);nf++;}}}assert(nl>4&&nf>2);assert(lips/nl>forehead/nf+.055);}
 assert(heads[1].attributes.position.array.some((v,i)=>Math.abs(v-base.array[i])>.002));
 for(const bonnet of [false,true])for(let variant=0;variant<4;variant++){const cover=fittedHeadCover(bonnet,variant);finiteGeometry(cover);assert(cover.attributes.position.count>1000&&cover.attributes.position.count<20000);assert(cover.boundingBox.max.y>heads[variant].boundingBox.max.y);const p=cover.attributes.position;for(let i=0;i<p.count;i++)if(p.getZ(i)>.07&&Math.abs(p.getX(i))<.06)assert(p.getY(i)>.035,'hairline must remain above the eye sockets');}
});

test('running carry supports the packet at the palms while the free shoulder counters the stride',()=>{
 const w=world(),a=createPerson(w,0,0,{hero:true}),u=a.userData;
 animatePerson(a,1,{moving:true,carry:true});a.updateMatrixWorld(true);const packet=u.carry.getWorldPosition(new T.Vector3());for(const h of u.hands){const palm=h.userData.palm.getWorldPosition(new T.Vector3());assert(Math.abs(palm.y-packet.y)<.075);assert(Math.abs(palm.z-packet.z)<.18);}
 const left=u.arms[0].rotation.x,right=u.arms[1].rotation.x;animatePerson(a,1.25,{moving:true,carry:true});assert.equal(u.arms[0].rotation.x,left);assert(Math.abs(u.arms[1].rotation.x-right)>.01);animatePerson(a,3,{work:true});assert.notEqual(u.elbows[0].rotation.x,u.elbows[1].rotation.x);
});
