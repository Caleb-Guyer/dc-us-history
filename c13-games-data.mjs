// Dramatic tasks and every spoken line are original representative fiction.
// Historical claims follow the supplied edited Chapter 13; these are not quotations.
export const GAME_VERSION='8.2.0';
const shot=(shotId,title,speaker,text,view='wide',seconds=4)=>({shotId,title,speaker,text,view,seconds});
export const GAMES=[
 {id:'c13-assembly',mode:'assembly',title:'The Shared Bench',eyebrow:'01 / Workshop rhythm',genre:'Workshop rhythm',place:'A communal workshop · 1840s',role:'A representative community worker',duration:40,target:8,
  description:'Keep three benches moving. Cross the workshop, meet the work window and build a clean streak.',
  controls:'A/D or ←/→ moves between benches. Space/E works; time the gold mark for a perfect. Shift/C sprints. Finish eight tasks at two benches.',
  goal:'Finish eight tasks. Keep more than one bench working.',
  lesson:'Communal experiments offered different answers to market change: shared goods, religious piety, individual insight or cooperation grounded in reason.',
  sections:['13.1','13.2'],keyTerms:['Second Great Awakening','millennialism','transcendentalism','pietistic','Shakers','Mormons'],
  opening:[
   shot('workshop-arrival','A different way to work','COMMUNITY WORKER','The Second Great Awakening promises personal change. Some of us want to change how we live and work.','wide',5),
   shot('workshop-promise','A thousand-year promise','FELLOW WORKER','Millennialism means a thousand years of God’s kingdom. I want fairer work here, today.','close',5),
   shot('workshop-handoff','Nobody carries it alone','COMMUNITY WORKER','Shakers share property. Women and men work as equals. Keep the benches moving—we depend on each other.','action',5)
  ],
  ending:[
   shot('workshop-book','Room to think','COMMUNITY WORKER','Brook Farm joins labor and ideas. Emerson’s transcendentalism asks us to trust insight and think independently.','close',5),
   shot('workshop-pullback','The work beyond this room','FELLOW WORKER','The benches are ready. Now we have to make the community work beyond this room.','wide',5)
  ],
  gates:[
   {at:.32,prompt:'A visitor wants a plan built on shared goods and equality of women and men. Which community fits?',choices:['The Shakers’ communal workshop','The Mormons’ migration under Brigham Young','Owen’s appeal to industrial competition'],answer:0,why:'Shakers practiced communal property, equality and self-sufficiency. Mormons were the movement founded by Joseph Smith; Brigham Young later led members west.'},
   {at:.7,prompt:'An Owen supporter offers another plan. What gives his cooperative experiment its foundation?',choices:['A requirement that every community follow the same church','Human reason and concern for workers’ conditions','Skull shape as a measure of each worker’s worth'],answer:1,why:'Owen trusted human reason and cooperation. Pietistic communities instead stressed personal religious experience. These experiments did not all share one religious foundation; phrenology’s skull-reading claims were false.'}
  ]},
 {id:'c13-press',mode:'press',title:'The Abolition Press',eyebrow:'02 / Street courier',genre:'Street courier',place:'An abolition print network · late 1840s',role:'A representative Black pamphlet courier',duration:40,target:6,
  description:'The meeting needs its papers. Find gaps in the street, vault the carts and carry six bundles across two routes.',
  controls:'WASD or arrows moves. Space/E vaults. Hold Shift/C to sprint while stamina lasts. Secure six bundles on at least two paths.',
  goal:'Carry six bundles through the street. Use two routes.',
  lesson:'Black and White abolitionists used testimony, newspapers and petitions to confront slavery. Moral suasion appealed to conscience; immediatism demanded action without delay.',
  sections:['13.4'],keyTerms:['abolitionist','moral suasion','immediatism','colonization'],
  opening:[
   shot('press-impression','The paper has to move','PRINTER','Garrison’s Liberator began in 1831. These sheets demand slavery’s immediate end. Get them to the meeting.','insert',5),
   shot('press-courier','A voice of his own','COURIER','Douglass published his story in 1845. Black abolitionists must reach readers in their own voices.','close',5),
   shot('press-departure','Six bundles. One meeting.','PRINTER','Six bundles. Keep the testimony dry, find a gap, and get those papers into people’s hands.','action',5)
  ],
  ending:[
   shot('press-handoff','An appeal to conscience','COURIER','Moral suasion appeals to conscience. Colonization would send Black people abroad; these pages demand equality here.','close',5),
   shot('press-aftermath','The demand is freedom now','PRINTER','Immediatism demands action now. The Liberty Party pursues elections, while Garrison rejects that political route.','wide',5)
  ],
  gates:[
   {at:.32,prompt:'The editor needs a moral-suasion pamphlet. Which bundle should reach the meeting?',choices:['An ACS plan to relocate free Black people abroad','Testimony showing how slavery destroys families','A promise to postpone emancipation indefinitely'],answer:1,why:'Moral suasion appeals to conscience through slavery’s human costs. Colonization proposed removal from the United States; abolitionists such as Garrison rejected its racist premise.'},
   {at:.7,prompt:'The final sheet needs an immediatist headline. Send the accurate one.',choices:['Delay emancipation until a distant generation','Relocate free Black people instead of ending slavery','End slavery: take action now'],answer:2,why:'Immediatism demands immediate action to end slavery. It describes the urgency of abolition, not a claim that all abolitionists supported the same tactics.'}
  ]},
 {id:'c13-convention',mode:'convention',title:'Open the Hall',eyebrow:'03 / Hall dash',genre:'Hall dash',place:'Seneca Falls, New York · July 1848',role:'A representative convention volunteer',duration:40,target:6,
  description:'Delegates are arriving. Set their seats, prepare the declaration and make a path to the speaking floor.',
  controls:'WASD or arrows moves. Space/E prepares the marked task; away from a task it dashes. Shift/C sprints. Finish all six preparations.',
  goal:'Prepare the hall before the delegates arrive.',
  lesson:'Women’s reform organizing, especially in abolition, helped build the movement for women’s rights. Seneca Falls asserted equality without instantly securing it.',
  sections:['13.3','13.5'],keyTerms:['temperance','teetotalism','Seneca Falls'],
  opening:[
   shot('hall-arrival','The doors open today','VOLUNTEER','Three hundred women and men are coming. Mott and Stanton need this floor ready. Open the room.','wide',5),
   shot('hall-voice','Work that crossed a boundary','VETERAN REFORMER','Temperance and abolition taught us to organize. Now we’re speaking for women’s rights, too.','close',5),
   shot('hall-pages','Make room for the declaration','VOLUNTEER','Women were excluded in London in 1840. This time, our declaration will put equality in print.','insert',5)
  ],
  ending:[
   shot('hall-declaration','The declaration goes public','DELEGATE','The Declaration of Sentiments borrows the Declaration of Independence’s language. It asserts equality; the vote remains unwon.','close',5),
   shot('hall-open-floor','Keep the floor open','VOLUNTEER','The Grimké sisters faced protests for speaking to mixed audiences. Today, more women will take the floor.','wide',5)
  ],
  gates:[
   {at:.32,prompt:'A Washingtonian volunteer offers a teetotal pledge. What does a signer promise?',choices:['No hard liquor, while beer and wine remain acceptable','No alcohol, including beer and wine','Moderate drinking only on public occasions'],answer:1,why:'Teetotalism means total abstinence from alcohol. Early temperance could mean moderation or avoiding hard liquor. The working-class Washingtonians welcomed women and children as well as men.'},
   {at:.7,prompt:'Choose the accurate introduction to the declaration you are placing on the table.',choices:['A statement of women’s equality modeled on the Declaration of Independence','A federal law immediately granting all women the vote','An agreement to keep women out of public reform'],answer:0,why:'The 1848 Seneca Falls convention issued a declaration asserting women’s rights. Antislavery organizing helped prepare this movement, but the convention did not instantly change voting law.'}
  ]}
];
export const HALL_TASKS=['Set women’s delegate seats','Set men’s delegate seats','Lay out declaration pages','Prepare the speakers’ table','Place the equality statement','Open the speaking floor'];
export const GAME_BY_ID=Object.fromEntries(GAMES.map(g=>[g.id,g]));
export const SOURCE_NOTE='Fictional participants and tasks in documented reform-era settings. Scene speech is original, not a historical quotation. These short games reinforce selected connections; the review hub covers the full chapter. Phrenology’s skull-reading claims are discredited pseudoscience.';
