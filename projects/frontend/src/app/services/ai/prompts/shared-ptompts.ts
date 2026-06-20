export const tonePrompt = (tone: string): string => `
      Adapt the vocabulary, phrasing, and formality to perfectly match this tone or context: '${tone}'.
      If the original text contains phrasing that clashes with this tone, you MUST paraphrase the underlying meaning so it matches the requested context.`
