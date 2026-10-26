// Original questions keyed to private paragraph IDs in the supplied edited chapter.
// The classroom file and source prose are not bundled.
export const TOPICS=[
 {id:'politics',title:'A new political style'},
 {id:'democracy',title:'Jackson and party power'},
 {id:'crisis',title:'Nullification and the Bank War'},
 {id:'removal',title:'Removal and Native sovereignty'},
 {id:'majority',title:'Majorities and the 1840 campaign'}
];
const rows=[];
const add=(topic,source,term,prompt,choices,why)=>rows.push({topic,source:Array.isArray(source)?source:[source],term,prompt,choices,why});

// 10.1
add('politics','P007',true,'What did the early republic’s code of deference encourage?',
 ['Respect for leaders with prestigious backgrounds or accomplishments','Loyalty to a party platform rather than individual status','Equal political authority for every adult resident','Public jobs awarded for party service rather than social standing'],
 'Deference meant accepting leadership by people regarded as social superiors. Education, family, reputation and accomplishment could establish that standing.');
add('politics','P007',false,'In the republican ideal described in the chapter, what did virtue mean?',
 ['Putting the public good ahead of personal advantage','Preserving a family’s wealth and social position','Rewarding loyal friends with government influence','Defending local advantage even at the expense of the nation'],
 'Republican virtue centered on the common good. Property and social standing were often treated as evidence of virtue, but were not its definition.');
add('politics','P008',false,'How should a reader treat Weems’s Washington cherry-tree story?',
 ['As a fictional lesson promoting Washington’s moral reputation','As a transcript of a cabinet meeting','As the legal basis for expanded suffrage','As an eyewitness account of the 1824 election'],
 'The chapter identifies the episode as fiction. Its significance is the lesson of honesty and deference it taught readers.');
add('politics',['P010','P011'],false,'Which change best captures the new political style of the 1820s?',
 ['Appeals to ordinary White voters increasingly challenged elite authority','Voters replaced elections with hereditary presidents','Property ownership became a universal new voting requirement','Political parties stopped organizing supporters'],
 'Growing deference to a White male voting majority challenged the older expectation of deference to a prestigious ruling class.');
add('politics','P011',true,'In this chapter, what did universal manhood suffrage generally mean?',
 ['Voting rights for adult White men without property qualifications','Voting rights for every adult regardless of race or sex','Voting rights automatically extended to men of every race','Voting rights limited to White men who paid property taxes'],
 'The phrase expanded White male participation. It did not mean universal adult suffrage or equal political rights for everyone.');
add('politics',['P010','P011','P050'],false,'A state removes property requirements for White male voters. What has changed?',
 ['More White men can vote while major racial and gender exclusions remain','All women and Native people necessarily gain the vote','The Electoral College automatically disappears','Every federal office must now be directly elected'],
 'Removing property tests did not itself remove racial and gender exclusions or change every constitutional method of selecting officials.');
add('politics',['P011','P012'],false,'Why did reformers challenge property qualifications for voting?',
 ['They rejected the assumption that owning property proved civic virtue','They wanted legislatures to choose every president','They believed only wealthy landowners understood elections','They wanted to replace elections with appointment councils'],
 'Middle- and lower-income men disputed property ownership as a test of a person’s fitness or right to participate.');
add('politics','P013',false,'Who built the Bucktail Republican organization in New York?',
 ['Martin Van Buren','Nicholas Biddle','Samuel Worcester','William Henry Harrison'],
 'Van Buren organized disciplined supporters around practical electoral success and party loyalty.');
add('politics','P013',false,'What does the Bucktails’ change of position on the Erie Canal illustrate?',
 ['A practical willingness to support a project once it became popular','A refusal to respond to voters','A permanent campaign against all canals','A demand that only the president fund state projects'],
 'They initially opposed the canal, then supported it as its popularity became clear. The example shows pragmatic party politics.');
add('politics','P014',false,'What was a central feature of Van Buren’s political machine?',
 ['Disciplined members who rewarded loyalty and supported party candidates','A ban on organizing between elections','Nominees drawn from one hereditary family','A court system that selected every candidate'],
 'Political machines connect organization, nominations and rewards. Van Buren helped make party loyalty a major route to office.');
add('politics','P014',true,'Which situation best illustrates the spoils system?',
 ['A winning party gives public jobs to loyal supporters','A court orders a state to respect a treaty','Congress sets a tariff on imported goods','Voters choose electors without property tests'],
 'The spoils system rewards political service with government jobs. Critics argued that loyalty could displace competence.');
