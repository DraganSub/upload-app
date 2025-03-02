export async function fetchImages(userId: string) {
  const response = await fetch("/api/fetchImages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });

  const data = await response.json();
  return data;
} 