import CopyPill from "./CopyPill";
import { EventPubkeyProps } from "../../../types";

/**
 * Component for displaying an event pubkey with copy functionality
 */
export default function EventPubkey(props: EventPubkeyProps) {
  return (
    <CopyPill 
      label="Pubkey" 
      text={props.pubkey}
      variant="monospace" 
    />
  );
} 