import { NostrEvent } from "nostr-tools";
import EventId from "./components/EventId";
import EventPubkey from "./components/EventPubkey";
import EventCreatedAt from "./components/EventCreatedAt";
import EventKind from "./components/EventKind";
import EventTags from "./components/EventTags";
import EventContent from "./components/EventContent";
import EventSignature from "./components/EventSignature";

/**
 * Base event component that parses and displays all event fields
 * Used as a fallback when no specific component exists for an event kind
 */
export default function Fallback(props: { event: NostrEvent }) {  
  return (
    <div class="flex flex-col gap-3">
      <EventId id={props.event.id} />
      <EventPubkey pubkey={props.event.pubkey} />
      <div class="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-3">
        <EventCreatedAt createdAt={props.event.created_at} />
        <EventKind kind={props.event.kind} />
      </div>
      <EventContent content={props.event.content} />
      <EventTags tags={props.event.tags} />
      <EventSignature 
        signature={props.event.sig} 
        event={props.event}
      />
    </div>
  );
}
