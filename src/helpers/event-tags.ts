/**
 * Map of tag types to display names
 */
export const tagTypeLabels: Record<string, string> = {
  a: "Address",
  d: "Identifier",
  e: "Event",
  g: "Geohash",
  h: "Hashtag",
  i: "Identity",
  imeta: "Image/Media",
  k: "Kind",
  p: "Profile",
  q: "Query",
  r: "Reference",
  relay: "Relay",
  t: "Tag",
  title: "Title",
  description: "Description",
  image: "Image",
  previous: "Previous",
  proxy: "Proxy",
  client: "Client",
  alt: "Alternative"
};

/**
 * Get tag type label or use the tag type directly
 * @param tagType The tag type identifier
 * @returns The human-readable label for the tag type
 */
export function getTagLabel(tagType: string): string {
  return tagTypeLabels[tagType] || tagType;
} 