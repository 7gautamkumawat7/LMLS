<<<<<<< HEAD
# LifeSaver

A production-ready emergency response web app built with React, Vite, Express, and AI-enabled triage.

## Features

- SOS alert button with location sharing
- AI triage chat helper
- Mock emergency dispatch feed
- Voice trigger support (browser Speech Recognition)
- Fall detection demo support
- Static production build served by Express

## Setup

1. Install dependencies

```bash
npm install
cd server
npm install
```

2. Copy environment example

```bash
cp .env.example .env
```

3. Update your `.env` values:

- `PORT` - backend port
- `TWILIO_SID` - Twilio account SID
- `TWILIO_TOKEN` - Twilio auth token
- `TWILIO_PHONE_NUMBER` - SMS sender number
- `EMERGENCY_CONTACT_NUMBER` - destination number
- `GEMINI_API_KEY` - Google Generative AI key

4. Build the client

```bash
npm run build
```

5. Start the server

```bash
cd server
npm start
```

6. Open the app

Browse to `http://localhost:5000`

## Production Deployment

- Build the app with `npm run build`
- Serve the `dist/` output using the Express server or any static host
- Use `server/.env` for server-specific secrets in production

## Notes

- The app proxies client `/api` calls to the backend during local dev via Vite
- `server/index.js` serves built assets when `dist/` exists
- If Twilio is not configured, SMS is mocked for demo purposes
=======
# LMLS
LifeSaver – AI Emergency Response System Developed a full-stack emergency response web application using React.js, Node.js, Firebase, Tailwind CSS, and Google Gemini AI. The system enables one-tap SOS alerts with real-time geolocation, AI-powered first-aid guidance, voice-activated emergency triggers, fall detection, SMS notifications.
>>>>>>> 3fbd8ef6f30ef6b48f758a5dc64144e7792d18e6
