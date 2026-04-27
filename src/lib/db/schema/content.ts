import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core'
import { adminProfiles } from './admin-profiles'

export const siteContent = pgTable('site_content', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: text('value').notNull(),
  valueType: varchar('value_type', { length: 20 }).notNull().default('text'),
  label: varchar('label', { length: 200 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  updatedBy: uuid('updated_by').references(() => adminProfiles.id),
})
