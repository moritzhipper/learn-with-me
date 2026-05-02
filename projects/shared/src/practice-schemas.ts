import z from 'zod'
import { GuessableSchema } from './schemas'

export const PracticeConfigBaseSchema = z.object({
  direction: z.literal(['forward', 'reverse']),
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

export const PracticeConfigSchema = z
  .discriminatedUnion('type', [
    PracticeConfigCustomSchema,
    PracticeConfigCollectionSchema,
    PracticeConfigAddedOnDaySchema
  ])
  .and(PracticeConfigBaseSchema)

export const PracticeActiveSchema = z
  .object({
    createdAt: z.coerce.date(),
    guessableIndex: z.number(),
    guessables: z.array(GuessableSchema)
  })
  .and(PracticeConfigSchema)