add('politics',['P016','P017'],false,'Why did the presidential election of 1824 go to the House?',
 ['No candidate won an Electoral College majority','Jackson and Adams received exactly equal electoral totals','Clay withdrew, leaving too few candidates for an electoral result','Winning the popular vote automatically required a House decision'],
 'Jackson led the electoral vote, but his total was a plurality, not the majority required to win.');
add('politics','P017',false,'Jackson won 99 of 261 electoral votes in 1824. Why was that insufficient?',
 ['A majority required at least 131 electoral votes','A candidate needed two-thirds of the electoral votes','A candidate needed a national popular majority before electoral votes counted','A plurality mattered only if the candidate also won every region'],
 'A plurality is the largest share. A majority is more than half, so 99 did not reach the 131-vote threshold.');
add('politics','P017',false,'In the House decision that settled the election of 1824, how were votes counted?',
 ['Each state delegation cast one vote','Each representative cast an individual presidential vote','Each state received votes proportional to population','The Senate chose between the two leading presidential candidates'],
 'The Twelfth Amendment’s contingent-election procedure gives each state one House vote.');
add('politics',['P017','P018'],false,'Which sequence fueled Jackson supporters’ anger about 1824?',
 ['Clay helped Adams win in the House; Adams appointed Clay secretary of state','Jackson appointed Clay to direct the bank before voting began','Adams and Clay abolished the House’s state-delegation vote','Calhoun became president and appointed Jackson secretary of state'],
 'The appointment made the outcome look suspicious to Jackson’s supporters. Suspicion did not establish a proven secret agreement.');
add('politics','P018',true,'What was the “corrupt bargain” in Jacksonian political arguments?',
 ['An allegation that an Adams–Clay arrangement denied Jackson the presidency','A court ruling proving Jackson bribed every elector','A treaty transferring Cherokee land to France','A law requiring banks to finance campaigns'],
 'Jackson supporters used the phrase to attack the House outcome and Clay’s appointment. Corruption was alleged, not conclusively proven.');
add('politics','P019',true,'Which policies made up Clay’s American System?',
 ['Protective tariffs, a national bank and federal internal improvements','Low tariffs, a national bank and federal transportation projects','Protective tariffs, no national bank and exclusively state-funded improvements','Protective tariffs and a national bank but no federal transportation role'],
 'Clay linked protected manufacturing and financial stability with roads and canals that could encourage national development.');
add('politics','P020',false,'How was a protective tariff intended to help American manufacturers?',
 ['By making competing imported goods more expensive','By guaranteeing foreign producers lower prices','By ending all manufacturing','By preventing customs revenue collection'],
 'Tariffs add to import prices. Supporters expected American-made alternatives to become more attractive to buyers.');

// 10.2
add('democracy','P024',false,'Who defeated John Quincy Adams in the 1828 election?',
 ['Andrew Jackson','Henry Clay','Martin Van Buren','John Tyler'],
 'Jackson’s victory brought the Democratic Party to the presidency and demonstrated the strength of organized mass campaigning.');
add('democracy','P024',false,'Which party grew from Jackson supporters who called themselves the Democracy?',
 ['The Democratic Party','The Federalist Party','The Whig Party','The Democratic-Republicans under their older party identity'],
 'Jackson’s coalition became the Democratic Party, distinct from the older Democratic-Republicans and the later Republican Party.');
add('democracy',['P016','P025'],false,'Which reputation was central to Jackson’s popular image?',
 ['A forceful military hero associated with New Orleans','A financial expert closely identified with the national bank','An experienced diplomat identified with education and elite public service','A congressional leader known primarily for the American System'],
 'Campaigners emphasized Jackson’s military achievements and fighter’s image, contrasting them with Adams’s scholarly, elite reputation.');
add('democracy','P026',false,'What helped distinguish Jackson’s 1828 campaign from earlier contests?',
 ['A strong party organization mobilizing a broad electorate','A continued reliance on congressional caucuses alone','An emphasis on elite family connections instead of mass mobilization','A rejection of local party networks in favor of personal correspondence'],
 'Party networks carried a repeated campaign message to voters. Organization mattered alongside Jackson’s personal popularity.');
