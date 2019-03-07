import { useEffect, useState } from 'react';
import { getAlertData } from '../utils';

const fetchAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);
  const duration = 10000;

  useEffect(() => {
    setError();

    const getAlerts = () => getAlertData(setAlerts, setError);

    getAlerts();
    // poll data every 5 seconds.
    const interval = setInterval(() => getAlerts(), duration);

    return () => clearInterval(interval);
  }, []);

  return { alerts, error };
};

export default fetchAlerts;
