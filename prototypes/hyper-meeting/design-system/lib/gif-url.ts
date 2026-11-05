/**
 * Validates that a GIF URL is a remote http(s) URL.
 * This prevents base64/data: URLs from being stored in messages.
 */
export function isValidGifUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const isHttpProtocol =
      urlObj.protocol === "http:" || urlObj.protocol === "https:";
    const hasHostname = urlObj.hostname.length > 0;
    return isHttpProtocol && hasHostname;
  } catch {
    return false;
  }
}
