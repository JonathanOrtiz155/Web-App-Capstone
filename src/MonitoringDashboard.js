import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { AlertTriangle, CheckCircle } from "lucide-react";

// Replace this with your ngrok HTTPS forwarding URL exactly, no trailing spaces:
const STATUS_URL = "/api/status";

console.log("STATUS_URL is:", STATUS_URL);

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

export default function MonitoringDashboard() {
  const [pcStatus, setPcStatus] = useState(
    computers.reduce((acc, pc) => ({ ...acc, [pc]: false }), {})
  );

  useEffect(() => {
    async function getStatus() {
      console.log("Fetching", STATUS_URL);
      try {
        const res = await fetch(STATUS_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log("fetched status:", data);
        setPcStatus(data);
      } catch (err) {
        console.error("Failed to fetch PC status:", err);
      }
    }
    getStatus();
    const iv = setInterval(getStatus, 5000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="p-6 grid grid-cols-3 gap-4">
      {computers.map((pc) => (
        <Card key={pc} className="p-4 flex items-center gap-4 shadow-lg">
          {pcStatus[pc] ? (
            <CheckCircle className="text-green-500" size={24} />
          ) : (
            <AlertTriangle className="text-red-500" size={24} />
          )}
          <CardContent>
            <h2 className="text-lg font-semibold">{pc}</h2>
            <p className={`text-sm ${pcStatus[pc] ? "text-green-500" : "text-red-500"}`}>
              {pcStatus[pc] ? "Online" : "Offline"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
