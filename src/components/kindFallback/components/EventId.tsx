import CopyPill from "./CopyPill";
import { EventIdProps } from "../../../types";

/**
 * Component for displaying the event ID with copy functionality
 */
export default function EventId(props: EventIdProps) {
  return (
    <CopyPill 
      label="ID" 
      text={props.id}
      variant="monospace"
    />
  );
} 