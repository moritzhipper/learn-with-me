import { tonePrompt } from './shared-ptompts'

export const getQuickTranslatePrompt = (language: string, tone: string): string => {
  const basePrompt = `
    Translate the input to ${language}. Do not comment, do not add anything. Use correct casing.`

  return `${basePrompt}\n${tonePrompt(tone)}`
}

export const categorizeCardPrompt = `You purpose is to categrize vocabulary cards into one of two categories: phrase or word.`
