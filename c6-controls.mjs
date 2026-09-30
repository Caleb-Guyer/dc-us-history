// Positive pitch looks up in both the camera and the musket simulation.
export function applyLook(player,dx,dy,sensitivity=1,touch=false){
 const scale=Number.isFinite(sensitivity)?Math.max(.3,Math.min(2,sensitivity)):1;
 const yaw=player.yaw-dx*(touch?.006:.0022)*scale;
 player.yaw=Math.atan2(Math.sin(yaw),Math.cos(yaw));
 player.pitch=Math.max(-.9,Math.min(.85,player.pitch-dy*(touch?.005:.0022)*scale));
}

// PointerEvent.buttons describes every button still held, not just the one
// released. Releasing fire must not cancel a held right-button aim.
export function mouseButtons(buttons){return {fire:!!(buttons&1),aim:!!(buttons&2)};}
