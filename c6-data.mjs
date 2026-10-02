import {CHASE_LEVELS} from './c6-chase.mjs?v=4.15.0-published';
import {CHASE_LINES,CHASE_SCENES,CHASE_FACTS} from './c6-chase-story.mjs?v=4.15.0-published';
import {INLAND_LEVELS} from './c6-inland.mjs?v=4.15.0-published';
import {INLAND_LINES,INLAND_SCENES,INLAND_FACTS} from './c6-inland-story.mjs?v=4.15.0-published';
import {SOUTH_LEVELS} from './c6-south.mjs?v=4.15.0-published';
import {SOUTH_LINES,SOUTH_SCENES,SOUTH_FACTS} from './c6-south-story.mjs?v=4.15.0-published';
import {WIDER_LEVELS} from './c6-wider.mjs?v=4.15.0-published';
import {WIDER_LINES,WIDER_SCENES,WIDER_FACTS} from './c6-wider-story.mjs?v=4.15.0-published';
import {WINTER_LEVELS} from './c6-winter.mjs?v=4.15.0-published';
import {WINTER_LINES,WINTER_SCENES,WINTER_FACTS} from './c6-winter-story.mjs?v=4.15.0-published';
import {ALBANY_LEVELS} from './c6-albany.mjs?v=4.15.0-published';
import {ALBANY_LINES,ALBANY_SCENES,ALBANY_FACTS} from './c6-albany-story.mjs?v=4.15.0-published';
import {PHILADELPHIA_LEVELS} from './c6-philadelphia.mjs?v=4.15.0-published';
import {PHILADELPHIA_LINES,PHILADELPHIA_SCENES,PHILADELPHIA_FACTS} from './c6-philadelphia-story.mjs?v=4.15.0-published';
import {CROSSING_LEVELS} from './c6-crossing.mjs?v=4.15.0-published';
import {CROSSING_LINES,CROSSING_SCENES,CROSSING_FACTS} from './c6-crossing-story.mjs?v=4.15.0-published';
import {TIDE_SPEC,CREEK_SPEC} from './c6-promise.mjs?v=4.15.0-published';
import {PROMISE_LINES,PROMISE_SCENES,PROMISE_FACTS} from './c6-promise-story.mjs?v=4.15.0-published';
import {HILL_SPEC} from './c6-hill.mjs?v=4.15.0-published';
// Chapter 6: the Powder Road and the Guns North. Original crew fiction within sourced events.
import {FORT_SPEC} from './c6-fort.mjs?v=4.15.0-published';
import {SNOW_SPEC,RIDGE_SPEC,BOSTON_SPEC} from './c6-lift.mjs?v=4.15.0-published';
import {LIFT_LINES,LIFT_SCENES,LIFT_FACTS} from './c6-lift-story.mjs?v=4.15.0-published';
import {PRINT_SPEC,DISPATCH_SPEC} from './c6-paper.mjs?v=4.15.0-published';
import {PAPER_LINES,PAPER_SCENES,PAPER_FACTS} from './c6-paper-story.mjs?v=4.15.0-published';
import {RETREAT_LEVELS} from './c6-retreat.mjs?v=4.15.0-published';
import {RETREAT_LINES,RETREAT_SCENES,RETREAT_FACTS} from './c6-retreat-story.mjs?v=4.15.0-published';
export const VERSION='4.15.0';
export const SAVE_KEY='dc-us-history-chapter6-opening-v1';
export function continueProgress(saved){if(!saved.complete||saved.completedPart==='chase'||saved.seen.includes('chaseEnding'))return saved;return {...saved,complete:false,scene:saved.completedPart==='inland'||saved.seen.includes('inlandEnding')?'chaseIntro':saved.completedPart==='south'||saved.seen.includes('southEnding')?'inlandIntro':saved.completedPart==='wider'||saved.seen.includes('widerEnding')?'southIntro':saved.completedPart==='winter'||saved.seen.includes('winterAlliance')?'widerIntro':saved.completedPart==='albany'||saved.seen.includes('albanySurrender')?'winterIntro':saved.completedPart==='philadelphia'||saved.seen.includes('philadelphiaEnding')?'albanyIntro':saved.completedPart==='crossing'||saved.seen.includes('crossingEnding')?'philadelphiaIntro':saved.seen.includes('retreatEnding')?'crossingIntro':saved.seen.includes('paperCoda')?'retreatIntro':saved.seen.includes('liftHome')?'paperIntro':saved.seen.includes('promiseCoda')?'liftIntro':saved.seen.includes('hillLegacy')?'promiseIntro':saved.seen.includes('northEnding')?'hillIntro':'northIntro',checkpoint:null};}
export const NAMES={FATHER:'Joseph Pryce',MOTHER:'Hannah Pryce',TENANT:'Ephraim Cole',NEIGHBOR:'Andrew Voss',SAMUEL:'Samuel Price',BENNETT:'Benjamin Bennett',CREEK:'Creek visitor',ELIZA:'Eliza Bellamy',ADRIEN:'Adrien Morel',LYDIA:'Lydia Blake',ANNE:'Anne Hart',ASA:'Asa Freeman',MERCHANT:'Local merchant',JACOB:'Jacob',CLERK:'Daniel Pike',HESSIAN:'Hessian soldier',JONAS:'Jonas Bell',AGENT:'Royal intermediary',CLAIMANT:'Virginia enslaver',ROWAN:'Rowan Vale',WARD:'Elias Ward',MARA:'Mara Reed',ISAIAH:'Isaiah Mercer',THOMAS:'Thomas Vale',RUNNER:'Nathan Cole',MILITIA:'Militia captain'};
export const SPEAKERS={FATHER:['am_eric',1.02,'en-us'],MOTHER:['af_bella',1.01,'en-us'],TENANT:['bm_fable',1.03,'en-gb'],NEIGHBOR:['bm_george',1.04,'en-gb'],SAMUEL:['am_eric',1.01,'en-us'],BENNETT:['bm_fable',1.03,'en-gb'],CREEK:['am_onyx',1.03,'en-us'],ELIZA:['af_bella',.98,'en-us'],ADRIEN:['bm_lewis',1.04,'en-gb'],LYDIA:['af_bella',1.00,'en-us'],ANNE:['af_heart',1.06,'en-us'],ASA:['am_michael',1.06,'en-us'],MERCHANT:['bm_fable',1.01,'en-gb'],JACOB:['am_onyx',1.02,'en-us'],CLERK:['am_eric',.99,'en-us'],HESSIAN:['bm_lewis',1.00,'en-gb'],JONAS:['am_onyx',.98,'en-us'],AGENT:['bm_lewis',.99,'en-gb'],CLAIMANT:['am_eric',1.03,'en-us'],ROWAN:['am_fenrir',1.00,'en-us'],WARD:['bm_george',.96,'en-gb'],MARA:['af_heart',1.00,'en-us'],ISAIAH:['am_michael',.98,'en-us'],THOMAS:['bm_fable',.98,'en-gb'],RUNNER:['am_puck',1.04,'en-us'],MILITIA:['bm_george',1.04,'en-gb']};
const line=(id,speaker,text)=>({id,speaker,text});
export const LINES=[...CHASE_LINES,...INLAND_LINES,...SOUTH_LINES,...WIDER_LINES,...WINTER_LINES,...ALBANY_LINES,...PHILADELPHIA_LINES,...CROSSING_LINES,...RETREAT_LINES,...PAPER_LINES,...LIFT_LINES,...PROMISE_LINES,
 line('release.0','THOMAS','The release is signed. Give him his coat.'),
 line('release.1','ROWAN','Ward? It’s me.'),
 line('release.2','WARD','I know your footsteps. You still hurry when you’re frightened.'),
 line('release.3','ROWAN','Can you walk?'),
 line('release.4','WARD','With a little help. Don’t make a ceremony of it.'),
 line('help','WARD','Easy. They gave me my coat back. Not quite my legs.'),
 line('releasewalk','MARA','Bring him to the wagon. There’s a blanket beside me.'),
 line('gate.0','MARA','Hold still. This buckle never liked you.'),
 line('gate.1','WARD','You kept the wagon.'),
 line('gate.2','ISAIAH','And a place in it. We weren’t leaving you here.'),
 line('gate.3','THOMAS','You asked me to find him, Rowan. I kept my word.'),
 line('gate.4','ROWAN','Then come with us.'),
 line('gate.5','THOMAS','You’re my family. That doesn’t make this rebellion right.'),
 line('gate.6','WARD','Let him go. A man can open a door without crossing it.'),
 line('night.0','WARD','Gage has troops moving out of Boston. They’re after the powder at Concord.'),
 line('night.1','ROWAN','Again? Cambridge. Charlestown. How much more will they take?'),
 line('night.2','WARD','They came away empty-handed at Salem. New Hampshire took the guns at Fort William and Mary. People are ready.'),
 line('night.3','ROWAN','Then we get the warning to them. The north farm first.'),
 line('farm.0','RUNNER','British troops? I’ll wake the others. Our minutemen can assemble in a minute.'),
 line('farm.1','WARD','Some of those men fought the French with me. They know what a musket sounds like. Ring the meeting bell.'),
 line('bell.0','RUNNER','Revere was stopped by a British patrol. Other riders are carrying the warning on.'),
 line('bell.1','ROWAN','One rider doesn’t carry the whole country. Get your neighbors out.'),
 line('ridge','WARD','The lanterns are gathering on the road. Keep to the trees. We meet the others beyond the ridge.'),
 line('patrol','WARD','Lantern ahead. Stay low behind the fence. Let the patrol pass.'),
 line('spotted','WARD','They’ve seen us! Break their sight. Through the orchard!'),
 line('lex.0','MARA','People came out to see what was happening. Now they can’t get off the green.'),
 line('lex.1','WARD','Stay close. No one here knows what the next man will do.'),
 line('lex.2','ROWAN','Who fired?'),
 line('lex.3','WARD','I couldn’t see. Get down!'),
 line('lex.4','MARA','There’s someone by the wall. Rowan, help me get him out!'),
 line('rescue.0','RUNNER','My leg. I can’t put any weight on it.'),
 line('rescue.1','ROWAN','Put your arm over me. We’re going to that wagon.'),
 line('rescue.2','MARA','I’ve got him. There’s another man behind the fence. Bring him through the garden.'),
 line('rescue.3','WARD','The lane is clear. Leave the green. Now!'),
 line('concord.0','WARD','They reached Concord. Now they’re falling back toward Boston, and more militia are coming in along the road.'),
 line('concord.1','MARA','Our wagon has wounded aboard. I need that crossing clear.'),
 line('concord.2','WARD','Take the spare musket. One shot, then reload. Use the wall while your hands are busy.'),
 line('armed','WARD','Hold the stone wall. Keep their fire off the wagon. I’ll watch the left.'),
 line('wave.1','WARD','They’re coming through the smoke. Don’t stand in the open!'),
 line('wave.2','MARA','The wheel’s free! A little longer. Keep them back!'),
 line('clear','MARA','We’re across! Rowan, Ward, fall back to the orchard!'),
 line('reload','WARD','Reload behind cover. That wall is worth more than another shot.'),
 line('end.0','ROWAN','This morning I thought getting the warning through would be enough.'),
 line('end.1','WARD','It got these people out. That was enough for this morning.'),
 line('end.2','MARA','Militia are marching toward Boston from everywhere. They’re surrounding the city.'),
 line('end.3','ROWAN','And Thomas is still inside.'),
 line('end.4','WARD','Then we keep a road open. We leave with everyone we can.'),
 line('end.5','ISAIAH','I’ll find us a way through the harbor. You get some sleep.'),
 line('retry','WARD','Find cover. Breathe. We try the route again.'),
 line('north.0','ISAIAH','There. Past the mist. Ticonderoga.'),
 line('north.1','ROWAN','Boston is the other way.'),
 line('north.2','WARD','We can surround a city with men. To force the British out, we need guns.'),
 line('north.3','RUNNER','Allen and Arnold are bringing the men up. They want us at the passage.'),
 line('north.4','ISAIAH','I’ll keep the boat ready. Nathan, stay on Rowan’s shoulder.'),
 line('north.5','ROWAN','And if the sentry sees us?'),
 line('north.6','WARD','We move together. This is a surprise, not a firing line.'),
 line('north.7','ISAIAH','Rowan. Leave room for everyone on the way back.'),
 line('north.ready','WARD','The wall hides us. Left side of the passage. Watch where his lantern points.'),
 line('north.signal','WARD','I see you. Taking the left door. Get that latch up for the others.'),
 line('north.alarm','RUNNER','My foot! Rowan, I’m caught!'),
 line('north.rescued','WARD','He’s clear! They’ve heard us. Open the passage. Our men are coming!'),
 line('north.taken','WARD','Through! Allen and Arnold have the courtyard. Secure the stores!'),
 line('capture.0','RUNNER','They’re giving up. The whole place.'),
 line('capture.1','WARD','Let them put their weapons down. Keep the way clear.'),
 line('capture.2','ROWAN','All those guns. Sitting here while Boston stays shut.'),
 line('capture.3','WARD','Taking them was the first problem. Moving them will be the next.'),
 line('capture.4','RUNNER','I’ll watch this door. Get the inventory, Rowan.'),
 line('north.stores','ROWAN','Powder dry. Shot stacked. Now something to fire it from.'),
 line('north.fitting','WARD','That gun. Broken fitting, sound barrel. Mark it. We’ll need a new carriage.'),
 line('north.pull','WARD','Rope tight. Back up slowly. I’ll keep the roller straight.'),
 line('north.weight','ROWAN','All that, just to move it a few feet.'),
 line('north.end.0','WARD','Don’t put your hand there. If it rolls, you lose it.'),
 line('north.end.1','ROWAN','You can barely close yours. Let me take the weight.'),
 line('north.end.2','WARD','You take the weight. I’ll tell you where to put it.'),
 line('north.end.3','RUNNER','Allen and Arnold took the fort. Should I put your names beside the stores?'),
 line('north.end.4','ROWAN','Put down what we can use. Names won’t open Boston.'),
 line('north.end.5','WARD','Your brother’s still in there.'),
 line('north.end.6','ROWAN','So are other people’s brothers. We find a road for these guns.'),
 line('north.end.7','WARD','Then keep that list dry. We’re going back to the siege.'),
 line("hill.intro.0","RUNNER","Dispatch from Philadelphia. June fifteenth. Congress has appointed George Washington commander in chief."),
 line("hill.intro.1","ROWAN","Then where is he?"),
 line("hill.intro.2","WARD","Not here yet. Today we hold with the men we have."),
 line("hill.intro.3","MARA","This is Breed’s Hill. The road behind us runs over Bunker Hill. Remember it when the smoke comes."),
 line("hill.intro.4","ROWAN","Those ships can reach us from the harbor."),
 line("hill.intro.5","WARD","And these heights threaten Boston. That’s why the British want them back."),
 line("hill.intro.6","MARA","I’ll have blankets behind the ridge. If you bring someone to me, go back for the next."),
 line("hill.intro.7","WARD","Brace this section. Place our reserve where you can reach it. Then come to the wall."),
 line("hill.braced","WARD","That will hold. Take these cartridges. Left post or right. You’ll have to fetch them under fire."),
 line("hill.left","ROWAN","Reserve on the left. Near the main line."),
 line("hill.right","ROWAN","Reserve on the right. If they turn the flank, we’ll need it there."),
 line("hill.first","WARD","First line coming up. Let them close. One shot, then get below the earthwork to reload."),
 line("hill.volley","ROWAN","Together! Fire!"),
 line("hill.flank","RUNNER","They’re falling back! The timbers on our right are loose. Rowan, help me close it!"),
 line("hill.second","WARD","Here they come again. Watch the right. Don’t spend every cartridge at once."),
 line("hill.reserve","ROWAN","Last reserve. Pass them down the line."),
 line("hill.third","WARD","They’re forming a third time. Check your cartridges. Keep the rear lane open."),
 line("hill.gun","RUNNER","The gun! I can’t see the men at the gun!"),
 line("hill.break.0","ROWAN","The smoke’s lifting. Where did the gun crew go?"),
 line("hill.break.1","RUNNER","They’re at the earthwork!"),
 line("hill.break.2","WARD","Down, Rowan! Down!"),
 line("hill.break.3","ROWAN","I can still fire."),
 line("hill.break.4","WARD","The men along the wall are empty. One musket can’t hold this hill. Get the wounded behind the ridge."),
 line("hill.break.5","ROWAN","I’ll call you when they’re clear. You follow my signal."),
 line("hill.lift","ROWAN","Arm around me. Look at the road, not at your leg."),
 line("hill.mara","MARA","I have him. Another man fell by the right fence. Bring him through the gap."),
 line("hill.other","ROWAN","I’m here. Lean on me. We’re leaving together."),
 line("hill.safe","MARA","Both breathing. Rowan, get Ward off that hill."),
 line("hill.signal","ROWAN","Ward! Fall back! We have a way through!"),
 line("hill.end.0","MARA","Easy. Lower him with me. Nathan, hold that cloth."),
 line("hill.end.1","ROWAN","They have the redoubt."),
 line("hill.end.2","WARD","They have the hill. Look at the road. Our men are still coming out."),
 line("hill.end.3","ROWAN","I told you to follow my signal."),
 line("hill.end.4","WARD","You did. So I followed it."),
 line("hill.end.5","MARA","Rowan. His hand. Hold it while I bind his leg."),
 line("hill.end.6","ROWAN","I’m here. I’m not going anywhere."),
 line("hill.legacy.0","RUNNER","The reports say more than two hundred British dead. Around eight hundred wounded. All for those hills."),
 line("hill.legacy.1","WARD","Gage took the ground. He still couldn’t break the siege around Boston."),
 line("hill.legacy.2","MARA","In August, the king declared the colonies in rebellion. This arrived from London."),
 line("hill.legacy.3","ROWAN","Then we keep the dispatches moving. People need to know what comes next."),
];
export const SCENES={
 release:{level:'release',title:'An unfinished promise',place:'BOSTON · EARLY 1775',music:'home',lines:['release.0','release.1','release.2','release.3','release.4'],after:'release'},
 gate:{level:'release',title:'A place in the wagon',place:'BOSTON · EARLY 1775',music:'home',lines:Array.from({length:7},(_,i)=>'gate.'+i),after:'nightIntro'},
 nightIntro:{level:'night',title:'The Powder Road',place:'MASSACHUSETTS · NIGHT OF APRIL 18–19, 1775',music:'night',lines:Array.from({length:4},(_,i)=>'night.'+i),after:'night'},
 lexington:{level:'lexington',title:'The first light',place:'LEXINGTON · APRIL 19, 1775',music:null,lines:Array.from({length:5},(_,i)=>'lex.'+i),after:'lexington'},
 concordIntro:{level:'concord',title:'A road home',place:'NEAR CONCORD · LATER ON APRIL 19, 1775',music:'tension',lines:Array.from({length:3},(_,i)=>'concord.'+i),after:'concord'},
 ending:{level:'end',title:'Everyone we can',place:'OUTSIDE BOSTON · AFTER APRIL 19, 1775',music:'home',lines:Array.from({length:6},(_,i)=>'end.'+i),after:'northIntro'},
 northIntro:{level:'ticonderoga',title:'The Guns North',place:'LAKE CHAMPLAIN · BEFORE DAWN · MAY 10, 1775',music:'night',lines:Array.from({length:8},(_,i)=>'north.'+i),after:'ticonderoga'},
 fortCapture:{level:'ticonderoga',title:'Before the morning',place:'FORT TICONDEROGA · MAY 10, 1775',music:'tension',lines:Array.from({length:5},(_,i)=>'capture.'+i),after:'checkpoint'},
 northEnding:{level:'ticonderoga',title:'The weight of it',place:'TICONDEROGA · LATER THAT MORNING',music:'home',lines:Array.from({length:8},(_,i)=>'north.end.'+i),after:'hillIntro'},
 hillIntro:{level:'breeds',title:'Hold Until Empty',place:'BREED’S HILL · JUNE 17, 1775',music:'tension',lines:Array.from({length:8},(_,i)=>'hill.intro.'+i),after:'breeds'},
 hillBreak:{level:'breeds',title:'The last cartridges',place:'BREED’S HILL · THE THIRD ASSAULT',music:null,lines:Array.from({length:6},(_,i)=>'hill.break.'+i),after:'checkpoint'},
 hillEnding:{level:'breeds',title:'Behind the ridge',place:'BEYOND BREED’S HILL · JUNE 17, 1775',music:'home',lines:Array.from({length:7},(_,i)=>'hill.end.'+i),after:'hillLegacy'},
 hillLegacy:{level:'end',title:'Still surrounded',place:'BOSTON LINES · SEPTEMBER 1775 · NEWS FROM LONDON',music:'home',lines:Array.from({length:4},(_,i)=>'hill.legacy.'+i),after:'promiseIntro'},
 ...PROMISE_SCENES,
 ...LIFT_SCENES,
 ...PAPER_SCENES,
 ...RETREAT_SCENES,
 ...CROSSING_SCENES,...PHILADELPHIA_SCENES,...ALBANY_SCENES,...WINTER_SCENES,...WIDER_SCENES,...SOUTH_SCENES,...INLAND_SCENES,...CHASE_SCENES,
};
export const LEVELS={
 release:{title:'An unfinished promise',place:'BOSTON · EARLY 1775',spawn:[0,13],bounds:[-18,18,-18,22],music:'home',goals:[{x:0,z:2,label:'Help Ward down the steps',verb:'Help Ward',time:1},{x:8,z:10,label:'Bring Ward to the wagon',verb:'Help Ward into the wagon',time:1.2}]},
 night:{title:'The Powder Road',place:'APRIL 18–19, 1775 · NIGHT',spawn:[0,19],bounds:[-24,24,-125,24],music:'night',goals:[{x:-8,z:-22,label:'Warn the north farm',verb:'Knock on the farmhouse door',time:1},{x:9,z:-61,label:'Ring the meeting bell',verb:'Ring the bell',time:1.2},{x:-3,z:-115,label:'Reach the far side of the ridge',verb:'Follow the path to Lexington',time:.8}]},
 lexington:{title:'The first light',place:'APRIL 19, 1775 · LEXINGTON',spawn:[0,17],bounds:[-25,25,-31,24],music:'tension',goals:[{x:-7,z:-4,label:'Reach the wounded runner',verb:'Help the wounded runner',time:1},{x:14,z:16,label:'Bring him to Mara’s wagon',verb:'Lower him into the wagon',time:1},{x:-13,z:-16,label:'Find the man behind the fence',verb:'Help the wounded man',time:1},{x:14,z:16,label:'Get him into the wagon',verb:'Help him aboard',time:1},{x:19,z:23,label:'Leave the green with the crew',verb:'Leave by the garden lane',time:.6}]},
 concord:{title:'A road home',place:'APRIL 19, 1775 · NEAR CONCORD',spawn:[3,18],bounds:[-24,24,-42,26],music:'battle',goals:[{x:2,z:9,label:'Take the spare musket',verb:'Take the musket',time:.8},{x:0,z:4,label:'Cover the wagon from the stone wall',verb:'Hold this position',time:0},{x:18,z:23,label:'Fall back to the orchard',verb:'Leave with the crew',time:.7}]},
 ticonderoga:FORT_SPEC,
 breeds:HILL_SPEC,
 tidewater:TIDE_SPEC,
 moorescreek:CREEK_SPEC,
 snowpass:SNOW_SPEC,
 dorchester:RIDGE_SPEC,
 bostonreturn:BOSTON_SPEC,
 printshop:PRINT_SPEC,
 dispatch:DISPATCH_SPEC,
};
export const FACTS=[...CHASE_FACTS,...INLAND_FACTS,...SOUTH_FACTS,...WIDER_FACTS,...WINTER_FACTS,...ALBANY_FACTS,...PHILADELPHIA_FACTS,...CROSSING_FACTS,...RETREAT_FACTS,...PAPER_FACTS,...LIFT_FACTS,...PROMISE_FACTS,
 ['A promise kept','Rowan, Mara, Isaiah, Ward, Thomas, and the local rescues are fictional. Ward survived the Chapter 5 fire and surrendered. Thomas remains a Loyalist. Isaiah is a free Black man who survived his 1770 shoulder wound.','Crew continuity'],
 ['The powder raids','Gage used Boston as a base for seizures of colonial weapons and powder. Cambridge and Charlestown lost supplies; resistance met the troops at Salem. Colonists seized Fort William and Mary in New Hampshire.','Handout §6.1, paragraphs 8–9'],
 ['Minutemen','Local militia prepared to assemble rapidly. Many members had experience in the French and Indian War. The fictional farm and bell route illustrates this wider mobilization.','Handout §6.1, paragraph 9'],
 ['A network of riders','Paul Revere was one of several warning riders. A British patrol captured him before he completed the ride to Concord. The warning continued through other people.','Handout §6.1, paragraph 10'],
 ['The first shot','Fighting occurred at Lexington and Concord on April 19, 1775. It remains uncertain who fired the first shot; this scene deliberately does not identify a shooter.','Handout §6.1, paragraph 10'],
 ['The road back','British troops retreated toward Boston under attacks by expanding militia forces. The player’s local wagon defense is fictional, not a reconstruction of a particular recorded engagement.','Handout §6.1, paragraph 10'],
 ['A siege begins','After Lexington and Concord, militia converged on Boston and besieged the city. The siege continued after the capture of Ticonderoga.','Handout §6.1, paragraph 11'],
 ['The Guns North','Ethan Allen and Benedict Arnold led the capture of Fort Ticonderoga in New York on May 10, 1775. Its artillery offered a way to strengthen the siege of Boston. The crew’s passage, rescue, inventory, and hauling jobs are fictional.','Handout §6.1, paragraph 11; Fort Ticonderoga museum'],
 ['Taking a gun is not moving it','The capture in May 1775 and Henry Knox’s later winter artillery expedition were separate events. The crew marks a fictional gun for a later return; the player does not deliver it to Boston in May. The winter transport and March 1776 evacuation belong to later missions.','Handout §6.1, paragraph 13; Fort Ticonderoga museum, Noble Train of Artillery'],
 ['Hold Until Empty','The Battle of Bunker Hill took place on June 17, 1775, with much of the fighting at Breed’s Hill. The British made three assaults and took the heights after the defenders ran short of ammunition. The local crew actions, volley orders, reserve placement, and wounded men are fictional.','Handout §6.1, paragraph 12; National Park Service'],
 ['A costly victory','The British took the hill, with over 200 killed and about 800 wounded in the handout’s figures. Gage still did not break the siege of Boston. Winning this mission means evacuating wounded people, not reversing the British victory.','Handout §6.1, paragraph 12'],
 ['Command and rebellion','Congress appointed George Washington commander in chief on June 15, 1775. He did not command the June 17 battle. King George III declared the colonies in rebellion in August; that news appears in a separate late-summer scene.','Handout §6.1, paragraphs 12–13; National Park Service'],
];

// Append the five New York sections after the Philadelphia dispatch.
Object.assign(LEVELS,RETREAT_LEVELS,CROSSING_LEVELS,PHILADELPHIA_LEVELS,ALBANY_LEVELS,WINTER_LEVELS,WIDER_LEVELS,SOUTH_LEVELS,INLAND_LEVELS,CHASE_LEVELS);
