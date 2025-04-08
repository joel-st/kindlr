/**
 * Application lifecycle and relay management service.
 * Handles user account initialization, managing active mailboxes, 
 * and configuring application-wide relay connections.
 */

import { combineLatest, filter, map, of, startWith, switchMap } from "rxjs";
import { kinds } from "nostr-tools";
import { MailboxesQuery } from "applesauce-core/queries";

import { accounts } from "./accounts";
import { replaceableLoader } from "./loaders";
import { queryStore } from "./stores";
import { rxNostr } from "./nostr";
import { defaultRelays } from "./settings";

/**
 * Observable of the active user's mailboxes.
 * Emits the mailboxes when a user is active and has loaded mailboxes.
 */
export const activeMailboxes = accounts.active$.pipe(
  filter((account) => !!account),
  switchMap((account) =>
    queryStore.createQuery(MailboxesQuery, account.pubkey),
  ),
  startWith(undefined),
);

/**
 * Observable of the active relays to use for the application.
 * Uses either the user's configured outbox relays or the default relays.
 */
export const appRelays = accounts.active$.pipe(
  switchMap((account) =>
    account
      ? queryStore
          .createQuery(MailboxesQuery, account.pubkey)
          .pipe(map((mailboxes) => mailboxes?.outboxes))
      : defaultRelays,
  ),
);

/**
 * Subscription that loads the user's metadata, contacts, and relay list
 * when the account changes and mailboxes are loaded.
 */
combineLatest([accounts.active$, activeMailboxes]).subscribe(
  ([account, mailboxes]) => {
    if (!account) return;

    const relays = mailboxes && mailboxes.outboxes;

    // load the users metadata
    replaceableLoader.next({
      pubkey: account.pubkey,
      kind: kinds.Metadata,
      relays,
    });
    replaceableLoader.next({
      pubkey: account.pubkey,
      kind: kinds.Contacts,
      relays,
    });
    replaceableLoader.next({
      pubkey: account.pubkey,
      kind: kinds.RelayList,
      relays,
    });
  },
);

/**
 * Subscription that configures the default relays for the Nostr client
 * based on the active user's mailboxes or the application default relays.
 */
combineLatest([
  accounts.active$.pipe(
    switchMap((account) =>
      account
        ? queryStore.createQuery(MailboxesQuery, account.pubkey)
        : of(undefined),
    ),
  ),
  defaultRelays,
]).subscribe(([mailboxes, defaultRelays]) => {
  if (mailboxes) {
    console.log("Setting default relays to", mailboxes.outboxes);
    rxNostr.setDefaultRelays(mailboxes.outboxes);
  } else {
    console.log("Setting default relays to", defaultRelays);
    rxNostr.setDefaultRelays(defaultRelays);
  }
});
