/**
 * 404 Not Found page.
 * Displays when a user navigates to a route that doesn't exist.
 */

import { A, useLocation } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";
import { IoHome } from "solid-icons/io";
import { BiSolidError } from "solid-icons/bi";

/**
 * NotFoundView component that displays a 404 error page with a link to return home.
 * Features animated elements and styling consistent with the app's design language.
 * 
 * @returns A 404 page component
 */
export default function NotFoundView() {
  const [showAnimation, setShowAnimation] = createSignal(false);
  const location = useLocation();
  // Determine the home path based on the current URL
  const homePath = location.pathname.includes('/kindlr') ? '/kindlr/' : '/';

  onMount(() => {
    // Start animation after component mounts
    setTimeout(() => setShowAnimation(true), 100);
  });

  return (
    <div class="min-h-screen flex flex-col">
      {/* Header consistent with app style */}
      <header class="text-gray-700 bg-white dark:bg-gray-950 dark:text-gray-200 px-4 py-6 box-shadow-md">
        <div class="max-w-screen-2xl mx-auto flex justify-between items-center">
          <A href={homePath}>
            <h1 class="text-xl font-semibold">Kindlr – A Nostr Kind Explorer</h1>
          </A>
        </div>
      </header>

      {/* Main content */}
      <main class="flex-1 flex flex-col items-center justify-center gap-8 p-6 bg-gray-100 dark:bg-gray-900 transition-colors">
        <div class={`transform transition-all duration-700 ${showAnimation() ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Error icon with yellow/purple accent colors */}
          <div class="flex justify-center mb-6">
            <div class="rounded-full h-36 w-36 flex items-center justify-center bg-yellow-400 dark:bg-purple-700 text-black dark:text-gray-200">
              <BiSolidError size={80} />
            </div>
          </div>

          {/* Error info */}
          <div class="text-center mb-8">
            <h1 class="text-6xl font-bold mb-4 dark:text-white">
              <span class="bg-gray-200 dark:bg-gray-600 rounded px-4 py-2 text-gray-600 dark:text-gray-200">Kind 404</span>
            </h1>
            <p class="text-2xl mb-2 dark:text-gray-300">Page Not Found</p>
            <p class="text-gray-600 dark:text-gray-400 mb-8">The event you're looking for doesn't exist in our relay</p>
            
            {/* Loading animation similar to kind-teaser component */}
            <div class="flex justify-center mb-8">
              <div class="h-14 w-14 animate-spin rounded-full border-6 border-gray-100 dark:border-gray-700 border-t-yellow-400 dark:border-t-purple-700" />
            </div>
          </div>

          {/* Return home button styled like app buttons */}
          <div class="flex justify-center">
            <A
              href={homePath}
              class="cursor-pointer bg-yellow-400 hover:bg-yellow-500 dark:bg-purple-700 dark:hover:bg-purple-800 rounded px-6 py-3 text-black dark:text-gray-200 font-medium flex items-center gap-2 transition-colors"
              aria-label="return home"
            >
              <IoHome size={20} />
              Back to Explorer
            </A>
          </div>
        </div>
      </main>
    </div>
  );
}
