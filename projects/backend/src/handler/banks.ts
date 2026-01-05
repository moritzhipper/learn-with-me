import { BankShareBase, BankShareViaDB, BanksRequest } from '@shared/types'

import { and, desc, ilike } from 'drizzle-orm'
import { FastifyRequest } from 'fastify'
import { db } from '../db/db'
import { banks } from '../db/schema'

export const fetchNewBanks = async (
  req: FastifyRequest<{ Querystring: BanksRequest }>
): Promise<BankShareViaDB[]> => {
  const result = await db
    .select()
    .from(banks)
    .where(
      and(
        req.query.speaking ? ilike(banks.speaking, req.query.speaking) : undefined,
        req.query.learning ? ilike(banks.learning, req.query.learning) : undefined
      )
    )
    .orderBy(desc(banks.createdAt))
    .limit(req.query.limit)
    .offset(req.query.offset || 0)

  // add filter and sort by  category and language here
  // map tp BankShare type

  const mapped: BankShareViaDB[] = result.map((row) => ({
    id: row.id,
    downloads: row.downloadCount,
    createdAt: row.createdAt,
    expires: row.ttl || null,
    ...row.bankJson
  }))

  return mapped
}

export const shareBank = async (
  req: FastifyRequest<{ Body: BankShareBase }>
): Promise<BankShareViaDB> => {
  const rows = await db
    .insert(banks)
    .values({
      speaking: req.body.language.speaking,
      learning: req.body.language.learning,
      bankJson: req.body
    })
    .returning({ id: banks.id, createdAt: banks.createdAt, bankJson: banks.bankJson })

  const row = rows[0]
  if (!row) throw new Error('Insert failed')

  // filter uncool things here

  return {
    id: row.id,
    downloads: 0,
    createdAt: row.createdAt,
    expires: null,
    ...row.bankJson
  }
}
