/**
 * SearchBar component that provides advanced filtering capabilities for Nostr events.
 * Supports special syntax for filtering by various event properties.
 */

import { createSignal, JSX, Show } from "solid-js";
import { BiSolidSearch } from "solid-icons/bi";
import { FaSolidQuestion } from "solid-icons/fa";
import { IoCloseCircle } from "solid-icons/io";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

/**
 * SearchBar component with advanced filtering syntax
 * 
 * @param props - Component properties
 * @returns The SearchBar component
 */
export default function SearchBar(props: SearchBarProps) {
  const [query, setQuery] = createSignal("");
  const [showHelp, setShowHelp] = createSignal(false);
  
  /**
   * Handle input changes
   */
  const handleInput: JSX.EventHandlerUnion<HTMLInputElement, InputEvent> = (e) => {
    setQuery(e.currentTarget.value);
    props.onSearch(e.currentTarget.value);
  };
  
  /**
   * Clear the search query
   */
  const clearSearch = () => {
    setQuery("");
    props.onSearch("");
  };
  
  /**
   * Toggle the help panel
   */
  const toggleHelp = () => {
    setShowHelp(!showHelp());
  };
  
  // Consistent icon size for both icons
  const iconSize = 16;
  
  return (
    <div class="w-full flex flex-col gap-2">
      <div class="flex flex-row items-center w-full overflow-hidden border border-gray-300 dark:border-gray-700 rounded-lg focus-within:ring-2 focus-within:ring-yellow-400 dark:focus-within:ring-purple-700 focus-within:border-transparent bg-white dark:bg-gray-950">
        {/* Magnifying glass icon - styled like kind tag */}
        <div class="flex-shrink-0 ml-1">
          <div class="text-gray-600 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 rounded p-2 flex items-center justify-center w-8 h-8">
            <BiSolidSearch size={iconSize} />
          </div>
        </div>
        
        {/* Input field */}
        <input
          type="text"
          value={query()}
          onInput={handleInput}
          placeholder={props.placeholder || "Search events..."}
          class="w-full flex-grow px-3 py-2 border-none focus:outline-none focus:ring-0 bg-white dark:bg-gray-950 dark:text-gray-200"
        />
        
        {/* Action buttons */}
        <div class="flex-shrink-0 flex gap-2 items-center mr-1">
          {/* Clear search icon - not boxed */}
          <Show when={query().length > 0}>
            <button
              onClick={clearSearch}
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="Clear search"
            >
              <IoCloseCircle size={20} />
            </button>
          </Show>
          
          {/* Question mark icon - styled like interactive button */}
          <button
            onClick={toggleHelp}
            class="cursor-pointer bg-yellow-400 hover:bg-yellow-500 dark:bg-purple-700 dark:hover:bg-purple-800 rounded p-2 text-sm dark:text-gray-200 flex items-center justify-center w-8 h-8"
            title="Search help"
          >
            <FaSolidQuestion size={iconSize} />
          </button>
        </div>
      </div>
      
      <Show when={showHelp()}>
        <div class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-sm">          
          <div class="grid grid-cols-[repeat(auto-fill,_minmax(166px,_1fr))] gap-4">
            <div class="flex flex-col gap-1">
              <h4 class="font-semibold text-gray-700 dark:text-gray-300">Basic Search</h4>
              <div><code class="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-yellow-500 dark:text-purple-400">hello world</code></div>
              <p class="text-gray-600 dark:text-gray-400">Any text will search across all event properties</p>
            </div>
            
            <div class="flex flex-col gap-1">
              <h4 class="font-semibold text-gray-700 dark:text-gray-300">Filter by Kind</h4>
              <div><code class="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-yellow-500 dark:text-purple-400">k=1,3,4</code></div>
              <p class="text-gray-600 dark:text-gray-400">Search for specific event kinds</p>
            </div>
            
            <div class="flex flex-col gap-1">
              <h4 class="font-semibold text-gray-700 dark:text-gray-300">Filter by Content</h4>
              <div><code class="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-yellow-500 dark:text-purple-400">content:hello</code></div>
              <p class="text-gray-600 dark:text-gray-400">Search in event content</p>
            </div>
            
            <div class="flex flex-col gap-1">
              <h4 class="font-semibold text-gray-700 dark:text-gray-300">JSON Content</h4>
              <div><code class="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-yellow-500 dark:text-purple-400">content=json</code></div>
              <p class="text-gray-600 dark:text-gray-400">Find events with JSON content</p>
            </div>
            
            <div class="flex flex-col gap-1">
              <h4 class="font-semibold text-gray-700 dark:text-gray-300">Non-JSON Content</h4>
              <div><code class="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-yellow-500 dark:text-purple-400">content!=json</code></div>
              <p class="text-gray-600 dark:text-gray-400">Find events without JSON content</p>
            </div>
            
            <div class="flex flex-col gap-1">
              <h4 class="font-semibold text-gray-700 dark:text-gray-300">Filter by Tags</h4>
              <div><code class="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-yellow-500 dark:text-purple-400">tags:imeta</code></div>
              <p class="text-gray-600 dark:text-gray-400">Search in event tags</p>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
} 