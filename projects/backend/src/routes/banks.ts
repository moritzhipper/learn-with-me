import { API_ROUTES } from '@shared/api-routes'
import { BankShareSchema, BanksRequestSchema } from '@shared/schemas'
import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import { fetchNewBanks, shareBank } from '../handler/banks'

const options = {}

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.route({
    method: 'GET',
    url: API_ROUTES.BANKS.ROOT,
    schema: {
      querystring: BanksRequestSchema,
      response: {
        200: z.array(BankShareSchema)
      }
    },
    handler: fetchNewBanks
  })

  fastify.route({
    method: 'POST',
    url: API_ROUTES.BANKS.SHARE,
    schema: {
      body: BankShareSchema,
      response: {
        200: BankShareSchema
      }
    },
    handler: shareBank
  })
}

export default root
