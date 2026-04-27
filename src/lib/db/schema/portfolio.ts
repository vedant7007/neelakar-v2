import { pgTable, uuid, varchar, integer, boolean, timestamp } from 'drizzle-orm/pg-core'

export const portfolioItems = pgTable('portfolio_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 100 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  imageUrl: varchar('image_url', { length: 500 }).notNull(),
  imageStoragePath: varchar('image_storage_path', { length: 500 }),
  context: varchar('context', { length: 30 }).notNull().default('portfolio'),
  subtitle: varchar('subtitle', { length: 200 }),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
