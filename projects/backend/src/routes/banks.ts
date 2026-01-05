import { API_ROUTES } from '@shared/api-routes'
import { BankShareBaseSchema, BankShareViaDBSchema, BanksRequestSchema } from '@shared/schemas'
import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import { fetchNewBanks as fetchSharedBanks, shareBank } from '../handler/banks'

const options = {}

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.route({
    method: 'GET',
    url: API_ROUTES.BANKS.ROOT,
    schema: {
      querystring: BanksRequestSchema,
      response: {
        200: z.array(BankShareViaDBSchema)
      }
    },
    handler: fetchSharedBanks
  })

  fastify.route({
    method: 'POST',
    url: API_ROUTES.BANKS.SHARE,
    schema: {
      body: BankShareBaseSchema,
      response: {
        200: BankShareViaDBSchema
      }
    },
    handler: shareBank
  })
}

export default root
