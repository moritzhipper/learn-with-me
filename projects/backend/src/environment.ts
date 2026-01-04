import z from 'zod'

const EnvironmentSchema = z.object({
  DB_URL: z.string(),
  PORT: z.string().default('3000'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production')
})

export const env = EnvironmentSchema.parse(process.env)
