// agent.js
import fetch from "node-fetch";

const PC_ID = "N-6-20437-20A";
const BASE = "https://747c-2603-8000-cf01-26cc-6c53-601e-4105-97de.ngrok-free.app";
const BACKEND_URL = `${BASE}/api/heartbeat`;

async function sendHeartbeat() {
  try {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pcId: PC_ID }),
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    console.log(new Date().toISOString(), "– heartbeat sent");
  } catch (err) {
    console.error("Heartbeat error:", err.message);
  }
}

sendHeartbeat();
setInterval(sendHeartbeat, 5000);
