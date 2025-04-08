import { A } from "@solidjs/router";

export default function Header() {
  return (
    <header class="text-gray-700 bg-white dark:bg-gray-950 dark:text-gray-200 px-4 py-6 box-shadow-md">
      <div class="max-w-screen-2xl mx-auto flex justify-between items-center">
        <A href="/">
          <h1 class="text-xl font-semibold">Kindlr – A Nostr Kind Explorer</h1>
        </A>
      </div>
    </header>
  );
} 