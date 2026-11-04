// Canvas art for the short history campaigns. All positions use a 1000×560 stage.
// Rendering never changes the simulation. Cinematic speech is supplied by the director.
const W=1000,H=560,TAU=Math.PI*2;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const noise=n=>{const r=Math.sin(n*127.1+311.7)*43758.5453;return r-Math.floor(r);};
const palettes={9:{sky:'#8daaaa',light:'#eed8a0',ink:'#173a40',dark:'#102e34',water:'#366d72',accent:'#e4b56e'},11:{sky:'#9faac0',light:'#ffe4b0',ink:'#263549',dark:'#182b3d',water:'#406e86',accent:'#f2cb7c'}};

function shape(c,points,color,stroke=null,width=1){c.beginPath();points.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fillStyle=color;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}}
function ellipse(c,x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,Math.max(.01,rx),Math.max(.01,ry),0,0,TAU);c.fill();}
function line(c,x1,y1,x2,y2,color,width=1){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();}
function gradient(c,x1,y1,x2,y2,stops){const g=c.createLinearGradient(x1,y1,x2,y2);for(const [at,color]of stops)g.addColorStop(at,color);return g;}
function label(c,text,x,y,size=13,color='#e8e1c7',align='left'){c.fillStyle=color;c.font=`600 ${size}px system-ui, sans-serif`;c.textAlign=align;c.fillText(text,x,y);}
function rounded(c,x,y,w,h,r,color,stroke){c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=color;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=1.2;c.stroke();}}
function shadow(c,x,y,w=25,h=7,alpha=.22){ellipse(c,x,y,w,h,`rgba(8,22,28,${alpha})`);}

function sky(c,time,p,night=false){
 c.fillStyle=gradient(c,0,0,0,H,[[0,night?'#172c42':p.sky],[.55,night?'#6a6d7c':'#d5c6a4'],[1,p.light]]);c.fillRect(0,0,W,H);
 const sx=770,sy=105,glow=c.createRadialGradient(sx,sy,2,sx,sy,205);glow.addColorStop(0,'#ffe8af60');glow.addColorStop(1,'#ffe8af00');c.fillStyle=glow;c.fillRect(500,0,500,340);ellipse(c,sx,sy,27,27,'#fff0be');
 for(let j=0;j<7;j++){const x=((j*193+time*(j%2?3:5))%1250)-170,y=45+(j%3)*28;c.fillStyle=`rgba(240,232,211,${.10+j%3*.025})`;c.beginPath();c.ellipse(x,y,100+j%2*50,10+j%3*3,0,0,TAU);c.fill();}
}
function hills(c,time,chapter=11){
 const shifts=[-time*1.3,-time*2.7];
 for(let layer=0;layer<2;layer++){const top=layer?201:146,base=layer?320:280,amp=layer?55:80,col=layer?'#527578':'#7b9298';const pts=[[-50,H]];for(let x=-50;x<=1100;x+=45)pts.push([x,top+Math.sin(x*.007+layer*2)*amp+Math.sin(x*.021+layer+shifts[layer]*.006)*amp*.35]);pts.push([1100,H]);shape(c,pts,col);if(chapter===11&&layer===0){for(let i=0;i<4;i++){const x=150+i*230;shape(c,[[x-50,top-5+Math.sin(x*.007)*amp],[x,top-66+Math.sin(x*.007)*amp],[x+50,top+20+Math.sin(x*.007)*amp]],'#a3b4b6');shape(c,[[x-15,top-46+Math.sin(x*.007)*amp],[x,top-66+Math.sin(x*.007)*amp],[x+18,top-43+Math.sin(x*.007)*amp]],'#d9dbcf');}}}
}
function lowHorizon(c,t,marsh=false){
 // San Jacinto is a coastal prairie; Washington has low wooded hills, not Rockies.
 const pts=[[0,295]];for(let x=0;x<=1000;x+=50)pts.push([x,marsh?218+Math.sin(x*.018)*3:208+Math.sin(x*.009)*17]);pts.push([1000,295]);shape(c,pts,marsh?'#657864':'#6e8580');
 if(marsh){shape(c,[[0,230],[160,224],[330,233],[430,238],[290,248],[110,253],[0,249]],'#78958f');for(let i=0;i<8;i++){const x=45+i*131;tree(c,x,230+Math.sin(i)*4,.27+noise(i)*.15,t);}}
}
function tree(c,x,y,size=1,time=0,pine=false){
 c.save();c.translate(x,y);c.scale(size,size);line(c,0,0,Math.sin(time+x)*2,-72,'#4c5140',7);
 if(pine){for(let i=0;i<3;i++)shape(c,[[-27+i*4,-30-i*21],[0,-110+i*3],[28-i*4,-30-i*21]],i===2?'#344f49':'#45675a');}
 else{for(let i=0;i<5;i++)ellipse(c,Math.sin(i*2.2)*23,-70+Math.cos(i*2.2)*18,25,30,i%2?'#62785b':'#4d6f59');}c.restore();
}
function smoke(c,x,y,time,size=1,shade='216,218,204'){
 for(let i=0;i<7;i++){const life=(time*.18+i/7)%1,px=x+life*70*size+Math.sin(i*3+time)*8,py=y-life*125*size;c.globalAlpha=(1-life)*.2;ellipse(c,px,py,(12+life*35)*size,(8+life*22)*size,`rgb(${shade})`);}c.globalAlpha=1;
}
function brickBuilding(c,x,y,w,h,{tone='#8f6450',windows=true,roof=true,sign='',time=0}={}){
 shadow(c,x+w*.45,y+4,w*.58,14,.16);c.fillStyle=tone;c.fillRect(x,y-h,w,h);c.fillStyle='#2b484c';c.fillRect(x,y-h,w,8);
 c.fillStyle='#352f2c40';for(let row=0;row<h/21;row++){const yy=y-h+row*21;c.fillRect(x,yy,w,1);for(let xx=x-(row%2)*17;xx<x+w;xx+=34)c.fillRect(xx,yy,1,21);}
 if(windows)for(let yy=y-h+23;yy<y-16;yy+=40)for(let xx=x+14;xx<x+w-16;xx+=32){c.fillStyle='#d4c18d';c.fillRect(xx,yy,17,25);c.fillStyle='#456164';c.fillRect(xx+2,yy+2,13,20);c.fillStyle='#d6d6b750';c.fillRect(xx+3,yy+2,5,20);line(c,xx+8,yy,xx+8,yy+24,'#b8b7a1',1);line(c,xx,yy+12,xx+17,yy+12,'#b8b7a1',1);}
 if(roof)shape(c,[[x-5,y-h],[x+w*.5,y-h-31],[x+w+5,y-h]],'#30494b');
 if(sign){rounded(c,x+w*.1,y-h+35,w*.8,27,1,'#253b39','#b7aa83');label(c,sign,x+w*.5,y-h+53,Math.min(11,w/13),'#eee1b8','center');}
}
function wheel(c,x,y,r,t,color='#a48755'){
 c.strokeStyle=color;c.lineWidth=4;c.beginPath();c.arc(x,y,r,0,TAU);c.stroke();for(let i=0;i<8;i++){const a=t+i*TAU/8;line(c,x,y,x+Math.cos(a)*r,y+Math.sin(a)*r,color,2);}ellipse(c,x,y,4,4,'#333e39');
}

