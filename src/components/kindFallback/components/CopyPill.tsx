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
  
  return (
    <div class="flex items-center items-stretch w-full bg-gray-100 dark:bg-gray-800 rounded overflow-hidden border border-gray-200 dark:border-gray-600">
      {/* Label part */}
      <div class="bg-gray-200 dark:bg-gray-600 px-2 py-1 font-semibold text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap">
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
        class="cursor-pointer flex items-center justify-center px-2 py-1 bg-yellow-400 dark:bg-purple-700 hover:bg-yellow-500 dark:hover:bg-purple-800 text-sm transition-colors whitespace-nowrap dark:text-gray-200"
        title="Copy to clipboard"
      >
        {copied() ? <IoCheckmark /> : <FiCopy />}
      </button>
    </div>
  );
} 