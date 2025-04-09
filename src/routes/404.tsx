/**
 * 404 Not Found page.
 * Displays when a user navigates to a route that doesn't exist.
 */

import { A } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";
import { IoHome } from "solid-icons/io";

/**
 * NotFoundView component that displays a 404 error page with a link to return home.
 * Features animated elements and styling consistent with the app's design language.
 * 
 * @returns A 404 page component
 */
export default function NotFoundView() {
  const [showAnimation, setShowAnimation] = createSignal(false);
  // When using Router with base="/kindlr", links should be relative to that base
  // So home path should always be "/"
  const homePath = "/";

  onMount(() => {
    // Start animation after component mounts
    setTimeout(() => setShowAnimation(true), 100);
  });

  return (
    <div class="min-h-screen flex flex-col">
      {/* Main content */}
      <main class="flex-1 flex flex-col items-center justify-center gap-8 p-6 bg-gray-100 dark:bg-gray-900">
        <div class={`transform duration-700 ${showAnimation() ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>          
          {/* Error info */}
          <div class="text-center mb-4 flex flex-col gap-4">
            <div class="flex flex-row gap-2 items-center justify-center">
              <h1 class="font-bold dark:text-white">
                <span class="bg-gray-200 dark:bg-gray-600 rounded px-4 py-2 text-gray-600 dark:text-gray-200">Kind 404</span>
              </h1>
              <p class="text-xl dark:text-gray-300">Page Not Found</p>
            </div>
            <p class="text-gray-600 dark:text-gray-400">The kind you're looking for doesn't exist</p>
          </div>

          {/* Return home button styled like app buttons */}
          <div class="flex justify-center">
            <A
              href={homePath}
              class="cursor-pointer bg-yellow-400 hover:bg-yellow-500 dark:bg-purple-700 dark:hover:bg-purple-800 rounded px-4 py-2 text-black dark:text-gray-200 font-medium flex items-center gap-2"
              aria-label="return home"
            >
              <IoHome size={20} />
              Go Home
            </A>
          </div>
        </div>
      </main>
    </div>
  );
}