add('democracy','P026',false,'Why did Jackson’s campaign keep discussing 1824?',
 ['The alleged corrupt bargain portrayed Adams as a beneficiary of elite self-interest','The campaign wanted to celebrate Clay’s appointment','Jackson had already completed a presidential term','The Court had ordered Adams’s reelection'],
 'The allegation supplied a powerful organizing story about ordinary voters being overruled by insiders.');
add('democracy','P027',false,'How did Jackson’s 1828 result differ from his result in 1824?',
 ['He won a clear popular and electoral victory rather than only an electoral plurality','He again waited for the House to select Adams','He won no electors but took office through the Senate','He became president after a Supreme Court appeal'],
 'In 1824 Jackson lacked an electoral majority. In 1828 he defeated the incumbent with a decisive electoral majority.');
add('democracy','P028',true,'What did rotation in office describe?',
 ['Replacing appointed officials so new people could hold public posts','Regularly shifting the same officials among existing department jobs','Alternating appointments equally between rival political parties','Giving appointed officials constitutionally protected lifetime terms'],
 'Under Jackson, replacement of appointed officeholders often rewarded loyal party supporters.');
add('democracy','P028',false,'A newspaper editor campaigns for Jackson and later receives a postmaster job. What does this illustrate?',
 ['Patronage connecting political support to a public appointment','Judicial review overturning a conviction','A tariff protecting northern manufacturing','The House method of electing presidents'],
 'The chapter describes public positions going to loyalists, including newspaper editors who helped the campaign.');
add('democracy','P029',false,'What was a major criticism of Jacksonian patronage?',
 ['Party loyalty could outweigh competence and integrity','It gave every American an equal presidential vote','It prevented any appointments from changing','It required officials to own bank shares'],
 'Opponents argued that rewarding political service could displace merit and encourage corruption.');
add('democracy','P029',false,'Why did corruption by a Jackson appointee damage the Democrats’ argument?',
 ['It contradicted their claim to serve ordinary people rather than private advantage','It proved all elections unconstitutional','It required restoration of a hereditary monarchy','It made all tariffs impossible to collect'],
 'The scandal exposed a gap between democratic language and the conduct of an official chosen through patronage.');
add('democracy',['P030','P031'],false,'Who was central to the controversy called the Petticoat affair?',
 ['Margaret “Peggy” O’Neal Eaton','Rachel Jackson','Floride Calhoun','Dolley Madison'],
 'Washington society’s treatment of Peggy Eaton, who married John Eaton, divided people close to the president.');
add('democracy','P031',false,'How did the Petticoat affair contribute to Jackson’s break with Calhoun?',
 ['Jackson defended Peggy Eaton while Floride Calhoun helped exclude her socially','Calhoun prosecuted Jackson for moving bank deposits','Peggy Eaton became president after Calhoun resigned','Jackson overturned a tariff conviction'],
 'A social conflict became a political division within the administration.');
add('democracy','P031',false,'Why was Jackson sensitive to attacks on Peggy Eaton’s reputation?',
 ['He connected them with earlier attacks on his late wife Rachel','He believed she directed the Second Bank','He had promised to make her a justice','He needed her state’s contingent-election vote'],
 'The chapter explains that Jackson drew a personal parallel with criticism of Rachel Jackson’s marriage history.');
add('democracy','P031',false,'How did Van Buren’s response to the Eaton controversy affect his standing?',
 ['Defending the Eatons helped him become Jackson’s trusted ally','It made Jackson choose Calhoun as successor','It permanently ended his political career','It made him chief justice in Worcester'],
 'Van Buren defended the Eatons and included them socially. Jackson increasingly relied on him.');
add('democracy','P031',true,'What was Jackson’s Kitchen Cabinet?',
 ['An informal circle of trusted advisers outside the official cabinet','The formal department heads serving in the executive cabinet','The congressional caucus that selected presidential candidates','The Democratic convention that formally nominated a candidate'],
 'The term referred to trusted informal advisers, including Van Buren, and highlights personal and party loyalty.');
add('democracy','P031',false,'How did the Kitchen Cabinet differ from the official cabinet?',
 ['It was an informal network rather than the formal department heads','Only the informal group could exercise constitutional executive powers','The official cabinet was independent of party politics, while informal advisers had no influence','Both groups held identical legal offices and confirmation requirements'],
 'Informal access can give advisers influence without making them official cabinet members.');
