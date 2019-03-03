// import 'whatwg-fetch'

export const getLoadData = async (setData) => {
    try {
        const response = await fetch("/api/cpu?duration=60000",{
            method: "GET"
        });
        if (!response.ok) {
            throw new Error("Error in receiving data from the server.");
        }

        const data = await response.json();

        if (data && Array.isArray(data.data)) {
            setData(data.data);
        }
    } catch (e) {
        throw new Error(e.message);
    }
};