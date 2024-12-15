export async function fetchConfig() {
  const response = await import("../../config.json");
  if (!response) {
    throw new Error("Failed to fetch config");
  }
  return response;
}
