import { FastifyBaseLogger } from 'fastify'
import { dbApp } from '../db/db'

export const checkHealth = async (log: FastifyBaseLogger): Promise<void> => {
  await dbApp.execute('SELECT 1')
  log.info('Database connection is healthy')
}
