/**
 * Compact variant of Kind 1 specialized component for displaying short text notes
 * Implements a simplified UI for Nostr text notes (Kind 1 events)
 */

import { Component, createMemo } from "solid-js";
import { NostrEvent } from "nostr-tools";
import { formatTimeAgo } from "../../../../../helpers/date";
import { createLinkifiedProps } from "../../../../../helpers/text-links";

/**
 * Compact variant component for displaying Kind 1 (short text note) events
 */
const CompactKind1Component: Component<{ event: NostrEvent }> = (props) => {
  // Format creation time as relative
  const createdAt = createMemo(() => {
    return formatTimeAgo(props.event.created_at);
  });

  // Truncate content if it's too long
  const displayContent = createMemo(() => {
    const maxLength = 140;
    if (props.event.content.length > maxLength) {
      return props.event.content.substring(0, maxLength) + '...';
    }
    return props.event.content;
  });
  
  return (
    <div class="flex flex-col gap-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 max-w-full">
      {/* Content (truncated) */}
      <div 
        class="text-gray-800 dark:text-gray-200 text-sm whitespace-pre-wrap break-words line-clamp-3"
        {...createLinkifiedProps(displayContent(), "text-yellow-500 dark:text-purple-400 hover:underline")}
      />
      
      {/* Footer with timestamp */}
      <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {createdAt()}
      </div>
    </div>
  );
};

export default CompactKind1Component; 