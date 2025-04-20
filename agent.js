// agent.js
import fetch from "node-fetch";

// Unique identifier for *this* PC:
const PC_ID = "N-6-20437-20A";  

// If you used ngrok, replace with your tunnel URL:
const BACKEND_URL = "https://2cd1-2603-8000-cf01-26cc-437e-2c26-d244-622c.ngrok-free.app/api/heartbeat";

async function sendHeartbeat() {
  try {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pcId: PC_ID }),
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    console.log(`${new Date().toISOString()} – heartbeat sent`);
  } catch (err) {
    console.error("Heartbeat error:", err.message);
  }
}

// Send immediately, then every 5 seconds
sendHeartbeat();
setInterval(sendHeartbeat, 5000);