// Articulated period figures. Their position is the ground contact, not a collision point.
function person(c,x,y,s,time,{coat='#34505b',hat=true,dress=false,running=false,facing=1,carry=false,arm=0,skin='#c49a72',soldier=false}={}){
 c.save();c.translate(x,y);c.scale(s*facing,s);const walk=running?Math.sin(time*12):Math.sin(time*2)*.1,lean=running?.13:Math.sin(time*1.6)*.014;
 shadow(c,0,1,17,5,.23);c.rotate(lean);c.lineCap='round';
 const hip=-31,knee=-14,feet=0;
 line(c,-5,hip,-7+walk*12,knee,'#393d3b',8);line(c,-7+walk*12,knee,-8-walk*9,feet,'#2e3b3e',7);
 line(c,6,hip,8-walk*12,knee,'#53605b',8);line(c,8-walk*12,knee,8+walk*9,feet,'#3c4847',7);
 line(c,-11-walk*9,feet,-3-walk*9,feet,'#252f31',6);line(c,5+walk*9,feet,14+walk*9,feet,'#252f31',6);
 if(dress)shape(c,[[-11,-54],[9,-54],[20,-13],[-17,-13]],coat);else shape(c,[[-13,-62],[12,-62],[14,-30],[-11,-29]],coat);
 if(soldier){line(c,-9,-60,10,-34,'#d7ccb0',4);line(c,10,-60,-10,-34,'#c6c0a5',3);}
 line(c,0,-62,0,-68,skin,9);ellipse(c,1,-76,10,13,skin);ellipse(c,7,-76,4,3,skin);shape(c,[[-9,-82],[-6,-91],[7,-90],[11,-79],[4,-84]],'#493e35');
 if(hat){shape(c,[[-11,-87],[-10,-102],[10,-102],[13,-87]],soldier?'#263c45':'#605847');line(c,-17,-86,17,-86,'#343e3b',4);}else if(dress){shape(c,[[-10,-80],[-12,-89],[-7,-96],[5,-96],[12,-87],[11,-77],[7,-85],[-4,-87]],'#e0d7be');line(c,-8,-82,5,-65,'#dfd4ba',2);}
 line(c,5,-77,8,-77,'#333b3b',1.5);line(c,1,-69,7,-69,'#805e4c',1);
 const sw=running?walk*16:Math.sin(time*2)*2;line(c,-10,-57,-18,-44+sw,'#253c43',7);line(c,-18,-44+sw,-6+arm*12,-35+sw,'#c29c77',5);
 line(c,11,-57,20,-46-sw,'#3b5860',7);line(c,20,-46-sw,carry?27:15,-38-sw-arm*18,skin,5);
 if(carry){rounded(c,20,-46-sw,20,16,1,'#e4d6b0','#6a634b');line(c,24,-42-sw,36,-42-sw,'#8f8063',1);line(c,24,-38-sw,33,-38-sw,'#8f8063',1);}
 c.restore();
}
function boat(c,x,y,s,time,{river=false,hero=true,cinema=false}={}){
 c.save();c.translate(x,y);c.scale(s,s);const bob=Math.sin(time*3+x)*1.2;c.translate(0,bob);shadow(c,0,16,53,12,.22);
 for(let i=0;i<4;i++){c.strokeStyle=`rgba(210,232,223,${.21-i*.04})`;c.lineWidth=2;c.beginPath();c.ellipse(-40-i*9,12,35+i*12,8+i*3,0,.4,TAU-.4);c.stroke();}
 shape(c,[[-65,-8],[-49,16],[40,16],[71,-7],[30,-18],[-40,-18]],river?'#765336':'#574b34','#bd9b63',2);
 shape(c,[[-50,-10],[-35,7],[35,7],[53,-9],[25,-14],[-30,-14]],'#b19462');
 for(let i=-36;i<=36;i+=18)line(c,i,-10,i,7,'#6f593d',2);
 if(!river){rounded(c,-22,-37,50,28,2,'#d0c6a5','#384b48');shape(c,[[-27,-37],[3,-48],[33,-37]],'#3c524c');for(let i=0;i<3;i++)rounded(c,-17+i*15,-31,9,10,1,'#345157');ellipse(c,-40,-4,10,8,'#ae8551');ellipse(c,43,-3,9,8,'#ae8551');}
 if(river){const paddle=Math.sin(time*4)*9;line(c,0,-16,20,35+paddle,'#cfb280',3);ellipse(c,22,35+paddle,4,12,'#cfb280');}
 else{line(c,-58,-12,-72,-10,'#87704c',3);shape(c,[[-67,9],[-76,12],[-74,22],[-67,18]],'#675d40');}
 if(hero)person(c,river?-8:-47,river?-5:-9,river?.48:.43,time,{coat:'#45697a',hat:river,arm:river?.5:0});
 if(river){person(c,26,-4,.4,time+.6,{coat:'#9a8462',hat:false,arm:.3});rounded(c,-40,-3,20,12,1,'#cab78b');}
 if(cinema){line(c,0,-42,0,-100,'#b5aa84',2);shape(c,[[1,-99],[34,-92],[2,-81]],'#ded9ba');}
 c.restore();
}

