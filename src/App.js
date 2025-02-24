import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Heartbeat from "./Heartbeat"; // Import Heartbeat component
import MonitoringDashboard from "./MonitoringDashboard"; // Import Monitor Dashboard with correct casing

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Gaming PC Monitoring System</h1>
      </header>
      <Heartbeat /> {/* Keeps the heartbeat system */}
      <MonitoringDashboard /> {/* Displays the PC monitoring dashboard */}
    </div>
  );
}

export default App;
