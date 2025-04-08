/**
 * Action service for Nostr event creation and execution.
 * Provides a factory for creating Nostr events and an action hub for executing structured actions.
 * Integrates with the application's event store and account system for signing events.
 */

import { EventFactory } from "applesauce-factory";
import { ActionHub } from "applesauce-actions";
import { eventStore } from "./stores";
import { accounts } from "./accounts";

/**
 * The event factory used to build and sign Nostr events.
 * Uses the active account's signer for event signing.
 */
export const factory = new EventFactory({
  // accounts.signer is a NIP-07 signer that signs with the currently active account
  signer: accounts.signer,
});

/**
 * The action hub for executing structured actions against the event store.
 * Provides a higher-level API for common operations like following users, liking posts, etc.
 */
export const actions = new ActionHub(eventStore, factory);
