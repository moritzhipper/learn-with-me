import { LearnableCreationConfig } from '../../../../types/types'

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

Generate isolated vocabulary cards. Output must be extremely concise to minimize tokens and support rapid spaced-repetition learning.

### 1. Content & Formatting
- **Single Concept:** Output strictly the target word and its translation. Strip all punctuation, quotation marks, and secondary phrases.
- **Noun Articles:** Always prepend the definite article in parentheses for nouns, e.g., "(the) house / (la) casa".

### 2. Concise Morphology Notes
Use standard linguistic abbreviations (e.g., 3sg pres, acc pl, nom). Do not write conversational sentences. Do not use repetitive labels like "Singular:" or "Infinitive:".

Apply these rules strictly based on lexical category:
- **Contextual Form:** If the word is inflected, write '[Abbrev. form] of [Base lemma / translation]'.
- **Nouns:** Append '(pl: [plural form])'.
- **Verbs:** If irregular, append '(irreg: [preterite], [past part])'. Omit paradigms if regular.
- **Adjectives/Adverbs:** If irregularly graded, append '(comp: [comparative], sup: [superlative])'. Omit paradigms if regular.
- **Other:** Leave notes empty.

---

### Examples

- walks / camina
  [Notes: 3sg pres ind of walk / caminar]

- (the) cards / (die) Karten
  [Notes: acc pl of (the) card / (die) Karte (pl: die Karten)]

- went / fue
  [Notes: 3sg pret of go / ir (irreg: went, gone)]

- (the) improvement / (die) Verbesserung
  [Notes: (pl: die Verbesserungen)]

- better / mejor
  [Notes: comp of good / bueno (sup: best)]

- quickly / rápidamente
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
