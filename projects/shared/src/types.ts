import z from 'zod'
import {
  BankShareSchema,
  BankUserSchema,
  CollectionBaseSchema,
  CollectionUserSchema,
  LanguageConfigRequestSchema,
  LanguageConfigSchema,
  LearnableBaseSchema,
  LearnableFromAiSchema,
  LearnableUserSchema,
  LearnableWithIdSchema
} from './schemas'

export type LearnableBase = z.infer<typeof LearnableBaseSchema>

export type Collection = z.infer<typeof CollectionBaseSchema>
export type CollectionUser = z.infer<typeof CollectionUserSchema>

export type LanguageConfig = z.infer<typeof LanguageConfigSchema>
export type LanguageConfigRequest = z.infer<typeof LanguageConfigRequestSchema>
export type BankUser = z.infer<typeof BankUserSchema>
export type BankShare = z.infer<typeof BankShareSchema>
export type BankBase = Pick<BankShare, 'name' | 'language'>

export type LearnableWithId = z.infer<typeof LearnableWithIdSchema>
export type LearnableFromAI = z.infer<typeof LearnableFromAiSchema>
export type UserLearnable = z.infer<typeof LearnableUserSchema>

export type UserLearnablePartial = Partial<UserLearnable> & Pick<UserLearnable, 'id'>

/** A tuple of 5 booleans representing the last 5 guess results */
export type GuessHistory = [boolean, boolean, boolean, boolean, boolean]
