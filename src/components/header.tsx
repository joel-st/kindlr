import { A } from "@solidjs/router";
import { createEffect, createSignal, onMount } from "solid-js";

export default function Header() {
  // When using Router with base="/kindlr", links should be relative to that base
  // So home path should always be "/" when using the A component
  const homePath = "/";
  
  // Theme state management
  const [isDark, setIsDark] = createSignal(false);
  
  // Initialize theme state on component mount
  onMount(() => {
    // Check localStorage first, then system preference
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    setIsDark(
      storedTheme === "dark" || 
      (storedTheme === null && prefersDark)
    );
    
    // Apply initial theme state
    document.documentElement.classList.toggle("dark", isDark());
  });
  
  // Apply theme change to HTML element
  createEffect(() => {
    const html = document.documentElement;
    
    if (isDark()) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  });
  
  // Toggle theme function
  const toggleTheme = () => {
    setIsDark(!isDark());
  };
  
  return (
    <header class="text-gray-700 dark:text-gray-200 px-4 pt-10 pb-6 max-w-screen-2xl mx-auto">
      <div class="max-w-screen-2xl mx-auto flex justify-between items-center">
        <A href={homePath}>
          <h1 class="text-xl font-semibold">Kindlr – A Nostr Kind Explorer</h1>
        </A>
        
        <button
          onClick={toggleTheme}
          class="cursor-pointer text-2xl"
          aria-label={isDark() ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark() ? "💡" : "😎"}
        </button>
      </div>
    </header>
  );
} 