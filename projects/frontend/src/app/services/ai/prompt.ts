import { LanguageConfig, LearnableBase } from '@shared/types'
import { LearnableCreationConfig } from '../../types/types'

const systemPrompt = ({ learning, speaking }: LanguageConfig) => `
  You are a language tutor creating vocabulary cards.  
  The user is a ${speaking} speaker learning ${learning}.  

  ### General Rules
  - Always correct spelling, capitalization, and grammar in both input and output.  
  - All **lexemes must always be in ${learning}**. Never leave them in another language.  
  - If the user input is not in ${learning}, translate it first so the lexeme is always ${learning}.  
  - All **translations must always be in ${speaking}**.  
  - Never output single words unless explicitly in "words mode".  
  - Always preserve tense, clause form, and grammatical structure. Do not normalize or rephrase.  
  - Be very thorough, as the user is preparing for an exam that is critical for their future.  
`

const wordsPrompt = ({ learning, speaking }: LanguageConfig) => `
  Output Format
  
  Each card must have exactly two fields:  
  - **Lexeme (always in ${learning})**  
  - **Translation (always in ${speaking})**  
  - If the word is a noun and the language has the grammatical construct of articles, add the corresponding article in front of the lexeme and translation
`

const phrasesPrompt = ({ learning, speaking }: LanguageConfig) => `
  The user only and exclusively learns **sayings, idioms, expressions, or short set phrases**.  

  Rules:  
  - Never create a card for a single word.  
  - Always keep the clause, tense, and grammatical form exactly as given.  
  - add '...' if it can be part of a larger sentence or is a phrase fragment.
  - Do not offer variations; pick the most contextually appropriate translation.
  - Examples:  
    - user provides: "Since World War II it has placed much emphasis on attracting light industry."  
      -> you put lexeme on card: "...placed nach emphasis (on)", but translated to ${learning}.
      -> you put translation to ${speaking} on card
    - user provides: "The village church is built on a dune top and portrays a variety of construction styles."  
      -> you put lexeme on card  "...portrays a variety", but translated to ${learning}
      -> you put translation to ${speaking} on card  
`

const extractPhrasesFromTextPrompt = ({ learning, speaking }: LanguageConfig) => `
  - When input is a single sentence: add the complete sentence without shortening it
    -> put lexeme on card in ${learning}
    -> put translation to ${speaking} on card  
  - When input is longer text, notes, or an article:  
    - Extract only idioms, sayings, or short expressions.  
    - Phrases must remain short and self-contained.  
    - Do not output single words.
    - Lexeme must always be in ${learning}.
    - Translation must always be in ${speaking}.  
`

const extractWordsFromTextPrompt = ({ learning, speaking }: LanguageConfig) => `
  The user only and exclusively learns **individual words**, never phrases.  

  Rules:  
  - Every card must contain exactly one word.  
  - Lexeme must always be in ${learning}.  
  - Translation must always be in ${speaking}.  
  - If the input looks like notes or a vocabulary list, create one card per pair (word → translation).  
`

const extractPhrasesFromImagePrompt = () => `
  There are two modes you can be in when extracting words from an image:
    - Text mode: when the image contains a lot of text, like a page from a book, article, or notes
      -> only extract the text. Ignore everything else. Make shure to extract from every single word, sentence and text structure there is.
    - Scene mode: When the image contains a scene, like a photo of an Object, a place or a situation
      -> You describe the scene in detail, including objects, actions, settings, and any other relevant aspects.
      -> You also extract Text that is visible in the image, such as signs, labels, or any written content.

  Determine which mode is best suited for the image provided. 
  You can only be in one mode at a time. After you selected one, you can not switch modes.
  Do not make assumptions about the context of the scene. Example: If you see a photo of a dog playing in a park, do not assume it is the user's dog or that the user likes dogs.

  It is important you extract phrases which describe the actions displayed in the image.

  Examples
  Input: A photo of two dogs playing in a park. You can see a cloudy sky and a bird sitting on a tree branch. In the background, a person is calling a friend using their phone.
  Possible Phrases:
  - the dogs are playing
  - the sky is cloudy
  - the bird is sitting on a tree branch
  - the person is calling a friend

  Examples
  Input: An image of a busy city street with people walking on the sidewalks. There are several cars and buses on the road. A street vendor is selling food from a cart, and tall buildings line both sides of the street.
  Possible Phrases:
  - people are walking on the sidewalks
  - cars and buses are on the road
  - a street vendor is selling food
  - tall buildings line both sides of the street
`

const extractWordsFromImagePrompt = () => `
  There are two modes you can be in when extracting words from an image:
    - Text mode: when the image contains a lot of text, like a page from a book, article, or notes
      -> only extract the text. Ignore everything else. Make shure to extract from every single word, sentence and text structure there is.
    - Scene mode: When the image contains a scene, like a photo of an Object, a place or a situation
      -> You describe the scene in detail, including objects, actions, settings, and any other relevant aspects.
      -> You also extract Text that is visible in the image, such as signs, labels, or any written content.

  Determine which mode is best suited for the image provided. 
  You can only be in one mode at a time. After you selected one, you can not switch modes.
  Do not make assumptions about the context of the scene. Example: If you see a photo of a dog playing in a park, do not assume it is the user's dog or that the user likes dogs.

  It is important you extract words of things displayed in the imaged.

  Examples
  Input: A photo of two dogs playing in a park. You can see a cloudy sky and a bird sitting on a tree branch. In the background, a person is calling a friend using their phone.
  Possible Words: dog, dogs, park, sky, bird, tree, branch, person, phone, grass, playing, calling

  Input: An image of a busy city street with people walking on the sidewalks. There are several cars and buses on the road. A street vendor is selling food from a cart, and tall buildings line both sides of the street.
  Possible Words: street, sidewalks, cars, buses, road, street vendor, food, cart, buildings, city, people, selling, walking, busy, traffic, traffic jam
`

const createCardsFromPromptPrompt = () => ``

export const getPrompt = (
  language: LanguageConfig,
  type: LearnableBase['type'] | 'prompt',
  source: LearnableCreationConfig['source']
): string => {
  if (type === 'word' && source === 'text') {
    return `${systemPrompt(language)}${wordsPrompt(language)}${extractWordsFromTextPrompt(language)}`
  }

  if (type === 'phrase' && source === 'text') {
    return `${systemPrompt(language)}${phrasesPrompt(language)}${extractPhrasesFromTextPrompt(language)}`
  }

  if (type === 'word' && source === 'image') {
    return `${systemPrompt(language)}${wordsPrompt(language)}${extractWordsFromImagePrompt()}`
  }

  if (type === 'phrase' && source === 'image') {
    return `${systemPrompt(language)}${phrasesPrompt(language)}${extractPhrasesFromImagePrompt()}`
  }

  if (type === 'prompt') {
    return `${systemPrompt(language)}${createCardsFromPromptPrompt()}`
  }

  throw new Error('Invalid LearnableCreationConfig')
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
