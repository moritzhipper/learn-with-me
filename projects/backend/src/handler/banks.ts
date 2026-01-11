import { BankShareRequest, BankShareViaDB, BanksRequest, ObjectWithId } from '@shared/types'

import { and, desc, eq, gt, ilike, isNull, or } from 'drizzle-orm'
import { FastifyRequest } from 'fastify'
import { db } from '../db/db'
import { banks } from '../db/schema'
import { BankFromDatabase } from '../types'

export const fetchBanks = async (
  req: FastifyRequest<{ Querystring: BanksRequest }>
): Promise<BankShareViaDB[]> => {
  const result = await db
    .select()
    .from(banks)
    .where(
      and(
        eq(banks.is_community_bank, true),
        or(gt(banks.expires, new Date()), isNull(banks.expires)),
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
    .where(
      and(eq(banks.user_id, req.userID), or(gt(banks.expires, new Date()), isNull(banks.expires)))
    )
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
  req: FastifyRequest<{ Body: BankShareRequest }>
): Promise<ObjectWithId> => {
  let expiryDate: Date | null = null

  const { config, bank } = req.body

  // does this also accomondate for stepping over to the next minute?
  if (config.ttlMinutes) {
    expiryDate = new Date()
    expiryDate.setMinutes(expiryDate.getMinutes() + config.ttlMinutes)
  }

  const dbBank: BankFromDatabase = {
    collections: bank.collections,
    learnables: bank.learnables
  }

  const rows = await db
    .insert(banks)
    .values({
      user_id: req.userID,
      speaking: bank.language.speaking,
      learning: bank.language.learning,
      name: bank.name,
      bank_json: dbBank,
      expires: expiryDate,
      is_community_bank: config.isCommunityBank
    })
    .returning({
      id: banks.id
    })

  const row = rows[0]
  if (!row) throw new Error('Insert failed')

  // filter uncool things here?

  return row
}
