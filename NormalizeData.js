import { capitalizeSentences } from './Utilities.js';
// standardizes a string by trimming, converting it to lowercase, and capitalizing sentences
export function normalizeString(str) {
  if (str && typeof str === 'string' && str.trim()) {
    return capitalizeSentences(str.trim().toLowerCase());
  }
  return str;
}

//applies this normalization to all string elements in an array
export function normalizeArray(arr) {
  return arr
    ? arr.map((item) =>
        typeof item === 'string' ? normalizeString(item) : item
      )
    : [];
}
