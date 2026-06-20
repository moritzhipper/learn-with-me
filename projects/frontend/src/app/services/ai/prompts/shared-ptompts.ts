export const tonePrompt = (tone?: string): string => {
  if (!tone) return ''

  return `
# ACTIVE TONE & REWRITE MANDATE: "${tone}"
You MUST adapt the vocabulary, phrasing, and formality in LEXEME and TRANSLATION to perfectly match this tone. 
- THE VERBATIM TRAP: Do NOT simply copy-paste words from the source text or prompt if they do not fit this tone. 
- You MUST paraphrase, swap, or rewrite the original concepts into new Target Language words that fit the tone perfectly.
- BOTH the learning lexeme and the translation MUST reflect this tonal adaptation symmetrically ALWAYS.
`
}
