/**
 * Helper functions for processing text and finding/converting links
 */

/**
 * Regular expression to match HTTP URLs in text
 * Matches common URL formats with or without protocol
 */
const HTTP_URL_REGEX = /(?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

/**
 * Regular expression to match NIP-19 entities directly
 * Format: <entity_type>1<base-bech32-data>
 * Entities: npub, nsec, note, nprofile, nevent, naddr, nrelay
 */
const NIP19_ENTITY_REGEX = /\b(?:npub|nsec|note|nprofile|nevent|naddr|nrelay)1[a-zA-Z0-9]+\b/gi;

/**
 * Regular expression to match Nostr NIP-21 URI schemes
 * Format: nostr:<nip19-entity>
 */
const NOSTR_URI_REGEX = /nostr:(?:(?:npub|nsec|note|nprofile|nevent|naddr|nrelay)1[a-zA-Z0-9]+)/gi;

/**
 * Convert plain text URLs, NIP-19 entities, and Nostr URIs into HTML anchor tags
 * @param text The text to process
 * @param className Optional CSS class to add to the links
 * @returns HTML string with links converted
 */
export function linkifyText(text: string, className?: string): string {
  if (!text) return '';
  
  // Create a placeholder for each match to avoid processing conflicts
  let matches: {type: 'http' | 'nostr' | 'entity', match: string, index: number, length: number}[] = [];
  
  // Find HTTP URLs
  let httpMatch: RegExpExecArray | null;
  const httpRegex = new RegExp(HTTP_URL_REGEX);
  while ((httpMatch = httpRegex.exec(text)) !== null) {
    matches.push({
      type: 'http',
      match: httpMatch[0],
      index: httpMatch.index,
      length: httpMatch[0].length
    });
  }
  
  // Find Nostr URIs (must be done before NIP-19 entities to avoid conflicts)
  let nostrMatch: RegExpExecArray | null;
  const nostrRegex = new RegExp(NOSTR_URI_REGEX);
  while ((nostrMatch = nostrRegex.exec(text)) !== null) {
    matches.push({
      type: 'nostr',
      match: nostrMatch[0],
      index: nostrMatch.index,
      length: nostrMatch[0].length
    });
  }
  
  // Find raw NIP-19 entities
  let entityMatch: RegExpExecArray | null;
  const entityRegex = new RegExp(NIP19_ENTITY_REGEX);
  while ((entityMatch = entityRegex.exec(text)) !== null) {
    // Check if this entity is already part of a nostr: URI
    const isPartOfNostrUri = matches.some(m => 
      m.type === 'nostr' && 
      entityMatch!.index >= m.index && 
      entityMatch!.index + entityMatch![0].length <= m.index + m.length
    );
    
    if (!isPartOfNostrUri) {
      matches.push({
        type: 'entity',
        match: entityMatch[0],
        index: entityMatch.index,
        length: entityMatch[0].length
      });
    }
  }
  
  // Sort matches by index (to process them in order)
  matches.sort((a, b) => a.index - b.index);
  
  // Replace each match with appropriate HTML
  let result = '';
  let lastIndex = 0;
  
  for (const m of matches) {
    // Add text before the match
    if (m.index > lastIndex) {
      result += text.substring(lastIndex, m.index);
    }
    
    const classAttr = className ? ` class="${className}"` : '';
    
    // Add the linked version of the match
    if (m.type === 'http') {
      const url = m.match;
      const href = url.startsWith('http') ? url : `https://${url}`;
      result += `<a href="${href}" target="_blank" rel="noopener noreferrer"${classAttr}>${url}</a>`;
    } 
    else if (m.type === 'nostr') {
      // Nostr URI - use as is
      result += `<a href="${m.match}" target="_blank" rel="noopener noreferrer"${classAttr}>${m.match}</a>`;
    }
    else if (m.type === 'entity') {
      // NIP-19 entity - convert to NIP-21 URI
      const href = `nostr:${m.match}`;
      result += `<a href="${href}" target="_blank" rel="noopener noreferrer"${classAttr}>${m.match}</a>`;
    }
    
    lastIndex = m.index + m.length;
  }
  
  // Add any remaining text
  if (lastIndex < text.length) {
    result += text.substring(lastIndex);
  }
  
  return result;
}

/**
 * Create a SolidJS-compatible element with linkified text
 * @param text The text to process
 * @param className Optional CSS class to add to the links
 * @returns A SolidJS element with properly linkified content
 */
export function createLinkifiedElement(text: string, className?: string, containerClassName?: string): HTMLDivElement {
  const linkified = linkifyText(text, className);
  const div = document.createElement('div');
  if (containerClassName) {
    div.className = containerClassName;
  }
  div.innerHTML = linkified;
  return div;
}

/**
 * Create props for a SolidJS element to safely render linkified text
 * @param text The text to process
 * @param className Optional CSS class to add to the links
 * @returns Props object with innerHTML set to linkified text
 */
export function createLinkifiedProps(text: string, className?: string): { innerHTML: string } {
  return {
    innerHTML: linkifyText(text, className)
  };
} 