add('democracy',['P010','P024','P050'],false,'Why is “the rise of democracy” an incomplete description of Jackson’s era?',
 ['Participation grew for many White men while others remained excluded or threatened','Every adult immediately gained equal rights','Voting expansion ended slavery and forced removal','The presidency became hereditary'],
 'Democratic expansion coexisted with racial exclusion, slavery and attacks on Native sovereignty.');
add('democracy',['P004','P025','P044'],false,'Which appeal best matches Jackson’s political style?',
 ['A tough defender of ordinary people confronting privileged insiders','A hereditary aristocrat owed obedience because of his family','A bank director asking voters to avoid political parties','A candidate promising to end presidential elections'],
 'Military fame, combativeness and resentment of elite privilege shaped Jackson’s image. That appeal did not mean his policies protected everyone.');

// 10.3
add('crisis','P021',true,'What was the Tariff of Abominations?',
 ['Opponents’ name for the high protective tariff of 1828','The compromise measure that reduced tariff rates in 1833','The enforcement law passed during the tariff crisis in 1833','The requirement for specie in western land purchases'],
 'Southern opponents used the hostile name because they believed the tariff favored northern manufacturing at their expense.');
add('crisis','P033',false,'Who wrote the South Carolina Exposition and Protest?',
 ['John C. Calhoun','Nicholas Biddle','John Quincy Adams','Samuel Worcester'],
 'Calhoun argued that states could reject federal laws when a national majority threatened regional interests.');
add('crisis','P034',true,'What did nullification claim a state could do?',
 ['Declare an unwelcome federal law invalid within the state','Withdraw from the Union and become an independent country','Have the Supreme Court invalidate a law as unconstitutional','Exercise the president’s veto over a bill passed by Congress'],
 'Nullification asserted a state power to void federal law. Jackson rejected the claim and defended the Union’s authority.');
add('crisis','P036',false,'What did South Carolina’s 1832 nullification ordinance target?',
 ['The tariffs of 1828 and 1832','The Treaty of Ghent and Missouri Compromise','The Cherokee constitution and Erie Canal charter','The presidential elections of 1824 and 1828'],
 'The state declared both tariffs null and void within South Carolina, creating a direct conflict over federal authority.');
add('crisis',['P035','P036'],false,'How did Jackson respond to South Carolina’s nullification claim?',
 ['He denied the power to void federal law and pledged to preserve the Union','He accepted an unlimited state right to ignore federal law','He agreed that Calhoun should replace him','He asked the Bank of England to decide'],
 'Jackson’s preference for limited government did not extend to accepting state defiance of federal law.');
add('crisis','P036',false,'Why did the Tariff of 1832 fail to settle the dispute?',
 ['Its reductions did not satisfy South Carolina’s nullifiers','It abolished South Carolina’s government','It banned imports from northern states','It made every tariff unconstitutional'],
 'Some rates fell, but the nullification movement continued to insist on a state power to override the tariffs.');
add('crisis','P037',false,'What did the Force Bill of 1833 authorize?',
 ['Federal force to ensure compliance with federal law','Gradual reductions in protective tariff rates','South Carolina’s claimed right to void federal tariffs','Early renewal of the Second Bank’s charter'],
 'The Force Bill backed federal enforcement while Congress also pursued a negotiated tariff reduction.');
add('crisis','P037',false,'What helped defuse the immediate danger of armed conflict?',
 ['The Compromise Tariff of 1833','Passage of the original Tariff of Abominations','Rechartering the Second Bank for another twenty years','Repeal of the 1832 presidential election result'],
 'The compromise reduced tariff rates and supplied a path away from confrontation.');
add('crisis','P037',false,'What did South Carolina’s nullifiers do after accepting the tariff compromise?',
 ['They nullified the Force Bill','They elected Biddle president','They abolished state elections','They restored Britain’s tariff of 1789'],
 'The symbolic action let them continue asserting nullification even while accepting the tariff settlement.');
add('crisis','P039',false,'Which statement correctly describes the Second Bank’s original charter?',
 ['It began in 1816 and was set to expire in 1836','It began in 1832 and expired before that election','It began in 1791 and could never expire','It began after the Panic of 1837'],
 'The bank received a twenty-year charter in 1816. The 1832 recharter campaign came four years before its scheduled expiration.');
add('crisis','P040',false,'Why was the Second Bank supposed to stabilize the economy?',
 ['Many banks issued notes with inconsistent values','No American bank had ever issued paper money','Only British institutions could lend to Americans','Every state constitution required identical coin designs'],
 'The chapter describes a confusing variety of banknotes. A national bank was intended to bring greater stability.');
