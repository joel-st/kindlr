/**
 * Full variant of Kind 3 specialized component for displaying follow lists
 * Implements the complete UI for Nostr follow lists (Kind 3 events)
 */

import { Component, createMemo, For } from "solid-js";
import { NostrEvent } from "nostr-tools";
import { formatTimeAgo } from "../../../../../helpers/date";
import { shortenEntity, hexToNpub } from "../../../../../helpers/nip19";
import { createPubkeyURI } from "../../../../../helpers/nip21";

/**
 * Full variant component for displaying Kind 3 (follow list) events
 */
const FullKind3Component: Component<{ event: NostrEvent }> = (props) => {
  // Format creation time as relative
  const createdAt = createMemo(() => {
    return formatTimeAgo(props.event.created_at);
  });
  
  // Get followed profiles from p tags
  const follows = createMemo(() => {
    return props.event.tags.filter(tag => tag[0] === 'p' && tag.length >= 2);
  });
  
  // Count of followed profiles
  const followCount = createMemo(() => {
    return follows().length;
  });

  return (
    <div class="flex flex-col gap-3 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 max-w-full min-w-full max-h-full min-h-full">
      {/* Header with follow count and timestamp */}
      <div class="flex justify-between items-center text-sm">
        <div class="font-medium text-gray-800 dark:text-gray-200">
          Following {followCount()} profiles
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400">
          {createdAt()}
        </div>
      </div>
      
      {/* Scrollable container for followed profiles */}
      <div class="overflow-y-auto stretch">
        <div class="flex flex-wrap gap-2">
          <For each={follows()}>
            {(follow) => {
              const pubkey = follow[1];
              const relay = follow.length > 2 ? follow[2] : undefined;
              const petname = follow.length > 3 ? follow[3] : undefined;
              
              // Convert hex pubkey to npub and shorten it
              const shortenedPubkey = hexToNpub(pubkey) ? 
                shortenEntity(hexToNpub(pubkey) || '') : shortenEntity(pubkey);
              
              // Create nostr URI for profile
              const profileUri = createPubkeyURI(pubkey);
              
              return (
                <a 
                  href={profileUri} 
                  class="text-xs text-yellow-400 dark:text-purple-400 bg-gray-100 dark:bg-gray-700 rounded px-2 py-1"
                  title={petname ? `${petname}${relay ? ` (${relay})` : ''}` : relay ? relay : ''}
                >
                  {shortenedPubkey}
                  {petname && <span class="ml-1 text-xs">{petname}</span>}
                </a>
              );
            }}
          </For>
        </div>
      </div>
    </div>
  );
};

export default FullKind3Component; 