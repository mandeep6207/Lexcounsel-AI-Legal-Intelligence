
  # Legal Intelligence AI - Powered Lawyer

This repository contains a React (Vite) frontend and a Flask backend for a small educational legal-intelligence demo.

## Prerequisites

- Node.js (>= 16) and npm
- Python 3.9 or newer

---

## Frontend (React + Vite)

1. From the repository root, install JS dependencies:

   ```bash
   npm install
   ```

2. Start the Vite dev server:

   ```bash
   npm run dev
   ```

3. Open the app at `http://localhost:5173` (Vite default).

Notes:
- `react` and `react-dom` are included in `dependencies` so `npm install` will install them automatically.

---

## Backend (Flask)

The backend is a small Flask app in the `backend/` folder and serves API endpoints on port `5000` by default.

1. Create and activate a Python virtual environment (Windows example):

   ```powershell
   cd backend
   python -m venv venv
   venv\Scripts\Activate
   pip install -r requirements.txt
   python app.py
   ```

2. The backend will run on `http://127.0.0.1:5000` and CORS is enabled for local development.

---

## Run both servers (local development)

Open two terminals:
- Terminal 1: start the backend (see steps above).
- Terminal 2 (repo root): `npm run dev` to start the frontend.

The frontend fetches APIs from `http://127.0.0.1:5000`, so ensure the backend is running.

---

## Troubleshooting

- If the frontend shows module errors for React, re-run `npm install react react-dom`.
- If Python packages fail to install, ensure you're using a compatible Python version and have pip available.
