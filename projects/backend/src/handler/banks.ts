import { BankShare, LanguageConfig } from '@shared/types'
import { FastifyRequest } from 'fastify'

export const fetchNewBanks = async (
  req: FastifyRequest<{ Querystring: LanguageConfig }>
): Promise<BankShare[]> => {
  console.log(req.query)
  return []
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
