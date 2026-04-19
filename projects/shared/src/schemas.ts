import { z } from 'zod'

export const LearnableFromAiSchema = z.object({
  lexeme: z.string(),
  translation: z.string()
})

export const LearnableFromAiWithTypeSchema = LearnableFromAiSchema.extend({
  type: z.enum(['phrase', 'word'])
})

export const LearnablesFromAiSchema = z.object({
  cards: z.array(LearnableFromAiSchema)
})

export const LearnableBaseSchema = LearnableFromAiWithTypeSchema.extend({
  notes: z.string()
})

export const LearnableWithIdSchema = LearnableBaseSchema.extend({
  id: z.uuid()
})

export const TranslationHistoryItemSchema = LearnableFromAiSchema.extend({
  tone: z.string(),
  createdAt: z.coerce.date(),
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

export const Guess = z.literal(['right', 'wrong', 'unanswered'])
export const GuessableSchema = z.object({
  id: z.string(),
  guess: Guess
})

export const PracticeBaseSchema = z.object({
  createdAt: z.coerce.date(),
  guessableIndex: z.number(),
  guessables: z.array(GuessableSchema),
  direction: z.literal(['forward', 'reverse'])
})

export const CustomPracticeSchema = PracticeBaseSchema.extend({
  type: z.literal('custom')
})

export const CollectionPracticeSchema = PracticeBaseSchema.extend({
  type: z.literal('collection'),
  collectionId: z.string()
})

export const PracticeSchema = z.discriminatedUnion('type', [
  CustomPracticeSchema,
  CollectionPracticeSchema
])

export const BankUserSchema = BankBaseSchema.extend({
  id: z.string(),
  createdAt: z.coerce.date(),
  translations: z.object({
    magicTranslateCards: z.array(LearnableWithIdSchema),
    history: z.array(TranslationHistoryItemSchema),
    tone: z.string()
  }),
  learnables: z.array(LearnableUserSchema),
  collections: z.array(CollectionUserSchema),
  practice: z.object({
    current: PracticeSchema.nullable(),
    history: z.array(PracticeSchema)
  })
})

export const BankShareConfigSchema = z.object({
  ttlMinutes: z.number().nullable().default(null),
  isCommunityBank: z.boolean().default(false)
})

export const BankShareBaseSchema = BankBaseSchema.extend({
  learnables: z.array(LearnableWithIdSchema),
  collections: z.array(CollectionBaseSchema)
})

export const BankShareRequestSchema = z.object({
  config: BankShareConfigSchema,
  bank: BankShareBaseSchema
})

export const ObjectWithIdSchema = z.object({
  id: z.uuid()
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
  sortBy: z.enum(['new', 'top'])
})

export const BanksRequestSchema = z.object({
  ...LanguageConfigRequestSchema.shape,
  ...BanksRequestConfigSchema.shape,
  ...PaginationSchema.shape
})

export const RequestHeaderSchema = z.object({
  'x-user-id': z.uuid()
})
