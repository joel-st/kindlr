import { VsJson } from "solid-icons/vs";
import { createSignal, For, Show } from "solid-js";
import { getTagLabel } from "../../../helpers/event-tags";
import { EventTagsProps } from "../../../types";

/**
 * Component for displaying event tags with collapsible sections
 */
export default function EventTags(props: EventTagsProps) {
  const [showRawJson, setShowRawJson] = createSignal(false);
  
  const toggleRawJson = () => setShowRawJson(!showRawJson());
  
  // Render a specific tag based on its type and contents
  const renderTag = (tag: string[]) => {
    const tagType = tag[0];
    
    return (
      <div class="flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded overflow-hidden">
        <div class="flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-0.5">
          <span class="font-semibold text-sm text-gray-700 dark:text-gray-200">{getTagLabel(tagType)}</span>
        </div>
        
        <div class="px-2 py-1">
          {/* Display all tag parts */}
          <div class="text-xs font-mono leading-tight dark:text-gray-200">
            <For each={tag.slice(1)}>
              {(part, index) => (
                <>
                  <div class="truncate py-0.5" title={part || "(empty)"}>
                    {part ? (
                      part
                    ) : (
                      <span class="italic text-gray-400 dark:text-gray-500">(empty)</span>
                    )}
                  </div>
                  {/* Add divider if not the last item */}
                  {index() < tag.slice(1).length - 1 && (
                    <div class="border-t border-gray-200 dark:border-gray-600 my-0.5"></div>
                  )}
                </>
              )}
            </For>
            
            {/* Show message if there are no parts beyond the tag type */}
            {tag.length <= 1 && (
              <div class="py-0.5 italic text-gray-400 dark:text-gray-500">(no values)</div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div class="w-full">
      {/* Header with tag count */}
      <div class="gap-1 flex items-center justify-between w-full bg-gray-200 dark:bg-gray-600 rounded-t-md overflow-hidden border border-gray-200 dark:border-gray-600 border-b-0 pr-1">
        <div class="px-2 py-1 font-semibold text-sm text-gray-700 dark:text-gray-200 grow">
          Tags
        </div>
        <div class="flex flex-col text-xs px-1 py-.5 bg-gray-300 dark:bg-gray-700 dark:text-gray-200 rounded">
          {props.tags.length}
        </div>
        {/* Toggle button */}
        <Show when={props.tags.length > 0}>
          <div class="flex flex-col items-end">
            <button 
              onClick={toggleRawJson} 
              class="cursor-pointer gap-1 flex flex-row items-center text-center px-1 py-.5 bg-yellow-400 dark:bg-purple-700 hover:bg-yellow-500 dark:hover:bg-purple-800 text-xs rounded dark:text-gray-200"
            >
              {showRawJson() ? "Formatted" : <><VsJson /> JSON</>}
            </button>
          </div>
        </Show>
      </div>
      
      {/* Tags content area */}
      <div class="rounded-b-md p-2 text-sm max-h-32 overflow-y-auto border border-gray-200 dark:border-gray-600 border-t-0">
        {/* No tags message */}
        <Show when={props.tags.length === 0}>
          <em class="text-gray-500 dark:text-gray-200 px-1 text-xs">No tags</em>
        </Show>
        
        {/* Tag visualizations */}
        <Show when={props.tags.length > 0 && !showRawJson()}>
          <div class="flex flex-col gap-1">
            <For each={props.tags}>
              {(tag) => renderTag(tag)}
            </For>
          </div>
        </Show>
        
        {/* Raw JSON view */}
        <Show when={showRawJson()}>
          <pre class="whitespace-pre-wrap text-xs dark:text-gray-200">{JSON.stringify(props.tags, null, 2)}</pre>
        </Show>
      </div>
    </div>
  );
} 