import { Show, For } from "solid-js";
import { NostrEvent } from "nostr-tools";
import { getKindComponent, getKindVariants } from "../helpers/kinds";
import Fallback from "./kindFallback/fallback";
import Header from "./header";
import { EVENT_KINDS } from "../const";

interface KindViewProps {
  kindNumber: number;
  event: () => NostrEvent | null;
  loading: () => boolean;
  componentKey?: string;
}

export default function KindView(props: KindViewProps) {  
  const kindInfo = EVENT_KINDS.find(k => k.kind === props.kindNumber);

  // Get the appropriate component for this event kind
  const EventComponent = kindInfo ? getKindComponent(kindInfo.kind) : undefined;
  
  // Get available variants for this kind
  const availableVariants = kindInfo ? getKindVariants(kindInfo.kind) : [];
  
  // Filter variants if componentKey is provided
  const filteredVariants = props.componentKey 
    ? availableVariants.filter(v => v === props.componentKey)
    : availableVariants;

  if (!kindInfo) {
    return <div>Kind {props.kindNumber} not found</div>;
  }

  return (
    <>
      <Header />
      <main class="max-w-screen-2xl mx-auto p-4 flex flex-col gap-4">        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
          <h2 class="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200">Kind {kindInfo.kind}: {kindInfo.name}</h2>
          <p class="mb-2"><span class="font-semibold">Short Description:</span> {kindInfo.short_description}</p>
          <p class="mb-2"><span class="font-semibold">NIP:</span> {kindInfo.nip}</p>
          <p class="mb-4"><span class="font-semibold">Description:</span> {kindInfo.description}</p>
          <div class="flex gap-4">
            <a href={kindInfo.kurl} target="_blank" rel="noopener noreferrer" 
              class="bg-yellow-400 hover:bg-yellow-500 dark:bg-purple-700 dark:hover:bg-purple-800 rounded px-3 py-1.5 text-gray-700 dark:text-gray-200">
              View on nostrbook.dev
            </a>
            <a href={kindInfo.nurl} target="_blank" rel="noopener noreferrer"
              class="bg-yellow-400 hover:bg-yellow-500 dark:bg-purple-700 dark:hover:bg-purple-800 rounded px-3 py-1.5 text-gray-700 dark:text-gray-200">
              View NIP
            </a>
          </div>
        </div>
        
        <Show when={!props.loading()} fallback={
          <div class="w-full flex flex-col gap-4 items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div class="h-14 w-14 animate-spin rounded-full border-6 border-gray-100 dark:border-gray-700 border-t-yellow-400 dark:border-t-purple-700" />
            <span class="text-sm text-gray-500 dark:text-gray-400 italic">Loading event data...</span>
          </div>
        }>
          <Show when={props.event()} fallback={
            <div class="w-full flex flex-col gap-2 items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <p class="text-lg text-gray-700 dark:text-gray-200">😣 No events found for kind {kindInfo.kind}</p>
            </div>
          }>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-gray-700 dark:text-gray-200 truncate">
                  {props.event()?.id ? `Event ${props.event()?.id}` : `Sample Event (Kind ${kindInfo.kind})`}
                </h2>
              </div>
              
              <div class="flex flex-col gap-8">
                {/* Specialized Component with Variants */}
                <Show when={EventComponent && filteredVariants.length > 0}>
                  <div class="flex flex-col gap-4">
                    <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-200">Specialized Components</h3>
                    
                    <For each={filteredVariants}>
                      {(variant) => (
                        <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                          <h4 class="font-medium text-gray-700 dark:text-gray-200 mb-3">Variant: {variant}</h4>
                          <div class="py-4">
                            {/* @ts-ignore - The component is dynamically loaded */}
                            <EventComponent event={props.event()!} variant={variant} />
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                </Show>
                
                {/* Fallback Component */}
                <div class="flex flex-col gap-4">
                  <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-200">Fallback Component</h3>
                  <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <Fallback event={props.event()!} />
                  </div>
                </div>
                
                {/* Raw JSON Data */}
                <div class="flex flex-col gap-4">
                  <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-200">Raw JSON Data</h3>
                  <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <pre class="text-xs overflow-auto whitespace-pre-wrap break-words text-gray-800 dark:text-gray-100 max-h-[400px]">
                      {JSON.stringify(props.event(), null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </Show>
        </Show>
      </main>
    </>
  );
} 