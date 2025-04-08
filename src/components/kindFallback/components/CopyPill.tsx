import { createSignal } from "solid-js";
import { IoCheckmark } from 'solid-icons/io'
import { FiCopy } from 'solid-icons/fi'
import { CopyPillProps } from "../../../types";

/**
 * A compact pill-like component with a label and copyable text
 */
export default function CopyPill(props: CopyPillProps) {
  const [copied, setCopied] = createSignal(false);
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(props.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };
  
  const textClass = props.variant === "monospace" 
    ? "font-mono text-sm" 
    : "text-sm";

  // Determine styling based on status
  const borderColor = () => {
    if (props.status === undefined || props.status === null) return "border-gray-200 dark:border-gray-600";
    return props.status 
      ? "border-green-500 dark:border-green-600" 
      : "border-red-500 dark:border-red-600";
  };

  // Determine label background color
  const labelClass = () => {    
    if (props.status === undefined || props.status === null) return "bg-gray-200 dark:bg-gray-600";
    return props.status 
      ? "bg-green-500 dark:bg-green-600" 
      : "bg-red-500 dark:bg-red-600";
  };

  // Determine copy background color
  const copyClass = () => {    
    if (props.status === undefined || props.status === null) return "bg-gray-200 dark:bg-gray-600";
    return props.status 
      ? "bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700" 
      : "bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700";
  };
  
  return (
    <div class={`flex items-center items-stretch w-full bg-gray-100 dark:bg-gray-800 rounded overflow-hidden border ${borderColor()}`}>
      {/* Label part */}
      <div class={`${labelClass()} px-2 py-1 font-semibold text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap`}>
        {props.label}
      </div>
      
      {/* Text part - truncated with ellipsis */}
      <div 
        class={`px-2 py-1 flex-grow ${textClass} truncate dark:text-gray-200`}
        title={props.text}
      >
        {props.text}
      </div>
      
      {/* Copy button */}
      <button 
        onClick={copyToClipboard}
        class={`cursor-pointer flex items-center justify-center px-2 py-1 ${copyClass()} text-sm transition-colors whitespace-nowrap dark:text-gray-200`}
        title="Copy to clipboard"
      >
        {copied() ? <IoCheckmark /> : <FiCopy />}
      </button>
    </div>
  );
} 