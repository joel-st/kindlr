import { createSignal, createEffect, onCleanup } from "solid-js";
import { NostrEvent } from "nostr-tools";
import { subscribeEvents } from "./nostr";
import { eventStore } from "./stores";
import { EVENT_KINDS } from "../const";

/**
 * Creates a loader for a specific kind event
 * 
 * @param kindNumber - The kind number to load
 * @param eventId - Optional event ID to load a specific event
 * @returns Object containing the event, loading state, and kindInfo
 */
export function useKindEventLoader(kindNumber: number, eventId?: string) {
  const [event, setEvent] = createSignal<NostrEvent | null>(null);
  const [loading, setLoading] = createSignal(true);
  
  const kindInfo = EVENT_KINDS.find(k => k.kind === kindNumber);

  // Effect to fetch event data when component mounts or parameters change
  createEffect(() => {
    setLoading(true);
    
    if (!kindInfo) {
      setLoading(false);
      return;
    }
    
    // Clear previous event
    setEvent(null);
    
    // If we have a specific event ID, fetch that event
    if (eventId) {
      // Check if we already have the event in the store
      const storeSubscription = eventStore.timeline({ 
        kinds: [kindInfo.kind], 
        ids: [eventId] 
      }).subscribe({
        next: (storeEvents) => {
          if (storeEvents && storeEvents.length > 0) {
            setEvent(storeEvents[0]);
            setLoading(false);
          }
        }
      });
      
      // Also try to fetch from relays in case it's not in the store
      const subscription = subscribeEvents({
        kinds: [kindInfo.kind],
        ids: [eventId]
      }, {
        onevent: (packet) => {
          setEvent(packet.event);
          setLoading(false);
        },
        oneose: () => {
          // Always mark loading as complete when we reach EOSE regardless of event status
          setLoading(false);
        }
      });
      
      onCleanup(() => {
        storeSubscription.unsubscribe();
        subscription.unsubscribe();
      });
    } 
    // If no specific event ID, just fetch one event of this kind
    else {
      const storeSubscription = eventStore.timeline({
        kinds: [kindInfo.kind],
        limit: 1
      }).subscribe({
        next: (storeEvents) => {
          if (storeEvents && storeEvents.length > 0) {
            setEvent(storeEvents[0]);
            setLoading(false);
          }
        }
      });
      
      const subscription = subscribeEvents({
        kinds: [kindInfo.kind],
        limit: 1
      }, {
        onevent: (packet) => {
          setEvent(packet.event);
          setLoading(false);
        },
        oneose: () => {
          // Always mark loading as complete when we reach EOSE regardless of event status
          setLoading(false);
        }
      });
      
      onCleanup(() => {
        storeSubscription.unsubscribe();
        subscription.unsubscribe();
      });
    }
  });

  return {
    event,
    loading,
    kindInfo
  };
} 