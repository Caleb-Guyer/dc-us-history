// Authored blocking and editorial coverage. Coordinates are local to each set.
export const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
export const mix=(a,b,t)=>a+(b-a)*t;
const actor=(x,z,pose='listen',yaw=Math.PI)=>({x,z,pose,yaw});
const shot=(kind,subject,listener,side=1)=>({kind,subject,listener,side});
const S=shot;
const cast={
 forest:{ROWAN:actor(-.95,.3,'walk',2.6),WARD:actor(1.1,-.4,'walk',3.55)},
 print:{ROWAN:actor(-.7,.4,'paper',2.5),THOMAS:actor(1.25,.1,'listen',3.6),ISAIAH:actor(-2.25,-.85,'paper',2.8)},
 workshop:{MARA:actor(-.8,.1,'work',2.45),ROWAN:actor(1.15,.75,'listen',3.65),ISAIAH:actor(2.9,-1.1,'paper',3.55)},
 snow:{ROWAN:actor(-1.65,.65,'listen',2.55),MARA:actor(.15,.35,'listen',3.15),ISAIAH:actor(1.85,-1.2,'point',3.8)},
 ship:{ROWAN:actor(-1.15,.25,'listen',2.55),ISAIAH:actor(1.2,-.55,'point',3.65),THOMAS:actor(1.9,1.9,'listen',3.9)},
 harbor:{ROWAN:actor(-.55,1,'row',Math.PI),ISAIAH:actor(.4,-1.25,'row',Math.PI),MARA:actor(1.05,.1,'paper',3.45)},
 fire:{ROWAN:actor(-.8,.6,'reach',2.55),WARD:actor(1.2,.15,'give',3.65),MARA:actor(-2.35,-.65,'paper',2.7),THOMAS:actor(3.8,-3.1,'point',3.7)},
 dawn:{ISAIAH:actor(-1.7,.2,'read',2.65),MARA:actor(.7,-.1,'listen',3.3),ROWAN:actor(-.3,1.15,'paper',2.9),THOMAS:actor(3,-1.9,'read',3.8)}
};
const scene=(mission,theme,title,frames,extra={})=>({mission,theme,title,cast:cast[theme],frames,...extra});
export const CINEMATICS={
 prologue:scene(6,'fire','Before the last light',[
  [S('detail','dispatch'),S('wide','ROWAN')],
  [S('over','MARA','ROWAN',-1),S('close','MARA')],
  [S('close','ROWAN'),S('depart','ROWAN')]
 ],{poses:{ROWAN:'paper',MARA:'reach',WARD:'brace'},mood:'tense'}),
 'line.in':scene(0,'forest','A line through the pines',[
  [S('track','WARD'),S('two','WARD','ROWAN')],
  [S('over','ROWAN','WARD'),S('close','ROWAN')],
  [S('close','WARD'),S('detail','boundary')]
 ]),
 'line.out':scene(0,'forest','What is inside',[
  [S('detail','bag'),S('over','WARD','ROWAN',-1)],
  [S('close','ROWAN'),S('depart','ROWAN')]
 ],{poses:{ROWAN:'give',WARD:'listen'}}),
 'ink.in':scene(1,'print','Ink under pressure',[
  [S('detail','press'),S('over','THOMAS','ROWAN')],
  [S('close','ISAIAH'),S('detail','notice')],
  [S('over','ROWAN','THOMAS',-1),S('wide','ROWAN')]
 ],{mood:'tense'}),
 'ink.out':scene(1,'print','Our name on the page',[
  [S('over','THOMAS','ROWAN'),S('close','THOMAS')],
  [S('over','ROWAN','THOMAS',-1),S('close','ROWAN')]
 ],{poses:{ROWAN:'give',THOMAS:'read'},mood:'tense'}),
 'homespun.in':scene(2,'workshop','A different kind of resistance',[
  [S('detail','loom'),S('two','MARA','ROWAN')],
  [S('over','ROWAN','MARA',-1)],
  [S('close','MARA'),S('detail','cloth')]
 ]),
 'homespun.out':scene(2,'workshop','Made by our own hands',[
  [S('two','MARA','ROWAN'),S('detail','cloth')],
  [S('close','ISAIAH'),S('close','ROWAN')]
 ],{poses:{MARA:'give',ROWAN:'paper',ISAIAH:'listen'}}),
 'kingstreet.in':scene(3,'snow','Five names in the snow',[
  [S('wide','ISAIAH'),S('close','ISAIAH')],
  [S('impact','ISAIAH')],
  [S('rescue','ISAIAH','MARA')],
  [S('wounded','ISAIAH')],
  [S('rescue','ISAIAH','MARA'),S('rescue','ISAIAH','ROWAN',-1)]
 ],{mood:'tense'}),
 'kingstreet.out':scene(3,'snow','Tell the truth',[
  [S('rescue','ISAIAH','ROWAN',-1)],
  [S('wounded','ISAIAH')],
  [S('recovery','ISAIAH')]
 ],{mood:'sad'}),
 'tea.in':scene(4,'ship','Only the tea',[
  [S('wide','ISAIAH'),S('close','ISAIAH')],
  [S('detail','tea'),S('close','ROWAN')],
  [S('over','ISAIAH','ROWAN'),S('detail','lantern')]
 ],{hide:['THOMAS']}),
 'tea.out':scene(4,'ship','On different sides',[
  [S('two','ROWAN','THOMAS'),S('close','ROWAN')],
  [S('over','THOMAS','ROWAN'),S('close','THOMAS')]
 ],{poses:{ROWAN:'listen',ISAIAH:'work'},mood:'sad'}),
 'harbor.in':scene(5,'harbor','A city without a harbor',[
  [S('wide','MARA'),S('close','MARA')],
  [S('low','ISAIAH'),S('detail','blockade')],
  [S('close','ROWAN'),S('depart','ROWAN')]
 ]),
 'harbor.out':scene(5,'harbor','An order in the dark',[
  [S('detail','dispatch'),S('close','ISAIAH')],
  [S('close','MARA'),S('wide','ROWAN')]
 ],{poses:{ISAIAH:'give',MARA:'read',ROWAN:'row'},mood:'tense'}),
 'dispatch.in':scene(6,'fire','The last dispatch',[
  [S('detail','dispatch'),S('over','WARD','ROWAN')],
  [S('close','MARA'),S('two','MARA','ROWAN')],
  [S('close','THOMAS'),S('depart','ROWAN')]
 ],{mood:'tense'}),
 'dispatch.out':scene(6,'fire','What the press was for',[
  [S('over','THOMAS','ROWAN'),S('close','THOMAS')],
  [S('close','MARA'),S('two','MARA','ROWAN')]
 ],{poses:{ROWAN:'paper',MARA:'listen',THOMAS:'listen'},hide:['WARD'],mood:'sad'}),
 epilogue:scene(6,'dawn','The road ahead',[
  [S('detail','dispatch'),S('close','ISAIAH')],
  [S('two','MARA','ROWAN'),S('close','MARA')],
  [S('close','THOMAS'),S('detail','notice')],
  [S('close','ROWAN'),S('depart','ROWAN')]
 ])
};

