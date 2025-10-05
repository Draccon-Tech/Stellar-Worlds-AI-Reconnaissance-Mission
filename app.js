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
// === NOVA Route Optimizer (minimap) ===
(function(){
  const canvas = document.getElementById('routeMap');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const DPR = Math.min(2, window.devicePixelRatio || 1);
  // Ajuste para DPI
  function resizeCanvas(){
    const cssW = canvas.clientWidth || 900;
    const cssH = (cssW / 900) * 520;
    canvas.width  = Math.floor(cssW * DPR);
    canvas.height = Math.floor(cssH * DPR);
    canvas.style.height = cssH + 'px';
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, {passive:true});

  // UI
  const selO = document.getElementById('routeOrigin');
  const selD = document.getElementById('routeDest');
  const showConv = document.getElementById('showConventional');
  const showNova = document.getElementById('showNOVA');
  const btnShuffle = document.getElementById('routeShuffle');
  const btnPlay = document.getElementById('routePlay');
  const btnStop = document.getElementById('routeStop');
  const outRTTConv = document.getElementById('rttConventional');
  const outRTTNova = document.getElementById('rttNOVA');
  const outHops = document.getElementById('hopsNOVA');

  // Modelo físico ilustrativo
  const C = 299792;               // km/s
  const KM_PER_UNIT = 15000;      // escala do mapa: 1 unidade canvas ≈ 15.000 km (ajuste livre)
  const NOVA_FACTOR = 0.35;       // redução efetiva de RTT (edge + compressão + predição)

  // Geração de nós (relays/planets)
  let nodes = [];
  function genNodes(n=18){
    // cria uma nuvem elíptica com “corredores”
    nodes = [];
    const W = canvas.width, H = canvas.height;
    for(let i=0;i<n;i++){
      const r = (Math.random() ** 0.65) * 0.44; // mais denso no centro
      const a = Math.random() * Math.PI*2;
      const x = W/2 + Math.cos(a) * r * W*0.9 * (0.6 + 0.4*Math.random());
      const y = H/2 + Math.sin(a) * r * H*0.9 * (0.6 + 0.4*Math.random());
      nodes.push({ id:i, x, y, name:`Relay-${i.toString().padStart(2,'0')}` });
    }
  }
  genNodes();

  // cria opções
  function fillSelects(){
    selO.innerHTML = ''; selD.innerHTML = '';
    nodes.forEach(n=>{
      const o = document.createElement('option');
      o.value = n.id; o.textContent = n.name;
      selO.appendChild(o.cloneNode(true));
      selD.appendChild(o);
    });
    // defaults diferentes
    if(nodes.length>6){ selO.value = nodes[2].id; selD.value = nodes[nodes.length-4].id; }
  }
  fillSelects();

  // utilidades
  const dist = (a,b)=> Math.hypot(a.x-b.x, a.y-b.y);
  const rtt_ms = (canvasDist, factor=1)=>{
    const km = canvasDist * (KM_PER_UNIT / DPR);
    const rtt = (km / C) * 2 * 1000 * factor; // ida e volta
    return Math.max(1, Math.round(rtt));
  };

  // rota convencional (linha direta)
  function routeConventional(src, dst){
    return { path:[src, dst], length: dist(src,dst) };
  }

  // rota NOVA (multi-hop greedy)
  function routeNova(src, dst){
    const visited = new Set([src.id]);
    let cur = src;
    const path = [src];
    let safety = 0;

    while(cur.id !== dst.id && safety < nodes.length+10){
      safety++;
      // vizinhos ordenados por “custo efetivo” (distância + heurística rumo ao destino)
      const candidates = nodes
        .filter(n => !visited.has(n.id) && n.id !== cur.id)
        .map(n => ({ n, d: dist(cur,n) + dist(n,dst)*0.4 } ))
        .sort((a,b)=> a.d - b.d);

      const next = (candidates[0]||{}).n || dst;
      path.push(next);
      visited.add(next.id);
      cur = next;

      // se encostou no destino, finaliza
      if(dist(cur,dst) < 40 * DPR){
        if(cur.id !== dst.id) path.push(dst);
        break;
      }
      // limite de saltos
      if(path.length > 8) { if(cur.id !== dst.id) path.push(dst); break; }
    }

    // comprimento total
    let L=0;
    for(let i=0;i<path.length-1;i++) L += dist(path[i], path[i+1]);
    return { path, length:L };
  }

  // desenho
  function drawMap(routes){
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0,0,W,H);

    // grade sutil/nebula
    const grad = ctx.createRadialGradient(W/2,H/2,10, W/2,H/2, Math.max(W,H)/1.3);
    grad.addColorStop(0, 'rgba(255,255,255,0.02)');
    grad.addColorStop(1, 'rgba(0,0,0,0.25)');
    ctx.fillStyle = grad; ctx.fillRect(0,0,W,H);

    // nós
    for(const n of nodes){
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.arc(n.x, n.y, 3*DPR, 0, Math.PI*2);
      ctx.fill();
    }

    // rotas
    if(routes.conv && showConv?.checked){
      ctx.strokeStyle = 'rgba(120,170,255,0.8)';
      ctx.lineWidth = 2.5*DPR;
      ctx.setLineDash([8*DPR, 10*DPR]);
      ctx.beginPath();
      const p = routes.conv.path;
      ctx.moveTo(p[0].x, p[0].y);
      ctx.lineTo(p[1].x, p[1].y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    if(routes.nova && showNova?.checked){
      ctx.strokeStyle = 'rgba(255,215,122,0.9)';
      ctx.lineWidth = 3*DPR;
      ctx.shadowColor = 'rgba(255,215,122,0.25)';
      ctx.shadowBlur = 12*DPR;
      ctx.beginPath();
      const p = routes.nova.path;
      ctx.moveTo(p[0].x, p[0].y);
      for(let i=1;i<p.length;i++) ctx.lineTo(p[i].x, p[i].y);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // origem/dest
    const src = nodes.find(n=> n.id==selO.value);
    const dst = nodes.find(n=> n.id==selD.value);
    if(src){
      ctx.fillStyle = '#6ec1ff';
      ctx.beginPath(); ctx.arc(src.x, src.y, 5.5*DPR, 0, Math.PI*2); ctx.fill();
    }
    if(dst){
      ctx.fillStyle = '#ffd77a';
      ctx.beginPath(); ctx.arc(dst.x, dst.y, 5.5*DPR, 0, Math.PI*2); ctx.fill();
    }
  }

  // animação da “sonda”
  let animId = 0;
  function animateAlong(path, color='rgba(255,255,255,0.95)'){
    if(!path || path.length<2) return;
    const W = canvas.width, H = canvas.height;
    let seg = 0, t = 0;
    const speed = 0.0028 * DPR; // ajuste de velocidade

    function step(){
      drawMap(currentRoutes); // redesenha mapa por baixo

      // ponto atual no segmento
      const a = path[seg], b = path[seg+1];
      const x = a.x + (b.x - a.x) * t;
      const y = a.y + (b.y - a.y) * t;

      // rastro
      ctx.save();
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 4.5*DPR, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();

      t += speed;
      if(t >= 1){
        t = 0; seg++;
        if(seg >= path.length-1){ cancelAnimationFrame(animId); animId=0; return; }
      }
      animId = requestAnimationFrame(step);
    }
    cancelAnimationFrame(animId); animId = requestAnimationFrame(step);
  }

  // estado atual
  let currentRoutes = { conv:null, nova:null };

  // recalcula tudo
  function recompute(){
    const src = nodes.find(n=> n.id==selO.value) || nodes[0];
    const dst = nodes.find(n=> n.id==selD.value) || nodes[nodes.length-1];
    const conv = routeConventional(src, dst);
    const nova = routeNova(src, dst);

    currentRoutes = { conv, nova };

    // RTTs
    const rttConv = rtt_ms(conv.length, 1);
    const rttNv   = rtt_ms(nova.length, NOVA_FACTOR);

    if(outRTTConv) outRTTConv.textContent = rttConv.toLocaleString();
    if(outRTTNova) outRTTNova.textContent = rttNv.toLocaleString();
    if(outHops)    outHops.textContent = Math.max(1, (nova.path?.length||1) - 1);

    drawMap(currentRoutes);
  }

  // eventos
  [selO, selD].forEach(el => el?.addEventListener('change', recompute));
  showConv?.addEventListener('change', ()=> drawMap(currentRoutes));
  showNova?.addEventListener('change', ()=> drawMap(currentRoutes));
  btnShuffle?.addEventListener('click', ()=>{
    genNodes(18 + Math.floor(Math.random()*6));
    fillSelects();
    recompute();
  });
  btnPlay?.addEventListener('click', ()=>{
    if(showNova?.checked && currentRoutes.nova) animateAlong(currentRoutes.nova.path, 'rgba(255,215,122,0.95)');
    else if(currentRoutes.conv) animateAlong(currentRoutes.conv.path, 'rgba(120,170,255,0.95)');
  });
  btnStop?.addEventListener('click', ()=> { cancelAnimationFrame(animId); animId=0; drawMap(currentRoutes); });

  // init
  recompute();
})();
