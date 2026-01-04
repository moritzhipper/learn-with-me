import { BankShare, BanksRequest } from '@shared/types'

import { desc } from 'drizzle-orm'
import { FastifyRequest } from 'fastify'
import { db } from '../db/db'
import { banks } from '../db/schema'

export const fetchNewBanks = async (
  req: FastifyRequest<{ Querystring: BanksRequest }>
): Promise<BankShare[]> => {
  const result = await db
    .select()
    .from(banks)
    .orderBy(desc(banks.createdAt))
    .limit(req.query.limit)
    .offset(req.query.offset || 0)

  // add filter and sort by  category and language here
  // map tp BankShare type
  return []
}

export const shareBank = async (
  req: FastifyRequest<{ Body: BankShare }>
): Promise<{ shareId: string }> => {
  return { shareId: 'dummy-id' }
}
