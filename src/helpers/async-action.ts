/**
 * Asynchronous action utility.
 * Provides a wrapper for asynchronous operations with loading state and toast notifications.
 */

import { createSignal } from "solid-js";
import toast from "solid-toast";

/**
 * Creates a wrapper for an asynchronous operation with loading state and toast notifications.
 * 
 * @param operation - The asynchronous function to wrap
 * @param toasts - Optional toast messages to display on success or error
 * @returns An object containing the wrapped function and a loading signal
 */
export function asyncAction<Args extends Array<any>, T extends unknown>(
  operation: (...args: Args) => Promise<T>,
  toasts?: { success?: string; error?: string },
) {
  const [loading, setLoading] = createSignal(false);
  
  /**
   * Executes the wrapped operation with loading state management and toast notifications.
   * 
   * @param args - Arguments to pass to the operation
   * @returns Promise from the original operation
   */
  const run = async (...args: Args) => {
    setLoading(true);
    const p = operation(...args);

    p.then(() => toasts?.success && toast.success(toasts?.success))
      .catch((e) => toast.error(toasts?.error ?? e.message))
      .finally(() => {
        setLoading(false);
      });

    return p;
  };

  return {
    run,
    loading,
  };
}