function towHorse(c,x,y,s,time){
 c.save();c.translate(x,y);c.scale(s,s);shadow(c,0,2,49,8,.2);const walk=Math.sin(time*5),bob=Math.sin(time*10)*1.1;
 // The alternating legs and harness identify an animal towing on the bank.
 for(let i=0;i<4;i++){const back=i<2,phase=i%2?walk:-walk,hip=back?-28:25,knee=hip+phase*9;line(c,hip,-31,knee,-16,i%2?'#6a4c32':'#87623e',7);line(c,knee,-16,hip-phase*13,0,i%2?'#533f2e':'#705136',5);line(c,hip-phase*13-2,0,hip-phase*13+6,0,'#302f29',5);}
 ellipse(c,0,-42+bob,43,22,'#947049');ellipse(c,24,-45+bob,21,22,'#a17a4f');shape(c,[[20,-49+bob],[36,-82+bob],[48,-85+bob],[48,-49+bob]],'#a37c50');ellipse(c,48,-81+bob,15,9,'#a98457');ellipse(c,59,-80+bob,8,6,'#ad8d60');shape(c,[[36,-86+bob],[36,-98+bob],[43,-89+bob]],'#6e5437');
 line(c,32,-74+bob,26,-52+bob,'#504531',5);line(c,-39,-46+bob,-54,-31+walk*4,'#504531',6);ellipse(c,49,-84+bob,1.5,1.5,'#28302a');line(c,40,-88+bob,41,-72+bob,'#d0bc84',2);line(c,39,-75+bob,60,-77+bob,'#d0bc84',2);line(c,15,-61+bob,10,-25+bob,'#c6ae73',5);line(c,9,-44+bob,-30,-45+bob,'#d4bf8a',2);c.restore();
}
function canalTow(c,bx,by,bs,hx,hy,hs,t){
 c.save();c.strokeStyle='#dcc592b3';c.lineWidth=1.8;c.beginPath();c.moveTo(bx+35*bs,by-14*bs);c.quadraticCurveTo((bx+hx)*.5,(by+hy)*.5+8,hx+9*hs,hy-44*hs);c.stroke();c.restore();towHorse(c,hx,hy,hs,t);
}

