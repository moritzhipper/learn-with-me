import { BankShareBase } from '@shared/types'
import { boolean, integer, jsonb, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

// manage some json values as separate columns for indexing and easy querying
export const banks = pgTable('banks', {
  id: uuid().primaryKey().defaultRandom(),
  createdAt: timestamp().notNull().defaultNow(),
  expires: timestamp(),
  downloadCount: integer().notNull().default(0),
  lastDownloadAt: timestamp(),
  isCommunityBank: boolean().notNull().default(false),
  speaking: varchar({ length: 256 }).notNull(),
  learning: varchar({ length: 256 }).notNull(),
  bankJson: jsonb().notNull().$type<BankShareBase>()
})
