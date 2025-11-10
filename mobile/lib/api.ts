// mobile/lib/api.ts
import { Platform } from "react-native";

const PORT = 3000;

// 👇 Use your PC LAN IP for real device / Expo Go
// Run `ipconfig` and confirm; this was your value before:
const LAN_IP = "192.168.0.14";

const BASE =
  Platform.OS === "web"
    ? `http://localhost:${PORT}/ms-api`   // web in same machine
    : `http://${LAN_IP}:${PORT}/ms-api`;  // Expo Go / emulator

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
