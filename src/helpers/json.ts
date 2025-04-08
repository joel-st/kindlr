import { isJsonContent } from './event-content';

/**
 * Tries to parse a string as JSON
 * @param content The string to parse
 * @returns The parsed JSON object or null if parsing fails
 */
export function getParsedJson(content: string): any {
  try {
    return JSON.parse(content);
  } catch (e) {
    return null;
  }
}

/**
 * Gets the number of keys in a JSON object
 * @param content The JSON string to count keys for
 * @returns The number of keys or 0 if content is not valid JSON
 */
export function getKeyCount(content: string): number {
  if (!isJsonContent(content)) return 0;
  
  try {
    return Object.keys(getParsedJson(content)).length;
  } catch (e) {
    return 0;
  }
} 