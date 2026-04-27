import { pgTable, uuid, varchar, text, timestamp, jsonb } from 'drizzle-orm/pg-core'
import { submissions } from './submissions'
import { customers } from './customers'

export const emailLogs = pgTable('email_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  toEmail: varchar('to_email', { length: 320 }).notNull(),
  toName: varchar('to_name', { length: 200 }),
  subject: varchar('subject', { length: 500 }).notNull(),
  templateType: varchar('template_type', { length: 50 }).notNull(),
  submissionId: uuid('submission_id').references(() => submissions.id, { onDelete: 'set null' }),
  customerId: uuid('customer_id').references(() => customers.id, { onDelete: 'set null' }),
  resendId: varchar('resend_id', { length: 100 }),
  status: varchar('status', { length: 20 }).notNull().default('sent'),
  errorMessage: text('error_message'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