function factoryBackground(c,t,cinema=false){
 c.fillStyle=gradient(c,0,0,0,H,[[0,'#15383d'],[.55,'#35585b'],[1,'#86744f']]);c.fillRect(0,0,W,H);
 // Tall industrial windows, belts and beams give the room depth.
 for(let x=10;x<W;x+=152){rounded(c,x,26,112,155,38,'#b7b991');rounded(c,x+7,33,98,141,33,'#91a4a0');c.fillStyle=gradient(c,x,35,x+110,175,[[0,'#e6dba7'],[1,'#507378']]);c.fillRect(x+9,80,94,94);line(c,x+56,31,x+56,177,'#455f59',7);line(c,x+5,100,x+107,100,'#455f59',5);line(c,x+5,140,x+107,140,'#455f59',5);c.fillStyle='#36514c';c.fillRect(x+109,0,14,H);}
 c.save();c.globalAlpha=.08;c.fillStyle='#fff1ba';for(let x=55;x<W;x+=152)shape(c,[[x,45],[x+60,45],[x+210,H],[x-10,H]],'#fff0bd');c.restore();
 for(let x=0;x<W;x+=72){c.fillStyle='#213d3c';c.fillRect(x,0,12,29);}c.fillStyle='#172e30';c.fillRect(0,14,W,17);
 for(let x=90;x<W;x+=220){wheel(c,x,34,24,t*2,'#d2aa6f');line(c,x-19,34,x-19,164,'#252b29',7);line(c,x+19,34,x+19,164,'#252b29',7);}
 c.fillStyle='#2c4948';c.fillRect(0,186,W,374);for(let y=204;y<H;y+=30){line(c,0,y,W,y,'#a68b5921',1);for(let x=y%60;x<W;x+=120)line(c,x,y,x+16,y+30,'#1f35364a',1);}
 if(cinema){for(let i=0;i<5;i++)loom(c,80+i*210,347,1,t);for(let i=0;i<4;i++)person(c,190+i*220,381,.8,t+i,{dress:true,hat:false,coat:i%2?'#765e53':'#4f6d6e',arm:Math.sin(t*3+i)*.3});}
 else{
  for(const y of [140,280,420]){
   c.fillStyle='#183337';c.fillRect(0,y+32,W,24);line(c,0,y+34,W,y+34,'#b69b64',2);line(c,0,y+55,W,y+55,'#6c5e3e',2);
   for(let x=-50;x<1100;x+=96){const xx=(x-t*180)%1056;rounded(c,xx,y+40,70,8,2,'#304e4f');}
   loom(c,944,y+29,.51,t);c.fillStyle='#112d3155';c.fillRect(0,y-49,W,4);
  }
  c.save();c.setLineDash([8,7]);c.strokeStyle='#f4d08e99';c.lineWidth=2;c.strokeRect(140,79,180,410);c.restore();
  c.fillStyle='#f8d88b0c';c.fillRect(140,79,180,410);label(c,'YOUR WORK STATION',230,73,10,'#f4da9b','center');
 }
 for(let i=0;i<27;i++){const x=(noise(i)*1000+t*7)%1000,y=(noise(i+44)*560-t*3)%560;ellipse(c,x,y,1,1,'#f3d7a835');}
}
function loom(c,x,y,s,t){
 c.save();c.translate(x,y);c.scale(s,s);shadow(c,0,4,69,11,.21);shape(c,[[-58,-73],[43,-73],[66,-23],[-47,-23]],'#4b6a66','#bda16a',2);
 c.fillStyle='#9c8050';c.fillRect(-56,-23,116,12);for(let i=0;i<22;i++)line(c,-50+i*4,-65,-35+i*4,-24,'#dbc78e',1);
 const shuttle=Math.sin(t*9+x)*32;rounded(c,-41,-51,83,9,1,'#d5bc7d');rounded(c,shuttle-13,-42,25,7,2,'#a9503b');
 for(const xx of [-49,51]){c.fillStyle='#314d49';c.fillRect(xx,-14,8,41);line(c,xx+4,-59,xx+4,-91,'#8b754d',6);}wheel(c,65,-17,23,t*4,'#c0a16a');
 for(let i=0;i<4;i++){ellipse(c,-40+i*24,-79,8,5,'#e8d6ad');c.fillStyle='#b29c70';c.fillRect(-47+i*24,-87,14,8);ellipse(c,-40+i*24,-87,8,3,'#f0ddb3');}
 c.restore();
}
function waterBackground(c,t,river=false,cinema=false){
 const p=palettes[river?11:9];sky(c,t,p);hills(c,t,river?11:9);
 if(cinema){
  c.fillStyle=gradient(c,0,260,0,H,[[0,river?'#527f92':'#6b9292'],[1,river?'#24506c':'#285b64']]);c.fillRect(0,256,W,304);
  shape(c,[[0,245],[115,244],[204,270],[270,310],[294,360],[235,560],[0,560]],river?'#3c594c':'#6c8057');shape(c,[[1000,244],[890,250],[833,280],[793,332],[798,405],[860,560],[1000,560]],river?'#435a47':'#79875b');
  for(let i=0;i<9;i++){const x=i<5?noise(i+30)*180:850+noise(i+80)*150;tree(c,x,270+noise(i+90)*130,.5+noise(i+20)*.4,t,river);}
 }else{
  c.fillStyle=gradient(c,0,0,0,H,[[0,river?'#314d53':'#566c4e'],[.16,river?'#5b857e':'#98a37a'],[.2,river?'#326e83':'#487c80'],[.83,river?'#35697a':'#426d70'],[.86,'#a4976d'],[1,river?'#415746':'#587756']]);c.fillRect(0,0,W,H);
  for(let i=0;i<20;i++){const x=((i*71-t*(river?45:30))%1300+1300)%1300-130;tree(c,x,i%2?33:555,.4+noise(i+2)*.45,t,river);}
  if(!river){
   for(let i=0;i<7;i++){const x=((i*187-t*18)%1450+1450)%1450-170;brickBuilding(c,x,66,105,60,{time:t,tone:'#97765b'});}
   line(c,0,87,W,87,'#dac18c',4);line(c,0,483,W,483,'#c5b78a',4);for(let x=10;x<W;x+=72){line(c,x,485,x,503,'#695c40',3);line(c,x,491,x+72,491,'#806f47',2);}
  }else{for(let i=0;i<9;i++){const x=((i*170-t*23)%1400+1400)%1400-100;shape(c,[[x,60],[x+40,14],[x+100,70]],'#667b6e');}}
  for(const y of [140,280,420]){c.save();c.setLineDash([3,14]);line(c,0,y,W,y,'#e4eac316',1);c.restore();}
 }
 const ymin=cinema?270:110,ymax=cinema?560:470;
 for(let i=0;i<62;i++){const y=ymin+noise(i+101)*(ymax-ymin),x=((noise(i)*1200-t*(35+noise(i+4)*65))%1200+1200)%1200-100,w=8+noise(i+16)*44;c.strokeStyle=i%4?'#d6e7d12e':'#d9ecce60';c.lineWidth=i%4?1:2;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+w*.5,y-3+Math.sin(t*3+i)*2,x+w,y);c.stroke();}
 if(river)for(let i=0;i<23;i++){const x=((i*113-t*105)%1150+1150)%1150-70,y=ymin+noise(i+208)*(ymax-ymin);line(c,x,y,x+20,y-2,'#e8eee240',1.5);}
 if(!river&&cinema){brickBuilding(c,100,260,220,153,{sign:'WAREHOUSE',time:t});brickBuilding(c,625,255,165,129,{time:t});line(c,558,291,558,126,'#686747',3);shape(c,[[560,130],[628,146],[560,159]],'#ddd5b2');}
}
function roadBackground(c,t,mode,cinema=false){
 if(!cinema){roadPlay(c,t,mode);return;}
 const battle=mode==='dispatch',press=mode==='press';sky(c,t,palettes[battle?11:9],battle);if(battle||press)lowHorizon(c,t,battle);else hills(c,t,9);
 if(battle){
  c.fillStyle=gradient(c,0,220,0,H,[[0,'#737b50'],[1,'#b09b63']]);c.fillRect(0,242,W,318);
  for(let i=0;i<7;i++)tree(c,noise(i+2)*1050,245+noise(i+9)*26,.5+noise(i+11)*.3,t,false);
  for(let i=0;i<16;i++){const x=(i*72+t*8)%1100-50;person(c,x,277+(i%3)*10,.26,t+i,{coat:i%3?'#e2d0aa':'#435769',soldier:true,hat:true,running:false});line(c,x+4,260,x+18,252,'#4b4540',1.5);}
  for(let i=0;i<5;i++)smoke(c,80+i*230,244,t+i,1.1,'193,186,153');
  const flagX=750;line(c,flagX,248,flagX,129,'#645c47',3);shape(c,[[flagX+1,131],[flagX+61,140+Math.sin(t*2)*5],[flagX+58,166+Math.sin(t*2+1)*4],[flagX+1,160]],'#ded5b2');
  for(let i=0;i<35;i++){const x=((noise(i)*1100-t*28)%1100+1100)%1100-50,y=307+noise(i+42)*230;line(c,x,y,x+3,y-7-noise(i)*9,'#6c754c',1);}
 }else{
  c.fillStyle='#8d8668';c.fillRect(0,222,W,338);
  for(let i=0;i<6;i++){const x=((i*210-t*25)%1350+1350)%1350-175;brickBuilding(c,x,271,168,144+noise(i)*65,{tone:i%2?'#91634e':'#8a8063',sign:i===2?(press?'PRINTING OFFICE':'BOARDING HOUSE'):'',time:t});if(i%2)smoke(c,x+120,82,t,1);}
  line(c,0,284,W,284,'#bcb28a',5);c.fillStyle='#b4a27b';c.fillRect(0,277,W,13);
  for(let i=0;i<8;i++){const x=((i*155-t*36)%1300+1300)%1300-140;rounded(c,x,299,18,5,1,'#8e7654');}
  if(press){
   // The Capitol's pre-Civil War lower dome, seen as a symbolic destination.
   c.save();c.globalAlpha=.7;c.fillStyle='#c2c2a8';c.fillRect(709,129,158,125);c.fillRect(676,183,218,70);for(let x=686;x<888;x+=22)c.fillRect(x,176,7,81);shape(c,[[667,177],[785,148],[904,177]],'#d6d3b7');ellipse(c,789,121,37,31,'#d4d0b5');c.fillStyle='#b7b8a5';c.fillRect(751,121,76,22);line(c,789,93,789,72,'#acb2a1',3);c.restore();
  }
 }
 // Three depth lanes keep approaching objects and movement readable.
 if(!cinema){
  c.fillStyle=battle?'#a8956518':'#3c4b4622';for(const y of [140,280,420]){rounded(c,20,y-40,960,80,20,battle?'#d6b9790c':'#263b3b0e');c.save();c.setLineDash([15,35]);line(c,0,y+43,W,y+43,battle?'#d1c19220':'#d5c6a820',1);c.restore();}
  if(!battle){c.fillStyle='#c9b58a33';c.fillRect(0,100,W,70);}
 }
 for(let i=0;i<90;i++){const x=((noise(i)*1100-t*(cinema?13:60))%1100+1100)%1100-60,y=cinema?285+noise(i+50)*270:100+noise(i+50)*440;ellipse(c,x,y,1+noise(i+2)*2,.7,'#544e3935');}
 if(cinema&&!battle){person(c,142,335,.7,t,{dress:true,coat:'#5f7069',hat:false});person(c,829,315,.55,t+1,{hat:true,coat:'#74543e',carry:true});}
}

