import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from './three.module.js';
import {createPerson,animatePerson,sculptedHeadGeometry,fittedHeadCover,anatomicalClothingGeometry,anatomicalHandGeometry,shortNecklineGeometry,PERSON_PROPORTIONS} from './c13-people.mjs';

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

test('the clothed shoulders and hand webs are single connected surfaces with normalized bone weights',()=>{
 for(const geometry of [anatomicalClothingGeometry(),anatomicalHandGeometry(-1),anatomicalHandGeometry(1)]){
  finiteGeometry(geometry);const count=geometry.attributes.position.count,edges=Array.from({length:count},()=>[]),indices=geometry.index,weights=geometry.attributes.skinWeight;
  for(let i=0;i<indices.count;i+=3){const a=indices.getX(i),b=indices.getX(i+1),c=indices.getX(i+2);edges[a].push(b,c);edges[b].push(a,c);edges[c].push(a,b);}
  const seen=new Set([0]),queue=[0];for(let j=0;j<queue.length;j++)for(const adjacent of edges[queue[j]])if(!seen.has(adjacent)){seen.add(adjacent);queue.push(adjacent);}assert.equal(seen.size,count,'sleeves, shoulder or finger webs must not be disconnected mesh islands');
  for(let i=0;i<count;i++){const w=[weights.getX(i),weights.getY(i),weights.getZ(i),weights.getW(i)];assert(w.every(v=>v>=0&&v<=1));assert(Math.abs(w.reduce((a,b)=>a+b)-1)<1e-6);}
 }
});

test('working and carrying deform the continuous sleeves without tearing or displacing the hand skins',()=>{
 const w=world(),a=createPerson(w,2,3,{hero:true,dress:true}),u=a.userData;
 assert(u.clothingShell.isSkinnedMesh&&u.clothingShell.userData.noInstance);assert(u.arms.every(b=>b.isBone));
 for(const pose of [{},{carry:true},{work:true},{moving:true,sprint:true},{jump:1.1,moving:true}]){
  animatePerson(a,1.7,pose);a.updateMatrixWorld(true);
  for(const m of [u.clothingShell,...u.hands.map(h=>h.userData.skin)]){assert(m.isSkinnedMesh&&m.userData.noInstance);const g=m.geometry,p=g.attributes.position,vertices=Array.from({length:p.count},(_,i)=>m.applyBoneTransform(i,new T.Vector3().fromBufferAttribute(p,i)));assert(vertices.every(v=>v.toArray().every(Number.isFinite)));for(let i=0;i<g.index.count;i+=3)for(let j=0;j<3;j++)assert(vertices[g.index.getX(i+j)].distanceTo(vertices[g.index.getX(i+(j+1)%3)])<(m===u.clothingShell?.080:.040),'connected surface must not stretch into a detached sleeve or finger');}
 }
});

test('every apron sample stays above the actual skirt fold surface and moves with the skirt',()=>{
 for(const hero of [false,true]){const w=world(),a=createPerson(w,0,0,{hero,dress:true}),u=a.userData,skirt=u.skirt.children.find(o=>o.isMesh).geometry,apron=u.apron.children.find(o=>o.userData.fittedApron).geometry,p=apron.attributes.position,s=skirt.attributes.position,n=skirt.attributes.normal;finiteGeometry(apron);assert.equal(u.apron.parent,u.skirt);for(let i=0;i<p.count;i++){const point=new T.Vector3().fromBufferAttribute(p,i);let distance=Infinity,index=0;for(let j=0;j<s.count;j++){const d=point.distanceToSquared(new T.Vector3().fromBufferAttribute(s,j));if(d<distance){distance=d;index=j;}}assert(distance>.004**2&&distance<.006**2,'apron must stay five millimetres above its dress instead of crossing into it');const delta=point.sub(new T.Vector3().fromBufferAttribute(s,index));assert(delta.dot(new T.Vector3().fromBufferAttribute(n,index))>.0039);}}
 const shirt=shortNecklineGeometry();finiteGeometry(shirt);assert(shirt.attributes.position.count>0);const b=shirt.boundingBox;assert(b.max.y-b.min.y<.10);assert(b.min.y>.22);assert(b.max.x-b.min.x<.06,'shirt must remain a short neckline, without a long chest diamond');
});

test('paper rests above the deformed palm skins in idle, reading and running carries',()=>{
 const w=world(),a=createPerson(w,0,0,{hero:true}),u=a.userData;
 for(const pose of [{carry:true},{read:true},{carry:true,moving:true}])for(const t of [0,.4,.9,1.7,2.4,3.3]){animatePerson(a,t,pose);a.updateMatrixWorld(true);let checked=0;for(const h of u.hands){const m=h.userData.skin,p=m.geometry.attributes.position;for(let i=0;i<p.count;i++)if(p.getY(i)<-.025&&p.getY(i)>-.09&&Math.abs(p.getX(i))<.035){const point=new T.Vector3().fromBufferAttribute(p,i);m.applyBoneTransform(i,point);m.localToWorld(point);u.carry.worldToLocal(point);if(Math.abs(point.x)<.2025&&Math.abs(point.z)<.14){assert(point.y<-.006,'paper sheets must not pass through the palm and resemble pale bands');checked++;}}}assert(checked>20);}
});
