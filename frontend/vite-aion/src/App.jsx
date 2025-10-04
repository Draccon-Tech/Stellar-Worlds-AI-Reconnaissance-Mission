/* eslint-disable */ 
/*
AION S.W.A.R.M — Frontend Completo e Auto-Contido
*/

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Satellite, Zap, Globe, Users, Moon, BookOpen, Download, Upload, Lightbulb, CheckCircle, XCircle, BrainCircuit } from 'lucide-react';

const GalaxyBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden bg-gray-900">
    <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-80" />
    <div id="stars1" className="absolute w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-[move-twink-back_200s_linear_infinite]" />
    <div id="stars2" className="absolute w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-[move-twink-back_150s_linear_infinite] opacity-50" />
    <div id="stars3" className="absolute w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-[move-twink-back_100s_linear_infinite] opacity-30" />
    <style jsx global>{`
      @keyframes move-twink-back {
        from { background-position: 0 0; }
        to { background-position: -10000px 5000px; }
      }
    `}</style>
  </div>
);

const AIONZeroModule = () => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const handleAnalysis = () => {
        setIsAnalyzing(true);
        setResult(null);
        setTimeout(() => {
            setResult({ name: 'Kepler-186f', status: 'Potencialmente Habitável' });
            setIsAnalyzing(false);
        }, 2500);
    };
    return (
        <div className="relative border border-white/10 bg-black/30 backdrop-blur-sm rounded-lg p-4 mb-6 flex items-center justify-between gap-4">
            <div>
                <h3 className="font-display text-lg text-cyan-300">AION-Zero: O Primeiro Sentido</h3>
                <p className="text-sm text-slate-300">Conectando ao desafio: A primeira tarefa do AION foi analisar dados de trânsito para identificar exoplanetas.</p>
            </div>
            {!result ? (
                <button onClick={handleAnalysis} disabled={isAnalyzing} className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-semibold whitespace-nowrap disabled:bg-gray-500">
                    {isAnalyzing ? 'Analisando...' : 'Analisar Setor'}
                </button>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-right">
                    <p className="font-semibold text-emerald-300">Candidato Encontrado: {result.name}</p>
                    <p className="text-xs text-slate-300">Status: {result.status}</p>
                </motion.div>
            )}
        </div>
    );
};

function nowTime() { return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); }
function envSignature(env) {
  const t = Math.round(env.temperature/10)*10;
  const g = Math.round(env.gravity*10)/10;
  const r = Math.round(env.radiation/10)*10;
  const a = env.atmosphere.replace(/[^a-zA-Z]/g,'') || 'none';
  return `${t}|${g}|${r}|${a}`;
}
function initialHeuristic(env) {
  if (env.radiation > 200) return 'Análise Orbital Remota';
  if (env.atmosphere.includes('densa')) return 'Reconhecimento Aéreo';
  if (env.temperature < -50 && env.atmosphere.includes('fina')) return 'Perfuração e Análise de Gelo';
  if (env.gravity < 0.5) return 'Mapeamento Balístico';
  return 'Reconhecimento de Superfície';
}
const STRATEGIES = ['Reconhecimento de Superfície','Perfuração e Análise de Gelo','Reconhecimento Aéreo','Análise Orbital Remota','Mapeamento Balístico','Modo de Segurança'];
function mutateStrategy(s) {
  const idx = STRATEGIES.indexOf(s);
  const shift = (Math.random() < 0.6) ? (Math.random() < 0.5 ? -1 : 1) : (Math.random()<0.5 ? -2 : 2);
  const newIdx = Math.max(0, Math.min(STRATEGIES.length-1, idx + shift));
  return STRATEGIES[newIdx] || STRATEGIES[Math.floor(Math.random()*STRATEGIES.length)];
}

