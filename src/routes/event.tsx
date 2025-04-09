import { useParams } from "@solidjs/router";
import { EVENT_KINDS } from "../const";

export default function EventView() {
  const params = useParams();
  const kindNumber = parseInt(params.kind);
  const eventId = params.eventId;
  
  const kindInfo = EVENT_KINDS.find(k => k.kind === kindNumber);

  if (!kindInfo) {
    return <div>Kind {kindNumber} not found</div>;
  }

  return (
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">
        Event {eventId}
        <span class="text-lg font-normal ml-2">
          (Kind {kindInfo.kind}: {kindInfo.name})
        </span>
      </h1>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p class="mb-2"><span class="font-semibold">Event ID:</span> {eventId}</p>
        <p class="mb-2"><span class="font-semibold">Kind:</span> {kindInfo.name}</p>
        <p class="mb-4"><span class="font-semibold">Description:</span> {kindInfo.description}</p>
        {/* Here you would typically fetch and display the actual event data */}
        <div class="text-gray-500 dark:text-gray-400 italic">
          Event data will be displayed here
        </div>
      </div>
    </div>
  );
} 