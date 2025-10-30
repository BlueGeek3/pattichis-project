// For WEB on your PC, use localhost.
// (When you move to phone later, change to http://YOUR-PC-IP/ms-api)
const BASE = "http://localhost/ms-api";

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

export const listSymptoms = () => apiGet<any[]>("/symptoms.php");
export const listHistory  = (u: string) => apiGet<any[]>(`/history.php?username=${encodeURIComponent(u)}`);
export const listLogDates = (u: string) => apiGet<string[]>(`/dates_with_logs.php?username=${encodeURIComponent(u)}`);
export const createLog    = (p:{username:string;date:string;hours:number;painScore:number;symptomId:number;}) =>
  apiPost<{ok:boolean;id:number}>("/log_create.php", p);
export const createRating = (p:{username:string;date:string;rating:number;}) =>
  apiPost<{ok:boolean;daily_id:number}>("/rating_create.php", p);
