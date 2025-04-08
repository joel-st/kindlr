/**
 * Services for loading Nostr events by kind.
 * Provides loaders and utilities for retrieving and displaying kind-specific events.
 */

import { NostrEvent } from "nostr-tools";
import { BehaviorSubject, Observable } from "rxjs";
import { queryStore } from "./stores";

/**
 * Creates an observable that emits events of a specific kind
 * @param kind The event kind to load
 * @param limit Maximum number of events to retrieve
 * @returns Observable of events array
 */
export function getEventsByKind(kind: number, limit: number = 5): Observable<NostrEvent[]> {
  const subject = new BehaviorSubject<NostrEvent[]>([]);
  
  // Create a timeline query for this kind
  const query = queryStore.timeline({ kinds: [kind], limit });
  
  // Subscribe to changes
  const subscription = query.subscribe((events) => {
    if (events) {
      subject.next(events.slice(0, limit));
    }
  });
  
  // Return a custom observable that cleans up when unsubscribed
  return new Observable<NostrEvent[]>((subscriber) => {
    const innerSubscription = subject.subscribe(subscriber);
    
    return () => {
      innerSubscription.unsubscribe();
      subscription.unsubscribe();
    };
  });
} 