/**
 * KindFilterContainer component that filters and renders KindTeaser components based on search criteria.
 */

import { createSignal, For, Show, onCleanup, createEffect } from "solid-js";
import { NostrEvent } from "nostr-tools";
import SearchBar from "./search-bar";
import KindTeaser from "../kind-teaser";
import { parseSearchQuery, filterKind } from "../../helpers/search-filter";
import { eventStore } from "../../services/stores";

interface KindFilterContainerProps {
  kinds: Array<{
    kind: number;
    name: string;
    kurl: string;
    nurl: string;
    description: string;
    short_description: string;
  }>;
}

/**
 * Container component that manages filtering of kind teasers based on search criteria
 * 
 * @param props - Component properties
 * @returns The KindFilterContainer component
 */
export default function KindFilterContainer(props: KindFilterContainerProps) {
  const [filteredKinds, setFilteredKinds] = createSignal(props.kinds);
  
  // Store for events by kind for faster filtering
  const [eventsByKind, setEventsByKind] = createSignal<Record<number, NostrEvent[]>>({});
  
  /**
   * Load events for all kinds on component mount
   * This will help with filtering faster in subsequent searches
   */
  createEffect(() => {
    const subscriptions: Record<number, any> = {};
    
    // Subscribe to events for each kind
    props.kinds.forEach(kind => {
      const kindEvents: NostrEvent[] = [];
      
      const subscription = eventStore.timeline({ kinds: [kind.kind] })
        .subscribe({
          next: (storeEvents) => {
            // Store the events for this kind
            kindEvents.push(...storeEvents);
            
            // Update the events by kind record
            setEventsByKind(prev => {
              const updated = { ...prev };
              updated[kind.kind] = kindEvents;
              return updated;
            });
          }
        });
      
      subscriptions[kind.kind] = subscription;
    });
    
    // Clean up subscriptions when component unmounts
    onCleanup(() => {
      Object.values(subscriptions).forEach(sub => sub.unsubscribe());
    });
  });
  
  /**
   * Handle search query changes
   * 
   * @param query - The search query string
   */
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredKinds(props.kinds);
      return;
    }
    
    const criteria = parseSearchQuery(query);
    
    // Filter kinds based on criteria and cached events
    const filtered = props.kinds.filter(kind => {
      // Get cached events for this kind
      const events = eventsByKind()[kind.kind] || [];
      
      // Filter based on kind and events
      return filterKind(kind, criteria, events);
    });
    
    setFilteredKinds(filtered);
  };
  
  return (
    <div class="w-full flex flex-col gap-4">
      <SearchBar 
        onSearch={handleSearch} 
        placeholder="Search kinds and events... (e.g., k=1,3 or content=json or tags:imeta)"
      />
      
      <Show when={filteredKinds().length > 0} fallback={
        <div class="p-6 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700">
          <p class="text-lg">No matching events found</p>
          <p class="text-sm mt-1">Try adjusting your search criteria</p>
        </div>
      }>
        <div class="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,_minmax(400px,_1fr))] gap-4">
          <For each={filteredKinds()}>
            {(kind) => <KindTeaser kind={kind} />}
          </For>
        </div>
      </Show>
    </div>
  );
} 