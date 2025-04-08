import CopyPill from "./CopyPill";
import { EventSignatureProps } from "../../../types";

/**
 * Component for displaying an event signature with copy functionality
 */
export default function EventSignature(props: EventSignatureProps) {
  return (
    <CopyPill 
      label="Signature" 
      text={props.signature}
      variant="monospace" 
    />
  );
} 