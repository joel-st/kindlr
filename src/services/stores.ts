/**
 * Data store services.
 * Provides centralized stores for Nostr events and queries for data retrieval.
 * Uses applesauce-core for data management and nostr-tools for event verification.
 */

import { EventStore, QueryStore } from "applesauce-core";
import { verifyEvent } from "nostr-tools";

/**
 * Central store for all Nostr events.
 * Configured to verify events using nostr-tools verification.
 */
export const eventStore = new EventStore();

// verify the events when they are added to the store
eventStore.verifyEvent = verifyEvent;

/**
 * Query store for retrieving data from the event store.
 * Provides a mechanism to create reactive queries against the event data.
 */
export const queryStore = new QueryStore(eventStore);

// @ts-expect-error
window.eventStore = eventStore;
