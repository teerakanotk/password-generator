// -------------------- Character sets --------------------
export const CHAR_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  number: "0123456789",
  symbol: "@#",
};

export const SIMILAR_CHARS = new Set("iIl1oO0S5B8");

// -------------------- Password generator --------------------
export function generatePassword(options, length) {
  const availableSets = buildAvailableSets(options);
  const allChars = availableSets.join("");

  if (!allChars) return "";

  // Check if enough unique characters
  if (options.excludeDuplicate && new Set(allChars).size < length) {
    return "Not enough unique characters";
  }

  const usedChars = new Set();
  let passwordChars = [];

  // Step 1: Ensure at least one character from each selected set
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

// -------------------- Helpers --------------------
function buildAvailableSets(options) {
  return Object.entries(CHAR_SETS)
    .filter(([key]) => options[key])
    .map(([_, chars]) => filterSimilar(chars, options.excludeSimilar));
}

function filterSimilar(chars, excludeSimilar) {
  if (!excludeSimilar) return chars;
  return chars
    .split("")
    .filter((ch) => !SIMILAR_CHARS.has(ch))
    .join("");
}

function pickRandomChar(chars, avoidDuplicate, usedSet = new Set()) {
  const pool = avoidDuplicate
    ? chars.split("").filter((ch) => !usedSet.has(ch))
    : chars.split("");

  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function ensureStartsWithLetter(passwordChars, options, usedChars) {
  const letters = [
    ...(options.uppercase
      ? filterSimilar(CHAR_SETS.uppercase, options.excludeSimilar)
      : ""),
    ...(options.lowercase
      ? filterSimilar(CHAR_SETS.lowercase, options.excludeSimilar)
      : ""),
  ];

  if (!letters.length) return passwordChars;

  const firstLetterIndex = passwordChars.findIndex((ch) =>
    letters.includes(ch)
  );
  if (firstLetterIndex === -1) {
    const forcedLetter = pickRandomChar(letters.join(""), false);
    if (!forcedLetter) return passwordChars;
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
