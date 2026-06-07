import { LearnableCreationConfig } from '../../../types/types'

const systemPrompt = ``

const cardTyePrompt = (type: LearnableCreationConfig['cardType']): string => {
  if (type === 'word') {
    return ``
  } else if (type === 'phrase') {
    return ``
  } else {
    return ``
  }
}

export const getExtractFromTextPrompt = (config: LearnableCreationConfig): string => {
  const extractFromTextPrompt = ``
  return `${systemPrompt}\n${cardTyePrompt(config.cardType)}\n${extractFromTextPrompt}`
}
export const getExtractFromImagePrompt = (config: LearnableCreationConfig): string => {
  const extractFromImagePrompt = ``
  return `${systemPrompt}\n${cardTyePrompt(config.cardType)}\n${extractFromImagePrompt}`
}
export const getCreateFromUserPromptPrompt = (config: LearnableCreationConfig): string => {
  const createFromUserPromptPrompt = ``
  return `${systemPrompt}\n${cardTyePrompt(config.cardType)}\n${createFromUserPromptPrompt}`
}
