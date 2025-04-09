/**
 * Helper functions for cache-related operations.
 * Provides utilities for working with the cache system.
 */

import { NostrEvent } from "nostr-tools";

/**
 * Checks if an event is from the cache.
 * This is a simplified implementation for debugging purposes.
 * 
 * @param event The event to check
 * @returns True if the event is from the cache, false otherwise
 */
export function isFromCache(event: NostrEvent): boolean {
  // Check if the event has a _fromCache property
  // This is how applesauce-core typically marks events from cache
  return !!(event as any)._fromCache;
}

/**
 * Marks an event as coming from the cache.
 * 
 * @param event The event to mark
 * @returns The marked event
 */
export function markAsFromCache(event: NostrEvent): NostrEvent {
  (event as any)._fromCache = true;
  return event;
} 