add('crisis',['P041','P045'],false,'Who directed the Second Bank during its conflict with Jackson?',
 ['Nicholas Biddle','Thomas Hart Benton','Robert Hayne','William Wirt'],
 'Biddle defended the bank and later tightened lending after federal deposits were removed.');
add('crisis','P041',false,'What did Jackson mean by a preference for hard currency?',
 ['Gold and silver rather than bank-issued paper','Banknotes redeemable only through state legislatures','Federal bonds and other written promises of repayment','Any paper currency issued by a federally chartered bank'],
 'Hard currency, or specie, meant precious-metal money. Jackson distrusted paper money and financial speculation.');
add('crisis','P044',true,'What did opponents mean by calling the Second Bank the “monster bank”?',
 ['They portrayed it as a powerful institution serving a privileged few','They meant a federal agency directing removal marches','They named Van Buren’s new state bank in 1840','They praised its abolition of all paper money'],
 'The phrase was partisan rhetoric about concentrated financial power. Jackson used popular distrust of privilege to attack the bank.');
add('crisis','P043',false,'Why did rechartering the bank become an election issue in 1832?',
 ['Supporters pushed early renewal, which Jackson vetoed','Its charter had already expired ten years earlier','Jackson asked the Court to renew it without Congress','The House was choosing a president after another tie'],
 'Clay and other supporters hoped the issue would hurt Jackson. The veto instead supported his campaign against special privilege.');
add('crisis','P045',false,'What followed Jackson’s removal of federal bank deposits in 1833?',
 ['Deposits went to state banks; Biddle restricted lending','Deposits became voting bonuses for every adult','Deposits went to the Cherokee Supreme Court','Deposits funded immediate abolition of all tariffs'],
 'The transfer weakened the national bank. Biddle’s contraction of credit added to financial strain.');
add('crisis','P045',false,'What did the Specie Circular require for western public-land purchases?',
 ['Payment in gold or silver','Payment only in Second Bank paper notes','Any paper notes accepted by the purchaser’s state bank','Credit backed by a promise to sell a future cotton harvest'],
 'The circular required specie and increased demand for scarce gold and silver.');
add('crisis','P045',false,'Which explanation best fits the Panic of 1837 in the chapter?',
 ['Tight credit, scarce specie and falling cotton prices combined','One failed speech instantly destroyed every bank','The Cherokee Court abolished American currency','The compromise tariff guaranteed bank failures'],
 'The crisis involved multiple domestic and international pressures. Van Buren inherited its political consequences.');

// 10.4
add('removal',['P049','P050','P052'],false,'Which president signed the Indian Removal Act in 1830?',
 ['Andrew Jackson','Martin Van Buren','William Henry Harrison','John Tyler'],
 'Jackson signed the act in May 1830. The principal forced Cherokee migration later took place under Van Buren in 1838–1839.');
add('removal','P051',false,'What intensified White demands for Cherokee land in Georgia?',
 ['Valuable farmland and the discovery of gold','A Cherokee demand to abolish presidential elections','The absence of any agricultural value','An agreement to give the land to Britain'],
 'Settlers coveted Cherokee agricultural lands. Gold discoveries increased the pressure for dispossession.');
add('removal','P050',true,'How should the historical label “Five Civilized Tribes” be understood?',
 ['As an outsider label for five southeastern Native nations, reflecting colonial standards','As the name of a formal five-nation alliance created for one Supreme Court appeal','As a treaty category that automatically guaranteed protection against removal','As a claim that these were the five most populous Native nations in North America'],
 'The phrase reflected outsiders’ values and adoption of some Anglo-American practices. It is not an objective ranking of cultures or a justification for removal.');
add('removal','P050',false,'Which list identifies the five Native nations discussed under that historical label?',
 ['Cherokee, Choctaw, Chickasaw, Creek and Seminole','Cherokee, Sauk, Fox, Shawnee and Lakota','Choctaw, Ojibwe, Haudenosaunee, Pawnee and Apache','Seminole, Mandan, Nez Perce, Wampanoag and Pequot'],
 'The chapter names the Cherokee, Choctaw, Chickasaw, Creek and Seminole peoples. They were distinct nations with different histories.');
add('removal',['P050','P055'],false,'What does removal show about Native adoption of some Anglo-American customs?',
 ['Adopting those practices did not guarantee protection from dispossession','It guaranteed equal voting rights in every state','It prevented every government removal policy','It required every Native nation to respond identically'],
 'Some communities adopted English, Christianity and other practices, yet White land demands and government removal policies continued.');
