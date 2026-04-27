import { pgTable, uuid, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core'

export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 320 }).notNull().unique(),
  name: varchar('name', { length: 200 }).notNull(),
  phone: varchar('phone', { length: 30 }),
  serviceTypes: text('service_types').array(),
  status: varchar('status', { length: 20 }).notNull().default('new'),
  notes: text('notes'),
  totalSubmissions: integer('total_submissions').notNull().default(1),
  firstContactAt: timestamp('first_contact_at', { withTimezone: true }).notNull().defaultNow(),
  lastContactAt: timestamp('last_contact_at', { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
