import { useEffect } from 'react';

const HEARTBEAT_INTERVAL = 5000; // 5 seconds

function Heartbeat() {
  useEffect(() => {
    const sendHeartbeat = async () => {
      try {
        await fetch('https://747c-2603-8000-cf01-26cc-6c53-601e-4105-97de.ngrok-free.app/api/heartbeat', {
          method: 'POST',
          body: JSON.stringify({ pcId: 'N-6-20437-20A' }),
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
