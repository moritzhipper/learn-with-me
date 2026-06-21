import { LearnableCreationConfig } from '../../../types/types'
import { getCardTypePrompt } from './prompt-snippets/card-type-prompts'
import {
  getTextSourcePrompt,
  imageSourcePrompt,
  promptSourcePrompt
} from './prompt-snippets/source-type-prompts'
import { getMagicTranslateSystemPrompt } from './prompt-snippets/system-prompts'
import { tonePrompt } from './prompt-snippets/tone-prompts'

export const getExtractFromTextPrompt = ({
  language,
  cardType,
  tone
}: LearnableCreationConfig): string => {
  return `
  ${getMagicTranslateSystemPrompt(language)}
  ${tonePrompt(tone)}
  ${getTextSourcePrompt(cardType)}
  ${getCardTypePrompt(cardType)}`
}

export const getExtractFromImagePrompt = ({
  language,
  cardType,
  tone
}: LearnableCreationConfig): string => {
  return `
  ${getMagicTranslateSystemPrompt(language)}
  ${tonePrompt(tone)}
  ${imageSourcePrompt}
  ${getCardTypePrompt(cardType)}`
}

export const getCreateFromUserPromptPrompt = ({
  language,
  cardType,
  tone
}: LearnableCreationConfig): string => {
  return `
  ${getMagicTranslateSystemPrompt(language)}
  ${tonePrompt(tone)}
  ${promptSourcePrompt}
  ${getCardTypePrompt(cardType)}`
}
