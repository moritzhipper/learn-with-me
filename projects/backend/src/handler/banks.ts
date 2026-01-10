import { BankShareBase, BankShareConfigParams, BankShareViaDB, BanksRequest } from '@shared/types'

import { and, desc, eq, ilike } from 'drizzle-orm'
import { FastifyRequest } from 'fastify'
import { db } from '../db/db'
import { banks } from '../db/schema'

export const fetchBanks = async (
  req: FastifyRequest<{ Querystring: BanksRequest }>
): Promise<BankShareViaDB[]> => {
  const result = await db
    .select()
    .from(banks)
    .where(
      and(
        eq(banks.is_community_bank, true),
        req.query.speaking ? ilike(banks.speaking, req.query.speaking) : undefined,
        req.query.learning ? ilike(banks.learning, req.query.learning) : undefined
      )
    )
    .orderBy(desc(banks.created_at))
    .limit(req.query.limit)
    .offset(req.query.offset || 0)

  // add filter and sort by  category and language here
  // map tp BankShare type

  return result.map((row) => ({
    id: row.id,
    downloads: 10,
    createdAt: row.created_at,
    expires: row.expires,
    isCommunityBank: row.is_community_bank,
    language: {
      speaking: row.speaking,
      learning: row.learning
    },
    name: row.name,
    ...row.bank_json
  }))
}

export const fetchUserBanks = async (req: FastifyRequest): Promise<BankShareViaDB[]> => {
  const result = await db
    .select()
    .from(banks)
    .where(eq(banks.user_id, req.userID))
    .orderBy(desc(banks.created_at))

  return result.map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    expires: row.expires,
    isCommunityBank: row.is_community_bank,
    downloads: 10,
    language: {
      speaking: row.speaking,
      learning: row.learning
    },
    name: row.name,
    ...row.bank_json
  }))
}

export const fetchBankById = async (
  req: FastifyRequest<{ Params: { id: string } }>
): Promise<BankShareViaDB | null> => {
  const result = await db.select().from(banks).where(eq(banks.id, req.params.id)).limit(1)

  const row = result[0]
  if (!row) return null

  return {
    id: row.id,
    createdAt: row.created_at,
    expires: row.expires,
    isCommunityBank: row.is_community_bank,
    language: {
      speaking: row.speaking,
      learning: row.learning
    },
    name: row.name,
    downloads: 10,
    ...row.bank_json
  }
}

export const shareBank = async (
  req: FastifyRequest<{ Body: BankShareBase; Params: BankShareConfigParams }>
): Promise<BankShareViaDB> => {
  let expiryDate: Date | null = null
  if (req.params.ttlMinutes) {
    expiryDate = new Date()
    expiryDate.setMinutes(expiryDate.getMinutes() + req.params.ttlMinutes)
  }

  const rows = await db
    .insert(banks)
    .values({
      user_id: req.userID,
      speaking: req.body.language.speaking,
      learning: req.body.language.learning,
      name: req.body.name,
      bank_json: req.body,
      expires: expiryDate,
      is_community_bank: req.params.isCommunityBank
    })
    .returning()

  const row = rows[0]
  if (!row) throw new Error('Insert failed')

  // filter uncool things here

  return {
    id: row.id,
    downloads: 0,
    createdAt: row.created_at,
    expires: row.expires,
    isCommunityBank: row.is_community_bank,
    language: {
      speaking: row.speaking,
      learning: row.learning
    },
    name: row.name,
    ...row.bank_json
  }
}
