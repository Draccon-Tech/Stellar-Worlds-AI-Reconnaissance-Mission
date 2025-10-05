/* ===================== S.W.A.R.M — PLANETS LAYER ===================== */
/* Requisitos de HTML/CSS:
   - Container para montar planetas: <div id="planet-layer" class="planet-layer"></div>
   - Tooltip: <div id="tooltip" class="tooltip"></div>
   - Modal: <dialog id="joinModal"> ... <h2> ... </h2> ... </dialog>
   - CSS esperado para .planet:
        .planet{ position:absolute; left:var(--x); top:var(--y); transform:translate(-50%, -50%); background:none; border:0; cursor:pointer }
        .planet img{ display:block; width: clamp(48px, 6vw, 120px); height:auto; pointer-events:none }
        .planet-layer{ position:absolute; inset:0; z-index:2; }
        .starfield{ position:absolute; inset:0; z-index:1; }
*/

(() => {
  /* ---------- CONFIG ---------- */
  const cfg = {
    mountSelector: window.SWARM_CONFIG?.planetMountSelector || ".scene",
    planetLayerSelector: "#planet-layer",       // preferível, se existir
    starsCanvasId: window.SWARM_CONFIG?.starsCanvasId || "stars",
    tooltipSelector: window.SWARM_CONFIG?.tooltipSelector || "#tooltip",
    minDistancePct: 10,                          // distância mínima em porcentagem (como seu código original)
    // Adicione/edite aqui suas imagens PNG com fundo transparente
    planetImages: [
      "assets/planets/planet-1.png",
      "assets/planets/planet-2.png",
      "assets/planets/planet-3.png",
      "assets/planets/planet-4.png",
      "assets/planets/planet-5.png",
      "assets/planets/planet-6.png",
      "assets/planets/planet-7.png",
      "assets/planets/planet-8.png",
      "assets/planets/planet-9.png",
      "assets/planets/planet-10.png",
    ],
    dataUrl: "https://alessandrosamir.app.n8n.cloud/webhook-test/04635d76-61f7-4fa7-84bc-632e8aa47cac" //https://alessandrosamir.app.n8n.cloud/webhook/04635d76-61f7-4fa7-84bc-632e8aa47cac"
  };

  /* ---------- MONTAGEM ---------- */
  const sceneRoot =
    document.querySelector(cfg.planetLayerSelector) ||
    document.querySelector(cfg.mountSelector);

  if (!sceneRoot) {
    console.error(
      "[SWARM] Container de montagem não encontrado. Ajuste SWARM_CONFIG.planetMountSelector ou crie #planet-layer."
    );
    return;
  }

  // Assegura que o container onde os planetas ficarão é absoluto para ocupar a cena
  if (!sceneRoot.classList.contains("planet-layer")) {
    sceneRoot.classList.add("planet-layer");
  }
  if (getComputedStyle(sceneRoot).position === "static") {
    sceneRoot.style.position = "absolute";
    sceneRoot.style.inset = "0";
    sceneRoot.style.zIndex = "2";
  }

  /* ---------- TOOLTIP ---------- */
  const tooltip =
    document.querySelector(cfg.tooltipSelector) ||
    (() => {
      const t = document.createElement("div");
      t.id = cfg.tooltipSelector.replace("#", "");
      t.className = "tooltip";
      document.body.appendChild(t);
      return t;
    })();

  let tooltipVisible = false;
  function showTooltip(x, y, title, body) {
    tooltip.style.left = `${Math.round(x)}px`;
    tooltip.style.top = `${Math.round(y)}px`;
    tooltip.innerHTML = `
      <strong style="color:var(--gold, #f7c948)">${title ?? "—"}</strong>
      <div style="color:rgba(255,255,255,.78);font-size:12px;white-space:pre-line">${body ?? ""}</div>
    `;
    tooltip.style.display = "block";
    tooltipVisible = true;
  }
  function hideTooltip() {
    tooltip.style.display = "none";
    tooltipVisible = false;
  }

  /* ---------- POOL DE IMAGENS (sem repetição simultânea) ---------- */
  let pool = [...cfg.planetImages];
  let consumed = [];

  
}) 