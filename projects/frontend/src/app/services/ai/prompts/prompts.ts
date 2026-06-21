import { LearnableCreationConfig } from '../../../types/types'
import { getCardTypePrompt } from './prompt-snippets/card-type-prompts'
import { getPromptSourcePrompt } from './prompt-snippets/source-type-prompts'
import {
  categorizeCardSystemPrompt,
  getMagicTranslateSystemPrompt,
  getQuickTranslateSystemPrompt
} from './prompt-snippets/system-prompts'
import { getTonePrompt } from './prompt-snippets/tone-prompts'

export const getMagicTranslatePrompt = ({
  language,
  sourceType,
  cardType,
  tone
}: LearnableCreationConfig): string => `
  ${getMagicTranslateSystemPrompt(language)}
  ${getPromptSourcePrompt(sourceType, cardType)}
  ${getCardTypePrompt(cardType)}
  ${getTonePrompt(tone)}`

export const getQuickTranslatePrompt = (language: string, tone: string): string => `
  ${getQuickTranslateSystemPrompt(language)}
  ${getTonePrompt(tone)}`

export const getCategorizeCardPrompt = (): string => categorizeCardSystemPrompt
