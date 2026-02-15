import 'dotenv/config'
import z from 'zod'

const EnvironmentSchema = z.object({
  DB_URL: z.string(),
  BACKEND_PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  POSTGRES_PASSWORD: z.string(),
  MIGRATIONS_PATH: z.string().default('./migrations')
})

export const env = EnvironmentSchema.parse(process.env)
