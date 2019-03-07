const getAlertData = async (setAlerts, setError) => {
  try {
    const response = await fetch('/api/alerts?duration=600000', {
      method: 'GET'
    });
    if (!response.ok) {
      setError('Error in receiving data from the server.');
    }

    const data = await response.json();

    if (data && Array.isArray(data.data)) {
      setAlerts(data.data);
    }
  } catch (e) {
    setError(e.message);
  }
};

export default getAlertData;
