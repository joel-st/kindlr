import { createSignal, For, Show } from "solid-js";
import { VsJson } from 'solid-icons/vs'
import { isJsonContent } from "../../../helpers/event-content";
import { getParsedJson, getKeyCount } from "../../../helpers/json";
import { EventContentProps } from "../../../types";

/**
 * Component for displaying the event content
 * Detects and formats JSON content appropriately
 */
export default function EventContent(props: EventContentProps) {
  const [showRawContent, setShowRawContent] = createSignal(false);
  
  const toggleRawContent = () => setShowRawContent(!showRawContent());
  
  // Render a JSON key-value pair
  const renderKeyValue = (key: string, value: any) => {
    const stringValue = typeof value === 'object' && value !== null
      ? JSON.stringify(value)
      : String(value);
    
    return (
      <div class="flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded overflow-hidden">
        <div class="flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-0.5">
          <span class="font-semibold text-sm text-gray-700 dark:text-gray-200">{key}</span>
        </div>
        
        <div class="px-2 py-0.5">
          <div class="text-xs font-mono leading-tight dark:text-gray-200">
            <div class="truncate py-0.5" title={stringValue || "(empty)"}>
              {stringValue ? (
                stringValue
              ) : (
                <span class="italic text-gray-400 dark:text-gray-500">(empty)</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div class="w-full">
      <div class="gap-1 flex items-center justify-between w-full bg-gray-200 dark:bg-gray-600 rounded-t-md overflow-hidden border border-gray-200 dark:border-gray-600 border-b-0 pr-1">
        <div class="px-2 py-1 font-semibold text-sm text-gray-700 dark:text-gray-200 grow">
          Content
        </div>
        {isJsonContent(props.content) && (
          <div class="flex flex-col text-xs px-1 py-.5 bg-gray-300 dark:bg-gray-700 dark:text-gray-200 rounded">
            {getKeyCount(props.content)}
          </div>
        )}
        {isJsonContent(props.content) && (
          <div class="flex flex-col items-end">
            <button 
              onClick={toggleRawContent} 
              class="cursor-pointer gap-1 flex flex-row items-center text-center px-1 py-.5 bg-yellow-400 dark:bg-purple-700 hover:bg-yellow-500 dark:hover:bg-purple-800 text-xs rounded dark:text-gray-200"
            >
              {showRawContent() ? "Formatted View" : <><VsJson /> JSON</>}
            </button>
          </div>
        )}
      </div>
      <div class="rounded-b-md p-2 text-sm max-h-32 overflow-y-auto break-words border border-gray-200 dark:border-gray-600 border-t-0">
        {!props.content && <em class="text-gray-500 dark:text-gray-200 px-1 text-xs">No content</em>}
        
        {props.content && !isJsonContent(props.content) && (
          <div class="text-sm dark:text-gray-200">{props.content}</div>
        )}
        
        {isJsonContent(props.content) && (
          <>
            <Show when={!showRawContent()}>
              <div class="flex flex-col gap-1">
                <For each={Object.entries(getParsedJson(props.content) || {})}>
                  {([key, value]) => renderKeyValue(key, value)}
                </For>
              </div>
            </Show>
            
            <Show when={showRawContent()}>
              <pre class="text-xs font-mono leading-tight whitespace-pre-wrap dark:text-gray-200">
                {JSON.stringify(getParsedJson(props.content), null, 2)}
              </pre>
            </Show>
          </>
        )}
      </div>
    </div>
  );
} 