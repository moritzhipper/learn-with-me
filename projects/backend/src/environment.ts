import 'dotenv/config'
import z from 'zod'

const EnvironmentSchema = z.object({
  BACKEND_PORT: z.coerce.number(),
  DB_URL: z.string(),
  DB_NAME: z.string(),
  POSTGRES_USER_MIGRATOR: z.string(),
  POSTGRES_PASSWORD_MIGRATOR: z.string(),
  POSTGRES_USER_APP: z.string(),
  POSTGRES_PASSWORD_APP: z.string(),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  MIGRATIONS_PATH: z.string().default('./migrations')
})

export const env = EnvironmentSchema.parse(process.env)
