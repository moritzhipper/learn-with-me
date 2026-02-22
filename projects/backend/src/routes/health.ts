import { API_ROUTES } from '@shared/api-routes'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { checkHealth } from '../handler/health'

export const healthHandler: FastifyPluginAsyncZod = async (fastify): Promise<void> => {
  fastify.route({
    method: 'GET',
    url: API_ROUTES.HEALTH,
    handler: checkHealth
  })
}