add('removal','P052',false,'How did the Cherokee challenge Georgia’s actions through the American legal system?',
 ['They pursued Supreme Court cases with legal counsel','They appointed Calhoun chief justice','They closed the Second Bank’s headquarters','They asked the House to overturn the 1828 election'],
 'The Cherokee used legal arguments to defend their national rights. Former attorney general William Wirt represented them.');
add('removal','P052',false,'What did Cherokee Nation v. Georgia decide in 1831?',
 ['The Cherokee could not bring that case as a foreign nation under the Court’s original jurisdiction','Georgia’s laws were invalid in Cherokee territory, the central result of Worcester in 1832','The Cherokee were a foreign state entitled to use the Court’s original jurisdiction','The removal statute itself granted Georgia unlimited treaty-making authority'],
 'The Court did not accept the Cherokee Nation as a foreign state for that jurisdictional purpose. This differs from the later Worcester ruling.');
add('removal','P053',false,'Who was Samuel Worcester?',
 ['A missionary and postmaster among the Cherokee who opposed removal','South Carolina’s governor during the nullification mobilization','The banker who directed the Second Bank','The Whig vice-presidential nominee in 1840'],
 'Worcester’s residence among the Cherokee and opposition to removal brought him into conflict with Georgia’s assertion of control.');
add('removal',['P053','P054'],false,'What issue lay behind Worcester’s prosecution?',
 ['Georgia’s attempt to control non-Native residence in Cherokee territory','His refusal to pay a tariff on cotton cloth','New York’s number of presidential electors','Whether the national bank’s charter could ever expire'],
 'The prosecution formed part of the struggle over Cherokee territory and the limits of state authority.');
add('removal','P054',false,'Why did Worcester’s loss of his postmaster position matter?',
 ['It removed a federal connection that had helped protect his residence','It immediately made him governor of Georgia','It gave the Cherokee a seat in Congress','It ended every Supreme Court appeal'],
 'The chapter says his federal job initially helped secure his release. After that protection disappeared, he was arrested again.');
add('removal','P054',false,'What was the central result of Worcester v. Georgia in 1832?',
 ['The Court recognized Cherokee sovereignty and rejected Georgia’s law in their territory','The Cherokee could not sue as a foreign state, the jurisdictional result in the 1831 case','Georgia could require state permission for residence because Cherokee territory had no sovereign status','A presidential removal order automatically canceled every earlier federal treaty'],
 'Chief Justice Marshall’s Court recognized the Cherokee as a distinct political community. Georgia could not exercise the authority it claimed there.');
add('removal',['P054','P055'],false,'Why did Worcester fail to guarantee that the Cherokee could stay?',
 ['A favorable legal ruling did not secure effective protection against removal','The ruling abolished the Cherokee government','The Court declared every Native person a foreign soldier','Worcester ordered every Cherokee family west'],
 'Legal recognition and enforcement were different things. The removal policy and coercive government power continued despite the ruling.');
add('removal','P055',true,'What was the Trail of Tears?',
 ['The forced Cherokee removal west, with devastating loss of life','A voluntary campaign tour by Harrison and Tyler','The route carrying gold to the national bank','A canal connecting South Carolina to New York'],
 'The name refers to coercive removal and its human cost. It was not a voluntary migration or an ordinary travel route.');
add('removal','P055',false,'Which chronology correctly separates removal policy from the main Cherokee forced migration?',
 ['Jackson promoted removal; the main forced Cherokee migration occurred under Van Buren in 1838–1839','Van Buren signed the act in 1824 and Jackson enforced it in 1840','Harrison ordered removal before the 1824 election','Worcester ended removal before Jackson left office'],
 'Jackson advanced removal policy. The principal Cherokee roundup and forced migration came after his presidency, under Van Buren.');
add('removal','P055',false,'What human cost does the edited chapter associate with the Cherokee Trail of Tears?',
 ['As many as roughly four thousand Cherokee deaths','No deaths because every family moved voluntarily','Deaths only among federal banking officials','Exactly one death, with no uncertainty'],
 'The chapter gives an estimate of as many as four thousand Cherokee deaths. The total is an estimate, not a perfectly known count.');
