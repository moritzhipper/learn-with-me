import { API_ROUTES } from '@shared/api-routes'
import { BankShareSchema, LanguageConfigRequestSchema } from '@shared/schemas'
import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import { fetchNewBanks, fetchPopularBanks, shareBank } from '../handler/banks'

const options = {}

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.route({
    method: 'GET',
    url: API_ROUTES.BANKS.NEW,
    schema: {
      querystring: LanguageConfigRequestSchema,
      response: {
        200: z.array(BankShareSchema)
      }
    },
    handler: fetchNewBanks
  })

  fastify.route({
    method: 'GET',
    url: API_ROUTES.BANKS.POPULAR,
    schema: {
      querystring: LanguageConfigRequestSchema,
      response: {
        200: z.array(BankShareSchema)
      }
    },
    handler: fetchPopularBanks
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