function roadPlay(c,t,mode){
 const battle=mode==='dispatch',press=mode==='press';sky(c,t,palettes[battle?11:9],battle);
 // The action plane begins at y95, matching the simulation's upper movement bound.
 c.fillStyle=gradient(c,0,90,0,H,[[0,battle?'#8d9167':'#8c876e'],[1,battle?'#aa9660':'#ae9972']]);c.fillRect(0,90,W,470);
 if(battle){
  shape(c,[[0,94],[0,82],[110,78],[225,81],[365,77],[480,80],[610,76],[780,82],[900,78],[1000,81],[1000,94]],'#5b705b');
  shape(c,[[0,85],[130,83],[230,88],[180,94],[0,94]],'#7e9990');
  for(let i=0;i<13;i++){const x=(i*83-t*12+1200)%1200-100;person(c,x,88,.31,t+i,{coat:i%3?'#d0c3a1':'#52666e',soldier:true,hat:true});line(c,x+3,72,x+17,64,'#484b40',1.4);}
  for(let i=0;i<4;i++)smoke(c,90+i*270,79,t+i,.75,'197,192,169');
  line(c,775,83,775,21,'#786e50',2);shape(c,[[776,22],[818,28+Math.sin(t*3)*3],[814,46],[776,43]],'#d9cfb0');
  for(let i=0;i<75;i++){const x=((noise(i)*1100-t*47)%1100+1100)%1100-50,y=103+noise(i+42)*439;line(c,x,y,x+2,y-4-noise(i)*7,'#717c4b77',1);}
 }else{
  for(let i=0;i<8;i++){const x=((i*147-t*18)%1250+1250)%1250-150;brickBuilding(c,x,87,124,70+noise(i)*39,{tone:i%2?'#91664f':'#8c8269',sign:i===2?(press?'PRINTING OFFICE':'MILL OFFICE'):'',time:t,roof:false});if(i%3===1)smoke(c,x+75,0,t,.7);}
  c.fillStyle='#d4bd8e';c.fillRect(0,90,W,6);line(c,0,96,W,96,'#75684c',2);line(c,0,499,W,499,'#d5c199',5);c.fillStyle='#647260';c.fillRect(0,503,W,57);
  for(let i=0;i<10;i++){const x=((i*125-t*48)%1300+1300)%1300-70;rounded(c,x,508,72,15,2,'#7d8165');}
  if(press){brickBuilding(c,800,88,170,90,{tone:'#aca991',roof:false});c.fillStyle='#c4bda0';for(let x=810;x<970;x+=19)c.fillRect(x,35,5,53);shape(c,[[791,35],[887,10],[979,35]],'#d5ceb0');ellipse(c,887,7,25,19,'#ddd4b4');}
 }
 for(const y of [140,280,420]){rounded(c,20,y-37,960,77,20,battle?'#d5bc780b':'#3b484512');c.save();c.setLineDash([14,34]);line(c,0,y+43,W,y+43,battle?'#e0cf9d28':'#dbc59c2b',1);c.restore();}
 for(let i=0;i<65;i++){const x=((noise(i)*1100-t*64)%1100+1100)%1100-50,y=105+noise(i+50)*383;ellipse(c,x,y,1+noise(i+2)*2,.7,'#544e3935');}
}

