export function useLoading() {
  const isLoading = useState("isLoading", () => false);

  const startLoading = () => {
    isLoading.value = true;
  };

  const finishLoading = () => {
    isLoading.value = false;
  };

  return {
    isLoading,
    startLoading,
    finishLoading
  };
}