/**
 * KindTeaser component for displaying a preview of Nostr events of a specific kind.
 * Shows a card with kind information and a preview of the latest event of that kind.
 */

import { A } from "@solidjs/router";
import { createSignal, createEffect, Show, onCleanup, For } from "solid-js";
import { NostrEvent } from "nostr-tools";
import { eventStore } from "../services/stores";
import { subscribeEvents } from "../services/nostr";
import { cacheEvent } from "../services/cache";
import { FaSolidBook, FaBrandsGithub, FaSolidChevronDown, FaSolidDice } from 'solid-icons/fa'
import { getKindComponent, hasKindComponent, getKindVariants, getKindDefaultVariant, KindVariant } from "../helpers/kinds";
import { VsJson } from "solid-icons/vs";

import Fallback from "./kindFallback/fallback";

/**
 * KindTeaser props interface
 */
interface KindTeaserProps {
  kind: {
    kind: number;
    name: string;
    kurl: string;
    nurl: string;
    description: string;
    short_description: string;
  };
}

/**
 * KindTeaser component displays a card for a specific Nostr event kind.
 * It shows basic information about the kind and fetches the latest event of that kind.
 * Different views are available: specialized component (if available), fallback view, or raw JSON.
 * 
 * @param props - The component properties containing kind information
 * @returns The KindTeaser component
 */
