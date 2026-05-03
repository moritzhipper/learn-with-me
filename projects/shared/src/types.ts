import z from 'zod'
import { PracticeActiveSchema, PracticeConfigSchema } from './practice-schemas'
import {
  BankShareBaseSchema,
  BankShareConfigSchema,
  BankShareRequestSchema,
  BankShareViaDBSchema,
  BanksRequestConfigSchema,
  BanksRequestSchema,
  BankUserSchema,
  CollectionBaseSchema,
  CollectionUserSchema,
  Guess,
  GuessableSchema,
  LanguageConfigRequestSchema,
  LanguageConfigSchema,
  LearnableBaseSchema,
  LearnableFromAiSchema,
  LearnableFromAiWithTypeSchema,
  LearnableUserSchema,
  LearnableWithIdSchema,
  ObjectWithIdSchema,
  PaginationSchema,
  RequestHeaderSchema,
  TranslationHistoryItemSchema
} from './schemas'

export type LearnableBase = z.infer<typeof LearnableBaseSchema>

export type Collection = z.infer<typeof CollectionBaseSchema>
export type CollectionUser = z.infer<typeof CollectionUserSchema>

export type LanguageConfig = z.infer<typeof LanguageConfigSchema>
export type LanguageConfigRequest = z.infer<typeof LanguageConfigRequestSchema>
export type BanksRequest = z.infer<typeof BanksRequestSchema>
export type BankUser = z.infer<typeof BankUserSchema>
export type BankShareBase = z.infer<typeof BankShareBaseSchema>
export type BankShareConfig = z.infer<typeof BankShareConfigSchema>
export type BankShareRequest = z.infer<typeof BankShareRequestSchema>
export type ObjectWithId = z.infer<typeof ObjectWithIdSchema>
export type BankShareViaDB = z.infer<typeof BankShareViaDBSchema>
export type BankBase = Pick<BankShareBase, 'name' | 'language'>

export type Guessable = z.infer<typeof GuessableSchema>
export type PracticeActive = z.infer<typeof PracticeActiveSchema>
export type PracticeConfig = z.infer<typeof PracticeConfigSchema>
export type Guess = z.infer<typeof Guess>

export type TranslationHistoryItem = z.infer<typeof TranslationHistoryItemSchema>
export type LearnableWithId = z.infer<typeof LearnableWithIdSchema>
export type LearnableFromAI = z.infer<typeof LearnableFromAiSchema>
export type LearnableFromAIWithType = z.infer<typeof LearnableFromAiWithTypeSchema>
export type UserLearnable = z.infer<typeof LearnableUserSchema>

export type PaginationConfig = z.infer<typeof PaginationSchema>
export type BankRequestConfig = z.infer<typeof BanksRequestConfigSchema>
export type UserLearnablePartial = Partial<UserLearnable> & Pick<UserLearnable, 'id'>

export type RequestHeader = z.infer<typeof RequestHeaderSchema>

/** A tuple of 5 booleans representing the last 5 guess results */
export type GuessHistory = [boolean, boolean, boolean, boolean, boolean]
