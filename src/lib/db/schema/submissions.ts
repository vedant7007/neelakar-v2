import { pgTable, uuid, varchar, text, timestamp, inet } from 'drizzle-orm/pg-core'

export const submissions = pgTable('submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: varchar('type', { length: 20 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('new'),

  name: varchar('name', { length: 200 }).notNull(),
  email: varchar('email', { length: 320 }).notNull(),
  phone: varchar('phone', { length: 30 }),
  message: text('message'),

  serviceInterest: varchar('service_interest', { length: 100 }),

  businessName: varchar('business_name', { length: 200 }),
  businessType: varchar('business_type', { length: 100 }),
  budgetRange: varchar('budget_range', { length: 50 }),
  timeline: varchar('timeline', { length: 50 }),
  projectDescription: text('project_description'),

  preferredWorkshop: varchar('preferred_workshop', { length: 100 }),

  adminNotes: text('admin_notes'),
  ipAddress: inet('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  contactedAt: timestamp('contacted_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
})
