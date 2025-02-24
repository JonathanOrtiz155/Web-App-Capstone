import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { AlertTriangle, CheckCircle } from "lucide-react";

const computers = Array.from({ length: 15 }, (_, i) => `PC-${i + 1}`);

export default function MonitoringDashboard() {
  const [pcStatus, setPcStatus] = useState(
    computers.reduce((acc, pc) => ({ ...acc, [pc]: true }), {})
  );

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("https://your-backend.com/api/status")
        .then((res) => res.json())
        .then((data) => setPcStatus(data))
        .catch((err) => console.error("Failed to fetch PC status", err));
    }, 5000);

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
            <p className={`text-sm ${pcStatus[pc] ? "text-green-500" : "text-red-500"}`}>
              {pcStatus[pc] ? "Online" : "Offline"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  console.log("Monitoring Dashboard Loaded!");

}