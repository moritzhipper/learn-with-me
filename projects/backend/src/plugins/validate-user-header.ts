import { RequestHeaderSchema } from '@shared/schemas'
import { RequestHeader } from '@shared/types'
import { FastifyInstance, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'

export const validateUserheader = fp(async (fastify: FastifyInstance) => {
  fastify.addHook('preHandler', async (req: FastifyRequest<{ Headers: RequestHeader }>) => {
    try {
      const headers = RequestHeaderSchema.parse(req.headers)
      req.userID = headers['x-user-id']
    } catch (e) {
      fastify.log.error(e)
      throw fastify.httpErrors.badRequest('Invalid or missing x-user-id header')
    }
  })
})
