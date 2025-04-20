import React, { useState, useEffect } from 'react';
import './Header.css'; // Optional CSS file for styling
import csuciLogo from "./csuci-logo.png"; // <-- Import your logo here

function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup timer on unmount
    return () => clearInterval(timer);
  }, []);

  // Format date/time as needed
  const formattedTime = currentTime.toLocaleTimeString();
  const formattedDate = currentTime.toLocaleDateString();

  return (
    <header className="header-container">
      <div className="logo-section">
        {/* Replace with your actual logo if desired */}
        <img src={csuciLogo} alt="CSUCI Logo" className="csuci-logo" /> 
        <h2 className="header-title">CSUCI Esports </h2>
      </div>
      <div className="datetime-section">
        <p>{formattedDate}</p>
        <p>{formattedTime}</p>
      </div>
    </header>
  );
}

export default Header;
