import { API_ROUTES } from '@shared/api-routes'
import { FastifyPluginAsync } from 'fastify'
import { checkHealth } from '../handler/health'

const options = {}

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.route({
    method: 'GET',
    url: API_ROUTES.HEALTH,
    handler: checkHealth
  })
}

export default root
