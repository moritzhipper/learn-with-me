import { BankShareBase } from '@shared/types'
import 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    userID: string
  }
  interface FastifyContextConfig {
    skipAuth?: boolean
  }
}

export type BankFromDatabase = Omit<BankShareBase, 'language' | 'name'>
