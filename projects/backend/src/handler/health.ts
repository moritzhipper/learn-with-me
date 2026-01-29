import { FastifyRequest } from 'fastify'
import { db } from '../db/db'

export const checkHealth = async (req: FastifyRequest): Promise<void> => {
  // verify db connection
  await db.execute('SELECT 1')
  return
}
