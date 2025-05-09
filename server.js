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

//
// 2) Destructure env vars
//
const {
  OFFLINE_THRESHOLD_MS = "10000",    // 10 seconds for demo
  SENDGRID_API_KEY,
  SENDGRID_FROM_EMAIL,
  ALERT_TO_EMAIL
} = process.env;

//
// 3) Debug-log loaded values
//
console.log("→ OFFLINE_THRESHOLD_MS =", OFFLINE_THRESHOLD_MS);
console.log("→ SENDGRID_API_KEY prefix =", SENDGRID_API_KEY?.slice(0, 4), "…");
console.log("→ SENDGRID_FROM_EMAIL =", SENDGRID_FROM_EMAIL);
console.log("→ ALERT_TO_EMAIL =", ALERT_TO_EMAIL);

//
// 4) Validate required settings
//
if (!SENDGRID_API_KEY || !SENDGRID_FROM_EMAIL || !ALERT_TO_EMAIL) {
  console.error("Missing SendGrid configuration in .env");
  process.exit(1);
}

//
// 5) Configure SendGrid
//
sgMail.setApiKey(SENDGRID_API_KEY);

//
// 6) Express setup
//
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

//
// 7) Application state
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
// 8) Heartbeat endpoint (with recovery email)
//
app.post("/api/heartbeat", (req, res) => {
  const { pcId } = req.body;
  if (!pcId) {
    return res.status(400).json({ error: "Missing pcId" });
  }

  const now = Date.now();
  const wasOffline = alerted[pcId] === true;
  lastSeen[pcId] = now;
  alerted[pcId] = false;  // clear the offline flag

  if (wasOffline) {
    const recoveryTime = new Date(now).toLocaleTimeString();
    const subject = `✅ RECOVERY: ${pcId} is back online`;
    const textBody = `${pcId} came back online at ${recoveryTime}.`;
    const htmlBody = `<p><strong>${pcId}</strong> came back online at ${recoveryTime}.</p>`;

    sgMail
      .send({
        to: ALERT_TO_EMAIL,
        from: SENDGRID_FROM_EMAIL,
        subject,
        text: textBody,
        html: htmlBody,
      })
      .then(() => console.log("Recovery email sent for", pcId))
      .catch((err) => {
        console.error("SendGrid error status:", err.code);
        console.error("SendGrid error body:", err.response?.body);
      });
  }

  res.sendStatus(200);
});

//
// 9) Status endpoint
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
// 10) Offline scanner & email alerts
//
const thresholdMs = parseInt(OFFLINE_THRESHOLD_MS, 10);
setInterval(() => {
  const now = Date.now();

  for (const pcId of computers) {
    const last = lastSeen[pcId] || 0;
    const isOffline = now - last >= thresholdMs;

    if (isOffline && !alerted[pcId]) {
      alerted[pcId] = true;

      const wentOfflineAt = new Date(last).toLocaleTimeString();
      const subject = `🚨 ALERT: ${pcId} went offline`;
      const textBody = `${pcId} went offline at ${wentOfflineAt}.`;
      const htmlBody = `<p><strong>${pcId}</strong> went offline at ${wentOfflineAt}.</p>`;

      sgMail
        .send({
          to: ALERT_TO_EMAIL,
          from: SENDGRID_FROM_EMAIL,
          subject,
          text: textBody,
          html: htmlBody,
        })
        .then(() => console.log("Offline email sent for", pcId))
        .catch((err) => {
          console.error("SendGrid error status:", err.code);
          console.error("SendGrid error body:", err.response?.body);
        });
    }
  }
}, thresholdMs);

//
// 11) Serve React build
//
const buildDir = path.join(__dirname, "build");
app.use(express.static(buildDir));
app.get("/", (req, res) => {
  res.sendFile(path.join(buildDir, "index.html"));
});

//
// 12) Start the server
//
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API + UI listening on port ${PORT}`);
});
