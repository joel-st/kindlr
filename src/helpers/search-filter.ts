/**
 * Search filter utility for filtering Nostr events and kinds.
 * Provides functions to parse search queries and filter events based on specified criteria.
 */

import { NostrEvent } from "nostr-tools";

/**
 * Represents a parsed search query with multiple criteria.
 */
interface SearchCriteria {
  kind?: number[];
  content?: string;
  contentIsJson?: boolean;
  contentIsNotJson?: boolean;
  tags?: string;
  pubkey?: string;
  general?: string;
}

/**
 * Parse a search query string into structured search criteria.
 * 
 * Supports various search syntaxes:
 * - k=1,3,4        - Filter by kind numbers
 * - content:text   - Filter by content containing text
 * - content=json   - Filter for JSON content
 * - content!=json  - Filter for non-JSON content
 * - tags:tagname   - Filter by tags containing tagname
 * - pubkey:key     - Filter by pubkey
 * - anything else  - General search across all fields
 * 
 * @param query - The search query string
 * @returns Parsed search criteria
 */
export function parseSearchQuery(query: string): SearchCriteria {
  const criteria: SearchCriteria = {};
  const trimmedQuery = query.trim();
  
  if (!trimmedQuery) {
    return criteria;
  }
  
  // Check for kind filter: k=1,2,3
  const kindMatch = trimmedQuery.match(/\bk=([0-9,]+)\b/);
  if (kindMatch) {
    criteria.kind = kindMatch[1].split(',').map(k => parseInt(k.trim(), 10));
  }
  
  // Check for content=json
  if (trimmedQuery.toLowerCase().includes('content=json')) {
    criteria.contentIsJson = true;
  } 
  // Check for content!=json
  else if (trimmedQuery.toLowerCase().includes('content!=json')) {
    criteria.contentIsNotJson = true;
  }
  // Check for content:text
  else {
    const contentMatch = trimmedQuery.match(/\bcontent:([^\s]+)/);
    if (contentMatch) {
      criteria.content = contentMatch[1];
    }
  }
  
  // Check for tags:tagname
  const tagsMatch = trimmedQuery.match(/\btags:([^\s]+)/);
  if (tagsMatch) {
    criteria.tags = tagsMatch[1];
  }
  
  // Check for pubkey:key
  const pubkeyMatch = trimmedQuery.match(/\bpubkey:([^\s]+)/);
  if (pubkeyMatch) {
    criteria.pubkey = pubkeyMatch[1];
  }
  
  // If no specific criteria matched or there's text outside of specific criteria,
  // use it as a general search term
  const specificMatchers = [
    /\bk=[0-9,]+\b/, 
    /\bcontent=json\b/,
    /\bcontent!=json\b/, 
    /\bcontent:[^\s]+/, 
    /\btags:[^\s]+/, 
    /\bpubkey:[^\s]+/
  ];
  
  let remainingQuery = trimmedQuery;
  specificMatchers.forEach(matcher => {
    remainingQuery = remainingQuery.replace(matcher, '');
  });
  
  remainingQuery = remainingQuery.trim();
  if (remainingQuery) {
    criteria.general = remainingQuery;
  }
  
  return criteria;
}

/**
 * Filter a kind definition based on search criteria.
 * 
 * @param kind - The kind definition to filter
 * @param criteria - Search criteria to apply
 * @param events - Optional list of events of this kind to check
 * @returns True if the kind matches the criteria
 */
export function filterKind(
  kind: { kind: number; name: string; description: string; short_description: string }, 
  criteria: SearchCriteria,
  events?: NostrEvent[]
): boolean {
  // If no criteria, show all
  if (Object.keys(criteria).length === 0) {
    return true;
  }
  
  // Filter by kind
  if (criteria.kind && criteria.kind.length > 0) {
    if (!criteria.kind.includes(kind.kind)) {
      return false;
    }
    // If only filtering by kind and it matches, no need to check events
    if (Object.keys(criteria).length === 1) {
      return true;
    }
  }
  
  // For criteria that need to check events, we need to have events
  if (!events || events.length === 0) {
    // If only filtering by kind description/name
    return matchesKindMetadata(kind, criteria);
  }
  
  // Check if any of the events match the criteria
  return events.some(event => filterEvent(event, criteria)) || 
         matchesKindMetadata(kind, criteria);
}

