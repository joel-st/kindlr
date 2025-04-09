/**
 * Cache service for Nostr events.
 * Provides functionality to store and retrieve events from IndexedDB.
 */

import { isFromCache, markAsFromCache } from "../helpers/cache-helpers";
import { openDB, getEventsForFilters, addEvents, clearDB } from "nostr-idb";
import { Filter, NostrEvent } from "nostr-tools";
import { from, Subject } from "rxjs";
import { bufferTime, distinct, filter, mergeMap } from "rxjs/operators";

// Initialize the database
let db: any;
(async () => {
  try {
    db = await openDB();
    // console.log("IndexedDB database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize IndexedDB database:", error);
  }
})();

/**
 * Retrieves cached events that match the given filters
 * @param filters The filters to match against cached events
 * @returns Observable of events that match the filters
 */
export function cacheRequest(filters: Filter[]) {
  if (!db) {
    console.warn("Database not initialized yet, returning empty observable");
    return from([]);
  }
  
  // console.log("Cache request for filters:", filters);
  return from(getEventsForFilters(db, filters)).pipe(
    // tap(events => console.log(`Retrieved ${events.length} events from cache`)),
    mergeMap((events) => events),
  );
}

/**
 * Clears all events from the cache
 * @returns Promise that resolves when the cache is cleared
 */
export function clearCache() {
  if (!db) {
    console.warn("Database not initialized yet, cannot clear cache");
    return Promise.resolve();
  }
  
  return clearDB(db);
}

/**
 * Subject that emits events to be cached
 */
export const cacheSubject = new Subject<NostrEvent>();

/**
 * Saves an event to the cache
 * 
 * @param event The event to save to the cache
 * @returns A promise that resolves when the event is saved
 */
async function saveEventToCache(event: NostrEvent): Promise<void> {
  try {
    const db = await openDB();
    await addEvents(db, [event]);
  } catch (error) {
    console.error("Error saving event to cache:", error);
    throw error;
  }
}

/**
 * Caches an event if it's not already from the cache.
 * 
 * @param event The event to cache
 */
export function cacheEvent(event: NostrEvent): void {
  // console.log("cacheEvent called with event:", event.id);
  
  if (isFromCache(event)) {
    // console.log("Event is from cache, skipping:", event.id);
    return;
  }
  
  // console.log("Event is not from cache, will be cached:", event.id);
  cacheSubject.next(event);
}

// Subscribe to the cache subject
cacheSubject.subscribe((event: NostrEvent) => {
  // console.log("Processing event for caching:", event.id);
  
  // Mark the event as from cache before saving it
  const eventToCache = markAsFromCache(event);
  
  // Save the event to the cache
  saveEventToCache(eventToCache)
    .then(() => {
      // console.log("Event saved to cache successfully:", event.id);
    })
    .catch((error: Error) => {
      console.error("Error saving event to cache:", error);
    });
});

// Subscribe to events to be cached
cacheSubject
  .pipe(
    // Log all events that come in
    // tap(e => console.log(`Event received for caching: ${e.id} (kind: ${e.kind})`)),
    // ignore events from cache
    filter((e) => {
      const fromCache = isFromCache(e);
      // console.log(`Event ${e.id} from cache: ${fromCache}`);
      return !fromCache;
    }),
    // only save events once
    distinct((e) => e.id),
    // batch by time or max 1k
    bufferTime(10_000, undefined, 1000),
    // ignore empty buffers
    filter((b) => b.length > 0),
  )
  .subscribe(async (events: NostrEvent[]) => {
    if (!db) {
      console.warn("Database not initialized yet, cannot cache events");
      return;
    }
    
    // console.log(`Saving ${events.length} events to cache`);
    try {
      await addEvents(db, events);
      // console.log(`Successfully saved ${events.length} events to cache`);
    } catch (error) {
      console.error("Failed to save events to cache:", error);
    }
  }); 