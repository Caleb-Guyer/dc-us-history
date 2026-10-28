export const VERSION='6.2.0';
export const TERM_NAMES=['Code of deference','Universal manhood suffrage','Spoils system','Corrupt bargain','American System','Tariff of Abominations','Rotation in office','Kitchen Cabinet','Nullification','Monster bank','Whigs','Five Civilized Tribes','Trail of Tears','Tyranny of the majority','Second party system','Log cabin campaign'];
export const EPISODES=[
 {id:'count',title:'The missing majority',year:'1824 → 1825',genre:'Courier run',scene:'street',goal:'Collect the four electoral returns. Get the count to the newsroom.',controls:'A / D steer · Space jump · Shift dash · W sprint',intro:'count-in',outro:'count-out'},
 {id:'press',title:'The people’s press',year:'1828 → 1829',genre:'Rhythm / printing',scene:'press',goal:'Print six headlines. Strike while the press gauge crosses the gold band.',controls:'Space / click to strike · two clean strikes per sheet',intro:'press-in',outro:'press-out'},
 {id:'harbor',title:'A union on the edge',year:'1832 → 1833',genre:'Harbor traffic control',scene:'harbor',goal:'Guide six cargo boats to their numbered docks. Keep clear of shoals and other boats. Boost through clear water.',controls:'Draw a route / dock buttons · Space full-sail boost',intro:'harbor-in',outro:'harbor-out'},
 {id:'bank',title:'Follow the money',year:'1832 → 1837',genre:'Conveyor dispatch',scene:'bank',goal:'Route the deposits, then apply the new land-payment rule. Eight accurate transfers.',controls:'1 / 2 / 3 choose rail · Space launches in gold',intro:'bank-in',outro:'bank-out'},
 {id:'record',title:'Rights on paper',year:'1830 → 1839',genre:'Court-record investigation',scene:'record',goal:'Find three records, then rebuild the legal timeline.',controls:'Inspect the three desks · drag a record to its matching timeline slot',intro:'record-in',outro:'record-out'},
 {id:'rally',title:'The image and the crowd',year:'1840',genre:'Rally scramble',scene:'rally',goal:'Carry three signs to their marked platforms. Dodge the moving parade floats.',controls:'WASD move · Shift sprint · Q dash · E collect / place · click ground to move',intro:'rally-in',outro:'rally-out'}
];
// Original dramatization. Names/errands are fictional; public outcomes stay fixed.
export const LINES={
 'opening':{speaker:'Eliza Reed · fictional printer',voice:'af_sarah',text:'Every politician says he speaks for the people. I carry the returns, set the type, and keep the record. Let us see who gets counted.'},
 'count-in':{speaker:'Newsroom editor · dramatized',voice:'bm_george',text:'Four candidates. Two hundred sixty-one electoral votes. Bring me every return before we print a winner. A lead is not a majority.'},
 'count-out':{speaker:'The historical record',voice:'af_sarah',text:'Jackson led with ninety-nine electoral votes, short of the one hundred thirty-one needed. The House chose Adams in February eighteen twenty-five. Clay became secretary of state. Jackson supporters alleged a corrupt bargain; a secret deal was never proved.'},
 'press-in':{speaker:'Eliza Reed · fictional printer',voice:'af_sarah',text:'New voters. Organized parties. Newspapers everywhere. Jackson wins in eighteen twenty-eight. Keep the press aligned. These headlines are changing who holds power.'},
 'press-out':{speaker:'Newsroom editor · dramatized',voice:'bm_george',text:'More White men can vote, but democracy is still bounded by race and sex. Party loyalty brings government jobs. The crowd is louder. That does not mean everybody is heard.'},
 'harbor-in':{speaker:'Customs clerk · fictional',voice:'am_michael',text:'South Carolina declares the tariffs void. Jackson says a state cannot cancel federal law. Keep the cargo moving while Congress and the president confront the crisis.'},
 'harbor-out':{speaker:'The historical record',voice:'af_sarah',text:'The Force Bill authorized federal enforcement. The Compromise Tariff lowered rates. South Carolina accepted the tariff settlement, then symbolically nullified the Force Bill. The crisis ended without the civil war people feared.'},
 'bank-in':{speaker:'Eliza Reed · fictional printer',voice:'af_sarah',text:'Jackson vetoes the bank recharter in eighteen thirty-two. Now the federal deposits are moving to state banks. Follow each transfer. When the rule changes, watch what can buy public land.'},
 'bank-out':{speaker:'The historical record',voice:'am_michael',text:'Biddle tightened lending. The Specie Circular required gold or silver for public land. British credit tightened and cotton prices fell. These pressures helped bring the Panic of eighteen thirty-seven. Van Buren inherited the crisis.'},
 'record-in':{speaker:'Eliza Reed · fictional printer',voice:'af_sarah',text:'Return to New Echota, eighteen thirty-two. The Cherokee have pursued their rights in court. Read the records carefully. Two Supreme Court cases have very different holdings.'},
 'record-out':{speaker:'The historical record',voice:'af_sarah',text:'A ruling did not stop removal. In eighteen thirty-eight and thirty-nine, during Van Buren’s presidency, the military forced thousands of Cherokee west. Thousands died on the Trail of Tears. Cherokee legal resistance, petitions, and survival remain part of the record.'},
 'rally-in':{speaker:'Rally stagehand · fictional',voice:'am_michael',text:'The Whigs sell Harrison as a log-cabin war hero, with Tyler on the ticket. The Democrats stand with Van Buren. Get the signs to the platforms. Watch the floats!'},
 'rally-out':{speaker:'Eliza Reed · fictional printer',voice:'af_sarah',text:'Harrison wins. Campaigns have become mass spectacles. Tocqueville saw promise in equality before the law, but warned of a tyranny of the majority. More voices at the polls. Whose rights can the crowd still silence?'},
 'final':{speaker:'Eliza Reed · fictional printer',voice:'af_sarah',text:'The campaign is finished. Now close the newspaper and see what you remember. Elections, parties, tariffs, banks, removal, and majority power. The questions are yours.'}
};
export const PRESS_JOBS=[
 {title:'THE VOTER ROLLS OPEN',term:'Universal manhood suffrage',story:'Many states dropped property tests for White men. Women and most Black and Native people remained excluded.',ref:'P010–012'},
 {title:'JACKSON WINS IN 1828',term:'The Democrats',story:'Organized parties, campaign newspapers and appeals to ordinary White voters helped Jackson defeat John Quincy Adams.',ref:'P024–027'},
 {title:'A MACHINE BUILT ON LOYALTY',term:'The spoils system',story:'Van Buren’s Bucktails helped build disciplined party organization. Government jobs rewarded political supporters.',ref:'P013–014'},
 {title:'NEW FACES IN PUBLIC OFFICE',term:'Rotation in office',story:'Jackson replaced appointed officials. Supporters praised rotation; critics attacked patronage and corruption.',ref:'P028–029'},
 {title:'ADVISERS BEYOND THE CABINET',term:'The Kitchen Cabinet',story:'The Eaton controversy divided Jackson’s circle. Van Buren gained trust; informal advisers gained influence.',ref:'P030–031'},
 {title:'WHO SHOULD BUILD THE ECONOMY?',term:'The American System',story:'Clay favored protective tariffs, a national bank and federal internal improvements. Adams embraced the program.',ref:'P019–022'}
];
export const BANK_SLIPS=[
 {id:'tax-coin',year:1833,kind:'coin',label:'FEDERAL DEPOSIT · GOLD',to:'state',detail:'Federal deposits are being moved from the Second Bank into state banks.'},
 {id:'tax-note',year:1833,kind:'note',label:'FEDERAL DEPOSIT · NOTES',to:'state',detail:'The destination changes to state banks. This is not a ban on ordinary paper money.'},
 {id:'tax-silver',year:1833,kind:'coin',label:'FEDERAL DEPOSIT · SILVER',to:'state',detail:'Jackson’s removal of deposits weakened the Second Bank. Biddle responded by restricting lending.'},
 {id:'land-gold',year:1836,kind:'coin',label:'PUBLIC LAND · GOLD',to:'land',detail:'The Specie Circular requires gold or silver for federal public-land purchases.'},
 {id:'land-note',year:1836,kind:'note',label:'PUBLIC LAND · PAPER NOTES',to:'exchange',detail:'Paper notes cannot pay this public-land purchase. Seek specie; notes still circulate elsewhere.'},
 {id:'land-silver',year:1836,kind:'coin',label:'PUBLIC LAND · SILVER',to:'land',detail:'Silver is specie, so it satisfies the land-payment rule.'},
 {id:'land-note2',year:1836,kind:'note',label:'PUBLIC LAND · BANKNOTES',to:'exchange',detail:'Requiring hard currency strained specie supplies as land buyers sought coins.'},
 {id:'land-gold2',year:1836,kind:'coin',label:'PUBLIC LAND · GOLD COINS',to:'land',detail:'The Panic of 1837 had several causes, including credit contraction and falling cotton prices.'}
];
export const RECORDS=[
 {id:'act',year:'1830',title:'Indian Removal Act',label:'Removal policy',detail:'Congress passed a removal law under Jackson. White demands for land and Georgia gold intensified pressure on Native nations.',slot:0,ref:'P049–051'},
 {id:'cherokee',year:'1831',title:'Cherokee Nation v. Georgia',label:'Court jurisdiction',detail:'The Court held that it lacked original jurisdiction because it did not treat the Cherokee Nation as a foreign state. This was not the Worcester holding.',slot:1,ref:'P052'},
 {id:'worcester',year:'1832',title:'Worcester v. Georgia',label:'Territorial sovereignty',detail:'Marshall’s Court held that Georgia’s law could not govern within Cherokee territory. The ruling did not stop later forced removal.',slot:2,ref:'P053–055'}
];
