Pattichis Project — Dev Setup

Monorepo with a Python FastAPI backend and a React Native (Expo) mobile app.

pattichis-project/
├─ backend/ # FastAPI app
└─ mobile/ # Expo app (Intro → Tabs)

Prerequisites

Python 3.11

Node.js LTS (includes npm)

(Optional) Android Studio for an Android emulator

(Optional) Expo Go app on your phone (for on-device testing)

(Optional) XAMPP Apache/MySQL if you’re also running the PHP ms-api endpoints used by the mobile app

1. Backend (FastAPI)
   Create & activate a virtual environment, install deps, run server

# From repo root

cd backend

# Create a local venv (recommended name: .venv so it's ignored by git)

python -m venv .venv

# Activate it

# Windows (PowerShell):

.venv\Scripts\Activate.ps1

# Windows (cmd):

.venv\Scripts\activate.bat

# macOS/Linux:

# source .venv/bin/activate

# Install requirements

pip install --upgrade pip
pip install -r requirements.txt

# Create .env (if not present)

# APP_ENV is optional; used just as an example flag

# Windows:

copy .env.example .env

# macOS/Linux:

# cp .env.example .env

# Run the API (auto-reload)

uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

Health check:
Open http://127.0.0.1:8000/healthz
— you should see:

{"status":"ok","version":"0.1.0","uptime":...}

Tip: stop the server with Ctrl+C. Deactivate the venv with deactivate.

2. Mobile (Expo / React Native)
   Install dependencies

# From repo root

cd mobile

# Install node dependencies

npm install

# (If you’ve never installed these on this machine, run once)

npm i @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-paper
npx expo install react-native-screens react-native-safe-area-context

Configure API base URL

The mobile app fetches data from a backend/API. By default we use PC web development settings.

Edit mobile/lib/api.ts:

// For web development on this PC:
const BASE = "http://localhost/ms-api"; // <- if you also run your PHP ms-api on XAMPP

// If testing on a physical phone via Expo Go later, change to your PC's LAN IP, e.g.:
// const BASE = "http://192.168.0.14/ms-api";

If you’re only testing the FastAPI /healthz and not the PHP endpoints, you can temporarily point to http://127.0.0.1:8000 and consume that instead.

Run the app (choose one)

A) Web (easiest, runs in your browser)

npm run web

# or

npx expo start # then press "w"

This opens http://localhost:19006.
You should see the Intro screen → “Get Started” → bottom tabs (Home, History, Log, Profile).

B) Android emulator (if installed)

npx expo start # then press "a"

C) Physical device (Expo Go)

Ensure PC and phone are on the same Wi-Fi.

In lib/api.ts set:

const BASE = "http://<your-pc-lan-ip>/ms-api";

Start Expo:

npx expo start

Scan the QR code with Expo Go.

3. Common scripts & tips

From mobile/:

npm start # expo start (choose web/android/ios in the CLI)
npm run web # open in the browser
npx expo start -c # clear Metro bundler cache (use if images/paths get weird)

From backend/:

uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

From backend/src:

Assuming xampp is under C drive otherwise change the path of the following command:
"C:\xampp\php\php.exe" -S 0.0.0.0:8080
