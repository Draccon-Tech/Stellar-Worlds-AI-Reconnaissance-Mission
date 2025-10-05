
const mainContent = document.querySelector(".scene");


const coordinatePlanets = [];
const MIN_DISTANCE = 10;
// Cria novo elemento html planeta
const createPlanet = (namePlanet, justify, priority) => {
    const button = document.createElement("button");
    const img = document.createElement("img");

    let x, y
    let isValid = false;
    
    button.classList.add("planet");
    while (!isValid){
        x = Math.floor(Math.random() * 100)
        y = Math.floor(Math.random() * 100)

        isValid = coordinatePlanets.every(([px, py]) => {
            const dx = x - px;
            const dy = y - py;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance >= MIN_DISTANCE
        })

        if (coordinatePlanets.length === 0) isValid = true

    }

    coordinatePlanets.push([x, y]);
    

    button.style.setProperty("--x", `${x}%`)
    button.style.setProperty("--y", `${y}%`)

    button.setAttribute("data-name" , `${namePlanet}`)
    button.setAttribute("data-info" , `Justify: ${justify} \nPriority Level: ${priority}`)

    const imagePathList = ["assets/planet-1.png", "assets/planet-3.png", "assets/planet-4.png"]
    const pathImage = imagePathList[Math.floor(Math.random() * imagePathList.length)]
    img.src = pathImage

    button.appendChild(img)
    mainContent.appendChild(button);
}

// Fetch dos dados dos planetas processados

const getDataPlanets = async () => {
    try{
    const response = await fetch("https://alessandrosamir.app.n8n.cloud/webhook-test/04635d76-61f7-4fa7-84bc-632e8aa47cac")
    const data = await response.json()
    return data
    } catch (error) {
        console.error("Ocorreu um erro ao resgatar os dados: ", error)
    }
} 

(async() => {
    const data = await getDataPlanets();
    console.log(data);
    data.forEach((planet) => {
        const planetName = planet.nome;
        const justify = planet.justificativa_cientifica[0];
        const priority = planet.codigo_prioridade;

        if(!planetName) return;

        createPlanet(planetName, justify, priority);
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
    })
})();