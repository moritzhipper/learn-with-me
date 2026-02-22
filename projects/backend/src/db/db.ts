import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { env } from '../environment'
import * as schema from './schema'

const poolApp = new Pool({
  connectionString: env.DB_URL,
  user: env.POSTGRES_USER_APP,
  password: env.POSTGRES_PASSWORD_APP
})

const poolMigrator = new Pool({
  connectionString: env.DB_URL,
  user: env.POSTGRES_USER_MIGRATOR,
  password: env.POSTGRES_PASSWORD_MIGRATOR,
  max: 1
})

export const dbApp = drizzle(poolApp, { schema })
export const dbMigrator = drizzle(poolMigrator, { schema })
