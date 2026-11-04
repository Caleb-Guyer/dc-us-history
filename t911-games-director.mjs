// Authored camera blocking for the six short 3D campaigns. World units are metres.
// Historical speech remains representative fiction; the camera never changes outcomes.
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const ease=t=>t*t*(3-2*t);
const mix=(a,b,t)=>a.map((x,i)=>x+(b[i]-x)*t);
const track=(name,position,target,fov=[48,45],extra={})=>({name,position,target,fov,stage:'normal',heroPose:'listen',...extra});
const table=(name,a=[-7,12,7],b=[1,10,4],target=[[0,1.4,-5],[0,1.4,-5]],extra={})=>track(name,[a,b],target,[43,39],{stage:'map',...extra});

export const CINEMATIC_TRACKS={
 'c9-factory':{
  opening:[
   track('The mill wakes',[[-10,7,15],[-4,5.3,11],[4,4.4,8]],[[0,2,-7],[0,2,-5]],[53,47],{heroPose:'work'}),
   track('One worker, one task',[[-2.9,2.5,4.5],[-1.5,2.1,3.4]],[[0,1.5,0],[0,1.55,-.1]],[43,36],{heroPose:'work'}),
   track('The overseer’s pace',[[6.7,2.7,3.1],[5.2,2.3,1.4],[4.2,2.1,.7]],[[3,1.5,-2],[2.8,1.4,-2.3]],[44,38],{heroPose:'work',otherPose:'point'})
  ],
  ending:[
   track('The work remains',[[-2.5,2.1,3.5],[-.8,2,3]],[[0,1.5,0],[0,1.5,-.1]],[39,34],{heroPose:'listen'}),
   table('The industrial ledger',[-5.3,10,4],[2.5,8.2,2],[[0,1.4,-5],[0,1.4,-5]])
  ]
 },
 'c9-canal':{
  opening:[
   table('The inland connection',[-7,12,8],[3,9.8,3]),
   track('A boat in the market',[[-3.1,3.8,5.8],[-1.8,3.3,4.7]],[[0,1.2,0],[0,1.4,-.3]],[45,37],{heroPose:'carry'}),
   track('The towpath',[[13.2,4.4,5],[11.5,3.4,1.3],[10.9,2.8,-.5]],[[9,1.2,-3],[8.3,1.2,-3.4]],[48,42],{heroPose:'carry',otherPose:'point'})
  ],
  ending:[
   track('The shipment arrives',[[3,3.7,5],[1.6,3.2,4.6]],[[0,1.2,0],[0,1.4,-.4]],[43,37],{heroPose:'carry'}),
   table('A growing network',[6,12,7],[-2,9.6,3])
  ]
 },
 'c9-courier':{
  opening:[
   track('The turnout',[[10,6.5,14],[5.5,4.3,10],[1.3,3.5,8]],[[0,1.2,-7],[0,1.5,-4]],[54,47],{heroPose:'carry'}),
   track('A worker’s claim',[[-2.6,2.4,4.1],[-1.2,2.1,3.2]],[[0,1.5,0],[0,1.55,0]],[42,35],{heroPose:'carry'}),
   track('Copies into the street',[[5.9,2.8,3.4],[4.8,2.2,1.7]],[[3,1.5,-2],[2.7,1.4,-2.2]],[45,39],{heroPose:'run',otherPose:'carry'})
  ],
  ending:[
   track('The meeting continues',[[-2.8,2.2,3.8],[-1,2.2,3.5]],[[0,1.5,0],[0,1.5,-.1]],[40,35],{heroPose:'carry'}),
   track('The unequal city',[[3.5,4,9],[8,7,14],[11,8.8,18]],[[0,1.5,-4],[0,2.1,-8]],[46,54],{heroPose:'listen'})
  ]
 },
 'c11-river':{
  opening:[
   table('The route Jefferson sought',[-8,13,7],[2,10.7,3]),
   track('Knowledge already here',[[-3.3,3.8,5.5],[-1.7,3.1,4.2]],[[0,1.2,0],[0,1.4,-.5]],[43,36],{heroPose:'carry'}),
   track('Toward the crossing',[[9.5,6.5,10],[4,4.4,7],[-1.7,3.5,5.8]],[[0,1,-8],[0,1,-5]],[52,45],{heroPose:'row'})
  ],
  ending:[
   table('The broken water route',[-6,12,6],[1.8,9.6,2.5]),
   table('A temporary political line',[6.5,12,7],[-3,10,3])
  ]
 },
 'c11-dispatch':{
  opening:[
   track('The Alamo falls',[[10,6,9],[4,4.6,5],[-1,3.8,3.8]],[[0,3,-12],[0,2.7,-12]],[52,45],{stage:'alamo',heroPose:'listen'}),
   track('San Jacinto’s approach',[[10,4.7,11],[5.2,3.4,7],[2.2,2.5,5]],[[3,1.2,-2],[1.5,1.1,-4]],[54,45],{heroPose:'run',otherPose:'point'}),
   track('The runner’s report',[[-2.8,2.4,4],[-1.3,2.1,3.2]],[[0,1.5,0],[0,1.5,-.2]],[41,35],{heroPose:'carry'})
  ],
  ending:[
   track('The captured commander',[[9,5.5,11],[4.7,4.5,8],[1.5,3.4,6.5]],[[0,1.3,-4],[2,1.4,-2]],[51,44],{heroPose:'carry',otherPose:'listen'}),
   table('Independence before annexation',[-6.5,12,7],[2,10,3])
  ]
 },
 'c11-press':{
  opening:[
   table('The treaty’s new border',[-7,12,7],[1.5,9.5,3]),
   track('Gold and its consequences',[[11,6.5,13],[6,4.8,9],[1.2,3.8,7]],[[0,1.2,-6],[0,1.3,-3]],[52,46],{stage:'goldrush',heroPose:'carry'}),
   track('The capital goes to print',[[8,4.2,10],[3.8,3.1,6],[.9,2.5,4.6]],[[0,1.2,-2],[0,1.4,-.5]],[49,41],{heroPose:'run'})
  ],
  ending:[
   track('Read the actual terms',[[-2.8,2.4,4.2],[-1.1,2.1,3.3]],[[0,1.5,0],[0,1.5,-.2]],[42,35],{heroPose:'carry'}),
   track('A law that follows freedom',[[2,3.8,8],[6,6,12],[9,8,17]],[[0,1.6,-5],[0,2.1,-11]],[45,53],{heroPose:'listen'})
  ]
 }
};

