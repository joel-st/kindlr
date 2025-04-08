import { A, useLocation } from "@solidjs/router";

export default function Header() {
  const location = useLocation();
  // Determine the home path based on the current URL
  // Use the basePath from the router instead of adding a trailing slash
  const homePath = location.pathname.includes('/kindlr') ? '/kindlr' : '';
  
  return (
    <header class="text-gray-700 bg-white dark:bg-gray-950 dark:text-gray-200 px-4 py-6 box-shadow-md">
      <div class="max-w-screen-2xl mx-auto flex justify-between items-center">
        <A href={homePath}>
          <h1 class="text-xl font-semibold">Kindlr – A Nostr Kind Explorer</h1>
        </A>
      </div>
    </header>
  );
} 