/**
 * Check if a kind's metadata (name, description) matches general search criteria
 * 
 * @param kind - The kind definition
 * @param criteria - Search criteria to check
 * @returns True if the kind matches general criteria
 */
function matchesKindMetadata(
  kind: { kind: number; name: string; description: string; short_description: string },
  criteria: SearchCriteria
): boolean {
  if (!criteria.general) {
    return false;
  }
  
  const searchTerm = criteria.general.toLowerCase();
  
  return (
    kind.name.toLowerCase().includes(searchTerm) ||
    kind.description.toLowerCase().includes(searchTerm) ||
    kind.short_description.toLowerCase().includes(searchTerm) ||
    `kind${kind.kind}`.includes(searchTerm) ||
    `${kind.kind}`.includes(searchTerm)
  );
}

/**
 * Filter a Nostr event based on search criteria.
 * 
 * @param event - The Nostr event to filter
 * @param criteria - Search criteria to apply
 * @returns True if the event matches the criteria
 */
export function filterEvent(event: NostrEvent, criteria: SearchCriteria): boolean {
  // If no criteria, show all
  if (Object.keys(criteria).length === 0) {
    return true;
  }
  
  // Filter by kind
  if (criteria.kind && criteria.kind.length > 0) {
    if (!criteria.kind.includes(event.kind)) {
      return false;
    }
  }
  
  // Filter by content
  if (criteria.content) {
    if (!event.content || !event.content.toLowerCase().includes(criteria.content.toLowerCase())) {
      return false;
    }
  }
  
  // Filter by JSON content
  if (criteria.contentIsJson) {
    // Ensure we have content and it's valid JSON with at least one property
    if (!event.content || !isValidJsonContent(event.content)) {
      return false;
    }
  }
  
  // Filter by non-JSON content
  if (criteria.contentIsNotJson) {
    // Return true if content is not valid JSON
    if (!event.content || isValidJsonContent(event.content)) {
      return false;
    }
  }
  
  // Filter by tags
  if (criteria.tags) {
    const tagText = JSON.stringify(event.tags || []).toLowerCase();
    if (!tagText.includes(criteria.tags.toLowerCase())) {
      return false;
    }
  }
  
  // Filter by pubkey
  if (criteria.pubkey) {
    if (!event.pubkey || !event.pubkey.toLowerCase().includes(criteria.pubkey.toLowerCase())) {
      return false;
    }
  }
  
  // General search across multiple fields
  if (criteria.general) {
    const generalSearch = criteria.general.toLowerCase();
    
    // Convert the entire event to a string for searching
    const eventText = JSON.stringify({
      id: event.id,
      pubkey: event.pubkey,
      content: event.content,
      tags: event.tags,
      sig: event.sig
    }).toLowerCase();
    
    if (!eventText.includes(generalSearch)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Check if content is valid JSON with actual properties
 * This is a more strict version of isJsonContent that ensures the content
 * is not just "1" or empty or other simple values
 * 
 * @param content - The content to check
 * @returns True if the content is valid meaningful JSON
 */
function isValidJsonContent(content: string): boolean {
  if (!content) return false;
  
  try {
    // Try to parse the content as JSON
    const parsed = JSON.parse(content.trim());
    
    // Check if the parsed result is actually an object with properties or a non-empty array
    if (typeof parsed !== 'object' || parsed === null) {
      return false;
    }
    
    // Check if it has at least one property
    if (Array.isArray(parsed)) {
      return parsed.length > 0;
    } else {
      return Object.keys(parsed).length > 0;
    }
  } catch (e) {
    return false;
  }
}

/**
 * Check if an event collection has any events that match the search criteria
 * 
 * @param events - Collection of events to check
 * @param criteria - Search criteria to apply
 * @returns True if any event matches the criteria
 */
export function hasMatchingEvents(events: NostrEvent[], criteria: SearchCriteria): boolean {
  // If no criteria or no events, there's nothing to filter
  if (Object.keys(criteria).length === 0 || events.length === 0) {
    return true;
  }
  
  return events.some(event => filterEvent(event, criteria));
} 