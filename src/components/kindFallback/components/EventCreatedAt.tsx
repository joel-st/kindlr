import { formatTimeAgo } from "../../../helpers/date";
import { EventCreatedAtProps } from "../../../types";

/**
 * Component for displaying the event creation timestamp in a human-readable format
 */
export default function EventCreatedAt(props: EventCreatedAtProps) {
  return (
    <div class="w-full">
      <div class="flex items-center items-stretch w-full bg-gray-100 dark:bg-gray-800 rounded overflow-hidden border border-gray-200 dark:border-gray-600">
        <div class="bg-gray-200 dark:bg-gray-600 px-2 py-1 font-semibold text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap">
          Created
        </div>
        <div class="px-2 py-1 text-sm dark:text-gray-200">
          {formatTimeAgo(props.createdAt)}
        </div>
      </div>
    </div>
  );
} 