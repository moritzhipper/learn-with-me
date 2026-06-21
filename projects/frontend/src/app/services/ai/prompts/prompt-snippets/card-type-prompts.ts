import { LearnableCreationConfig } from 'projects/frontend/src/app/types/types'

const phraseCardStylePrompt = `
## Phrase Card Requirements
Phrase cards focus on comprehensible input and semantic chunks. They must:
- Consist of idioms, expressions, collocations, or short sentences.
- Be strictly limited to a maximum of 8 words to respect cognitive load limits.
- Use an ellipsis (...) at the beginning or end if the phrase is a fragment of a larger sentence.
- Maintain correct capitalization and punctuation.
- Never be a single, standalone word.
- **Context in Notes:** If the phrase is colloquial, an idiom, a saying, or has a non-literal meaning, explain this briefly in the \`notes\` attribute. Keep notes extremely short. Leave the attribute completely empty if a note is not strictly necessary.

### Examples of Phrase Cards (Format: Lexeme / Translation [Notes: Context if needed])

Correct Patterns:
- Break a leg! / ¡Mucha mierda! [Notes: Expresión idiomática para desear buena suerte]
- What's up? / ¿Qué pasa? [Notes: Saludo coloquial]
- ...are the reasons why... / ...son las razones por las que... [Notes: (leave empty)]
- Good morning! / ¡Buenos días! [Notes: (leave empty)]
- They couldn't agree more. / No podrían estar más de acuerdo. [Notes: (leave empty)]
- ..., isn't it? / ..., ¿verdad? [Notes: (leave empty)]

Anti-Patterns (DO NOT DO THIS):
- No (Reason: Single word)
- Dog (Reason: Single word)
- ...dog... (Reason: Lacks semantic context)
`
export const wordCardStylePrompt = `
## Word Card Requirements

Word cards focus on isolated, foundational vocabulary. They must strictly adhere to the following rules:

### 1. Content & Formatting
- Single Concept: Contain exactly one standalone word (or a recognized compound word treated as a single concept).
- Contextual Extraction: If extracting directly from a source text, capture the lexeme and translation in its exact contextual form (e.g., conjugated verb, inflected noun, inflected adjective).
- Articles for Nouns: ALWAYS include the correct definite article in parentheses BEFORE the lexeme and translation if the word is a noun (including abstract nouns). This is critical for learning grammatical gender.
- Clean Text: Follow exact capitalization rules for standalone words in the target language. Never include phrases, secondary words, or punctuation marks (like quotation marks or periods).

### 2. Mandatory Notes (Grammar & Morphology)
To support language learning best practices, the 'notes' attribute MUST capture essential morphological paradigms based on the word's part of speech. Keep these notes concise and formatted predictably.

A. Contextual Form (If applicable):
If the extracted lexeme is NOT in its base dictionary form (lemma), you MUST start the note by specifying its exact grammatical morphology in the text (e.g., tense, mood, person, case, plurality) followed by 'of [lemma]'.
Example: '3rd person singular present indicative of to walk / caminar.' or 'Accusative plural of (the) card.'

B. Essential Morphological Paradigms (ALWAYS REQUIRED):
After defining the contextual form (or immediately, if the word is already a lemma), you MUST include the following base paradigms depending on the word's lexical category:
- Nouns (Substantives): ALWAYS list the nominative singular and nominative plural forms. (Format: 'Singular: X, Plural: Y')
- Verbs: ALWAYS list the infinitive. If the verb is irregular in the target language, also list its preterite and past participle forms. (Format: 'Infinitive: X, Preterite: Y, Past Participle: Z')
- Adjectives/Adverbs: ALWAYS list the positive degree. If it possesses irregular gradations, list them. (Format: 'Positive: X, Comparative: Y, Superlative: Z')
- Other Lexical Categories: Leave the notes completely empty unless step A (Contextual Form) applies.

---

### Examples of Word Cards (Format: Lexeme / Translation [Notes])

- walks / camina 
  [Notes: 3rd person singular present indicative of 'to walk / caminar'. Infinitive: walk, Preterite: walked, Past Participle: walked]

- (the) cards / (die) Karten 
  [Notes: Accusative plural of '(the) card / (die) Karte'. Singular: (the) card, Plural: (the) cards]

- went / fue 
  [Notes: 3rd person singular preterite indicative of 'to go / ir'. Infinitive: go, Preterite: went, Past Participle: gone]

- (the) improvement / (die) Verbesserung 
  [Notes: Singular: (the) improvement, Plural: (the) improvements]

- better / mejor
  [Notes: Comparative degree of 'good / bueno'. Positive: good, Comparative: better, Superlative: best]

- quickly / rápidamente 
  [Notes: Positive: quickly]

- with / con
  [Notes: ]
`

export const getCardTypePrompt = (type: LearnableCreationConfig['cardType']): string => {
  if (type === 'word') {
    return `
## Output Constraint: WORD CARDS ONLY

Strictly extract and generate single-word vocabulary cards. Do not output any phrases or sentences.
${wordCardStylePrompt}
`
  } else if (type === 'phrase') {
    return `
## Output Constraint: PHRASE CARDS ONLY

Strictly extract and generate phrase/sentence vocabulary cards. Do not output any single, isolated words.
${phraseCardStylePrompt}
`
  } else {
    return `
## Output Constraint: MIXED CARDS (WORDS & PHRASES)

Extract a balanced mix of both single words and useful semantic phrases.
${wordCardStylePrompt}
${phraseCardStylePrompt}
`
  }
}
