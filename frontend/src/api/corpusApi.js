const BASE_URL = "http://127.0.0.1:8000";

export async function getLanguages() {
  const res = await fetch(`${BASE_URL}/languages`);
  return res.json();
}

export async function getCategories() {
  const res = await fetch(`${BASE_URL}/categories`);
  return res.json();
}

export async function searchCorpus(query) {
  const res = await fetch(
    `${BASE_URL}/search?q=${encodeURIComponent(query)}`
  );
  return res.json();
}

export async function getRecord(id) {
  const res = await fetch(`${BASE_URL}/records/${id}`);
  return res.json();
}