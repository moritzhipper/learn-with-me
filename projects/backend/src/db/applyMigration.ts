import { sql } from 'drizzle-orm'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { env } from '../environment'
import { db } from './db'

type DrizzleVersion = {
  id: number
  hash: string
  created_at: Date
}

export const applyMigration = async () => {
  const versionBefore = await getDrizzleVersion()
  await migrate(db, { migrationsFolder: env.MIGRATIONS_PATH })
  const versionAfter = await getDrizzleVersion()
  if (versionBefore?.hash === versionAfter?.hash) {
    console.log(
      `No DB migrations to apply, using ${versionBefore?.hash} from ${versionBefore?.created_at.toISOString()}`
    )
  } else {
    console.log(`Migrated from db version ${versionBefore?.hash} to ${versionAfter?.hash}`)
  }
}

const getDrizzleVersion = async (): Promise<null | DrizzleVersion> => {
  const result = await db.execute<DrizzleVersion>(sql`
    SELECT id, hash, created_at 
    FROM drizzle.__drizzle_migrations 
    ORDER BY created_at DESC 
    LIMIT 1
  `)

  const version = result.rows[0]
  if (!version) return null

  return {
    id: version.id,
    hash: version.hash,
    created_at: new Date(Number(version.created_at))
  }
}
