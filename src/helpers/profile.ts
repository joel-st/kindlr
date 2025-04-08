/**
 * Profile utilities for processing and displaying Nostr user metadata (Kind 0)
 */

import { NostrEvent } from 'nostr-tools';
import { getColorFromString } from './colors';

/**
 * Interface representing user profile metadata (Kind 0)
 */
export interface ProfileMetadata {
  name?: string;
  display_name?: string;
  displayName?: string; // Some clients use this alternative format
  about?: string;
  picture?: string;
  banner?: string;
  website?: string;
  nip05?: string;
  lud16?: string;
  lud06?: string;
  deleted?: boolean;
  // Additional fields can be added as needed
  [key: string]: any;
}

/**
 * Parse profile metadata from a Kind 0 event or its content
 * @param input Either a NostrEvent object or the JSON content string
 * @returns Parsed profile metadata or empty object if parsing fails
 */
export function parseProfileMetadata(input: NostrEvent | string): ProfileMetadata {
  try {
    let content: string;
    
    // If input is an event, get its content field
    if (typeof input !== 'string') {
      if (input.kind !== 0) {
        console.warn('Attempting to parse non-Kind 0 event as profile metadata');
      }
      content = input.content;
    } else {
      content = input;
    }
    
    // Parse the JSON content
    return JSON.parse(content) as ProfileMetadata;
  } catch (e) {
    console.error('Failed to parse profile metadata:', e);
    return {};
  }
}

/**
 * Get display name with fallbacks
 * @param metadata Profile metadata object
 * @param pubkey Fallback pubkey to use if no name is available
 * @returns Best available display name
 */
export function getDisplayName(metadata: ProfileMetadata, pubkey?: string): string {
  // Check for display_name or displayName
  const displayName = metadata.display_name || metadata.displayName;
  
  // If display_name exists and is not empty, use it
  if (displayName && displayName.trim()) {
    return displayName.trim();
  }
  
  // Otherwise, use name if available
  if (metadata.name && metadata.name.trim()) {
    return metadata.name.trim();
  }
  
  // If we have a pubkey, format it
  if (pubkey) {
    return `anon#${pubkey.substring(0, 4)}`;
  }
  
  // Last resort fallback
  return 'Anon';
}

/**
 * Get profile picture URL or generate a color based on pubkey
 * @param metadata Profile metadata
 * @param pubkey User's public key for generating fallback color
 * @returns Object with URL (if available) and fallback color
 */
export function getProfilePicture(metadata: ProfileMetadata, pubkey: string) {
  return {
    url: metadata.picture || null,
    fallbackColor: getColorFromString(pubkey)
  };
}

/**
 * Get profile banner URL with fallback
 * @param metadata Profile metadata
 * @param pubkey User's public key for generating fallback color
 * @returns Object with URL (if available) and fallback color
 */
export function getProfileBanner(metadata: ProfileMetadata, pubkey: string) {
  return {
    url: metadata.banner || null,
    fallbackColor: getColorFromString(pubkey + 'banner')
  };
} 