function pickup(c,e,t,mode){
 const x=e.x,y=e.y,r=e.r||23,pulse=1+Math.sin(t*4+(e.id?.length||0))*.07;
 c.save();c.translate(x,y);c.scale(pulse,pulse);const glow=c.createRadialGradient(0,0,4,0,0,r*1.7);glow.addColorStop(0,'#ffe8ac40');glow.addColorStop(1,'#ffe8ac00');c.fillStyle=glow;c.fillRect(-r*2,-r*2,r*4,r*4);shadow(c,0,15,r*.8,5,.22);
 c.strokeStyle='#f2d38c77';c.lineWidth=1.5;c.beginPath();c.arc(0,0,r+5,-t,t+Math.PI*1.6);c.stroke();
 if(e.kind==='spool'){
  c.rotate(Math.sin(t*3)*.1);rounded(c,-13,-19,26,38,4,'#bd9a62','#f0d6a1');for(let y=-12;y<=13;y+=4)line(c,-12,y,12,y,'#e9d8b3',3);ellipse(c,0,-20,18,6,'#e4cb92');ellipse(c,0,19,18,6,'#a88049');ellipse(c,0,-20,4,2,'#5f4c38');
 }else if(e.kind==='crate'){
  shape(c,[[-20,-16],[8,-20],[21,-9],[-8,-4]],'#c5a16a','#f1d69e',1);shape(c,[[-20,-16],[-8,-4],[-8,20],[-20,8]],'#8c6d46');shape(c,[[-8,-4],[21,-9],[21,15],[-8,20]],'#b99059');line(c,-4,1,17,13,'#6e5537',3);line(c,18,-4,-5,15,'#6e5537',3);line(c,-14,-11,-14,10,'#d8b57b',2);
 }else{
  c.rotate(Math.sin(t*2+e.x)*.10);rounded(c,-18,-22,36,44,2,e.kind==='chart'?'#d4bd88':'#eee0b5','#84714b');c.fillStyle='#e0c997';c.fillRect(13,-21,4,41);
  if(e.kind==='chart'){c.strokeStyle='#766e4e';c.lineWidth=1.5;c.beginPath();c.moveTo(-11,13);c.bezierCurveTo(-14,4,12,3,2,-13);c.stroke();line(c,-11,-7,-3,-11,'#8a7851',1);label(c,'N',7,-10,7,'#645c43');}
  else{for(let i=0;i<4;i++)line(c,-11,-9+i*6,10,-9+i*6,'#9e8b61',1);if(e.kind==='dispatch'){ellipse(c,6,11,6,6,'#a3503c');}else if(e.kind==='newspaper'||e.kind==='paper'){label(c,'NEWS',0,-13,7,'#3d4e47','center');}else{ellipse(c,5,11,5,5,'#af7950');}}
 }
 c.restore();
}
function hazard(c,e,t){
 const x=e.x,y=e.y,r=e.r||26;c.save();c.translate(x,y);shadow(c,0,12,r,6,.28);
 if(e.kind==='rock'){
  shape(c,[[-r,-4],[-r*.6,-r*.65],[r*.2,-r*.8],[r,-r*.1],[r*.7,r*.5],[-r*.4,r*.7]],'#6e7c77','#b1b6a2',1.5);shape(c,[[-r*.6,-r*.65],[r*.2,-r*.8],[r*.35,0],[-r*.2,r*.2]],'#8f9a8e');line(c,-r-6,13,r+5,13,'#d7e4cf77',2);
 }else if(e.kind==='log'){
  c.rotate(-.22);rounded(c,-r*1.3,-11,r*2.6,23,8,'#725a3b','#b49c68');for(let i=0;i<4;i++)line(c,-r*1.2,-6+i*5,r,-9+i*5,'#af8c55',1);ellipse(c,r*1.2,1,9,12,'#c5a36a');ellipse(c,r*1.2,1,4,6,'#896740');
 }else if(e.kind==='gear'){
  c.rotate(t*3);for(let i=0;i<10;i++){c.save();c.rotate(i*TAU/10);c.fillStyle='#a76b43';c.fillRect(r*.62,-5,r*.45,10);c.restore();}ellipse(c,0,0,r*.8,r*.8,'#bf9963');ellipse(c,0,0,r*.5,r*.5,'#334d4c');ellipse(c,0,0,r*.2,r*.2,'#bb965e');
 }else if(e.kind==='volley'||e.kind==='bullet'){
  c.strokeStyle='#f4ad7266';c.lineWidth=9;c.beginPath();c.moveTo(0,0);c.lineTo(70,-4);c.stroke();line(c,-15,0,62,-3,'#ffdb9c',2);ellipse(c,-14,0,4,3,'#f8e8c1');
 }else{
  // A handcart blocks a lane, with enough visual mass to read at speed.
  rounded(c,-r,-r*.5,r*2,r,3,'#886b47','#c6aa75');for(let i=-1;i<=1;i++)line(c,i*r*.6,-r*.5,i*r*.6,r*.5,'#5c513b',2);wheel(c,-r*.65,r*.6,10,-t*5,'#484f42');wheel(c,r*.65,r*.6,10,-t*5,'#484f42');line(c,r,-r*.2,r+19,-r*.7,'#8b754e',4);rounded(c,-r*.7,-r*.9,r*.8,r*.5,1,'#b49b69');
 }
 c.restore();
}
function telegraph(c,e,t){
 if(!e.telegraph)return;const a=.28+Math.sin(t*11)*.1;c.save();c.setLineDash([15,10]);line(c,0,e.y,W,e.y,`rgba(255,175,107,${a})`,2);c.setLineDash([]);shape(c,[[955,e.y-18],[980,e.y],[955,e.y+18]],'#efb575');label(c,'!',961,e.y+5,15,'#342f2c','center');c.restore();
}
function drawEffects(c,run,t){
 for(const ef of run.effects||[]){const age=ef.age??ef.time??0,life=clamp(ef.life===undefined?1-age/(ef.duration||.7):ef.life/.8,0,1),x=ef.x??run.player?.x??220,y=ef.y??run.player?.y??300;if(!life)continue;c.save();c.globalAlpha=life;const good=['collect','work','decision','cover','finish','success'].includes(ef.kind),col=good?'#f2d38f':'#f09568';for(let i=0;i<9;i++){const a=i*2.4,dist=(1-life)*70;ellipse(c,x+Math.cos(a)*dist,y+Math.sin(a)*dist*.7,2+life*2,2+life*2,col);}c.strokeStyle=col;c.lineWidth=2;c.beginPath();c.arc(x,y,12+(1-life)*37,0,TAU);c.stroke();if(ef.text||ef.label)label(c,ef.text||ef.label,x,y-25-(1-life)*25,15,col,'center');c.restore();}
 if(run.player?.dash>0){const x=run.player.x,y=run.player.y;for(let i=0;i<5;i++){line(c,x-40-i*11,y-26+i*14,x-80-i*8,y-26+i*14,'#f7dfa16e',2);}}
}
function gameplay(c,run,t,mode){
 const entities=run.entities||[];
 for(const e of entities)if(!e.done)telegraph(c,e,t);
 const water=mode==='canal'||mode==='river';
 for(const e of entities){if(e.done)continue;if(['spool','crate','chart','paper','petition','dispatch','newspaper','token'].includes(e.kind))pickup(c,e,t,mode);else hazard(c,e,t);}
 const p=run.player||{x:220,y:300};const flash=(run.invulnerable||p.invulnerable||0)>0&&Math.sin(t*24)<0;
 c.save();c.globalAlpha=flash?.5:1;
 if(water){if(mode==='canal')canalTow(c,p.x,p.y,.8,Math.min(950,p.x+175),526,.55,t);boat(c,p.x,p.y,.8,t,{river:mode==='river'});}
 else if(mode==='factory')person(c,p.x-12,p.y+45,.85,t,{dress:true,hat:false,coat:'#d1ac74',arm:run.actionCooldown>0?.7:0,carry:false});
 else{c.save();if(p.duck){c.translate(0,p.y+20);c.scale(1,.65);c.translate(0,-p.y-20);}person(c,p.x,p.y+38,.85,t,{coat:mode==='dispatch'?'#c19b64':mode==='press'?'#2d5863':'#c0a36f',dress:mode==='courier',hat:mode!=='courier',carry:true,running:true,skin:mode==='dispatch'?'#b68b62':'#c59b77'});c.restore();}
 c.restore();
 // Quiet player locator remains visible when an animated sprite overlaps scenery.
 const markerY=water?p.y-45:p.y-67;shape(c,[[p.x-6,markerY],[p.x+6,markerY],[p.x,markerY+8]],'#f5d58c');
 drawEffects(c,run,t);
}

