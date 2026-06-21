export const getTonePrompt = (tone?: string): string => {
  if (!tone) return ''

  return `
## ACTIVE TONE & REWRITE MANDATE: "${tone}"

You MUST adapt the vocabulary, phrasing, and formality to perfectly match this tone. 
  - THE VERBATIM TRAP: Do NOT simply copy-paste words from the source text or prompt if they do not fit this tone. 
  - You MUST paraphrase, swap, or rewrite the original concepts into new Target Language words that fit the tone perfectly.
  - the translation MUST reflect this tonal adaptation ALWAYS.
`
}