export default function KindTeaser(props: KindTeaserProps) {
  const [events, setEvents] = createSignal<NostrEvent[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [currentEventIndex, setCurrentEventIndex] = createSignal(0);

  // Set the initial view based on whether an EventComponent exists
  const hasComponentForKind = hasKindComponent(props.kind.kind);
  const [view, setView] = createSignal(hasComponentForKind ? "component" : "fallback");
  
  // Get the specialized component for the current kind, if one exists
  const EventComponent = getKindComponent(props.kind.kind);
  
  // Get available variants for this kind
  const availableVariants = getKindVariants(props.kind.kind);
  const defaultVariant = getKindDefaultVariant(props.kind.kind);
  
  // Set the initial variant to the default or first available
  const [selectedVariant, setSelectedVariant] = createSignal<KindVariant | undefined>(
    defaultVariant || (availableVariants.length > 0 ? availableVariants[0] : undefined)
  );
  
  // State for dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = createSignal(false);

  /**
   * Effect for loading events from the event store and subscribing to new events
   */
  createEffect(() => {
    // Subscribe to events from the event store
    const storeSubscription = eventStore.timeline({ kinds: [props.kind.kind] })
      .subscribe((storeEvents) => {
        setEvents(storeEvents);
        if (storeEvents.length > 0) {
          setLoading(false);
        }
      });
    
    // Subscribe to events using the service helper function
    const relaySubscription = subscribeEvents(
      { kinds: [props.kind.kind], limit: 3 },
      {
        onevent: (packet) => {
          eventStore.add(packet.event, packet.relay);
          // Cache the event
          cacheEvent(packet.event);
          // console.log(packet.event.kind,packet.event)
        },
        oneose: () => {
          // When EOSE is received, we can stop loading
          setLoading(false);
        }
      }
    );
    
    // Cleanup subscriptions on component unmount
    onCleanup(() => {
      storeSubscription.unsubscribe();
      relaySubscription.unsubscribe();
    });
  });

  /**
   * Get the currently selected event
   */
  const getCurrentEvent = () => {
    const eventList = events();
    if (eventList.length === 0) return eventList[0];
    
    // Ensure the index is within bounds
    const index = Math.min(currentEventIndex(), eventList.length - 1);
    return eventList[index];
  };

  /**
   * Cycle to the next event
   */
  const cycleToNextEvent = () => {
    const eventList = events();
    if (eventList.length <= 1) return;
    
    setCurrentEventIndex((currentEventIndex() + 1) % eventList.length);
  };

  /**
   * Helper function to determine button styling based on current view
   * @param buttonView - The view name to check against current view
   * @returns CSS class string for the button
   */
  const getButtonStyle = (buttonView: string) => {
    const baseStyle = "cursor-pointer rounded px-2 py-1 text-sm flex flex-row gap-1 items-center justify-center ";
    
    if (view() === buttonView) {
      return baseStyle + "bg-yellow-500 dark:bg-purple-800 text-black dark:text-gray-200";
    }
    
    return baseStyle + "bg-yellow-400 hover:bg-yellow-500 dark:bg-purple-700 dark:hover:bg-purple-800 text-gray-700 dark:text-gray-200";
  };
  
  /**
   * Toggle the dropdown visibility
   */
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen());
  };
  
  /**
   * Select a variant and close the dropdown
   */
  const selectVariant = (variant: KindVariant) => {
    setSelectedVariant(variant);
    setView("component");
    setIsDropdownOpen(false);
  };

  return (
    <div class="gap-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-950 hover:shadow-md flex flex-col bg-white dark:bg-gray-950">
      {/* Header with kind information */}
      <header class="flex flex-col gap-2 px-3 pt-3">
        <div class="flex flex-row gap-2 w-full">
          <h2 class="min-w-0 text-lg font-semibold flex-grow flex flex-row gap-2 items-center">
            <span class="text-sm px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-gray-600 dark:text-gray-200 whitespace-nowrap">Kind {props.kind.kind}</span>
            <span class="min-w-0 text-gray-600 dark:text-gray-200 whitespace-nowrap truncate">{props.kind.name}</span>
          </h2>
          <div class="flex flex-row gap-1 items-center shrink-0 ml-auto"> 
            <button 
              onClick={cycleToNextEvent} 
              disabled={events().length <= 1}
              class={`cursor-pointer bg-yellow-400 hover:bg-yellow-500 dark:bg-purple-700 dark:hover:bg-purple-800 rounded p-2 text-sm dark:text-gray-200 ${events().length <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Show different event"
            >
              <FaSolidDice size={16} />
            </button>
            <A href={props.kind.kurl} target="_blank" class="cursor-pointer bg-yellow-400 hover:bg-yellow-500 dark:bg-purple-700 dark:hover:bg-purple-800 rounded p-2 text-sm dark:text-gray-200"><FaSolidBook size={16} /></A>
            <A href={props.kind.nurl} target="_blank" class="cursor-pointer bg-yellow-400 hover:bg-yellow-500 dark:bg-purple-700 dark:hover:bg-purple-800 rounded p-2 text-sm dark:text-gray-200"><FaBrandsGithub size={16} /></A>
          </div>
        </div>
        <p class="text-md text-gray-600 dark:text-gray-200">{props.kind.short_description}</p>
      </header>
      
      {/* Content area with loading state, empty state, and event views */}
      <Show when={!loading()} fallback={
        <div class="w-full h-full flex flex-col gap-4 items-center justify-center py-16">
          <div class="h-14 w-14 animate-spin rounded-full border-6 border-gray-100 dark:border-gray-700 border-t-yellow-400 dark:border-t-purple-700" />
          <span class="text-sm text-gray-300 dark:text-gray-600 italic">Wait for it...</span>
        </div>
      }>
        <Show when={events().length > 0} fallback={
          <div class="w-full h-full flex flex-col gap-2 items-center justify-center dark:text-gray-200 py-16">
            😣 No events found for this kind
          </div>
        }>
          {/* Specialized component view */}
          <Show when={view() === "component" && EventComponent !== undefined}>
            <div class="overflow-y-auto flex-1 px-3 grid place-items-center">
              {/* @ts-ignore - The component is dynamically loaded */}
              <EventComponent 
                event={getCurrentEvent()} 
                variant={selectedVariant()}
              />
            </div>
          </Show>
          
          {/* Raw JSON view */}
          <Show when={view() === "raw"}>
            <div class="overflow-auto flex-1 px-3">
              <pre class="h-full text-xs overflow-auto whitespace-pre-wrap break-words max-h-[80svh] bg-gray-200 dark:bg-gray-900 p-4 rounded dark:text-gray-100">
                {JSON.stringify(getCurrentEvent(), null, 2)}
              </pre>
            </div>
          </Show>
          
          {/* Fallback view for all kinds */}
          <Show when={view() === "fallback"}>
            <div class="overflow-y-auto flex-1 px-3">
              <Fallback event={getCurrentEvent()} />
            </div>
          </Show>
          
          {/* View toggle buttons */}
          <footer class="w-full flex flex-row flex-wrap gap-2 justify-between px-3 pb-3">
            {/* Component dropdown */}
            <div class="relative">
              <button 
                onClick={toggleDropdown}
                disabled={EventComponent === undefined}
                class={`flex items-center gap-1 px-3 py-1.5 rounded text-sm ${
                  EventComponent === undefined 
                    ? "opacity-50 cursor-not-allowed bg-gray-300 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-700"
                    : view() === "component" 
                      ? "bg-yellow-500 dark:bg-purple-800 text-black dark:text-gray-200" 
                      : "bg-yellow-400 dark:bg-purple-700 text-gray-700 dark:text-gray-300 hover:bg-yellow-500 dark:hover:bg-purple-800"
                }`}
              >
                <span>
                  {view() === "component" && selectedVariant() 
                    ? `Component (${selectedVariant()})` 
                    : "Component"}
                </span>
                <FaSolidChevronDown size={12} />
              </button>
              
              {/* Dropdown menu - only show when dropdown is open and component exists */}
              <Show when={isDropdownOpen() && EventComponent !== undefined}>
                <div class="absolute left-0 top-full mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                  <div class="py-1" role="menu" aria-orientation="vertical">
                    <For each={availableVariants}>
                      {(variant) => (
                        <button
                          onClick={() => selectVariant(variant)}
                          class={`block w-full text-left px-4 py-2 text-sm ${
                            view() === "component" && selectedVariant() === variant
                              ? "bg-yellow-100 dark:bg-purple-900 text-black dark:text-gray-200"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                          role="menuitem"
                        >
                          {variant}
                        </button>
                      )}
                    </For>
                  </div>
                </div>
              </Show>
            </div>
            
            {/* Fallback and JSON buttons */}
            <div class="flex flex-row gap-2">
              <button 
                onClick={() => setView("fallback")} 
                class={getButtonStyle("fallback")}
              >
                Fallback
              </button>

              <button 
                onClick={() => setView("raw")} 
                class={getButtonStyle("raw")}
              >
                <VsJson /> JSON
              </button>
            </div>
          </footer>
        </Show>
      </Show>
    </div>
  );
}
