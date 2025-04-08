/**
 * Theme Management Module
 * 
 * This module handles the application's theme switching functionality.
 * It supports both manual theme selection and system preference detection,
 * with persistence through localStorage.
 */

import { BehaviorSubject, fromEvent } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export type Theme = 'dark' | 'light';
export const THEME_KEY = 'kindlr-theme';

const themeSubject = new BehaviorSubject<Theme>('light');

/**
 * Sets up the theme switcher functionality using RxJS
 * 
 * This function:
 * 1. Creates a BehaviorSubject for theme state
 * 2. Checks for a stored theme preference in localStorage
 * 3. Falls back to system preference if no stored preference exists
 * 4. Sets up a listener for system preference changes using RxJS
 * 5. Applies the appropriate theme classes to the HTML element
 */
export function setupThemeSwitcher() {
  const htmlElement = document.documentElement;
  const storedTheme = localStorage.getItem('theme-preference') as Theme | null;

  /**
   * Applies the specified theme to the HTML element
   * @param theme - The theme to apply ('dark' or 'light')
   */
  const setTheme = (theme: Theme) => {
    if (theme === 'dark') {
      htmlElement.classList.remove('light');
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
      htmlElement.classList.add('light');
    }
    localStorage.setItem(THEME_KEY, theme);
  };

  // Apply stored theme if available
  if (storedTheme) {
    themeSubject.next(storedTheme);
  } 
  // Check system preference if available
  else if (window.matchMedia) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    themeSubject.next(prefersDark ? 'dark' : 'light');

    // Listen for system preference changes using RxJS
    fromEvent(window.matchMedia('(prefers-color-scheme: dark)'), 'change')
      .pipe(
        map((event) => (event as MediaQueryListEvent).matches ? 'dark' : 'light'),
        tap(setTheme)
      )
      .subscribe();
  } 
  // Default to light theme if no preferences available
  else {
    themeSubject.next('light');
  }

  // Subscribe to theme changes
  themeSubject.pipe(
    tap(setTheme)
  ).subscribe();
}

// Export the theme subject for external use
export const theme$ = themeSubject.asObservable(); 