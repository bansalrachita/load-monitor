const getAlertData = async setAlerts => {
  try {
    const response = await fetch('/api/alerts?duration=600000', {
      method: 'GET'
    });
    if (!response.ok) {
      throw new Error('Error in receiving data from the server.');
    }

    const data = await response.json();

    if (data && Array.isArray(data.data)) {
      setAlerts(data.data);
    }
  } catch (e) {
    throw new Error(e.message);
  }
};

export default getAlertData;
