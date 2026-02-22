import 'dotenv/config'
import z from 'zod'

const EnvironmentSchema = z.object({
  BACKEND_PORT: z.coerce.number(),
  DB_HOST: z.string().default('db'),
  DB_PORT: z.coerce.number().default(5432),
  POSTGRES_DB: z.string(),
  DB_USER_MIGRATOR: z.string(),
  DB_PASSWORD_MIGRATOR: z.string(),
  DB_USER_APP: z.string(),
  DB_PASSWORD_APP: z.string(),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  MIGRATIONS_PATH: z.string().default('./migrations')
})

export const env = EnvironmentSchema.parse(process.env)
