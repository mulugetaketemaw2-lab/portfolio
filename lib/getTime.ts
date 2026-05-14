/**
 * Fetches the current UTC timestamp from a reliable server (Google)
 * to bypass local system clock issues during Cloudinary uploads.
 */
export async function getNetworkTimestamp(): Promise<number> {
  try {
    // Fetch from Google to get their server time from headers
    const res = await fetch("https://www.google.com", { 
      method: "HEAD",
      cache: "no-store" 
    });
    const serverDate = res.headers.get("date");
    if (serverDate) {
      return Math.floor(new Date(serverDate).getTime() / 1000);
    }
  } catch (error) {
    console.error("Failed to fetch network time, falling back to local time:", error);
  }
  // Fallback to local time if network fetch fails
  return Math.floor(Date.now() / 1000);
}
