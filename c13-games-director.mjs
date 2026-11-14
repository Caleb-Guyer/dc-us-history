// Short physical camera moves, framed for adult-scale people and real props.
const clamp=n=>Math.max(0,Math.min(1,Number.isFinite(n)?n:0));
const mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
const track=(name,position,target,{fov=[43,39],heroPose='listen',otherPose='listen',focus='world',heroPosition=[[0,0,1]],otherPosition=[[3,0,-2]],heroYaw=0,otherYaw=0}={})=>({name,position,target,fov,heroPose,otherPose,focus,heroPosition,otherPosition,heroYaw,otherYaw});
export const CINEMATIC_TRACKS={
 'c13-assembly':{
  opening:[
   track('workshop-arrival',[[6.5,3.3,8],[4.9,2.7,6.5]],[[0,1.3,-1],[0,1.4,-.7]],{fov:[49,44],heroPose:'carry',otherPose:'work',heroPosition:[[0,0,2.5],[0,0,1.6]],heroYaw:Math.PI,otherPosition:[[4,0,-2]],otherYaw:0}),
   track('workshop-promise',[[4.5,1.82,.25],[4.25,1.77,-.1]],[[4,1.52,-2],[4,1.56,-2]],{fov:[39,34],otherPose:'speak',focus:'other',otherPosition:[[4,0,-2]]}),
   track('workshop-handoff',[[-2.1,2.15,2.7],[-1.45,1.95,1.8]],[[0,1.12,-.7],[0,1.18,-.65]],{fov:[45,39],heroPose:'work',otherPose:'work',focus:'bench',heroPosition:[[0,0,0]],otherPosition:[[0,0,-2]],heroYaw:Math.PI})
  ],
  ending:[
   track('workshop-book',[[-1.65,1.95,3.3],[-1.15,1.85,2.8]],[[0,1.43,1],[0,1.46,1]],{fov:[40,34],heroPose:'read',focus:'hero'}),
   track('workshop-pullback',[[1.4,2.4,4.4],[4.8,3.7,8]],[[0,1.4,-.5],[0,1.3,-1]],{fov:[43,49],heroPose:'listen',otherPose:'work',otherPosition:[[4,0,-2]]})
  ]
 },
 'c13-press':{
  opening:[
   track('press-impression',[[3.2,2.15,.1],[2.6,1.95,-.5]],[[.3,1.27,-2.7],[.3,1.3,-2.7]],{fov:[43,37],heroPose:'work',otherPose:'speak',focus:'press',heroPosition:[[1.4,0,-1.9]],otherPosition:[[-1.3,0,-3.8]],heroYaw:Math.PI,otherYaw:.3}),
   track('press-courier',[[-1.05,1.8,2.9],[-.7,1.76,2.55]],[[0,1.5,1],[0,1.54,1]],{fov:[38,33],heroPose:'carry',otherPose:'listen',focus:'hero',otherPosition:[[3,0,-2.2]]}),
   track('press-departure',[[2.9,2.2,4.3],[2,2,.8]],[[0,1.45,.6],[0,1.45,-2.4]],{fov:[46,42],heroPose:'run',otherPose:'point',heroPosition:[[0,0,.6],[0,0,-2.4]],heroYaw:Math.PI,otherPosition:[[3,0,-2.3]]})
  ],
  ending:[
   track('press-handoff',[[2.3,1.96,3.6],[1.8,1.88,2.9]],[[.4,1.3,.2],[.4,1.35,.2]],{fov:[40,35],heroPose:'carry',otherPose:'read',focus:'paper',heroPosition:[[-.45,0,.7]],otherPosition:[[.65,0,-.1]],heroYaw:.8,otherYaw:-.6}),
   track('press-aftermath',[[3.6,2.9,6.5],[6.8,4.5,11]],[[0,1.45,-2.5],[0,1.45,-4]],{fov:[44,51],heroPose:'listen',otherPose:'carry',heroPosition:[[0,0,1]],otherPosition:[[2.4,0,-1.5]]})
  ]
 },
 'c13-convention':{
  opening:[
   track('hall-arrival',[[0,3.9,10],[1,3.1,7.5]],[[0,1.45,-4],[0,1.45,-3]],{fov:[49,44],heroPose:'run',otherPose:'prepare',heroPosition:[[0,0,1.5],[0,0,-1]],heroYaw:Math.PI,otherPosition:[[3,0,-4]]}),
   track('hall-voice',[[-1.15,1.8,2.05],[-.8,1.76,1.8]],[[0,1.5,0],[0,1.54,0]],{fov:[39,34],heroPose:'listen',otherPose:'speak',focus:'other',heroPosition:[[-1.8,0,-.5]],otherPosition:[[0,0,0]]}),
   track('hall-pages',[[1.8,2.15,-3.4],[1.2,1.94,-3.75]],[[0,1.04,-6],[0,1.05,-6]],{fov:[43,38],heroPose:'prepare',otherPose:'carry',focus:'declaration',heroPosition:[[-1,0,-5]],otherPosition:[[3,0,-4]],heroYaw:Math.PI})
  ],
  ending:[
   track('hall-declaration',[[-1.65,2.1,-3.4],[-1.05,1.98,-3.8]],[[0,1.08,-6],[0,1.09,-6]],{fov:[43,37],heroPose:'read',otherPose:'listen',focus:'declaration',heroPosition:[[-1,0,-5]],otherPosition:[[3,0,-4]],heroYaw:Math.PI}),
   track('hall-open-floor',[[0,3.9,8.5],[0,4.7,12]],[[0,1.45,-4],[0,1.45,-3]],{fov:[45,51],heroPose:'speak',otherPose:'listen',heroPosition:[[0,0,-3]],otherPosition:[[3,0,-4]]})
  ]
 }
};
const sample=(points,t)=>points.length===1?[...points[0]]:mix(points[0],points[1],t);
export function directorShot(game,{phase='opening',beatIndex=0,progress=0,portrait=false}={}){
 const id=typeof game==='string'?game:game?.id,list=CINEMATIC_TRACKS[id]?.[phase]||CINEMATIC_TRACKS['c13-assembly'].opening;
 const shot=list[Math.max(0,Math.min(list.length-1,Number.isInteger(beatIndex)?beatIndex:0))];
 const linear=clamp((clamp(progress)-.08)/.8),t=linear*linear*(3-2*linear),position=sample(shot.position,t),target=sample(shot.target,t);
 if(portrait){const factor=shot.focus==='world'?1.14:1.23;for(let i=0;i<3;i++)position[i]=target[i]+(position[i]-target[i])*factor;}
 const focusDistance=Math.hypot(...position.map((v,i)=>v-target[i]));
 return {name:shot.name,position,target,focusDistance,fov:shot.fov[0]+(shot.fov[1]-shot.fov[0])*t+(portrait?5:0),heroPose:shot.heroPose,otherPose:shot.otherPose,focus:shot.focus,heroPosition:sample(shot.heroPosition,t),otherPosition:sample(shot.otherPosition,t),heroYaw:shot.heroYaw,otherYaw:shot.otherYaw};
}
