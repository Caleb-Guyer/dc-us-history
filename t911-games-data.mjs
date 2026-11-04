// Original dramatic scenes based on the supplied edited chapters. All dialogue
// is representative, invented speech, never a quotation from a historical person.
export const GAME_VERSION='7.1.0';
const beat=(speaker,text,shot='wide',focus='world',duration=4)=>({speaker,text,shot,focus,duration});
const gate=(at,prompt,choices,answer,why)=>({at,prompt,choices,answer,why});

export const CAMPAIGNS={
  9:{chapter:9,title:'The Price of Progress',tagline:'Keep the machines moving. Find your own voice.',duration:'3–5 minutes',
    description:'Three quick chapters in the industrial North: tend a Lowell mill, steer an Erie Canal shipment, then carry a workers’ petition. The workers, boat hands and couriers are fictional representatives of documented experiences; this is a historical montage, not one person’s journey.',
    missions:[
      {id:'c9-factory',title:'The Bell Owns the Day',year:'1824',place:'Lowell, Massachusetts',role:'A mill operative · representative worker',mode:'factory',goal:'Keep the loom stations supplied through the speedup.',target:8,duration:36,
        controls:'Move between stations. Tap Action when the loom is ready. Keep clear of moving machinery.',
        lesson:'Mechanization increased output. Specialized jobs also narrowed craft skills and gave supervisors more control over workers’ time.',sections:['9.1','9.2'],
        opening:[
          beat('LOWELL · 1824','The river turns the wheels. The bell brings hundreds of workers to the brick mills.','wide'),
          beat('MILL OPERATIVE','At home, a family could finish one task for a merchant. Here, machines and supervisors set our pace.','close','hero'),
          beat('OVERSEER','Your station is the same step, again and again. Keep it moving.','action','other',3)
        ],
        ending:[
          beat('MILL OPERATIVE','More cloth, cheaper goods. But I no longer learn the whole craft. They can replace me.','close','hero'),
          beat('THE LEDGER','Machine tools make standard parts. Industrial gains depend, too, on cotton grown by enslaved people in the South.','map','world',5)
        ],
        decisions:[
          gate(.3,'The mill adds a faster loom. What changes for your job?',['Master the entire craft','Repeat a narrower task','Choose any working hours'],1,'This is deskilling: machinery and specialization reduce the broad craft knowledge a job requires.'),
          gate(.7,'The company owns the boarding house too. Why does losing this job matter?',['Employment and housing are both at risk','Workers automatically own the mill','Boarding makes factory discipline disappear'],0,'Company control reached beyond the workplace. Dismissal could also mean losing company housing.')
        ]
      },
      {id:'c9-canal',title:'The Inland Highway',year:'1825',place:'Erie Canal, New York',role:'A canal boat hand · representative worker',mode:'canal',goal:'Keep the cargo clear of obstacles and reach the lock.',target:6,duration:36,
        controls:'Steer in all four directions. Tap Action for a protective burst when the route is clear.',
        lesson:'The Erie Canal connected the Great Lakes with the Hudson River and Atlantic markets. Lower freight costs linked western farms and eastern factories.',sections:['9.2','9.3'],
        opening:[
          beat('NEW YORK · 1825','A new artificial waterway connects the Great Lakes to the Hudson River.','map'),
          beat('BOAT HAND','Western grain goes east. Manufactured goods go west. Our boat is one link in a growing market.','close','hero'),
          beat('LOCK KEEPER','Watch the banks. Carry the shipment through.','action','other',3)
        ],
        ending:[
          beat('BOAT HAND','Less time. Lower freight costs. Inland producers can reach distant buyers.','close','hero'),
          beat('THE NETWORK','Federal roads, toll turnpikes, steamboats and early railroads extend that network. Faster trade does not prevent booms and panics.','map','world',5)
        ],
        decisions:[
          gate(.3,'The destination reads “Atlantic market.” Which connection carries this cargo?',['Erie Canal → Hudson River','Erie Canal → Rio Grande','Erie Canal → Pacific Ocean'],0,'Opened in 1825, the canal connected the Great Lakes to the Hudson River and, through it, Atlantic commerce.'),
          gate(.7,'Freight becomes cheaper. Which new shipment makes economic sense?',['Only local goods sold within walking distance','Western grain east; factory goods west','No goods: canals carry only passengers'],1,'Cheaper transport enlarged markets and encouraged regions to specialize in what they produced.')
        ]
      },
      {id:'c9-courier',title:'The Workers’ Voice',year:'1834',place:'Lowell, Massachusetts',role:'A petition courier · representative worker',mode:'courier',goal:'Carry petition copies through the streets to the workers’ meeting.',target:6,duration:36,
        controls:'Move through the streets. Dash with Action to clear hazards and deliver petition copies.',
        lesson:'Workers organized over wage cuts and long hours. Industrial growth created unequal rewards, distinct class cultures and political demands.',sections:['9.1','9.4'],
        opening:[
          beat('LOWELL · 1834','The mills demand more work for less pay. Operatives organize a turnout.','wide'),
          beat('PETITION COURIER','We make the cloth. Labor critics say our wages should reflect the value our work adds.','close','hero'),
          beat('FELLOW WORKER','Carry the copies. A meeting needs people who know why they are standing together.','action','other',3)
        ],
        ending:[
          beat('PETITION COURIER','The strike does not guarantee victory. But workers have learned to act together.','close','hero'),
          beat('A CHANGING NORTH','Elites protect wealth through networks. Middle-class families prize schooling and self-improvement; many working families need several wages just to survive.','wide','world',5)
        ],
        decisions:[
          gate(.3,'Choose the demand to carry into this workers’ meeting.',['Give all profits to inherited wealth','Wages reflecting the value labor adds','Ban every worker association'],1,'The labor theory of value challenged workers’ small share of the wealth they produced. Worker organizing also took political forms, including the Working Men’s Party.'),
          gate(.7,'Which report belongs on a working family’s petition?',['Every household can live on one comfortable wage','Schooling is equally affordable for everyone','Low wages can force children and women into paid work'],2,'Industrial growth brought cheaper goods, but working families often needed children’s wages or women’s home piecework. Benefits were distributed unequally.')
        ]
      }
    ],
    debrief:['t911-c9-03','t911-c9-09','t911-c9-33','t911-c9-43','t911-c9-55','t911-c9-18'],
    sourceNotes:[
      'Edited Chapter 9 · 9.1 · P003–P030: artisans, putting-out production, Slater/Lowell, deskilling, company control, factory dangers, worker organizing and enslaved cotton production. The 1834 turnout supplies the documented setting; the courier and delivery task are fictional.',
      'Edited Chapter 9 · 9.2 · P031–P046: expanding markets, machine tools, agricultural and transport innovations. Review specie, banknote risk and the remaining details in chapter practice; this short campaign does not claim to teach every question in the topic bank.',
      'Edited Chapter 9 · 9.3 · P047–P057: Erie opening in 1825, Great Lakes–Hudson connection, internal improvements and two-way trade. The course is an arcade compression, not a literal lock or route reconstruction. Fulton is not called inventor of the steam engine; Mohawk and Hudson is not called America’s first steam railroad.',
      'Edited Chapter 9 · 9.4 · P058–P071: elite networks, middle-class schooling and improvement ideals, working-family incomes and unequal rewards. Recall the remaining class, religion and immigration topics through the linked chapter practice.',
      'Historical setting check: National Park Service, Lowell mill workers and labor reform: https://www.nps.gov/articles/000/early-strikes-in-lowell.htm. All scene speech is invented representative dialogue, not archival quotation.'
    ]
  },
  11:{chapter:11,title:'Across the Divide',tagline:'Cross a continent. Carry the consequences.',duration:'3–5 minutes',
    description:'A fast historical montage: navigate with the Corps of Discovery, run a San Jacinto dispatch, then deliver the news of 1850. Each mission uses a different representative participant. These are fictional tasks in documented settings, with no invented dialogue presented as a historical quotation.',
    missions:[
      {id:'c11-river',title:'No River Through',year:'1805',place:'The Missouri River and the western crossing',role:'A Corps of Discovery boat hand · representative participant',mode:'river',goal:'Protect the expedition’s supplies through the rapids.',target:6,duration:36,
        controls:'Steer clear of rocks. Use Action for a short paddle burst on open water.',
        lesson:'Lewis and Clark sought trade, geographic knowledge and a route to the Pacific. Indigenous knowledge and diplomacy were crucial; no continuous inland waterway crossed the continent.',sections:['11.1'],
        opening:[
          beat('CORPS OF DISCOVERY · 1805','Lewis and Clark seek a Pacific route, trade connections and scientific knowledge for Jefferson.','map'),
          beat('EXPEDITION HAND','Sacagawea helps with interpretation and diplomacy. These lands already belong to people with knowledge we need.','close','hero'),
          beat('THE CROSSING','Beyond the river lie mountains. Keep the journals and supplies safe.','action','world',3)
        ],
        ending:[
          beat('EXPEDITION HAND','The mountains break the imagined river connection. The expedition reaches the Pacific over land and water, then returns in 1806.','map','hero',5),
          beat('THE MISSOURI CRISIS · 1820','Expansion also means political conflict. Maine enters free; Missouri enters slave. A territorial line preserves a temporary balance, not a final peace.','map','world',5)
        ],
        decisions:[
          gate(.3,'The expedition must record more than a travel route. Save which journal?',['Only guesses about future gold prices','Plants, animals, geography and resources','A plan to annex California in 1805'],1,'Jefferson’s instructions included scientific observations as well as trade, mapping and territorial ambitions.'),
          gate(.7,'The river ends at a mountain barrier. What do you report?',['A continuous inland river passage does not exist','The Pacific can never be reached by any route','The expedition discovered an empty continent'],0,'No continuous inland river route to the Pacific existed. Overland crossings and Indigenous assistance remained essential; Native nations were already there.')
        ]
      },
      {id:'c11-dispatch',title:'Dispatch at San Jacinto',year:'21 April 1836',place:'San Jacinto, Texas',role:'A Texian dispatch runner · representative participant',mode:'dispatch',goal:'Carry the dispatch through shell bursts and reach the rally point.',target:6,duration:36,
        controls:'Move between cover. Dash with Action when the path is clear. Deliver messages; there are no kill points.',
        lesson:'The Alamo and San Jacinto were different battles. Texas independence grew from conflicts over Mexican authority, immigration and slavery, and did not immediately make Texas a U.S. state.',sections:['11.3'],
        opening:[
          beat('THE ALAMO · 6 MARCH 1836','After a thirteen-day siege, Mexican forces take the Alamo. Texas has declared independence.','wide','world',5),
          beat('SAN JACINTO · 21 APRIL','Sam Houston’s force prepares its attack on Santa Anna’s army. Carry the dispatch to the rally point.','action','other'),
          beat('DISPATCH RUNNER','Some Tejanos join this revolt too. Mexico’s centralization, settlement restrictions and slavery are all part of the conflict.','close','hero',5)
        ],
        ending:[
          beat('THE BATTLE','Houston’s forces win at San Jacinto and capture Santa Anna. Mexico does not accept that Texas’s status is settled.','action','world',5),
          beat('THE YEARS AFTER','Texas becomes an independent republic. U.S. annexation waits until 1845; slavery and possible war with Mexico make it controversial.','map','world',5)
        ],
        decisions:[
          gate(.3,'The dispatch must distinguish these battles. Which line is accurate?',['Houston won at the Alamo; San Jacinto came first','The Alamo fell; Houston later won at San Jacinto','Both battles occurred after U.S. annexation'],1,'The Alamo fell on March 6, 1836. Houston won at San Jacinto on April 21, where Santa Anna was captured.'),
          gate(.7,'A scout asks why annexation is controversial. Send the honest report.',['Texas was already a U.S. state in 1836','All Tejanos wanted exactly the same outcome','Slavery and possible war with Mexico divide U.S. politicians'],2,'Annexing a large slaveholding republic threatened the sectional balance and risked conflict with Mexico. Tejanos held varied views and later faced dispossession.')
        ]
      },
      {id:'c11-press',title:'The Union’s Breaking News',year:'1850',place:'Washington, D.C.',role:'A newspaper courier · representative worker',mode:'press',goal:'Deliver the printed reports through the crowded capital.',target:6,duration:36,
        controls:'Move through the streets. Dash with Action to avoid hazards and deliver the news.',
        lesson:'War and the Mexican Cession reopened the slavery debate. The Compromise of 1850 combined a free California with a stronger fugitive-slave law; it postponed rather than resolved sectional conflict.',sections:['11.2','11.4','11.5'],
        opening:[
          beat('WAR’S AFTERMATH · 1848','The Treaty of Guadalupe Hidalgo ends the war. Mexico cedes California and much of the Southwest; Texas was annexed earlier.','map','world',5),
          beat('THE GOLD RUSH · 1849','Forty-niners rush to California. Native communities face dispossession and violence; Chinese migrants meet discrimination.','wide','world',5),
          beat('WASHINGTON · 1850','New western land renews an old question: will slavery expand? Get the actual terms of the compromise into print.','action','hero')
        ],
        ending:[
          beat('THE PRINTED TERMS','California enters free. New Mexico and Utah use popular sovereignty. The D.C. slave trade ends, but slavery there remains.','close','hero',5),
          beat('THE COST OF COMPROMISE','A harsher fugitive-slave law endangers people seeking freedom and demands wider enforcement. The crisis pauses. The conflict remains.','wide','world',5)
        ],
        decisions:[
          gate(.3,'The editor needs an accurate 1848 headline. Choose it.',['Mexican Cession transfers California and much of the Southwest','Gold Rush gives the U.S. all of Mexico','Treaty first annexes Texas in 1850'],0,'The Mexican Cession followed the 1846–1848 war. The treaty promised property and citizenship-related protections to Mexican residents, though many later lost land.'),
          gate(.7,'Print the key distinction in antislavery politics.',['Free Soil meant every member supported racial equality','Wilmot’s ban on slavery in the cession became law','Wilmot proposed a territorial slavery ban; Free Soil opposed expansion'],2,'The Wilmot Proviso failed to become law. Free-Soilers opposed extending slavery; they did not all support immediate abolition everywhere or racial equality.')
        ]
      }
    ],
    debrief:['t911-c11-06','t911-c11-18','t911-c11-31','t911-c11-44','t911-c11-50','t911-c11-58'],
    sourceNotes:[
      'Edited Chapter 11 · 11.1 · P003–P011: government-sponsored Corps, trade/science/territorial aims, Sacagawea’s diplomacy, Indigenous sovereignty and absence of a continuous inland river route. This mission compresses river navigation; it does not depict a single uninterrupted water trip across the Rockies.',
      'Edited Chapter 11 · 11.2 · P013–P016: Missouri debate, Senate balance, Maine/Missouri arrangement and 36°30′ territorial restriction, except Missouri. The 1820 agreement did not admit the states on the same day; Tallmadge proposed gradual emancipation, not instant freedom for all enslaved people.',
      'Edited Chapter 11 · 11.3 · P019–P033: settlement, Tejanos, Mexican policy, slavery, the Texas revolt, Alamo, San Jacinto and annexation controversy. Dispatch gameplay is fictional; the setting and battle outcomes are historical. No claim is made that one courier caused Houston’s victory.',
      'Edited Chapter 11 · 11.4 · P035–P055: war, disputed border, treaty, cession, Californios, Gold Rush and harm to Native people and Chinese migrants. The press mission does not award points for seizure of land or people.',
      'Edited Chapter 11 · 11.5 · P057–P068: Wilmot Proviso, Free Soil, popular sovereignty, the 1850 settlement and stronger fugitive-slave enforcement. The D.C. slave trade ended; slavery itself was not abolished there in 1850.',
      'Historical correction check: Library of Congress, Alamo fell after thirteen-day siege: https://www.loc.gov/item/today-in-history/march-06/. National Archives, Treaty of Guadalupe Hidalgo: https://www.archives.gov/milestone-documents/treaty-of-guadalupe-hidalgo. All scene speech is invented representative dialogue, not archival quotation.'
    ]
  }
};



