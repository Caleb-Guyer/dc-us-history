// Authored, bounded camera moves. Actors and spoken lines are representative fiction.
// A lower camera target keeps faces and physical actions above the subtitle area.
const clamp=n=>Math.max(0,Math.min(1,Number.isFinite(n)?n:0));
const mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
const track=(name,position,target,{fov=[48,44],heroPose='listen',otherPose='listen',focus='world',heroPosition=[[0,0,1]],otherPosition=[[3,0,-2]]}={})=>({name,position,target,fov,heroPose,otherPose,focus,heroPosition,otherPosition});
export const CINEMATIC_TRACKS={
 'c13-assembly':{
  opening:[
   track('workshop-arrival',[[7,4.3,11],[5,3.5,9]],[[0,1.4,-1],[0,1.25,-.5]],{fov:[53,47],heroPose:'carry',otherPose:'work'}),
   track('workshop-promise',[[4.5,2.25,2.8],[4.2,2.05,2]],[[3,1.1,-2],[3,1.1,-2]],{fov:[43,39],otherPose:'speak',focus:'other'}),
   track('workshop-handoff',[[-3.3,2.5,4.2],[-1.5,2.1,3.5]],[[0,1.1,-.7],[0,1.05,-1]],{fov:[47,42],heroPose:'work',otherPose:'point',focus:'bench'})
  ],
  ending:[
   track('workshop-book',[[-2.2,1.95,4.7],[-1.3,1.85,4.2]],[[0,1.05,1],[0,1.05,1]],{fov:[42,36],heroPose:'read',focus:'hero'}),
   track('workshop-pullback',[[1.3,2.5,5],[4.5,4.5,10]],[[0,1.1,-.3],[0,1.3,-1]],{fov:[45,53],heroPose:'listen',otherPose:'work'})
  ]
 },
 'c13-press':{
  opening:[
   track('press-impression',[[3.4,2.7,2.7],[1.7,2.05,.9]],[[0,1.05,-3],[0,1.05,-3]],{fov:[48,42],heroPose:'work',otherPose:'carry',focus:'press',heroPosition:[[0,0,-.1]],otherPosition:[[2.2,0,-2.4]]}),
   track('press-courier',[[-2.5,2.1,4.5],[-1.6,1.85,3.8]],[[0,1.05,1],[0,1.05,1]],{fov:[43,36],heroPose:'carry',otherPose:'listen',focus:'hero'}),
   track('press-departure',[[5,3,9],[2,2.5,6]],[[0,1.1,-1],[0,1.1,-2]],{fov:[51,45],heroPose:'run',otherPose:'point',heroPosition:[[0,0,1],[0,0,-1.8]]})
  ],
  ending:[
   track('press-handoff',[[3,2.1,4],[2.3,1.95,3.4]],[[1,1.05,0],[1,1.05,0]],{fov:[46,40],heroPose:'carry',otherPose:'read',focus:'paper',otherPosition:[[2,0,-.5]]}),
   track('press-aftermath',[[4,3.7,9],[7,5,13]],[[0,1.3,-3],[0,1.4,-5]],{fov:[46,54],heroPose:'listen',otherPose:'carry'})
  ]
 },
 'c13-convention':{
  opening:[
   track('hall-arrival',[[0,4.8,12],[1.2,4.2,10]],[[0,1.8,-5],[0,1.6,-4]],{fov:[53,47],heroPose:'carry',otherPose:'prepare',heroPosition:[[0,0,-3]],otherPosition:[[3,0,-4]]}),
   track('hall-voice',[[-2.2,2.2,3.3],[-1.4,2.05,2.6]],[[0,1.05,0],[0,1.05,0]],{fov:[44,38],heroPose:'speak',otherPose:'listen',focus:'hero',heroPosition:[[0,0,0]]}),
   track('hall-pages',[[2.2,3.4,-2],[1.2,2.7,-2.6]],[[0,1,-6],[0,.95,-6]],{fov:[47,41],heroPose:'prepare',otherPose:'carry',focus:'declaration',heroPosition:[[-1,0,-4]],otherPosition:[[3,0,-4]]})
  ],
  ending:[
   track('hall-declaration',[[-2.2,2.7,-2],[-1.2,2.5,-2.7]],[[0,1.05,-6],[0,1,-6]],{fov:[47,40],heroPose:'read',otherPose:'listen',focus:'declaration',heroPosition:[[0,0,-4]],otherPosition:[[3,0,-4]]}),
   track('hall-open-floor',[[0,5.2,12],[0,5.7,14]],[[0,1.5,-4],[0,1.5,-3]],{fov:[48,55],heroPose:'speak',otherPose:'listen',heroPosition:[[0,0,-3]],otherPosition:[[3,0,-4]]})
  ]
 }
};
const sample=(points,t)=>points.length===1?[...points[0]]:mix(points[0],points[1],t);
export function directorShot(game,{phase='opening',beatIndex=0,progress=0,portrait=false}={}){
 const id=typeof game==='string'?game:game?.id;
 const list=CINEMATIC_TRACKS[id]?.[phase]||CINEMATIC_TRACKS['c13-assembly'].opening;
 const shot=list[Math.max(0,Math.min(list.length-1,Number.isInteger(beatIndex)?beatIndex:0))];
 const linear=clamp(progress),t=linear*linear*(3-2*linear);
 const position=sample(shot.position,t),target=sample(shot.target,t);
 // Pull back along the look direction rather than moving toward a side wall.
 if(portrait){const factor=shot.focus==='world'?1.2:1.34;for(let i=0;i<3;i++)position[i]=target[i]+(position[i]-target[i])*factor;}
 return {name:shot.name,position,target,fov:shot.fov[0]+(shot.fov[1]-shot.fov[0])*t+(portrait?5:0),heroPose:shot.heroPose,otherPose:shot.otherPose,focus:shot.focus,heroPosition:sample(shot.heroPosition,t),otherPosition:sample(shot.otherPosition,t)};
}
