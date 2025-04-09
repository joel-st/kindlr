/**
 * Full variant of Kind 1 specialized component for displaying short text notes
 * Implements the complete UI for Nostr text notes (Kind 1 events)
 */

import { Component, Show, createMemo, For } from "solid-js";
import { NostrEvent } from "nostr-tools";
import { formatTimeAgo } from "../../../../../helpers/date";
import { shortenEntity, hexToNpub } from "../../../../../helpers/nip19";
import { createPubkeyURI, createEventURI } from "../../../../../helpers/nip21";
import { createLinkifiedProps } from "../../../../../helpers/text-links";

/**
 * Full variant component for displaying Kind 1 (short text note) events
 */
const FullKind1Component: Component<{ event: NostrEvent }> = (props) => {
  // Format creation time as relative
  const createdAt = createMemo(() => {
    return formatTimeAgo(props.event.created_at);
  });
  
  // Get e tags for thread information
  const rootTag = createMemo(() => {
    return props.event.tags.find(tag => 
      tag[0] === 'e' && tag.length >= 4 && tag[3] === 'root'
    );
  });
  
  const replyTag = createMemo(() => {
    return props.event.tags.find(tag => 
      tag[0] === 'e' && tag.length >= 4 && tag[3] === 'reply'
    );
  });
  
  // Get hashtags (t tags)
  const hashtags = createMemo(() => {
    return props.event.tags
      .filter(tag => tag[0] === 't' && tag.length >= 2)
      .map(tag => tag[1]);
  });
  
  // Check if this is a reply or part of a thread
  const isReply = createMemo(() => {
    return rootTag() !== undefined || replyTag() !== undefined;
  });
  
  // Convert hex pubkey to npub and shorten it
  const shortenedPubkey = createMemo(() => {
    const npub = hexToNpub(props.event.pubkey);
    return shortenEntity(npub || props.event.pubkey);
  });
  
  // Create nostr URI for author
  const authorUri = createMemo(() => {
    return createPubkeyURI(props.event.pubkey);
  });
  
  // Create nostr URI for reply source
  const replySourceUri = createMemo(() => {
    const tag = replyTag() || rootTag();
    if (!tag) return '';
    
    return createEventURI(tag[1]);
  });
  
  // Get shortened event ID for display
  const shortenedEventUri = createMemo(() => {
    const tag = replyTag() || rootTag();
    if (!tag) return '';
    
    // Use the tag value directly, shortenEntity will handle the format
    return shortenEntity(tag[1]);
  });
  
  return (
    <div class="flex flex-col gap-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 max-w-full min-w-full">
      {/* Header with author and reply indicators */}
      <div class="flex justify-between items-center text-sm">
        {/* Author link on left */}
        <a 
          href={authorUri()} 
          class="text-gray-600 dark:text-gray-200 bg-yellow-400 hover:bg-yellow-500 dark:bg-purple-700 dark:hover:bg-purple-800 rounded px-2 py-1"
        >
          {shortenedPubkey()}
        </a>
        <div class="text-xs text-gray-500 dark:text-gray-400">
          {createdAt()}
        </div>
      </div>
      
      {/* Content */}
      <div 
        class="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words"
        {...createLinkifiedProps(props.event.content, "text-yellow-500 dark:text-purple-400 hover:underline")}
      />

      {/* Hashtags */}
      <Show when={hashtags().length > 0}>
        <div class="flex flex-wrap gap-2">
          <For each={hashtags()}>
            {(hashtag) => (
              <span class="text-xs rounded bg-gray-100 dark:bg-gray-700 px-2 py-1 text-gray-800 dark:text-gray-200">
                #{hashtag}
              </span>
            )}
          </For>
        </div>
      </Show>

      <Show when={isReply() && replySourceUri()}>
        <div>
          <a 
            href={replySourceUri()} 
            class="text-xs text-yellow-400 dark:text-purple-400 bg-gray-100 dark:bg-gray-700 rounded px-2 py-1"
          >
            Reply to {shortenedEventUri()}
          </a>
        </div>
      </Show>
    </div>
  );
};

export default FullKind1Component; 