add('removal','P055',false,'Which statement best describes southeastern removal policy’s reach?',
 ['It affected several Native nations, not only the Cherokee','It applied only to British settlers in New York','It ended when Worcester left prison','Every affected nation had an identical route and experience'],
 'The chapter also discusses Creek, Choctaw, Chickasaw and Seminole removal. Their experiences differed within a wider policy of dispossession.');
add('removal','P056',false,'Why did Black Hawk and Sauk and Fox followers recross the Mississippi in 1832?',
 ['To return to their ancestral homeland in northern Illinois','To campaign for bank rechartering','To move the Cherokee capital to Washington','To collect federal tariffs'],
 'Their return prompted settler panic and military mobilization, leading to Black Hawk’s War.');
add('removal','P056',false,'What does the Bad Axe Massacre reveal about the conflict?',
 ['Native women and children were among those killed, so it was not simply a clash of equal armies','Native civilians suffered no harm','The Supreme Court commanded troops against the bank','The violence occurred at a voluntary campaign rally'],
 'The chapter describes more than two hundred Native men, women and children killed. The event exposes the violence of dispossession.');

// 10.5
add('majority','P060',false,'Who wrote Democracy in America?',
 ['Alexis de Tocqueville','Martin Van Buren','Henry Clay','Mason Locke Weems'],
 'The French observer studied American democratic society in volumes published in 1835 and 1840.');
add('majority','P059',false,'What official assignment originally brought Tocqueville to the United States?',
 ['Studying prison reform','Collecting the Tariff of Abominations','Negotiating Cherokee removal','Serving as Treasury secretary'],
 'The prison-reform assignment provided an opportunity to investigate American political and social life more broadly.');
add('majority','P060',false,'What did Tocqueville identify as an important democratic benefit?',
 ['Equality before the law','A guarantee of equal economic wealth for every citizen','The immediate disappearance of racial and voting exclusions','Complete protection for dissent without any independent institutions'],
 'He admired democratic equality while warning that majority power could threaten independence and minority rights.');
add('majority','P060',true,'What is tyranny of the majority?',
 ['Majority power used to suppress minority or individual rights and views','A system requiring unanimous approval before a majority can act','A minority’s power to block every majority decision','A monarch’s power to govern without a representative legislature'],
 'A numerical majority can still act unjustly. The concept asks whether people outside it have meaningful protections.');
add('majority','P062',false,'Why did Tocqueville worry about where a wronged minority could seek help?',
 ['Many institutions and public opinion could all answer to the same majority','Minority parties permanently controlled every branch despite losing elections','State autonomy made nationwide public opinion politically powerless','Federal judges could always reverse any elected official’s political decision'],
 'He worried that majority influence across both institutions and society could leave dissenters without effective protection.');
add('majority',['P055','P060'],false,'Which example most clearly illustrates the danger Tocqueville described?',
 ['A powerful majority supports dispossession despite a minority nation’s rights','A majority adopts legal protections for a religious minority','A candidate accepts losing a fairly conducted election','An independent court strikes down a popular law to protect minority rights'],
 'Majority rule alone does not ensure justice. Removal shows why rights and protections for those outside the dominant electorate matter.');
add('majority','P063',true,'Which parties defined the second party system?',
 ['Democrats and Whigs','Federalists and Democratic-Republicans','Republicans and Populists','Progressives and Socialists'],
 'Sustained Democratic–Whig competition replaced the earlier Federalist–Democratic-Republican rivalry.');
add('majority','P046',true,'Why did Jackson’s opponents adopt the name Whigs?',
 ['They associated his power with monarchy and borrowed a name linked to resisting kings','They wanted him to become hereditary king','They were naming a new removal agency','They favored a complete ban on national elections'],
 'The name opposed what critics regarded as an overmighty executive, echoing the older British political label.');
add('majority',['P047','P064'],false,'Which economic program best fits the Whigs?',
 ['An active federal role supporting banks, transportation and development','A limited federal economic role with improvements left largely to states','A hard-money program centered on removing federal bank deposits','National growth pursued without a bank or federal internal improvements'],
 'Whigs supported a national role in encouraging growth, including internal improvements and a national bank.');
add('majority','P064',false,'How did Democrats generally differ from Whigs on federal economic policy?',
 ['They favored a smaller federal role in promoting development','They wanted the president personally to run every bank','They required federal ownership of every farm','The parties held identical economic views'],
 'The parties differed over whether the national government should serve as an engine of economic growth.');