export default function App() {
  const [showApp, setShowApp] = useState(false);
  const [eduMode, setEduMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [nodes, setNodes] = useState(() => JSON.parse(localStorage.getItem('aion_nodes')) || [
    { id: 'earth-core', label: 'Núcleo Terrestre', type: 'core', status: 'online' },
    { id: 'mars-orbit', label: 'Orbitador de Marte', type: 'orbiter', status: 'online' },
    { id: 'mars-rover', label: 'Rover Marciano', type: 'rover', status: 'online' },
    { id: 'titan-probe', label: 'Sonda de Titã', type: 'probe', status: 'online' },
    { id: 'europa-lander', label: 'Pousador de Europa', type: 'lander', status: 'online' },
  ]);
  const [messages, setMessages] = useState(() => JSON.parse(localStorage.getItem('aion_messages')) || []);
  const [policyMap, setPolicyMap] = useState(() => JSON.parse(localStorage.getItem('aion_policy')) || {});
  const [modelVersion, setModelVersion] = useState(() => Number(localStorage.getItem('aion_modelVersion')) || 1);
  const [simulationOn, setSimulationOn] = useState(false);
  const [envInputs, setEnvInputs] = useState({ temperature: -20, gravity: 0.38, radiation: 50, atmosphere: 'fina' });
  const [latestDecision, setLatestDecision] = useState(null);
  const [trainingHistory, setTrainingHistory] = useState(() => JSON.parse(localStorage.getItem('aion_history')) || []);

  useEffect(() => { localStorage.setItem('aion_nodes', JSON.stringify(nodes)) }, [nodes]);
  useEffect(() => { localStorage.setItem('aion_messages', JSON.stringify(messages)) }, [messages]);
  useEffect(() => { localStorage.setItem('aion_policy', JSON.stringify(policyMap)) }, [policyMap]);
  useEffect(() => { localStorage.setItem('aion_modelVersion', String(modelVersion)) }, [modelVersion]);
  useEffect(() => { localStorage.setItem('aion_history', JSON.stringify(trainingHistory)) }, [trainingHistory]);

  useEffect(() => {
    if (!simulationOn) return;
    const interval = setInterval(() => {
        const active = nodes.filter(n => n.status === 'online' && n.type !== 'core');
        if (active.length === 0) return;
        const origin = active[Math.floor(Math.random()*active.length)];
        const { decision } = decideMission(envInputs);
        pushMessage({ id: Date.now(), origin: origin.label, text: `Decisão: ${decision}`, time: nowTime() });
        const successProb = Math.min(0.95, 0.5 + Math.random()*0.35 + (policyScore(decision, envInputs)/100));
        const success = Math.random() < successProb;
        const resultText = success ? 'SUCESSO' : 'FALHA';
        pushMessage({ id: Date.now()+1, origin: origin.label, text: `Resultado da Ação: ${resultText}`, time: nowTime(), type: success ? 'success' : 'fail' });
        if (!eduMode) {
            if (success) {
                reinforcePolicy(decision, envInputs, 10);
            } else {
                mutatePolicy(decision, envInputs);
            }
        }
    }, eduMode ? 2800 : 2200);
    return () => clearInterval(interval);
  }, [simulationOn, nodes, envInputs, eduMode, policyMap]);

  function pushMessage(msg) { setMessages(prev => [msg, ...prev].slice(0, 200)); }
  function policyScore(strategy, env) {
      const sig = envSignature(env);
      const p = policyMap[sig];
      if (!p || p.strategy !== strategy) return 0;
      return p.score || 0;
  }
  function decideMission(env) {
      const sig = envSignature(env);
      let entry = policyMap[sig];
      if (!entry || entry.score < 5) {
          const strat = initialHeuristic(env);
          entry = { strategy: strat, score: 10 };
          setPolicyMap(prev => ({ ...prev, [sig]: entry }));
          const decision = { decision: strat, justification: `Heurística inicial aplicada.`, type: 'heuristic' };
          setLatestDecision(decision);
          return { ...decision, justification: `Estratégia Heurística: ${strat}` };
      }
      const decision = { decision: entry.strategy, justification: `Política v${modelVersion.toFixed(2)} selecionada com pontuação ${entry.score}.`, type: 'policy' };
      setLatestDecision(decision);
      return { ...decision, justification: `Política selecionada: ${entry.strategy} (Pontuação: ${entry.score})` };
  }
  function reinforcePolicy(strategy, env, delta=5) {
      const sig = envSignature(env);
      setPolicyMap(prev => {
          const copy = { ...prev };
          const cur = copy[sig] || { strategy, score: 0 };
          if (cur.strategy === strategy) cur.score = Math.min(100, (cur.score||0) + delta);
          else cur.score = Math.max(0, (cur.score||0) - delta);
          copy[sig] = cur;
          return copy;
      });
      setTrainingHistory(h => [{ time: nowTime(), type: 'reinforce', strategy, sig, delta }, ...h].slice(0,200));
      setModelVersion(v => v + 0.01);
  }
  function mutatePolicy(strategy, env) {
    const sig = envSignature(env);
    setPolicyMap(prev => {
        const copy = { ...prev };
        // A linha abaixo é a que foi corrigida
        const cur = copy[sig] ? { ...copy[sig] } : { strategy, score: 0 };
        const newStrategy = mutateStrategy(cur.strategy || strategy);
        cur.strategy = newStrategy;
        cur.score = Math.max(0, (cur.score || 0) - 8);
        copy[sig] = cur;
        return copy;
    });
    setTrainingHistory(h => [{ time: nowTime(), type: 'mutate', from: strategy, to: policyMap[sig]?.strategy, sig }, ...h].slice(0, 200));
    setModelVersion(v => Math.round((v + Math.random() * 0.2) * 100) / 100);
}
  function submitHumanFeedback(strategy, env, success) {
      if (success) reinforcePolicy(strategy, env, 15);
      else mutatePolicy(strategy, env);
      pushMessage({ id: Date.now(), origin: 'Humano (EDU)', text: `Feedback para "${strategy}": ${success ? 'SUCESSO' : 'FALHA'}`, time: nowTime(), type: 'human' });
  }
  function broadcastModel() {
      const online = nodes.filter(n => n.status === 'online' && n.type !== 'core');
      pushMessage({ id: Date.now(), origin: 'Núcleo Terrestre', text: `Transmitindo modelo v${modelVersion.toFixed(2)} para a swarm...`, time: nowTime(), type: 'broadcast' });
      online.forEach((node, i) => {
          setTimeout(() => {
              pushMessage({ id: Date.now()+i, origin: 'Núcleo Terrestre', text: `Modelo v${modelVersion.toFixed(2)} entregue para ${node.label}`, time: nowTime(), type: 'broadcast' });
          }, i*400 + 300);
      });
  }
  function exportSnapshot() {
      const snapshot = { nodes, messages, policyMap, modelVersion, trainingHistory, envInputs };
      const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = `aion-snapshot-${Date.now()}.json`; a.click();
      URL.revokeObjectURL(a.href);
  }
  async function importSnapshot(file) {
      try {
          const snap = JSON.parse(await file.text());
          if (snap.nodes) setNodes(snap.nodes);
          if (snap.messages) setMessages(snap.messages);
          if (snap.policyMap) setPolicyMap(snap.policyMap);
          if (snap.modelVersion) setModelVersion(snap.modelVersion);
          if (snap.trainingHistory) setTrainingHistory(snap.trainingHistory);
          if (snap.envInputs) setEnvInputs(snap.envInputs);
          pushMessage({ id: Date.now(), origin: 'Sistema', text: 'Snapshot importado com sucesso.', time: nowTime() });
      } catch (e) {
          pushMessage({ id: Date.now(), origin: 'Sistema', text: 'Erro ao importar snapshot.', time: nowTime() });
      }
  }

  const renderIcon = (type) => ({
      core: <Cpu className="w-8 h-8 text-cyan-300" />,
      orbiter: <Satellite className="w-8 h-8 text-violet-300" />,
      rover: <Zap className="w-8 h-8 text-amber-300" />,
      probe: <Globe className="w-8 h-8 text-emerald-300" />,
      lander: <Users className="w-8 h-8 text-rose-300" />,
  })[type] || <BrainCircuit />;
  const onlineCount = nodes.filter(n => n.status === 'online').length;

  return (
    <div className={`min-h-screen font-sans ${highContrast ? 'bg-black text-white' : 'text-slate-100'}`}>
        <GalaxyBackground />
        <AnimatePresence>
            {!showApp && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.5 } }} className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-20">
                    <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.2, duration: 0.8 } }} className="font-display text-6xl md:text-8xl font-bold tracking-tighter text-white"> AION S.W.A.R.M </motion.h1>
                    <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.5, duration: 0.8 } }} className="mt-4 text-lg md:text-xl text-slate-300 max-w-3xl"> Uma IA descentralizada e auto evolutiva para a exploração autônoma do cosmos. O próximo passo da humanidade nas estrelas. </motion.p>
                    <motion.button initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.8, duration: 0.8 } }} onClick={() => setShowApp(true)} className="mt-8 px-8 py-4 rounded-full bg-violet-600 text-white font-semibold text-lg hover:bg-violet-500 transition-colors shadow-lg shadow-violet-500/30"> Iniciar Simulação </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
        <AnimatePresence>
        {showApp && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.8 } }} className="max-w-screen-2xl mx-auto p-4 md:p-6">
                <header className="flex flex-col md:flex-row items-start justify-between gap-6 mb-6">
                    <div>
                        <h1 className="font-display text-3xl md:text-4xl font-bold text-white">Painel de Controle AION</h1>
                        <p className="text-slate-300 max-w-2xl">Monitore a swarm, simule ambientes e observe a IA aprender em tempo real.</p>
                    </div>
                    <div className="w-full md:w-auto p-4 rounded-xl bg-black/30 backdrop-blur-sm border border-white/10 flex items-center gap-4">
                        <BrainCircuit className="w-10 h-10 text-violet-400" />
                        <div>
                            <div className="text-xs text-slate-400">Versão do Modelo Cognitivo</div>
                            <div className="font-bold text-xl">v{modelVersion.toFixed(2)}</div>
                        </div>
                        <div className="border-l border-white/20 pl-4">
                            <div className="text-xs text-slate-400">Nós Online</div>
                            <div className="font-bold text-xl">{onlineCount} / {nodes.length}</div>
                        </div>
                    </div>
                </header>
                <AIONZeroModule />
                <main className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3 flex flex-col gap-6">
                        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10">
                            <h2 className="font-display text-2xl font-semibold mb-3">Mapa da Swarm Interplanetária</h2>
                            <div className="relative w-full h-96 flex items-center justify-center">
                                <div className="absolute w-64 h-64 border-2 border-cyan-500/20 rounded-full animate-spin-slow" />
                                <div className="absolute w-96 h-96 border border-cyan-500/10 rounded-full animate-spin-slower" />
                                {nodes.map((node, i) => {
                                    const isCore = node.type === 'core';
                                    const angle = (i / (nodes.length - (isCore ? 1 : 0))) * 2 * Math.PI;
                                    const radius = isCore ? 0 : 140;
                                    const x = radius * Math.cos(angle);
                                    const y = radius * Math.sin(angle);
                                    const online = node.status === 'online';
                                    return (
                                        <div key={node.id} style={{ transform: `translate(${x}px, ${y}px)` }} className="absolute transition-transform duration-500">
                                            <motion.button onClick={() => setNodes(prev => prev.map(p => p.id===node.id ? { ...p, status: online ? 'offline' : 'online' } : p))} className={`flex flex-col items-center gap-2 group cursor-pointer`} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                                <div className={`w-20 h-20 rounded-full flex items-center justify-center border-2 transition-colors ${online ? 'border-emerald-400 bg-emerald-900/50' : 'border-rose-500 bg-rose-900/50'}`}>
                                                    {renderIcon(node.type)}
                                                </div>
                                                <span className="text-xs text-center font-semibold group-hover:text-cyan-300 transition-colors">{node.label}</span>
                                            </motion.button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10">
                            <h2 className="font-display text-2xl font-semibold mb-4">Simulador de Ambiente Planetário</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-xs text-slate-300">Temperatura (°C)</label>
                                    <input type="range" min="-200" max="200" value={envInputs.temperature} onChange={(e)=>setEnvInputs(s=>({...s, temperature: Number(e.target.value)}))} className="w-full" />
                                    <div className="text-sm mt-1 text-center font-semibold">{envInputs.temperature}°C</div>
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-300">Gravidade (g)</label>
                                    <input type="range" min="0.1" max="2" step="0.01" value={envInputs.gravity} onChange={(e)=>setEnvInputs(s=>({...s, gravity: Number(e.target.value)}))} className="w-full" />
                                    <div className="text-sm mt-1 text-center font-semibold">{envInputs.gravity.toFixed(2)} g</div>
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-300">Radiação (mSv/h)</label>
                                    <input type="range" min="0" max="500" value={envInputs.radiation} onChange={(e)=>setEnvInputs(s=>({...s, radiation: Number(e.target.value)}))} className="w-full" />
                                    <div className="text-sm mt-1 text-center font-semibold">{envInputs.radiation} mSv/h</div>
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-300">Atmosfera</label>
                                    <select value={envInputs.atmosphere} onChange={(e)=>setEnvInputs(s=>({...s, atmosphere: e.target.value}))} className="w-full mt-1 p-2 rounded bg-black/40 border border-white/10">
                                        <option value="nenhuma">Nenhuma</option><option value="fina">Fina</option><option value="densa">Densa</option><option value="tóxica">Tóxica</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <button onClick={() => setEnvInputs({ temperature: -65, gravity: 0.38, radiation: 5, atmosphere: 'fina' })} className="px-3 py-1 rounded-full text-xs bg-amber-800 hover:bg-amber-700">Preset: Marte</button>
                                <button onClick={() => setEnvInputs({ temperature: -180, gravity: 0.13, radiation: 220, atmosphere: 'nenhuma' })} className="px-3 py-1 rounded-full text-xs bg-sky-800 hover:bg-sky-700">Preset: Europa</button>
                                <button onClick={() => setEnvInputs({ temperature: -179, gravity: 0.14, radiation: 10, atmosphere: 'densa' })} className="px-3 py-1 rounded-full text-xs bg-orange-800 hover:bg-orange-700">Preset: Titã</button>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10 flex-grow flex flex-col">
                            <h2 className="font-display text-2xl font-semibold mb-3">Núcleo Cognitivo AION</h2>
                            <div className="p-4 bg-black/30 rounded-lg">
                                <p className="text-xs text-slate-400 mb-1">Última Decisão Autônoma</p>
                                {latestDecision ? (
                                    <>
                                        <p className={`font-bold text-lg ${latestDecision.type === 'heuristic' ? 'text-amber-400' : 'text-cyan-300'}`}>{latestDecision.decision}</p>
                                        <p className="text-xs text-slate-300">{latestDecision.justification}</p>
                                    </>
                                ) : <p className="text-slate-400">Aguardando ciclo...</p>}
                            </div>
                            {eduMode && (
                               <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="mt-4 p-4 bg-emerald-900/50 rounded-lg border border-emerald-500/50">
                                   <div className="flex items-center gap-2">
                                       <BookOpen className="w-5 h-5 text-emerald-300"/>
                                       <h4 className="font-semibold text-emerald-200">Modo AION EDU</h4>
                                   </div>
                                   <p className="text-xs mt-1 mb-2 text-emerald-200">Você é o especialista. A última ação foi correta para este ambiente?</p>
                                   <div className="flex gap-2">
                                       <button onClick={() => latestDecision && submitHumanFeedback(latestDecision.decision, envInputs, true)} className="w-full px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-xs font-bold flex items-center justify-center gap-1"><CheckCircle size={14}/>Correta</button>
                                       <button onClick={() => latestDecision && submitHumanFeedback(latestDecision.decision, envInputs, false)} className="w-full px-3 py-2 rounded bg-rose-600 hover:bg-rose-500 text-xs font-bold flex items-center justify-center gap-1"><XCircle size={14}/>Incorreta</button>
                                   </div>
                               </motion.div>
                            )}
                            <div className="mt-4 flex-grow flex flex-col">
                                <h4 className="text-sm text-slate-300 mb-2">Log de Telemetria e Atividade</h4>
                                <div className="flex-grow h-64 overflow-y-auto bg-black/40 rounded p-3 text-xs" role="log">
                                    <AnimatePresence>
                                        {messages.map(m => (
                                            <motion.div key={m.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{duration:0.2}} className="mb-2">
                                                <div className="text-slate-400">[{m.time}] <span className="font-semibold text-cyan-400">{m.origin}</span></div>
                                                <div className={`pl-2 ${m.type === 'success' ? 'text-emerald-300' : m.type === 'fail' ? 'text-rose-400' : m.type === 'broadcast' ? 'text-violet-300' : m.type === 'human' ? 'text-amber-300' : ''}`}>{m.text}</div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10">
                            <h2 className="font-display text-2xl font-semibold mb-4">Controles da Simulação</h2>
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => setSimulationOn(s=>!s)} className={`px-4 py-3 rounded font-bold ${simulationOn ? 'bg-rose-600 hover:bg-rose-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}>{simulationOn ? 'Pausar Simulação' : 'Iniciar Simulação'}</button>
                                <button onClick={() => setEduMode(e=>!e)} className={`px-4 py-3 rounded font-bold ${eduMode ? 'bg-cyan-700 hover:bg-cyan-600' : 'bg-cyan-600 hover:bg-cyan-500'}`}>{eduMode ? 'Sair do Modo EDU' : 'Modo AION EDU'}</button>
                                <button onClick={broadcastModel} className="px-4 py-3 rounded bg-violet-600 hover:bg-violet-500 font-bold col-span-2">Transmitir Modelo para Swarm</button>
                                <button onClick={exportSnapshot} className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600 flex items-center justify-center gap-2"><Download size={16}/>Exportar</button>
                                <label className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600 flex items-center justify-center gap-2 cursor-pointer"><Upload size={16}/>Importar
                                  <input type="file" accept=".json" onChange={(e)=>e.target.files && importSnapshot(e.target.files[0])} className="hidden" />
                                </label>
                            </div>
                        </div>
                    </div>
                </main>
            </motion.div>
        )}
        </AnimatePresence>
    </div>
  );
}