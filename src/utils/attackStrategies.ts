// Common passwords for dictionary attack
export const COMMON_PASSWORDS = [
  'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', '1234567',
  'letmein', 'trustno1', 'dragon', 'baseball', 'iloveyou', 'master', 'sunshine',
  'ashley', 'bailey', 'shadow', '123123', '654321', 'superman', 'password1',
  'qwerty123', 'welcome', 'admin', 'login', 'Password', 'password123', '111111',
  'admin123', 'root', 'pass', 'test', 'guest', 'user', '1234', '12345',
  'secret', 'passw0rd', 'Password1', 'football', 'michael', 'jordan', 'princess',
  'charlie', 'aa123456', 'donald', 'password!', 'solo', 'starwars', 'qwertyuiop',
  'liverpool', 'cheese', 'soccer', 'purple', 'london', 'computer', '12341234'
];

// Common base words for hybrid attacks
export const COMMON_WORDS = [
  'password', 'admin', 'user', 'login', 'welcome', 'hello', 'secret',
  'love', 'summer', 'winter', 'spring', 'fall', 'dragon', 'tiger',
  'master', 'super', 'test', 'demo', 'temp', 'guest'
];

// Common transformations for hybrid attacks
export const HYBRID_TRANSFORMATIONS = [
  (word: string) => word, // original
  (word: string) => word.charAt(0).toUpperCase() + word.slice(1), // Capitalize
  (word: string) => word.toUpperCase(), // UPPERCASE
  (word: string) => word + '123', // word123
  (word: string) => word + '!', // word!
  (word: string) => word + '2024', // word2024
  (word: string) => word + '2023', // word2023
  (word: string) => word.charAt(0).toUpperCase() + word.slice(1) + '1', // Word1
  (word: string) => word.charAt(0).toUpperCase() + word.slice(1) + '123', // Word123
  (word: string) => word.charAt(0).toUpperCase() + word.slice(1) + '!', // Word!
  (word: string) => word + '@123', // word@123
  (word: string) => '123' + word, // 123word
  (word: string) => word.replace('a', '@').replace('o', '0'), // l33t speak
  (word: string) => word.replace('e', '3').replace('a', '@'), // more l33t
];

// Character frequency order (based on real password data)
// More common characters are tried first
export const CHAR_FREQUENCY = {
  lowercase: 'eatoinshrdlcumwfgypbvkjxqz',
  uppercase: 'EATOINSHRDLCUMWFGYPBVKJXQZ',
  digits: '1234567890',
  special: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

// Common password patterns
export const PASSWORD_PATTERNS = [
  { pattern: /^[A-Z][a-z]+$/, name: 'Single capitalized word' },
  { pattern: /^[A-Z][a-z]+\d+$/, name: 'Capitalized word + numbers' },
  { pattern: /^[a-z]+\d+$/, name: 'Lowercase word + numbers' },
  { pattern: /^[a-z]+\d+[!@#$%]$/, name: 'Word + numbers + symbol' },
  { pattern: /^\d+$/, name: 'Only digits' },
  { pattern: /^[A-Z][a-z]+[!@#$%]$/, name: 'Capitalized word + symbol' },
];

// Calculate password entropy (bits)
export function calculateEntropy(password: string): number {
  let charsetSize = 0;
  
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;
  
  return Math.log2(Math.pow(charsetSize, password.length));
}

// Detect password pattern
export function detectPattern(password: string): string {
  for (const { pattern, name } of PASSWORD_PATTERNS) {
    if (pattern.test(password)) {
      return name;
    }
  }
  return 'Complex/random pattern';
}

// Smart character order based on discovered characters
export function getSmartCharset(discoveredChars: string[]): string {
  let charset = '';
  
  const hasLower = discoveredChars.some(c => /[a-z]/.test(c));
  const hasUpper = discoveredChars.some(c => /[A-Z]/.test(c));
  const hasDigit = discoveredChars.some(c => /[0-9]/.test(c));
  const hasSpecial = discoveredChars.some(c => /[^a-zA-Z0-9]/.test(c));
  
  // Prioritize character types that have been found
  if (hasLower) charset += CHAR_FREQUENCY.lowercase;
  if (hasUpper) charset += CHAR_FREQUENCY.uppercase;
  if (hasDigit) charset += CHAR_FREQUENCY.digits;
  if (hasSpecial) charset += CHAR_FREQUENCY.special;
  
  // If nothing found yet, try common characters first
  if (charset === '') {
    charset = CHAR_FREQUENCY.lowercase + CHAR_FREQUENCY.digits + 
              CHAR_FREQUENCY.uppercase + CHAR_FREQUENCY.special;
  }
  
  return charset;
}

// Estimate crack time
export function estimateCrackTime(password: string, attemptsPerSecond: number = 1000): string {
  const entropy = calculateEntropy(password);
  const totalCombinations = Math.pow(2, entropy);
  const seconds = totalCombinations / attemptsPerSecond / 2; // Average case
  
  if (seconds < 1) return 'Instantly';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 3153600000) return `${Math.round(seconds / 31536000)} years`;
  return `${Math.round(seconds / 31536000000)} centuries`;
}

// Get password strength rating
export function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  const entropy = calculateEntropy(password);
  
  if (entropy < 28) return { score: 1, label: 'Very Weak', color: 'red' };
  if (entropy < 36) return { score: 2, label: 'Weak', color: 'orange' };
  if (entropy < 60) return { score: 3, label: 'Fair', color: 'yellow' };
  if (entropy < 128) return { score: 4, label: 'Strong', color: 'green' };
  return { score: 5, label: 'Very Strong', color: 'emerald' };
}
