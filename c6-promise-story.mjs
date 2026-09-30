const lines=(prefix,speech)=>speech.map(([speaker,text],i)=>({id:prefix+'.'+i,speaker,text}));
export const PROMISE_LINES=[
 ...lines('promise.intro',[
 ['ISAIAH','November. Virginia. Different water. Same men deciding who belongs on it.'],
 ['MARA','The relief cargo is ashore. You can come back north with us.'],
 ['ISAIAH','One more crossing. A shipwright named Jonas sent word. He has chosen a landing.'],
 ['MARA','Dunmore’s men?'],
 ['ISAIAH','He wants to hear their offer for himself. I know the channels. That is what I can give him.'],
 ['MARA','And that shoulder?'],
 ['ISAIAH','Old wound. Five years old. It can manage an oar.'],
 ['MARA','Then keep the lamp covered. I will keep a place for you.']]),
 ...lines('promise.join',[
 ['JONAS','Isaiah? Jonas Bell. Push off. He has men watching the road.'],
 ['ISAIAH','The man who enslaves you?'],
 ['JONAS','He calls himself a Patriot. Says no king can make him a slave. Then locks my door.'],
 ['ISAIAH','That paper. Dunmore’s proclamation?'],
 ['JONAS','November seventh. The royal governor offers freedom to enslaved people and indentured servants belonging to rebels.'],
 ['ISAIAH','Able and willing to bear arms. Joining the king’s troops. There are conditions.'],
 ['JONAS','I read them. My wife is on another estate. This promises nothing for her.'],
 ['ISAIAH','I am free already. I cannot choose the risk for you.'],
 ['JONAS','Then take me to the tender. I am choosing it.']]),
 ...lines('promise.contact',[
 ['AGENT','Who sent this boat?'],
 ['JONAS','I brought myself. Jonas Bell. Shipwright. I can serve.'],
 ['AGENT','The man claiming you. Rebel, or loyal to the Crown?'],
 ['JONAS','Rebel. Does your offer stop at a Loyalist’s door?'],
 ['AGENT','His offer does not free people held by loyal subjects. His lordship needs soldiers.'],
 ['JONAS','And my wife?'],
 ['AGENT','I cannot promise her passage. Join us at the sheltered inlet. Our boat will meet you there.'],
 ['CLAIMANT','That is my shipwright! Dunmore is stealing our property! Stop that boat!'],
 ['ISAIAH','Skiff off the stern. Jonas, down! The mooring boom. Can you cut it?'],
 ['JONAS','Put me alongside. I built enough of these.']]),
 ...lines('promise.end',[
 ['JONAS','There. The inlet. They waited.'],
 ['ISAIAH','Your hands are shaking.'],
 ['JONAS','They were shaking when I left the yard. I left anyway.'],
 ['ISAIAH','I will carry a message if you can get one out. For your wife.'],
 ['JONAS','Her name is Ruth. Do not let her become just another missing name.'],
 ['ISAIAH','Ruth Bell. I heard you.'],
 ['JONAS','I will do the rest myself. Thank you for the water.']]),
 ...lines('creek.intro',[
 ['ISAIAH','North Carolina. February twenty-seventh, seventeen seventy-six. Three months of carrying supplies along this coast.'],
 ['RUNNER','The fighting at Moore’s Creek Bridge is over. Patriots broke the Loyalist advance this morning.'],
 ['ISAIAH','I can still hear someone on the far bank.'],
 ['RUNNER','Show the captain your dispatch. They stripped boards off the bridge before the attack. Mind the gap.'],
 ['ISAIAH','A man can drown on the winning side of a battle. Get a blanket ready.']]),
 ...lines('creek.end',[
 ['RUNNER','He fought for the king. You knew that.'],
 ['ISAIAH','So did the man who opened Ward’s cell. Get him water.'],
 ['RUNNER','They say this victory has broken the Loyalist rising here.'],
 ['ISAIAH','Here. Not everywhere. Families will still be on different sides tomorrow.'],
 ['RUNNER','And Jonas?'],
 ['ISAIAH','Chose the British because he saw a way out of slavery. Some Black men serve with the Patriots. Service does not mean freedom is automatically granted.'],
 ['ISAIAH','I promised to carry a message. Not to pretend the country has answered him.']]),
 ...lines('promise.coda',[
 ['MARA','A later dispatch. Virginia, seventeen seventy-six. Dunmore has fled the colony.'],
 ['ISAIAH','He promised freedom where he needed soldiers. Even that limited offer frightened Patriot enslavers into stronger resistance.'],
 ['MARA','And the people who trusted his promise?'],
 ['ISAIAH','Their search for freedom did not end when his ships left. Neither does our road.']]),
 {id:'promise.reeds',speaker:'JONAS',text:'That lantern is passing. The tender is beyond the next island. Keep to the eastern channel.'},
 {id:'promise.spotted',speaker:'ISAIAH',text:'They have our wake. Slow down in the reeds. Make them lose us.'},
 {id:'promise.cut',speaker:'JONAS',text:'Rope is cut! Hard strokes, Isaiah! Straight through, then left for the inlet!'},
 {id:'promise.retry',speaker:'ISAIAH',text:'Breathe. Read the water. We can get through.'},
 {id:'creek.orders',speaker:'MILITIA',text:'Mecklenburg Resolves. May, seventeen seventy-five. Our county rejected the Crown’s authority when the rebellion began.'},
 {id:'creek.authority',speaker:'MILITIA',text:'The resolves put our militia under Congress, not the king. You may pass. Bring that wounded man back.'},
 {id:'creek.boards',speaker:'ISAIAH',text:'Boards are down. Easy across. The Loyalists tried to cross into Patriot fire this morning.'},
 {id:'creek.lift',speaker:'ISAIAH',text:'I have you. Leave the weapon. Your arm over my shoulder.'},
 {id:'creek.safe',speaker:'RUNNER',text:'Here. On the blanket. He is breathing. I will stay with him.'}
];
const scene=(level,title,place,music,prefix,count,after)=>({level,title,place,music,lines:Array.from({length:count},(_,i)=>prefix+'.'+i),after});
export const PROMISE_SCENES={
 promiseIntro:scene('tidewater','A King’s Promise','VIRGINIA · NOVEMBER 1775','tide','promise.intro',8,'tidewater'),
 promiseJoin:scene('tidewater','I brought myself','A VIRGINIA LANDING · NOVEMBER 1775','tide','promise.join',9,'checkpoint'),
 promiseContact:scene('tidewater','The conditions','A ROYAL TENDER · VIRGINIA · NOVEMBER 1775','tension','promise.contact',10,'checkpoint'),
 promiseEnd:scene('tidewater','Thank you for the water','THE SHELTERED INLET · LATER THAT NIGHT','home','promise.end',7,'creekIntro'),
 creekIntro:scene('moorescreek','The Other Bank','NORTH CAROLINA · FEBRUARY 27, 1776 · AFTER THE BATTLE','home','creek.intro',5,'moorescreek'),
 creekEnd:scene('moorescreek','A man on the other bank','MOORES CREEK · FEBRUARY 27, 1776','home','creek.end',7,'promiseCoda'),
 promiseCoda:scene('end','The promise outlives the governor','LATER HISTORICAL DISPATCH · VIRGINIA · 1776','home','promise.coda',4,'liftIntro')
};
export const PROMISE_FACTS=[
 ['A King’s Promise','Dunmore, Virginia’s royal governor, issued his proclamation on November 7, 1775. It offered freedom to enslaved people and indentured servants belonging to rebels who were able and willing to bear arms and joined British forces. It did not abolish slavery generally, cover Loyalist enslavers, or guarantee freedom to every family member.','Handout P015; Library of Congress, original proclamation'],
 ['A choice made by Jonas','Jonas Bell is a fictional enslaved shipwright. He chooses to approach the British; Isaiah, already free, supplies transport. Ruth, the intermediary, the enslaver, the waterways and interception are fictional. Some enslaved people sought freedom through British service; this story does not guarantee a safe or equal future.','Crew fiction within the context of handout P015, P052–P053'],
 ['Liberty and slavery','Dunmore’s offer both recruited people seeking freedom and strengthened resistance among Patriot enslavers afraid of losing their claimed property or facing an uprising. Dunmore fled Virginia in 1776. The later dated dispatch is a historical coda, not news known at Moore’s Creek in February.','Handout P015; Colonial Williamsburg'],
 ['Mecklenburg Resolves','In May 1775, the Mecklenburg Resolves rejected Crown authority and placed local government and militia under congressional authority. These are the Resolves, not the disputed Mecklenburg Declaration.','Handout P014; North Carolina State Library, May 31 resolves transcript'],
 ['Moores Creek Bridge','Patriots defeated Loyalists at Moores Creek Bridge on February 27, 1776. Removed bridge planks impeded the Loyalist assault. Isaiah arrives after the battle on a fictional relief journey; his local bridge repair and rescue do not change the result.','Handout P014; National Park Service'],
 ['Service and freedom','Black people served on both sides. Patriot service did not automatically free enslaved participants. Washington’s recruiting policies changed over time; the handout’s broad statement is not a complete chronology. Later campaigns will address the larger wartime and postwar experience.','Handout P052–P053; Mount Vernon, African Americans in the Revolutionary War']
];
// Angles are derived from the actors' blocking: close-ups face the speaker.
const close=(x,z,yaw=0,y=1.35)=>[[x-Math.sin(yaw)*2.8+Math.cos(yaw)*1.4,1.75,z-Math.cos(yaw)*2.8-Math.sin(yaw)*1.4],[x,y,z]],wide=(x,z)=>[[x+7,5.2,z+5],[x,1,z]];
const I=close(0,27,Math.PI/2,1.0),M=close(2,26,-Math.PI/2),J=close(-24,-22,.25),B=close(-23,-24,-Math.PI*.75,1.0),A=close(25,-95,Math.PI/2),C=close(22,-95,-Math.PI/2),E=close(1,-160,.4,1.0),F=close(-1,-162,-Math.PI*.65),N=close(7,21,Math.PI*.75),P=close(9,23,.2),Q=close(8,19,-.6,.9),R=close(11,17,Math.PI*.75,.9);
export const PROMISE_SHOTS={
 promiseIntro:[wide(0,27),M,I,M,I,M,I,[[5,3.4,32],[0,.7,25]]],
 promiseJoin:[wide(-23,-23),B,J,B,J,B,J,B,J],
 promiseContact:[wide(23,-94),C,A,C,A,C,A,[[26,2.7,-90],[29,1.5,-88]],close(23,-94,-.3,.85),close(22,-95,-Math.PI/2,.85)],
 promiseEnd:[wide(0,-161),E,F,E,F,E,[[-4,2,-159],[-1,1,-162]]],
 creekIntro:[wide(9,23),N,P,N,P],
 creekEnd:[wide(9,18),Q,R,Q,R,Q,[[5,1.4,21],[8,1,19]]],
 promiseCoda:[close(2,2,Math.PI*.8),close(3,0,Math.PI*.9),close(2,2,Math.PI*.8),[[7,3,6],[3,1.3,0]]]
};
