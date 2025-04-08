/**
 * Types related to Nostr events and their display components
 */

/**
 * Props for EventContent component
 */
export interface EventContentProps {
  content: string;
}

/**
 * Props for EventCreatedAt component
 */
export interface EventCreatedAtProps {
  createdAt: number;
}

/**
 * Props for EventId component
 */
export interface EventIdProps {
  id: string;
}

/**
 * Props for EventKind component
 */
export interface EventKindProps {
  kind: number;
}

/**
 * Props for EventPubkey component
 */
export interface EventPubkeyProps {
  pubkey: string;
}

/**
 * Props for EventSignature component
 */
export interface EventSignatureProps {
  signature: string;
}

/**
 * Props for EventTags component
 */
export interface EventTagsProps {
  tags: string[][];
} 