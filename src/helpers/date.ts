/**
 * Date formatting utility functions.
 * Provides helper functions to format dates in user-friendly ways.
 */

/**
 * Formats a Unix timestamp into a relative time string (e.g., "2 hours ago", "3 days ago")
 * For timestamps older than a week, returns a localized date string.
 * 
 * @param timestamp - Unix timestamp in seconds
 * @returns Formatted date string
 */
export function formatTimeAgo(timestamp: number): string {
  const now = new Date();
  const commentDate = new Date(timestamp * 1000);
  const diffInSeconds = Math.floor(
    (now.getTime() - commentDate.getTime()) / 1000,
  );

  // For recent times, use relative format
  if (diffInSeconds < 60 * 60 * 24 * 7) {
    // Less than a week old
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    if (diffInSeconds < 60) {
      return rtf.format(-Math.floor(diffInSeconds), "second");
    } else if (diffInSeconds < 60 * 60) {
      return rtf.format(-Math.floor(diffInSeconds / 60), "minute");
    } else if (diffInSeconds < 60 * 60 * 24) {
      return rtf.format(-Math.floor(diffInSeconds / (60 * 60)), "hour");
    } else {
      return rtf.format(-Math.floor(diffInSeconds / (60 * 60 * 24)), "day");
    }
  }

  // For older dates, use a more compact format
  return commentDate.toLocaleDateString();
}
