import { createSignal, onMount } from "solid-js";
import { verifyEvent } from "nostr-tools";
import CopyPill from "./CopyPill";
import { EventSignatureProps } from "../../../types";

/**
 * Component for displaying an event signature with copy functionality
 */
export default function EventSignature(props: EventSignatureProps) {
  const [isValid, setIsValid] = createSignal<boolean | null>(null);

  onMount(() => {
    if (props.event) {
      try {
        // Use the complete event object for verification
        const valid = verifyEvent(props.event);
        setIsValid(valid);
      } catch (error) {
        console.error("Error verifying signature:", error);
        setIsValid(false);
      }
    }
  });

  return (
    <CopyPill 
      label="Signature" 
      text={props.signature}
      variant="monospace" 
      status={isValid()}
    />
  );
} 