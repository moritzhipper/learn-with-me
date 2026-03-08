import { FastifyReply, FastifyRequest } from 'fastify'
import { dbApp } from '../db/db'

export const checkHealth = async (request: FastifyRequest, reply: FastifyReply) => {
  await dbApp.execute('SELECT 1')
  request.log.info('Database connection is healthy')
  return reply.status(200).send({ status: 'ok' })
}
