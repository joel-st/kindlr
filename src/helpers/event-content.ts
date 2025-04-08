/**
 * Checks if a string is valid JSON content
 * @param content The string to check
 * @returns True if the content is valid JSON, false otherwise
 */
export function isJsonContent(content: string): boolean {
  if (!content) return false;
  
  // Trim whitespace
  const trimmed = content.trim();
  
  // Quick reject for obvious non-JSON content
  // Check if it doesn't start and end with curly braces or square brackets
  if (!(
    (trimmed.startsWith('{') && trimmed.endsWith('}')) || 
    (trimmed.startsWith('[') && trimmed.endsWith(']'))
  )) {
    return false;
  }
  
  try {
    // Try to parse the content as JSON
    const parsed = JSON.parse(trimmed);
    
    // Check if the parsed result is actually an object or array, not just a string or primitive
    if (typeof parsed !== 'object' || parsed === null) {
      return false;
    }
    
    // Check that it has at least one property
    if (Array.isArray(parsed)) {
      return parsed.length > 0;
    } else {
      return Object.keys(parsed).length > 0;
    }
  } catch (e) {
    return false;
  }
} 