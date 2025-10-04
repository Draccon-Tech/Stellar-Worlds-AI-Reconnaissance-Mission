import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// segurança básica + CORS do seu domínio
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: [/^https?:\/\/(www\.)?stellarworldsai\.earth$/], credentials: false }));
app.use(express.json());

// ping de saúde
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "swarm-api", ts: Date.now() });
});

// exemplo: endpoint AION mock
app.post("/api/aion", (req, res) => {
  const { prompt = "" } = req.body || {};
  // resposta temática curta (mock)
  const reply = prompt.toLowerCase().includes("bio")
    ? "Bio-sinais: O₂ fraco; CH₄ marginal. Recomendo NIR profundo."
    : "Analisando telemetria... priorizando Kepler-186f.";
  res.json({ reply });
});

// porta
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`SWARM API up on :${PORT}`));
