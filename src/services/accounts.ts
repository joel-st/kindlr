/**
 * Account management service.
 * Handles user accounts including creation, persistence, and active account tracking.
 * Uses local storage for persistence and applesauce-accounts for the core functionality.
 */

import { AccountManager } from "applesauce-accounts";
import { registerCommonAccountTypes } from "applesauce-accounts/accounts";

/**
 * The global account manager instance for the application.
 */
export const accounts = new AccountManager();

// Adds the common account types to the manager
registerCommonAccountTypes(accounts);

/**
 * Load saved accounts from local storage and set up persistence.
 * Any changes to accounts will be automatically saved to local storage.
 */
const json = JSON.parse(localStorage.getItem("accounts") || "[]");
await accounts.fromJSON(json);
accounts.accounts$.subscribe(() => {
  localStorage.setItem("accounts", JSON.stringify(accounts.toJSON()));
});

/**
 * Restore the active account from local storage and set up persistence.
 * Any change to the active account will be saved to local storage.
 */
if (localStorage.getItem("active")) {
  accounts.setActive(localStorage.getItem("active")!);
}
accounts.active$.subscribe((account) => {
  if (account) localStorage.setItem("active", account.id);
  else localStorage.removeItem("active");
});
