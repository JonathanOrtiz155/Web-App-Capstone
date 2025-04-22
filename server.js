import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// In‑memory store of last heartbeat timestamp
const lastSeen = {};

// Receive heartbeat
app.post("/api/heartbeat", (req, res) => {
  const { pcId } = req.body;
  if (!pcId) return res.status(400).json({ error: "Missing pcId" });
  lastSeen[pcId] = Date.now();
  return res.sendStatus(200);
});

// Return online/offline status
app.get("/api/status", (req, res) => {
  const now = Date.now();
  const status = {};
  // Mark online if seen within last 3 minutes (180000 ms)
  for (const [pcId, timestamp] of Object.entries(lastSeen)) {
    status[pcId] = now - timestamp < 3 * 60 * 1000;
  }
  res.json(status);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API server listening on ${PORT}`));
