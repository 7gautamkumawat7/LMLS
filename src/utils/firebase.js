// Remove Firebase and replace with server-based API access

export const createAlert = async (alertData) => {
  try {
    const response = await fetch('/api/sos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alertData)
    });
    const result = await response.json();
    return result.alert || { success: false, message: 'Unable to save alert', alert: null };
  } catch (error) {
    console.error('Failed to store alert on server:', error);
    return { success: false, message: 'Unable to save alert', alert: null };
  }
};

export const getAlerts = async () => {
  try {
    const response = await fetch('/api/alerts');
    const result = await response.json();
    return result.alerts || [];
  } catch (error) {
    console.error('Failed to fetch alerts from server:', error);
    return [];
  }
};