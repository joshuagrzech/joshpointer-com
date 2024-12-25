export async function fetchConfig() {
  const response = await import("../../public/config.json");
  if (!response) {
    throw new Error("Failed to fetch config");
  }
  return response;
}
