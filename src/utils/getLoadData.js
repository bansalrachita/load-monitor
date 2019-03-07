const getLoadData = async (setData, setError) => {
  try {
    const response = await fetch('/api/cpu?duration=600000&interval=10000', {
      method: 'GET'
    });
    if (!response.ok) {
      throw new Error('Error in receiving data from the server.');
    }

    const data = await response.json();

    if (data && Array.isArray(data.data)) {
      // set the data array in the state.
      setData(data.data);
    }
  } catch (e) {
    // set the error in the state.
    setError({ message: e.message });
  }
};
export default getLoadData;
