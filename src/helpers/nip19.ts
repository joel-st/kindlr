/**
 * NIP-19 utility functions for encoding and decoding Nostr entities
 * Implementation based on the NIP-19 spec: https://github.com/nostr-protocol/nips/blob/master/19.md
 * Using nostr-tools library for implementation
 */

import { nip19 } from 'nostr-tools';

/**
 * Type for summarizing the type of a NIP-19 entity
 */
export type Nip19EntityType = 
  | 'npub'    // Public keys
  | 'nsec'    // Private keys
  | 'note'    // Note IDs
  | 'nprofile' // Profile with metadata
  | 'nevent'  // Event with metadata
  | 'naddr'   // Replaceable event coordinate
  | 'nrelay'  // Relay
  | 'hex'     // Plain hex (not a NIP-19 entity)
  | 'unknown'; // Invalid or unrecognized

/**
 * Try to identify the type of entity from a string
 * @param str The string to identify
 * @returns The type of the entity
 */
export function identifyEntity(str: string): Nip19EntityType {
  // Check if it's likely a hex string (pubkey or event id)
  if (/^[0-9a-f]{64}$/i.test(str)) {
    return 'hex';
  }
  
  // Check NIP-19 entity prefixes
  if (str.startsWith('npub1')) return 'npub';
  if (str.startsWith('nsec1')) return 'nsec';
  if (str.startsWith('note1')) return 'note';
  if (str.startsWith('nprofile1')) return 'nprofile';
  if (str.startsWith('nevent1')) return 'nevent';
  if (str.startsWith('naddr1')) return 'naddr';
  if (str.startsWith('nrelay1')) return 'nrelay';
  
  return 'unknown';
}

/**
 * Convert a hex pubkey to npub format
 * @param hex The hex pubkey
 * @returns npub string or null if invalid
 */
export function hexToNpub(hex: string): string | null {
  try {
    return nip19.npubEncode(hex);
  } catch (e) {
    console.error('Failed to convert hex to npub:', e);
    return null;
  }
}

/**
 * Convert an npub to hex format
 * @param npub The npub string
 * @returns hex pubkey or null if invalid
 */
export function npubToHex(npub: string): string | null {
  try {
    const { data } = nip19.decode(npub);
    return data as string;
  } catch (e) {
    console.error('Failed to convert npub to hex:', e);
    return null;
  }
}

/**
 * Shorten a NIP-19 entity or hex string for display
 * @param entity The entity string (hex, npub, note, etc.)
 * @param showPrefix Whether to show the type prefix in the shortened form
 * @returns Shortened string (e.g. "npub:abc")
 */
export function shortenEntity(entity: string, showPrefix = true): string {
  const type = identifyEntity(entity);
  
  if (type === 'unknown') {
    // If we don't recognize the type, just do a generic shortening
    if (entity.length > 15) {
      return `${entity.slice(0, 6)}:${entity.slice(-4)}`;
    }
    return entity;
  }
  
  if (type === 'hex') {
    return `${entity.slice(0, 6)}:${entity.slice(-4)}`;
  }
  
  // For NIP-19 entities, preserve the prefix and bech32 information
  let prefix = '';
  let body = entity;
  
  // Extract the prefix (e.g., "npub1")
  const matches = entity.match(/^([a-z]+1)(.+)$/);
  if (matches && matches.length > 2) {
    prefix = matches[1];
    body = matches[2];
  }
  
  const shortened = `${body.slice(0, 4)}:${body.slice(-4)}`;
  return showPrefix ? `${prefix}${shortened}` : shortened;
} 