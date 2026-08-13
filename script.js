window.addEventListener('load',()=>document.getElementById('preloader').classList.add('done'));

const menu=document.getElementById('sidemenu');
function openmenu(){menu.style.right='0'}
function closemenu(){menu.style.right='-100%'}
document.querySelectorAll('#sidemenu a').forEach(a=>a.addEventListener('click',closemenu));

function opentab(tabname,button){
  document.querySelectorAll('.tab-links').forEach(t=>t.classList.remove('active-link'));
  document.querySelectorAll('.tab-contents').forEach(t=>t.classList.remove('active-tab'));
  button.classList.add('active-link');
  document.getElementById(tabname).classList.add('active-tab');
}

const cursor=document.querySelector('.cursor-glow');
window.addEventListener('pointermove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px'});

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

// Lightweight Three.js particle/orbit scene for the hero.
const canvas=document.getElementById('scene');
if(window.THREE && canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(45,innerWidth/innerHeight,.1,100);
  camera.position.z=7;
  const group=new THREE.Group(); scene.add(group);
  const points=[];
  for(let i=0;i<900;i++){
    const r=3.1+Math.random()*1.8, a=Math.random()*Math.PI*2, y=(Math.random()-.5)*4.5;
    points.push(Math.cos(a)*r,y,Math.sin(a)*r);
  }
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(points,3));
  const mat=new THREE.PointsMaterial({color:0x9380ff,size:.018,transparent:true,opacity:.7});
  group.add(new THREE.Points(geo,mat));
  const ring=new THREE.Mesh(new THREE.TorusGeometry(1.75,.008,8,160),new THREE.MeshBasicMaterial({color:0x8f7aff,transparent:true,opacity:.35}));
  ring.rotation.x=1.05;group.add(ring);
  const ring2=ring.clone();ring2.rotation.x=.5;ring2.rotation.y=.8;ring2.scale.setScalar(1.3);group.add(ring2);
  function resize(){renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}
  addEventListener('resize',resize);resize();
  let mx=0,my=0;addEventListener('pointermove',e=>{mx=(e.clientX/innerWidth-.5)*.35;my=(e.clientY/innerHeight-.5)*.2});
  function animate(){requestAnimationFrame(animate);group.rotation.y+=.0018;group.rotation.x+=(my-group.rotation.x)*.01;group.position.x+=(mx-group.position.x)*.02;ring.rotation.z+=.004;ring2.rotation.z-=.003;renderer.render(scene,camera)}
  animate();
}

const scriptURL='https://script.google.com/macros/s/AKfycbyDanjzL5W9wfoXg-QixhMNWHqXovLbfQzAOQLD8syzXeF2jAlDDA4Cyr7dNTDSbAJEag/exec';
const form=document.forms['submit-to-google-sheet'];const msg=document.getElementById('msg');
if(form){form.addEventListener('submit',e=>{e.preventDefault();msg.textContent='Sending…';fetch(scriptURL,{method:'POST',body:new FormData(form)}).then(()=>{msg.textContent='Message sent successfully.';form.reset();setTimeout(()=>msg.textContent='',5000)}).catch(()=>msg.textContent='Could not send. Please email me directly.')})}
