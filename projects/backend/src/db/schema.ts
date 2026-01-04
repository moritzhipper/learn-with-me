import { BankShare } from '@shared/types'
import { integer, jsonb, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

// manage some json values as separate columns for indexing and easy querying
export const banks = pgTable('banks', {
  id: uuid().primaryKey().defaultRandom(),
  speaking: varchar({ length: 256 }).notNull(),
  learning: varchar({ length: 256 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  lastDownloadAt: timestamp(),
  ttl: timestamp(),
  bankJson: jsonb().notNull().$type<BankShare>(),
  downloadCount: integer().notNull().default(0)
})
