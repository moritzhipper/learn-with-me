import sensible from '@fastify/sensible'
import Fastify from 'fastify'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import { applyMigration as applyDBMigration } from './db/applyMigration'
import { env } from './environment'
import { checkHealth as checkDBHealth } from './handler/health'
import { validateUserheader } from './plugins/validate-user-header'
import bankRoutes from './routes/banks'
import health from './routes/health'

const app = Fastify({
  logger: {
    level: 'trace',
    transport: {
      target: 'pino-pretty' // Built-in pretty logs for dev
    }
  }
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)
app.withTypeProvider<ZodTypeProvider>()

app.register(sensible)
app.register(health)
app.register(validateUserheader)
app.register(bankRoutes)

const start = async () => {
  try {
    await checkDBHealth(app.log)
    await applyDBMigration(app.log)
    await app.listen({ port: env.BACKEND_PORT, host: '0.0.0.0' })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
