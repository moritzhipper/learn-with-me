import { LearnableCreationConfig } from 'projects/frontend/src/app/types/types'

export const imageSourcePrompt = `
## Task: Image-Based Extraction
Analyze the provided image and generate vocabulary cards. Automatically categorize the image into one of two modes and proceed accordingly:

### Mode 1: Scene Description (Visual Context)
- Trigger: The image primarily features a landscape, place, situation, or physical objects.
- Action: Extract vocabulary describing the visible objects, actions, colors, spatial relations, and inferred emotions or situations. Prioritize high-frequency, visually salient terms.

### Mode 2: Text Extraction (Written Context)
- Trigger: The image heavily features written text (e.g., book pages, articles, signs, notes).
- Action: Ignore the background aesthetics and strictly extract the written content. Break down the sentences, headings, and distinct text structures into learnable vocabulary cards.
`

export const getTextSourcePrompt = (cardType: LearnableCreationConfig['cardType']) => {
  const basePrompt = `
## Task: Text Extraction

You will receive a source text. Extract comprehensive vocabulary cards from it so the user can fully comprehend the text. 
Ensure exhaustive coverage of the meaningful vocabulary, idiomatic expressions, and structural chunks present in the input. Do not leave key semantic elements unprocessed.
`
  if (cardType === 'word') return basePrompt
  const breakDownPhrasesPrompt = `
If the text contains complex or long sentences, break them down into smaller, logical semantic chunks (maximum 8 words per chunk) to create digestible phrase cards.
`

  return `${basePrompt}${breakDownPhrasesPrompt}`
}

export const promptSourcePrompt = `
## Task: Prompt-Based Generation
Generate highly useful, context-appropriate vocabulary cards based strictly on the thematic or specific instructions provided in the user's prompt. 
`
