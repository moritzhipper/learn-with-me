import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import { newBanks, popularBanks } from '../handler/banks'

const options = {}

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.route({
    method: 'GET',
    url: '/banks/new',
    schema: {
      response: {
        200: z.object({
          route: z.string()
        })
      }
    },
    handler: newBanks
  })
  fastify.route({
    method: 'GET',
    url: '/banks/popular',
    schema: {
      response: {
        200: z.object({
          route: z.string()
        })
      }
    },
    handler: popularBanks
  })
}

export default root
