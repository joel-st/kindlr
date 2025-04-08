/**
 * Kinds helper utility for managing kind-specific components.
 * Provides functions to check and retrieve components for specific Nostr event kinds.
 */

import { Component } from "solid-js";
import { NostrEvent } from "nostr-tools";

// Import specialized components for different kinds
// No specialized components yet

/**
 * Map of kind numbers to their corresponding SolidJS components
 * As specialized components are developed, they should be added here
 */
const kindComponents: Record<number, Component<{ event: NostrEvent }>> = {
  // Add specialized kind components here as they are developed
};

/**
 * Checks if a specialized component exists for the given kind
 * @param kind - The Nostr event kind number
 * @returns True if a specialized component exists, false otherwise
 */
export function hasKindComponent(kind: number): boolean {
  return !!kindComponents[kind];
}

/**
 * Gets the specialized component for the given kind if it exists
 * @param kind - The Nostr event kind number
 * @returns The specialized component or undefined if none exists
 */
export function getKindComponent(kind: number): Component<{ event: NostrEvent }> | undefined {
  return kindComponents[kind];
}