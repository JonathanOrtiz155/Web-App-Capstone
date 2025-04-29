// server.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Your 15 PC IDs
const computers = [
  "N-6-20437-20A",
  "LX-01-18480-23",
  "LX-02-18465-23",
  "LX-03-18481-23",
  "LX-04-18466-23",
  "LX-05-18470-23",
  "LX-06-18459-23",
  "LX-07-18467-23",
  "LX-08-18469-23",
  "LX-09-18461-23",
  "LX-10-18479-23",
  "LX-11-18468-23",
  "LX-12-18462-23",
  "LX-13-18463-23",
  "LX-14-18464-23",
  "LX-15-18460-23",
];

// In‑memory heartbeat store
const lastSeen = {};

// 1) POST /api/heartbeat
app.post("/api/heartbeat", (req, res) => {
  const { pcId } = req.body;
  console.log("Heartbeat received for:", pcId);
  if (!pcId) return res.status(400).json({ error: "Missing pcId" });
  lastSeen[pcId] = Date.now();
  res.sendStatus(200);
});

// 2) GET /api/status
app.get("/api/status", (req, res) => {
  const now = Date.now();
  const status = {};
  for (const pcId of computers) {
    const last = lastSeen[pcId] || 0;
    status[pcId] = now - last < 10 * 1000;
  }
  res.json(status);
});

// 3) Serve React build folder
const buildDir = path.join(__dirname, "build");
app.use(express.static(buildDir));

// 4) Serve index.html on the root path
app.get("/", (req, res) => {
  res.sendFile(path.join(buildDir, "index.html"));
});

// 5) Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API + UI listening on port ${PORT}`);
});
