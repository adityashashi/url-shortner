const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const BASE = ALPHABET.length;

export function encodeBase62(num: number): string {
  if (num === 0) return ALPHABET[0];
  let result = '';
  let n = num;
  while (n > 0) {
    const rem = n % BASE;
    result = ALPHABET[rem] + result;
    n = Math.floor(n / BASE);
  }
  return result;
}
