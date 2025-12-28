import { wait } from '@shared/testing/helper'
import { mockOnlineBanks } from '@shared/testing/mockBanks'
import { BankShare, BanksRequest, LanguageConfig } from '@shared/types'

import { FastifyRequest } from 'fastify'

export const fetchNewBanks = async (
  req: FastifyRequest<{ Querystring: BanksRequest }>
): Promise<BankShare[]> => {
  console.log(req.query)

  // pause briefly for debugging / rate-limiting simulation
  await wait(200)

  //
  if (!req.query.offset || req.query.offset <= 200) {
    return mockOnlineBanks(req.query.limit)
  }
  return mockOnlineBanks(req.query.limit - 3)
}

export const fetchPopularBanks = async (
  req: FastifyRequest<{ Querystring: LanguageConfig }>
): Promise<BankShare[]> => {
  return []
}

export const shareBank = async (
  req: FastifyRequest<{ Body: BankShare }>
): Promise<{ shareId: string }> => {
  return { shareId: 'dummy-id' }
}
