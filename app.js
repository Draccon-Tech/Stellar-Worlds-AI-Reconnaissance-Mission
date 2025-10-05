// ===== Stars canvas =====
(function initStars(){
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');
  const DPR = Math.min(2, window.devicePixelRatio || 1);
  let W, H;
  let stars = [];

  function resize(){
    W = canvas.width  = Math.floor(innerWidth * DPR);
    H = canvas.height = Math.floor(innerHeight * DPR);
    stars = Array.from({length: 420}, () => ({
      x: Math.random()*W,
      y: Math.random()*H,
      a: Math.random()*0.7 + 0.2,
      s: Math.random()*1.8 + 0.4,
      p: Math.random()*Math.PI*2
    }));
  }
  function draw(t){
    ctx.clearRect(0,0,W,H);
    for(const st of stars){
      const tw = 0.65 + 0.35 * Math.sin(t/900 + st.p);
      ctx.globalAlpha = st.a * tw;
      ctx.fillStyle = '#fff';
      ctx.fillRect(st.x, st.y, st.s, st.s);
    }
    requestAnimationFrame(draw);
  }
  addEventListener('resize', resize, {passive:true});
  resize(); requestAnimationFrame(draw);
})();

// ===== Tooltip e cliques dos planetas =====
const tooltip = document.getElementById('tooltip');
let tooltipVisible = false;

function showTooltip(x, y, name, info){
  tooltip.innerHTML = `<strong>${name}</strong><br>${info}`;
  tooltip.style.left = `${x + 14}px`;
  tooltip.style.top = `${y + 14}px`;
  tooltip.style.opacity = '1';
  tooltip.style.transform = 'translateY(0)';
  tooltipVisible = true;
}
function hideTooltip(){
  tooltip.style.opacity = '0';
  tooltip.style.transform = 'translateY(6px)';
  tooltipVisible = false;
}

document.querySelectorAll('.planet').forEach(p => {
  // Hover → tooltip
  p.addEventListener('pointerenter', (e)=>{
    const r = p.getBoundingClientRect();
    showTooltip(r.left + r.width/2, r.top, p.dataset.name, p.dataset.info);
  });
  p.addEventListener('pointermove', (e)=>{
    if(!tooltipVisible) return;
    showTooltip(e.clientX, e.clientY, p.dataset.name, p.dataset.info);
  });
  p.addEventListener('pointerleave', hideTooltip);

  // Clique → ação (exemplo: abrir modal com dados do planeta)
  p.addEventListener('click', ()=>{
    const modal = document.getElementById('joinModal');
    const title = modal.querySelector('h2');
    title.textContent = `Join — ${p.dataset.name}`;
    modal.showModal();
  });
});

// ===== CTA JOIN =====
document.getElementById('ctaJoin').addEventListener('click', ()=>{
  document.getElementById('joinModal').showModal();
});

// ===== Qualquer clique fora do card fecha o dialog (UX)
document.getElementById('joinModal').addEventListener('click', (e)=>{
  const dialog = e.currentTarget;
  const rect = dialog.querySelector('.modal__card').getBoundingClientRect();
  const inside = e.clientX >= rect.left && e.clientX <= rect.right &&
                 e.clientY >= rect.top  && e.clientY <= rect.bottom;
  if(!inside) dialog.close();
});
// === Latency demo (Conventional vs SWARM) ===
(function(){
  const slider = document.getElementById('dist');
  const label  = document.getElementById('distLabel');
  const outC   = document.getElementById('latConv');
  const outS   = document.getElementById('latSwarm');
  if(!slider || !label || !outC || !outS) return;

  const C = 299792; // km/s
  // fator ilustrativo SWARM: decisões on-edge (-60%), compressão/route (-20%), previsão (-15%)
  const FACTOR = 0.35;

  function calc(){
    const Mkm = Number(slider.value);              // milhões de km
    label.textContent = Mkm;
    const distKm = Mkm * 1_000_000;
    const rttConvMs = (distKm / C) * 2 * 1000;     // ida e volta em ms (luz no vácuo)
    const rttSwarmMs = rttConvMs * FACTOR;         // melhora efetiva (ilustrativa)

    outC.textContent = Math.max(1, Math.round(rttConvMs)).toLocaleString();
    outS.textContent = Math.max(1, Math.round(rttSwarmMs)).toLocaleString();
  }

  slider.addEventListener('input', calc);
  calc();
})();

/* TEAM INTERACTIVITY — optional hover or animation */
document.addEventListener('DOMContentLoaded', () => {
  const members = document.querySelectorAll('.member-card');

  members.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.classList.add('active');
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('active');
    });
  });
});
