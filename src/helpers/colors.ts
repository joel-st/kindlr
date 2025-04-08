/**
 * Color utility functions
 * Used for generating consistent colors from pubkeys and other identifiers
 */

/**
 * Generates a deterministic HSL color based on a string (typically a pubkey hex)
 * @param str The string to generate a color from (usually a hex pubkey)
 * @returns A CSS HSL color string
 */
export function getColorFromString(str: string): string {
  // Create a consistent hash from the string
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Convert hash to a hue value (0-360)
  const hue = hash % 360;
  
  // Use fixed saturation and lightness values for good visibility
  return `hsl(${hue}, 70%, 60%)`;
}

/**
 * Get contrasting text color (black or white) for a given background color
 * @param hslColor The HSL color string
 * @returns Either "white" or "black" depending on the background
 */
export function getContrastTextColor(hslColor: string): string {
  // Extract lightness from the HSL string
  const matches = hslColor.match(/hsl\(\d+,\s*\d+%,\s*(\d+)%\)/);
  if (!matches || matches.length < 2) return "black";
  
  const lightness = parseInt(matches[1], 10);
  
  // Darker backgrounds need white text, lighter ones need black text
  return lightness < 50 ? "white" : "black";
} 