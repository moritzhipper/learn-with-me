import { db } from '../db/db'

export const checkHealth = async (): Promise<void> => {
  await db.execute('SELECT 1')

  return
}
