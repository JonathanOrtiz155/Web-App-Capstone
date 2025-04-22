import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// List of all 15 PC identifiers
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
  "LX-15-18460-23"
];

// In-memory store of last heartbeat timestamps
const lastSeen = {};

// Receive heartbeat
app.post("/api/heartbeat", (req, res) => {
  const { pcId } = req.body;
  if (!pcId) {
    return res.status(400).json({ error: "Missing pcId" });
  }
  lastSeen[pcId] = Date.now();
  return res.sendStatus(200);
});

// Return online/offline status for every PC
app.get("/api/status", (req, res) => {
  const now = Date.now();
  const status = {};

  // A PC is "online" if its last heartbeat was within the last 3 minutes
  for (const pcId of computers) {
    const last = lastSeen[pcId] || 0;
    status[pcId] = now - last < 3 * 60 * 1000;
  }

  res.json(status);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});
