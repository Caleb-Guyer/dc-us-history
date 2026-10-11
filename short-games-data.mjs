export const LINES={
 'union-open':{speaker:'Roger Sherman · dramatized',text:'We won a war together. Now the states cannot agree how to govern together. Give the large states a voice. Give the small states a reason to stay.',voice:'am_michael'},
 'union-house':{speaker:'Convention floor · dramatized',text:'Virginia wants population to count. Delaware will not accept being swallowed by its neighbors.',voice:'bm_george'},
 'union-senate':{speaker:'Roger Sherman · dramatized',text:'Then use two houses. Population in one. Equal states in the other. Neither side can govern alone.',voice:'am_michael'},
 'union-tax':{speaker:'Convention clerk · dramatized',text:'Congress asked the states for money. The treasury stayed empty. A government needs revenue to act.',voice:'af_sarah'},
 'union-checks':{speaker:'Convention clerk · dramatized',text:'Give the government power, then divide it. A veto, a confirmation, an independent court. Power must meet resistance.',voice:'af_sarah'},
 'union-slavery':{speaker:'Historical record',text:'The compromise over slavery counted three fifths of enslaved people for representation and direct taxes. It gave slaveholding states power. It gave the enslaved no vote.',voice:'af_sarah'},
 'union-sign':{speaker:'Historical record',text:'September seventeenth, seventeen eighty-seven. The document is signed. Signing is not ratification. The argument now belongs to the state conventions.',voice:'am_michael'},
 'union-rights':{speaker:'Historical record',text:'Many opponents fear that central power will swallow their liberties. Promised amendments help win support. Ten amendments become the Bill of Rights in seventeen ninety-one.',voice:'af_sarah'},
 'union-end':{speaker:'Historical record',text:'A stronger union. A divided system of power. Rights promised, then written. And a republic whose freedom is still far from equal.',voice:'am_michael'},
 'fort-open':{speaker:'Garrison sergeant · dramatized',text:'Washington burned three weeks ago. Baltimore is next. Major Armistead has us holding the harbor. Keep the powder dry. Keep the crews alive.',voice:'am_michael'},
 'fort-supply':{speaker:'Garrison sergeant · dramatized',text:'Those bomb ships are outside our range. We cannot answer every shot. Run the supplies between bursts. Watch where the shells are falling.',voice:'am_michael'},
 'fort-hit':{speaker:'Garrison trooper · dramatized',text:'Down! Wait for the burst, then move!',voice:'am_michael'},
 'fort-crate':{speaker:'Garrison trooper · dramatized',text:'Powder delivered. Crew ready.',voice:'am_michael'},
 'fort-night':{speaker:'Garrison sergeant · dramatized',text:'Boats in the western branch! Babcock and Covington are opening fire. Get to the battery. Those barges are close enough to reach.',voice:'am_michael'},
 'fort-barrel':{speaker:'Garrison trooper · dramatized',text:'Wait for the barrel to settle. Aim at the marked barge. Fire!',voice:'am_michael'},
 'fort-retreat':{speaker:'Garrison sergeant · dramatized',text:'The barges are turning back. Stay under cover. The bomb ships are still firing.',voice:'am_michael'},
 'fort-dawn':{speaker:'Garrison trooper · dramatized',text:'Listen. No guns. Bring up the big garrison flag.',voice:'am_michael'},
 'fort-end':{speaker:'Historical record',text:'September fourteenth, eighteen fourteen. Fort McHenry still stands. Offshore, Francis Scott Key sees the flag above the harbor. Baltimore has held.',voice:'af_sarah'}
};
export const POLICIES=[
 {id:'house',title:'A House by population',tag:'Virginia’s demand',cost:1,effect:{large:30,small:-8},line:'union-house',detail:'Large states gain a voice. Small states need another safeguard.'},
 {id:'senate',title:'An equal-state Senate',tag:'Small-state safeguard',cost:1,effect:{small:32,large:-6},line:'union-senate',detail:'Two senators per state. Balance it with a population-based House.'},
 {id:'tax',title:'Give Congress tax power',tag:'Pay for common needs',cost:1,effect:{order:24,liberty:-6},line:'union-tax',detail:'Independent revenue replaces dependence on state contributions.'},
 {id:'trade',title:'Regulate interstate commerce',tag:'An economic union',cost:1,effect:{order:18,small:-4},detail:'National trade rules reduce conflict among state policies.'},
 {id:'executive',title:'A national executive',tag:'Enforce the laws',cost:1,effect:{order:15,liberty:-10},detail:'Executive authority helps the government act. It needs checks.'},
 {id:'checks',title:'Make power check power',tag:'Liberty needs a structure',cost:1,effect:{liberty:20,large:5,small:5},line:'union-checks',detail:'Vetoes, confirmations and divided functions restrain concentrated power.'},
 {id:'courts',title:'Independent national courts',tag:'A judicial branch',cost:1,effect:{liberty:8,order:10},detail:'A general national judiciary replaces the Articles’ limited arrangements.'},
 {id:'lobby-large',title:'Confer with large-state delegates',tag:'Repair the coalition',cost:1,effect:{large:15},repeat:true,detail:'Spend a debate round securing large-state support.'},
 {id:'lobby-small',title:'Confer with small-state delegates',tag:'Repair the coalition',cost:1,effect:{small:15},repeat:true,detail:'Spend a debate round securing small-state support.'},
 {id:'liberty',title:'Address fears of central power',tag:'Repair the coalition',cost:1,effect:{liberty:12,order:-3},repeat:true,detail:'Answer opponents’ fears with limits and accountability.'}
];
export const RATIFY=[
 {id:'papers',title:'Make the public case',detail:'Hamilton, Madison and Jay defend ratification as Publius. Explain why the Articles are not enough.',line:'union-sign'},
 {id:'amend',title:'Promise explicit rights',detail:'Anti-Federalist concerns bring the demand for a bill of rights into the ratification debate.',line:'union-rights'},
 {id:'conventions',title:'Let state conventions decide',detail:'Nine conventions are required. New Hampshire becomes the ninth in June 1788.'}
];
