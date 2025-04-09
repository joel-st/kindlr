/**
 * Compact variant of Kind 3 specialized component for displaying follow lists
 * Implements a condensed UI for Nostr follow lists (Kind 3 events)
 */

import { Component, createMemo, For, Show } from "solid-js";
import { NostrEvent } from "nostr-tools";
import { formatTimeAgo } from "../../../../../helpers/date";
import { hexToNpub, shortenEntity } from "../../../../../helpers/nip19";
import { createPubkeyURI } from "../../../../../helpers/nip21";

/**
 * Maximum number of profile avatars to show in the compact view
 */
const MAX_VISIBLE_AVATARS = 5;

/**
 * Compact variant component for displaying Kind 3 (follow list) events
 */
const CompactKind3Component: Component<{ event: NostrEvent }> = (props) => {
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
  
  // Get profiles to display (limited number)
  const visibleProfiles = createMemo(() => {
    return follows().slice(0, MAX_VISIBLE_AVATARS);
  });
  
  // Check if there are more profiles than we're showing
  const hasMoreProfiles = createMemo(() => {
    return followCount() > MAX_VISIBLE_AVATARS;
  });

  return (
    <div class="flex flex-col rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 max-w-full">
      <div class="flex flex-col">
        <div class="text-sm text-gray-800 dark:text-gray-200">
          Following {followCount()} profiles
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400">
          {createdAt()}
        </div>
      </div>
      
      {/* Overlapping profile elements */}
      <div class="mt-2 flex">
        <div class="flex -space-x-3">
          <For each={visibleProfiles()}>
            {(follow) => {
              const pubkey = follow[1];
              const profileUri = createPubkeyURI(pubkey);
              const shortenedPubkey = hexToNpub(pubkey) ? 
                shortenEntity(hexToNpub(pubkey) || '') : shortenEntity(pubkey);
              
              // Create a simple colored avatar with initials
              const backgroundColor = `hsl(${(parseInt(pubkey.slice(0, 6), 16) % 360)}, 70%, 70%)`;
              const initials = shortenedPubkey.slice(0, 2).toUpperCase();
              
              return (
                <a 
                  href={profileUri}
                  class="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800"
                  style={{ "background-color": backgroundColor }}
                  title={shortenedPubkey}
                >
                  <div class="flex h-full w-full items-center justify-center text-xs text-white font-medium">
                    {initials}
                  </div>
                </a>
              );
            }}
          </For>
          
          {/* Show count of additional profiles */}
          <Show when={hasMoreProfiles()}>
            <div 
              class="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-200 dark:bg-gray-600"
            >
              <div class="flex h-full w-full items-center justify-center text-xs text-gray-600 dark:text-gray-200 font-medium">
                +{followCount() - MAX_VISIBLE_AVATARS}
              </div>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default CompactKind3Component; 