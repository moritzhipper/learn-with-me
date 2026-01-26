import { BankShareRequest, BankShareViaDB, BanksRequest, ObjectWithId } from '@shared/types'

import { and, count, desc, eq, gt, ilike, InferSelectModel, isNull, or } from 'drizzle-orm'
import { FastifyRequest } from 'fastify'
import { db } from '../db/db'
import { banks, downloadCounts } from '../db/schema'
import { BankFromDatabase } from '../types'

// 1. Define the type for the relation
type BankRow = InferSelectModel<typeof banks>
type DownloadCountRow = InferSelectModel<typeof downloadCounts>

// 2. Create a composite type that matches the output of your "with" query
type BankWithRelations = { bank: BankRow; downloadCount: number }

export const fetchBanks = async (
  req: FastifyRequest<{ Querystring: BanksRequest }>
): Promise<BankShareViaDB[]> => {
  const result = await db
    .select({
      bank: banks,
      downloadCount: count(downloadCounts.bank_id)
    })
    .from(banks)
    .leftJoin(downloadCounts, eq(banks.id, downloadCounts.bank_id))
    .groupBy(banks.id)
    .where(
      and(
        eq(banks.is_community_bank, true),
        or(gt(banks.expires, new Date()), isNull(banks.expires)),
        req.query.speaking ? ilike(banks.speaking, req.query.speaking) : undefined,
        req.query.learning ? ilike(banks.learning, req.query.learning) : undefined
      )
    )
    .orderBy(
      req.query.sortBy === 'new' ? desc(banks.created_at) : desc(count(downloadCounts.bank_id))
    )
    .limit(req.query.limit)
    .offset(req.query.offset || 0)

  return result.map(mapResultToBankShareViaDB)
}

export const fetchUserBanks = async (req: FastifyRequest): Promise<BankShareViaDB[]> => {
  const result = await db
    .select({
      bank: banks,
      downloadCount: count(downloadCounts.bank_id)
    })
    .from(banks)
    .leftJoin(downloadCounts, eq(banks.id, downloadCounts.bank_id))
    .groupBy(banks.id)
    .where(
      and(eq(banks.user_id, req.userID), or(gt(banks.expires, new Date()), isNull(banks.expires)))
    )
    .orderBy(desc(banks.created_at))

  return result.map(mapResultToBankShareViaDB)
}

export const fetchBankById = async (
  req: FastifyRequest<{ Params: { id: string } }>
): Promise<BankShareViaDB | null> => {
  const result = await db
    .select({
      bank: banks,
      downloadCount: count(downloadCounts.bank_id)
    })
    .from(banks)
    .leftJoin(downloadCounts, eq(banks.id, downloadCounts.bank_id))
    .groupBy(banks.id)
    .where(eq(banks.id, req.params.id))

  if (!result || result.length === 0) return null

  return mapResultToBankShareViaDB(result[0])
}

export const increaseDownloadCount = async (
  req: FastifyRequest<{ Params: { id: string } }>
): Promise<void> => {
  // fail silently
  try {
    await db.insert(downloadCounts).values({
      bank_id: req.params.id,
      user_id: req.userID
    })
  } catch (e) {
    req.log.error(e)
  } finally {
    return
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

const mapResultToBankShareViaDB = ({ bank, downloadCount }: BankWithRelations): BankShareViaDB => ({
  id: bank.id,
  createdAt: bank.created_at,
  expires: bank.expires,
  isCommunityBank: bank.is_community_bank,
  downloads: downloadCount,
  language: {
    speaking: bank.speaking,
    learning: bank.learning
  },
  name: bank.name,
  ...bank.bank_json
})
