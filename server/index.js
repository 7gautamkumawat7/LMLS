import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientBuildPath = path.resolve(__dirname, '../dist');

const app = express();
app.use(cors());
app.use(express.json());

if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
}

const PORT = process.env.PORT || 5000;
const alerts = [];

// ==========================================
// TWILIO SMS CONFIGURATION
// ==========================================
let twilioClient = null;

try {
  if (process.env.TWILIO_SID && process.env.TWILIO_TOKEN) {
    const twilio = (await import('twilio')).default;
    twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    console.log('✅ Twilio configured');
  } else {
    console.log('⚠️ Twilio not configured - SMS will be mocked');
  }
} catch (e) {
  console.log('⚠️ Twilio not available - SMS will be mocked');
}

// ==========================================
// GEMINI AI CONFIGURATION
// ==========================================
const GEMINI_API_KEY = (
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_API_KEY ||
  process.env.GOOGLE_FREE_API_KEY ||
  process.env.FREE_GEMINI_API_KEY ||
  ''
)
  .trim()
  .replace(/^['"]|['"]$/g, '');

let genAI = null;

try {
  if (GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const source = process.env.GEMINI_API_KEY ? 'GEMINI_API_KEY' : process.env.GOOGLE_API_KEY ? 'GOOGLE_API_KEY' : 'GOOGLE_FREE_API_KEY';
    console.log(`✅ Gemini AI configured using ${source}`);
  } else {
    console.log('⚠️ Google Gemini API key not found - AI will use mock responses');
  }
} catch (e) {
  console.log('⚠️ Gemini not available - using mock responses');
}

// ==========================================
// SOS ENDPOINT
// ==========================================
app.post('/api/sos', async (req, res) => {
  const { locationUrl, latitude, longitude } = req.body;
  
  console.log(`\n🚨 SOS ALERT RECEIVED`);
  console.log(`📍 Location: ${locationUrl}`);
  console.log(`⏰ Time: ${new Date().toISOString()}`);

  const alertDocument = {
    id: `${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    type: 'SOS',
    locationUrl,
    latitude,
    longitude,
    smsSent: false,
    createdAt: new Date()
  };

  alerts.unshift(alertDocument);
  if (alerts.length > 20) {
    alerts.pop();
  }

  let smsResult = null;
  if (twilioClient) {
    try {
      await twilioClient.messages.create({
        body: `🚨 LIFESAVER EMERGENCY ALERT\n\nSomeone needs immediate help!\n📍 Location: ${locationUrl}\n⏰ Time: ${new Date().toLocaleString()}\n\nPlease respond immediately!`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: process.env.EMERGENCY_CONTACT_NUMBER
      });
      alertDocument.smsSent = true;
      smsResult = { success: true, message: 'SMS sent' };
      console.log('✅ SMS sent successfully');
    } catch (error) {
      console.error('❌ SMS Error:', error.message);
      smsResult = { success: false, message: 'SMS failed' };
    }
  } else {
    smsResult = { success: true, mocked: true, message: 'SOS logged (mock mode)' };
  }

  return res.json({
    success: smsResult.success,
    mocked: smsResult.mocked || false,
    message: smsResult.message,
    locationUrl,
    alert: {
      id: alertDocument._id?.toString(),
      latitude,
      longitude,
      locationUrl,
      smsSent: alertDocument.smsSent,
      createdAt: alertDocument.createdAt
    }
  });
});

// ==========================================
// AI TRIAGE ENDPOINT
// ==========================================
app.post('/api/triage', async (req, res) => {
  const { message } = req.body;
  
  console.log(`\n🤖 Triage Request: "${message}"`);

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const systemPrompt = `You are a first-aid responder bot for an emergency app called LifeSaver. 
      
RULES:
1. Provide exactly 3 short bullet points of emergency action
2. NEVER diagnose conditions
3. ALWAYS tell them to call 911 or local emergency number
4. Keep responses concise and actionable
5. Start with "🚨 Call 911 if this is life-threatening."
6. Use clear, simple language
7. Do NOT provide medical advice beyond basic first aid

Format your response with bullet points using • symbols.`;

      const result = await model.generateContent(`${systemPrompt}\n\nUser's situation: ${message}`);
      const response = result.response.text();
      
      console.log('✅ AI Response generated');
      return res.json({ response, source: 'gemini' });
    } catch (error) {
      console.error('❌ AI Error:', error.message);
    }
  }

  // Mock responses
  const mockResponses = getMockResponse(message);
  res.json({ response: mockResponses, source: 'mock' });
});

function getMockResponse(message) {
  const lower = message.toLowerCase();
  
  if (lower.includes('cut') || lower.includes('bleed') || lower.includes('wound')) {
    return `🚨 **Call 911 if bleeding is severe or won't stop.**\n\n• Apply firm, direct pressure with a clean cloth or bandage\n• Elevate the wounded area above heart level if possible\n• Do NOT remove soaked cloth — add more layers on top and maintain pressure`;
  }
  if (lower.includes('burn')) {
    return `🚨 **Call 911 if burn is larger than 3 inches or on face/hands/joints.**\n\n• Cool the burn under cool running water for 10-15 minutes\n• Cover loosely with a sterile, non-stick bandage or clean cloth\n• Do NOT apply ice, butter, toothpaste, or ointments`;
  }
  if (lower.includes('chest') || lower.includes('heart') || lower.includes('cardiac')) {
    return `🚨 **CALL 911 IMMEDIATELY — Chest pain is a medical emergency.**\n\n• Have the person sit down and rest. Loosen tight clothing.\n• If available and not allergic, have them chew 1 adult aspirin (325mg)\n• If unconscious: begin CPR — push hard & fast (100-120/min) in center of chest`;
  }
  if (lower.includes('chok')) {
    return `🚨 **Call 911 if the person cannot breathe, speak, or cough forcefully.**\n\n• Give 5 firm back blows between the shoulder blades\n• Follow with 5 abdominal thrusts (Heimlich maneuver)\n• Continue alternating until object is expelled or person becomes unconscious`;
  }
  if (lower.includes('allerg') || lower.includes('swelling') || lower.includes('anaphyl')) {
    return `🚨 **Call 911 if there's difficulty breathing, throat swelling, or dizziness.**\n\n• If the person has an epinephrine auto-injector (EpiPen), help them use it\n• Have them lie down with legs elevated. Do NOT let them stand suddenly.\n• If they stop breathing, begin CPR immediately`;
  }
  if (lower.includes('head') || lower.includes('concussion') || lower.includes('hit head')) {
    return `🚨 **Call 911 if there's loss of consciousness, vomiting, or confusion.**\n\n• Keep the person still and calm. Do NOT move them if neck injury is suspected.\n• Apply a cold pack wrapped in cloth to the injured area for 20 minutes\n• Monitor for worsening symptoms: dilated pupils, drowsiness, severe headache`;
  }
  
  return `🚨 **If this is a life-threatening emergency, call 911 immediately.**\n\n• Stay calm and ensure the scene is safe for you and the victim\n• Do NOT move the person unless they are in immediate danger\n• Wait for emergency services and follow their instructions by phone`;
}

// ==========================================
// ALERT HISTORY ENDPOINT
// ==========================================
app.get('/api/alerts', (req, res) => {
  return res.json({
    alerts: alerts.map((alert) => ({
      id: alert.id,
      latitude: alert.latitude,
      longitude: alert.longitude,
      locationUrl: alert.locationUrl,
      smsSent: alert.smsSent,
      createdAt: alert.createdAt
    }))
  });
});

// ==========================================
// HEALTH CHECK
// ==========================================
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    services: {
      twilio: !!twilioClient,
      gemini: !!genAI,
      alerts: alerts.length
    }
  });
});

// ==========================================
// START SERVER
// ==========================================
app.listen(PORT, () => {
  console.log(`\n🚀 LifeSaver Server running on http://localhost:${PORT}`);
  console.log(`📋 Endpoints:`);
  console.log(`   POST /api/sos     - Trigger emergency SMS`);
  console.log(`   POST /api/triage  - AI first-aid assistant`);
  console.log(`   GET  /api/health  - Server health check\n`);
});