// A quadratic Bezier retains hand-blocked middle camera positions without
// overshooting into walls or the floor as a free spline can do.
function sample(points,t){
 if(points.length===1)return [...points[0]];
 if(points.length===2)return mix(points[0],points[1],t);
 const a=mix(points[0],points[1],t),b=mix(points[1],points[2],t);
 return mix(a,b,t);
}
export function directorShot(mission,{beatIndex=0,phase='opening',progress=0}={}){
 const id=typeof mission==='string'?mission:mission?.id;
 const shots=CINEMATIC_TRACKS[id]?.[phase]||CINEMATIC_TRACKS['c9-factory'].opening;
 const shot=shots[clamp(Number.isInteger(beatIndex)?beatIndex:0,0,shots.length-1)];
 const t=ease(clamp(Number.isFinite(progress)?progress:0,0,1));
 const mapKind=shot.stage!=='map'?null:id==='c9-factory'?'industrial':id==='c9-canal'?'transport':id==='c11-river'?(phase==='ending'&&beatIndex===1?'missouri':'expedition'):id==='c11-dispatch'?'texas':'cession';
 return {name:shot.name,position:sample(shot.position,t),target:sample(shot.target,t),fov:shot.fov[0]+(shot.fov[1]-shot.fov[0])*t,stage:shot.stage,mapKind,heroPose:shot.heroPose,otherPose:shot.otherPose||'listen'};
}
export function sceneDuration(mission,phase='opening'){
 const list=mission?.[phase];return Array.isArray(list)?list.reduce((n,b)=>n+(Number.isFinite(b.duration)?Math.max(0,b.duration):0),0):0;
}
