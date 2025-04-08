import { EventKindProps } from "../../../types";

/**
 * Component for displaying the event kind
 */
export default function EventKind(props: EventKindProps) {
  return (
    <div class="flex items-center w-full bg-gray-100 dark:bg-gray-800 rounded overflow-hidden border border-gray-200 dark:border-gray-600">
      <div class="bg-gray-200 dark:bg-gray-600 px-2 py-1 font-semibold text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap">
        Kind
      </div>
      <div class="px-2 py-1 text-sm dark:text-gray-200">
        {props.kind}
      </div>
    </div>
  );
} 