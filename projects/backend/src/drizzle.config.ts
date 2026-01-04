import { defineConfig } from 'drizzle-kit'
import { env } from './environment'

export const drizzleConfig = defineConfig({
  out: './migrations',
  schema: './src/db/schema.ts',
  breakpoints: false,
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DB_URL
  }
})
