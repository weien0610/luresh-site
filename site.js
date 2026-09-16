function toggleMenu(btn){const m=document.getElementById('mobileMenu');const o=m.classList.toggle('open');btn.setAttribute('aria-expanded',o)}
function openLb(src,alt){const lb=document.getElementById('lb'),im=document.getElementById('lbImg');if(!lb)return;im.src=src;im.alt=alt;lb.classList.add('open');document.body.style.overflow='hidden'}
function closeLb(e){if(e&&e.target&&e.target.id==='lbImg')return;const lb=document.getElementById('lb');if(!lb)return;lb.classList.remove('open');document.body.style.overflow=''}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLb()});
const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}}),{threshold:.12});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));
