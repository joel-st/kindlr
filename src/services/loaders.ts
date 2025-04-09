/**
 * Loader services for fetching Nostr events.
 * Provides mechanisms to load events from relays and populate the event store.
 */

import { ReplaceableLoader } from 'applesauce-loaders';
import { rxNostr, subscribeEvents } from './nostr';
import { eventStore } from './stores';
import { Filter } from 'nostr-tools';
import { cacheRequest, cacheEvent } from './cache';

/**
 * Replaceable loader instance for fetching replaceable events.
 */
export const replaceableLoader = new ReplaceableLoader(rxNostr, {
	cacheRequest,
});

// Configure loader to update the event store with fetched events
replaceableLoader.subscribe(packet => {
	eventStore.add(packet.event, packet.from);
	// Cache the event
	cacheEvent(packet.event);
});

/**
 * Loads and subscribes to events with the given filter.
 * Automatically adds events to the event store.
 * @param filter The filter to use for loading events
 */
export function loadEvents(filter: Filter) {
	subscribeEvents(filter, {
		onevent: (packet) => {
			// Add to event store
			eventStore.add(packet.event, packet.relay);
			// Cache the event
			cacheEvent(packet.event);
		}
	});
}

/**
 * Loads events of a specific kind.
 * @param kind The event kind to load
 * @param limit Maximum number of events to load
 */
export function loadEventsByKind(kind: number, limit: number = 5) {
	const filter: Filter = { kinds: [kind], limit };
	loadEvents(filter);
}