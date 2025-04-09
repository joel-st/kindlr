import { useParams } from "@solidjs/router";
import { EVENT_KINDS } from "../const";

export default function KindView() {
  const params = useParams();
  const kindNumber = parseInt(params.kind);
  
  const kindInfo = EVENT_KINDS.find(k => k.kind === kindNumber);

  if (!kindInfo) {
    return <div>Kind {kindNumber} not found</div>;
  }

  return (
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Kind {kindInfo.kind}: {kindInfo.name}</h1>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p class="mb-2"><span class="font-semibold">Short Description:</span> {kindInfo.short_description}</p>
        <p class="mb-2"><span class="font-semibold">NIP:</span> {kindInfo.nip}</p>
        <p class="mb-4"><span class="font-semibold">Description:</span> {kindInfo.description}</p>
        <div class="flex gap-4">
          <a href={kindInfo.kurl} target="_blank" rel="noopener noreferrer" 
             class="text-blue-600 dark:text-blue-400 hover:underline">
            View on nostrbook.dev
          </a>
          <a href={kindInfo.nurl} target="_blank" rel="noopener noreferrer"
             class="text-blue-600 dark:text-blue-400 hover:underline">
            View NIP
          </a>
        </div>
      </div>
    </div>
  );
} 