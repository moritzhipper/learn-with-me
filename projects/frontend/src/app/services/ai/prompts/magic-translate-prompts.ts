import { LanguageConfig } from '@shared/types'
import { LearnableCreationConfig } from '../../../types/types'

// Purpose: Create learning cards specialist.
// Lexeme -> Translation -> lexeme always in lang x, translation always in lang y. no matter the user input lang, alwas lexem in x and trans in y. when user input not in x, transfor to x
const getSystemPrompt = (languageConfig: LanguageConfig): string => ``

// phrase cards like this (example)
// phrases not longer that xy. split into multiple when necessary, example: bigger to smaller
// add ... to front or back if phrase is part
const phraseCardStylePrompt = ``

// cards like this (example)
// add articles to nouns if is relevant in the language
// correct capitalization if langugae does that for single standing words
const wordCardStylePrompt = ``

const cardTypePrompt = (type: LearnableCreationConfig['cardType']): string => {
  if (type === 'word') {
    const preamble = `Only and exclusively extract word cards. Do not output cards containing phrases or sentences.`
    return `${preamble}\n${wordCardStylePrompt}`
  } else if (type === 'phrase') {
    const preamble = `Only and exclusively extract phrase cards. Do not output single word cards.`
    return `${preamble}\n${phraseCardStylePrompt}`
  } else {
    const preamble = `Extract cards of both types word and phrase.`
    return `${preamble}\n${wordCardStylePrompt}\n${phraseCardStylePrompt}`
  }
}

export const getExtractFromTextPrompt = ({
  language,
  cardType
}: LearnableCreationConfig): string => {
  const extractFromTextPrompt = ``
  return `${getSystemPrompt(language)}\n${extractFromTextPrompt}\n${cardTypePrompt(cardType)}`
}

export const getExtractFromImagePrompt = ({
  language,
  cardType
}: LearnableCreationConfig): string => {
  const extractFromImagePrompt = ``
  return `${getSystemPrompt(language)}\n${extractFromImagePrompt}\n${cardTypePrompt(cardType)}`
}

export const getCreateFromUserPromptPrompt = ({
  language,
  cardType
}: LearnableCreationConfig): string => {
  const createFromUserPromptPrompt = ``
  return `${getSystemPrompt(language)}\n${createFromUserPromptPrompt}\n${cardTypePrompt(cardType)}`
}
