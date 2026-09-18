import z from 'zod'

export const PracticeConfigBaseSchema = z.object({
  guessableField: z.literal(['translation', 'lexeme']),
  learnableIDs: z.array(z.string())
})

export const PracticeConfigCustomSchema = z.object({
  type: z.literal('custom')
})

export const PracticeConfigCollectionSchema = z.object({
  type: z.literal('collection'),
  collectionId: z.string()
})

export const PracticeConfigAddedOnDaySchema = z.object({
  type: z.literal('added-on-day'),
  dayCardsAddedUTC: z.number()
})

const PracticeTypeSchema = z.discriminatedUnion('type', [
  PracticeConfigCustomSchema,
  PracticeConfigCollectionSchema,
  PracticeConfigAddedOnDaySchema
])

export const PracticeConfigSchema = PracticeTypeSchema.and(PracticeConfigBaseSchema)

export const Guess = z.literal(['right', 'wrong', 'unanswered'])

export const GuessableSchema = z.object({
  id: z.string(),
  guess: Guess
})

export const PracticeActiveSchema = z
  .object({
    createdAt: z.coerce.date(),
    guessableIndex: z.number(),
    guessables: z.array(GuessableSchema),
    isFinished: z.boolean()
  })
  .and(PracticeConfigSchema)

export const PracticeSummarySchema = z
  .object({
    // Each card can be guessed multiple times, while each Summary holds n guesses for n cards in set -> Allows repetition of not right guesses to improve practice rating
    guesses: z.record(Guess, z.number()),
    // Kept for statistical reasons, not to be displayed in direct practice summary
    swipeCount: z.number(),
    createdAt: z.coerce.date()
  })
  .and(PracticeTypeSchema)
