// mobile/lib/api.ts
import { Platform, NativeModules } from "react-native";
import Constants from "expo-constants";

const PORT = 3000;
const PORT2 = 8080;

/** Discover the dev machine host so Expo Go can reach your backend. */
function detectHost(): string {
  // Web: use current origin host
  if (Platform.OS === "web") {
    // @ts-ignore window is only on web
    const host = window?.location?.hostname || "localhost";
    return host;
  }

  // 1) Modern Expo config hints
  const ec: any = (Constants as any)?.expoConfig;
  const hostUri =
    ec?.hostUri ||
    // new manifest2 (SDK 49+)
    (Constants as any)?.manifest2?.extra?.expoGo?.developer?.hostUri ||
    // legacy manifest (older SDKs)
    (Constants as any)?.manifest?.debuggerHost;

  if (hostUri) {
    const host = String(hostUri).split(":")[0];
    if (host) return host;
  }

  // 2) React Native packager scriptURL (works on device + emulators)
  const scriptURL: string | undefined = NativeModules?.SourceCode?.scriptURL;
  if (scriptURL) {
    const m = scriptURL.match(/\/\/(.*?):\d+\//);
    if (m?.[1]) return m[1];
  }

  // 3) Emulators fallbacks
  if (Platform.OS === "android") return "10.0.2.2"; // Android emulator
  if (Platform.OS === "ios") return "localhost"; // iOS simulator

  // 4) Worst-case fallback
  return "localhost";
}

const HOST = detectHost();
// export const BASE = `http://${HOST}:${PORT}/ms-api`;
// export const USER_IP = `http://${HOST}:${PORT2}`;
export const BASE = "https://msdiary-node.loca.lt/ms-api";
export const USER_IP = "https://msdiary-php.loca.lt";

async function handle<T>(res: Response, path: string): Promise<T> {
  const text = await res.text();
  if (!res.ok) {
    try {
      const json = JSON.parse(text);
      throw new Error(json.error || `${res.status} on ${path}`);
    } catch {
      throw new Error(text || `${res.status} on ${path}`);
    }
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Invalid JSON from ${path}: ${text.slice(0, 160)}`);
  }
}

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  return handle<T>(res, path);
}

async function apiPost<T>(path: string, body: any): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handle<T>(res, path);
}

async function apiPut<T>(path: string, body: any): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handle<T>(res, path);
}

// ---- API helpers ----
export const getUser = (username: string) =>
  apiGet<any>(`/user?username=${encodeURIComponent(username)}`);

export const updateUser = (
  username: string,
  payload: {
    Email: string;
    MobileNumber: string;
    DateOfBirth: string;
    DoctorsEmail: string;
  }
) =>
  apiPut<{ ok: boolean }>(
    `/user?username=${encodeURIComponent(username)}`,
    payload
  );

export const listSymptoms = () => apiGet<any[]>("/symptoms");
export const listHistory = (u: string) =>
  apiGet<any[]>(`/history?username=${encodeURIComponent(u)}`);
export const listHistoryLastWeek = (u: string) =>
  apiGet<any[]>(`/history/last-week?username=${encodeURIComponent(u)}`);

export const listLogDates = (u: string) =>
  apiGet<string[]>(`/dates?username=${encodeURIComponent(u)}`);
export const createLog = (p: {
  username: string;
  date: string;
  hours: number;
  painScore: number;
  symptomId: number;
}) => apiPost<{ ok: boolean; id: number }>("/log", p);
export const createRating = (p: {
  username: string;
  date: string;
  rating: number;
}) => apiPost<{ ok: boolean; daily_id: number }>("/rating", p);
export const createBloodPressure = (p: {
  username: string;
  systolic: string;
  diastolic: string;
  date: string; // yyyy-mm-dd
}) =>
  apiPost<{ message: string; insertId: number | null }>("/bloodpressure", p);
