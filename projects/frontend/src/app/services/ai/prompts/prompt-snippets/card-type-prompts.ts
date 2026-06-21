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

const wordCardStylePrompt = `
## Word Card Requirements

Word cards focus on isolated, foundational vocabulary. They must:
- Contain exactly one standalone word (or a compound word treated as a single concept).
- **Form:** If extracting directly from a source text, capture the word in its exact contextual form (conjugation, plural, inflection). If generating or translating from a conceptual prompt, use the most natural base dictionary form (lemma).
- **Grammatical Form & Lemma in Notes:** If the lexeme is NOT in its base dictionary form (lemma), you MUST specify its grammatical form (e.g., tense, person, case, plurality) followed by "of [lemma]" in the \`notes\` attribute (e.g., "3rd person sing. of [lemma]" or "Accusative pl. of [lemma]"). Keep notes extremely short. Leave the attribute completely empty if a note is not strictly necessary (e.g., if it's already a lemma).
- ALWAYS include the correct definite article in parentheses BEFORE the lexeme and translation if the word is a noun (including abstract nouns and concepts).
- Follow exact capitalization rules for standalone words.
- Never contain phrases, multiple words, or punctuation marks (like quotation marks or periods).

### Examples of Word Cards (Format: Lexeme / Translation [Notes: Grammar if needed])

Correct Patterns:
- walks / camina [Notes: 3ª persona sing. de 'to walk / caminar']
- (the) cards / (die) Karten [Notes: Acusativo pl. de '(the) card / (die) Karte']
- went / fue [Notes: Pasado de 'to go / ir']
- (the) improvement / (die) Verbesserung [Notes: (leave empty, already a lemma)]
- quickly / rápidamente [Notes: (leave empty, already a lemma)]
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
