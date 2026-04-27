import { pgTable, uuid, varchar, boolean, timestamp, unique } from 'drizzle-orm/pg-core'
import { submissions } from './submissions'
import { workshops } from './workshops'
import { customers } from './customers'

export const workshopEnrollments = pgTable('workshop_enrollments', {
  id: uuid('id').primaryKey().defaultRandom(),
  submissionId: uuid('submission_id').notNull().references(() => submissions.id, { onDelete: 'cascade' }),
  workshopId: uuid('workshop_id').notNull().references(() => workshops.id, { onDelete: 'cascade' }),
  customerId: uuid('customer_id').references(() => customers.id, { onDelete: 'set null' }),
  enrollmentStatus: varchar('enrollment_status', { length: 30 }).notNull().default('enrolled'),
  certificateUrl: varchar('certificate_url', { length: 500 }),
  certificateSentAt: timestamp('certificate_sent_at', { withTimezone: true }),
  preWorkshopEmailSent: boolean('pre_workshop_email_sent').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  unique('enrollment_unique').on(table.submissionId, table.workshopId),
])
