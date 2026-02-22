import sensible from '@fastify/sensible'
import Fastify from 'fastify'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import { applyMigration as applyDBMigration } from './db/applyMigration'
import { env } from './environment'
import { errorHandler } from './handler/errors'
import { validateUserheader } from './plugins/validate-user-header'
import { banksHandler } from './routes/banks'
import { healthHandler } from './routes/health'

const app = Fastify({
  logger: {
    level: env.LOG_LEVEL,
    ...(env.NODE_ENV !== 'production' && {
      transport: {
        target: 'pino-pretty'
      }
    })
  }
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)
app.withTypeProvider<ZodTypeProvider>()

app.register(sensible)
app.register(healthHandler)
app.register(validateUserheader)
app.register(banksHandler)
app.setErrorHandler(errorHandler)

const start = async () => {
  try {
    await applyDBMigration(app.log)
    await app.listen({ port: env.BACKEND_PORT, host: '0.0.0.0' })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
