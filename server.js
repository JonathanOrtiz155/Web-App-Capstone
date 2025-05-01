// server.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

//
// 1) Load environment variables
//
dotenv.config();

const {
  OFFLINE_THRESHOLD_MS = "10000",      // default to 10 seconds
  SENDGRID_API_KEY,
  SENDGRID_FROM_EMAIL,
  ALERT_TO_EMAIL
} = process.env;

// Validate required vars
if (!SENDGRID_API_KEY || !SENDGRID_FROM_EMAIL || !ALERT_TO_EMAIL) {
  console.error("Missing SendGrid configuration in .env");
  process.exit(1);
}

// Configure SendGrid
sgMail.setApiKey(SENDGRID_API_KEY);

//
// 2) Express setup
//
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

//
// 3) Application state
//
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

const lastSeen = {};   // { pcId: timestamp }
const alerted = {};    // { pcId: boolean }

//
// 4) Heartbeat endpoint
//
app.post("/api/heartbeat", (req, res) => {
  const { pcId } = req.body;
  console.log("Heartbeat received for:", pcId);
  if (!pcId) {
    return res.status(400).json({ error: "Missing pcId" });
  }
  lastSeen[pcId] = Date.now();
  alerted[pcId] = false;  // reset any prior alert
  res.sendStatus(200);
});

//
// 5) Status endpoint
//
app.get("/api/status", (req, res) => {
  const now = Date.now();
  const threshold = parseInt(OFFLINE_THRESHOLD_MS, 10);
  const status = {};

  for (const pcId of computers) {
    const last = lastSeen[pcId] || 0;
    status[pcId] = now - last < threshold;
  }

  res.json(status);
});

//
// 6) Offline scanner & email alerts
//
const thresholdMs = parseInt(OFFLINE_THRESHOLD_MS, 10);
setInterval(() => {
  const now = Date.now();

  for (const pcId of computers) {
    const last = lastSeen[pcId] || 0;
    const isOffline = now - last >= thresholdMs;

    if (isOffline && !alerted[pcId]) {
      alerted[pcId] = true;

      // Customize subject and body here:
      const wentOfflineAt = new Date(last).toLocaleTimeString();
      const subject = `🚨 ALERT: ${pcId} went offline`;
      const textBody = `${pcId} went offline at ${wentOfflineAt}.`;
      const htmlBody = `<p><strong>${pcId}</strong> went offline at ${wentOfflineAt}.</p>`;

      const msg = {
        to: ALERT_TO_EMAIL,
        from: SENDGRID_FROM_EMAIL,
        subject,
        text: textBody,
        html: htmlBody,
      };

      sgMail
        .send(msg)
        .then(() => console.log("Email alert sent for", pcId))
        .catch((err) => console.error("Error sending email for", pcId, err));
    }
  }
}, thresholdMs);

//
// 7) Serve React build
//
const buildDir = path.join(__dirname, "build");
app.use(express.static(buildDir));

// Fallback to index.html on root
app.get("/", (req, res) => {
  res.sendFile(path.join(buildDir, "index.html"));
});

//
// 8) Start the server
//
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API + UI listening on port ${PORT}`);
});
