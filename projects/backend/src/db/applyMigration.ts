import { sql } from 'drizzle-orm'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { db } from './db'

type DrizzleVersion = {
  id: number
  hash: string
  created_at: Date
}

export const applyMigration = async () => {
  const versionBefore = await getDrizzleVersion()
  await migrate(db, { migrationsFolder: './projects/backend/migrations' })
  const versionAfter = await getDrizzleVersion()
  if (versionBefore?.hash === versionAfter?.hash) {
    console.log(`No DB migrations to apply, using`, versionBefore)
  } else {
    console.log(`Migrated from db version`, versionBefore, `to`, versionAfter)
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
