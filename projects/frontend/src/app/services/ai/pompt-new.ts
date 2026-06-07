import { LanguageConfig } from '@shared/types'
import { LearnableCreationConfig } from '../../types/types'

export const getExtractFromTextPrompt = (config: LearnableCreationConfig): string => {
  return ''
}
export const getExtractFromImagePrompt = (config: LearnableCreationConfig): string => {
  return ''
}
export const getCreateFromUserPromptPrompt = (config: LearnableCreationConfig): string => {
  return ''
}

export const getQuickTranslatePrompt = (language: LanguageConfig, tone: string): string => {
  const basePrompt = `
    Translate the input to ${language.learning}. Do not comment, do not add anything. Use correct casing.`

  if (!tone) {
    const directTone = `Translate directly and as literally as possible.`
    return `${basePrompt}\n${directTone}`
  } else {
    const tonePrompt = `Adapt the vocabulary, phrasing, and formality to perfectly match this tone or context: '${tone}'.
      If the original text contains phrasing that clashes with this tone, you MUST paraphrase the underlying meaning so it matches the requested context.`
    return `${basePrompt}\n${tonePrompt}`
  }
}
