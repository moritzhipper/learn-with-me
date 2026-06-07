const tonePrompt = (tone: string): string => {
  if (!tone) {
    return `Translate directly and as literally as possible.`
  } else {
    return `
      Adapt the vocabulary, phrasing, and formality to perfectly match this tone or context: '${tone}'.
      If the original text contains phrasing that clashes with this tone, you MUST paraphrase the underlying meaning so it matches the requested context.`
  }
}

export const getQuickTranslatePrompt = (language: string, tone: string): string => {
  const basePrompt = `
    Translate the input to ${language}. Do not comment, do not add anything. Use correct casing.`

  return `${basePrompt}\n${tonePrompt(tone)}`
}
