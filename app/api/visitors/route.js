import { createHash } from "node:crypto";

export const runtime = "nodejs";

if (!globalThis.__washFixDailyVisitors) {
  globalThis.__washFixDailyVisitors = {
    dateKey: "",
    ips: new Set(),
  };
}

function getChennaiDateKey() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function getVisitorHash(request) {
  const forwarded = request.headers.get("x-forwarded-for") || "";
  const realIp = request.headers.get("x-real-ip") || "";
  const ip = forwarded.split(",")[0].trim() || realIp || "unknown";
  return createHash("sha256").update(`${ip}|washfix-visitor`).digest("hex");
}

async function updateRedisCount(key, visitorHash) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const headers = { Authorization: `Bearer ${token}` };

  await fetch(`${url}/sadd/${encodeURIComponent(key)}/${encodeURIComponent(visitorHash)}`, { headers, cache: "no-store" });
  await fetch(`${url}/expire/${encodeURIComponent(key)}/172800`, { headers, cache: "no-store" });

  const countResponse = await fetch(`${url}/scard/${encodeURIComponent(key)}`, { headers, cache: "no-store" });
  if (!countResponse.ok) return null;

  const data = await countResponse.json();
  return typeof data.result === "number" ? data.result : Number(data.result);
}

export async function GET() {
  return new Response("Not Found", { status: 404 });
}
