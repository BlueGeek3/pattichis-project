// For PC web dev:
const BASE = "http://localhost:3000/ms-api";
// For Android emulator: "http://10.0.2.2:3000/ms-api"
// For real phone on same Wi-Fi: "http://<PC-LAN-IP>:3000/ms-api"

async function apiGet<T>(path: string): Promise<T> {
  const r = await fetch(`${BASE}${path}`);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
async function apiPost<T>(path: string, body: any): Promise<T> {
  const r = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export const listSymptoms = () => apiGet<any[]>("/symptoms");
export const listHistory  = (u: string) => apiGet<any[]>(`/history?username=${encodeURIComponent(u)}`);
export const listLogDates = (u: string) => apiGet<string[]>(`/dates?username=${encodeURIComponent(u)}`);
export const createLog    = (p:{username:string;date:string;hours:number;painScore:number;symptomId:number;}) =>
  apiPost<{ok:boolean;id:number}>("/log", p);
export const createRating = (p:{username:string;date:string;rating:number;}) =>
  apiPost<{ok:boolean;daily_id:number}>("/rating", p);
