const BASE = "http://localhost:8080";

export const generateXml = async (payload) => {
  const res = await fetch(`${BASE}/xml/generate`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.blob();
};

export const previewXml = async (payload) => {
  const res = await fetch(`${BASE}/xml/preview`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.text();
};