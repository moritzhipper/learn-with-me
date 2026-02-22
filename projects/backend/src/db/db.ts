import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { env } from '../environment'
import * as schema from './schema'

const poolApp = new Pool({
  connectionString: env.DB_URL,
  database: env.DB_NAME,
  user: env.DB_USER_APP,
  password: env.DB_PASSWORD_APP
})

const poolMigrator = new Pool({
  connectionString: env.DB_URL,
  database: env.DB_NAME,
  user: env.DB_USER_MIGRATOR,
  password: env.DB_PASSWORD_MIGRATOR,
  max: 1
})

export const dbApp = drizzle(poolApp, { schema })
export const dbMigrator = drizzle(poolMigrator, { schema })
