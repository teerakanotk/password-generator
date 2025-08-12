const CHAR_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "@#",
};

const SIMILAR_CHARS = new Set([
  "i",
  "I",
  "l",
  "1",
  "o",
  "O",
  "0",
  "S",
  "5",
  "Z",
  "2",
  "B",
  "8",
  "G",
  "6",
  "Q",
]);

export function genpass(options, length) {
  const flags = new Set(options);

  const filterSimilar = (chars) =>
    flags.has("noSimilar")
      ? chars
          .split("")
          .filter((ch) => !SIMILAR_CHARS.has(ch))
          .join("")
      : chars;

  const availableSets = Object.entries(CHAR_SETS)
    .filter(([key]) => flags.has(key))
    .map(([_, chars]) => filterSimilar(chars));

  const allChars = availableSets.join("");
  if (!allChars) return "";

  if (flags.has("noDuplicated") && new Set(allChars).size < length) return "";

  const usedChars = new Set();
  let passwordChars = [];

  // Step 1: Enforce one character from each selected set
  for (const set of availableSets) {
    const char = pickRandomChar(set, flags.has("noDuplicated"), usedChars);
    if (!char) return "";
    passwordChars.push(char);
    usedChars.add(char);
  }

  // Step 2: Fill remaining characters
  const remainingLength = length - passwordChars.length;
  for (let i = 0; i < remainingLength; i++) {
    const char = pickRandomChar(allChars, flags.has("noDuplicated"), usedChars);
    if (!char) return "";
    passwordChars.push(char);
    usedChars.add(char);
  }

  // Step 3: Shuffle
  passwordChars = shuffleArray(passwordChars);

  // Step 4: Ensure starts with letter
  if (flags.has("beginWithLetter")) {
    const letters = [
      ...(flags.has("uppercase") ? filterSimilar(CHAR_SETS.uppercase) : ""),
      ...(flags.has("lowercase") ? filterSimilar(CHAR_SETS.lowercase) : ""),
    ];

    if (letters.length === 0) return "";

    const letterIndex = passwordChars.findIndex((ch) => letters.includes(ch));
    if (letterIndex === -1) {
      const forcedLetter = pickRandomChar(letters.join(""), false);
      if (!forcedLetter) return "";
      if (flags.has("noDuplicated")) usedChars.delete(passwordChars[0]);
      passwordChars[0] = forcedLetter;
      usedChars.add(forcedLetter);
    } else {
      const temp = passwordChars[0];
      passwordChars[0] = passwordChars[letterIndex];
      passwordChars[letterIndex] = temp;
    }
  }

  return passwordChars.join("");
}

// Pick a random character, optionally avoiding duplicates
function pickRandomChar(chars, avoidDuplicate, usedSet) {
  const pool =
    avoidDuplicate && usedSet
      ? chars.split("").filter((ch) => !usedSet.has(ch))
      : chars.split("");

  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

// Shuffle utility
function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
