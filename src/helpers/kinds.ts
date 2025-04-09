/**
 * Kinds helper utility for managing kind-specific components.
 * Provides functions to check and retrieve components for specific Nostr event kinds.
 */

import { Component } from "solid-js";
import { NostrEvent } from "nostr-tools";

// Import specialized components for different kinds
import Kind0Component, { Kind0Variant } from "../components/kinds/kind0";
import Kind1Component, { Kind1Variant } from "../components/kinds/kind1";

// Define the union type of all possible variants
export type KindVariant = Kind0Variant | Kind1Variant;

/**
 * Interface for kind component with variants
 */
export interface KindComponentWithVariants<T extends KindVariant = KindVariant> {
  component: Component<{ event: NostrEvent; variant?: T }>;
  variants?: T[];
  defaultVariant?: T;
}

/**
 * Map of kind numbers to their corresponding SolidJS components with variants
 * As specialized components are developed, they should be added here
 */
const kindComponents: Record<number, KindComponentWithVariants<any>> = {
  // Add specialized kind components here as they are developed
  0: {
    component: Kind0Component,
    variants: ["full", 'full-lazy', 'compact', 'compact-lazy'],
    defaultVariant: "full"
  },
  1: {
    component: Kind1Component,
    variants: ["full", "compact"],
    defaultVariant: "full"
  },
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
export function getKindComponent(kind: number): Component<{ event: NostrEvent; variant?: KindVariant }> | undefined {
  return kindComponents[kind]?.component;
}

/**
 * Gets the available variants for a given kind
 * @param kind - The Nostr event kind number
 * @returns Array of available variants or empty array if none exist
 */
export function getKindVariants(kind: number): KindVariant[] {
  return kindComponents[kind]?.variants || [];
}

/**
 * Gets the default variant for a given kind
 * @param kind - The Nostr event kind number
 * @returns The default variant or undefined if none exists
 */
export function getKindDefaultVariant(kind: number): KindVariant | undefined {
  return kindComponents[kind]?.defaultVariant;
}