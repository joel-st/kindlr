/**
 * Kind 0 specialized component for displaying user metadata
 * Implements the UI for Nostr user profiles (Kind 0 events)
 */

import { Component, Show } from "solid-js";
import { NostrEvent } from "nostr-tools";
import { parseProfileMetadata, getDisplayName, getProfilePicture, getProfileBanner } from "../../../helpers/profile";
import { IoGlobeOutline } from "solid-icons/io";
import { FaSolidAt } from "solid-icons/fa";
import { SiLightning } from "solid-icons/si";
import { shortenEntity } from "../../../helpers/nip19";
import { getContrastTextColor } from "../../../helpers/colors";

/**
 * Component for displaying Kind 0 (user metadata) events
 */
const Kind0Component: Component<{ event: NostrEvent }> = (props) => {
  // Parse profile metadata from event content
  const metadata = () => parseProfileMetadata(props.event);
  
  // Get display name with fallbacks
  const displayName = () => getDisplayName(metadata(), props.event.pubkey);
  
  // Get profile picture with fallback color
  const profilePic = () => getProfilePicture(metadata(), props.event.pubkey);
  
  // Get profile banner with fallback color
  const profileBanner = () => getProfileBanner(metadata(), props.event.pubkey);
  
  // Get text contrast color for the profile picture fallback color
  const pictureTextColor = () => getContrastTextColor(profilePic().fallbackColor);
  
  // Get text contrast color for the banner fallback color
  const bannerTextColor = () => getContrastTextColor(profileBanner().fallbackColor);
  
  return (
    <div class="flex flex-col gap-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      {/* Banner */}
      <div 
        class="h-36 relative"
        style={{
          "background-color": profileBanner().fallbackColor,
          "color": bannerTextColor()
        }}
      >
        <Show when={profileBanner().url}>
          <img 
            src={profileBanner().url!} 
            alt="Profile banner" 
            class="w-full h-full object-cover"
            onError={(e) => {
              // Hide image on error
              e.currentTarget.style.display = 'none';
            }}
          />
        </Show>
        
        {/* Profile picture (positioned overlapping the banner) */}
        <div 
          class="absolute left-6 bottom-0 transform translate-y-1/2 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-md"
          style={{
            width: '90px',
            height: '90px',
            "background-color": profilePic().fallbackColor,
            "color": pictureTextColor()
          }}
        >
          <Show 
            when={profilePic().url} 
            fallback={
              <div class="w-full h-full flex items-center justify-center text-lg font-semibold">
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
                  <div class="w-full h-full flex items-center justify-center text-lg font-semibold" style="color: ${pictureTextColor()}">
                    ${displayName().substring(0, 2).toUpperCase()}
                  </div>
                `;
              }}
            />
          </Show>
        </div>
      </div>
      
      {/* Profile info */}
      <div class="mt-12 px-6 pb-4 flex flex-col gap-3">
        {/* Name and identifier section */}
        <div>
          <h2 class="font-bold text-lg dark:text-white">
            {displayName()}
          </h2>
          <div class="text-sm text-gray-500 dark:text-gray-400 font-mono">
            {shortenEntity(props.event.pubkey)}
          </div>
        </div>
        
        {/* About section */}
        <Show when={metadata().about?.trim()}>
          <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words text-sm">
            {metadata().about}
          </p>
        </Show>
        
        {/* Additional metadata */}
        <div class="flex flex-col gap-2 mt-2">
          {/* Website */}
          <Show when={metadata().website?.trim()}>
            <div class="flex items-center gap-2 text-sm">
              <IoGlobeOutline class="text-yellow-500 dark:text-purple-400" />
              <a 
                href={metadata().website?.startsWith('http') ? metadata().website : `https://${metadata().website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                class="text-blue-600 dark:text-blue-400 hover:underline truncate"
              >
                {metadata().website}
              </a>
            </div>
          </Show>
          
          {/* NIP-05 identifier */}
          <Show when={metadata().nip05?.trim()}>
            <div class="flex items-center gap-2 text-sm">
              <FaSolidAt class="text-yellow-500 dark:text-purple-400" />
              <span class="text-gray-700 dark:text-gray-300 truncate">
                {metadata().nip05}
              </span>
            </div>
          </Show>
          
          {/* Lightning address */}
          <Show when={metadata().lud16?.trim() || metadata().lud06?.trim()}>
            <div class="flex items-center gap-2 text-sm">
              <SiLightning class="text-yellow-500 dark:text-purple-400" />
              <span class="text-gray-700 dark:text-gray-300 truncate">
                {metadata().lud16 || metadata().lud06}
              </span>
            </div>
          </Show>
          
          {/* Account deleted notice */}
          <Show when={metadata().deleted === true}>
            <div class="mt-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-3 py-2 rounded-md text-sm">
              This account has been deleted
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default Kind0Component;