export function sceneKey(id='prologue.0'){
 if(id.startsWith('prologue'))return 'prologue';if(id.startsWith('epilogue'))return 'epilogue';
 const match=id.match(/^([a-z]+)\.(in|out)/);return match?match[1]+'.'+match[2]:id.split('.')[0]+'.out';
}
export function editorialShot(key,beat,elapsed,duration=5){
 const scene=CINEMATICS[key]||CINEMATICS.prologue,frames=scene.frames[Math.min(beat,scene.frames.length-1)];
 const cut=duration>4.5&&frames.length>1?Math.max(2.1,duration*.48):Infinity;
 const part=elapsed>=cut?1:0,start=part?cut:0,end=part?duration:Math.min(cut,duration),p=smooth((elapsed-start)/Math.max(1,end-start));
 return {...frames[part],part,progress:p};
}
export function blocking(key,person,time,beat=0,lineTime=0){
 const scene=CINEMATICS[key]||CINEMATICS.prologue,a=scene.cast[person];if(!a||scene.hide?.includes(person))return null;
 let {x,z,yaw}=a,pose=scene.poses?.[person]||a.pose,y=0,progress=0,injury=false,bandaged=false;
 yaw=Math.PI+(x<0?.43:-.43);
 if(scene.theme==='forest'&&key.endsWith('.in')){const p=smooth(time/5);z+=3*(1-p);if(time>5)pose=person==='WARD'&&beat===2?'point':'listen';}
 if(scene.theme==='harbor'){y=.22+Math.sin(time*.9)*.042;z+=Math.sin(time*.31)*.06;if(pose==='row')yaw=Math.PI;}
 if(scene.theme==='ship'){y=.01+Math.sin(time*.55)*.018;}
 if(key==='prologue'&&person==='MARA'){x+=beat===0?.6*(1-smooth(time/4)):1.0*smooth((beat===1?lineTime:4)/3);pose=beat===1?'give':'brace';}
 if(key==='prologue'&&person==='ROWAN'&&beat===2&&lineTime>4.8){z-=smooth((lineTime-4.8)/3)*3;pose='walk';yaw=0;}
 if(key==='ink.in'&&person==='THOMAS'){z-=3.2*(1-smooth(time/5));if(time<4.6){pose='walk';yaw=Math.PI;}}
 if(key==='dispatch.in'&&person==='THOMAS'){z+=1.1*smooth(time/10);}
 if(key==='kingstreet.in'&&beat>0){
  // The hit happens once. Subsequent dialogue keeps the final fallen pose.
  const fall=beat===1?smooth((lineTime-.08)/1.1):1;
  if(person==='ISAIAH'){x=mix(1.85,1.50,fall);z=mix(-1.2,-.85,fall);yaw=2.85;pose='hit';progress=fall;injury=beat>1||lineTime>.08;}
  else {
   // Let the audience see the fall before either rescuer crosses the frame.
   const approach=beat===1?0:beat===2?smooth(lineTime/1.25):1;
   if(person==='MARA'){x=mix(.15,2.28,approach);z=mix(.35,-.78,approach)+Math.sin(approach*Math.PI)*.32;yaw=approach<.90?-1.1:Math.PI/2;pose=beat===1?'brace':approach<.90?'run':'tend';}
   else {x=mix(-1.65,.48,approach);z=mix(.65,.12,approach);yaw=-.80;pose=approach<.90?'brace':'kneel';}
  }
 }
 if(key==='kingstreet.out'){
  if(person==='ISAIAH'){x=1.5;z=-.85;yaw=2.85;pose='recover';injury=true;bandaged=true;}
  else if(person==='MARA'){x=2.28;z=-.78;yaw=Math.PI/2;pose='tend';}
  else {x=.48;z=.12;yaw=-.80;pose='kneel';}
 }
 if(key==='homespun.in'&&person==='MARA'&&beat===2)pose='point';
 if(key==='homespun.in'&&person==='ROWAN'&&beat===2){z+=smooth(lineTime/2)*.5;pose='reach';}
 if(key==='tea.in'&&person==='ISAIAH'&&beat===2){z+=smooth(lineTime/2)*1.1;pose='work';}
 return {x,y,z,yaw,pose,progress,injury,bandaged,mood:scene.mood||'steady'};
}

// This clock only advances when the caller supplies dt (pause supplies none).
// A silent lead-in establishes the set; a short hold leaves space for reactions.
export class FilmClock{
 constructor(ids){this.ids=ids;this.at=0;this.time=0;this.resetBeat();}
 resetBeat(){this.wait=0;this.lineTime=0;this.tail=0;this.started=false;}
 advance(){this.at++;this.resetBeat();return this.at<this.ids.length;}
 restart(){this.at=0;this.time=0;this.resetBeat();}
 tick(dt,current){this.time+=dt;this.wait+=dt;
  if(!this.started&&this.wait>=(this.at===0?1.05:.16)){this.started=true;return 'cue';}
  if(this.started&&current){this.lineTime=Math.max(0,current.time);this.tail=0;}
  else if(this.started){this.tail+=dt;this.lineTime+=dt;if(this.tail>=.65)return 'advance';}
  return null;
 }
}
