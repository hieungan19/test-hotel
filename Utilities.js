export function capitalizeSentences(str) {
  return str.replace(/(?:^|\.\s*)([a-z])/g, (match) => match.toUpperCase()); // Viết hoa chữ cái đầu câu
}
