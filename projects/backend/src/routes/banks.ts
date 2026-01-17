import { API_ROUTES } from '@shared/api-routes'
import {
  BankShareRequestSchema,
  BankShareViaDBSchema,
  BanksRequestSchema,
  ObjectWithIdSchema
} from '@shared/schemas'
import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import {
  fetchBankById,
  fetchBanks as fetchSharedBanks,
  increaseDownloadCount,
  shareBank
} from '../handler/banks'

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
    method: 'GET',
    url: `${API_ROUTES.BANKS.ROOT}/:id`,
    schema: {
      params: ObjectWithIdSchema,
      response: {
        200: BankShareViaDBSchema
      }
    },
    handler: fetchBankById
  })

  fastify.route({
    method: 'GET',
    url: API_ROUTES.BANKS.USER,
    schema: {
      response: {
        200: z.array(BankShareViaDBSchema)
      }
    },
    handler: fetchSharedBanks
  })

  fastify.route({
    method: 'POST',
    url: `${API_ROUTES.BANKS.SHARE}/:id`,
    schema: {
      params: ObjectWithIdSchema,
      response: {
        200: z.void()
      }
    },
    handler: increaseDownloadCount
  })

  fastify.route({
    method: 'POST',
    url: API_ROUTES.BANKS.SHARE,
    schema: {
      body: BankShareRequestSchema,
      response: {
        200: ObjectWithIdSchema
      }
    },
    handler: shareBank
  })
}

export default root