add('majority',['P045','P047'],false,'Who won the presidency in 1836 as Jackson’s chosen successor?',
 ['Martin Van Buren','Nicholas Biddle','William Wirt','John C. Calhoun'],
 'Van Buren then faced the Panic of 1837 and the political consequences of the economic crisis.');
add('majority','P047',false,'What did multiple Whig presidential candidates in 1836 indicate in the chapter’s account?',
 ['A less unified national organization than the Democrats’','The abolition of party competition','Membership in Jackson’s Kitchen Cabinet','A constitutional requirement for equal electoral totals'],
 'The chapter contrasts a developing Whig organization with a disciplined Democratic Party behind Van Buren.');
add('majority','P065',false,'Whom did the Whigs nominate for president in 1840?',
 ['William Henry Harrison','John Quincy Adams','Andrew Jackson','Thomas Hart Benton'],
 'The Whigs emphasized Harrison’s military reputation and presented him as connected to ordinary people.');
add('majority','P065',false,'Who was Harrison’s running mate in “Tippecanoe and Tyler too”?',
 ['John Tyler','John Eaton','John Marshall','John C. Calhoun'],
 'The slogan paired Harrison’s military nickname with vice-presidential candidate John Tyler of Virginia.');
add('majority','P066',true,'What was the log cabin campaign?',
 ['The Whigs’ presentation of Harrison as an ordinary, humble man through log-cabin imagery','A movement requiring property ownership for voting','A Cherokee legal campaign against tariffs','An order closing newspapers that backed Van Buren'],
 'The Whigs turned a Democratic insult into useful imagery of simplicity and common origins.');
add('majority','P066',false,'Why distinguish Harrison’s campaign image from his actual background?',
 ['His humble log-cabin image concealed a privileged Virginia upbringing','His image proved he opposed every federal project','His military nickname made him the author of Democracy in America','The campaign established that he had directed the bank'],
 'Political symbols can construct a public persona different from a candidate’s actual social background.');
add('majority','P065',false,'Why emphasize Harrison’s connection to Tippecanoe?',
 ['To market him as a military hero, adapting a strategy that helped Jackson','To prove he won the 1824 popular vote','To identify him as author of the Nullification Proclamation','To show that Whigs opposed campaign rallies'],
 'Whigs adapted the appeal of military reputation rather than leaving that style of campaigning to Democrats.');
add('majority',['P063','P067'],false,'Which combination helped the Whigs win in 1840?',
 ['Mass rallies, effective candidate imagery and blame for Democratic economic policy','An end to newspapers, slogans and party mobilization','A Court order appointing Harrison without an election','A promise to make Biddle president and abolish the vice presidency'],
 'The Whigs combined organized mass campaigning with criticism of continuing economic distress.');

const counts={};
export const QUESTIONS=rows.map((row,index)=>{
 const number=counts[row.topic]=(counts[row.topic]||0)+1;
 const answer=index%4;
 const choices=answer?[...row.choices.slice(4-answer),...row.choices.slice(0,4-answer)]:[...row.choices];
 return {...row,id:'c10-'+row.topic+'-'+String(number).padStart(2,'0'),choices,answer};
});
export const KEY_TERMS=QUESTIONS.filter(q=>q.term).map(q=>q.id);
export function seededRandom(seed=1){
 let state=(Number(seed)>>>0)||1;
 return ()=>{state+=0x6D2B79F5;let t=state;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};
}
function shuffle(list,random){const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function selectQuestions({topic='all',size=15,seed=1,missed=[],termsOnly=false}={}){
 const random=seededRandom(seed),review=new Set(Array.isArray(missed)?missed:[]);
 const validTopic=TOPICS.some(t=>t.id===topic);
 const pool=QUESTIONS.filter(q=>(!validTopic||q.topic===topic)&&(!termsOnly||q.term)&&(!review.size||review.has(q.id)));
 const n=Math.min(pool.length,Math.max(1,Math.floor(Number(size)||15)));
 if(validTopic)return shuffle(pool,random).slice(0,n).map(q=>q.id);
 const order=shuffle(TOPICS.map(t=>t.id),random),groups=new Map(order.map(id=>[id,shuffle(pool.filter(q=>q.topic===id),random)])),picked=[];
 while(picked.length<n){let added=false;for(const id of order){const q=groups.get(id).pop();if(q){picked.push(q.id);added=true;if(picked.length===n)break;}}if(!added)break;}
 return shuffle(picked,random);
}
