import 'dotenv/config'
import z from 'zod'

const EnvironmentSchema = z.object({
  DB_URL: z.string(),
  PORT: z.coerce.number(),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  POSTGRES_PASSWORD: z.string()
})

export const env = EnvironmentSchema.parse(process.env)
