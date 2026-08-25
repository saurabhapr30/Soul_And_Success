# Soul And Success - Local Development Setup

The application works through a **Single-URL Architecture** in development. 
ONE NGROK URL serves the website and proxies API requests to the Express backend.

You will need 3 terminal windows.

### Terminal 1: Frontend
```bash
npm run dev:frontend
```
**URL:** `http://localhost:5173`

### Terminal 2: Backend
```bash
npm run dev:backend
```
**URL:** `http://localhost:5000`

### Terminal 3: Public tunnel (ngrok)
Purpose: Public website access & Razorpay Webhooks.
```bash
ngrok http 127.0.0.1:5173
```
**Public URL:** `https://<random-id>.ngrok-free.dev`

---

### How it works
When you visit the public ngrok URL, the traffic goes to the Vite development server (port 5173). 
Vite serves the React frontend for all normal routes (`/`, `/about`, etc.).
Any request starting with `/api` (including Razorpay webhooks sent to `/api/v1/payments/webhook`) is automatically proxied by Vite to the Express backend running on `127.0.0.1:5000`.

This means you only ever need **one** ngrok tunnel!
