/**
 * Toast notification utility for asynchronous operations.
 * Provides a wrapper for showing toast notifications during async operations with loading/success/error states.
 */

import { createSignal } from "solid-js";
import toast, { Renderable, ValueOrFunction } from "solid-toast";

/**
 * Creates a wrapper for an asynchronous operation with toast notifications for loading, success, and error states.
 * 
 * @param operation - The asynchronous function to wrap
 * @param options - Toast configuration for loading, success, and error states
 * @returns An object containing the wrapped function and a loading signal
 */
export function toastOperation<Args extends Array<any>, T extends unknown>(
  operation: (...args: Args) => Promise<T>,
  options: {
    loading: Renderable;
    success: ValueOrFunction<Renderable, T>;
    error: ValueOrFunction<Renderable, any>;
  },
) {
  const [loading, setLoading] = createSignal(false);
  
  /**
   * Executes the wrapped operation with toast notifications for each state.
   * 
   * @param args - Arguments to pass to the operation
   * @returns Promise from toast.promise
   */
  const run = async (...args: Args) => {
    setLoading(true);
    const p = operation(...args);
    p.finally(() => {
      setLoading(false);
    });

    return toast.promise(p, options);
  };

  return {
    run,
    loading,
  };
}
