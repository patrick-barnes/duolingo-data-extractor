declare module '@indic-tools/hindi-transliterate' {
  /**
   * Transliterate a Hindi/Devanagari string to Latin script.
   * @param input Devanagari text
   * @param sanskritMode Optional flag to enable Sanskrit-style transliteration
   */
  export default function transliterate(input: string, sanskritMode?: boolean): string;
}
