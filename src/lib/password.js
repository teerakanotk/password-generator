// Character sets
const CHAR_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  number: "0123456789",
  symbol: "@#",
};

// Characters often considered "similar" and hard to distinguish
const SIMILAR_CHARS = new Set(["i", "I", "l", "1", "o", "O", "0", "S", "5"]);

//  Generate a password based on given options.
export function generatePassword(options, length) {
  const availableSets = buildAvailableSets(options);

  const allChars = availableSets.join("");
  if (!allChars) return "";

  if (options.excludeDuplicate && new Set(allChars).size < length) {
    return ""; // Not enough unique characters
  }

  const usedChars = new Set();
  let passwordChars = [];

  // Step 1: Ensure one character from each selected set
  for (const set of availableSets) {
    const char = pickRandomChar(set, options.excludeDuplicate, usedChars);
    if (!char) return "";
    passwordChars.push(char);
    usedChars.add(char);
  }

  // Step 2: Fill remaining characters
  const remainingLength = length - passwordChars.length;
  for (let i = 0; i < remainingLength; i++) {
    const char = pickRandomChar(allChars, options.excludeDuplicate, usedChars);
    if (!char) return "";
    passwordChars.push(char);
    usedChars.add(char);
  }

  // Step 3: Shuffle result
  passwordChars = shuffleArray(passwordChars);

  // Step 4: Enforce starting with a letter if required
  if (options.beginWithLetter) {
    passwordChars = ensureStartsWithLetter(passwordChars, options, usedChars);
  }

  return passwordChars.join("");
}

/* -------------------- Helpers -------------------- */

/** Build filtered character sets based on options */
function buildAvailableSets(options) {
  return Object.entries(CHAR_SETS)
    .filter(([key]) => options[key])
    .map(([_, chars]) => filterSimilar(chars, options.excludeSimilar));
}

/** Remove similar-looking characters if required */
function filterSimilar(chars, excludeSimilar) {
  if (!excludeSimilar) return chars;
  return chars
    .split("")
    .filter((ch) => !SIMILAR_CHARS.has(ch))
    .join("");
}

/** Pick a random character, respecting duplicate rules */
function pickRandomChar(chars, avoidDuplicate, usedSet = new Set()) {
  const pool = avoidDuplicate
    ? chars.split("").filter((ch) => !usedSet.has(ch))
    : chars.split("");

  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Shuffle an array (Fisher-Yates) */
function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Ensure the first character is a letter */
function ensureStartsWithLetter(passwordChars, options, usedChars) {
  const letters = [
    ...(options.uppercase
      ? filterSimilar(CHAR_SETS.uppercase, options.excludeSimilar)
      : ""),
    ...(options.lowercase
      ? filterSimilar(CHAR_SETS.lowercase, options.excludeSimilar)
      : ""),
  ];

  if (letters.length === 0) return [];

  const firstLetterIndex = passwordChars.findIndex((ch) =>
    letters.includes(ch)
  );
  if (firstLetterIndex === -1) {
    const forcedLetter = pickRandomChar(letters.join(""), false);
    if (!forcedLetter) return [];
    if (options.excludeDuplicate) usedChars.delete(passwordChars[0]);
    passwordChars[0] = forcedLetter;
    usedChars.add(forcedLetter);
  } else {
    [passwordChars[0], passwordChars[firstLetterIndex]] = [
      passwordChars[firstLetterIndex],
      passwordChars[0],
    ];
  }

  return passwordChars;
}
