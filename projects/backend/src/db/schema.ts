import { boolean, jsonb, pgTable, primaryKey, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { BankFromDatabase } from '../types'

// manage some json values as separate columns for indexing and easy querying
export const banks = pgTable('banks', {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid().notNull(),
  name: varchar({ length: 512 }).notNull(),
  speaking: varchar().notNull(),
  learning: varchar().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  expires: timestamp(),
  is_community_bank: boolean().notNull().default(false),
  bank_json: jsonb().notNull().$type<BankFromDatabase>()
})

export const downloadCounts = pgTable(
  'download_counts',
  {
    bank_id: uuid()
      .references(() => banks.id, { onDelete: 'cascade' })
      .notNull(),
    user_id: uuid().notNull(),
    timestamp: timestamp().notNull().defaultNow()
  },
  (table) => [primaryKey({ columns: [table.bank_id, table.user_id] })]
)
