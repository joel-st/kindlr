/**
 * Kind 0 specialized component for displaying user metadata
 * Provides different variants for displaying Nostr user profiles (Kind 0 events)
 */

import { Component } from "solid-js";
import { NostrEvent } from "nostr-tools";
import FullKind0Component from "./variants/full";
import CompactKind0Component from "./variants/compact";
import FullLazyKind0Component from "./variants/full-lazy";
import CompactLazyKind0Component from "./variants/compact-lazy";

export type Kind0Variant = "full" | "compact" | "full-lazy" | "compact-lazy";

interface Kind0ComponentProps {
  event: NostrEvent;
  variant?: Kind0Variant;
}

/**
 * Main component for displaying Kind 0 (user metadata) events
 * Allows selecting different display variants
 */
const Kind0Component: Component<Kind0ComponentProps> = (props) => {
  // Default to full variant if none specified
  const variant = () => props.variant || "full";
  
  // Render the appropriate variant
  return (
    <>
      {variant() === "full" && <FullKind0Component event={props.event} />}
      {variant() === "compact" && <CompactKind0Component event={props.event} />}
      {variant() === "full-lazy" && <FullLazyKind0Component event={props.event} />}
      {variant() === "compact-lazy" && <CompactLazyKind0Component event={props.event} />}
    </>
  );
};

export default Kind0Component;
