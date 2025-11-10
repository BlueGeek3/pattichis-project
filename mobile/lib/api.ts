// mobile/lib/api.ts
import { Platform } from "react-native";

/**
 * Shared API base URL for the whole app.
 *
 * - By default:
 *    Web (running on your PC):       http://localhost:3000/ms-api
 *    Native / Expo Go on device:     http://192.168.0.14:3000/ms-api
 *
 * - To customize per developer (recommended):
 *    Set in .env / app config:
 *      EXPO_PUBLIC_API_HOST_WEB   -> host for web (e.g. localhost)
 *      EXPO_PUBLIC_API_HOST       -> host for device/emulator (your PC LAN IP)
 *      EXPO_PUBLIC_API_PORT       -> port (default 3000)
 */

const FALLBACK_PORT = 3000;
const FALLBACK_WEB_HOST = "localhost";
// Put YOUR machine's LAN IP here as a fallback for Expo Go / emulator:
const FALLBACK_NATIVE_HOST = "192.168.0.14";

// Optional Expo envs (only if you configure them)
const ENV_PORT = Number(process.env.EXPO_PUBLIC_API_PORT || "");
const ENV_WEB_HOST = process.env.EXPO_PUBLIC_API_HOST_WEB;
const ENV_NATIVE_HOST = process.env.EXPO_PUBLIC_API_HOST;

// Final values
const PORT = ENV_PORT || FALLBACK_PORT;

const HOST =
  Platform.OS === "web"
    ? ENV_WEB_HOST || FALLBACK_WEB_HOST
    : ENV_NATIVE_HOST || FALLBACK_NATIVE_HOST;

export const BASE = `http://${HOST}:${PORT}/ms-api`;

// ---------- helpers ----------

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `GET ${path} failed with ${res.status}`);
  }
  return res.json();
}

async function apiPost<T>(path: string, body: any): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `POST ${path} failed with ${res.status}`);
  }
  return res.json();
}

// ---------- exported API calls ----------

export const listSymptoms = () =>
  apiGet<any[]>("/symptoms");

export const listHistory = (u: string) =>
  apiGet<any[]>(`/history?username=${encodeURIComponent(u)}`);

export const listLogDates = (u: string) =>
  apiGet<string[]>(`/dates?username=${encodeURIComponent(u)}`);

export const createLog = (p: {
  username: string;
  date: string;
  hours: number;
  painScore: number;
  symptomId: number;
}) =>
  apiPost<{ ok: boolean; id: number }>("/log", p);

export const createRating = (p: {
  username: string;
  date: string;
  rating: number;
}) =>
  apiPost<{ ok: boolean; daily_id: number }>("/rating", p);
