import { useEffect, useState } from 'react';
import { getLoadData } from '../utils';

// fetches utilization from the monitoring service every 10 seconds.
const fetchLoad = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    // interval at which data is fetch from the server.
    const duration = 10000;
    // set the data/error from the server.
    const getLoad = () => getLoadData(setData, setError);
    // poll it on mount.
    getLoad();
    // poll data every 5 seconds.
    const interval = setInterval(() => getLoad(), duration);

    // clean up function that is returned from the useeffect hook. Run on unmount.
    return () => clearInterval(interval);
  }, []);

  return { data, error };
};

export default fetchLoad;
