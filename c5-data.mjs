// Original fictional cast and encounters; the historical sequence is 1763–1774.
export const CAST={
 ROWAN:{name:'Rowan Vale',role:'The courier · you',color:0x315663,voice:'am_fenrir',speed:1.03,lang:'en-us',bio:'A printer’s apprentice in 1763. Eleven years later, Rowan must decide what is worth carrying out of a city that is closing around them.'},
 MARA:{name:'Mara Reed',role:'The organizer',color:0xbb8a48,voice:'af_heart',speed:1.02,lang:'en-us',bio:'A weaver who turns a boycott into food, cloth, and work. She measures a cause by the people it keeps alive.'},
 ISAIAH:{name:'Isaiah Mercer',role:'The harbor pilot',color:0x46584f,voice:'am_michael',speed:1.04,lang:'en-us',bio:'A free Black dockworker and sailor. He knows every channel in the harbor—and asks who will actually receive the liberty everyone promises.'},
 WARD:{name:'Elias Ward',role:'The veteran',color:0x796550,voice:'bm_george',speed:1.01,lang:'en-gb',bio:'A veteran of Britain’s last war. He taught Rowan to read terrain. Now he must teach the crew how to survive the peace.'},
 THOMAS:{name:'Thomas Vale',role:'The brother',color:0x963e36,voice:'bm_fable',speed:1.04,lang:'en-gb',bio:'Rowan’s older brother works for customs. Loyalty to Britain and loyalty to his family were never supposed to become different things.'}
};
export const TERMS=[
 {id:'massacre',term:'Boston Massacre',definition:'A confrontation between a Boston crowd and British soldiers on March 5, 1770, that left five people dead, including Crispus Attucks.',memory:'The rescue in King Street: five deaths, March 5, 1770.',question:'A crowd confronts British soldiers in Boston on March 5, 1770. Five people die, including Crispus Attucks. What is this event?'},
 {id:'coercive',term:'Coercive Acts',definition:'Four punitive laws: the Administration of Justice Act, Massachusetts Government Act, Boston Port Act, and Quartering Act. Lord North’s government used them to punish Massachusetts after the destruction of the tea.',memory:'The harbor closes; meetings, trials, and troop housing change.',question:'Which four laws punished Massachusetts after the destruction of the tea and the refusal to pay for it?'},
 {id:'committees',term:'Committees of Correspondence',definition:'Extralegal colonial committees that coordinated resistance and exchanged information, functioning as shadow governments outside royal authority.',memory:'The couriers turn separate towns into a resistance network.',question:'What connected towns through extralegal committees that coordinated resistance outside royal government?'},
 {id:'daughters',term:'Daughters of Liberty',definition:'Colonial women, including well-born organizers, who led resistance to British imports through boycotts and domestic production.',memory:'Mara’s spinning room makes the boycott possible.',question:'Which women’s movement organized resistance to British goods and supported production of homespun cloth?'},
 {id:'direct',term:'direct tax',definition:'A tax paid directly by consumers, rather than indirectly through merchants’ higher prices.',memory:'Rowan pays for the stamp on the paper.',question:'Rowan must pay a stamp tax on a legal document. The consumer pays the tax directly. What kind of tax is it?'},
 {id:'indirect',term:'indirect tax',definition:'A tax imposed on businesses rather than directly on consumers; businesses can pass the cost on through higher prices.',memory:'A merchant pays an import duty; your cloth costs more.',question:'A merchant pays an import duty and raises the price charged to customers. What kind of tax is the duty?'},
 {id:'intolerable',term:'Intolerable Acts',definition:'The Patriots’ name for the Coercive Acts together with the Quebec Act.',memory:'Four Coercive Acts plus the Quebec Act.',question:'What name did Patriots give to the Coercive Acts together with the Quebec Act?'},
 {id:'loyalists',term:'Loyalists',definition:'American colonists who remained loyal to Great Britain.',memory:'Thomas loves his brother and still supports Britain.',question:'Thomas is an American colonist who remains loyal to Great Britain. Which term describes his political allegiance?'},
 {id:'circular',term:'Massachusetts Circular',definition:'Samuel Adams’s letter arguing that taxation without representation was unconstitutional and encouraging other colonies to boycott British goods.',memory:'Carry the letter alongside the homespun cloth.',question:'Which letter by Samuel Adams challenged taxation without representation and encouraged other colonies to boycott British goods?'},
 {id:'representation',term:'no taxation without representation',definition:'The principle, articulated in the Virginia Stamp Act Resolutions, that colonists should have representation in Parliament if Parliament taxes them.',memory:'The disputed issue is who gets a voice, not only the price.',question:'Which principle argued that Parliament should not tax colonists who lacked representation there?'},
 {id:'nonimport',term:'non-importation movement',definition:'A widespread colonial boycott of British goods.',memory:'Keep local goods moving while the import stalls stand empty.',question:'Colonists agree to stop buying imported British goods across many towns. What is this movement called?'},
 {id:'line',term:'Proclamation Line',definition:'The boundary along the Appalachian Mountains established by the Proclamation of 1763, west of which British colonists were forbidden to settle.',memory:'The painted boundary in the mountain pass.',question:'Which boundary along the Appalachians restricted British colonial settlement to its east in 1763?'},
 {id:'sons',term:'Sons of Liberty',definition:'Artisans, shopkeepers, and small merchants who opposed the Stamp Act while considering themselves British patriots.',memory:'Tradespeople protect the press; they are not yet declaring independence.',question:'Which group of artisans, shopkeepers, and small merchants opposed the Stamp Act and considered themselves British patriots?'},
 {id:'suffolk',term:'Suffolk Resolves',definition:'A Massachusetts resistance plan opposing the Intolerable Acts. It called for preparing militias and for non-importation, non-exportation, and non-consumption, and influenced the First Continental Congress’s resistance program.',memory:'The final dispatch: prepare militias and stop buying, importing, and exporting.',question:'Which Massachusetts resistance plan called for militia preparation and broad economic resistance and influenced the First Continental Congress?'},
 {id:'courts',term:'vice-admiralty courts',definition:'British royal courts without juries that handled maritime disputes, including enforcement of trade laws.',memory:'Isaiah’s cargo case goes before a royal judge, with no jury.',question:'In which British royal courts could a colonial maritime case be tried without a jury?'}
];
const goal=(x,z,label,speaker,text,terms=[],kind='interact',hold=1.2)=>({x,z,label,speaker,text,terms,kind,hold});
export const CHAPTER5=[
 {id:'line',title:'A line through the pines',year:'1763',place:'Appalachian frontier',genre:'ESCORT / FIELD COMBAT',theme:'forest',mode:'field',music:'ashes',tagline:'The war is over. The frontier is not at peace.',start:[0,32],armed:true,cast:['ROWAN','WARD'],intro:[
  ['WARD','The war is won, Rowan. Now London has an empire it cannot afford.'],
  ['ROWAN','My brother says the west is ours. Our family could start again.'],
  ['WARD','Native nations still hold their lands. A British map does not make them disappear. Stay close.']
 ],goals:[
  goal(-11,17,'Recover Ward’s medical bag','WARD','Road thieves. Use the rocks for cover. Take the bag and keep moving.',[],'supply'),
  goal(10,2,'Reach the marked boundary','ROWAN','The Proclamation Line. No British settlement west of the Appalachians. So much for our new beginning.',['line']),
  goal(-9,-15,'Clear a route for Ward','WARD','Britain wants to prevent another frontier war. The settlers see a promise taken away.',[],'rally',1.5),
  goal(2,-34,'Signal the eastbound wagon','ROWAN','Then we go east. Thomas has work at the harbor. There must be a place for me there.',[],'extract')
 ],outro:[['WARD','You carried the bag when it mattered. A good courier remembers what is inside.'],['ROWAN','A bag today. Maybe something that changes things tomorrow.']],enemies:[[-10,9],[12,-8],[-13,-24]],bark:['WARD','Look for the pale lantern. It marks your next stop.']},
 {id:'ink',title:'Ink under pressure',year:'1765',place:'Boston · printing quarter',genre:'INFILTRATION / PRINT RUN',theme:'city',mode:'stealth',music:'crown',start:[0,32],cast:['ROWAN','ISAIAH','THOMAS'],intro:[
  ['THOMAS','The Sugar Act lowered the molasses duty, but customs is finally enforcing it. We have war debts to pay.'],
  ['ISAIAH','And my cargo case goes to a vice-admiralty court. A royal court for trade at sea. No jury.'],
  ['ROWAN','Now stamps on paper, too. Help me get the press running before the watch closes the street.']
 ],goals:[
  goal(-12,18,'Collect Isaiah’s seized-cargo notice','ISAIAH','No neighbors on a jury. Just the crown’s judge deciding our maritime case.',['courts'],'document'),
  goal(12,5,'Take the stamped paper','ROWAN','The consumer pays for the stamp. A direct tax, right on the page.',['direct'],'document'),
  goal(-9,-12,'Run the hidden press','ISAIAH','The Sons of Liberty paid for this ink. Artisans, shopkeepers, small merchants. British patriots opposing the Stamp Act.',['sons'],'press',2.5),
  goal(10,-31,'Deliver the printed protest','ROWAN','No taxation without representation. Virginia’s resolutions put it plainly: if Parliament taxes us, where is our voice?',['representation'],'extract')
 ],outro:[['THOMAS','You put our name on those sheets?'],['ROWAN','I put the argument on them. You taught me there was a difference.']],enemies:[[-14,7],[13,-5],[-10,-23],[8,19]],bark:['ISAIAH','Crouch behind crates. A thrown stone will pull a patrol away.']},
 {id:'homespun',title:'A different kind of resistance',year:'1768',place:'Mara’s workshop · Boston',genre:'WORKSHOP RUSH',theme:'city',mode:'workshop',music:'haven',start:[0,32],cast:['ROWAN','MARA','ISAIAH'],intro:[
  ['MARA','A boycott is easy to promise. Try keeping twelve families clothed through one.'],
  ['ROWAN','Tell me where you need me.'],
  ['MARA','Flax to the wheel. Yarn to the loom. Cloth to the door. Keep the room moving.']
 ],goals:[],outro:[['MARA','The Daughters of Liberty will keep making. The couriers will keep moving. That is how a boycott survives.'],['ISAIAH','And when you write about liberty, leave room for the people still denied it.']],
 workshopLines:[['MARA','The Daughters of Liberty organize the spinning and the boycott. We can make what we refuse to import.',['daughters']],['ROWAN','No British imports. Every local delivery keeps the non-importation movement alive.',['nonimport']],['ISAIAH','Townshend’s import duties fall on merchants first. An indirect tax: they pass the cost to customers.',['indirect']],['MARA','Take Samuel Adams’s Massachusetts Circular with the next bundle. It challenges taxation without representation and asks other colonies to boycott.',['circular']]],bark:['MARA','The next wheel is waiting. Keep moving; we have each other.']},
 {id:'kingstreet',title:'Five names in the snow',year:'5 March 1770',place:'King Street · Boston',genre:'CIVILIAN RESCUE',theme:'snow',mode:'rescue',music:'debt',start:[0,30],cast:['ROWAN','MARA','ISAIAH'],intro:[
  ['ISAIAH','A crowd at the customs house. Soldiers in the street. Rowan, get Mara out of here.'],
  ['ROWAN','Those shots... Isaiah!'],
  ['MARA','He is hit! Rowan, down! Isaiah, look at me. Stay with us.'],
  ['ISAIAH','My shoulder. I am here... I am still here.'],
  ['MARA','Keep pressure here. I will get him under cover. Help the others. The wounded go to the blue lantern. Go!']
 ],goals:[
  goal(-12,18,'Help the injured printer','MARA','The confrontation will be remembered as the Boston Massacre. Five people died, including Crispus Attucks.',['massacre'],'rescue',1),
  goal(0,29,'Carry the printer to shelter','ROWAN','I have you. Just keep looking at the light.',[],'shelter',.8),
  goal(13,2,'Reach the trapped neighbor','ISAIAH','Through the side lane. Keep clear of the panic in the square.',[],'rescue',1),
  goal(0,29,'Bring the neighbor to shelter','MARA','They are breathing. Go. There is someone by the carriage.',[],'shelter',.8),
  goal(-8,-15,'Help the wounded dockhand','ROWAN','Nobody gets left here if we can carry them.',[],'rescue',1),
  goal(0,29,'Bring the dockhand to shelter','ISAIAH','Attucks cannot be brought back. Tell their names. Tell the truth.',[],'shelter',.8)
 ],outro:[['ROWAN','You could have died in that street. The whole city will read about this.'],['ISAIAH','Then write what happened. Five people are dead. They are not ink for your argument.'],['MARA','The bleeding has stopped. He is coming home with us.']],enemies:[],bark:['MARA','Stay away from the moving crowd. Sprint when your hands are free.']},
 {id:'tea',title:'Only the tea',year:'16 December 1773',place:'Griffin’s Wharf · Boston',genre:'SHIPBOARD HEIST',theme:'ship',mode:'heist',music:'molasses',start:[0,25],cast:['ROWAN','ISAIAH','THOMAS'],intro:[
  ['ISAIAH','The Committees of Correspondence linked the towns. Outside royal government, we plan our resistance together.'],
  ['ROWAN','The Tea Act makes Company tea cheaper, but the old tax remains. Buying it concedes the principle.'],
  ['ISAIAH','Destroy the tea, not the ship. No harm to the crew. Stay off the lantern beams.']
 ],goals:[
  goal(-7,15,'Take the coordinated signal','ROWAN','One signal from the committees. The port cities are acting together.',['committees'],'document'),
  goal(7,3,'Break open the first tea chest','ISAIAH','The East India Company gets direct sales and an advantage over our merchants. Cheap tea still carries the tax.',[],'tea',2.1),
  goal(-7,-12,'Empty the second chest','ROWAN','Only the tea. Leave their personal belongings.',[],'tea',2.1),
  goal(7,-29,'Clear the final chest','ISAIAH','The Dartmouth, Eleanor, and Beaver. All their tea goes into the water tonight.',[],'tea',2.1),
  goal(0,25,'Return to the waiting skiff','THOMAS','Some of us remain loyal to Great Britain, Rowan. Loyalists. Does that make us your enemy now?',['loyalists'],'extract')
 ],outro:[['ROWAN','You are my brother. That does not mean I can stand where you stand.'],['THOMAS','Then remember that when the next orders come.']],enemies:[[-8,-4],[8,-19]],bark:['ISAIAH','Watch the lantern sweep. Wait behind a chest, then move.']},
 {id:'harbor',title:'A city without a harbor',year:'1774',place:'Blockaded Boston',genre:'HARBOR EVASION / RELIEF',theme:'harbor',mode:'boat',music:'molasses',start:[0,32],cast:['ROWAN','MARA','ISAIAH'],intro:[
  ['MARA','Lord North’s answer to the tea: the Coercive Acts. The port is closed until the loss is paid.'],
  ['ISAIAH','No trade means no wages. Other colonies are sending relief. We bring it in through the shallows.'],
  ['ROWAN','If they mean to leave Boston alone, let us disappoint them.']
 ],goals:[],boatLines:[['MARA','The Port Act closes the harbor. The Government Act tightens crown control. Two of the four Coercive Acts.',['coercive']],['ISAIAH','The Justice Act allows officials’ trials to leave Massachusetts. The Quartering Act expands troop housing. Four punishments in all.',[]],['ROWAN','Patriots call the Coercive Acts, together with the Quebec Act, the Intolerable Acts.',['intolerable']],['MARA','They meant to isolate Massachusetts. Instead, more colonies are sending help.',[]]],outro:[['ISAIAH','Thomas passed me an order. They are coming for the dispatches at the press.'],['MARA','Then we move them tonight. Every town is waiting.']],bark:['ISAIAH','Low wake through the lantern beams. Full oars only in open water.']},
 {id:'dispatch',title:'The last dispatch',year:'September 1774',place:'Boston · the road out',genre:'EXTRACTION / LAST STAND',theme:'fire',mode:'finale',music:'quebec',start:[0,32],armed:true,cast:['ROWAN','MARA','WARD','THOMAS'],intro:[
  ['WARD','The press is lost. The words are not. Rowan, take the dispatch.'],
  ['MARA','The Suffolk Resolves: prepare the militias. Refuse imports, exports, and consumption. Congress must hear us.'],
  ['THOMAS','The west gate will be open for one minute. I can give you that much. Go.']
 ],goals:[
  goal(-10,20,'Save the Suffolk dispatch','ROWAN','The Suffolk Resolves. Massachusetts’s resistance plan will help shape the First Continental Congress’s response.',['suffolk'],'document',1),
  goal(11,5,'Release Mara from the fallen beam','MARA','I can walk. Slowly. Save your strength for the road.',[],'rescue',1.6),
  goal(-10,-12,'Reach Ward’s position','WARD','I am staying to draw the patrol. Keep your people together. That is the whole mission.',[],'rally',1.2),
  goal(7,-33,'Get the dispatch beyond the gate','ROWAN','We are through. Isaiah, take the papers. I am going back for him.',[],'extract',1)
 ],outro:[['THOMAS','Ward surrendered. Alive. I will find where they take him. You have to keep moving.'],['MARA','We did not save the press. We saved what it was for.']],enemies:[[-12,10],[12,-8],[-13,-24],[8,-20]],bark:['WARD','Do not stand in the open. Breathe behind cover; then push.']}
];
export const PROLOGUE=[['ROWAN','Boston. Seventeen seventy-four. The harbor is closed. Our press is burning.'],['MARA','You always said a page could travel farther than a soldier. Prove it.'],['ROWAN','Eleven years ago, I thought I was carrying messages. I was carrying the first pieces of a revolution.']];
export const EPILOGUE=[['ISAIAH','Philadelphia. The First Continental Congress backs resistance. The colonies are learning to act together.'],['MARA','The Association means more than refusing imports. No exports. No consumption. Our workshops have work to do.'],['THOMAS','I still believe in Britain. I still believe you are my brother. Do not make me choose which one survives.'],['ROWAN','A press can be rebuilt. A city can be fed. And a story does not end just because someone orders it to.']];
export function scriptLines(){
 const lines=[];const add=(id,line)=>lines.push({id,speaker:line[0],text:line[1],...CAST[line[0]]});
 PROLOGUE.forEach((l,i)=>add('prologue.'+i,l));EPILOGUE.forEach((l,i)=>add('epilogue.'+i,l));
 for(const m of CHAPTER5){m.intro.forEach((l,i)=>add(m.id+'.in'+i,l));m.outro.forEach((l,i)=>add(m.id+'.out'+i,l));m.goals.forEach((g,i)=>add(m.id+'.goal'+i,[g.speaker,g.text]));(m.workshopLines||m.boatLines||[]).forEach((l,i)=>add(m.id+'.event'+i,l));add(m.id+'.hint',m.bark);}
 add('retry',['WARD','Take a breath. Remember the cover. We try again from the last checkpoint.']);
 return lines;
}
export function quizDeck(count=5,rng=Math.random){
 const shuffle=a=>a.map(v=>({v,k:rng()})).sort((a,b)=>a.k-b.k).map(x=>x.v);
 return shuffle(TERMS).slice(0,count).map(t=>({id:t.id,question:t.question,options:shuffle([t,...shuffle(TERMS.filter(o=>o.id!==t.id)).slice(0,3)]).map(o=>({id:o.id,text:o.term}))}));
}
