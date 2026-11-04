// Logical screen controls map into the simulation's forward/lateral axes.
export function mapControls(input={},mode='courier'){
 return {left:!!input.down,right:!!input.up,up:!!input.left,down:!!input.right,
  action:!!input.action,dash:!!input.secondary&&['courier','press'].includes(mode),duck:!!input.secondary&&mode==='dispatch'};
}
export function actionLabel(mode){return mode==='factory'?'Work':['canal','river'].includes(mode)?'Boost':['courier','press'].includes(mode)?'Vault':'Dash';}
export function secondaryLabel(mode){return mode==='dispatch'?'Cover':['courier','press'].includes(mode)?'Sprint':null;}
export function controlHint(mode){return mode==='factory'?'Move left or right between loom stations. Hold Work as a spool reaches the marked work area.':
 ['canal','river'].includes(mode)?'Steer between paths. Tap Boost through clear water; release and recharge before using it again.':
 mode==='dispatch'?'Read the red volley markers. Dash between cover, or hold Cover while the volley passes.':
 'Steer toward gold deliveries. Vault carts with Action, or use Sprint to slip through a clear gap.';}
