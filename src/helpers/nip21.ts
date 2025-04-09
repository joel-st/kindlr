/**
 * NIP-21 utility functions for Nostr URI scheme
 * Implementation based on the NIP-21 spec: https://github.com/nostr-protocol/nips/blob/master/21.md
 */

import { hexToNpub, identifyEntity } from './nip19';
import { nip19 } from 'nostr-tools';

/**
 * Creates a nostr: URI for a Nostr entity
 * @param entity The entity identifier (e.g., npub, note, nevent, etc.)
 * @returns A proper nostr: URI according to NIP-21
 */
export function createNostrURI(entity: string): string {
  // If it's already a nostr: URI, return it as is
  if (entity.startsWith('nostr:')) {
    return entity;
  }
  
  return `nostr:${entity}`;
}

/**
 * Creates a nostr: URI for a pubkey
 * @param pubkey The pubkey in hex format
 * @returns A proper nostr: URI for the pubkey
 */
export function createPubkeyURI(pubkey: string): string {
  // Convert hex pubkey to npub if it's a hex string
  if (/^[0-9a-f]{64}$/i.test(pubkey)) {
    const npub = hexToNpub(pubkey);
    if (npub) {
      return createNostrURI(npub);
    }
  }
  
  // If it's already an npub or conversion failed, just create the URI
  return createNostrURI(pubkey);
}

/**
 * Creates a nostr: URI for an event ID
 * @param id The event ID in hex format or note1 format
 * @returns A proper nostr: URI for the event
 */
export function createEventURI(id: string): string {
  const type = identifyEntity(id);
  
  // If it's already a note1 format, just create the URI
  if (type === 'note') {
    return createNostrURI(id);
  }
  
  // If it's a hex event ID, convert to note1 format
  if (type === 'hex') {
    try {
      const note = nip19.noteEncode(id);
      return createNostrURI(note);
    } catch (e) {
      console.error('Failed to convert hex to note format:', e);
    }
  }
  
  // Fallback to just creating the URI with whatever was passed
  return createNostrURI(id);
} 