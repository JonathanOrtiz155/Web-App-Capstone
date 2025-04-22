import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { AlertTriangle, CheckCircle } from "lucide-react";

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
  "LX-15-18460-23",
];

// Your ngrok (or LAN) URL pointing at port 5000
const STATUS_URL =
  "https://98fa-2603-8000-cf01-26cc-437e-2c26-d244-622c.ngrok-free.app/api/status";

export default function MonitoringDashboard() {
  // Initialize all PCs as offline (false) until we fetch real data
  const [pcStatus, setPcStatus] = useState(
    computers.reduce((acc, pc) => ({ ...acc, [pc]: false }), {})
  );

  useEffect(() => {
    // Function to fetch the latest status map
    const getStatus = async () => {
      try {
        const res = await fetch(STATUS_URL);
        const data = await res.json();
        console.log("fetched status:", data);
        setPcStatus(data);
      } catch (err) {
        console.error("Failed to fetch PC status", err);
      }
    };

    // Fetch immediately, then every 5 seconds
    getStatus();
    const interval = setInterval(getStatus, 5000);
    return () => clearInterval(interval);
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
            <p
              className={`text-sm ${
                pcStatus[pc] ? "text-green-500" : "text-red-500"
              }`}
            >
              {pcStatus[pc] ? "Online" : "Offline"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
