/**
 * Types related to UI components
 */

/**
 * Props for CopyPill component
 */
export interface CopyPillProps {
  label: string;
  text: string;
  variant?: "default" | "monospace";
  status?: boolean | null; // true = valid, false = invalid, null = neutral
} 