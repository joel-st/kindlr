/**
 * Kind 1 specialized component for displaying short text notes
 * Provides different variants for displaying Nostr text notes (Kind 1 events)
 */

import { Component } from "solid-js";
import { NostrEvent } from "nostr-tools";
import FullKind1Component from "./variants/full/index";
import CompactKind1Component from "./variants/compact/index";

export type Kind1Variant = "full" | "compact";

interface Kind1ComponentProps {
  event: NostrEvent;
  variant?: Kind1Variant;
}

/**
 * Main component for displaying Kind 1 (short text note) events
 * Allows selecting different display variants
 */
const Kind1Component: Component<Kind1ComponentProps> = (props) => {
  // Default to full variant if none specified
  const variant = () => props.variant || "compact";
  
  // Render the appropriate variant
  return (
    <>
      {variant() === "full" && <FullKind1Component event={props.event} />}
      {variant() === "compact" && <CompactKind1Component event={props.event} />}
    </>
  );
};

export default Kind1Component; 