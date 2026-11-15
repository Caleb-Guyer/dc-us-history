// Dramatic tasks and every spoken line are original representative fiction.
// Historical claims follow the supplied edited Chapter 13; these are not quotations.
export const GAME_VERSION='8.5.0';
const shot=(shotId,title,speaker,text,view='wide',seconds=4)=>({shotId,title,speaker,text,view,seconds});
export const GAMES=[
 {id:'c13-assembly',mode:'assembly',title:'The Shared Bench',eyebrow:'01 / Workshop rhythm',genre:'Workshop rhythm',place:'A communal workshop · 1840s',role:'Nell · Workshop volunteer',duration:40,target:8,
  description:'Three benches. Eight jobs. Get everyone’s work out the door.',
  controls:'A/D or ←/→ moves between benches. Space/E works; time the gold mark for a perfect. Shift/C sprints. Finish eight tasks at two benches.',
  goal:'Finish eight tasks. Keep more than one bench working.',
  lesson:'Communal experiments offered different answers to market change: shared goods, religious piety, individual insight or cooperation grounded in reason.',
  sections:['13.1','13.2'],keyTerms:['Second Great Awakening','millennialism','transcendentalism','pietistic','Shakers','Mormons'],
  opening:[
   shot('workshop-arrival','A different way to work','NELL','The Second Great Awakening brought me here. A better life ought to include the way we work.','wide',5),
   shot('workshop-promise','A thousand-year promise','ELIAS','Millennialism promises God’s kingdom for a thousand years. Until then, I’d settle for everyone eating.','close',5),
   shot('workshop-handoff','Nobody carries it alone','NELL','At a Shaker bench, the tools belong to everyone. Women and men share the work. Take this.','action',5)
  ],
  ending:[
   shot('workshop-book','Room to think','NELL','At Brook Farm, they read Emerson between shifts. Transcendentalism starts with trusting your own insight.','close',5),
   shot('workshop-pullback','The work beyond this room','ELIAS','Good. Nobody’s left carrying the load alone. Let’s see if we can keep it that way.','wide',5)
  ],
  gates:[
   {at:.32,prompt:'A visitor wants a plan built on shared goods and equality of women and men. Which community fits?',choices:['The Shakers’ communal workshop','The Mormons’ migration under Brigham Young','Owen’s appeal to industrial competition'],answer:0,why:'Shakers practiced communal property, equality and self-sufficiency. Mormons were the movement founded by Joseph Smith; Brigham Young later led members west.'},
   {at:.7,prompt:'An Owen supporter offers another plan. What gives his cooperative experiment its foundation?',choices:['A requirement that every community follow the same church','Human reason and concern for workers’ conditions','Skull shape as a measure of each worker’s worth'],answer:1,why:'Owen trusted human reason and cooperation. Pietistic communities instead stressed personal religious experience. These experiments did not all share one religious foundation; phrenology’s skull-reading claims were false.'}
  ]},
 {id:'c13-press',mode:'press',title:'The Abolition Press',eyebrow:'02 / Street courier',genre:'Street courier',place:'An abolition print network · late 1840s',role:'Nell · Pamphlet courier',duration:40,target:6,
  description:'The meeting has started. Run the papers through a street full of carts.',
  controls:'WASD or arrows moves. Space/E vaults. Hold Shift/C to sprint while stamina lasts. Secure six bundles on at least two paths.',
  goal:'Carry six bundles through the street. Use two routes.',
  lesson:'Black and White abolitionists used testimony, newspapers and petitions to confront slavery. Moral suasion appealed to conscience; immediatism demanded action without delay.',
  sections:['13.4'],keyTerms:['abolitionist','moral suasion','immediatism','colonization'],
  opening:[
   shot('press-impression','The paper has to move','ELIAS','Fresh off the press. Garrison’s Liberator has demanded immediate emancipation since 1831. The meeting needs these sheets.','insert',5),
   shot('press-courier','A voice of his own','NELL','Douglass told his own story in 1845. I’m taking his words with us.','close',5),
   shot('press-departure','Six bundles. One meeting.','ELIAS','Six bundles. Keep them dry. There’s a cart coming. Take the gap!','action',4)
  ],
  ending:[
   shot('press-handoff','An appeal to conscience','NELL','That testimony might change a mind. That’s moral suasion: make the reader face what slavery does.','close',5),
   shot('press-aftermath','The demand is freedom now','ELIAS','Immediatism means now. The Liberty Party fights through elections; Garrison refuses that route.','wide',5)
  ],
  gates:[
   {at:.32,prompt:'The editor needs a moral-suasion pamphlet. Which bundle should reach the meeting?',choices:['An ACS plan to relocate free Black people abroad','Testimony showing how slavery destroys families','A promise to postpone emancipation indefinitely'],answer:1,why:'Moral suasion appeals to conscience through slavery’s human costs. Colonization proposed removal from the United States; abolitionists such as Garrison rejected its racist premise.'},
   {at:.7,prompt:'The final sheet needs an immediatist headline. Send the accurate one.',choices:['Delay emancipation until a distant generation','Relocate free Black people instead of ending slavery','End slavery: take action now'],answer:2,why:'Immediatism demands immediate action to end slavery. It describes the urgency of abolition, not a claim that all abolitionists supported the same tactics.'}
  ]},
 {id:'c13-convention',mode:'convention',title:'Open the Hall',eyebrow:'03 / Hall dash',genre:'Hall dash',place:'Seneca Falls, New York · July 1848',role:'Nell · Convention volunteer',duration:40,target:6,
  description:'People are waiting outside. Ready the room and get the declaration to the floor.',
  controls:'WASD or arrows moves. Space/E prepares the marked task; away from a task it dashes. Shift/C sprints. Finish all six preparations.',
  goal:'Prepare the hall before the delegates arrive.',
  lesson:'Women’s reform organizing, especially in abolition, helped build the movement for women’s rights. Seneca Falls asserted equality without instantly securing it.',
  sections:['13.3','13.5'],keyTerms:['temperance','teetotalism','Seneca Falls'],
  opening:[
   shot('hall-arrival','The doors open today','NELL','They’re already at the door. Mott and Stanton expect three hundred people. Help me clear this room.','wide',5),
   shot('hall-voice','Work that crossed a boundary','MARTHA','We learned to organize through temperance and abolition. Today, we’re here for women’s rights.','close',5),
   shot('hall-pages','Make room for the declaration','NELL','London shut women out in 1840. Put the declaration here. This time, we’ll speak.','insert',4)
  ],
  ending:[
   shot('hall-declaration','The declaration goes public','NELL','The Declaration of Sentiments echoes the Declaration of Independence. We’ve asserted equality; the vote remains unwon.','close',5),
   shot('hall-open-floor','Keep the floor open','NELL','They shouted down the Grimké sisters for addressing women and men together. Let them hear us today.','wide',5)
  ],
  gates:[
   {at:.32,prompt:'A Washingtonian volunteer offers a teetotal pledge. What does a signer promise?',choices:['No hard liquor, while beer and wine remain acceptable','No alcohol, including beer and wine','Moderate drinking only on public occasions'],answer:1,why:'Teetotalism means total abstinence from alcohol. Early temperance could mean moderation or avoiding hard liquor. The working-class Washingtonians welcomed women and children as well as men.'},
   {at:.7,prompt:'Choose the accurate introduction to the declaration you are placing on the table.',choices:['A statement of women’s equality modeled on the Declaration of Independence','A federal law immediately granting all women the vote','An agreement to keep women out of public reform'],answer:0,why:'The 1848 Seneca Falls convention issued a declaration asserting women’s rights. Antislavery organizing helped prepare this movement, but the convention did not instantly change voting law.'}
  ]}
];
export const HALL_TASKS=['Set women’s delegate seats','Set men’s delegate seats','Lay out declaration pages','Prepare the speakers’ table','Place the equality statement','Open the speaking floor'];
export const GAME_BY_ID=Object.fromEntries(GAMES.map(g=>[g.id,g]));
export const SOURCE_NOTE='Nell, Elias and Martha are fictional people in reform-era teaching settings. Their speech is original, not a historical quotation. The games reinforce selected connections; the review hub covers the full chapter. Phrenology’s skull-reading claims are discredited pseudoscience.';
