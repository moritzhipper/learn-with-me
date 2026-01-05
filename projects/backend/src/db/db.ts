import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { env } from '../environment'

const pool = new Pool({
  connectionString: env.DB_URL,
  ssl: env.NODE_ENV === 'production'
})

export const db = drizzle(pool)
