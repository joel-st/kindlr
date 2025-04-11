import { useParams } from "@solidjs/router";
import { useKindEventLoader } from "../../../services/kind-view";
import { getKindComponent, getKindVariants, KindVariant } from "../../../helpers/kinds";
import { onMount } from "solid-js";

/**
 * Route component for displaying only the requested component populated with event data
 * Path: /kind/:componentKey/:eventId
 */
export default function KindComponentEventRoute() {
  const params = useParams();
  const kindNumber = parseInt(params.kind);
  const eventId = params.eventId;
  const componentKey = params.componentKey;
  
  const { event, loading, kindInfo } = useKindEventLoader(kindNumber, eventId);
  
  // Get the appropriate component
  const EventComponent = kindInfo ? getKindComponent(kindInfo.kind) : undefined;
  
  // Check if component key is valid for this kind
  const availableVariants = kindInfo ? getKindVariants(kindInfo.kind) : [];
  const isValidVariant = availableVariants.includes(componentKey as KindVariant);
  
  // Initialize theme on component mount
  onMount(() => {
    // Check localStorage for theme setting
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    // Apply dark class if theme is dark or system preference is dark (and no stored preference)
    if (storedTheme === "dark" || (storedTheme === null && prefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  });
  
  return (
    <div class="flex items-center justify-center min-h-screen p-4">
      <div class="max-w-full">
        {loading() ? (
          <div class="flex flex-col items-center justify-center p-8">
            <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="text-gray-600 dark:text-gray-300">Loading content...</p>
          </div>
        ) : (
          event() && EventComponent && isValidVariant && (
            <EventComponent 
              event={event()!} 
              variant={componentKey as KindVariant}
            />
          )
        )}
      </div>
    </div>
  );
} 