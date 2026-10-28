// Section links preserve only the explicit quiet-preview switches.
const source=new URLSearchParams(location.search),query=new URLSearchParams();
for(const key of ['muted','preview'])if(source.get(key)==='1')query.set(key,'1');
const suffix=query.size?'?'+query.toString():'';
for(const link of document.querySelectorAll('[data-section-link]'))link.href=link.getAttribute('href')+suffix;
if(source.get('preview')==='1')document.querySelector('#preview-note').hidden=false;
document.body.dataset.version='6.2.0';
