import sensible from '@fastify/sensible'
import Fastify from 'fastify'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import { env } from './environment'
import { checkHealth } from './handler/health'
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
    await checkHealth()
    const address = await app.listen({ port: env.PORT, host: '0.0.0.0' })
    console.log(`Server listening at ${address}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
