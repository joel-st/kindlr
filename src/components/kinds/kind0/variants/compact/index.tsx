/**
 * Compact variant of Kind 0 specialized component for displaying user metadata
 * Shows a minimal profile with just the profile image, username and public key
 */

import { Component, Show } from "solid-js";
import { NostrEvent } from "nostr-tools";
import { parseProfileMetadata, getDisplayName, getProfilePicture } from "../../../../../helpers/profile";
import { shortenEntity } from "../../../../../helpers/nip19";
import { getContrastTextColor } from "../../../../../helpers/colors";

/**
 * Compact variant component for displaying Kind 0 (user metadata) events
 */
const CompactKind0Component: Component<{ event: NostrEvent }> = (props) => {
  // Parse profile metadata from event content
  const metadata = () => parseProfileMetadata(props.event);
  
  // Get display name with fallbacks
  const displayName = () => getDisplayName(metadata(), props.event.pubkey);
  
  // Get profile picture with fallback color
  const profilePic = () => getProfilePicture(metadata(), props.event.pubkey);
  
  // Get text contrast color for the profile picture fallback color
  const pictureTextColor = () => getContrastTextColor(profilePic().fallbackColor);
  
  return (
    <div class="flex items-center gap-3 p-2 pr-4 rounded-lg bg-gray-100 dark:bg-gray-700 w-auto">
      {/* Profile picture */}
      <div 
        class="rounded-full overflow-hidden"
        style={{
          width: '40px',
          height: '40px',
          "background-color": profilePic().fallbackColor,
          "color": pictureTextColor()
        }}
      >
        <Show 
          when={profilePic().url} 
          fallback={
            <div class="w-full h-full flex items-center justify-center text-sm font-semibold">
              {displayName().substring(0, 2).toUpperCase()}
            </div>
          }
        >
          <img 
            src={profilePic().url!} 
            alt="Profile" 
            class="w-full h-full object-cover"
            onError={(e) => {
              // Hide image on error
              e.currentTarget.style.display = 'none';
              // Show fallback div
              e.currentTarget.parentElement!.innerHTML = `
                <div class="w-full h-full flex items-center justify-center text-sm font-semibold" style="color: ${pictureTextColor()}">
                  ${displayName().substring(0, 2).toUpperCase()}
                </div>
              `;
            }}
          />
        </Show>
      </div>
      
      {/* Name and identifier */}
      <div class="flex flex-col">
        <span class="font-medium dark:text-white">
          {displayName()}
        </span>
        <span class="text-xs text-gray-500 dark:text-gray-400 font-mono">
          {shortenEntity(props.event.pubkey)}
        </span>
      </div>
    </div>
  );
};

export default CompactKind0Component; 