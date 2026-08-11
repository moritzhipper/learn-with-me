import { BankShareRequest, BankShareViaDB, BanksRequest, ObjectWithId } from '@shared/types'

import { httpErrors } from '@fastify/sensible'
import { and, count, desc, eq, gt, ilike, InferSelectModel, isNull, or, SQL } from 'drizzle-orm'
import { FastifyRequest } from 'fastify'
import { dbApp } from '../db/db'
import { banks, downloadCounts } from '../db/schema'
import { BankFromDatabase } from '../types'

type BankWithDownloadCount = { bank: InferSelectModel<typeof banks>; downloadCount: number }

export const fetchBanks = async (
  req: FastifyRequest<{ Querystring: BanksRequest }>
): Promise<BankShareViaDB[]> => {
  const result = await getBanksQuery()
    .where(mapParamsToWhereClause(req.query))
    .orderBy(
      req.query.sortBy === 'new' ? desc(banks.created_at) : desc(count(downloadCounts.bank_id))
    )
    .limit(req.query.limit)
    .offset(req.query.offset || 0)

  return result.map(mapResultToBankShareViaDB)
}

export const fetchUserBanks = async (req: FastifyRequest): Promise<BankShareViaDB[]> => {
  const result = await getBanksQuery()
    .where(
      and(eq(banks.user_id, req.userID), or(gt(banks.expires, new Date()), isNull(banks.expires)))
    )
    .orderBy(desc(banks.created_at))

  return result.map(mapResultToBankShareViaDB)
}

export const fetchBankById = async (
  req: FastifyRequest<{ Params: { id: string } }>
): Promise<BankShareViaDB> => {
  const result = await getBanksQuery().where(eq(banks.id, req.params.id))

  if (!result || result.length === 0) throw httpErrors.notFound

  return mapResultToBankShareViaDB(result[0])
}

export const increaseDownloadCount = async (
  req: FastifyRequest<{ Params: { id: string } }>
): Promise<void> => {
  // fail silently, as it is not critical
  try {
    await dbApp.insert(downloadCounts).values({
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

  const rows = await dbApp
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

const mapResultToBankShareViaDB = ({
  bank,
  downloadCount
}: BankWithDownloadCount): BankShareViaDB => ({
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

const getBanksQuery = () =>
  dbApp
    .select({
      bank: banks,
      downloadCount: count(downloadCounts.bank_id)
    })
    .from(banks)
    .leftJoin(downloadCounts, eq(banks.id, downloadCounts.bank_id))
    .groupBy(banks.id)
    .$dynamic()

const mapParamsToWhereClause = (params: BanksRequest): SQL<unknown> | undefined => {
  const requestDirectionMatch = and(
    params.speaking ? ilike(banks.speaking, params.speaking) : undefined,
    params.learning ? ilike(banks.learning, params.learning) : undefined
  )

  const reverseDirectionMatch = and(
    params.speaking ? ilike(banks.learning, params.speaking) : undefined,
    params.learning ? ilike(banks.speaking, params.learning) : undefined
  )

  return and(
    eq(banks.is_community_bank, true),
    or(gt(banks.expires, new Date()), isNull(banks.expires)),
    or(requestDirectionMatch, reverseDirectionMatch)
  )
}