function scenicMap(c,t,chapter,mission){
 c.fillStyle=gradient(c,0,0,W,H,[[0,'#243e49'],[1,'#49605c']]);c.fillRect(0,0,W,H);
 for(let x=20;x<W;x+=52)line(c,x,0,x,H,'#c5d6be0b',1);for(let y=10;y<H;y+=52)line(c,0,y,W,y,'#c5d6be0b',1);
 c.save();c.translate(30,-20);c.fillStyle='#b4ad83';c.strokeStyle='#e3d4a5';c.lineWidth=2;c.beginPath();c.moveTo(139,91);c.lineTo(252,65);c.lineTo(370,80);c.lineTo(493,66);c.lineTo(551,95);c.lineTo(657,74);c.lineTo(720,122);c.lineTo(781,152);c.lineTo(808,206);c.lineTo(774,252);c.lineTo(718,306);c.lineTo(696,360);c.lineTo(654,405);c.lineTo(601,403);c.lineTo(576,447);c.lineTo(535,406);c.lineTo(505,354);c.lineTo(449,373);c.lineTo(407,406);c.lineTo(356,421);c.lineTo(328,382);c.lineTo(288,356);c.lineTo(267,308);c.lineTo(230,302);c.lineTo(218,262);c.lineTo(192,249);c.lineTo(177,196);c.lineTo(150,166);c.closePath();c.fill();c.stroke();
 c.strokeStyle='#7b876a';c.lineWidth=4;for(let i=0;i<5;i++){c.beginPath();c.moveTo(300+i*13,120);c.bezierCurveTo(280+i*14,190,370+i*12,210,335+i*14,320);c.stroke();}c.strokeStyle='#b4d3d0';c.lineWidth=3;c.beginPath();c.moveTo(526,167);c.bezierCurveTo(515,245,562,277,529,354);c.stroke();
 const river=mission.mode==='river',route=chapter===9?[[670,176],[632,185],[590,192],[556,207]]:river?[[530,266],[470,221],[416,175],[353,154],[287,193],[209,173]]:mission.mode==='dispatch'?[[530,345],[487,361],[460,377]]:[[225,238],[340,280],[491,257],[685,234]];
 c.strokeStyle='#fff0b8';c.lineWidth=3;c.setLineDash([6,6]);c.beginPath();route.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();c.setLineDash([]);
 const step=(t*.18)%1,seg=Math.min(route.length-2,Math.floor(step*(route.length-1))),frac=step*(route.length-1)-seg,a=route[seg],b=route[seg+1],mx=a[0]+(b[0]-a[0])*frac,my=a[1]+(b[1]-a[1])*frac;
 const glow=c.createRadialGradient(mx,my,1,mx,my,24);glow.addColorStop(0,'#ffe8a799');glow.addColorStop(1,'#ffe8a700');c.fillStyle=glow;c.fillRect(mx-25,my-25,50,50);ellipse(c,mx,my,4,4,'#fff5d2');
 const labels=chapter===9?[['BUFFALO',552,230],['ALBANY',632,168],['LOWELL',704,162],['ATLANTIC',835,250]]:river?[['ST. LOUIS',551,284],['MISSOURI RIVER',459,208],['PACIFIC',135,225]]:mission.mode==='dispatch'?[['TEXAS',481,323],['SAN JACINTO',489,401],['MEXICO',430,448]]:[['CALIFORNIA',218,220],['MEXICAN CESSION',339,305],['WASHINGTON',717,249]];
 for(const [s,x,y]of labels)label(c,s,x,y,11,s==='ATLANTIC'||s==='PACIFIC'?'#cedbd0':'#243d40','center');c.restore();
 // An engraved compass and a moving chart ruler make the map an actual shot.
 c.save();c.translate(892,129);c.rotate(-.1);for(let i=0;i<8;i++){c.rotate(TAU/8);shape(c,[[0,-39],[-5,0],[0,10],[5,0]],i%2?'#c4c9aa':'#e4d9af');}ellipse(c,0,0,4,4,'#263e42');label(c,'N',0,-48,12,'#dfd5af','center');c.restore();
 label(c,'SCHEMATIC ROUTE · NOT TO SCALE',55,65,10,'#e7dfbc');
}
function cinematic(c,run,t,chapter,mission,beat){
 const mode=mission.mode||'factory',shot=beat?.shot||'wide';
 if(shot==='map'){scenicMap(c,t,chapter,mission);return;}
 if(mode==='dispatch'&&String(beat?.speaker||'').startsWith('THE ALAMO')){alamoScene(c,t);return;}
 const focus=beat?.focus==='other'?680:beat?.focus==='world'?510:340;
 const water=mode==='canal'||mode==='river';
 // Each shot re-frames the same inhabited stage rather than displaying a still card.
 c.save();let zoom=shot==='close'?1.63:shot==='action'?1.15:1.02;
 zoom+=Math.sin(t*.33)*.012;const focusY=water?280:280;
 const pan=shot==='wide'?Math.sin(t*.18)*35:Math.sin(t*.15)*8;
 const center=clamp(focus+pan,W/(2*zoom),W-W/(2*zoom));
 c.translate(500,260);c.scale(zoom,zoom);c.translate(-center,-focusY);
 if(mode==='factory')factoryBackground(c,t,true);else if(water)waterBackground(c,t,mode==='river',true);else roadBackground(c,t,mode,true);
 if(mode==='factory'){
  loom(c,410,380,1.25,t);person(c,340,390,1.25,t,{dress:true,hat:false,coat:'#bda77e',arm:Math.sin(t*2)*.3});person(c,655,383,1.18,t+.8,{coat:'#4a6564',hat:true,carry:shot==='close',arm:.1});
 }else if(water){
  const boatX=410+Math.sin(t*.35)*18;if(mode==='canal')canalTow(c,boatX,358,1.5,850,368,.9,t);
  boat(c,boatX,358,1.5,t,{river:mode==='river',cinema:true});person(c,698,336,1.2,t,{coat:mode==='river'?'#a58a60':'#536965',hat:true,arm:.1,carry:true});
  if(mode==='river'){tree(c,745,348,1,t,true);person(c,745,358,1.1,t+.6,{coat:'#a58a60',hat:false,dress:true,skin:'#a87d59',arm:.3});}
 }else if(mode==='dispatch'){
  for(let i=0;i<6;i++){person(c,450+i*45,328+(i%2)*13,.65,t+i,{soldier:true,coat:i%2?'#607178':'#c6b99a',hat:true,running:shot==='action'});}
  person(c,333+Math.sin(t)*3,398,1.4,t,{coat:'#ae8b59',hat:true,carry:true,running:shot==='action'});person(c,671,385,1.2,t+.5,{coat:'#465866',hat:true,arm:.4,soldier:true});
  if(shot==='action'){for(let i=0;i<4;i++){const pulse=Math.max(0,Math.sin(t*3+i*2))**14;if(pulse>.01){c.globalAlpha=pulse;ellipse(c,560+i*80,305,20,9,'#ffdaa1');c.globalAlpha=1;}}}
 }else{
  if(mode==='press')printingPress(c,504,360,1.1,t);
  person(c,333+Math.sin(t*.5)*4,392,1.3,t,{coat:mode==='press'?'#335967':'#a68c65',dress:mode==='courier',hat:mode!=='courier',carry:true,running:shot==='action'});person(c,672,388,1.18,t+.8,{coat:'#627c73',hat:true,carry:true,arm:Math.sin(t*2)*.2});
  if(mode==='courier'){for(let i=0;i<4;i++)person(c,430+i*48,324,.64,t+i,{dress:i%2===0,hat:i%2!==0,coat:i%2?'#6c6b5b':'#a7906f',carry:true,running:shot==='action'});}
 }
 c.restore();
}
function alamoScene(c,t){
 c.save();const zoom=1.03+Math.sin(t*.15)*.007;c.translate(500,250);c.scale(zoom,zoom);c.translate(-500-Math.sin(t*.15)*12,-250);
 sky(c,t,palettes[11],true);lowHorizon(c,t,true);c.fillStyle=gradient(c,0,240,0,H,[[0,'#8c8966'],[1,'#a18c61']]);c.fillRect(0,240,W,320);
 // The unfinished 1836 church is shown with a broken, flat upper wall. The famous
 // rounded gable added by the U.S. Army in 1850 is deliberately absent.
 c.fillStyle='#b3a27b';c.fillRect(264,280,536,68);line(c,264,280,800,280,'#d3c49a',5);
 shape(c,[[532,344],[532,190],[554,190],[554,182],[575,188],[596,180],[617,186],[637,178],[655,187],[680,184],[696,192],[696,344]],'#c4b48d','#e4d5aa',2);
 c.fillStyle='#b0a17d';c.fillRect(549,197,130,147);for(let y=208;y<340;y+=17){line(c,535,y,693,y,'#80795933',1);for(let x=537+(y%34)*.5;x<695;x+=32)line(c,x,y,x,y+17,'#80795933',1);}
 for(const x of [558,666]){c.fillStyle='#d8c79d';c.fillRect(x,211,9,130);c.fillRect(x-4,214,17,6);c.fillRect(x-4,322,17,8);}
 c.fillStyle='#393b31';c.beginPath();c.moveTo(592,344);c.lineTo(592,296);c.arc(616,296,24,Math.PI,0);c.lineTo(640,344);c.closePath();c.fill();c.strokeStyle='#d6c399';c.lineWidth=5;c.stroke();
 rounded(c,604,232,24,21,2,'#4c5040','#d8c69a');for(const x of [574,650]){c.fillStyle='#877f5e';c.fillRect(x,269,10,24);}
 for(let i=0;i<8;i++){const x=301+i*25;person(c,x,340,.48,t+i*.4,{coat:'#536877',hat:true,soldier:true,running:false});}
 for(let i=0;i<4;i++)smoke(c,360+i*110,284,t+i,.9,'174,168,145');for(let i=0;i<10;i++){const x=280+i*47;shape(c,[[x,350],[x+13,343],[x+26,350],[x+8,356]],'#b2a27d');}
 tree(c,170,319,.65,t);person(c,215,385,.9,t,{coat:'#647583',hat:true,soldier:true});c.restore();
}
function printingPress(c,x,y,s,t){
 c.save();c.translate(x,y);c.scale(s,s);shadow(c,0,18,57,15,.25);c.fillStyle='#243e42';c.fillRect(-49,-115,11,132);c.fillRect(40,-115,11,132);c.fillRect(-54,-118,110,12);c.fillRect(-53,-28,106,10);c.fillRect(-42,-16,8,40);c.fillRect(37,-16,8,40);
 line(c,0,-115,0,-56,'#b3b497',8);const height=-45+Math.sin(t*2.3)*6;rounded(c,-37,height,73,9,1,'#9f9a74');rounded(c,-35,-29,70,3,1,'#ded2ae');line(c,0,-85,53,-97+Math.sin(t*2.3)*10,'#c0ae7a',5);ellipse(c,53,-97+Math.sin(t*2.3)*10,5,5,'#e1c590');for(let i=0;i<6;i++)rounded(c,-65+i*1.5,17-i*3,42,3,0,'#e7d6a7');c.restore();
}
function atmosphere(c,t,chapter,cinema){
 // Restrained dust and edge shading unify the illustrated layers.
 if(cinema){for(let i=0;i<23;i++){const x=(noise(i+71)*1100+t*(3+noise(i)*5))%1100-40,y=(noise(i+4)*600-t*2)%600;ellipse(c,x,y,.7+noise(i)*1.2,.7+noise(i)*1.2,'#e9d7a332');}}
 const vg=c.createRadialGradient(500,255,130,500,255,620);vg.addColorStop(0,'#071b2600');vg.addColorStop(.7,'#071b2609');vg.addColorStop(1,cinema?'#071b2677':'#071b2648');c.fillStyle=vg;c.fillRect(0,0,W,H);
 if(cinema){c.fillStyle=gradient(c,0,330,0,H,[[0,'#10232a00'],[1,'#10232aab']]);c.fillRect(0,330,W,H-330);c.fillStyle='#0d1d24';c.fillRect(0,0,W,18);c.fillRect(0,H-18,W,18);}
}

export function drawWorld(ctx,run={},options={}){
 const width=options.width||W,height=options.height||H,mission=options.mission||run.mission||{},chapter=options.chapter||mission.chapter||(String(mission.id||'').includes('11')?11:9),mode=mission.mode||'factory',time=Number.isFinite(options.time)?options.time:run.time||0,cinema=!!options.cinema;
 ctx.save();ctx.scale(width/W,height/H);ctx.lineJoin='round';ctx.lineCap='round';
 if(cinema)cinematic(ctx,run,time,chapter,mission,options.beat);
 else{if(mode==='factory')factoryBackground(ctx,time);else if(mode==='canal'||mode==='river')waterBackground(ctx,time,mode==='river');else roadBackground(ctx,time,mode);gameplay(ctx,run,time,mode);}
 atmosphere(ctx,time,chapter,cinema);ctx.restore();
}

export function drawPoster(ctx,chapter,width=W,height=H,time=0){
 const mission={id:chapter===11?'c11-river':'c9-factory',chapter,mode:chapter===11?'river':'factory'};
 drawWorld(ctx,{mission},{width,height,time,chapter,mission,cinema:true,beat:{shot:'wide',focus:'world'}});
}
