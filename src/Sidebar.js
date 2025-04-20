import React from 'react';
import './Sidebar.css'; // Optional CSS file for styling

function Sidebar() {
  return (
    <nav className="sidebar-container">
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#monitoring">Monitoring</a></li>
        <li><a href="#reports">Reports</a></li>
        <li><a href="#settings">Settings</a></li>
      </ul>
    </nav>
  );
}

export default Sidebar;
