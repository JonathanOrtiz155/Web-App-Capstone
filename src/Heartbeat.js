import { useEffect } from 'react';

const HEARTBEAT_INTERVAL = 5000; // 5 seconds

function Heartbeat() {
  useEffect(() => {
    const sendHeartbeat = async () => {
      try {
        await fetch('https://8ce9-2603-8000-cf01-26cc-437e-2c26-d244-622c.ngrok-free.app/api/heartbeat', {
          method: 'POST',
          body: JSON.stringify({ pcId: 'gaming-pc-01' }),
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('Failed to send heartbeat', error);
      }
    };

    const interval = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return null;
}

export default Heartbeat;
