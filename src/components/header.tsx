import { A } from "@solidjs/router";

export default function Header() {
  // When using Router with base="/kindlr", links should be relative to that base
  // So home path should always be "/" when using the A component
  const homePath = "/";
  
  return (
    <header class="text-gray-700 dark:text-gray-200 px-4 pt-10 pb-6 max-w-screen-2xl mx-auto">
      <div class="max-w-screen-2xl mx-auto flex justify-between items-center">
        <A href={homePath}>
          <h1 class="text-xl font-semibold">Kindlr – A Nostr Kind Explorer</h1>
        </A>
      </div>
    </header>
  );
} 