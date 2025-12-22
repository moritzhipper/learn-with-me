import { BankShareSchema, LanguageConfigSchema } from '@shared/schemas'
import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import { fetchNewBanks, fetchPopularBanks, shareBank } from '../handler/banks'

const options = {}

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.route({
    method: 'GET',
    url: '/banks/new',
    schema: {
      querystring: LanguageConfigSchema,
      response: {
        200: z.array(BankShareSchema)
      }
    },
    handler: fetchNewBanks
  })

  fastify.route({
    method: 'GET',
    url: '/banks/popular',
    schema: {
      querystring: LanguageConfigSchema,
      response: {
        200: z.array(BankShareSchema.omit({ expires: true }))
      }
    },
    handler: fetchPopularBanks
  })

  fastify.route({
    method: 'POST',
    url: '/banks/share',
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
