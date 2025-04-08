/**
 * Application settings service.
 * Manages user configurable settings with persistence to local storage.
 * Provides observables for settings that can be used throughout the application.
 */

import { BehaviorSubject } from "rxjs";
import { DEFAULT_LOOKUP_RELAYS, DEFAULT_RELAYS } from "../const";

/**
 * Persists a BehaviorSubject to localStorage.
 * Loads initial value from localStorage if available, and saves any changes.
 * 
 * @param key - The localStorage key to use for persistence
 * @param subject - The BehaviorSubject to persist
 */
function persist<T>(key: string, subject: BehaviorSubject<T>) {
  try {
    if (localStorage.getItem(key))
      subject.next(JSON.parse(localStorage.getItem(key)!));
  } catch {}
  subject.subscribe((value) => {
    localStorage.setItem(key, JSON.stringify(value));
  });
}

/**
 * Observable for relay URLs used for user lookups.
 * Persisted to localStorage under "lookup-relays".
 */
export const lookupRelays = new BehaviorSubject<string[]>(
  DEFAULT_LOOKUP_RELAYS,
);
persist("lookup-relays", lookupRelays);

/**
 * Observable for default relay URLs used for general communication.
 * Persisted to localStorage under "default-relays".
 */
export const defaultRelays = new BehaviorSubject<string[]>(DEFAULT_RELAYS);
persist("default-relays", defaultRelays);
