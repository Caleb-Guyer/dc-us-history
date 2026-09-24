import {STATIONS} from './c5-sim.mjs';
export class CampaignBoard{
 constructor(canvas){this.canvas=canvas;this.c=canvas.getContext('2d');this.resize();}
 resize(){const d=Math.min(devicePixelRatio,1.5);this.canvas.width=innerWidth*d;this.canvas.height=innerHeight*d;this.d=d;this.scale=Math.min(innerWidth/940,(innerHeight-120)/610);this.scale=Math.max(.25,this.scale);this.x=(innerWidth-900*this.scale)/2;this.y=(innerHeight-600*this.scale)/2+15;}
 box(x,y,w,h,color,r=4){const c=this.c;c.fillStyle=color;c.beginPath();c.roundRect(x-w/2,y-h/2,w,h,r);c.fill();}
 text(text,x,y,size=15,color='#edddba',align='center'){const c=this.c;c.fillStyle=color;c.font=`500 ${size}px system-ui`;c.textAlign=align;c.textBaseline='middle';c.fillText(text,x,y);}
 person(x,y,angle,color='#426874',t=0,moving=false){const c=this.c;c.save();c.translate(x,y);c.rotate(angle);this.box(1,9,27,22,'#0006',9);this.box(-6,10,8,14,'#263333',3);this.box(6,10,8,14,'#263333',3);this.box(0,0,24,27,color,8);this.box(-16,Math.sin(t*10)*(moving?5:0),7,18,color,3);this.box(16,-Math.sin(t*10)*(moving?5:0),7,18,color,3);this.box(0,-13,14,15,'#c39c7d',6);this.box(0,-18,15,6,'#403b31',3);this.box(0,3,25,4,'#9e503e',1);c.restore();}
 boat(x,y,a,color='#b6aa83',scale=1){const c=this.c;c.save();c.translate(x,y);c.rotate(a);c.scale(scale,scale);c.fillStyle='#0004';c.beginPath();c.ellipse(3,6,17,34,0,0,Math.PI*2);c.fill();c.fillStyle=color;c.beginPath();c.moveTo(0,-35);c.bezierCurveTo(24,-12,18,24,9,31);c.lineTo(-9,31);c.bezierCurveTo(-18,24,-24,-12,0,-35);c.fill();this.box(0,3,19,39,'#47514a');for(const z of [-9,6,18])this.box(0,z,25,3,'#b49e70',1);this.box(0,-2,5,24,'#3b4440');c.restore();}
 draw(s){
  const c=this.c,d=this.d;c.setTransform(d,0,0,d,0,0);c.fillStyle='#071319';c.fillRect(0,0,innerWidth,innerHeight);c.translate(this.x,this.y);c.scale(this.scale,this.scale);
  if(s.mission.mode==='workshop')this.workshop(s);else this.harbor(s);
  const vignette=c.createRadialGradient(450,300,200,450,300,560);vignette.addColorStop(0,'#0000');vignette.addColorStop(1,'#0009');c.fillStyle=vignette;c.fillRect(-40,-50,980,700);
 }
 workshop(s){
  const c=this.c,t=s.time;this.box(450,300,900,570,'#493d30');
  for(let x=20;x<900;x+=28){this.box(x,300,1,565,'#1d292755',0);for(let z=20;z<580;z+=95)this.box(x+12,z+(x%3)*16,24,1,'#1d292770',0);}
  this.box(450,55,860,27,'#28312d');this.box(450,557,860,28,'#28312d');
  for(const x of [260,450,640]){this.box(x,52,85,35,'#b8c5b255',1);this.box(x,63,90,6,'#887657',0);}
  // Amber pools of light, loom threads, spinning wheel and delivery counters.
  for(const station of STATIONS){
   const active=station.type===s.carrying,near=Math.hypot(s.player.x-station.x,s.player.z-station.z)<72;
   c.fillStyle=active?'#d9b67420':'#151e2420';c.beginPath();c.arc(station.x,station.z,69,0,Math.PI*2);c.fill();
   c.strokeStyle=active?'#e9c988':'#8c9b8250';c.lineWidth=active?2:1;c.beginPath();c.arc(station.x,station.z,62,0,Math.PI*2);c.stroke();
   this.box(station.x,station.z,85,62,'#27332f');this.box(station.x,station.z-5,83,56,'#786747');
   if(station.type===0){for(let i=0;i<8;i++){c.strokeStyle=i%2?'#a6b484':'#6c9973';c.lineWidth=3;c.beginPath();c.moveTo(station.x-20+i*6,station.z+16);c.lineTo(station.x-15+i*6,station.z-20);c.stroke();}}
   if(station.type===1){c.strokeStyle='#d7b985';c.lineWidth=3;c.beginPath();c.arc(station.x,station.z,24,t*2,t*2+Math.PI*2);c.stroke();for(let i=0;i<6;i++){const a=i*Math.PI/3+t*.8;c.beginPath();c.moveTo(station.x,station.z);c.lineTo(station.x+Math.cos(a)*24,station.z+Math.sin(a)*24);c.stroke();}}
   if(station.type===2){for(let i=0;i<12;i++)this.box(station.x-26+i*5,station.z,1.8,44,'#c5bc98',0);this.box(station.x,station.z+Math.sin(t*3)*15,68,5,'#3f6469',0);}
   if(station.type===3){this.box(station.x,station.z,45,27,'#a3b5a0');this.box(station.x,station.z+3,45,3,'#657e78',0);}
   this.text(station.label,station.x,station.z-49,13,active?'#ffdda0':'#bcbda5');
   if(active&&near&&s.hold>0){c.strokeStyle='#fff0b8';c.lineWidth=4;c.beginPath();c.arc(station.x,station.z,64,-Math.PI/2,-Math.PI/2+Math.min(1,s.hold/1.05)*Math.PI*2);c.stroke();}
  }
  this.box(450,110,174,45,'#283d3c');this.text('BRITISH IMPORTS',450,103,12,'#adada0');this.text('BOYCOTT',450,120,11,'#d3a26f');
  this.person(200,485,-.2,'#a37a42',t);this.text('MARA',205,520,10,'#dac8a6');
  for(let i=0;i<3;i++){const x=340+i*100,y=310+Math.sin(t*.8+i*2)*170;this.box(x+2,y+8,39,42,'#0004');this.box(x,y,34,36,'#8c7c54');this.box(x,y,6,38,'#414e42');this.box(x-19,y,4,40,'#28352f');this.box(x+19,y,4,40,'#28352f');}
  if(s.dash>0)for(let i=0;i<4;i++){c.globalAlpha=.08*(4-i);this.person(s.player.x-Math.sin(s.player.angle)*i*14,s.player.z+Math.cos(s.player.angle)*i*14,s.player.angle,'#85b5b8');}c.globalAlpha=s.hurt>0?.55:1;
  this.person(s.player.x,s.player.z,s.player.angle,'#39626b',t,true);c.globalAlpha=1;
  if(s.carrying){this.box(s.player.x,s.player.z-40,27,18,['','#9bac76','#d0bd83','#8bafad'][s.carrying]);this.text(['','FLAX','YARN','CLOTH'][s.carrying],s.player.x,s.player.z-58,10);}
  const station=STATIONS[s.carrying],dx=station.x-s.player.x,dz=station.z-s.player.z;if(Math.hypot(dx,dz)>95){c.save();c.translate(s.player.x+dx*.12,s.player.z+dz*.12);c.rotate(Math.atan2(dx,-dz));c.fillStyle='#ebcd92';c.beginPath();c.moveTo(0,-9);c.lineTo(-5,4);c.lineTo(5,4);c.fill();c.restore();}
  this.text(`${s.delivered} / 4 BUNDLES`,450,585,12,'#d7c4a2');
 }
 harbor(s){
  const c=this.c,t=s.time;const grad=c.createLinearGradient(0,0,900,600);grad.addColorStop(0,'#284e5c');grad.addColorStop(.6,'#13333f');grad.addColorStop(1,'#10252f');c.fillStyle=grad;c.fillRect(0,0,900,600);
  c.lineWidth=1;for(let z=25;z<580;z+=18)for(let x=5;x<900;x+=65){c.strokeStyle=`rgba(161,205,206,${.05+.05*Math.sin(x+z)})`;c.beginPath();c.moveTo(x+Math.sin(t+z)*8,z);c.bezierCurveTo(x+13,z-3,x+30,z+4,x+45,z);c.stroke();}
  for(let i=0;i<8;i++){const x=30+i*120;this.box(x,16,100,33,'#172629');this.box(x,30,88,12,'#766b4c');}
  for(const [x,z]of[[50,425],[850,380],[65,185],[830,95]]){this.box(x,z,70,60,'#4e5746');for(let i=0;i<3;i++)this.box(x-25+i*23,z,2,60,'#252d28',0);this.box(x,z-30,12,12,'#d7bc72');}
  this.box(450,575,170,38,'#715f42');for(let x=380;x<530;x+=20)this.box(x,575,2,38,'#283431',0);this.text('RELIEF DOCK',450,593,11,'#ebd9b2');
  c.strokeStyle='#99cac8';c.lineWidth=2;c.beginPath();c.ellipse(450,540,58,25,0,0,Math.PI*2);c.stroke();
  for(let i=0;i<s.enemies.length;i++){
   const e=s.enemies[i],x=e.x+Math.sin(t*.35+i)*70,z=e.z+Math.cos(t*.3+i)*28,a=Math.sin(t*.45+i)*1.4;
   c.save();c.translate(x,z);c.rotate(a);const light=c.createRadialGradient(0,0,0,0,0,160);light.addColorStop(0,'#fbe2a444');light.addColorStop(1,'#fbe2a405');c.fillStyle=light;c.beginPath();c.moveTo(0,0);c.arc(0,0,160,-Math.PI/2-.43,-Math.PI/2+.43);c.closePath();c.fill();c.restore();this.boat(x,z,a,'#744d39',1.05);
  }
  s.supplies.forEach((p,i)=>{if(p.taken)return;this.box(p.x+2,p.z+4,32,27,'#0004');this.box(p.x,p.z+Math.sin(t*2+i)*2,29,26,'#b3a575');this.box(p.x,p.z,29,4,'#466b63',0);this.text(i===s.delivered&&!s.cargo?'PICK UP':'RELIEF',p.x,p.z-30,10,'#e8d5a2');});
  c.globalAlpha=.2;for(let i=0;i<5;i++){c.strokeStyle='#d3dfd3';c.lineWidth=2;c.beginPath();c.ellipse(s.player.x-Math.sin(s.player.angle)*i*7,s.player.z+Math.cos(s.player.angle)*i*7,10+i*2,5,0,0,Math.PI*2);c.stroke();}c.globalAlpha=s.hurt>0?.55:1;this.boat(s.player.x,s.player.z,s.player.angle,'#bdb08a',.75);c.globalAlpha=1;
  if(s.cargo){this.box(s.player.x,s.player.z+3,13,12,'#bcc090',1);this.text('RELIEF ABOARD',s.player.x,s.player.z-41,10,'#efdbac');}
  const next=s.cargo?{x:450,z:540}:s.supplies.find(p=>!p.taken);if(next){c.strokeStyle='#e5ce9670';c.setLineDash([4,12]);c.beginPath();c.moveTo(s.player.x,s.player.z);c.lineTo(next.x,next.z);c.stroke();c.setLineDash([]);}
 }
}
