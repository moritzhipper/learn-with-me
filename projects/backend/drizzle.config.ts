import { defineConfig } from 'drizzle-kit'
import { env } from './src/environment'

export default defineConfig({
  out: './projects/backend/migrations',
  schema: './projects/backend/src/db/schema.ts',
  breakpoints: false,
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DB_URL
  }
})
