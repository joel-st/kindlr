/**
 * Kind 3 specialized component for displaying follow lists
 * Provides different variants for displaying Nostr follow lists (Kind 3 events)
 */

import { Component } from "solid-js";
import { NostrEvent } from "nostr-tools";
import FullKind3Component from "./variants/full/index";
import CompactKind3Component from "./variants/compact/index";

export type Kind3Variant = "full" | "compact";

interface Kind3ComponentProps {
  event: NostrEvent;
  variant?: Kind3Variant;
}

/**
 * Main component for displaying Kind 3 (follow list) events
 * Allows selecting different display variants
 */
const Kind3Component: Component<Kind3ComponentProps> = (props) => {
  // Default to full variant if none specified
  const variant = () => props.variant || "compact";
  
  // Render the appropriate variant
  return (
    <>
      {variant() === "full" && <FullKind3Component event={props.event} />}
      {variant() === "compact" && <CompactKind3Component event={props.event} />}
    </>
  );
};

export default Kind3Component; 