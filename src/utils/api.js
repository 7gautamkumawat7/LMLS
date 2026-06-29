// API helper functions

export const sendSOS = async (latitude, longitude) => {
  const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
  
  try {
    const response = await fetch('/api/sos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locationUrl, latitude, longitude })
    });
    return await response.json();
  } catch (error) {
    console.log('SOS API not available - using mock mode');
    return { success: true, mocked: true, locationUrl };
  }
};

export const getTriageResponse = async (message) => {
  try {
    const response = await fetch('/api/triage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    return await response.json();
  } catch (error) {
    // Mock AI response for demo
    return getMockTriageResponse(message);
  }
};

const getMockTriageResponse = (message) => {
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes('cut') || lowerMsg.includes('bleed')) {
    return {
      response: `🚨 **Call 911 immediately if bleeding is severe.**\n\n• Apply firm, direct pressure with a clean cloth or bandage\n• Elevate the wounded area above heart level if possible\n• Do NOT remove the cloth if it soaks through — add more layers on top`
    };
  }
  if (lowerMsg.includes('burn')) {
    return {
      response: `🚨 **Call 911 if the burn is larger than 3 inches or on the face/hands.**\n\n• Cool the burn under cool (not cold) running water for 10 minutes\n• Cover loosely with a sterile, non-stick bandage\n• Do NOT apply ice, butter, or ointments`
    };
  }
  if (lowerMsg.includes('chest') || lowerMsg.includes('heart')) {
    return {
      response: `🚨 **CALL 911 IMMEDIATELY — This is a medical emergency.**\n\n• Have the person sit down, rest, and try to stay calm\n• If available, have them chew one adult aspirin (325mg)\n• If they become unresponsive, begin CPR — push hard and fast in the center of the chest`
    };
  }
  if (lowerMsg.includes('choking')) {
    return {
      response: `🚨 **Call 911 if the person cannot breathe, speak, or cough.**\n\n• Give 5 back blows between the shoulder blades\n• Follow with 5 abdominal thrusts (Heimlich maneuver)\n• Continue alternating until the object is dislodged`
    };
  }
  return {
    response: `🚨 **If this is a life-threatening emergency, call 911 immediately.**\n\n• Stay calm and assess the situation carefully\n• Do not move the person unless they are in immediate danger\n• Wait for emergency services and follow their phone instructions`
  };
};

export const getLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      // Mock location for demo
      resolve({ latitude: 40.7128, longitude: -74.0060 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => resolve({ latitude: 40.7128, longitude: -74.0060 }) // Fallback
    );
  });
};