import { z } from 'zod'

export const LearnableFromAiSchema = z.object({
  lexeme: z.string(),
  translation: z.string()
})

export const LearnablesFromAiSchema = z.object({
  cards: z.array(LearnableFromAiSchema)
})

export const LearnableBaseSchema = LearnableFromAiSchema.extend({
  type: z.enum(['phrase', 'word']),
  notes: z.string()
})

export const LearnableWithIdSchema = LearnableBaseSchema.extend({
  id: z.uuid()
})

export const LearnableUserSchema = LearnableWithIdSchema.extend({
  createdAt: z.coerce.date(),
  guesses: z.object({
    lexeme: z.array(z.boolean()).length(5),
    translation: z.array(z.boolean()).length(5)
  })
})

export const CollectionBaseSchema = z.object({
  name: z.string(),
  id: z.string(),
  cardIds: z.array(z.uuid())
})

export const CollectionUserSchema = CollectionBaseSchema.extend({
  createdAt: z.coerce.date()
})

export const LanguageConfigSchema = z.object({
  speaking: z.string(),
  learning: z.string()
})

export const LanguageConfigRequestSchema = LanguageConfigSchema.partial()

export const BankBaseSchema = z.object({
  language: LanguageConfigSchema,
  name: z.string()
})

export const BankUserSchema = BankBaseSchema.extend({
  id: z.string(),
  createdAt: z.coerce.date(),
  learnables: z.array(LearnableUserSchema),
  collections: z.array(CollectionUserSchema)
})

export const BankShareConfigParamsSchema = z.object({
  ttlMinutes: z.number().nullable().default(null),
  isCommunityBank: z.boolean().default(false)
})

export const BankShareBaseSchema = BankBaseSchema.extend({
  learnables: z.array(LearnableWithIdSchema),
  collections: z.array(CollectionBaseSchema)
})

export const BankShareViaDBSchema = BankShareBaseSchema.extend({
  id: z.string(),
  createdAt: z.coerce.date(),
  expires: z.coerce.date().nullable(),
  isCommunityBank: z.boolean(),
  downloads: z.number()
})

export const PaginationSchema = z.object({
  limit: z.coerce.number().min(1).max(30),
  offset: z.coerce.number().min(0).max(1000).optional()
})

export const BanksRequestConfigSchema = z.object({
  sortBy: z.enum(['new', 'top']),
  userId: z.uuid().optional()
})

export const BanksRequestSchema = z.object({
  ...LanguageConfigRequestSchema.shape,
  ...BanksRequestConfigSchema.shape,
  ...PaginationSchema.shape
})

export const RequestHeaderSchema = z.object({
  'x-user-id': z.uuid()
})
