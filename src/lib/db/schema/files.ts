import { pgTable, uuid, varchar, bigint, timestamp } from 'drizzle-orm/pg-core'
import { adminProfiles } from './admin-profiles'

export const uploadedFiles = pgTable('uploaded_files', {
  id: uuid('id').primaryKey().defaultRandom(),
  originalName: varchar('original_name', { length: 500 }).notNull(),
  storagePath: varchar('storage_path', { length: 500 }).notNull(),
  publicUrl: varchar('public_url', { length: 500 }).notNull(),
  mimeType: varchar('mime_type', { length: 100 }),
  sizeBytes: bigint('size_bytes', { mode: 'number' }),
  context: varchar('context', { length: 50 }).notNull(),
  uploadedBy: uuid('uploaded_by').references(() => adminProfiles.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
