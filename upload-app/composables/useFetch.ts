import { ref } from "vue";

export function useFetchRequest() {
  const data = ref<null | any>(null);
  const error = ref<null | string>(null);

  const fetchData = async (
    url: string,
    method: string = "GET",
    body: any = null,
    headers: Record<string, string> = { "Content-Type": "application/json" }
  ) => {
    error.value = null;
    data.value = null;

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
      });

      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

      data.value = await response.json();
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An unknown error occurred";
    }

    return { data: data.value, error: error.value };
  };

  return { fetchData, data, error };
}