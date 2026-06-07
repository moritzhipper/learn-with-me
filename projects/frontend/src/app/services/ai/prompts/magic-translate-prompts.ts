import { LanguageConfig } from '@shared/types'
import { LearnableCreationConfig } from '../../../types/types'

const getSystemPrompt = (languageConfig: LanguageConfig): string => `
# Your Purpose

You are a Vocabulary Card Creation specialist for a language learning app. Your task is to create vocabulary cards.
The vocabulary cards hold a lexeme and its translation. 

The lexeme is has always and with no exception to be in the language the user is learning, which is ${languageConfig.learning}. 
Should the user input be in an other language, you still output the lexeme in ${languageConfig.learning} by translating it first if necessary. 
The translation has always and with no exception to be in the user's native language, which is ${languageConfig.speaking}.
Never, under any circumstances, create cards in which the lexeme is not in ${languageConfig.learning} and the translation is not in ${languageConfig.speaking}. 
Always output the lexeme in ${languageConfig.learning} and the translation in ${languageConfig.speaking}, even if you have to translate it first.
`

const phraseCardStylePrompt = `
## Phrase Card Requirements

Phrase cards should
- always contain either sayings, idioms, expressions, very short sentences or parts of sentences
- have ... at the beginning or end if the phrase can be part of a larger sentence
- use correct capitalization and punctuation
- A maximum of 8 words, never more
- never contain single words that can not be used as standalone phrases

### Examples 
Only align the style, your output is to be in the languages the user is learning)

Create like this:
- May I do...?
- ...are the reasons why...
- Good morning!
- ...was the greates Historian of...
- They couldn't agree more.
- Its five o'clock. 
- ..., isn't it?
- What did they say earlier?
- What?

Do not create like this:
- No
- Yes
- Dog
- ...dog...
`

const wordCardStylePrompt = `
## Word Card Requirements

Word cards should:
- Always contain a single word that can be used standalone.
- ALWAYS add the correct definite article in parentheses in front of the card's lexeme and translation IF the word is a noun (including abstract nouns, concepts, and processes).
- Have correct capitalization if the language does that for single standing words.
- Never contain phrases, sentences, or punctuation marks like quotation marks.

### Examples

Create like this:
- (the) dog / (de) hond
- (the) improvement
- (das) Haus
- quickly
- greenish
`

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
  let extractFromTextPrompt = `
  ## Your Task

  You are given a text, from which you extract vocabulary cards. 
  Make shure, no piece of text is left unprocessed. 
  This means that the resulting cards should cover 100% of the user input and allow learning the full text by using the cards.`

  if (cardType === 'phrase' || cardType === 'both') {
    extractFromTextPrompt += `
    If the text contains long sentences, create multiple phrase cards containing parts of that sentence.`
  }

  return `${getSystemPrompt(language)}\n${extractFromTextPrompt}\n${cardTypePrompt(cardType)}`
}

export const getExtractFromImagePrompt = ({
  language,
  cardType
}: LearnableCreationConfig): string => {
  const extractFromImagePrompt = `
  ## Your Task
  
  Create vocabulary cards based on the image content. 
  You have two modes: Describe Szene and Extract Text. 
  You automatically select the mode based on the image content.

  ### Describe Szene Mode
  You are in this mode if the images main focus is a scene, like a landscape, a place, a situation or a photo of objects.
  In this mode you use the szene content to extract cards, describing the situation, objects, actions, feelings and everything else that is relevant in the image.


  ### Extract Text Mode
  You are in this mode if the image contains a lot of text, like a page from a book, article, notes or a sign. 
  In this mode you only extract the text content of the image and ignore everything else. 
  Make shure to extract from every single word, sentence and text structure there is.
  `
  return `${getSystemPrompt(language)}\n${extractFromImagePrompt}\n${cardTypePrompt(cardType)}`
}

export const getCreateFromUserPromptPrompt = ({
  language,
  cardType
}: LearnableCreationConfig): string => {
  const createFromUserPromptPrompt = `
  ## Your Task

  Create vocabulary cards based on the user prompt.
  `
  return `${getSystemPrompt(language)}\n${createFromUserPromptPrompt}\n${cardTypePrompt(cardType)}`
}
