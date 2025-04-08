/**
 * Nostr network communication service.
 * Provides functionality for publishing events to the Nostr network and subscribing to events.
 * Uses rx-nostr for reactive data flow and handles caching of events.
 */

import { createRxNostr, createRxBackwardReq, noopVerifier } from "rx-nostr";
import { DEFAULT_RELAYS } from "../const";
import { Filter } from "nostr-tools";

/**
 * RxNostr instance for Nostr network communication.
 * Configured to skip verification at this level since verification happens in the event store.
 */
export const rxNostr = createRxNostr({
  // skip verification here because we are going to verify events at the event store
  skipVerify: true,
  verifier: noopVerifier,
});

// Set default relays for rxNostr
rxNostr.setDefaultRelays(DEFAULT_RELAYS);

/**
 * Subscribe to events with the given filter.
 * @param filter The filter to use for subscribing
 * @param options Options for the subscription
 * @returns A subscription that can be unsubscribed
 */
export function subscribeEvents(filter: Filter, options: { 
  onevent?: (packet: any) => void,
  oneose?: () => void,
  onclose?: (packet: any) => void
}) {
  const rxReq = createRxBackwardReq();
  
  const subscription = rxNostr.use(rxReq).subscribe({
    next: (packet: any) => {
      if (packet.type === 'EVENT' && options.onevent) {
        options.onevent(packet);
      } else if (packet.type === 'EOSE' && options.oneose) {
        options.oneose();
      } else if (packet.type === 'CLOSED' && options.onclose) {
        options.onclose(packet);
      }
    }
  });
  
  // Emit the filter request
  rxReq.emit(filter);
  
  // Signal no more emits
  rxReq.over();
  
  return subscription;
}
