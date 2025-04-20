import React from "react";
import "./App.css";

import Header from "./Header";
import Sidebar from "./Sidebar";

import Heartbeat from "./Heartbeat";
import MonitoringDashboard from "./MonitoringDashboard";

function App() {
  return (
    <div className="App">
      {/* Top header with date/time */}
      <Header />

      {/* Main container: Sidebar + Dashboard */}
      <div className="main-content">
        <Sidebar />

        <div className="page-content">
          <Heartbeat />
          <MonitoringDashboard />
        </div>
      </div>
    </div>
  );
}

export default App;

