import * as T from './three.module.js';

export function linearDepth(depth,near,far){return near*far/(far-depth*(far-near));}
export function focusBlur(distance,focus){return Math.min(.006,Math.max(0,Math.abs(distance-focus)-.85)*.00115);}

// A depth-aware lens pass for the authored film shots. The scene remains linear
// until the final ACES/output transform, preserving skin and material lighting.
export class CinematicFX{
 constructor(renderer){
  this.renderer=renderer;this.width=1;this.height=1;this.disposed=false;
  this.target=new T.WebGLRenderTarget(1,1,{type:T.HalfFloatType,minFilter:T.LinearFilter,magFilter:T.LinearFilter,depthBuffer:true,stencilBuffer:false});
  this.target.texture.colorSpace=T.LinearSRGBColorSpace;
  this.target.depthTexture=new T.DepthTexture(1,1,T.UnsignedIntType);
  this.target.depthTexture.format=T.DepthFormat;
  this.scene=new T.Scene();this.camera=new T.OrthographicCamera(-1,1,1,-1,0,1);
  this.material=new T.ShaderMaterial({
   uniforms:{image:{value:this.target.texture},depthImage:{value:this.target.depthTexture},texel:{value:new T.Vector2(1,1)},nearPlane:{value:.1},farPlane:{value:170},focus:{value:4}},
   vertexShader:'varying vec2 uvOut; void main(){ uvOut=uv; gl_Position=vec4(position.xy,0.0,1.0); }',
   fragmentShader:`
    uniform sampler2D image;
    uniform sampler2D depthImage;
    uniform vec2 texel;
    uniform float nearPlane,farPlane,focus;
    varying vec2 uvOut;
    float meters(float depth){return nearPlane*farPlane/(farPlane-depth*(farPlane-nearPlane));}
    void main(){
     float distance=meters(texture2D(depthImage,uvOut).r);
     float radius=clamp((abs(distance-focus)-0.85)*0.00115,0.0,0.006);
     vec3 color=texture2D(image,uvOut).rgb*0.44;
     float weight=0.44;
     for(int i=0;i<8;i++){
      float angle=float(i)*2.39996323;
      vec2 delta=vec2(cos(angle),sin(angle))*radius*vec2(1.0,texel.y/texel.x);
      vec2 sampleUV=clamp(uvOut+delta,vec2(0.001),vec2(0.999));
      float sampleDistance=meters(texture2D(depthImage,sampleUV).r);
      float w=sampleDistance<distance-0.3?0.009:0.07;
      color+=texture2D(image,sampleUV).rgb*w;weight+=w;
     }
     color/=weight;
     float luma=dot(color,vec3(0.2126,0.7152,0.0722));
     color=mix(vec3(luma),color,1.015);
     color*=mix(vec3(0.985,1.0,1.025),vec3(1.018,1.006,0.99),smoothstep(0.1,1.0,luma));
     float vignette=1.0-smoothstep(0.22,0.84,length((uvOut-0.5)*vec2(1.0,0.74)));
     color*=0.94+0.06*vignette;
     gl_FragColor=vec4(max(color,vec3(0.0)),1.0);
     #include <tonemapping_fragment>
     #include <colorspace_fragment>
    }`,
   depthTest:false,depthWrite:false,toneMapped:true
  });
  this.quad=new T.Mesh(new T.PlaneGeometry(2,2),this.material);this.quad.frustumCulled=false;this.scene.add(this.quad);
 }
 resize(width,height){if(this.disposed)return;this.width=Math.max(1,Math.round(width));this.height=Math.max(1,Math.round(height));this.target.setSize(this.width,this.height);this.material.uniforms.texel.value.set(1/this.width,1/this.height);}
 render(scene,camera,{cinema=false,focusDistance=4,quality='detailed'}={}){
  if(this.disposed)return;
  const renderer=this.renderer,previous=renderer.getRenderTarget();
  if(!cinema||quality==='balanced'||this.width/this.height<.8){renderer.render(scene,camera);return;}
  const u=this.material.uniforms;u.nearPlane.value=camera.near;u.farPlane.value=camera.far;u.focus.value=Math.max(camera.near,Math.min(camera.far,focusDistance));
  const reset=renderer.info.autoReset;renderer.info.autoReset=false;renderer.info.reset();
  try{renderer.setRenderTarget(this.target);renderer.render(scene,camera);renderer.setRenderTarget(previous);renderer.render(this.scene,this.camera);}finally{renderer.setRenderTarget(previous);renderer.info.autoReset=reset;}
 }
 dispose(){if(this.disposed)return;this.disposed=true;this.target.dispose();this.target.depthTexture?.dispose();this.quad.geometry.dispose();this.material.dispose();}
}
