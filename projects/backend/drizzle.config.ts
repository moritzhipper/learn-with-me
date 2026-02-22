import { defineConfig } from 'drizzle-kit'
import { env } from './src/environment'

export default defineConfig({
  out: './projects/backend/migrations',
  schema: './projects/backend/src/db/schema.ts',
  breakpoints: false,
  dialect: 'postgresql',
  dbCredentials: {
    database: env.POSTGRES_DB,
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER_MIGRATOR,
    password: env.DB_PASSWORD_MIGRATOR
  }
})
