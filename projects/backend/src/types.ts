import { BankShareBase } from '@shared/types'
import 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    userID: string
  }
}

export type BankFromDatabase = Omit<BankShareBase, 'language' | 'name'>
