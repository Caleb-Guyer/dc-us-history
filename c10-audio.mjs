import {ShortAudio} from './short-audio.mjs';
import {VOICES} from './c10-voices.mjs?v=6.1.0';
export class ChapterAudio extends ShortAudio{
 line(id){const v=VOICES[id];if(!v)return null;this.stopVoice();this.speech.src=v.file;this.speech.volume=.85;this.music.volume=.065;if(!this.muted)this.speech.play().catch(()=>{});return v;}
 score(scene){super.score(['harbor','bank'].includes(scene)?'fort':'union');}
}
